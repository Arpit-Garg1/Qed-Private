import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import { useHookstate } from '@hookstate/core';
import { getStorageData, imageType, path, setStorageData, storageKey, storageType } from '../../_helperFunctions/HelperFunctions'
import { USER_UPDATED } from '../../globalStates/globalStates';
import * as global from '../../constants/global';
import { Logout, Profile, UserPhoto } from '../../svgimages/svg';



function Header() {
  const navigate = useNavigate();
  const { user_updated } = useHookstate(USER_UPDATED);
  const userDetails = JSON.parse(getStorageData(storageType, storageKey.USER_IMG_THEME)) || null;

  useEffect(() => {
    if (user_updated.get()) {
      getUserData();
    }
  }, [user_updated.get()]);

  const handleEvent = () => {
    localStorage.clear()
    navigate('/')
  };

  const getUserData = async () => {
    let request = getRequestForApi(global.GET_USER_DATA, undefined, methodType.POST);
    await callHttpRequest(request).then(response => {
      if (response?.status === 201) {
        let data = response?.data?.userData;
        let obj = {
          themeColor: data?.themeColor || null,
          imageUrl: data?.imageUrl || null,
          displayName: data?.displayName || null,
          displayRole: data?.displayRole || null,
          email: data?.email?.toLocaleLowerCase() || null
        }
        setStorageData(storageType, storageKey.USER_IMG_THEME, JSON.stringify(obj));
        user_updated.set(false);
      }
    }).catch((err) => {
      console.log('err', err)
    })
  };
  return (
    <>
      <div className="topheader">
        <div className="row-flex flex-justify-space-between">
          <div className="sidebarToggle"><span className="icon"><i className="open"> &#9776;</i> <i className="close">&times;</i></span> <div className="mobileLogo"><a ><img src={imageType.LOGO} alt="" /></a></div></div>
          <div className="ProfilethumbContainer">
            <div className="row-flex">
              <div className="portalLink"><a >{userDetails?.displayName ? userDetails?.displayName?.toLocaleUpperCase() : 'User Portal'}</a></div>
              <div className="thumb">
                <div className="icon hasDropdown">
                  <div className='profile-img'>
                    {imageType.USER_PROFILE}
                  </div>
                  <div className="dropDown">
                    <ul className="dropdown">
                      <li><Link to={path.USER_PROFILE}>
                        {imageType.PROFILE_ICON} My account
                      </Link></li>
                      <li value='logout' onClick={() => handleEvent()}><a >
                        <Logout /> Log Out
                      </a></li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header