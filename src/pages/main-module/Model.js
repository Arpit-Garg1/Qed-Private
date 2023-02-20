
import React, { useEffect, useState } from 'react'
import CommonMainContent from '../../customUI/common-main-content/CommonMainContent';
import ConfirmationPopup from '../../customUI/confirmation-popup/ConfirmationPopup';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import CreateModel from '../modal-forms-popups/model-addupdate-form/CreateModel';
import $ from 'jquery';
import CreateAsset from '../modal-forms-popups/asset-addupdate-form/CreateAsset';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import { alertMessage, alertTypes, exportFinalArray, headerNames, modelTypes, viewOnlyAccess } from '../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../Util/AppUtil'
import * as global from '../../constants/global';
import { useAlert } from 'react-alert';
import CreateRules from '../modal-forms-popups/create-rules-form/CreateRules';

function Model() {
    const alert = useAlert();
    const [modelList, setModelList] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [pending, setPending] = useState(null);
    const [popupId, setPopupId] = useState(null);

    const getModelList = async (page, maxRows, filerText, filterColumns) => {
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
        let request = getRequestForApi(global.GET_MODEL_LIST,variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                setModelList(response?.data?.response);
                setPending(false);
            } else {
                console.log("err");
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

    const modelListColumns = [
        {
            name: <th>Model Name</th>,
            selector: row => row?.name,
            sortable: true
        },
        {
            name: <th>Submodel</th>,
            selector: row => row?.subModel,
            sortable: true
        },
        {
            name: <th>Make Name</th>,
            selector: row => row?.Brand?.name,
            sortable: true
        },
        {
            name: <th>Category</th>,
            selector: row => row?.Category?.name,
            sortable: true
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
            omit: viewOnlyAccess(headerNames.MODELS),
            cell: row => (
                <td className="actionbutton">
                    <div className="hasDropdown">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical" color="rgba(107, 114, 128, 1)" pointerEvents="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span>

                        <div className="dropDown">
                            <ul className="dropdown">
                                {parseInt(row?.attribute1) === 0 ? <li><a className="openModel" data-rel={modelTypes.CREATE_MODEL} onClick={() => onAddClick(row, modelTypes.CREATE_MODEL)}>Edit</a></li> : <></>}
                                {parseInt(row?._count) === 0 ? <li><a className="openModel" data-rel={modelTypes.DELETE_MODEL} onClick={() => onAddClick(row, modelTypes.DELETE_MODEL)}>Delete</a></li> : <></>}
                                <li><a className="openModel" data-rel={modelTypes.ADD_ASSET} onClick={() => onAddClick(row, modelTypes.ADD_ASSET)}>Add Asset</a></li>
                                {row?.rule &&  Object.keys(row?.rule).length > 0 ? <li><a className="openModel" data-rel={modelTypes.CREATE_ASSET_RULES} onClick={() => onAddClick(row, modelTypes.CREATE_ASSET_RULES)}>View Rules</a></li> : <></>}
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
        getModelList();
        setSelectedData(null);
    };

    const deleteModel = async () => {
        let variables = {
            id: selectedData?.id
        };

        let request = getRequestForApi(global.UPDATE_MODEL,variables, methodType.DELETE);
        await callHttpRequest(request).then(response => {
            if (response?.status === 200) {
                alert.show(alertMessage.MODEL_DELETE, { type: alertTypes.SUCCESS });
                closeModel();
            } else {
                console.log("err", response)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const onClickEvent = (pageNo, perPageItem, filterText, filterColumns) => {
        getModelList(pageNo, perPageItem, filterText, filterColumns)
    }

    const onExportAllClick = async (value, filterColumns) => {
        let variables = {
            pageNo: 0,
            perPageItem: 0,
            name: `${value}`,
            filterColumns: filterColumns
        };
        let request = getRequestForApi(global.GET_MODEL_LIST,variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                exportFinalArray(response?.data?.response?.data, ['name', 'subModel'], ['Brand', 'Category'], 'QEDValt_Models_Data.xlsx')
            }
            setPending(false);
        }).catch((err) => {
            setPending(false);
        });
    }

    return (
        <>
            {/* common main content form starts */}
            <CommonMainContent headerName={headerNames.MODELS} dataList={modelList} columnsList={modelListColumns} getApiDataList={getModelList} modelID={modelTypes.CREATE_MODEL} pending={pending} onAddClick={onAddClick} onClickEvent={onClickEvent} onExportAllClick={!AppUtil.isListNullOrEmpty(modelList) ? onExportAllClick : null} />
            {/* common main content form ends */}

            {/* model create and update form starts */}
            {popupId === modelTypes.CREATE_MODEL ?
                <CreateModel modelID={modelTypes.CREATE_MODEL} getModelList={getModelList} editModelData={selectedData} setSelectedData={setSelectedData} /> :
                <></>}
            {/* model create and update form ends */}

            {/* delete model confirmation model starts */}
            {popupId === modelTypes.DELETE_MODEL ?
                <ConfirmationPopup modelID={modelTypes.DELETE_MODEL} moduleName={'model'} updateSelectedItem={deleteModel} /> :
                <></>}
            {/* delete model confirmation model ends */}

            {/* Asset create and update form starts */}
            {popupId === modelTypes.ADD_ASSET ?
                <CreateAsset modelID={modelTypes.ADD_ASSET} getAssetList={getModelList} modelData={selectedData} /> :
                <></>}
            {/* Asset create and update form ends */}

            <CreateRules editRules={selectedData?.rule} modelID={modelTypes.CREATE_ASSET_RULES} modelIdForRule={selectedData?.id} setSelectedData={setSelectedData} viewOnlyType={selectedData?.rule?.id ? true : false}/>
        </>
    )
}

export default Model