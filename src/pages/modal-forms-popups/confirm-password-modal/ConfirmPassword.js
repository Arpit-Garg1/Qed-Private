import React, { useState } from 'react'
import CustomInput from '../../../customUI/custom-input-ui/CustomInput'
import $ from 'jquery';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { alertMessage, alertTypes, errorMessages, userDetailsType } from '../../../_helperFunctions/HelperFunctions';
import { useAlert } from 'react-alert';
import * as global from '../../../constants/global';

function ConfirmPassword(props) {
    const { emailId, modelID } = props;
    const alert = useAlert();
    const [passwordData, setPasswordData] = useState(null);
    const closeModel = () => {
        $('.model').fadeOut();
        setPasswordData(null);
    };

    const changePasswordApi = async () => {
        if (passwordData?.password !== passwordData?.confirmPassword) {
            alert.show(alertMessage.SAME_PASSWORD, { type: alertTypes.INFO })
            return;
        }
        let variables = {
            email: userDetailsType()?.USER_DATA?.userData?.email?.toLocaleLowerCase() || emailId?.toLocaleLowerCase(),
            currentPassword: passwordData?.currentPassword || '',
            confirmPassword: passwordData?.confirmPassword || '',
            password: passwordData?.password || ''
        }
        let request = getRequestForApi(global.CHANGE_PASSWORD,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response.status === 201) {
                alert.show(alertMessage.PASSWORD_UPDATE, { type: alertTypes.SUCCESS });
                closeModel();
            } else {
                alert.show(response?.data?.message, { type: alertTypes.ERROR });
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err);
        });
    };

    const getClassType = () => {
        if (passwordData) {
            if ((passwordData?.currentPassword && passwordData?.password && passwordData?.confirmPassword) && (passwordData?.password === passwordData?.confirmPassword)) {
                return ''
            } else {
                return 'disableButton'
            }
        } else {
            return 'disableButton'
        }
    };

    return (
        <div className="model" id={modelID}>
            <div className="modelContent">
                <header>
                    <h5>Change Password</h5>
                </header>
                <form action="#">
                <div className="modal-content">
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Current Password">Current Password</label>
                        <CustomInput fieldType={"password"} setFieldData={setPasswordData} filedData={passwordData} keyName={'currentPassword'} />
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="New Password">New Password</label>
                        <h5 className='warninig'>{passwordData?.password && !passwordData?.isPasswordValid ? errorMessages.PASSWORD : ''}</h5>
                        <CustomInput fieldType={"password"} setFieldData={setPasswordData} filedData={passwordData} keyName={'password'} />
                    </div>
                </div>
                <div className="fields">
                    <div className="field">
                        <label htmlFor="Confirm Password">Confirm Password</label>
                        <h5 className='warninig'>{passwordData?.confirmPassword && !passwordData?.isConfirmPasswordValid ? errorMessages.PASSWORD : ''}</h5>
                        {passwordData?.confirmPassword && passwordData?.password ?
                            <h5 className='warninig'>{
                                passwordData?.isConfirmPasswordValid && passwordData?.confirmPassword !== '' && passwordData?.password !== ''
                                    && passwordData?.confirmPassword !== passwordData?.password ?
                                    errorMessages.NO_MATCH_PASSWORD : ''}
                            </h5> : <>
                        </>}
                        <CustomInput fieldType={"password"} setFieldData={setPasswordData} filedData={passwordData} keyName={'confirmPassword'} />
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                    <div className="modal-btns">
                        <button type="button" className='button secondary' onClick={() => closeModel()} >Cancel</button>
                        <button type="button" className={`btnBlue ${getClassType()}`} onClick={() => changePasswordApi()} >Change Password</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmPassword