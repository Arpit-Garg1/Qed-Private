import React from 'react'
import $ from 'jquery';
import { alertMessage } from '../../_helperFunctions/HelperFunctions';

function ConfirmationPopup(props) {
    const { modelID, moduleName, updateSelectedItem, getApiData } = props;
    const closeModel = () => {
        $('.model').fadeOut();
        if (!moduleName) {
            getApiData();
        }
    };
    
    let message = ''
    if (moduleName) {
        message = alertMessage.DELETE_CONFIRMATION + ' ' + moduleName + '?';
    } else {
        message = alertMessage.UNSAVED_CHANGES_CONFIRMATION;
    }
    return (
        <div className="model" id={`${modelID}`}>
            <div className={!moduleName ? 'modelContent' : 'deletemodelContent'}>
                <header>
                    <h5 className='modal-text'>{message}</h5>
                </header>
                <div className={!moduleName ? 'modal-btns' : 'delete-modal-btns'}>
                    <button type="button" className='button secondary' onClick={() => closeModel()}>{moduleName ? 'Cancel' : 'No'}</button>
                    <button type="button" className='btnBlue' onClick={(e) => updateSelectedItem(e)}>{moduleName ? 'Delete' : 'Yes'}</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup