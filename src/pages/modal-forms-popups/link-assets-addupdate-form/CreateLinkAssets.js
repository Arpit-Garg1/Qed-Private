import React, { useState } from 'react'
import { useAlert } from 'react-alert';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import CommonAssignmentUI from '../../../customUI/common-assignment-ui/CommonAssignmentUI';
import * as AppUtil from '../../../Util/AppUtil'
import $ from 'jquery';
import * as global from '../../../constants/global';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';
import { alertTypes } from '../../../_helperFunctions/HelperFunctions';
var _ = require('lodash');

function CreateLinkAssets(props) {
    const { modelID, selectedAssetId, headerName, assetList, linkedAssetsList, setParamsNew, setAssetList, getOnlyUnlikedAssetsList } = props;
    const alert = useAlert();
    const [modelData, setModelData] = useState(null);
    const [pending, setPending] = useState(null);
    const [popupType, setPopupType] = useState(0);
    // const [assetList, setAssetList] = useState(null);
    let [linkUnlinkRequestData, setLinkUnlinkRequestData] = useState(null);

    let assetListColumns = [
        {
            name: <th>Serial No.</th>,
            selector: row => row?.serialNo,
            sortable: true
        },
        {
            name: <th>UPC Code</th>,
            selector: row => row?.upcCode,
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
        }
    ];

    const closeModel = (event) => {
        $('.model').fadeOut();
        setModelData(null);
        setAssetList(null);
        if (event) {
            getOnlyUnlikedAssetsList();
        }
    };

    const handleSave = async () => {
        linkUnlinkAsset()
    };

    const onCheckedDataChange = (dataTableListCloned, selectedData, deletedData, selectedRows) => {
        let defultSelected = linkedAssetsList?.data;
        let abcd = [];
        if (!AppUtil.isListNullOrEmpty(defultSelected)) {
            let diffrnceArray = selectedData?.filter(({ id: id1 }) => !defultSelected.some(({ id: id2 }) => id2 === id1));
            if (!AppUtil.isListNullOrEmpty(diffrnceArray)) {
                let diffArr = Array.from(diffrnceArray, (element) => element.id)
                let diffObj = {
                    "assetId": selectedAssetId,
                    "linkAssetData": diffArr,
                    "type": 1
                }
                abcd.push(diffObj)
            }
            if (!AppUtil.isListNullOrEmpty(deletedData)) {
                let dltArr = Array.from(deletedData, (element) => element.id)
                if (!AppUtil.isListNullOrEmpty(dltArr)) {
                    let deleteObj = {
                        "assetId": selectedAssetId,
                        "linkAssetData": dltArr,
                        "type": 0
                    }
                    abcd.push(deleteObj)
                }
            }
        } else {
            if (!AppUtil.isListNullOrEmpty(selectedData)) {
                let newArray = Array.from(selectedData, (element) => element.id)
                let newObj = {
                    "assetId": selectedAssetId,
                    "linkAssetData": newArray,
                    "type": 1
                }
                abcd.push(newObj)
            }
        }
        if (!AppUtil.isListNullOrEmpty(abcd)) {
            console.log(abcd);
            linkUnlinkRequestData = [..._.cloneDeep(abcd)]
            // setLinkUnlinkRequestData(linkUnlinkRequestData)
        }
    };

    const linkUnlinkAsset = async () => {
        setPending(true);
        if (!AppUtil.isListNullOrEmpty(linkUnlinkRequestData)) {
            let request = getRequestForApi(global.LINK_ASSET, linkUnlinkRequestData, methodType.POST);
            await callHttpRequest(request).then(response => {
                if (response?.status === 201 && response?.data?.status === "SUCCESS") {
                    setPending(false);
                    alert.show(response?.data?.response?.data,{type: alertTypes.SUCCESS});
                    if (setParamsNew) setParamsNew(undefined);
                    closeModel();
                } else {
                    alert.show(response?.data?.response?.data,{type: alertTypes.ERROR});
                }
                setPending(false);
            }).catch((err) => {
                setPending(false);
            });
        } else {
            // alert.show("Please ");
            setPending(false);
            closeModel();
        }
    };

    return (
        <>{pending ? <CustomLoader /> : <></>}
            <div className="model" id={`${modelID}`}>
                <div className="modelContent link-assets-content link-unlink-popup">
                    <header >
                        <h5>{'Link Assets'}</h5>
                        <span className="close" onClick={() => closeModel('Cancel')}>&times;</span>
                    </header>
                    <div className="modal-content">
                        {AppUtil.isNotNull(assetList) ?
                            <>
                                <CommonAssignmentUI dataList={assetList} onCheckedDataChange={onCheckedDataChange} onCheckedKey={'isLinked'} itemNameKey={'serialNo'} itemIdKey={'id'} columnsList={assetListColumns} pending={pending} />

                            </>
                            : <></>}
                    </div>
                    <div className="modal-footer">
                        <div className="modal-btns">
                            <button type="button" className='button secondary' onClick={() => closeModel('Cancel')}>Cancel</button>
                            <button type="button" className={!AppUtil.isListNullOrEmpty(linkUnlinkRequestData) ? 'btnBlue' : 'btnBlue'} onClick={() => handleSave()}>Save Changes</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}


export default CreateLinkAssets