import React from 'react'
import { useNavigate } from 'react-router-dom';
import { getAdminRoles, getStorageData, storageKey, storageType } from '../../_helperFunctions/HelperFunctions';

function Error() {
  const navigate = useNavigate();
  const handleRetry = async () => {
    let url = await getAdminRoles(getStorageData(storageType, storageKey.TOKEN));
    if (url) {
      navigate(url)
    }
  }
  return (
    <div className='error'>
      <h2>Oops!! Error 404...</h2>
      <p>Sorry, the page you're looking for doesn't exists...</p>
      <p className='error-btn' onClick={() => handleRetry()}>click here to go back...</p>
    </div>
  )
}

export default Error