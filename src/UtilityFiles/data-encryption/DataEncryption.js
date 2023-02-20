import jwt_decode from 'jwt-decode';

export const encryptData = (data) => {
    return window.btoa(data);
};

export const jwtDecodeData = (data) => {
    return jwt_decode(data);
};

export const decryptData = (data) => {
    return window.atob(data);
};