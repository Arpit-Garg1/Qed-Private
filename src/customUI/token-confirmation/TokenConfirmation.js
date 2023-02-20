import React from 'react'
import { alertMessage } from '../../_helperFunctions/HelperFunctions';

function TokenConfirmation(props) {
    const { generateToken, confirmationAlert, setGenerateToken, setConfirmationAlert, assetId, handleAssets, bulkTokenGeneration, modelID } = props;
    
    const handleEvent = (event) => {
        if (event == 'Cancel') {
            setConfirmationAlert(false);
            setGenerateToken(false);
        } else {
            handleAssets();
            setGenerateToken(null);
            setConfirmationAlert(null);
        }
    };

    let confirmationMessage = '';
    if (generateToken && bulkTokenGeneration) {
        confirmationMessage = alertMessage.ASSET_BULK_TOKEN_CREATION;
    } else if (generateToken) {
        confirmationMessage = alertMessage.ASSET_TOKEN_CREATION;
    } else if (assetId) {
        confirmationMessage = alertMessage.ASSET_UPDATE_WITHOUT_TOKEN_CREATION;
    } else {
        confirmationMessage = alertMessage.ASSET_WITHOUT_TOKEN_CREATION;
    };

    return (
        <div className={`model ${confirmationAlert ? 'showAlert' : ''}`} id={modelID}>
            <div className="deletemodelContent">
                <header>
                    <h5 className='modal-alert-message'>{confirmationMessage}</h5>
                </header>
                <div className="delete-modal-btns">
                    <button type="button" className='btnGrey' onClick={() => handleEvent('Cancel')}>Cancel</button>
                    <button type="button" className='btnBlue' onClick={() => handleEvent('Create')}>{assetId ? 'Update' : 'Create'}</button>
                </div>
            </div>
        </div>
    )
}

export default TokenConfirmation