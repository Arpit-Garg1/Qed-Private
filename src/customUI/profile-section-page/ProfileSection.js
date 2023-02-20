import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import { alertMessage, alertTypes, handleFileUpload, handleIsDirtyForm, imageType, modelTypes, roleTypes, setStorageData, storageKey, storageType } from '../../_helperFunctions/HelperFunctions';
import ConfirmationPopup from '../confirmation-popup/ConfirmationPopup';
import CustomInput from '../custom-input-ui/CustomInput';
import $ from 'jquery';
import "react-color-palette/lib/css/styles.css";
import * as AppUtil from '../../Util/AppUtil';
import CustomLoader from '../custom-loader/CustomLoader';
import { useHookstate } from '@hookstate/core';
import { USER_UPDATED } from '../../globalStates/globalStates';
import * as global from '../../constants/global';
import { Userprofile } from '../../svgimages/svg';

function ProfileSection() {
    const [clonedData, setClonedData] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [imageList, setImageList] = useState(null);
    const [pending, setPending] = useState(false);
    const { user_updated } = useHookstate(USER_UPDATED);
    const alert = useAlert();

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        setPending(true);
        let request = getRequestForApi(global.GET_USER_DATA, undefined, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                let data = response?.data?.userData;
                let obj = {
                    themeColor: data?.themeColor || null,
                    imageUrl: data?.imageUrl || null,
                    displayName: data?.displayName || null,
                    displayRole: data?.displayRole || null,
                    email: data?.email?.toLocaleLowerCase() || null,
                    newData: true
                }
                setStorageData(storageType, storageKey.USER_IMG_THEME, JSON.stringify(obj));
                user_updated.set(false);
                data.themeColor = data.themeColor
                setUserDetails(data);
                setClonedData(data);
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            setPending(false);
            console.log('err', err)
        })
    };

    const updateUserData = async (e) => {
        let variables = {
            id: userDetails?.id,
            firstName: userDetails?.firstName || '',
            lastName: userDetails?.lastName || '',
            orgName: userDetails?.Org?.name || '',
            themeColor: userDetails?.themeColor || '',
            // logoImageUrl: fileData
        };
        e.preventDefault();
        let request = getRequestForApi(global.UPDATE_USER_DATA, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                alert.show(alertMessage.USER_SUCCESS, { type: alertTypes.SUCCESS });
                user_updated.set(true);
                if (fileData) {
                    saveImages(userDetails?.Org?.id);
                } else {
                    getUserData();
                }
                $('.model').fadeOut();
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            console.log('err', err)
        })
    };

    const saveImages = async (modelId) => {
        let payload = []
        if (fileData) {
            payload = [...fileData];
            payload = payload[0]?.moduleId == undefined ?
                payload.map((item) => {
                    return { ...item, moduleId: `${modelId}` }
                }) : fileData;
        }
        let request = getRequestForApi(global.UPLOAD_FILES_API, payload, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (response?.status === 201) {
                getUserData();
            } else {
                console.log('err', response);
            }
        }).catch((err) => {
            console.log('err', err)
        });
    };

    const fileUpload = async (event, uploadType) => {
        if (!AppUtil.isListNullOrEmpty(imageList)) {
            imageList.splice(0, 1);
        }
        setImageList(imageList);
        setFileData(imageList);
        setUserDetails({ ...userDetails, imageList })
        let uploadData = await handleFileUpload(event, userDetails?.orgId, "Organization", imageList, uploadType);
        setFileData(uploadData?.uploadFilesData);
        setImageList([...uploadData?.imageFilesData]);
        setUserDetails({ ...userDetails, imageList: uploadData?.uploadFilesData })
    };

    return (
        <div className="mainContent-accountDiv2">
            <div className="text-account">
                <h3>Profile</h3>
                <p className="text-accountPara"> Update your information below</p>
            </div>
            <div className="mainContent-accountDiv2-subDiv">
                {imageType.USER_PROFILE_IMAGE}
            </div>
            <div className="modal-field account-field">
                {AppUtil.isNotNull(userDetails) ?
                    <form className='profileForm' onSubmit={updateUserData}>
                        <div className="fields">
                            <div className="field">
                                <label htmlFor="make">First Name</label>
                                <CustomInput fieldType={"text"} setFieldData={setUserDetails} filedData={userDetails} keyName={'firstName'} />
                            </div>
                        </div>
                        <div className="fields">
                            <div className="field">
                                <label htmlFor="make">Last Name</label>
                                <CustomInput fieldType={"text"} setFieldData={setUserDetails} filedData={userDetails} keyName={'lastName'} />
                            </div>
                        </div>
                        {userDetails?.type?.toLowerCase() === roleTypes.MANUFACTURER ? <>
                            <div className="fields">
                                <div className="field">
                                    <label htmlFor="make">Company Name</label>
                                    <CustomInput fieldType={"text"} setFieldData={setUserDetails} filedData={userDetails} keyName={'name'} objKey={'Org'} />

                                </div>
                            </div>
                            <div className="fields">
                                <div className="field">
                                    <label htmlFor="colorPicker">Choose Theme Color</label>
                                    <CustomInput fieldType={"color"} classType={'colorTheme-input'} setFieldData={setUserDetails} filedData={userDetails} keyName={'themeColor'} />
                                </div>

                            </div>
                            {userDetails?.themeColor ?
                                <div className="fields">
                                    <div className="field">
                                        <CustomInput fieldType={"text"} setFieldData={setUserDetails} filedData={userDetails} keyName={'themeColor'} isReadOnly={'true'} />
                                    </div>
                                </div> :
                                <></>
                            }

                            <div className="fields">
                                {
                                    imageList && imageList?.length > 0 ?
                                        <img src={imageList[0].fileUrl || ''} width={400} height={200} alt={`image`} />
                                        : <></>
                                }

                                <div id="ddArea">
                                    Update Logo Image
                                </div>
                                <input name='uploadOption' type="file" accept="image/x-png,image/gif,image/jpeg" className="d-none" id="selectfile" onChange={(event) => fileUpload(event, 0)} />
                            </div>
                        </> : <></>}

                        <div className="modal-footer">
                            <div className="modal-btns">
                                <button type="button" className={`button secondary ${handleIsDirtyForm(clonedData, userDetails) ? 'openModel' : 'disableButton'}`} data-rel={modelTypes.UNSAVED_CHANGES}>Cancel</button>
                                <button type='submit' className={`btnBlue ${handleIsDirtyForm(clonedData, userDetails) ? '' : 'disableButton'}`} >Save changes</button>
                            </div>
                        </div>
                    </form>
                    : <></>}
            </div>

            {/* unsaved changes confirmation model starts */}
            <ConfirmationPopup modelID={modelTypes.UNSAVED_CHANGES} updateSelectedItem={updateUserData} getApiData={getUserData} />
            {/* unsaved changes confirmation model ends */}

            {pending ? <CustomLoader /> : <></>}
        </div>
    )
}

export default ProfileSection