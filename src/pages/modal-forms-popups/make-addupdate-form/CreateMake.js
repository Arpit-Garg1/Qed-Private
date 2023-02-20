import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { useAlert } from 'react-alert';
import { alertMessage, alertTypes } from '../../../_helperFunctions/HelperFunctions';
import * as global from '../../../constants/global';

function CreateMake(props) {
    const alert = useAlert();
    const { modelID, editMakeData, getMakesList, setSelectedData } = props;
    const [makeData, setMakeData] = useState(null);

    useEffect(() => {
        if (editMakeData) {
            setMakeData(editMakeData)
        } else {
            setMakeData(null);
        }
    }, [editMakeData])

    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getMakesList();
        }
        setMakeData(null);
        setSelectedData(null);
    };

    const createMake = async () => {
        let variables = {
            name: makeData['name'] || '',
            description: makeData['description'] || ''
        };
        let request = getRequestForApi(global.CREATE_MAKE,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.MAKE_CREATE,{type: alertTypes.SUCCESS});
                closeModel(response);
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err', err)
        });
    };

    const updateMake = async () => {
        let variables = {
            id: makeData['id'],
            name: makeData['name'] || '',
            description: makeData['description'] || ''
        };
        let request = getRequestForApi(global.UPDATE_MAKE,variables,methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.MAKE_UPDATE,{type: alertTypes.SUCCESS});
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err', err)
        });
    };

    const handleSubmit = () => {
        if (makeData && makeData['id']) {
            updateMake()
        } else {
            createMake()
        }
    };

    return (
        <div className="model" id={`${modelID}`}>
            <div className="modelContent">
                <header>
                    <h5>{makeData?.id ? 'Edit Make' : 'New Make'}</h5>
                </header>
                <form action="#">
                <div className="modal-content">
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Name</label>
                        <CustomInput fieldType={"text"} setFieldData={setMakeData} filedData={makeData} keyName={'name'} />
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Description</label>
                        <CustomInput fieldType={"textarea"} setFieldData={setMakeData} filedData={makeData} keyName={'description'} />
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                    <div className="modal-btns">
                        <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                        <button type="button" className={makeData?.name && makeData?.description ? 'btnBlue' : 'disableButton'} onClick={() => handleSubmit()}>Save Changes</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default CreateMake