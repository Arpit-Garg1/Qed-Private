import axios from 'axios';
import { storageKey, getStorageData, storageType } from '../_helperFunctions/HelperFunctions';
export let source = axios.CancelToken.source();
export const resetSource = () => {
    source = axios.CancelToken.source();
}
export const ApiHelper = () => {
    let apiHelper = axios.create();
    apiHelper.interceptors.request.use(function (config) {
        config.cancelToken = source.token;
        const token = getStorageData(storageType,storageKey.TOKEN);
        if (token) {
            config.headers.Authorization =  `Bearer ${token}`;
        }
        return config;
    });
  
    apiHelper.interceptors.response.use((response) => {
        if(response.status === 401) {
            localStorage.clear()
        }
        return response;
    });

    return apiHelper;
}
export default ApiHelper()
