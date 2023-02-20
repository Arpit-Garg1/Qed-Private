import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { alertTypes, writeXLSFileFromJson } from '../../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../../Util/AppUtil'
import { read, utils } from 'xlsx';
import * as global from '../../../constants/global';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';
import { useAlert } from 'react-alert';

function BulkLinkAsset(props) {
    const alert = useAlert();
    const { modelID, getAssetList} = props;
    const [pending, setPending] = useState(null);
    const [isBulkApiResponseReceived, setBulkApiResponseReceived] = useState(false);
    const [bulkDataList, setBulkDataList] = useState(null);


    useEffect(() => {
    }, []);

    const closeModel = (data) => {
        if (data) {
            getAssetList();
            setPending(false);
        }
        $('.model').fadeOut();
        setBulkApiResponseReceived(false)
        setBulkDataList(null);
    };

    const handleSave = async () => {
        let request = getRequestForApi(global.BULK_LINK_ASSET,bulkDataList, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                let res = response?.data;
                setBulkDataList([...res.response.data]);
                    setBulkApiResponseReceived(true);
                    getAssetList();
                    setPending(false);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
            console.log('err', err)
        })
    };

    const sampleFileDownload = async () => {
        let jsonArray = [{"ParentAssetTokenID": "A1","ToBeLinkTokenID": "A2"},{"ParentAssetTokenID": "A1","ToBeLinkTokenID": "A3"},{"ParentAssetTokenID": "A1","ToBeLinkTokenID": "A4"},{"ParentAssetTokenID": "A1","ToBeLinkTokenID": "A5"},{"ParentAssetTokenID": "A6","ToBeLinkTokenID": "A7"},{"ParentAssetTokenID": "A6","ToBeLinkTokenID": "A8"}];
        writeXLSFileFromJson(jsonArray, 'QEDVault_Bulk_Link_Example.xlsx');
    }

    const fileUpload = async (files) => {
        if (!AppUtil.isListNullOrEmpty(files.target.files)) {
            let filesData = files.target.files[0];
            const f = await (filesData).arrayBuffer();
            const wb = read(f);
            const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            setBulkDataList([...data]);
        }
    };

    const downloadUploadedFile = () => {
        writeXLSFileFromJson(bulkDataList, 'QEDValt_Bulk_Linked_Assets_Status.xlsx')
        closeModel();
    }

    const enableDisableSaveButton = () => {
        return ((!AppUtil.isListNullOrEmpty(bulkDataList) && !isBulkApiResponseReceived) ? true : false)
    }

    return (
        <>{pending ? <CustomLoader/> : <></>}
            <div className="model" id={`${modelID}`}>
                <div className="modelContent">
                    <header >
                        <h5>{'Link Bulk Asset'}</h5>
                        <span className="close" onClick={() => closeModel()}>&times;</span>
                    </header>
                    <form >
                    <div className="modal-content">
                        <fieldset className="fieldset" disabled={isBulkApiResponseReceived}>

                                {!isBulkApiResponseReceived ? <>
                                    <div className="fields">
                                        <div className="field">
                                            <label htmlFor="Serial number">
                                                <a href="javascript:void(0);" onClick={() => sampleFileDownload()} >click here</a> to download sample</label>
                                        </div>
                                    </div>
                                    <div className="fields">
                                        <div className="field">
                                            <label htmlFor="selectfile">Choose File to upload file</label>
                                            <div className="modal-btn">
                                                <input name='selectfile' type="file" id="selectfile" accept=".xlsx" onChange={(event) => fileUpload(event)} />
                                                {/* <button className="modal-btn1 openModel" data-rel="" type="button">Upload File</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="fields">
                                        <div className="field">
                                            <label htmlFor="Serial number">
                                                <a href="javascript:void(0);" onClick={() => downloadUploadedFile()} >click here</a> to download Linked Status:</label>
                                        </div>
                                    </div>
                                </>}
                        </fieldset>
                        </div>
                        <div className="modal-footer">
                            <div className="modal-btns">
                                <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                                <button type="button" className={enableDisableSaveButton() ? 'btnBlue' : 'disableButton'} onClick={() => handleSave()}>Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
             </div>
        </>
    )
}


export default BulkLinkAsset