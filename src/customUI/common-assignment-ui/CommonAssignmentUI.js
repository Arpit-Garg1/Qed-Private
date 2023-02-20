import React, { useMemo, useEffect, useState } from 'react'
import * as AppUtil from '../../Util/AppUtil'
import CustomDataTable from '../commonDataTAble/CustomDataTable';
import Search from './Search';
var _ = require('lodash');

function CommonAssignmentUI(props) {
    const {dataList, onCheckedKey, itemNameKey, itemIdKey, columnsList, onCheckedDataChange, pending} = props;
    let [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const isSelectedRowCondition = row => row[onCheckedKey]
    let apiData = [];
    let count = 0;
    apiData = dataList?.data;
    count = dataList?.totalCount;
    const getDataTableList = () => {
        return !AppUtil.isListNullOrEmpty(apiData) ? [..._.cloneDeep(apiData)] : null
    }
    const getClonedDataTableList = () => {
        return !AppUtil.isListNullOrEmpty(apiData) ? [..._.cloneDeep(apiData)] : null
    }
    let [dataTableList, setDataTableList] = useState(null);
    let [dataTableListCloned, setDataTableListCloned] = useState(null);

    useEffect(() => {
        if (dataList) {
            apiData = dataList?.data;
            count = dataList?.totalCount;
            if (!AppUtil.isListNullOrEmpty(apiData)) {
                setDataTableList([..._.cloneDeep(apiData)])
                setDataTableListCloned([..._.cloneDeep(apiData)])
                setFilterText('');
            }
        }
    }, [dataList]);

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        if (!AppUtil.isNullOrEmptyNew(filterText)) {
            let keyList = itemNameKey.split(',')
            dataTableList = dataTableListCloned?.filter(item =>  {
                for (let key of keyList) {
                    if (item[key]?.toLowerCase().includes(filterText.toLowerCase())) {
                        return item
                    }
                }
            });
            if (AppUtil.isListNullOrEmpty(dataTableList)) {
                dataTableList = []
            }
            setDataTableList(dataTableList)
        } else {
            if (!AppUtil.isListNullOrEmpty(dataTableListCloned)) {
                dataTableList = _.cloneDeep(dataTableListCloned)
                setDataTableList(dataTableList)
            }
        }


        return (
            <Search onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        );
    }, [filterText, resetPaginationToggle]);

    const onSelectRelated = async ({ selectedRows }) => {
        if (AppUtil.isListNullOrEmpty(selectedRows)) {
            dataTableList.forEach(cpd => {
                cpd[onCheckedKey] = false
            })
            dataTableListCloned.forEach(cpd => {
                dataTableList.forEach(pd => {
                    if (cpd[itemIdKey] == pd[itemIdKey]) {
                        cpd[onCheckedKey] = pd[onCheckedKey]
                    }
                });
            });
        } else {
            dataTableList.forEach(cpd => {
                cpd[onCheckedKey] = false
            })
            dataTableList.forEach(cpd => {
                selectedRows.forEach(pd => {
                    if (cpd[itemIdKey] == pd[itemIdKey]) {
                        cpd[onCheckedKey] = true
                    }
                });
            });
            dataTableListCloned.forEach(cpd => {
                dataTableList.forEach(pd => {
                    if (cpd[itemIdKey] == pd[itemIdKey]) {
                        cpd[onCheckedKey] = pd[onCheckedKey]
                    }
                });
            });
        }
        setDataTableListCloned(dataTableListCloned)
        let deletedData = await getListOfSelectedData(dataTableListCloned, true)
        let selectedData = await getListOfSelectedData(dataTableListCloned, false)
        if (onCheckedDataChange) {
            console.log("called onCheckedDataChange");
            onCheckedDataChange(dataTableListCloned, selectedData, deletedData,selectedRows)
        }
    };

    const getListOfSelectedData = async (dataTableListCloned, isDelete) => {
        if (!AppUtil.isListNullOrEmpty(dataList)) {
            let latestSelectedDataList = dataTableListCloned.filter(item => item[onCheckedKey] == true);
            let previousSelectedDataList = dataList?.data.filter(item => item[onCheckedKey] == true);
            let assignData = latestSelectedDataList.map((item) => {
                return { [itemIdKey]: item[itemIdKey] }
            })
            if (!isDelete) return assignData;

            if (!AppUtil.isListNullOrEmpty(previousSelectedDataList)) {
                let oldData = previousSelectedDataList.map((item) => {
                    return { [itemIdKey]: item[itemIdKey] }
                })
                let newData = latestSelectedDataList.map((item) => {
                    return { [itemIdKey]: item[itemIdKey] }
                })
                let difference = oldData.filter((data1) => !newData.some((data2) => JSON.stringify(data2) == JSON.stringify(data1)));
                return difference
            }
        }
    }

  return (
    <div>
        <div className="card">
                {!AppUtil.isListNullOrEmpty(dataTableList) ?
                    <CustomDataTable
                        columns={columnsList}
                        data={dataTableList}
                        subHeaderComponent={subHeaderComponentMemo}
                        selectableRows={true}
                        selectableRowSelected={isSelectedRowCondition}
                        onSelectedRowsChange={(data) => onSelectRelated(data)}
                        paginationTotalRows={count}
                    /> : <>
                        <CustomDataTable
                            data={[]}
                        />
                    </>}
            </div>
    </div>
  )
}

export default CommonAssignmentUI