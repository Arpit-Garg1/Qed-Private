import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { useAlert } from 'react-alert';
import { alertMessage, alertTypes } from '../../../_helperFunctions/HelperFunctions';
import * as DateUtil from '../../../Util/DateUtil'
import * as global from '../../../constants/global';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';

function CreateRules(props) {
    const alert = useAlert();
    const { modelID, modelRes, editRules, modelIdForRule, assetIdForRule, getRulesByModelId, setRules, assetData, viewOnlyType, setSelectedData } = props;
    const [rulesData, setRulesData] = useState(null);
    const [pending, setPending] = useState(null);

    useEffect(() => {
        if (editRules?.id) {
            console.log('first')
            getRulesById(editRules?.id)
        } else {
            setRulesData(null);
        }
    }, [editRules, modelRes]);

    const closeModel = (data) => {
        $(`#${modelID}`).hide();
        setRulesData(null);
        if (data) {
            setRulesData(data?.data);
            setRules(data?.data);
        };
        if (setSelectedData) {
            setSelectedData(null);
        };
    };

    const getRulesById = async (ruleId) => {
        setPending(true);
        let variables = {
            id: ruleId
        }
        let request = getRequestForApi(global.GET_RULES_BY_ID, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                setRulesData(response?.data);
            }
            setPending(false);
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
        })
    };

    const createRules = async () => {
        let variables = {
            modelId: modelIdForRule || 0,
            assetId: assetIdForRule || '',
            numberOfDays: parseInt(rulesData?.numberOfDays) || 0,
            beforDays: parseInt(rulesData?.beforDays) || 0,
            afterDays: parseInt(rulesData?.afterDays) || 0,
            afterDate: rulesData?.afterDate || ''
        }
        let request = getRequestForApi(global.CREATE_MODEL_RULES_API, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                alert.show(alertMessage.RULE_CREATE, { type: alertTypes.SUCCESS });
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err)
        })
    };

    const updateRules = async () => {
        let variables = {
            id: parseInt(rulesData?.id),
            numberOfDays: parseInt(rulesData?.numberOfDays) || 0,
            beforDays: parseInt(rulesData?.beforDays) || 0,
            afterDays: parseInt(rulesData?.afterDays) || 0,
            afterDate: DateUtil.getDisplayDateFormat(rulesData?.afterDate) || ''
        }

        let request = getRequestForApi(global.UPATE_MODEL_RULES_API, variables, methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.RULE_UPDATE, { type: alertTypes.SUCCESS });
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err)
        })
    };

    const handleSave = () => {
        if (rulesData?.id) {
            updateRules();
        } else {
            createRules();
        }
    };

    return (
        <>
            {pending ? <CustomLoader /> : <></>}
            <div className="model" id={modelID}>
                <div className="modelContent">
                    <header>
                        <h5>{viewOnlyType ? 'View Rules' : rulesData?.id ? 'Edit Rules' : 'Create Rules'}</h5>
                        <span className="close" onClick={() => closeModel()}>&times;</span>
                    </header>
                    <form action="#">
                    <div className="modal-content">
                    {!rulesData && assetData?.tokenId ? <div className="fields">
                        <div className="field">
                            <label htmlFor="numberOfDays">No Rules Found </label>
                        </div>
                    </div> : <>
                        <div className="fields">
                            <div className="field">
                                <label htmlFor="numberOfDays">Void after x no. of transfers</label>
                                <CustomInput fieldType={"number"} setFieldData={setRulesData} filedData={rulesData?.numberOfDays !== 0 ? rulesData : ''} keyName={'numberOfDays'} isReadOnly={viewOnlyType ? 'true' : 'false'} />
                            </div>
                        </div>
                        <div className="fields">
                            <div className="field">
                                <label htmlFor="beforDays">Void if transferred before x number of days</label>
                                <CustomInput fieldType={"number"} setFieldData={setRulesData} filedData={rulesData?.beforDays !== 0 ? rulesData : ''} keyName={'beforDays'} isReadOnly={viewOnlyType ? 'true' : 'false'} />
                            </div>
                        </div>
                        <div className="fields">
                            <div className="field">
                                <label htmlFor='afterDays'>Void after x number of days</label>
                                <CustomInput fieldType={"number"} setFieldData={setRulesData} filedData={rulesData?.afterDays !== 0 ? rulesData : ''} keyName={'afterDays'} isReadOnly={viewOnlyType ? 'true' : 'false'} />
                            </div>
                        </div>
                        <div className="fields">
                            <div className="field">
                                <label htmlFor='afterDate'>Void after x date</label>
                                {viewOnlyType ?
                                    <CustomInput fieldType={"text"} defaultName={DateUtil.getRulesDisplayDateFormat(rulesData?.afterDate)} setFieldData={setRulesData} isReadOnly={viewOnlyType ? 'true' : 'false'} /> :
                                    <CustomInput fieldType={"date"} setFieldData={setRulesData} filedData={rulesData?.afterDate !== 0 ? rulesData : ''} keyName={'afterDate'} isReadOnly={viewOnlyType ? 'true' : 'false'} />
                                }
                            </div>
                        </div></>}
                        </div>
                    <div className="modal-footer">
                        <div className="modal-btns">
                            <button type="button" className='btnGrey' onClick={() => closeModel()}>Cancel</button>
                            {!viewOnlyType ?
                                <button type="button" className={rulesData?.numberOfDays || rulesData?.beforDays || rulesData?.afterDays || rulesData?.afterDate ? 'btnBlue' : 'disableButton'} onClick={() => handleSave()}>Save Changes</button> :
                                <></>}
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateRules