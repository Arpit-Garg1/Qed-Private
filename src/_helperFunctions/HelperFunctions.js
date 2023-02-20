import { arrayMoveImmutable } from 'array-move';
import { utils, writeFileXLSX } from 'xlsx';
import * as AppUtil from '../Util/AppUtil'
import { strongRegularExp } from '../constants/constants';
import jwt_decode from 'jwt-decode';
import { MakeIcon, ModelIcon, AssetsIcon, UserIcon, CATEGORIESICON, OrganizationIcon, EmailIcon, ProfileIcon, SecurityIcon, DarkLogo, SideLogo, UserPhoto, Loader, Userprofile } from '../svgimages/svg';

export const storageType = 'localStorage';

export const path = {
  USER_PROFILE: '/user-profile',
  SECURITY: '/security',
  CATEGORIES: '/categories',
  ORGANIZATIONS: '/organizations',
  USERS: '/users',
  EMAIL_TEMPLATES: '/emailtemplates',
  MAKES: '/make',
  MODELS: '/model',
  ASSETS: '/assets',
  LOGIN: '/',
  RESET_PASSWORD: '/reset-password',
  ERROR: '*',
  ACCEPT_INVITE: '/accept_invite/',
  CONFIRM_PASSWORD: '/confirm_password/',
  VIEW_LINEAGE: '/view-lineage/',
  LINEAGE_DETAILS: '/lineage-details/',
  LINK_ASSETS: '/link-assets/',
  SIGN_UP: '/signup'
};

export const storageKey = {
  TOKEN: 'token',
  USER_DETAILS: 'user_details',
  USER_IMG_THEME: 'usrthm'
};

export const errorMessages = {
  PASSWORD: 'Password length must be eight characters and must contain special characters.',
  NO_MATCH_PASSWORD: 'Passwords do not match.',
  ENTER_VALID_EMAIL: 'Please enter a valid email.',
  INVITE_ERROR: 'Please select user type. Click on invite button to invite user.'
};

export const defaultMessages = {
  LOADING: 'Please wait...',
  LOGING_IN: 'Loging in...',
  LOGIN: 'Log in'
};

export const roleTypes = {
  ADMIN: 'admin',
  MANUFACTURER: 'manufacturer',
  MANUFACTURER_USER: 'manufactureruser',
  AGENT: 'agent',
  CUSTOMER: 'customer'
};

export const alertTypes = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const alertMessage = {
  ENTER_CREDENTIALS: 'Please enter your credentials',
  ENTER_EMAIL: 'Please enter your email',
  ENTER_PASSWORD: 'Please enter your password',
  TOKEN_GENERATION: 'Token generated successfully',
  BULK_TOKEN_GENERATION: 'Bulk tokens generated successfully',
  CHECK_EMAIL: 'Please check your email',
  SAME_PASSWORD: 'New password and confirm password must be same',
  PASSWORD_UPDATE: 'Password updated successfully',
  MAKE_CREATE: 'Make created successfully',
  MAKE_UPDATE: 'Make updated successfully',
  MAKE_DELETE: 'Make deleted successfully',
  ASSET_CREATE: 'Asset created successfully',
  ASSET_UPDATE: 'Asset updated successfully',
  ASSET_DELETE: 'Asset deleted successfully',
  RULE_CREATE: 'Rule created successfully',
  RULE_UPDATE: 'Rule updated successfully',
  ORGANIZATION_CREATE: 'Organization created successfully',
  ORGANIZATION_UPDATE: 'Organization updated successfully',
  ORGANIZATION_DELETE: 'Organization deleted successfully',
  MODEL_CREATE: 'Model created successfully',
  MODEL_UPDATE: 'Model updated successfully',
  MODEL_DELETE: 'Model deleted successfully',
  EMAIL_TEMPLATE_CREATE: 'Email template created successfully',
  EMAIL_TEMPLATE_UPDATE: 'Email template updated successfully',
  EMAIL_TEMPLATE_DELETE: 'Email template deleted successfully',
  CATEGORY_CREATE: 'Category created successfully',
  CATEGORY_UPDATE: 'Category updated successfully',
  CATEGORY_DELETE: 'Category deleted successfully',
  INVITE_SUCCESS: 'Invite sent successfully',
  USER_SUCCESS: 'User updated successfully',
  ASSET_TOKEN_CREATION: 'Are you sure you would like to create token for this Asset? Creating a token is permanent and irreversible on a blockchain. Please double-check the data you’ve entered before confirming the creation.',
  ASSET_BULK_TOKEN_CREATION: 'Are you sure you would like to create token for these Assets? Creating a token is permanent and irreversible on a blockchain. Please double-check the data you’ve entered before confirming the creation.',
  ASSET_WITHOUT_TOKEN_CREATION: 'Are you sure, you want to create Asset without generating token?',
  ASSET_UPDATE_WITHOUT_TOKEN_CREATION: 'Are you sure, you want to update Asset without generating token?',
  DELETE_CONFIRMATION: 'Do you want to delete this',
  UNSAVED_CHANGES_CONFIRMATION: 'You have unsaved changes. Click on Yes to save changes or click on No to discard the changes and continue.',
  USER_ACTIVATED: 'User activated successfully',
  USER_DEACTIVATED: 'User deactivated successfully',
  SAVE_CHANGES: 'Click on Yes to transfer the asset or click on No to discard and continue.',
  AUTO_GENERATE_BULK: 'Asset can be created in bulk without Serial Number, UPC Code and description.',
  BULK_UPLOAD: 'Asset can be created in bulk entering either Serial Number or UPC Code and description.'
};

