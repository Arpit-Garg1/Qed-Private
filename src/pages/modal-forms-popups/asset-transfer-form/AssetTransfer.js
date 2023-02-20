import React, { useEffect, useState } from 'react'
import $ from 'jquery';
import { useAlert } from 'react-alert';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import * as global from '../../../constants/global';
import { AGENT_INVITE_OPTIONS, alertMessage, alertTypes, CUSTOMER_INVITE_OPTIONS, errorMessages, MANUFACTURER_INVITE_OPTIONS, modelTypes, roleTypes, userDetailsType } from '../../../_helperFunctions/HelperFunctions';
import AssetTransferConfirmation from '../../../customUI/asset-transfer-confirmation/AssetTransferConfirmation';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';

function AssetTransfer(props) {
    const { modelID, getAssetList, assetDetails, setSelectedData } = props;
    const alert = useAlert();
    const [userDetails, setUserDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [pending, setPending] = useState(null);
    const userRole = userDetailsType().USER_ROLE;
    const [organizationList, setOrganizationList] = useState(null);

    useEffect(() => {
        if (userDetails?.email === '') {
            setErrorMessage(null);
        }
    }, [userDetails?.email]);

    useEffect(() => {
        if (userRole === roleTypes.MANUFACTURER) {
            setOrganizationList(MANUFACTURER_INVITE_OPTIONS);
        } else if (userRole === roleTypes.AGENT) {
            setOrganizationList(AGENT_INVITE_OPTIONS);
        } else if (userRole === roleTypes.CUSTOMER) {
            setOrganizationList(CUSTOMER_INVITE_OPTIONS);
        }
    }, [userRole])

    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getAssetList();
        }
        setSelectedData(null);
        setUserDetails(null);
        setErrorMessage(null);
    };

    const handleSubmit = async () => {
        setPending(true);
        let variables = {
            email: userDetails?.email?.toLocaleLowerCase() || '',
            assetId: assetDetails?.id || ''
        };
        let request = getRequestForApi(global.VALIDATE_TRANSFER_MAIL, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                if (response?.data?.error === 200) {
                    alert.show(response?.data?.response?.data, { type: alertTypes.SUCCESS });
                    closeModel(response);
                } else {
                    $('#' + modelTypes.ASSET_TRANSFER_CONFIRMATION).hide();
                    alert.show(response?.data?.response?.data, { type: alertTypes.ERROR });
                    if (response?.data?.error === 400) {
                        setErrorMessage(response?.data?.response?.data);
                    }
                }
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
            console.log('err', err);
        })
    };

    const inviteUserApi = async () => {
        let variables = {
            email: userDetails?.email?.toLocaleLowerCase() || ''
        };
        if (userRole !== roleTypes.ADMIN) {
            variables.type = userDetails?.id || ''
            variables.orgId = `${0}`
        };
        let request = getRequestForApi(global.ADMIN_USER_INVITE, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                alert.show(alertMessage.INVITE_SUCCESS, { type: alertTypes.SUCCESS });
                setErrorMessage(null);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err);
        });
    };

    return (
        <> {pending ? <CustomLoader /> : <></>}
            <div className="model" id={modelID}>
                <div className="modelContent">
                    <header>
                        <h5>Transfer Ownership</h5>
                    </header>
                    {assetDetails?.serialNo ? <h4 className='text-Color'><p>Transfer asset with token number: {assetDetails?.tokenId}</p></h4> : <></>}
                    <form action="#">
                        <div className="modal-content">

                            <div className="fields">
                                <div className="field">
                                    <label htmlFor="Recipient email">Recipient email</label>
                                    <CustomInput fieldType={"email"} setFieldData={setUserDetails} filedData={userDetails} keyName={'email'} />
                                </div>
                                {errorMessage ? <h5 className='warninig'>{errorMessage} {errorMessages.INVITE_ERROR}</h5> : <></>}
                            </div><br/>

                            {errorMessage && organizationList ? <div className="fields">
                                <div className="field">
                                    <label htmlFor="User Type">User Type</label>
                                    {organizationList && organizationList?.length > 0 ?
                                        <CustomInput fieldType={"select"} setFieldData={setUserDetails} filedData={userDetails} keyName={'id'} selectList={organizationList} /> :
                                        <></>}
                                </div>
                            </div> : <></>}{console.log(userDetails)}
                        </div>

                        <div className="modal-footer">
                            <div className="modal-btns">
                                <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                                <button type="button" className={userDetails?.email && userDetails?.isValid && !errorMessage ? 'btnBlue openModel' : 'disableButton'} data-rel={modelTypes.ASSET_TRANSFER_CONFIRMATION}>Transfer</button>
                                {errorMessage ? <button type="button" className={userDetails?.id && userDetails?.id !== '' ? 'btnBlue' : 'disableButton'} onClick={() => inviteUserApi()}>Invite</button> : <></>}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <AssetTransferConfirmation modelID={modelTypes.ASSET_TRANSFER_CONFIRMATION} tokenId={assetDetails?.tokenId} userEmail={userDetails?.email?.toLocaleLowerCase()} updateSelectedItem={handleSubmit} />
        </>
    )
}

export default AssetTransfer