import { methodType } from "./HttpRequest";
import * as global from '../constants/global';

let config = {
    headers: {
        'Accept': 'application/json'
    }
};

export class RequestModel {
    config;
    methodType;
    parameters;
    url;
    body;
    headers = {};
    constructor() {
        this.setDefaultHeaders();
        this.methodType = methodType.GET;
        this.config = config;
        this.parameters = undefined;
        this.url = global.BASE_URL;//LOCAL_BASE_URL // BASE_URL
    }

    setDefaultHeaders() {
        this.addHeaders("Content-Type", "application/json")
    }
    addHeaders(key, value) {
        this.headers[key] = value;
    }
}

export const getRequestForApi = (url,parameters, methodTypeName) => {
    let request = new RequestModel();
    request.body = parameters;
    request.methodType = methodTypeName;
    request.url = url;
    return request;
}

// export const callLoginApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.USER_LOGIN;
//     return request;
// }

// export const callForgetPasswordApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.FORGET_PASSWORD;
//     return request;
// }

// export const callResetPasswordApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.RESET_PASSWORD;
//     return request;
// }

// export const callMakeListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_MAKE_LIST;
//     return request;
// }

// export const callCategoriesListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_CATEGORIS_LIST;
//     return request;
// }

// export const callCreateCategoryApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_CATEGORY;
//     return request;
// }

// export const callUpdateCategoryApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.PUT;
//     request.url = global.UPDATE_CATEGORY;
//     return request;
// }

// export const callDeleteCategoryApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.DELETE;
//     request.url = global.UPDATE_CATEGORY;
//     return request;
// }

// export const callCreateMakeApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_MAKE;
//     return request;
// }

// export const callUpdateMakeApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.PUT;
//     request.url = global.UPDATE_MAKE;
//     return request;
// }

// export const callDeleteMakeApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.DELETE;
//     request.url = global.UPDATE_MAKE;
//     return request;
// }

// export const callModelListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_MODEL_LIST;
//     return request;
// }

// export const callCategorySearchListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_CATEGORY_SEARCH_RESULTS;
//     return request;
// }

// export const callMakeSearchListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_MAKE_SEARCH_RESULTS;
//     return request;
// }

// export const callModelSearchListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_MODEL_SEARCH_RESULTS;
//     return request;
// }

// export const callCreateModelApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_MODEL;
//     return request;
// }

// export const callUpdateModelApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.PUT;
//     request.url = global.UPDATE_MODEL;
//     return request;
// }

// export const callDeleteModelApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.DELETE;
//     request.url = global.UPDATE_MODEL;
//     return request;
// }

// export const callGetRulesByModuleIdApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_RULES_BY_MODULE_ID;
//     return request;
// }

// export const callCreateModelRulesApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_MODEL_RULES_API;
//     return request;
// }

// export const callUpateModelRulesApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.PUT;
//     request.url = global.UPATE_MODEL_RULES_API;
//     return request;
// }

// export const callCreateModelRuleById = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.PUT;
//     request.url = global.CREATE_MODEL_RULE_BY_ID_API;
//     return request;
// }

// export const callOrganizationApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_ORGANIZATIONS_LIST_API;
//     return request;
// }

// export const callOrganizationSearchListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_ORGANIZATIONS_SEARCH_RESULTS;
//     return request;
// }

// export const callCreateOrganizationApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_ORGANIZATION;
//     return request;
// }

// export const callUpateOrganizationApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.PUT;
//     request.url = global.UPDATE_ORGANIZATION;
//     return request;
// }

// export const callDeleteOrganizationApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.DELETE;
//     request.url = global.DELETE_ORGANIZATION;
//     return request;
// }

// export const callAllUsersByRoleApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_USERS_BY_ROLE;
//     return request;
// }

// export const callUserSearchListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_USERS_SEARCH_RESULTS;
//     return request;
// }

// export const calladdNewUploadFilesApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.UPLOAD_FILES_API;
//     return request;
// }

// export const callAllAttachmentFilesList = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_ALL_ATTACHMENT_FILES_LIST;
//     return request;
// }

// export const callAllAssetsList = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_ALL_ASSETS_LIST;
//     return request;
// }

// export const callLinkUnlinkAssetsApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_ALL_ASSETS_LIST;
//     return request;
// }

// export const callGenrateBulkTokenApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_BULK_ASSET_TOKEN;
//     return request;
// }

// export const applyRuleOnMultipleAssetApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.APPLY_RULE_ON_MULTIPLE_ASSET;
//     return request;
// }

// export const callAssetSearchListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_ALL_ASSETS_LIST;
//     return request;
// }

// export const callDeleteAssetApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.DELETE_ASSET;
//     return request;
// }

// export const callCreateAssetApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_ASSET;
//     return request;
// }

// export const callExcelDownloadAssetBulkApi = (uuid) => {
//     let request = new RequestModel();
//     request.body = uuid;
//     request.methodType = methodType.POST;
//     request.url = global.GET_BULK_LIST_EXCEL;
//     return request;
// }

// export const callCreateBulkAssetApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_BULK_ASSET;
//     return request;
// }

// export const callUpdateAssetApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.UPATE_ASSET;
//     return request;
// }

// export const getModelByMakeIdApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_MODEL_BY_MAKE_ID;
//     return request;
// }

// export const callEmailTemplateListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_EMAIL_TEMPLATE_LIST;
//     return request;
// }

// export const callCreateEmailTemplateApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_EMAIL_TEMPLATE;
//     return request;
// }

// export const callUpdateEmailTemplateApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.PUT;
//     request.url = global.UPDATE_EMAIL_TEMPLATE;
//     return request;
// }

// export const callDeleteEmailTemplateApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.DELETE;
//     request.url = global.UPDATE_EMAIL_TEMPLATE;
//     return request;
// }

// export const callEmailTemplateSearchListApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_EMAIL_TEMPLATE_SEARCH_RESULTS;
//     return request;
// }

// export const callCreateAssetTokenGenerateApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CREATE_ASSET_TOKEN;
//     return request;
// }

// export const callApplyRuleOnAssetApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.APPLY_RULE_ON_ASSET;
//     return request;
// }

// export const callActivateDeactivateUserApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.ACTIVATE_DEACTIVATE_USER;
//     return request;
// }

// export const callGeneratePassphraseApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.GET;
//     request.url = global.GENERATE_PASSPHRASE;
//     return request;
// }

// export const callUserInviteAcceptedApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.USER_INVITE_ACCEPTED;
//     return request;
// }

// export const callAdminUserInviteApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.ADMIN_USER_INVITE;
//     return request;
// }

// export const callAdminUserInviteUserApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.ADMIN_USER_INVITE_USER;
//     return request;
// }

// export const callGetUserDataApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.GET_USER_DATA;
//     return request;
// }

// export const callUpdateUserDataApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.UPDATE_USER_DATA;
//     return request;
// }

// export const callAssetProductDetailsApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.ASSET_PRODUCT_DETAILS;
//     return request;
// }

// export const callChangePasswordApi = (parameters) => {
//     let request = new RequestModel();
//     request.body = parameters;
//     request.methodType = methodType.POST;
//     request.url = global.CHANGE_PASSWORD;
//     return request;
// }