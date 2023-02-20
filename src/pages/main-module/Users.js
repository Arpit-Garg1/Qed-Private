import React, { useEffect, useState } from 'react'
import CommonMainContent from '../../customUI/common-main-content/CommonMainContent';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import $ from 'jquery';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import InviteUser from '../modal-forms-popups/invite-user-form/InviteUser';
import { alertMessage, alertTypes, exportFinalArray, headerNames, modelTypes, roleTypes, userDetailsType } from '../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../Util/AppUtil'
import * as global from '../../constants/global';
import { useAlert } from 'react-alert';

function Users() {
    const alert = useAlert();
    const [usersList, setUsersList] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [popupId, setPopupId] = useState(null);
    const [pending, setPending] = useState(null);
    const userRole = userDetailsType().USER_ROLE;
    const userDetails = userDetailsType().USER_DATA;

    const getUsersList = async (page, maxRows, filerText, filterColumns) => {
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
        let request = getRequestForApi(global.GET_USERS_BY_ROLE, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                setUsersList(response?.data?.response);
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            console.log('err', err);
            setPending(false);
        })
    };

    const onAddClick = (row, id) => {
        setSelectedData(row);
        setPopupId(id);
    };

    const getStatus = (row) => {
        let status = row?.status?.toLocaleLowerCase();
        if (status) {
            return <li>
                <span data-tooltip={row?.status}>
                    <span className='ellipsis'>
                        {status === 'pending' ?
                            <span className="pending">●</span> :
                            status === 'active' ?
                                <span className="logged-in">●</span> :
                                <span className="logged-out">●</span>
                        }
                    </span>
                </span>
            </li>
        }
    };

    const usersListColumns = [
        {
            name: <th>Email</th>,
            selector: row => row.email,
            sortable: true,
        },
        {
            name: <th>Name</th>,
            selector: row => row?.displayName,
            sortable: true,
        },
        {
            name: <th>Type</th>,
            selector: row => row.displayRole,
            sortable: true,
        },
        {
            name: <th>Organization</th>,
            selector: row => row?.Org,
            sortable: true,
        },
        {
            name: <th className='centerItem'>Status</th>,
            selector: row => row?.status,
            sortable: true,
            cell: row => (
                <div className='icon-buttons'>
                    <ul>
                        {getStatus(row)}
                    </ul>
                </div>
            )
        },
        {
            name: <th></th>,
            selector: row => row.id,
            omit: userRole === roleTypes.MANUFACTURER_USER,
            cell: row => (
                <td className="actionbutton">
                    {userDetails?.id !== row?.id ?
                        row?.status?.toLocaleLowerCase() !== 'pending' ?
                            <div className="hasDropdown">
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical" color="rgba(107, 114, 128, 1)" pointerEvents="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span>

                                <div className="dropDown">
                                    <ul className="dropdown">
                                        <li><a className="openModel" data-rel={modelTypes.ACTIVATE_DEACTIVATE_USER} onClick={() => onAddClick(row, modelTypes.ACTIVATE_DEACTIVATE_USER)}>{row.isActive ? 'Deactivate' : 'Activate'}</a></li>
                                    </ul>
                                </div>
                            </div> : <></> : <></>}
                </td>
            ),
            width: '5%',
        }
    ];


    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getUsersList();
        }
        setSelectedData(null);
    };

    const activateDeactivateUser = async () => {
        let variables = {
            id: selectedData?.id,
            isActive: !selectedData?.isActive
        };

        let request = getRequestForApi(global.ACTIVATE_DEACTIVATE_USER, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(response?.data?.isActive ? alertMessage.USER_ACTIVATED : alertMessage.USER_DEACTIVATED, { type: alertTypes.SUCCESS });
                closeModel(response);
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const onClickEvent = (pageNo, perPageItem, filterText, filterColumns) => {
        getUsersList(pageNo, perPageItem, filterText, filterColumns)
    }

    const onExportAllClick = async (value, filterColumns) => {
        let variables = {
            pageNo: 0,
            perPageItem: 0,
            name: `${value}`,
            filterColumns: filterColumns
        };
        let request = getRequestForApi(global.GET_USERS_BY_ROLE, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                exportFinalArray(response?.data?.response.data, ['displayName', 'email', 'displayRole', 'status'], undefined, 'QEDValt_Users_Data.xlsx')
            }
            setPending(false);
        }).catch((err) => {
            setPending(false);
        });
    }

    return (
        <>

            {/* common main content form starts */}
            <CommonMainContent headerName={headerNames.USERS} onAddClick={onAddClick} dataList={usersList} columnsList={usersListColumns} getApiDataList={getUsersList} modelID={modelTypes.INVITE_USERS} buttonName={'Invite'} pending={pending} onClickEvent={onClickEvent} onExportAllClick={!AppUtil.isListNullOrEmpty(usersList) ? onExportAllClick : null} />
            {/* common main content form starts */}

            {popupId === modelTypes.ACTIVATE_DEACTIVATE_USER ?
                <div className='model' id={modelTypes.ACTIVATE_DEACTIVATE_USER}>
                    <div className="deletemodelContent">
                        <header>
                            <h5 className='modal-text'>{`Do you want to ${selectedData?.isActive ? 'deactivate' : 'activate'} user?`}</h5>
                        </header>
                        <div className="delete-modal-btns">
                            <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                            <button type="button" className='btnBlue' onClick={() => activateDeactivateUser()}>Save</button>
                        </div>
                    </div>
                </div> : <></>}

            {popupId === modelTypes.INVITE_USERS ?
                <InviteUser modelID={modelTypes.INVITE_USERS} getUsersList={getUsersList} /> :
                <></>}
        </>
    )
}

export default Users