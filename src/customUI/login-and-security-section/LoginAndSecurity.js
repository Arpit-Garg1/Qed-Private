import React, { useEffect, useState } from 'react'
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import ConfirmPassword from '../../pages/modal-forms-popups/confirm-password-modal/ConfirmPassword';
import CustomLoader from '../custom-loader/CustomLoader';
import { modelTypes } from '../../_helperFunctions/HelperFunctions';
import * as global from '../../constants/global';

function LoginAndSecurity() {
    const [userDetails, setUserDetails] = useState(null);
    const [pending, setPending] = useState(false);
    useEffect(() => {
        getUserData();
    }, []);


    const getUserData = async () => {
        setPending(true);
        let request = getRequestForApi(global.GET_USER_DATA,undefined, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                setUserDetails(response?.data?.userData);
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            setPending(false);
            console.log('err', err)
        })
    };
    
    return (
        <div class="mainContent-accountDiv2 account-login">
            <h2 class="head-login">Log in & Security</h2>
            <p>Manage your log in and account security details below</p>
            {userDetails?.email ?
            <div className="mainContent-accountDiv2 account-login-para">
                <ul className='securityLIst'>
                    <li>
                        <span className='leftPArt'><strong>Email:</strong></span> 
                        <span className='rightPArt'>{userDetails?.email ? userDetails?.email : ''}</span>
                    </li>
                    <li>
                        <span className='leftPArt'><strong>Password:</strong></span> 
                        <span className='rightPArt' >●●●●●●●●</span>
                        <button type='button' className='openModel openModel-btn' data-rel={modelTypes.CHANGE_PASSWORD}>Change Password</button>
                    </li>
                </ul>
                
                
            </div> : <></> }
            <ConfirmPassword emailId={userDetails?.email} modelID={modelTypes.CHANGE_PASSWORD}/>
            {pending ? <CustomLoader/>:<></>}
        </div >
    )
}

export default LoginAndSecurity