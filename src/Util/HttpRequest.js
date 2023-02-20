import * as AppUtil from './AppUtil'
import ApiHelper from "../config/ApiHelper";
export const methodType = {
    POST : 'POST',
    GET : 'GET',
    DELETE : 'DELETE',
    UPDATE : 'UPDATE',
    PUT : 'PUT',
    PATCH : 'PATCH',
}

export const callHttpRequest = (data) => {
    // jwtKey is null then get request will be send without header, ie for public urls
    // if(!AppUtil.isNullOrEmpty(jwtKey)){
    //     ApiHelper.defaults.headers.common['Authorization'] = 'Bearer '+jwtKey;
    // }

    if(AppUtil.isNotNull(data)){
        let body = data.body;
        let url = data.url;
        let headers = {headers: data.headers}
        switch (data.methodType) {
            case methodType.GET:
                return ApiHelper.get(url, headers)
            case methodType.POST:
                return ApiHelper.post(url, body, headers)
            case methodType.PUT:
                return ApiHelper.put(url, body, headers)
            case methodType.DELETE:
                return ApiHelper.delete(url,{headers:headers, data:body})
        }
    }

    
}