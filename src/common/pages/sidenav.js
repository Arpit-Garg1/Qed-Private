import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useHookstate } from '@hookstate/core';
import { USER_UPDATED } from '../../globalStates/globalStates';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import * as global from '../../constants/global';
import { getStorageData, imageType, isProfileMenu, path, roleTypes, setStorageData, sideNavOptions, storageKey, storageType, userDetailsType } from '../../_helperFunctions/HelperFunctions';
import { SideLogo } from '../../svgimages/svg';

function Sidenav() {
  const location = useLocation();
  const { user_updated } = useHookstate(USER_UPDATED);
  const [sideNavData, setSideNavData] = useState(null);
  const userRole = userDetailsType().USER_ROLE;
  const userData = userDetailsType().USER_DATA;
  const [indexx, setIndexx] = useState(0);
  const userDetails = JSON.parse(getStorageData(storageType, storageKey.USER_IMG_THEME)) || null;
  const themColor = userDetails?.themeColor ? userDetails?.themeColor : '#0d1d2b';

  useEffect(() => {
    if (userRole !== roleTypes.ADMIN && userRole !== roleTypes.MANUFACTURER && userRole !== roleTypes.MANUFACTURER_USER) {
      if (indexx && location.pathname !== path.USER_PROFILE && location.pathname !== path.SECURITY) {
        getUserData();
      }
    }
  }, [indexx]);

  useEffect(() => {
    if (user_updated.get()) {
      getUserData();
    }
  }, [user_updated.get()]);

  useEffect(() => {
    getAdminSideNav();
  }, [userRole]);

  const getAdminSideNav = () => {
    if (userRole === roleTypes.ADMIN && !isProfileMenu(location)) {
      setSideNavData(sideNavOptions.ADMIN_SIDENAV_OPTIONS);
    }
    if (userRole === roleTypes.MANUFACTURER && !isProfileMenu(location)) {
      setSideNavData(sideNavOptions.MANUFACURER_SIDENAV_OPTIONS);
    }
    if (userRole === roleTypes.MANUFACTURER_USER && !isProfileMenu(location)) {
      setSideNavData(sideNavOptions.MANUFACURER_USER_SIDENAV_OPTIONS);
    }
    if (userRole === roleTypes.AGENT && !isProfileMenu(location)) {
      setSideNavData(sideNavOptions.AGENT_SIDENAV_OPTIONS);
    }
    if (userRole === roleTypes.CUSTOMER && !isProfileMenu(location)) {
      setSideNavData(sideNavOptions.CUSTOMER_SIDENAV_OPTIONS);
    }
    if (isProfileMenu(location)) {
      setSideNavData(sideNavOptions.PROFILE_OPTIONS);
    }
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
        };
        setStorageData(storageType, storageKey.USER_IMG_THEME, JSON.stringify(obj));
        user_updated.set(false);
      }
    }).catch((err) => {
      console.log('err', err)
    })
  };

  return (
    <>
      <div className="navContainer" style={{ background: themColor }}>
        <div className={userDetails?.imageUrl ? 'sidenav-logo' : 'logo'}>
          <Link to={userRole === roleTypes.ADMIN ? path.CATEGORIES : userRole === roleTypes.CUSTOMER ? path.ASSETS : path.MAKES}>
            {userDetails?.imageUrl ?
              <img className='sidenav-img' src={userDetails?.imageUrl} alt="userDetails" /> :
              imageType.SIDENAV_LOGO
            }
          </Link></div>
        <nav>
          <h5>{userDetails?.displayRole?.toLocaleUpperCase() || 'DASHBOARD'}</h5>
          <ul className="nav">
            {sideNavData?.length > 0 ? sideNavData.map((data, index) => {
              return <li key={`${index}_${data.path}`} onClick={() => setIndexx(index + 1)}><Link to={data.path}>{data.image_link} {data.componentName}</Link></li>
            }) : <></>}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sidenav