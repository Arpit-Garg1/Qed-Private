import React, { useState } from 'react'
import { useAlert } from 'react-alert';
import {  useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import {getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { alertTypes, decryptData, path } from '../../../_helperFunctions/HelperFunctions';
import * as global from '../../../constants/global';

function ForgetPassword() {
    const alert = useAlert();
    const params = useParams();
    const [passwordData, setPasswordData] = useState(null);
    const navigate = useNavigate();
    const onSubmit = async (e) => {
        const variables = {
            email: decryptData(params?.email)?.toLocaleLowerCase() || '',
            password: passwordData?.password || '',
            confirmPassword: passwordData?.confirmPassword || '',
        };
        e.preventDefault();
        let request = getRequestForApi(global.RESET_PASSWORD,variables,methodType.POST);
        await callHttpRequest(request).then(async response => {
            if (response?.status === 201) {
                alert.show(response?.data?.message,{type:alertTypes.SUCCESS});
                navigate(path.LOGIN);
            } 
        }).catch((err) => {
            alert.show(err?.response?.data?.message,{type: alertTypes.ERROR});
            console.log('err',err)
        });  
    };

  return (
    <div className="form-content" id="formLogin">
        <h1 id="formHead">Set New Password</h1>
        <form onSubmit={onSubmit}>
            <div className="field input-field">
                <label htmlFor="Password">Password</label>
                <CustomInput fieldType={"password"} setFieldData={setPasswordData} filedData={passwordData} keyName={'password'}/>
            </div>

            <div className="field input-field">        
                <label htmlFor="Confirm Password">Confirm Password</label>
                <CustomInput fieldType={"password"} setFieldData={setPasswordData} filedData={passwordData} keyName={'confirmPassword'}/>
            </div>
            <div className="field button-field">
                <button type='submit' className={passwordData?.password && passwordData?.confirmPassword ? '' : 'disableButton'}>Save Changes</button>
            </div>
        </form>
    </div>
  )
}

export default ForgetPassword