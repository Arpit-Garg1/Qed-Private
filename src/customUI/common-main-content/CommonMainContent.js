import React, { useState } from 'react'
import { headerNames } from '../../_helperFunctions/HelperFunctions';
import CustomDataTable from '../commonDataTAble/CustomDataTable'
import CustomFormContainer from '../custom-form-container/CustomFormContainer';
import CustomLoader from '../custom-loader/CustomLoader';
import * as AppUtil from '../../Util/AppUtil'
import AssetDeatils from '../asset-deatils-content/AssetDetails';

const isSelectedRowCondition = row => row.isSelected
function CommonMainContent(props) {
    const { headerName, dataList, columnsList, modelID, getApiDataList, buttonName, pending, onAddClick, selectableRows, selectableRowsNoSelectAll, extraFiltersView, onItemSelectByChekBox, onGenrateBulkTokenClick, onClickEvent, onExportAllClick, currentRouterUrl, assetDataObj,
        setTokenFilterType, setLinkedStatusFilter, setOwnedByFilterType,tokenFilterType } = props;
    const [textValue, setTextValue] = useState('')
    const [assetDetailsNew, setAssetDetailsNew] = useState(null)
    const [keyValue, setKeyValue] = useState([])
    let apiData = [];
    let count = 0;
    if (dataList?.data) {
        apiData = dataList?.data;
        count = dataList?.totalCount;
    }
    const [pageNo, setPageNo] = useState(null);
    const [perPageItem, setPerPageItem] = useState(null);
    const onRowsChange = (data) => {
        setPerPageItem(data);
        getApiDataList(pageNo, data, textValue, keyValue,tokenFilterType);
    };

    const onPageChange = (data) => {
        setPageNo(data)
        getApiDataList(data, perPageItem, textValue, keyValue,tokenFilterType);
    };

    return (
        <div className="mainContent">
            {headerName === headerNames.LINKED_ASSETS ? <>
                {/* {assetDataObj ?  */}
                <AssetDeatils hideThumbnail={true} assetDataObj={assetDataObj} setAssetDetailsNew={setAssetDetailsNew} />
                {/* :<></>} */}
            </> : <></>}
            <div className="row-flex flex-justify-space-between">
                <div className="result"><h2>{headerName ? headerName : ''}</h2>{apiData ? apiData?.length : 0} results</div>
                <CustomFormContainer
                    onExportAllClick={onExportAllClick}
                    onClickEvent={onClickEvent}
                    extraFiltersView={extraFiltersView}
                    onGenrateBulkTokenClick={onGenrateBulkTokenClick}
                    getApiDataList={getApiDataList}
                    headerName={headerName}
                    modelID={modelID}
                    tokenFilterType={tokenFilterType}
                    setTokenFilterType={setTokenFilterType}
                    setLinkedStatusFilter={setLinkedStatusFilter}
                    setOwnedByFilterType={setOwnedByFilterType}
                    onAddClick={onAddClick}
                    buttonName={buttonName}
                    pageNo={pageNo}
                    perPageItem={perPageItem}
                    setTextValue={setTextValue}
                    setKeyValue={setKeyValue}
                    isHideAddButton={assetDetailsNew && ((!AppUtil.isListNullOrEmpty(assetDetailsNew.linkFrom)) || assetDetailsNew.isOwned == 'N') ? true : false}
                />
            </div>
            <div className="card">
                {apiData && apiData?.length > 0 ?
                    <CustomDataTable
                        columns={columnsList}
                        data={apiData}
                        selectableRows={selectableRows}
                        selectableRowsNoSelectAll={selectableRowsNoSelectAll}
                        onSelectedRowsChange={(data) => onItemSelectByChekBox ? onItemSelectByChekBox(data) : null}
                        selectableRowSelected={isSelectedRowCondition}
                        progressPending={pending}
                        perPageItem={perPageItem}
                        progressComponent={<CustomLoader />}
                        paginationServer
                        paginationTotalRows={count}
                        onChangeRowsPerPage={(data) => onRowsChange(data)}
                        onChangePage={(data) => onPageChange(data)}
                    /> : <>
                        <CustomDataTable
                            progressPending={pending}
                            progressComponent={<CustomLoader />}
                            data={[]}
                        />
                    </>}
            </div>
        </div>
    )
}

export default CommonMainContent