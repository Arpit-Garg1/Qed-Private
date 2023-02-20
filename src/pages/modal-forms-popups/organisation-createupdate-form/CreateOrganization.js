import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { alertMessage, alertTypes } from '../../../_helperFunctions/HelperFunctions';
import { useAlert } from 'react-alert';
import * as global from '../../../constants/global';

function CreateOrganization(props) {
    const alert = useAlert();
    const { modelID, editOrganizationData, getOrganizationList, setSelectedData } = props;
    const [organizationData, setOrganizationData] = useState(null);

    useEffect(() => {
        if (editOrganizationData) {
            setOrganizationData(editOrganizationData)
        } else {
            setOrganizationData(null);
        }
    }, [editOrganizationData]);

    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getOrganizationList();
        }
        setOrganizationData(null);
        setSelectedData(null);
    };

    const createOrganization = async () => {
        let variables = {
            type: "Manufacturer",
            name: organizationData?.name || ''
        };
        let request = getRequestForApi(global.CREATE_ORGANIZATION,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.ORGANIZATION_CREATE,{type: alertTypes.SUCCESS});
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err', err)
        })
    };

    const updateOrganization = async () => {
        let variables = {
            id: organizationData?.id,
            name: organizationData?.name || ''
        };
        let request = getRequestForApi(global.UPDATE_ORGANIZATION,variables,methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.ORGANIZATION_UPDATE,{type: alertTypes.SUCCESS});
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err', err)
        })
    };

    const handleSubmit = () => {
        if (organizationData?.id) {
            updateOrganization();
        } else {
            createOrganization();
        }
    };
    return (
        <div className="model" id={`${modelID}`}>
            <div className="modelContent">
                <header>
                    <h5>{organizationData?.id ? 'Edit Organization' : 'Create Organization'}</h5>
                </header>
                <form action="#">
                <div className="modal-content">
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Organization Type</label>
                        <CustomInput fieldType={"text"} setFieldData={setOrganizationData} filedData={organizationData} defaultName={'Manufacturer'} isReadOnly={'true'} />
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Organization Name</label>
                        <CustomInput fieldType={"text"} setFieldData={setOrganizationData} filedData={organizationData} keyName={'name'} />
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                    <div className="modal-btns">
                        <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                        <button type="button" className={!organizationData ? 'disableButton' : 'btnBlue'} onClick={() => handleSubmit()}>Save Changes</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default CreateOrganization