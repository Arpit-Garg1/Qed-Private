import React, { useEffect, useState } from 'react'
import ConfirmationPopup from '../../customUI/confirmation-popup/ConfirmationPopup';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import CreateCategory from '../modal-forms-popups/category-addupdate-forms/CreateCategory';
import $ from 'jquery';
import CommonMainContent from '../../customUI/common-main-content/CommonMainContent';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import { alertMessage, alertTypes, exportFinalArray, headerNames, modelTypes } from '../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../Util/AppUtil'
import * as global from '../../constants/global';
import { useAlert } from 'react-alert';

function Categories() {
    const alert = useAlert();
    const [categoriesList, setCategoriesList] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [pending, setPending] = useState(null);
    const [popupId, setPopupId] = useState(null);

    const getCategoriesList = async (page, maxRows, filerText, filterColumns) => {
        setPending(true);
        let variables = {
            pageNo: page || PAGE_NUMBER,
            perPageItem: maxRows || MAX_ITEM_PER_PAGE,
            name: filerText,
            filterColumns: filterColumns,
        };
        callGetApi(variables)
    };

    const callGetApi = async (variables) => {
        let request = getRequestForApi(global.GET_CATEGORIS_LIST, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                setCategoriesList(response?.data?.response);
                setPending(false);
            } else {
                console.log("err", response);
                setPending(false);
            }
        }).catch((err) => {
            console.log('err', err);
            setPending(false);
        });
    }

    const closeModel = () => {
        $('.model').fadeOut();
        getCategoriesList();
        setSelectedData(null);
    };

    const deleteCategory = async () => {
        let variables = {
            id: selectedData?.id
        };

        let request = getRequestForApi(global.UPDATE_CATEGORY, variables, methodType.DELETE);
        await callHttpRequest(request).then(response => {
            if (response?.status === 200) {
                alert.show(alertMessage.CATEGORY_DELETE, { type: alertTypes.SUCCESS });
                closeModel();
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    }

    const onAddClick = (row, id) => {
        setSelectedData(row);
        setPopupId(id);
    };

    const usersListColumns = [
        {
            name: <th>Name</th>,
            selector: row => row.name,
            sortable: true,
            width: '200px'
        },
        {
            name: <th>Description</th>,
            selector: row => row.description,
            sortable: true,
            width: '700px',
            cell: row => (<span data-tooltip={row?.description}><span className='ellipsis'>{row?.description}</span></span>)
        },
        {
            name: <th></th>,
            selector: row => row.id,
            cell: row => (
                <td className="actionbutton">
                    <div className="hasDropdown">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical" color="rgba(107, 114, 128, 1)" pointerEvents="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span>

                        <div className="dropDown">
                            <ul className="dropdown">
                                <li><a className="openModel" data-rel={modelTypes.CREATE_CATEGORY} onClick={() => onAddClick(row, modelTypes.CREATE_CATEGORY)}>Edit</a></li>
                                {parseInt(row?._count?.Models) === 0 ? <li><a className="openModel" data-rel={modelTypes.DELETE_CATEGORY} onClick={() => onAddClick(row, modelTypes.DELETE_CATEGORY)}>Delete</a></li> : <></>}
                            </ul>
                        </div>
                    </div>
                </td>
            ),
            width: '60px',
        }
    ];


    const onClickEvent = (pageNo, perPageItem, filterText, filterColumns) => {
        getCategoriesList(pageNo, perPageItem, filterText, filterColumns)
    }

    const onExportAllClick = async (value, filterColumns) => {
        let variables = {
            pageNo: 0,
            perPageItem: 0,
            name: `${value}`,
            filterColumns: filterColumns
        };
        let request = getRequestForApi(global.GET_CATEGORIS_LIST, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                exportFinalArray(response?.data?.response.data, ['name', 'description'], undefined, 'QEDValt_Category_Data.xlsx')
            }
            setPending(false);
        }).catch((err) => {
            setPending(false);
        });
    }

    return (
        <>
            {/* common main content form starts */}
            <CommonMainContent headerName={headerNames.CATEGORIES} onAddClick={onAddClick} dataList={categoriesList} columnsList={usersListColumns} modelID={modelTypes.CREATE_CATEGORY} getApiDataList={getCategoriesList} pending={pending} onClickEvent={onClickEvent} onExportAllClick={!AppUtil.isListNullOrEmpty(categoriesList) ? onExportAllClick : null} />
            {/* common main content form starts */}

            {/* category create and update form starts */}
            {popupId === modelTypes.CREATE_CATEGORY ?
                <CreateCategory modelID={modelTypes.CREATE_CATEGORY} getCategoriesList={getCategoriesList} editCategoryData={selectedData} setSelectedData={setSelectedData} /> :
                <></>}
            {/* category create and update form Ends */}

            {/* delete category model starts */}
            {popupId === modelTypes.DELETE_CATEGORY ?
                <ConfirmationPopup modelID={modelTypes.DELETE_CATEGORY} moduleName={'category'} updateSelectedItem={deleteCategory} /> :
                <></>}
            {/* delete category model starts */}

        </>
    )
}

export default Categories