import React, { useEffect, useMemo, useState } from 'react'
import CommonMainContent from '../../customUI/common-main-content/CommonMainContent';
import ConfirmationPopup from '../../customUI/confirmation-popup/ConfirmationPopup';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import CreateAsset from '../modal-forms-popups/asset-addupdate-form/CreateAsset';
import $ from 'jquery';
import * as DateUtil from '../../Util/DateUtil';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import TokenConfirmation from '../../customUI/token-confirmation/TokenConfirmation';
import * as AppUtil from '../../Util/AppUtil'
import { alertMessage, alertTypes, encryptData, exportFinalArray, headerNames, modelTypes, path, roleTypes, userDetailsType } from '../../_helperFunctions/HelperFunctions';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import * as global from '../../constants/global';
import AssetTransfer from '../modal-forms-popups/asset-transfer-form/AssetTransfer';
import BulkLinkAsset from '../modal-forms-popups/asset-bulklink-form/BulkLinkAsset';


function Assets(props) {
    const { headerName = headerNames.ASSETS, modelID = modelTypes.CREATE_ASSET, selectedAssetId, assetDataObj, setLinkedAssetsList } = props;
    const [assetList, setAssetList] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [generateToken, setGenerateToken] = useState(false);
    const [confirmationAlert, setConfirmationAlert] = useState(false);
    const [pending, setPending] = useState(null);
    const [popupId, setPopupId] = useState(null);
    const [tokenFilterType, setTokenFilterType] = useState(null);
    const [ownedByFilterType, setOwnedByFilterType] = useState();
    const [linkedStatusFilter, setLinkedStatusFilter] = useState();
    const [showCheckbox, setShowCheckbox] = useState(false);
    let [selectedAssets, setSelectedAssets] = useState([]);
    const userRole = userDetailsType().USER_ROLE;
    const alert = useAlert();

    let assetListColumns = useMemo(() => [
        {
            name: <th>Serial No.</th>,
            selector: row => row?.serialNo,
            cell: row => (<span data-tooltip={row?.serialNo}><span className='ellipsis'>{row?.serialNo}</span></span>),
            sortable: true
        },
        {
            name: <th>UPC Code</th>,
            selector: row => row?.upcCode,
            cell: row => (<span data-tooltip={row?.upcCode}><span className='ellipsis'>{row?.upcCode}</span></span>),
            sortable: true
        },
        {
            name: <th>Category</th>,
            selector: row => row?.type,
            sortable: true
        },
        {
            name: <th>Make</th>,
            selector: row => row?.Brand?.name,
            sortable: true
        },
        {
            name: <th>Model</th>,
            selector: row => row?.Model?.name,
            sortable: true
        },
        {
            name: <th>Submodel</th>,
            selector: row => row?.Model?.subModel,
            sortable: true,
            cell: row => (<span data-tooltip={row?.Model?.subModel}><span className='ellipsis'>{row?.Model?.subModel}</span></span>)
        },
        {
            name: <th>Token</th>,
            selector: row => row?.tokenId,
            sortable: true,
            cell: row => (<span data-tooltip={row?.tokenId}><span className='ellipsis'>{row?.tokenId}</span></span>)
        },
        {
            name: <th>Creation Date</th>,
            selector: row => new Date(row?.createdAt).getTime(),
            sortable: true,
            cell: row => (<span ><span className='ellipsis'>
                {DateUtil.getDisplayDateFormat(row?.createdAt)}
            </span></span>)
        },
        {
            name: <th>Owner</th>,
            selector: row => row?.owner,
            sortable: true,
        },
        {
            name: <th>Is Linked</th>,
            selector: row => !AppUtil.isListNullOrEmpty(row?.linkFrom) ? 'Yes' : 'No',
            sortable: true,
        },
        {
            name: <th></th>,
            selector: row => row?.id,
            omit: (headerName == headerNames.LINKED_ASSETS),
            cell: row => (
                <td className="actionbutton">
                    <div className="hasDropdown">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical" color="rgba(107, 114, 128, 1)" pointerEvents="none"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span>
                        <div className="dropDown">
                            {getOptions(row)}
                        </div>
                    </div>
                </td>
            ),
            width: '5%',
        }
    ], []);

    const closeModel = () => {
        $('.model').fadeOut();
        getAssetList();
        setSelectedData(null);
    };

    const getAssetList = async (page, maxRows, filerText, filterColumns,tokenFilter) => {
        setSelectedAssets([])
        setPending(true);
        let variables = {
            pageNo: page || PAGE_NUMBER,
            perPageItem: maxRows || MAX_ITEM_PER_PAGE,
            name: filerText,
            filterColumns: !AppUtil.isListNullOrEmpty(filterColumns) ? filterColumns : undefined,
            tokenFilterType: filterColumns == null ? null : tokenFilter,
            ownedByFilterType: filterColumns == null ? null : ownedByFilterType ? parseInt(ownedByFilterType) : ownedByFilterType,
            linkedAssets: filterColumns == null ? null : linkedStatusFilter ? parseInt(linkedStatusFilter) : linkedStatusFilter,
            assetId: headerName == headerNames.LINKED_ASSETS ? selectedAssetId : undefined
        };
        if (tokenFilter) {
            setShowCheckbox(true);
        } else {
            setShowCheckbox(false);
        }
        callGetApi(variables)
    };

    const getOptions = (row) => {
        if (userRole === roleTypes.MANUFACTURER_USER || userRole === roleTypes.MANUFACTURER) {
            return <ul className="dropdown">
                <li><Link to={`${path.VIEW_LINEAGE}${encryptData(row?.id)}`} onClick={() => onAddClick(row)}>View Lineage</Link></li>
                {headerName !== headerNames.LINKED_ASSETS && !row?.tokenId ? <>
                    <li><a className="openModel" data-rel={modelTypes.CREATE_ASSET} onClick={() => onAddClick(row, modelTypes.CREATE_ASSET)}>Edit</a></li>
                    {/* {!row?.tokenId ? <> */}
                    <li><a className="openModel" data-rel={modelTypes.DELETE_ASSET} onClick={() => onAddClick(row, modelTypes.DELETE_ASSET)}>Delete</a></li>
                    <li><a onClick={() => handleTokenGeneration(row)}>Generate Token</a></li>
                    {/* </> : <> */}
                    {/* <li><Link to={`${path.LINK_ASSETS}${encryptData(row?.id)}`} onClick={() => onAddClick(row)}>Linked Assets</Link></li>
                        {row?.linkFrom?.length === 0 ?
                            <li><a className="openModel" data-rel={modelTypes.ASSET_TRANSFER} onClick={() => onAddClick(row, modelTypes.ASSET_TRANSFER)}>Transfer Ownership</a></li> : <></>
                        } */}
                    {/* </>} */}
                </>
                    : <><li><Link to={`${path.LINK_ASSETS}${encryptData(row?.id)}`} onClick={() => onAddClick(row)}>Linked Assets</Link></li>
                        {row?.linkFrom?.length === 0 && row?.isOwned == 'Y' ?
                            <li><a className="openModel" data-rel={modelTypes.ASSET_TRANSFER} onClick={() => onAddClick(row, modelTypes.ASSET_TRANSFER)}>Transfer Ownership</a></li> : <></>
                        } </>}
            </ul>
        }
        if (userRole === roleTypes.AGENT || userRole === roleTypes.CUSTOMER) {
            return <ul className="dropdown">
                <li><Link to={`${path.VIEW_LINEAGE}${encryptData(row?.id)}`} onClick={() => onAddClick(row)}>View Lineage</Link></li>
                {headerName !== headerNames.LINKED_ASSETS && (row?.isOwned == 'Y' || !row?.tokenId) ? <>
                    <li><Link to={`${path.LINK_ASSETS}${encryptData(row?.id)}`} onClick={() => onAddClick(row)}>Linked Assets</Link></li>
                    {row?.tokenId && row?.linkFrom?.length === 0 ? <>
                        <li><a className="openModel" data-rel={modelTypes.ASSET_TRANSFER} onClick={() => onAddClick(row, modelTypes.ASSET_TRANSFER)}>Transfer Ownership</a></li>
                    </> : <></>}
                </>
                    : <></>}
            </ul>
        }
    };

    const onAddClick = (row, id) => {
        setSelectedData(row);
        setPopupId(id);
    };

    const callGetApi = async (variables) => {
        setPending(true);
        let request = getRequestForApi(global.GET_ALL_ASSETS_LIST, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.data) {
                setAssetList(response?.data?.response);
                if (headerName == headerNames.LINKED_ASSETS) {
                    setLinkedAssetsList(response?.data?.response);
                }
                setPending(false);
            }
            setPending(false);
        }).catch((err) => {
            console.log('err', err);
            setPending(false);
        });
    }

    const deleteAsset = async () => {
        setPending(true);
        let variables = {
            id: selectedData?.assetIndex
        };

        let request = getRequestForApi(global.DELETE_ASSET, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                alert.show(alertMessage.ASSET_DELETE, { type: alertTypes.SUCCESS });
                closeModel();
            } else {
                setPending(false);
                console.log("err", response)
            }
        }).catch((err) => {
            setPending(false);
            console.log('err', err)
        });
    };

    const handleTokenGeneration = (row) => {
        setSelectedData(row);
        setGenerateToken(true);
        setConfirmationAlert(true);
    };

    const createAssetTokenCreate = async () => {
        setPending(true);
        let variables = {
            id: selectedData?.id
        }

        let request = getRequestForApi(global.CREATE_ASSET_TOKEN, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                applyRuleOnAsset();
            } else {
                setPending(false);
            }
        }).catch((err) => {
            console.log('err', err);
            setPending(false);
        })
    };

    const applyRuleOnAsset = async () => {
        let variables = {
            assetId: selectedData?.id
        }

        let request = getRequestForApi(global.APPLY_RULE_ON_ASSET, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response.status === 201) {
                alert.show(alertMessage.TOKEN_GENERATION, { type: alertTypes.SUCCESS });
                closeModel();
                // setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            setPending(false);
            console.log('err', err)
        })
    };

    const onItemSelectByChekBox = (data) => {
        setSelectedAssets([...data.selectedRows])
    };

    const onClickEvent = (pageNo, perPageItem, filterText, filterColumns = undefined, type) => {
        // setTokenFilterType(undefined);
        // setLinkedStatusFilter(undefined)
        // setOwnedByFilterType(undefined)
        getAssetList(pageNo, perPageItem, filterText, filterColumns, type)
    };

    const onSelectFilterChange = (event, type) => {
        switch (type) {
            case 0:
                setTokenFilterType(event.target.value);
                break;
            case 1:
                setLinkedStatusFilter(event.target.value);
                break;
            case 2:
                setOwnedByFilterType(event.target.value);
                break;
        }
    };

    const onExportAllClick = async (value, filterColumns) => {
        exportFinalArray(assetList.data, ['serialNo', 'upcCode', 'tokenId', 'type', 'createdAt', 'description', 'owner', 'ownerOrg',], ['Brand', 'Model'], 'QEDValt_Assets_Data.xlsx');
        // let variables = {
        //     pageNo: 0,
        //     perPageItem: 0,
        //     name: `${value}`,
        //     filterColumns: filterColumns,
        //     tokenFilterType,
        //     ownedByFilterType,
        //     linkedAssets: linkedStatusFilter
        // };
        // let request = getRequestForApi(global.GET_ALL_ASSETS_LIST, variables, methodType.POST);
        // await callHttpRequest(request).then(response => {
        //     if (response?.data) {
        //         // let objectMap = new Map();
        //         // objectMap.set('Brand', 'name')
        //         exportFinalArray(response?.data?.response.data, ['serialNo', 'upcCode', 'tokenId', 'type', 'createdAt', 'description', 'owner', 'ownerOrg'], ['Brand', 'Model'], 'QEDValt_Assets_Data.xlsx');
        //     }
        //     setPending(false);
        // }).catch((err) => {
        //     setPending(false);
        // });
    };

    const onGenrateBulkTokenClick = async () => {
        setSelectedData(null);
        setGenerateToken(true);
        setConfirmationAlert(true);
    };

    const generateBulkToken = async () => {
        if (!AppUtil.isListNullOrEmpty(selectedAssets)) {
            let variables = {
                "ids": Array.from(selectedAssets, (element) => element.id)
            }
            setPending(true);
            let request = getRequestForApi(global.CREATE_BULK_ASSET_TOKEN, variables, methodType.POST);
            await callHttpRequest(request).then(async (response) => {
                let requestNew = getRequestForApi(global.APPLY_RULE_ON_MULTIPLE_ASSET, variables, methodType.POST);
                await callHttpRequest(requestNew).then(newRes => {
                    alert.show(alertMessage.BULK_TOKEN_GENERATION, { type: alertTypes.SUCCESS });
                    setPending(false);
                    setSelectedAssets(null);
                    setTokenFilterType(null);
                    getAssetList();
                }).catch((err) => {
                    setPending(false);
                });
            }).catch((err) => {
                setPending(false);
            });

        }
    };

    const assetFilter = () => {
        return (<li>
            <ul className="navbar-nav">
                {headerName !== headerNames.LINKED_ASSETS ?
                    <>
                        <li className="nav-item d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center mx-4">
                                <div className="mr-1 text-nowrap">Select Token Filter :</div>
                                <select className="form-control form-control-sm" value={tokenFilterType} onChange={event => onSelectFilterChange(event, 0)}>
                                    <option selected={(tokenFilterType != 1 && tokenFilterType != 2)} value={null}>All</option>
                                    <option value={2}>Generated</option>
                                    <option value={1}>Not Generated</option>
                                </select>
                            </div>
                            <div className="d-flex align-items-center mx-4">
                                <div className="mr-1 text-nowrap">Select Linked Status :</div>
                                <select className="form-control form-control-sm" value={linkedStatusFilter} onChange={event => onSelectFilterChange(event, 1)}>
                                    <option selected={(linkedStatusFilter != 1 && linkedStatusFilter != 2)} value={null}>All</option>
                                    <option value={2}>Yes</option>
                                    <option value={1}>No</option>
                                </select>
                            </div>
                        </li>
                        <li className="nav-item d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center mx-4">
                                <div className="mr-1 text-nowrap">Owned By :</div>
                                <select className="form-control form-control-sm" value={ownedByFilterType} onChange={event => onSelectFilterChange(event, 2)}>
                                    <option selected={(ownedByFilterType != 1)} value={null}>All</option>
                                    <option value={1}>Me</option>
                                </select>
                            </div>
                        </li>
                    </>

                    : <></>}
            </ul>
        </li>

        )
    };

    return (
        <>
            {/* common main content form starts */}
            <CommonMainContent
                headerName={headerName}
                dataList={assetList}
                columnsList={assetListColumns}
                modelID={modelID}
                pending={pending}
                onAddClick={onAddClick}
                currentRouterUrl={window?.location?.pathname}
                selectableRows={showCheckbox}
                selectableRowsNoSelectAll={false}
                extraFiltersView={assetFilter}
                tokenFilterType={tokenFilterType}
                setTokenFilterType={setTokenFilterType}
                setLinkedStatusFilter={setLinkedStatusFilter}
                setOwnedByFilterType={setOwnedByFilterType}
                onItemSelectByChekBox={onItemSelectByChekBox}
                onGenrateBulkTokenClick={!AppUtil.isListNullOrEmpty(selectedAssets) ? onGenrateBulkTokenClick : null}
                onClickEvent={onClickEvent}
                onExportAllClick={!AppUtil.isListNullOrEmpty(assetList) ? onExportAllClick : null}
                getApiDataList={getAssetList}
                assetDataObj={assetDataObj}
                buttonName={headerName == headerNames.LINKED_ASSETS ? 'Link/Unlink' : undefined}
            />
            {/* common main content form ends */}

            {/* Asset create and update form starts */}
            {popupId === modelTypes.CREATE_ASSET ?
                <CreateAsset modelID={modelTypes.CREATE_ASSET} setTokenFilterType={setTokenFilterType} getAssetList={getAssetList} editAssetData={selectedData} setSelectedData={setSelectedData} /> :
                <></>}
            {/* Asset create and update form ends */}
            {popupId === modelTypes.LINK_BULK_ASSET ?
                <BulkLinkAsset modelID={modelTypes.LINK_BULK_ASSET} getAssetList={getAssetList} editAssetData={selectedData} setSelectedData={setSelectedData} /> :
                <></>}

            {/* delete model confirmation model starts */}
            {popupId === modelTypes.DELETE_ASSET ?
                <ConfirmationPopup modelID={modelTypes.DELETE_ASSET} moduleName={'asset'} updateSelectedItem={deleteAsset} /> :
                <></>}
            {/* delete model confirmation model ends */}

            {/* Asset transfer model starts */}
            {popupId === modelTypes.ASSET_TRANSFER ?
                <AssetTransfer modelID={modelTypes.ASSET_TRANSFER} getAssetList={getAssetList} assetDetails={selectedData} setSelectedData={setSelectedData} /> :
                <></>}
            {/* Asset transfer model ends */}

            <TokenConfirmation modelID={modelTypes.TOKEN_CONFIRMATION} generateToken={generateToken} confirmationAlert={confirmationAlert} setConfirmationAlert={setConfirmationAlert} setGenerateToken={setGenerateToken} handleAssets={selectedData ? createAssetTokenCreate : generateBulkToken} bulkTokenGeneration={selectedAssets?.length > 0 ? 'true' : 'false'} />

        </>
    )
}

export default Assets