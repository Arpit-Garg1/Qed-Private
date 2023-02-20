import React, { useState } from 'react'
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput'
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { alertTypes, decryptData, errorMessages, path } from '../../../_helperFunctions/HelperFunctions';
import * as global from '../../../constants/global';

function AcceptEmail() {
    const alert = useAlert();
    const [userData, setUserData] = useState(null);
    const [pending, setPending] = useState(null);
    const navigate = useNavigate()
    const params = useParams();

    const handleEvent = () => {
        localStorage.clear();
        navigate(path.LOGIN);
        setUserData(null);
    }

    const acceptUserInvite = async (e) => {
        setPending(true);
        let variables = {
            id: decryptData(params?.id),
            inviteCode: decryptData(params?.inviteCode),
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            password: userData?.password || '',
            confirmPassword: userData?.confirmPassword || '',
            encodedPassphrase: ''
        };
        e.preventDefault();
        let request = getRequestForApi(global.USER_INVITE_ACCEPTED,variables,methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let data = response?.data?.wallet?.passphrase[0];
                alert.show(data, { type: alertTypes.SUCCESS });
                handleEvent();
                setPending(false);
            }
            setPending(false);
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err);
            setPending(false);
        })
    }
    const getSubmitValues = () => {
        if (userData?.firstName && userData?.lastName && userData?.password && userData?.confirmPassword) {
            if (userData?.password === userData?.confirmPassword) {
                return ''
            } else {
                return 'disableButton'
            }
        } else {
            return 'disableButton'
        }
    }
    return (<>
        <div className="form-content" id="formLogin">
            <h1 id="formHead">Accept Invite</h1>
            <form onSubmit={acceptUserInvite}>
                <div className="field input-field">
                    <label for="First Name">First Name</label>
                    <CustomInput fieldType={"text"} setFieldData={setUserData} filedData={userData} keyName={'firstName'} />
                </div>
                <div className="field input-field">
                    <label for="Last Name">Last Name</label>
                    <CustomInput fieldType={"text"} setFieldData={setUserData} filedData={userData} keyName={'lastName'} />
                </div>
                <div className="field input-field">
                    <h5 className='warninig'>{userData?.password && !userData?.isPasswordValid ? errorMessages.PASSWORD : ''}</h5>
                    <label for="Password">Password</label>
                    <CustomInput fieldType={"password"} setFieldData={setUserData} filedData={userData} keyName={'password'} />
                </div>
                <div className="field input-field">
                    <h5 className='warninig'>{userData?.confirmPassword && !userData?.isConfirmPasswordValid ? errorMessages.PASSWORD : ''}</h5>
                    {userData?.confirmPassword && userData?.password ?
                        <h5 className='warninig'>{
                            userData?.isConfirmPasswordValid && userData?.confirmPassword !== '' && userData?.password !== ''
                                && userData?.confirmPassword !== userData?.password ?
                                errorMessages.NO_MATCH_PASSWORD : ''}
                        </h5> : <>
                        </>}
                    <label for="Confirm Password">Confirm Password</label>
                    <CustomInput fieldType={"password"} setFieldData={setUserData} filedData={userData} keyName={'confirmPassword'} />
                </div>
                <div className="field button-field">
                    <button type='submit' className={getSubmitValues()}>Submit</button>
                </div>
            </form>
            {pending ? <CustomLoader /> : <></>}
        </div>
    </>
    )
}

export default AcceptEmail