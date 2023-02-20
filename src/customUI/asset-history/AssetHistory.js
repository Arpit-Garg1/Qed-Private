import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import * as global from '../../constants/global';
import { getRequestForApi } from '../../Util/CommonRequest';
import { getDisplayDateFormat } from '../../Util/DateUtil';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import { alertTypes } from '../../_helperFunctions/HelperFunctions';
import CustomLoader from '../custom-loader/CustomLoader';

function AssetHistory(props) {
    const { assetDetails } = props;
    const alert = useAlert();
    const [pending, setPending] = useState(null);
    const [assetHistoryDetails, setAssetHistoryDetails] = useState(null);

    useEffect(() => {
        if (assetDetails?.tokenId) {
            getAssetHistory();
        }
    }, [assetDetails]);

    const getAssetHistory = async () => {
        setPending(true);
        let request = getRequestForApi(global.ASSET_TOKEN_HISTORY + assetDetails?.tokenId, null, methodType.GET);
        await callHttpRequest(request).then(response => {
            if (response.status === 200) {
                setAssetHistoryDetails(response?.data?.response?.data);
                setPending(false);
            } else {
                setPending(false);
            }
        }).catch((err) => {
            alert.show(err?.response?.data?.message, { type: alertTypes.ERROR });
            setPending(false);
            console.log('err', err);
        })
    };

    return (
        <> {pending ? <CustomLoader/> : <></>}
        <div className="mainContent mainContentAssetDetail lineage-bottom">
            {assetHistoryDetails && assetHistoryDetails?.length > 0 ?
                assetHistoryDetails.map((data) => {
                    return <div className="card hasLoader assetHistoryCard">
                        <div className="assetsDetails">
                            <div className='assetDetails-data'>
                                <h3>Transaction ID: <span data-tooltip={data?.txnId ? data?.txnId : ''}><span className='ellipsis'>{data?.txnId ? data?.txnId?.substring(0,10) : ''}</span></span></h3>
                                <p>Owner: {data?.ownerName ? data?.ownerName : ''}</p>
                                <h5>Date: {data?.t ? getDisplayDateFormat(new Date(data?.t)) : ''} {data?.t ? moment(new Date(data?.t)).format('LT') : ''}</h5>
                            </div>
                        </div>
                    </div>
                }) : 
                <></>}
        </div>
        </>
    )
}

export default AssetHistory