export const headerNames = {
  MAKES: 'Makes',
  MODELS: 'Models',
  ASSETS: 'Assets',
  USERS: 'Users',
  EMAIL_TEMPLATES: 'Email Templates',
  ORGANIZATIONS: 'Organizations',
  CATEGORIES: 'Categories',
  LINKED_ASSETS: 'Linked Assets'
};

export const modelTypes = {
  CREATE_MAKES: 'CREATE_MAKES',
  DELETE_MAKES: 'DELETE_MAKES',
  ADD_NEW_MODAL: 'ADD_NEW_MODAL',
  CREATE_MODEL: 'CREATE_MODEL',
  DELETE_MODEL: 'DELETE_MODEL',
  ADD_ASSET: 'ADD_ASSET',
  CREATE_ASSET: 'CREATE_ASSET',
  LINK_BULK_ASSET: 'LINK_BULK_ASSET',
  DELETE_ASSET: 'DELETE_ASSET',
  TOKEN_CONFIRMATION: 'TOKEN_CONFIRMATION',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  CREATE_TEMPLATE: 'CREATE_TEMPLATE',
  DELETE_TEMPLATE: 'DELETE_TEMPLATE',
  CREATE_ORGANIZATION: 'CREATE_ORGANIZATION',
  DELETE_ORGANIZATION: 'DELETE_ORGANIZATION',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  UNSAVED_CHANGES: 'UNSAVED_CHANGES',
  ACTIVATE_DEACTIVATE_USER: 'ACTIVATE_DEACTIVATE_USER',
  CREATE_ASSET_RULES: 'CREATE_ASSET_RULES',
  CREATE_RULES: 'CREATE_RULES',
  LINK_ASSETS: 'LINK_ASSETS',
  INVITE_USERS: 'INVITE_USERS',
  ASSET_TRANSFER: 'ASSET_TRANSFER',
  ASSET_TRANSFER_CONFIRMATION: 'ASSET_TRANSFER_CONFIRMATION'
};

export const adminInviteOptions = [
  { id: '', name: 'Select User Type' }, { id: 'Admin', name: "QED Admin" }, { id: "Manufacturer", name: "Manufacturer Admin" }
]

export const MANUFACTURER_INVITE_OPTIONS = [
  { id: '', name: 'Select User Type' }, { id: 'ManufacturerUser', name: 'Manufacturer User' }, { id: 'Agent', name: 'Agent' }, { id: 'Customer', name: 'Customer' }
];

export const AGENT_INVITE_OPTIONS = [
  { id: '', name: 'Select User Type' }, { id: 'AgentUser', name: 'Agent User' }, { id: 'Customer', name: 'Customer' }
];

export const CUSTOMER_INVITE_OPTIONS = [
  { id: '', name: 'Select User Type' }, { id: 'Customer', name: 'Customer' }
];

