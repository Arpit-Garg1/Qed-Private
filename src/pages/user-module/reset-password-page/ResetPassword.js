import React, { useState } from "react";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import CustomInput from "../../../customUI/custom-input-ui/CustomInput";
import { getRequestForApi } from "../../../Util/CommonRequest";
import { callHttpRequest, methodType } from "../../../Util/HttpRequest";
import  { alertTypes, path } from "../../../_helperFunctions/HelperFunctions";
import * as global from '../../../constants/global';

function ResetPassword() {
  const alert = useAlert();
  const [resetEmail, setResetEmail] = useState(null);
  const onSubmit = async (e) => {
    const variables = {
      email: resetEmail?.email?.toLocaleLowerCase() || ''
    };
    e.preventDefault();
    let request = getRequestForApi(global.FORGET_PASSWORD,variables,methodType.POST);
    await callHttpRequest(request).then(async response => {
      if (response?.status === 201) {
        alert.show(response?.data?.message, { type: alertTypes.SUCCESS });
      }
    }).catch((err) => {
      alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
      console.log('err', err)
    });
  };
  return (
    <div className="form-content" id="formLogin">
      <h1 id="formHead">Reset Password</h1>
      <p className="resetPara">
        Enter the email address associated with your account, and we'll
        email you a link to reset your password.
      </p>
      <form onSubmit={onSubmit}>
        <div className="field input-field">
          <label htmlFor="email">Email</label>
          <CustomInput fieldType={"email"} setFieldData={setResetEmail} filedData={resetEmail}  keyName={'email'} />
        </div>
        <div className="resetBtns">
          <div className="resetBtn1">
            <Link to={path.LOGIN} className="button cancel">
              <span>
                <b>Cancel</b>
              </span>
            </Link>
          </div>
          <div className={`resetBtn2 ${!resetEmail ? 'disableButton' : ''}`}>
            <a  className="button cancel" onClick={(e) => onSubmit(e)}>
              <span>
                <b>Reset Password</b>
              </span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
