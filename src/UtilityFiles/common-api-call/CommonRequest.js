import { methodType } from "./HttpRequest";

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
        this.url = process.env.REACT_APP_API_URL;
    }

    setDefaultHeaders() {
        this.addHeaders("Content-Type", "application/json")
    }

    addHeaders(key, value) {
        this.headers[key] = value;
    }
}

export const getRequestForApi = (url, parameters, methodTypeName) => {
    let request = new RequestModel();
    request.body = parameters;
    request.methodType = methodTypeName;
    request.url = url;
    return request;
};