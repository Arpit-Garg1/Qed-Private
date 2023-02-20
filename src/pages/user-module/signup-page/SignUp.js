import React, { useState } from 'react'
import { useAlert } from 'react-alert';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';
import { getRequestForApi } from '../../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import * as AppUtil from '../../../Util/AppUtil';
import { alertTypes, storageKey, errorMessages, getAdminRoles, path, setStorageData, storageType, alertMessage, jwtDecodeData } from '../../../_helperFunctions/HelperFunctions';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import * as global from '../../../constants/global';

const firebaseConfig = {
    apiKey: "AIzaSyCCngk_gOvpXHBmqWMlolBYDeWAK3JI7ZM",
    authDomain: "qedvalt.firebaseapp.com",
    projectId: "qedvalt",
    storageBucket: "qedvalt.appspot.com",
    messagingSenderId: "564305018422",
    appId: "1:564305018422:web:4095c5f7d3be20c2082297",
    measurementId: "G-9TV9ZH6F3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
// const analytics = getAnalytics(app);


function SignUp() {
    const alert = useAlert();
    const [loginData, setLoginData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [termsAndServices, setTermsAndServices] = useState(false);
    const [pending, setPending] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        let loginCredentials = handleSignup();
        if (loginCredentials === false) {
            return;
        }
        setPending(true);
        const variables = {
            email: loginData?.email?.toLocaleLowerCase() || '',
            password: loginData?.password || '',
            confirmPassword: loginData?.password || '',
            encodedPassPhrase: ""
        };

        let request = getRequestForApi(global.SIGN_UP_API, variables, methodType.POST);
        await callHttpRequest(request).then(async response => {
            if (response?.status === 201) {
                let data = response?.data?.wallet?.passphrase[0];
                alert.show(data, { type: alertTypes.SUCCESS });
                navigate(path.LOGIN);
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
            console.log('err', err)
        });
    };

    const onLoginResponseReceived = async (token) => {
        setStorageData(storageType, storageKey.TOKEN, token);
        let navTo = await getAdminRoles(token);
        let data = jwtDecodeData(token);
        let obj = {
            themeColor: data?.themeColor || null,
            imageUrl: data?.imageUrl || null,
            displayName: data?.displayName || null,
            displayRole: data?.displayRole || null,
            email: data?.email?.toLocaleLowerCase() || null
        }
        setStorageData(storageType, storageKey.USER_IMG_THEME, JSON.stringify(obj));
        if (navTo) {
            navigate(navTo)
        }
    };

    const handleSignup = () => {
        if (!loginData?.email && !loginData?.password) {
            alert.show(alertMessage.ENTER_CREDENTIALS, { type: alertTypes.ERROR });
            return false;
        }
        if (!loginData?.email) {
            alert.show(alertMessage.ENTER_EMAIL, { type: alertTypes.ERROR });
            return false;
        }
        if (!loginData?.password) {
            alert.show(alertMessage.ENTER_PASSWORD, { type: alertTypes.ERROR });
            return false;
        }
    };

    const signInFirebaseWithRedirect = async (type, provider) => {
        const currentUser = auth.currentUser;
        if (AppUtil.isNotNull(currentUser)) {
            signOutFromFirebase();
            initializeApp(firebaseConfig)
        }
        await signInWithPopup(auth, provider).then(dd => {
            console.log(dd?.['user'], 'dd')
            let user = dd?.['user']
            if (AppUtil.isNotNull(user)) {
                let variable = user['providerData'][0]
                if (variable) {
                    variable['firbaseUid'] = user?.['uid'];
                    variable['provideruid'] = variable['uid'];
                    if (AppUtil.isNullOrEmptyNew(variable['phoneNumber'])) {
                        delete variable['phoneNumber']
                    }
                    delete variable['uid']
                    onForebaseResponseReceived(variable)
                }
            }
        }).catch(err => console.log(err.code, 'err'));
    };

    const signOutFromFirebase = async () => {
        new Promise(function (resolve, reject) { signOut(auth).then((dd) => resolve('success')).catch((error) => resolve('error', error)) })

    };

    const onSocialLoginClick = (type) => {
        switch (type) {
            case 1: signInFirebaseWithRedirect(type, new FacebookAuthProvider()); break;
            case 2: signInFirebaseWithRedirect(type, new GoogleAuthProvider()); break;
        }
    };

    const onForebaseResponseReceived = async (variables) => {
        let request = getRequestForApi(global.USER_FIREBASE_LOGIN, variables, methodType.POST);
        await callHttpRequest(request).then(async response => {
            if (response?.status === 201) {
                let token = response?.data?.token;
                onLoginResponseReceived(token);
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
            console.log('err', err)
        });
    };

    return (
        <div className="form-content" id="formLogin">
            <h1 id="formHead">Sign up</h1>
            <div className="flex-row">
                <div className="media-options" onClick={() => onSocialLoginClick(1)}>
                    <a className="button facebook">
                        <span><b>Sign up with Facebook</b></span>
                    </a>
                </div>

                <div className="media-options" onClick={() => onSocialLoginClick(2)}>
                    <a className="button google">
                        <span><b>Sign up with Google</b></span>
                    </a>
                </div>
            </div>
            <div className="line"></div>
            <form onSubmit={onSubmit}>
                <div className="field input-field">
                    <label htmlFor="email">Email</label>
                    <CustomInput fieldType={"email"} setFieldData={setLoginData} filedData={loginData} keyName={'email'} />
                    <h5 className='warninig'>{loginData && loginData?.email !== '' && !loginData?.isValid ? errorMessages.ENTER_VALID_EMAIL : ''}</h5>
                </div>
                <div className="field input-field">
                    <label htmlFor="password">Password</label>
                    <CustomInput fieldType={showPassword ? "text" : "password"} setFieldData={setLoginData} filedData={loginData} keyName={'password'} />
                    <h5 className='warninig'>{loginData?.password && !loginData?.isPasswordValid ? errorMessages.PASSWORD : ''}</h5>
                </div>
                <div className="form-link">
                    <div className="check_box"><input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} /> <span>Show Password</span></div>
                </div><div className="form-link">
                    <div className="check_box"><input type="checkbox" checked={termsAndServices} onChange={() => setTermsAndServices(!termsAndServices)} /> <span> I agree to the<Link to={path.SIGN_UP}>Terms of Service </Link>and<Link to={path.SIGN_UP}>Privacy Policy</Link></span></div>
                </div>
                <div className={`field button-field ${!termsAndServices ? "disableButton" : !loginData?.isPasswordValid ? "disableButton" : ""}`}>
                    <button type='submit'>Create account</button>
                </div>
            </form>
            <div className="form-signup" >
                <span>Already have an account?
                    <Link to={path.LOGIN} className="link signup-link" id="signupPage"> Log in</Link></span>
            </div>
            {pending ? <CustomLoader /> : <></>}
        </div>
    )
}

export default SignUp