export const imageType = {
  LOGO: require("../assets/images/Logo.svg").default,
  DARK_LOGO: <DarkLogo />,
  USER_PROFILE: <UserPhoto />,
  USER_PROFILE_IMAGE: <Userprofile />,
  SIDENAV_LOGO: <SideLogo />,
  LOADER: require('../assets/images/Circle-Loading.svg').default,
  REMOVE: require("../assets/images/remove.svg").default,
  LOAD_GIF: <Loader />,
  USER_ICON: <UserIcon />,
  MAKE_ICON: <MakeIcon />,
  MODEL_ICON: <ModelIcon />,
  ASSETS_ICON: <AssetsIcon />,
  EMAIL_ICON: <EmailIcon />,
  CATEGORIES_ICON: <CATEGORIESICON />,
  ORGANIZATIONS_ICON: <OrganizationIcon />,
  PROFILE_ICON: <ProfileIcon />,
  LOGOUT_ICON: require('../assets/images/logout.svg').default,
  SECURITY_ICON: <SecurityIcon />,
  LINEAGE_ASSETS: require('../assets/images/lineage-assets.svg').default,
  LINEAGE_DETAILS: require('../assets/images/lineage-details.svg').default,
  LINEAGE_VIEW: require('../assets/images/lineage-view.svg').default,
  DARK_SCREEN_TYPE: require('../assets/images/dark-screen_banner3.jpg')
};

export const sideNavOptions = {
  ADMIN_SIDENAV_OPTIONS: [
    { id: 1, path: path.CATEGORIES, componentName: 'Categories', image_link: imageType.CATEGORIES_ICON },
    { id: 2, path: path.ORGANIZATIONS, componentName: 'Organizations', image_link: imageType.ORGANIZATIONS_ICON },
    { id: 4, path: path.USERS, componentName: 'Users', image_link: imageType.USER_ICON },
    { id: 5, path: path.EMAIL_TEMPLATES, componentName: 'Email Templates', image_link: imageType.EMAIL_ICON }
  ],
  MANUFACURER_SIDENAV_OPTIONS: [
    { id: 1, path: path.MAKES, componentName: 'Makes', image_link: imageType.MAKE_ICON },
    { id: 2, path: path.MODELS, componentName: 'Models', image_link: imageType.MODEL_ICON },
    { id: 3, path: path.ASSETS, componentName: 'Assets', image_link: imageType.ASSETS_ICON },
    { id: 4, path: path.USERS, componentName: 'Users', image_link: imageType.USER_ICON },
    { id: 5, path: path.EMAIL_TEMPLATES, componentName: 'Email Templates', image_link: imageType.EMAIL_ICON }
  ],
  MANUFACURER_USER_SIDENAV_OPTIONS: [
    { id: 1, path: path.MAKES, componentName: 'Makes', image_link: imageType.MAKE_ICON },
    { id: 2, path: path.MODELS, componentName: 'Models', image_link: imageType.MODEL_ICON },
    { id: 3, path: path.ASSETS, componentName: 'Assets', image_link: imageType.ASSETS_ICON },
    { id: 4, path: path.USERS, componentName: 'Users', image_link: imageType.USER_ICON },
  ],
  AGENT_SIDENAV_OPTIONS: [
    { id: 1, path: path.MAKES, componentName: 'Makes', image_link: imageType.MAKE_ICON },
    { id: 2, path: path.MODELS, componentName: 'Models', image_link: imageType.MODEL_ICON },
    { id: 3, path: path.ASSETS, componentName: 'Assets', image_link: imageType.ASSETS_ICON },
  ],
  CUSTOMER_SIDENAV_OPTIONS: [
    { id: 3, path: path.ASSETS, componentName: 'My Assets', image_link: imageType.ASSETS_ICON },
  ],
  PROFILE_OPTIONS: [
    { id: 1, path: path.USER_PROFILE, componentName: 'Profile', image_link: imageType.PROFILE_ICON },
    { id: 2, path: path.SECURITY, componentName: 'Log in & security', image_link: imageType.SECURITY_ICON },
  ]
};

export const numberGenerator = () => {
  let num = Date.now() + Math.random()
  return Math.round(num)
};

export const encryptData = (data) => {
  return window.btoa(data)
};

export const jwtDecodeData = (data) => {
  return jwt_decode(data)
};

export const decryptData = (data) => {
  return window.atob(data)
};

export const setStorageData = (storage, key, data) => {
  if (storage === 'localStorage') {
    localStorage.setItem(key, data);
  } else {
    sessionStorage.setItem(key, data);
  }
};

export const getStorageData = (storage, key) => {
  if (storage === 'localStorage') {
    return localStorage.getItem(key);
  } else {
    return sessionStorage.getItem(key);
  }
};

export const getAdminRoles = async (userToken) => {
  let url = "";
  let decodedToken = userToken ? jwtDecodeData(userToken) : null;
  if (decodedToken) {
    switch (decodedToken?.type?.toLocaleLowerCase()) {
      case roleTypes.ADMIN:
        url = path.CATEGORIES;
        break;
      case roleTypes.CUSTOMER:
        url = path.ASSETS;
        break;
      default:
        url = path.MAKES;
        break;
    }
  } else {
    url = path.LOGIN;
  }
  return url;
};

