import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import CommonMainContent from '../../customUI/common-main-content/CommonMainContent'
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import { getRequestForApi } from '../../Util/CommonRequest';
import CreateOrganization from '../modal-forms-popups/organisation-createupdate-form/CreateOrganization';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import ConfirmationPopup from '../../customUI/confirmation-popup/ConfirmationPopup';
import { alertMessage, alertTypes, exportFinalArray, headerNames, modelTypes } from '../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../Util/AppUtil';
import * as global from '../../constants/global';
import { useAlert } from 'react-alert';

function AdminOrgainzations() {
  const alert = useAlert();
  const [organizationList, setOrganizationList] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [pending, setPending] = useState(null);
  const [popupId, setPopupId] = useState(null);

  const getOrganizationList = async (page, maxRows, filerText, filterColumns) => {
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
    let request = getRequestForApi(global.GET_ORGANIZATIONS_LIST_API, variables, methodType.POST);
    await callHttpRequest(request).then(response => {
      if (response?.status === 201) {
        setOrganizationList(response?.data?.response);
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

  const onAddClick = (row, id) => {
    setSelectedData(row);
    setPopupId(id);
  };

  const organizationListColumns = [
    {
      name: <th>Name</th>,
      selector: row => row.name,
      sortable: true,
      width: '30%'
    },
    {
      name: <th>Type</th>,
      selector: row => row.type,
      sortable: true
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
                <li><a className="openModel" data-rel={modelTypes.CREATE_ORGANIZATION} onClick={() => onAddClick(row, modelTypes.CREATE_ORGANIZATION)}>Edit</a></li>
                {parseInt(row?._count?.Users) === 0 ? <li><a className="openModel" data-rel={modelTypes.DELETE_ORGANIZATION} onClick={() => onAddClick(row, modelTypes.DELETE_ORGANIZATION)}>Delete</a></li> : <></>}
              </ul>
            </div>
          </div>
        </td>
      ),
      width: '5%',
    }
  ];

  const closeModel = () => {
    $('.model').fadeOut();
    getOrganizationList();
    setSelectedData(null);
  };

  const deleteOrganization = async () => {
    let variables = {
      id: selectedData?.id
    };

    let request = getRequestForApi(global.DELETE_ORGANIZATION, variables, methodType.DELETE);
    await callHttpRequest(request).then(response => {
      if (response?.status === 200) {
        alert.show(alertMessage.ORGANIZATION_DELETE, { type: alertTypes.SUCCESS });
        closeModel();
      } else {
        console.log("err", response)
      }
    }).catch((err) => {
      console.log('err', err)
    });
  };

  const onClickEvent = (pageNo, perPageItem, filterText, filterColumns) => {
    getOrganizationList(pageNo, perPageItem, filterText, filterColumns)
  };

  const onExportAllClick = async (value, filterColumns) => {
    let variables = {
      pageNo: 0,
      perPageItem: 0,
      name: `${value}`,
      filterColumns: filterColumns
    };
    let request = getRequestForApi(global.GET_ORGANIZATIONS_LIST_API, variables, methodType.POST);
    await callHttpRequest(request).then(response => {
      if (response?.data) {
        exportFinalArray(response?.data?.response.data, ['name', 'type'], undefined, 'QEDValt_Organizations_Data.xlsx')
      }
      setPending(false);
    }).catch((err) => {
      setPending(false);
    });
  };

  return (
    <>
      {/* common main content form starts */}
      <CommonMainContent headerName={headerNames.ORGANIZATIONS} onAddClick={onAddClick} dataList={organizationList} columnsList={organizationListColumns} getApiDataList={getOrganizationList} modelID={modelTypes.CREATE_ORGANIZATION} pending={pending} onClickEvent={onClickEvent} onExportAllClick={!AppUtil.isListNullOrEmpty(organizationList) ? onExportAllClick : null} />
      {/* common main content form starts */}

      {/* organization create and update form starts */}
      {popupId === modelTypes.CREATE_ORGANIZATION ?
        <CreateOrganization modelID={modelTypes.CREATE_ORGANIZATION} getOrganizationList={getOrganizationList} editOrganizationData={selectedData} setSelectedData={setSelectedData} /> :
        <></>}
      {/* organization create and update form starts */}

      {/* delete organization confirmation model starts */}
      {popupId === modelTypes.DELETE_ORGANIZATION ?
        <ConfirmationPopup modelID={modelTypes.DELETE_ORGANIZATION} moduleName={'organization'} updateSelectedItem={deleteOrganization} /> :
        <></>}
      {/* delete organization confirmation model ends */}
    </>
  )
}

export default AdminOrgainzations