import React, { useState } from 'react';
import AssetDeatils from '../asset-deatils-content/AssetDetails';
import AssetHistory from '../asset-history/AssetHistory';
import LineageFooter from '../lineage-footer/LineageFooter';
import LinkAssets from '../lineage-link-assets/LinkAssets';

function ViewLineage() {
    const [tabType, setTabType] = useState(0)
    const [productData, setProductData] = useState(null);
    return (
        <>
            {tabType == 0 ? <AssetDeatils setAssetDetailData={setProductData} assetDataObj={productData} tabType={tabType}/>: tabType == 1 ? <AssetHistory assetDetails={productData}/>: <LinkAssets assetDataObj={productData}/>}
            
            {productData ? <LineageFooter tabType={tabType} setTabType={setTabType} assetDataObj={productData}/> :<></>}
        </>
    )
}

export default ViewLineage