export const handleIsDirtyForm = (previousData, newData) => {
  let isDirty = JSON.stringify(previousData) !== JSON.stringify(newData);
  return isDirty;
};

export const userDetailsType = () => {
  let userDetailsType = {};
  var decoded = {};
  if (getStorageData(storageType, storageKey.TOKEN)) {
    decoded = jwtDecodeData(getStorageData(storageType, storageKey.TOKEN))
    if (decoded) {
      userDetailsType.USER_DATA = decoded;
      userDetailsType.USER_ROLE = decoded?.type?.toLocaleLowerCase();
    }
  };
  return userDetailsType
};

export const handleFileUpload = async (event, moduleId, moduleName, imageList, uploadType) => {
  let uploadFilesData = [];
  let imageFilesData = imageList ? imageList : [];
  if (!AppUtil.isListNullOrEmpty(imageList)) {
    console.log(imageList);
    uploadFilesData = Array.from(imageList, (element, index) => {
      return {
        moduleId: moduleId ? `${moduleId}` : '',
        module: moduleName,
        fileName: element?.fileName,
        ordBy: index,
        uploadType: element.uploadType,
        byteArray: element.fileUrl?.includes(',') ? getBuffer(element.fileUrl) : element.fileUrl,
      }
    })
    console.log(uploadFilesData);
  }
  let filesData = event.target.files;
  for (let index = 0; index < filesData?.length; index++) {
    let image = filesData[index];
    let fileName = filesData[index].name;
    let buffer = await convertBase64(image);
    imageFilesData.push({ fileUrl: buffer, fileName, uploadType });
    uploadFilesData.push({
      moduleId: moduleId ? `${moduleId}` : '',
      module: moduleName,
      fileName: fileName,
      ordBy: index,
      uploadType,
      byteArray: getBuffer(buffer),
    });
  }
  uploadFilesData.forEach((element, index) => {
    element.ordBy = index
  });
  return { uploadFilesData, imageFilesData };
};

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      let baseURL = fileReader.result
      resolve(baseURL);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const getBuffer = (buffer) => {
  let bufferNew = buffer?.split(",");
  if (bufferNew.length >= 1) {
    bufferNew = bufferNew[1];
  }
  return bufferNew;
}

export const handleImageFilesUpload = async (fileData, oldIndex, newIndex, event) => {
  if (!fileData) {
    return;
  }
  if (event === 'left' || event === 'right') {
    fileData = arrayMoveImmutable(fileData, oldIndex, newIndex);
  }
  if (event === 'remove') {
    fileData.splice(oldIndex, 1);
  };
  return fileData
};

export const isProfileMenu = (location) => {
  let profileMenu = false;
  if (location?.pathname === path?.USER_PROFILE) {
    profileMenu = true;
  }
  if (location?.pathname === path?.SECURITY) {
    profileMenu = true;
  }
  return profileMenu
};

export const writeXLSFileFromJson = async (jsonArray, fileName) => {
  if (!AppUtil.isListNullOrEmpty(jsonArray)) {
    const ws = utils.json_to_sheet(jsonArray);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "QEDValt");
    writeFileXLSX(wb, fileName);
    //https://docs.sheetjs.com/docs/demos/react/
  }
};

export const exportFinalArray = async (array, keys, objectKeys, filename) => {
  if (!AppUtil.isListNullOrEmpty(array)) {
    let arr = []
    await array.forEach((element, index) => {
      let obj = {}
      obj['S. No'] = index + 1;
      keys.forEach(key => {
        obj[key] = element[key]
      });
      if (objectKeys) {
        objectKeys.forEach(key => {
          let value = element[key] ? element[key]['name'] : null;
          if (key == 'Brand') {
            obj['Make'] = value;
          } else {
            obj[key] = value;
          }
        });
      }
      arr.push(obj);
    });
    writeXLSFileFromJson(arr, filename)
  }
}

export const viewOnlyAccess = (headerName) => {
  const userRole = userDetailsType().USER_ROLE;
  switch (userRole) {
    case roleTypes.ADMIN:
      return false;
    case roleTypes.MANUFACTURER:
      return false;
    case roleTypes.MANUFACTURER_USER:
      return false;
    case roleTypes.AGENT:
      return true;
    case roleTypes.CUSTOMER:
      return true;
  }
};

export const checkPasswordSensitivity = (data) => {
  return strongRegularExp.test(data)
}