import * as AppUtil from './AppUtil';
// import jwt from 'jwt-decode'
import jwt_decode from "jwt-decode";


   export const storageType = 'localStorage';

   export const getAuthToken = () => {
    return getItem(KEYS.TOKEN, storageType);
  }

   export const saveToken = (token) => {
    setItem(KEYS.TOKEN, token, storageType);
  }

  export const saveUserCurrentRoleData = (roldeData) => {
    setItem(KEYS.USER_CURRNT_ROLE_DATA, JSON.stringify(roldeData), storageType);
  }
  export const getUserCurrentRoleData = () => {
    if(!AppUtil.isNullOrEmptyNew(getItem(KEYS.USER_CURRNT_ROLE_DATA, storageType))) {
      return JSON.parse(getItem(KEYS.USER_CURRNT_ROLE_DATA, storageType))
    }
    return null;
  }

  export const saveUserCurrentSideMenu = (sideMenu) => {
    setItem(KEYS.USER_CURRNT_SIDE_MENU, sideMenu, storageType);
  }
  export const getUserCurrentSideMenu = () => {
    if(!AppUtil.isNullOrEmptyNew(getItem(KEYS.USER_CURRNT_SIDE_MENU, storageType))) {
      return JSON.parse(getItem(KEYS.USER_CURRNT_SIDE_MENU, storageType))
    }
    return null;
  }

  export const setUserData = (data) => {
    setItem(KEYS.USER_DATA, data, storageType);
  }

  export const getUserData = () => {
    if (AppUtil.isNotNull(getItem(KEYS.USER_DATA, storageType))) {
      return jwt_decode(getItem(KEYS.USER_DATA, storageType));
    }
    return undefined;
  }

   export const getUserName = () => {
    if (AppUtil.isNotNull(getItem(KEYS.TOKEN, storageType))) {
      return jwt_decode(getItem(KEYS.TOKEN, storageType)).sub;
    }
    return 0;
  }

  export const getUserId = () => {
    if (AppUtil.isNotNull(getItem(KEYS.USER_DATA, storageType))) {
      return JSON.parse(getItem(KEYS.USER_DATA, storageType)).userId;
    }
    return 0;
  }

  export const getCurrentUserRole = () => {
    if (AppUtil.isNotNull(getItem(KEYS.TOKEN, storageType))) {
      return jwt_decode(getItem(KEYS.TOKEN, storageType)).roles;
    }
    return '';
  }

  export const isAdmin = () => {
    return getCurrentUserRole().toLowerCase().includes('admin');
  }

  export const isCentralPlanningUser = () => {
    return getCurrentUserRole().toLowerCase().includes('central planning');
  }

  export const isStoreOprtaionManager = () => {
    return getCurrentUserRole().toLowerCase().includes('manager');
  }

  export const isCustomerSupport = () => {
    return getCurrentUserRole().toLowerCase().includes('customer');
  }

  export const isOtherUser = () => {
    return !isAdmin() && !isStoreOprtaionManager() && !isCustomerSupport();
  }

   export const logoutUser = () => {
    clearAllData();
  }

   export const clearDataFromStorage = (key) => {
    if (storageType === 'localStorage') {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  }

   export const clearAllData = () => {
    // let keys = Object.keys(localStorage);
    // keys.forEach(element => {
    //   if(element !== KEYS.SAVE_MOST_RECENT_SEARCH_DATA) {
    //     clearDataFromStorage(element);
    //   }
    // });
    sessionStorage.clear();
    localStorage.clear();
  }



   export const setItem = (key, value, type) => {
    if (type === 'localStorage') {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  }
   export const getItem = (key, type) => {
    if (type === 'localStorage') {
      return localStorage.getItem(key);
    } else {
      return sessionStorage.getItem(key);
    }
  }

export const KEYS = {
  TOKEN:'token',
  USER_ID:'userId',
  USER_NAME:'userFstLstName',
  USER_DATA:'userData',
  AGENT_LO_USER_ID:'agentLoUserId',
  FLOIFY_LINK:'floifyLink',
  SAVE_USER_DATA:'saveUserData',
  IS_USER_LOGIN:'isUserLogin',
  USER_CURRNT_ROLE_DATA:'currentRoleData',
  USER_CURRNT_SIDE_MENU:'currentSideMenu'
}
