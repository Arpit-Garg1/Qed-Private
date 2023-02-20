import React, { useEffect, useState } from 'react'
import CommonMainContent from '../../customUI/common-main-content/CommonMainContent'
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import CreateTemplate from '../modal-forms-popups/email-temp-form/CreateTemplate';
import $ from 'jquery';
import ConfirmationPopup from '../../customUI/confirmation-popup/ConfirmationPopup';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import { alertMessage, alertTypes, exportFinalArray, headerNames, modelTypes } from '../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../Util/AppUtil'
import * as global from '../../constants/global';
import { useAlert } from 'react-alert';

function EmailTemplates() {
    const alert = useAlert();
    const [emailTempList, setEmailTemplateList] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [pending, setPending] = useState(null);
    const [popupId, setPopupId] = useState(null);

    const closeModel = () => {
        $('.model').fadeOut();
        getEmailTemplatesList();
        setSelectedData(null);
    };

    const getEmailTemplatesList = async (page, maxRows, filerText, filterColumns) => {
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
        let request = getRequestForApi(global.GET_EMAIL_TEMPLATE_LIST, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                setEmailTemplateList(response?.data?.response);
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

    const emailTempListColumns = [
        {
            name: <th>Template For</th>,
            selector: row => row?.templateFor,
            sortable: true,
            width: '150px'
        },
        {
            name: <th>Subject</th>,
            selector: row => row?.subject,
            sortable: true,
            width: '150px'
        },
        {
            name: <th>Mail Body</th>,
            selector: row => row?.mailBody,
            sortable: true,
            cell: row => (<span data-tooltip={row?.mailBody}><span className='ellipsis'>{row?.mailBody?.substring(0, 60)}{row?.mailBody?.length > 60 ? '...' : ''}</span></span>)
        },
        {
            name: <th></th>,
            selector: row => row?.id,
            cell: row => (
                <td className="actionbutton">
                    <div className="hasDropdown">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical" color="rgba(107, 114, 128, 1)" pointerEvents="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span>

                        <div className="dropDown">
                            <ul className="dropdown">
                                <li><a className="openModel" data-rel={modelTypes.CREATE_TEMPLATE} onClick={() => onAddClick(row, modelTypes.CREATE_TEMPLATE)}>Edit</a></li>
                                <li><a className="openModel" data-rel={modelTypes.DELETE_TEMPLATE} onClick={() => onAddClick(row, modelTypes.DELETE_TEMPLATE)}>Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </td>
            ),
            width: '80px',
        }
    ];


    const deleteTemplate = async () => {
        let variables = {
            id: selectedData?.id
        };
        let request = getRequestForApi(global.UPDATE_EMAIL_TEMPLATE, variables, methodType.DELETE);
        await callHttpRequest(request).then(response => {
            if (response?.status === 200) {
                alert.show(alertMessage.EMAIL_TEMPLATE_DELETE, { type: alertTypes.SUCCESS });
                closeModel();
            }
        }).catch((err) => {
            console.log('err', err)
        })
    }


    const onClickEvent = (pageNo, perPageItem, filterText, filterColumns) => {
        getEmailTemplatesList(pageNo, perPageItem, filterText, filterColumns)
    }

    const onExportAllClick = async (value, filterColumns) => {
        let variables = {
            pageNo: 0,
            perPageItem: 0,
            name: `${value}`,
            filterColumns: filterColumns
        };
        let request = getRequestForApi(global.GET_EMAIL_TEMPLATE_LIST, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                exportFinalArray(response?.data?.response.data, ['templateFor', 'subject', 'mailBody'], undefined, 'QEDValt_Emailtemplate_Data.xlsx')
            }
            setPending(false);
        }).catch((err) => {
            setPending(false);
        });
    }

    return (
        <>
            {/* common main content form starts */}
            <CommonMainContent headerName={headerNames.EMAIL_TEMPLATES} onAddClick={onAddClick} dataList={emailTempList} columnsList={emailTempListColumns} getApiDataList={getEmailTemplatesList} modelID={modelTypes.CREATE_TEMPLATE} pending={pending} onClickEvent={onClickEvent} onExportAllClick={!AppUtil.isListNullOrEmpty(emailTempList) ? onExportAllClick : null} />
            {/* common main content form ends */}

            {/* Template create and update form starts */}
            {popupId === modelTypes.CREATE_TEMPLATE ?
                <CreateTemplate modelID={modelTypes.CREATE_TEMPLATE} getEmailTemplatesList={getEmailTemplatesList} editTemplateData={selectedData} setSelectedData={setSelectedData} /> :
                <></>}
            {/* Template create and update form ends */}

            {/* delete email template model starts */}
            {popupId === modelTypes.DELETE_TEMPLATE ?
                <ConfirmationPopup modelID={modelTypes.DELETE_TEMPLATE} moduleName={'email template'} updateSelectedItem={deleteTemplate} /> :
                <></>}
            {/* delete email template model starts */}
        </>
    )
}

export default EmailTemplates