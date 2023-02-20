import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getRequestForApi } from '../../Util/CommonRequest';
import { callHttpRequest, methodType } from '../../Util/HttpRequest';
import { decryptData, headerNames, modelTypes } from '../../_helperFunctions/HelperFunctions';
import * as AppUtil from '../../Util/AppUtil'
import Assets from '../../pages/main-module/Assets';
import CreateLinkAssets from '../../pages/modal-forms-popups/link-assets-addupdate-form/CreateLinkAssets';
import { MAX_ITEM_PER_PAGE, PAGE_NUMBER } from '../../constants/constants';
import * as global from '../../constants/global';
import CustomLoader from '../custom-loader/CustomLoader';

function LinkAssets(props) {
    const params = useParams();
    const [paramsNew, setParamsNew] = useState(params);
    const { assetDataObj } = props;
    const [assetList, setAssetList] = useState(null);
    const [linkedAssetList, setLinkedAssetList] = useState(undefined);
    const [pending, setPending] = useState(null);

    useEffect(() => {
        if (decryptData(params.id)) {
            // setParamsNew(params)
        }
    }, [params.id]);

    useEffect(() => {
        if (!AppUtil.isNotNull(paramsNew)) {
            setParamsNew({ ...params })
        }
    }, [paramsNew]);

    useEffect(() => {
        if (linkedAssetList == undefined) return;
        getOnlyUnlikedAssetsList();
    }, [linkedAssetList]);

    const getOnlyUnlikedAssetsList = async (page, maxRows, filerText, filterColumns) => {
        setPending(true);
        let variables = {
            pageNo: page || PAGE_NUMBER,
            perPageItem: maxRows || MAX_ITEM_PER_PAGE,
            name: filerText,
            linkedAssets: 1,
            assetId: decryptData(params.id)
        };
        callGetApi(variables)
    };

    const callGetApi = async (variables) => {
        let request = getRequestForApi(global.GET_ALL_ASSETS_LIST, variables, methodType.POST);
        await callHttpRequest(request).then(response => {
            if (AppUtil.isNotNull(linkedAssetList)) {
                let linkedAssetsListNew = linkedAssetList?.data?.map(elm => { return { ...elm, isLinked: true } })
                if (!AppUtil.isListNullOrEmpty(linkedAssetsListNew)) {
                    let finalData = linkedAssetsListNew.concat(response?.data?.response?.data)
                    let abcd = { data: finalData, totalCount: (response?.data?.response.totalCount + linkedAssetList?.data?.length) }
                    setAssetList({ ...abcd });
                } else {
                    setAssetList({ ...response.data.response });
                }
            } else {
                setAssetList({ ...response.data.response });
            }
            setPending(false);
        }).catch((err) => {
            console.log('err', err);
            setPending(false);
        });
    };

    return (
        <>{pending ? <CustomLoader /> : <></>}
            {paramsNew?.id ? <>
                <Assets headerName={headerNames.LINKED_ASSETS} modelID={modelTypes.LINK_ASSETS} selectedAssetId={decryptData(params.id)} assetDataObj={assetDataObj} setLinkedAssetsList={setLinkedAssetList} />
                {AppUtil.isNotNull(assetList) ?
                    <CreateLinkAssets headerName={headerNames.LINKED_ASSETS} modelID={modelTypes.LINK_ASSETS} selectedAssetId={decryptData(params.id)} assetList={assetList} linkedAssetsList={linkedAssetList} setParamsNew={setParamsNew} setAssetList={setAssetList} getOnlyUnlikedAssetsList={getOnlyUnlikedAssetsList} />
                    : <></>}
            </>
                : <></>}
        </>
    )
}

export default LinkAssets