
import React, { useEffect, useState } from 'react'
import ConfirmationPopup from '../../customUI/confirmation-popup/ConfirmationPopup';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import CreateMake from '../modal-forms-popups/make-addupdate-form/CreateMake';
import $ from 'jquery';
import CommonMainContent from '../../customUI/common-main-content/CommonMainContent';
import CreateModel from '../modal-forms-popups/model-addupdate-form/CreateModel';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import { alertMessage, alertTypes, exportFinalArray, headerNames, modelTypes, userDetailsType, viewOnlyAccess } from '../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../Util/AppUtil'
import * as global from '../../constants/global';
import { useAlert } from 'react-alert';

function Make() {
    const [makesList, setMakesList] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [pending, setPending] = useState(null);
    const [popupId, setPopupId] = useState(null);
    const userRole = userDetailsType().USER_ROLE;
    const alert = useAlert();

    const getMakesList = async (page, maxRows, filerText, filterColumns) => {
        setPending(true);
        let variables = {
            pageNo: page || PAGE_NUMBER,
            perPageItem: maxRows || MAX_ITEM_PER_PAGE,
            name: filerText,
            filterColumns: filterColumns,
        };
        callGetApi(variables)
    };

    const callGetApi = async(variables) => {
        let request = getRequestForApi(global.GET_MAKE_LIST,variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                setMakesList(response?.data?.response);
                setPending(false);
            } else {
                setPending(false);
                console.log("err", response)
            }
        }).catch((err) => {
            setPending(false);
            console.log('err', err)
        });
    }

    const closeModel = () => {
        $('.model').fadeOut();
        getMakesList();
        setSelectedData(null);
    };

    const deleteMake = async () => {
        let variables = {
            id: selectedData?.id
        };

        let request = getRequestForApi(global.UPDATE_MAKE,variables, methodType.DELETE);
        await callHttpRequest(request).then(response => {
            if (response?.status === 200) {
                alert.show(alertMessage.MAKE_DELETE, { type: alertTypes.SUCCESS });
                closeModel();
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const onAddClick = (row, id) => {
        setSelectedData(row);
        setPopupId(id);
    };

    const makesListColumns = [
        {
            name: <th>Name</th>,
            selector: row => row.name,
            sortable: true,
            width: '20%'
        },
        {
            name: <th>Description</th>,
            selector: row => row.description,
            sortable: true,
            cell: row => (<span data-tooltip={row?.description}><span className='ellipsis'>{row?.description?.substring(0,60)}{row?.description?.length > 60 ? '...' : ''}</span></span>),
        },
        {
            name: <th></th>,
            selector: row => row.id,
            omit: viewOnlyAccess(headerNames.MAKES),
            cell: row => (
                <td className="actionbutton">
                    <div className="hasDropdown">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical" color="rgba(107, 114, 128, 1)" pointerEvents="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span>

                        <div className="dropDown">
                            <ul className="dropdown">
                                {parseInt(row?.attribute1) === 0 ? <li><a className="openModel" data-rel={modelTypes.CREATE_MAKES} onClick={() => onAddClick(row, modelTypes.CREATE_MAKES)}>Edit</a></li> : <></>}
                                {parseInt(row?._count) === 0 ? <li><a className="openModel" data-rel={modelTypes.DELETE_MAKES} onClick={() => onAddClick(row, modelTypes.DELETE_MAKES)}>Delete</a></li> : <></>}
                                <li><a className="openModel" data-rel={modelTypes.ADD_NEW_MODAL} onClick={() => onAddClick(row, modelTypes.ADD_NEW_MODAL)}>Add model</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            ),
            width: "5%",
        }
    ];

    const onClickEvent = (pageNo, perPageItem, filterText, filterColumns) => {
        getMakesList(pageNo, perPageItem, filterText, filterColumns)
    }

    const onExportAllClick = async (value, filterColumns) => {
        let variables = {
            pageNo: 0,
            perPageItem: 0,
            name: `${value}`,
            filterColumns: filterColumns
        };
        let request = getRequestForApi(global.GET_MAKE_LIST,variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                exportFinalArray(response?.data?.response.data, ['name', 'description'], null, 'QEDValt_Makes_Data.xlsx')
            }
            setPending(false);
        }).catch((err) => {
            setPending(false);
        });
    }

    return (
        <>
            {/* common main content form starts */}
            <CommonMainContent headerName={headerNames.MAKES} onAddClick={onAddClick} dataList={makesList} columnsList={makesListColumns} modelID={modelTypes.CREATE_MAKES} getApiDataList={getMakesList} pending={pending} onClickEvent={onClickEvent} onExportAllClick={!AppUtil.isListNullOrEmpty(makesList) ? onExportAllClick : null} />
            {/* common main content form starts */}

            {/* make create and update form starts */}
            {popupId === modelTypes.CREATE_MAKES ?
                <CreateMake modelID={modelTypes.CREATE_MAKES} getMakesList={getMakesList} editMakeData={selectedData} setSelectedData={setSelectedData} /> :
                <></>}
            {/* make create and update form starts */}

            {/* delete make model starts */}
            {popupId === modelTypes.DELETE_MAKES ?
                <ConfirmationPopup modelID={modelTypes.DELETE_MAKES} moduleName={'make'} updateSelectedItem={deleteMake} /> :
                <></>}
            {/* delete make model starts */}

            {/* model create and update form starts */}
            {popupId === modelTypes.ADD_NEW_MODAL ?
                <CreateModel modelID={modelTypes.ADD_NEW_MODAL} getModelList={getMakesList} makeData={selectedData} /> :
                <></>}
            {/* model create and update form starts */}
        </>
    )
}

export default Make