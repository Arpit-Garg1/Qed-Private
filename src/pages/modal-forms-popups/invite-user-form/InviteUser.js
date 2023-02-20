import React, { useEffect, useState } from 'react'
import $ from 'jquery';
import CustomInput from '../../../customUI/custom-input-ui/CustomInput'
import { useAlert } from 'react-alert';
import { adminInviteOptions, AGENT_INVITE_OPTIONS, alertMessage, alertTypes, MANUFACTURER_INVITE_OPTIONS, roleTypes, userDetailsType } from '../../../_helperFunctions/HelperFunctions';
import { callHttpRequest, methodType } from '../../../Util/HttpRequest';
import { getRequestForApi } from '../../../Util/CommonRequest';
import CustomLoader from '../../../customUI/custom-loader/CustomLoader';
import * as global from '../../../constants/global';

function InviteUser(props) {
    const { getUsersList, modelID } = props;
    const alert = useAlert();
    const userRole = userDetailsType().USER_ROLE;
    const [userData, setUserData] = useState(null);
    const [organizationList, setOrganizationList] = useState(null);
    const [adminInviteList, setAdminInviteList] = useState(null);
    const [adminUserType, setAdminUserType] = useState(null);
    const [pending, setPending] = useState(null);
    useEffect(() => {
        setInviteOptions()
    }, [userRole]);

    useEffect(() => {
        if (userRole === roleTypes.ADMIN && adminUserType?.id === 'Manufacturer') {
            getOrganizationList();
        } else if (userRole === roleTypes.ADMIN && adminUserType?.id !== 'Manufacturer') {
            setOrganizationList(null);
        }
    }, [adminUserType?.id])

    const closeModel = (data) => {
        $('.model').fadeOut();
        if (data) {
            getUsersList();
        }
        setUserData(null);
        setAdminUserType(null);
        setInviteOptions();
    };

    const setInviteOptions = () => {
        if (userRole === roleTypes.ADMIN) {
            setAdminInviteList(adminInviteOptions);
        } else if (userRole === roleTypes.MANUFACTURER) {
            setOrganizationList(MANUFACTURER_INVITE_OPTIONS);
        } else if (userRole === roleTypes.AGENT) {
            setOrganizationList(AGENT_INVITE_OPTIONS);
        }
    };

    const getOrganizationList = async () => {
        setPending(true);
        let variables = {
            pageNo: 0,
            perPageItem: 0
        };
        let request = getRequestForApi(global.GET_ORGANIZATIONS_LIST_API, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let data = response?.data?.response?.data || [];
                data?.unshift({ id: '', name: 'Select Organization' });
                setOrganizationList(response?.data?.response?.data);
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            setPending(false);
            console.log('err', err);
        });
    };

    const callAdminUserInvite = async (variables) => {
        let request = getRequestForApi(global.ADMIN_USER_INVITE, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response) {
                alert.show(alertMessage.INVITE_SUCCESS, { type: alertTypes.SUCCESS });
                closeModel(response);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err);
        });
    }

    const sendInvite = async () => {
        let variables = {
            email: userData?.email?.toLocaleLowerCase() || ''
        }
        if (userRole === roleTypes.ADMIN && adminUserType?.id) {
            variables.type = adminUserType?.id
            variables.orgId = `${adminUserType?.id !== 'Admin' ? userData?.id : 0}`
        }
        if (userRole !== roleTypes.ADMIN) {
            variables.type = userData?.id ? userData?.id : ''
            variables.orgId = `${0}`
        }
        callAdminUserInvite(variables);
    };

    const getClassType = () => {
        if ((userRole === roleTypes.ADMIN && adminUserType?.id !== 'Manufacturer') && userData?.email !== '' && userData?.isValid) {
            return ''
        } else if ((userRole === roleTypes.ADMIN && adminUserType?.id === 'Manufacturer') && userData?.id && userData?.id !== '' && userData?.email !== '' && userData?.isValid) {
            return ''
        } else if ((userRole !== roleTypes.ADMIN && !adminUserType) && userData?.id && userData?.id !== '' && userData?.email !== '' && userData?.isValid) {
            return ''
        } else if ((userRole === roleTypes.MANUFACTURER_USER) && userData?.id !== '' && userData?.email !== '' && userData?.isValid) {
            return ''
        } else {
            return 'disableButton'
        }
    }

    return (
        <>
            <div className="model" id={modelID}>
                <div className="modelContent">
                    <header>
                        <h5>Invite user</h5>
                    </header>
                    <form action="#">

                        <fieldset className='fieldset'>
                            <div className="modal-content">
                                {userRole === roleTypes.ADMIN ?
                                    <div className="fields">
                                        <div className="field">
                                            <label htmlFor="make">User Type</label>
                                            {adminInviteList && adminInviteList?.length > 0 ?
                                                <CustomInput fieldType={"select"} setFieldData={setAdminUserType} filedData={adminUserType} keyName={'id'} selectList={adminInviteList} /> :
                                                <></>}
                                        </div>
                                    </div> : <></>}
                                {organizationList ? <div className="fields">
                                    <div className="field">
                                        <label htmlFor="make">{userRole === roleTypes.ADMIN ? 'Organizations' : 'User Type'}</label>
                                        {organizationList && organizationList?.length > 0 ?
                                            <CustomInput fieldType={"select"} setFieldData={setUserData} filedData={userData} keyName={'id'} selectList={organizationList} /> :
                                            <></>}
                                    </div>
                                </div> : <></>}
                                <div className="fields">
                                    <div className="field">
                                        <label htmlFor="Model name">Email</label>
                                        <CustomInput fieldType={"email"} isRequired={true} setFieldData={setUserData} filedData={userData} keyName={'email'} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="modal-btns">
                                    <button type="button" className='button secondary' onClick={() => closeModel()}>Cancel</button>
                                    <button type="button" className={`btnBlue ${getClassType()}`} onClick={() => sendInvite()}>Send an invite</button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
            {pending ? <CustomLoader /> : <></>}
        </>
    )
}

export default InviteUser