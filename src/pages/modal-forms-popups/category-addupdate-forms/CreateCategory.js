import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { useAlert } from 'react-alert';
import { alertMessage, alertTypes } from '../../../_helperFunctions/HelperFunctions';
import * as global from '../../../constants/global';

function CreateCategory(props) {
    const alert = useAlert();
    const { modelID, editCategoryData, getCategoriesList, setSelectedData } = props;
    const [categoryData, setCategoryData] = useState(null);

    useEffect(() => {
        if (editCategoryData) {
            setCategoryData(editCategoryData)
        } else {
            setCategoryData(null);
        }
    }, [editCategoryData])

    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getCategoriesList();
        }
        setCategoryData(null);
        setSelectedData(null);
    };

    const createCategory = async () => {
        let variables = {
            name: categoryData['name'] || '',
            description: categoryData['description'] || ''
        };
        let request = getRequestForApi(global.CREATE_CATEGORY,variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.CATEGORY_CREATE, { type: alertTypes.SUCCESS });
                closeModel(response);
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err)
        });
    };

    const updateCategory = async () => {
        let variables = {
            id: categoryData['id'],
            name: categoryData['name'] || '',
            description: categoryData['description'] || ''
        };
        let request = getRequestForApi(global.UPDATE_CATEGORY,variables, methodType.PUT);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.CATEGORY_UPDATE, { type: alertTypes.SUCCESS });
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err)
        });
    };

    const handleSubmit = () => {
        if (categoryData && categoryData['id']) {
            updateCategory()
        } else {
            createCategory()
        }
    }

    return (
        <div className="model" id={`${modelID}`}>
            <div className="modelContent">
                <header>
                    <h5>{categoryData?.id ? 'Edit Category' : 'Create New Category'}</h5>
                </header>
                <form action="#">
                <div className="modal-content">
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Name</label>
                        <CustomInput fieldType={"text"} setFieldData={setCategoryData} filedData={categoryData} keyName={'name'} />
                    </div>
                </div>

                <div className="fields">
                    <div className="field">
                        <label htmlFor="Model name">Description</label>
                        <CustomInput fieldType={"textarea"} setFieldData={setCategoryData} filedData={categoryData} keyName={'description'} />
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                    <div className="modal-btns">
                        <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                        <button type="button" className={!categoryData ? 'disableButton' : categoryData?.name && categoryData?.description ? 'btnBlue' : 'disableButton'} onClick={() => handleSubmit()}>Save Changes</button>
                    </div>
                </div>

                </form>
            </div>
        </div>
    )
}

export default CreateCategory