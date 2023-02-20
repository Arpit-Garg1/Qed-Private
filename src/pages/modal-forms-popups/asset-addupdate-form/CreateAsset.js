import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import CreateRules from '../create-rules-form/CreateRules';
import TokenConfirmation from '../../../customUI/token-confirmation/TokenConfirmation';
import { alertMessage, alertTypes, modelTypes, numberGenerator, writeXLSFileFromJson } from '../../../_helperFunctions/HelperFunctions';
import { useAlert } from 'react-alert';
import * as AppUtil from '../../../Util/AppUtil'
import { read, utils } from 'xlsx';
import * as global from '../../../constants/global';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';

function CreateAsset(props) {
    const alert = useAlert();
    const { modelID, editAssetData, getAssetList, modelData, setSelectedData, setTokenFilterType } = props;
    let [assetData, setAssetData] = useState(null);
    const [makesList, setMakesList] = useState(null);
    const [pending, setPending] = useState(null);
    const [modelsList, setModelsList] = useState(null);
    const [rulesData, setRulesData] = useState(null);
    const [UploadType, setUploadType] = useState('Single');
    const [generateToken, setGenerateToken] = useState(false);
    const [confirmationAlert, setConfirmationAlert] = useState(false);
    const [isBulkApiResponseReceived, setBulkApiResponseReceived] = useState(false);
    const [modelRes, setModelRes] = useState(null);
    const [bulkDataList, setBulkDataList] = useState(null);

    useEffect(() => {
        if (editAssetData) {
            setAssetData(editAssetData);
        } else {
            setAssetData(null);
            setRulesData(null);
        }
        // fileUpload();
    }, [editAssetData]);

    useEffect(() => {
        getMakesList();
    }, []);

    useEffect(() => {
        if (assetData?.brandId || modelData?.Brand?.id) {
            if (modelData?.Brand?.id) {
                if (!assetData) {
                    assetData = {};
                    assetData.brandId = modelData?.Brand?.id;
                    setAssetData({ ...assetData })
                }
            }
            getModelsList();
        }
    }, [assetData?.brandId, modelData?.Brand?.id])

    useEffect(() => {
        if (assetData?.modelId) {
            getRulesByModelId();
        }
    }, [assetData?.modelId]);

    const closeModel = (data) => {
        if (data) {
            getAssetList();
            setPending(false);
        }
        $('.model').fadeOut();
        setAssetData(null);
        setRulesData(null);
        setModelsList(null);
        setGenerateToken(false);
        setBulkApiResponseReceived(false)
        setUploadType('Single');
        setBulkDataList(null);
        if (setSelectedData) {
            setSelectedData(null);
        }
    };

    const getMakesList = async () => {
        let variables = {
            pageNo: 0,
            perPageItem: 0
        };
        let request = getRequestForApi(global.GET_MAKE_LIST, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let data = response?.data?.response?.data
                data.unshift({ name: 'Select Make' })
                setMakesList(data)
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const getModelsList = async () => {
        let variables = {}

        if (assetData?.brandId) {
            variables.id = parseInt(assetData?.brandId)
        } else {
            variables.id = parseInt(modelData?.Brand?.id)
        }

        let request = getRequestForApi(global.GET_MODEL_BY_MAKE_ID, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            let data = response?.data
            if (data) {
                data.unshift({ name: 'Select Model' })
                setModelsList(data)
                if (modelData?.Brand?.id) {
                    let currentmodelData = data?.filter(mData => mData.id == modelData.id)[0];
                    if (currentmodelData) {
                        // assetData.modelId = currentmodelData.id;
                        setAssetData({ ...assetData, modelId: currentmodelData.id });
                    }
                }
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const createAsset = async () => {
        setPending(true);
        let request = {};
        setBulkApiResponseReceived(false);
        if (UploadType === 'Single') {
            let variables = {
                serialNo: assetData?.serialNo || '',
                sku: assetData?.sku || '',
                upcCode: assetData?.upcCode || '',
                type: assetData?.type || 'Asset',
                name: assetData?.name || '',
                brandId: parseInt(assetData?.brandId) || 0,
                modelId: parseInt(assetData?.modelId) || 0,
                subModel: assetData?.subModel || '',
                description: assetData?.description || ''
            }
            request = getRequestForApi(global.CREATE_ASSET, variables, methodType.POST);
        } else if (UploadType === 'Bulk') {
            let variables = []
            bulkDataList.forEach(element => {
                let obj = {
                    serialNo: element?.serialNo || '',
                    sku: assetData?.sku || '',
                    upcCode: element?.upcCode || '',
                    type: assetData?.type || 'Asset',
                    name: assetData?.name || '',
                    brandId: parseInt(assetData?.brandId) || 0,
                    modelId: parseInt(assetData?.modelId) || 0,
                    subModel: assetData?.subModel,
                    description: element?.description || '',
                    // uid: newId
                }
                variables.push(obj)
            });
            request = getRequestForApi(global.CREATE_BULK_ASSET, variables, methodType.POST);
        } else {
            let variables = {
                brandId: parseInt(assetData?.brandId) || 0,
                modelId: parseInt(assetData?.modelId) || 0,
                subModel: assetData?.subModel || '',
                description: assetData?.description || '',
                noOfAssets: parseInt(assetData?.noOfAssets) || 0
            }
            request = getRequestForApi(global.BULK_ASSET_AUTO_GENERATE, variables, methodType.POST);
        };

        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let res = response?.data;
                let variables = {
                    id: parseInt(rulesData?.id),
                    modelId: 0,
                    assetId: res?.product?.id || ''
                };
                if (UploadType === 'Single') {
                    setBulkApiResponseReceived(false);
                    handleAssetsSuccess(res?.product?.id, variables, response);
                    alert.show(alertMessage.ASSET_CREATE, { type: alertTypes.SUCCESS });
                } else if (UploadType === 'Bulk') {
                    setBulkDataList([...res.response.data]);
                    setBulkApiResponseReceived(true);
                    getAssetList();
                    setPending(false);
                } else {
                    setBulkApiResponseReceived(false);
                    closeModel(response);
                    alert.show(alertMessage.ASSET_CREATE, { type: alertTypes.SUCCESS });
                };
                if (setTokenFilterType) {
                    setTokenFilterType(null);
                }
            };
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
            console.log('err', err)
        })
    };

    const updateAsset = async () => {
        setPending(true);
        let variables = {
            assetIndex: assetData?.assetIndex,
            sku: assetData?.sku || '',
            upcCode: assetData?.upcCode || '',
            type: assetData?.type || 'Asset',
            subModel: assetData?.subModel || '',
            description: assetData?.description || '',
            serialNo: assetData?.serialNo || '',
        }
        let modelRuleVariables = {
            id: parseInt(rulesData?.id),
            modelId: 0,
            assetId: assetData?.id || ''
        };
        let request = getRequestForApi(global.UPATE_ASSET, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                alert.show(alertMessage.ASSET_UPDATE, { type: alertTypes.SUCCESS });
                handleAssetsSuccess(assetData?.id, modelRuleVariables, response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
            console.log('err', err)
        })
    };

    const handleAssetsSuccess = (assetId, variables, response) => {
        if (assetId && rulesData?.id) {
            createModelRuleById(variables);
        } else if (assetId && generateToken) {
            createAssetTokenCreate(assetId);
        } else {
            closeModel(response);
        };
    };

    const handleSave = async () => {
        if (!assetData?.tokenId) {
            setConfirmationAlert(true);
        } else {
            handleAssets();
        }
    };

    const handleAssets = async () => {
        if (assetData?.id) {
            updateAsset();
        } else {
            createAsset();
        }
    };

    const getRulesByModelId = async () => {
        let variables = {
            modelId: assetData?.assetIndex ? 0 : parseInt(assetData?.modelId),
            assetId: assetData?.id || "",
            moduleName: 'Asset'
        }
        let request = getRequestForApi(global.GET_RULES_BY_MODULE_ID, variables, methodType.POST);
        await callHttpRequest(request).then((response) => {
            if (response?.status === 201) {
                let res = response?.data?.response?.data;
                setRulesData(res);
            }
        }).catch((err) => {
            console.log('err', err)
        })
    };

    const createModelRuleById = async (variables) => {
        let request = getRequestForApi(global.CREATE_MODEL_RULE_BY_ID_API, variables, methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response && generateToken) {
                createAssetTokenCreate(variables?.assetId);
            } else {
                closeModel(response);
            }
        }).catch((err) => {
            console.log('err', err)
        })
    };

    const createAssetTokenCreate = async (assetId) => {
        let variables = {
            id: assetId
        }

        let request = getRequestForApi(global.CREATE_ASSET_TOKEN, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                applyRuleOnAsset(assetId);
            }
        }).catch((err) => {
            console.log('err', err)
        })
    };

    const applyRuleOnAsset = async (assetId) => {
        let variables = {
            assetId: assetId
        }

        let request = getRequestForApi(global.APPLY_RULE_ON_ASSET, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                closeModel(response);
            }
        }).catch((err) => {
            console.log('err', err)
        })
    };

    const handleModel = () => {
        setModelRes(numberGenerator());
    };

    const sampleFileDownload = async () => {
        // const url = window.URL.createObjectURL(
        //     new Blob([urlFile]),
        //   );
        //   const link = document.createElement('a');
        //   link.href = url;
        //   link.setAttribute(
        //     'download',
        //     filename,
        //   );
        //   document.body.appendChild(link);
        //   link.click();
        //   link.parentNode.removeChild(link)
        let jsonArray = [{ 'serialNo': 101010, 'upcCode': 979, 'description': 'Test1' }, { 'serialNo': 101011, 'upcCode': 980, 'description': 'Test2' }, { 'serialNo': 101012, 'upcCode': 981, 'description': 'Test3' }];
        writeXLSFileFromJson(jsonArray, 'QEDVault_Example.xlsx');
    }

    const fileUpload = async (files) => {
        if (!AppUtil.isListNullOrEmpty(files.target.files)) {
            let filesData = files.target.files[0];
            const f = await (filesData).arrayBuffer();
            const wb = read(f);
            const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            setBulkDataList([...data]);
        }
    };

    const onCheckBoxClick = (value) => {
        setUploadType(value)
        if (value !== 'Single') {
            setGenerateToken(false);
            setBulkDataList(undefined);
        }
    }

    const downloadUploadedFile = () => {
        writeXLSFileFromJson(bulkDataList, 'QEDValt_Uploaed_Status.xlsx')
        closeModel();
    }

    const enableDisableSaveButton = () => {
        return (UploadType ? ((assetData?.brandId || modelData?.id) && assetData?.modelId) : (!AppUtil.isListNullOrEmpty(bulkDataList) && !isBulkApiResponseReceived) ? true : false)
    };

    const getDefaultName = () => {
        let name = '';
        if (modelData?.name) {
            name = modelData?.name;
        } else if (!assetData?.id) {
            name = 'Select Model';
        } else {
            name = assetData?.Model?.name;
        }
        return name;
    };

    return (
        <>{pending ? <CustomLoader /> : <></>}
            <div className="model" id={`${modelID}`}>
                <div className="modelContent">
                    <header >
                        <h5>{assetData?.id ? 'Edit Asset' : 'New Asset'}</h5>
                        <span className="close" onClick={() => closeModel()}>&times;</span>
                    </header>
                    <form >
                    <div className="modal-content">
                        <fieldset className="fieldset" disabled={isBulkApiResponseReceived}>
                            <div className="fields">
                                <div className="field">
                                    <label htmlFor="make">Make</label>
                                    {makesList && makesList?.length > 0 && !assetData?.id && !modelData?.Brand?.name ?
                                        <CustomInput fieldType={"select"} setFieldData={setAssetData} filedData={assetData} keyName={'brandId'} selectList={makesList} /> :
                                        <CustomInput fieldType={"text"} setFieldData={setAssetData} filedData={assetData} defaultName={!modelData?.Brand?.name ? assetData?.Brand?.name : modelData?.Brand?.name} isReadOnly={'true'} />
                                    }
                                </div>
                            </div>
                            <div className="fields">
                                <div className="field">
                                    <label htmlFor="make">Model</label>
                                    {modelsList && modelsList?.length > 0 && !assetData?.id && !modelData?.name ?
                                        <CustomInput fieldType={"select"} setFieldData={setAssetData} filedData={assetData} keyName={'modelId'} selectList={modelsList} /> :
                                        <CustomInput fieldType={"text"} setFieldData={setAssetData} filedData={assetData} defaultName={getDefaultName()} isReadOnly={'true'} />
                                    }
                                </div>
                            </div>
                            {!assetData?.assetIndex ?
                                <div className="fields">
                                    <div className="field">
                                        <label htmlFor="Serial number">Upload Options</label>
                                        <div className="radio-button">
                                            <span className='radiobtn'>
                                                <input type="radio" name="upload" checked={UploadType.toString() === 'Single'} value={'Single'} onClick={() => onCheckBoxClick('Single')} />Single
                                            </span>
                                            <span className='radiobtn bulk'>
                                                <input type="radio" name="upload" disabled={!assetData?.modelId} checked={UploadType.toString() === 'Bulk'} value={'Bulk'}
                                                    onClick={() => { onCheckBoxClick('Bulk') }}
                                                />Bulk
                                                <span className='info' data-tooltip={alertMessage.BULK_UPLOAD}><span className='ellipsis'>&#8505;</span></span>
                                            </span>
                                            <span className='radiobtn bulk'>
                                                <input type="radio" name="upload" disabled={!assetData?.modelId} checked={UploadType.toString() === 'AutogenerateBulk'} value={'AutogenerateBulk'}
                                                    onClick={() => { onCheckBoxClick('AutogenerateBulk') }}
                                                />Autogenerate(Bulk)
                                                <span className='info' data-tooltip={alertMessage.AUTO_GENERATE_BULK}><span className='ellipsis'>&#8505;</span></span>
                                            </span>
                                        </div>
                                    </div>
                                </div> : <></>}

                            {UploadType === 'Single' ? <>
                                {!assetData?.tokenId ? <div className="fields">
                                    <div className="field">
                                        <label htmlFor="Generate Token">
                                            <input type="checkbox" checked={generateToken} onChange={() => setGenerateToken(!generateToken)} /> Generate Token
                                        </label>
                                        {generateToken ? <h5 className='warninig'>Note: {alertMessage.ASSET_TOKEN_CREATION}</h5> : <></>}
                                    </div>
                                </div> : <></>}
                                <div className="fields">
                                    <div className="field">
                                        <label htmlFor="Serial number">Serial Number</label>
                                        {!assetData?.tokenId ? <CustomInput fieldType={"text"} setFieldData={setAssetData} filedData={assetData} keyName={'serialNo'} /> :
                                            <CustomInput fieldType={"text"} setFieldData={setAssetData} filedData={assetData} defaultName={assetData?.serialNo} isReadOnly={'true'} />}
                                    </div>
                                </div>
                                <div className="fields">
                                    <div className="field">
                                        <label htmlFor="Serial number">UPC Code</label>
                                        {!assetData?.tokenId ?
                                            <CustomInput fieldType={"text"} setFieldData={setAssetData} filedData={assetData} keyName={'upcCode'} /> :
                                            <CustomInput fieldType={"text"} setFieldData={setAssetData} filedData={assetData} defaultName={assetData?.upcCode} isReadOnly={'true'} />
                                        }
                                    </div>
                                </div>
                                <div className="fields">
                                    <div className="field">
                                        <label htmlFor="Model name">Description</label>
                                        <CustomInput fieldType={"textarea"} setFieldData={setAssetData} filedData={assetData} keyName={'description'} />
                                    </div>
                                </div>
                            </> : UploadType === 'Bulk' ? <>
                                {!isBulkApiResponseReceived ? <>
                                    <div className="fields">
                                        <div className="field">
                                            <label htmlFor="Serial number">
                                                <a href="javascript:void(0);" onClick={() => sampleFileDownload()} >click here</a> to download sample</label>
                                        </div>
                                    </div>
                                    <div className="fields">
                                        <div className="field">
                                            <label htmlFor="selectfile">Choose File to upload file</label>
                                            <div className="modal-btn">
                                                <input name='selectfile' type="file" id="selectfile" accept=".xlsx" onChange={(event) => fileUpload(event)} />
                                                {/* <button className="modal-btn1 openModel" data-rel="" type="button">Upload File</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="fields">
                                        <div className="field">
                                            <label htmlFor="Serial number">
                                                <a href="javascript:void(0);" onClick={() => downloadUploadedFile()} >click here</a> to download Uploaded Status:</label>
                                        </div>
                                    </div>
                                </>}
                            </> : <div className="fields">
                                <div className="field">
                                    <label htmlFor='afterDays'>Number of assets to be created</label>
                                    <CustomInput fieldType={"number"} setFieldData={setAssetData} filedData={assetData} keyName={'noOfAssets'} />
                                </div>
                            </div>}
                        </fieldset>
                        <div className="modal-footer">
                            {UploadType === 'Single' ? <div className="modal-btn">
                                <button className="modal-btn1 openModel" data-rel={modelTypes.CREATE_ASSET_RULES} type="button" onClick={() => handleModel()}>{assetData?.tokenId ? 'View rules' : rulesData?.id ? 'Edit rules' : 'Create rules'}</button>
                            </div> : <></>}
                            </div>
                        </div>
                        <div className="modal-footer">
                           
                            <div className="modal-btns">
                                <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                                <button type="button" className={enableDisableSaveButton() ? 'btnBlue' : 'disableButton'} onClick={() => handleSave()}>Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>

                <CreateRules modelID={modelTypes.CREATE_ASSET_RULES} modelRes={modelRes} assetIdForRule={assetData?.id} assetData={assetData} getRulesByModelId={getRulesByModelId} editRules={rulesData} setRules={setRulesData} viewOnlyType={assetData?.tokenId ? true : false}/>

                <TokenConfirmation modelID={modelTypes.TOKEN_CONFIRMATION} generateToken={generateToken} assetId={assetData?.id} confirmationAlert={confirmationAlert} setConfirmationAlert={setConfirmationAlert} setGenerateToken={setGenerateToken} handleAssets={handleAssets} /> :
            </div>
        </>
    )
}


export default CreateAsset