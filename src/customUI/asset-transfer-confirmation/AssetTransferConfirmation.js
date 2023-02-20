import React from 'react'
import $ from 'jquery';
import { alertMessage } from '../../_helperFunctions/HelperFunctions';

function AssetTransferConfirmation(props) {
    const { modelID, updateSelectedItem, tokenId, userEmail } = props;
    const closeModel = () => {
        $("#"+modelID).hide();
    };

    return (
        <div className="model" id={modelID}>
            <div className="modelContent">
                <header>
                    <h5 className='modal-alert-message'>
                    Are you sure you would like to issue this Asset with token number <b>{tokenId}</b> and other linked asset(s) to <b>{userEmail}</b>? Issuing this asset is irreversible. Please double-check the data you’ve entered before confirming the Issue.{alertMessage.SAVE_CHANGES}
                    </h5>
                </header>
                <div className="modal-btns">
                    <button type="button" className='btnGrey' onClick={() => closeModel()}>No</button>
                    <button type="button" className='btnBlue' onClick={(e) => updateSelectedItem(e)}>Yes</button>
                </div>
            </div>
        </div>
    )
}

export default AssetTransferConfirmation