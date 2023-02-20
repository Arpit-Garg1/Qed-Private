import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import CreateRules from '../create-rules-form/CreateRules';
import { alertMessage, alertTypes, handleFileUpload, imageType, modelTypes, numberGenerator } from '../../../_helperFunctions/HelperFunctions';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import * as AppUtil from '../../../Util/AppUtil';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';
import { useAlert } from 'react-alert';
import * as global from '../../../constants/global';

function CreateModel(props) {
    const alert = useAlert();
    const { modelID, editModelData, getModelList, makeData, setSelectedData } = props;
    const [modelData, setModelData] = useState(null);
    const [makesList, setMakesList] = useState(null);
    const [categoriesList, setCategoriesList] = useState(null);
    const [rulesData, setRulesData] = useState(null);
    const [fileData, setFileData] = useState(null);
    let [imageList, setImageList] = useState(null);
    const [modelRes,setModelRes] = useState(null);
    const [pending,setPending] = useState(null);

    useEffect(() => {
        if (editModelData) {
            setModelData(editModelData);
        } else {
            setModelData(null);
        }
    }, [editModelData]);

    useEffect(() => {
        getMakesList();
        getCategoriesList();
    }, []);

    useEffect(() => {
        if (modelData?.id) {
            getRulesByModelId();
            getAllAttachedFilesList();
        }
    }, [modelData?.id]);

    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getModelList();
        }
        setModelData(null);
        setRulesData(null);
        setFileData(null);
        setImageList(null);
        setSelectedData(null);
    };

    const getMakesList = async () => {
        let variables = {
            pageNo: 0,
            perPageItem: 0
        };
        let request = getRequestForApi(global.GET_MAKE_LIST,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let data = response?.data?.response?.data
                data?.unshift({ name: 'Select Make' });
                setMakesList(data);
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const getCategoriesList = async () => {
        let variables = {
            pageNo: 0,
            perPageItem: 0
        };
        let request = getRequestForApi(global.GET_CATEGORIS_LIST,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let data = response?.data?.response?.data
                data?.unshift({ name: 'Select Category' });
                setCategoriesList(data);
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const createModel = async () => {
        let variables = {
            brandId: modelData?.brandId && !makeData?.id ? parseInt(modelData?.brandId) : makeData?.id,
            categoryId: parseInt(modelData?.categoryId),
            subModel: modelData?.subModel || '',
            name: modelData?.name,
            description: modelData?.description || ''
        }
        let request = getRequestForApi(global.CREATE_MODEL,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let modelId = response?.data?.id;
                if (modelId) {
                    saveImages(modelId);
                    if (rulesData?.id) {
                        createModelRuleById(modelId, rulesData?.id);
                    }
                } else {
                    closeModel(response);
                }
                alert.show(alertMessage.MODEL_CREATE,{type: alertTypes.SUCCESS});
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err', err)
        })
    };

    const createModelRuleById = async (modelId, ruleId) => {
        let variables = {
            id: parseInt(ruleId),
            modelId: parseInt(modelId) || 0,
            assetId: ""
        }
        let request = getRequestForApi(global.CREATE_MODEL_RULE_BY_ID_API,variables,methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response) {
                closeModel(response);
            }
        }).catch((err) => {
            console.log('err', err)
        })
    }

    const updateModel = async () => {
        let variables = {
            id: parseInt(modelData?.id),
            brandId: parseInt(modelData?.brandId),
            categoryId: parseInt(modelData?.categoryId),
            subModel: modelData?.subModel || '',
            name: modelData?.name,
            description: modelData?.description || ''
        }
        let request = getRequestForApi(global.UPDATE_MODEL,variables,methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response) {
                saveImages();
                alert.show(alertMessage.MODEL_UPDATE,{type: alertTypes.SUCCESS});
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err)
        })
    };

    const handleSave = async () => {
        if (modelData?.id) {
            updateModel();
        } else {
            createModel();
        }
    };

    const getRulesByModelId = async () => {
        let variables = {
            modelId: parseInt(modelData?.id) || 0,
            assetId: "",
            moduleName: 'Model'
        }
        let request = getRequestForApi(global.GET_RULES_BY_MODULE_ID,variables,methodType.POST);
        await callHttpRequest(request).then((response) => {
            if (response?.status === 201) {
                let res = response?.data?.response?.data;
                setRulesData(res);
            }
        }).catch((err) => {
            console.log('err', err)
        })
    };

    const fileUpload = async (event, uploadType) => {
        let uploadData = await handleFileUpload(event, modelData?.id, "Model", imageList, uploadType);
        setFileData(uploadData?.uploadFilesData);
        setImageList(uploadData?.imageFilesData);
    };

    const saveImages = async (modelId) => {
        let variables = []
        if (fileData) {
            fileData.forEach((element, index) => {
                element.ordBy = index
            });
            variables = [...fileData];
            variables = variables[0]?.moduleId === '' ?
                variables.map((item) => {
                    return { ...item, moduleId: `${modelId}` }
                }) : fileData;
        }
        let request = getRequestForApi(global.UPLOAD_FILES_API,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                closeModel(response);
            } else {
                console.log('err', response);
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const getAllAttachedFilesList = async () => {
        setPending(true);
        let variables = {
            id: `${modelData?.id}`,
            name: modelData?.assetType || 'Model'
        };
        let request = getRequestForApi(global.GET_ALL_ATTACHMENT_FILES_LIST,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                response.data.forEach(cc => {
                    cc.uploadType = 1
                })
                response.data.sort(function (a, b) {
                    return parseInt(a.ordBy) - parseInt(b.ordBy);
                });
                setImageList([...response.data]);
                setPending(false);
            }
        }).catch((err) => {
            console.log('err', err);
            setPending(false);
        })
    };

    const onDeleteImageClick = (parentMenu, index) => {
        switch (parentMenu.uploadType) {
            case 0:
                imageList.splice(index, 1);
                break;
            case 1:
                parentMenu.uploadType = 2;
                break;
            // case 2:
            //     imageList.splice(oldIndex,1);
            //     break;
        }
        imageList.forEach((element, index) => {
            element.ordBy = index
        });
        setImageList([...imageList]);
        setFileData([...imageList]);
    }

    const onSorEnd = ({ oldIndex, newIndex }) => {
        setImageList(arrayMoveImmutable(imageList, oldIndex, newIndex));
        setFileData(arrayMoveImmutable(imageList, oldIndex, newIndex));
    };

    const SortableItem = SortableElement(({ parentMenu, index }) => (
        <li key={`childMenu-${index * 2}`}>
            <img src={parentMenu?.fileUrl || ''} alt={`${index}image`} />
            <div className="imageHandlers" onClick={() => onDeleteImageClick(parentMenu, index)}>
                <span className="goLeft"><img src={imageType.REMOVE} alt={`${index}remove`} /></span>
            </div>
        </li>
    )
    );

    const SortableList = SortableContainer(({ items }) => {
        return (
            <ul className="imageList" role="tablist">
                {!AppUtil.isListNullOrEmpty(items) ? (
                    items.map((parentMenu, dindex) => {
                        return <>
                            {parentMenu.uploadType !== 2 ?
                                <SortableItem key={`parentMenu-${dindex * 2}`} index={dindex} parentMenu={parentMenu} />
                                : <></>}
                        </>
                    })
                ) : <></>}
            </ul>
        );
    });

    const handleModel = () => {
        setModelRes(numberGenerator());
    };

    return (
        <div className="model" id={modelID}>
            <div className="modelContent">
                <header>
                    <h5>{modelData?.id ? 'Edit Model' : 'New Model'}</h5>
                    <span className="close" onClick={() => closeModel()}>&times;</span>
                </header>
                
                <form action="#">
                <div className="modal-content">
                <p>Complete the form below to {modelData?.id ? 'update this' : 'create a new'} model</p>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="make">Make</label>
                        {makesList && makesList?.length > 0 && !makeData ?
                            <CustomInput fieldType={"select"} setFieldData={setModelData} filedData={modelData} keyName={'brandId'} selectList={makesList} /> :
                            <CustomInput fieldType={"text"} setFieldData={setModelData} filedData={makeData} keyName={'name'} isReadOnly={'true'} />
                        }
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Model Name</label>
                        <CustomInput fieldType={"text"} setFieldData={setModelData} filedData={modelData} keyName={'name'} />
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Submodel">Sub Model</label>
                        <CustomInput fieldType={"text"} setFieldData={setModelData} filedData={modelData} keyName={'subModel'} />
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Category">Category</label>
                        {categoriesList && categoriesList?.length > 0 ?
                            <CustomInput fieldType={"select"} setFieldData={setModelData} filedData={modelData} keyName={'categoryId'} selectList={categoriesList} /> : 
                            <CustomInput fieldType={"text"} setFieldData={setModelData} filedData={modelData} defaultName={'Category not found'} isReadOnly={'true'} />
                        }
                    </div>
                </div>
                <>
                    <div className="imageUploadHoder">
                        {
                            imageList && imageList?.length > 0 ?
                                <SortableList items={imageList} onSortEnd={onSorEnd} axis="xy" distance={1} />
                                : <></>
                        }
                        {pending ? <CustomLoader classType={'loader-Img'}/> : <></>}
                        
                                <div className="fileUploads">
                                    <div className="loading d-none"><img src={imageType.LOAD_GIF} alt="" /></div>
                                    <div id="ddArea">
                                        <span>&#x2912;</span>
                                        Upload multiple images
                                    </div>
                                    <div id="showThumb"></div>
                                    <input name='uploadOption' accept="image/x-png,image/gif,image/jpeg" type="file" className="d-none" id="selectfile" multiple onChange={(event) => fileUpload(event, 0)} />
                                </div>
                         
                    </div>
                </>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Description</label>
                        <CustomInput fieldType={"textarea"} setFieldData={setModelData} filedData={modelData} keyName={'description'} />
                    </div>
                </div>
                <div className="modal-footer">
                <div className="modal-btn">
                        <button className="modal-btn1 openModel" data-rel={modelTypes.CREATE_RULES} type="button" onClick={() => handleModel()}>{rulesData?.id ? 'Edit rules' : 'Create rules'}</button>
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                    
                    <div className="modal-btns">
                        <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                        <button type="button" className={(modelData?.brandId || makeData?.id) && modelData?.categoryId && modelData?.name ? 'btnBlue' : 'disableButton'} onClick={() => handleSave()}>Save Changes</button>
                    </div>
                </div>
                </form>
            </div>

            <CreateRules modelID={modelTypes.CREATE_RULES} modelRes={modelRes} modelIdForRule={modelData?.id} getRulesByModelId={getRulesByModelId} editRules={rulesData} setRules={setRulesData} />

        </div>
    )
}

export default CreateModel