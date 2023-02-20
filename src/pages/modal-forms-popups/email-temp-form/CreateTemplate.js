import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { useAlert } from 'react-alert';
import { alertMessage, alertTypes } from '../../../_helperFunctions/HelperFunctions';
import * as global from '../../../constants/global';

function CreateTemplate(props) {
    const alert = useAlert();
    const { modelID, editTemplateData, getEmailTemplatesList, setSelectedData } = props;
    const [templateData, setTemplateData] = useState(null);
    const [templateFor, setTemplateFor] = useState(null);

    const templateOptions = [
        {
            name: 'Select Template For'
        },
        {
            id: 'INVITE',
            name: 'Invite'
        },
        {
            id: 'RESETPASSWORD',
            name: 'Reset Password'
        },
        {
            id: 'ACCEPTINVITE',
            name: 'Accept Invite'
        },
        {
            id: 'TOKENTRANSFER',
            name: 'Asset Transfer'
        }
    ];

    useEffect(() => {
        if (editTemplateData) {
            setTemplateData(editTemplateData);
        } else {
            setTemplateData(null);
        }
    }, [editTemplateData]);

    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getEmailTemplatesList();
        }
        setTemplateData(null);
        setSelectedData(null);
    };

    const createEmailTemplate = async () => {
        let variables = {
            templateFor: templateFor?.id || "",
            subject: templateData?.subject || '',
            mailBody: templateData?.mailBody || ''
        };
        let request = getRequestForApi(global.CREATE_EMAIL_TEMPLATE,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.EMAIL_TEMPLATE_CREATE,{type: alertTypes.SUCCESS});
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err', err)
        })
    };

    const updateEmailTemplate = async () => {
        let variables = {
            id: templateData?.id,
            subject: templateData?.subject || '',
            mailBody: templateData?.mailBody || ''
        };
        let request = getRequestForApi(global.UPDATE_EMAIL_TEMPLATE,variables,methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.EMAIL_TEMPLATE_UPDATE,{type: alertTypes.SUCCESS});
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err', err)
        })
    };

    const handleSubmit = () => {
        if (templateData?.id) {
            updateEmailTemplate();
        } else {
            createEmailTemplate();
        }
    };
    
    return (
        <div className="model" id={`${modelID}`}>
            <div className="modelContent">
                <header>
                    <h5>{templateData?.id ? 'Edit Email Template' : 'Create Email Template'}</h5>
                </header>
                <form action="#">
                <div className="modal-content">
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Template For</label>
                        {templateData?.id ? <CustomInput fieldType={"text"} setFieldData={setTemplateData} filedData={templateData} defaultName={templateData?.templateFor} isReadOnly={'true'}/>:
                        <CustomInput fieldType={"select"} setFieldData={setTemplateFor} filedData={templateFor} keyName={'id'} selectList={templateOptions} />}
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Subject</label>
                        <CustomInput fieldType={"text"} setFieldData={setTemplateData} filedData={templateData} keyName={'subject'} />
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Mail Body</label>
                        <CustomInput fieldType={"textarea"} setFieldData={setTemplateData} filedData={templateData} keyName={'mailBody'} />
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                    <div className="modal-btns">
                        <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                        <button type="button" className={!templateData?.subject && !templateData?.mailBody ? 'disableButton' : 'btnBlue'} onClick={() => handleSubmit()}>Save Changes</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTemplate