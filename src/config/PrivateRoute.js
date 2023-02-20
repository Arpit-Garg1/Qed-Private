import React from 'react'
import { Navigate } from 'react-router-dom';
import { storageKey, getStorageData, path, storageType } from '../_helperFunctions/HelperFunctions';

export const PrivateRoute = ({ children}) => {
    const token = getStorageData(storageType,storageKey.TOKEN);
    return token ? children : <Navigate replace to={path.LOGIN} />
}


export default PrivateRoute