import React, { useEffect, useState } from 'react'
import { FILTER_ASSETS, FILTER_MODELS, FILTER_MAKES, FILTER_CATEGORY, FILTER_USER, FILTER_EMAIL_TEMPLATE, FILTER_ORGANIZATION } from '../../constants/constants';
import CustomInput from '../custom-input-ui/CustomInput';
import * as AppUtil from '../../Util/AppUtil'
import { headerNames, modelTypes, viewOnlyAccess } from '../../_helperFunctions/HelperFunctions';
import { useLocation } from 'react-router';


function CustomFormContainer(props) {
    const { headerName, modelID, buttonName, onAddClick, onClickEvent, extraFiltersView, onGenrateBulkTokenClick, onExportAllClick, pageNo, perPageItem, setTextValue, setKeyValue, isHideAddButton = false,
        setTokenFilterType, setLinkedStatusFilter, setOwnedByFilterType,tokenFilterType } = props;
    const getFilterData = () => {
        switch (headerName) {
            case headerNames.ASSETS:
            case headerNames.LINKED_ASSETS:
                return FILTER_ASSETS;
            case headerNames.MAKES:
                return FILTER_MAKES
            case headerNames.MODELS:
                return FILTER_MODELS
            case headerNames.CATEGORIES:
                return FILTER_CATEGORY
            case headerNames.USERS:
                return FILTER_USER
            case headerNames.EMAIL_TEMPLATES:
                return FILTER_EMAIL_TEMPLATE
            case headerNames.ORGANIZATIONS:
                return FILTER_ORGANIZATION
        }
    };
    const location = useLocation();
    const [readOnlyAccess, setReadOnlyAccess] = useState(viewOnlyAccess(headerName));
    const [filterData, setFilterData] = useState(getFilterData());
    const [searchText, setSearchText] = useState('');
    useEffect(() => {
        if (location.pathname) {
            handleFilters('clear');
        }
    }, [location.pathname]);

    const handleFilters = (event, index) => {
        if (event == 'onChange') {
            let data = [...filterData];
            data[index]['isChecked'] = !data[index]['isChecked'];
            setFilterData([...data]);

        } else if (event == 'clear') {
            
            let data = [...filterData];
            data.forEach(element => {
                element['isChecked'] = false;
            });
           
            // setFilterData(null)
            // setFilterData({
            //     "pageNo": 1,
            //     "perPageItem": 30,
            //     "name": null
            // })

            if(setTokenFilterType)setTokenFilterType(null)
            if(setLinkedStatusFilter)setLinkedStatusFilter(null)
            if(setOwnedByFilterType)setOwnedByFilterType(null)
            setFilterData([...data]);
            setSearchText('');
            setTextValue(null)
            setKeyValue(null)
            onClickEvent(null,null, null, null,null)
        } else {
            let data = [...filterData];
            let text = searchText?.name || '';
            let key = [];
            data = data.forEach((item) => {
                if (item?.isChecked) {
                    key.push(`${item.value}`)
                }
            });
            setTextValue(text)
            setKeyValue(key)
            onClickEvent(pageNo, perPageItem, text, key,tokenFilterType)
        }
    }

    const getAppliedFilters = () => {
        let data = [...filterData];
        let text = searchText?.name || '';
        let key = [];
        data = data.forEach((item) => {
            if (item?.isChecked) {
                key.push(`${item.value}`)
            }
        });
        onExportAllClick(text, key)
    }


    return (
        <div className="formContainer">
            <form className="row-flex">
                {onExportAllClick && headerName !== headerNames.LINKED_ASSETS ?
                    <div className="field">
                        <button type="button" className={`primary button `} onClick={() => getAppliedFilters()} data-rel={modelID}>Export All</button>
                    </div>
                    : null}
                {!readOnlyAccess ? (onGenrateBulkTokenClick && headerName == headerNames.ASSETS) ?
                    <div className='field'>
                        <button type='button' className={`primary button`} onClick={() => onGenrateBulkTokenClick()}>Generate Bulk Token</button>
                    </div>
                    : <></>
                    : <></>}

{!readOnlyAccess && headerName == headerNames.ASSETS ?
                    <div className='field'>
                        <button type='button' className={`button primary openModel ${headerName === headerNames.ASSETS ? 'btn-height' : ''}`} onClick={() => onAddClick(null, modelTypes.LINK_BULK_ASSET)} data-rel={modelTypes.LINK_BULK_ASSET}>Link Bulk Asset</button>
                    </div>
                    : <></>}
                    
                <div className="field-filter">
                    <label htmlFor="keywordFilter" className="keywordFilterLabel">Filter</label>
                    <div className="keywordFilter">
                        <h4>search by keyword</h4>
                        <CustomInput fieldType={'search'} setFieldData={setSearchText} filedData={searchText} keyName={'name'} headerName="Assets" />
                        <ul className="checklist">
                            {filterData ? filterData?.map((item, index) => {
                                return <li>
                                    <input type="checkbox" checked={item?.isChecked}
                                        name={item?.filterName} id={item?.filterName}
                                        onChange={() => handleFilters('onChange', index)}
                                    /> <label htmlFor={item?.filterName}>{item?.filterName}</label>
                                </li>
                            }) : <></>}
                            {extraFiltersView ? extraFiltersView() : <></>}
                        </ul>
                        <div className="filter-button">
                            <a className='button secondary small' onClick={() => handleFilters('clear')}><span>clear</span></a>
                            <button className={`button primary small ${(!AppUtil.isNullOrEmptyNew(searchText?.name) && !AppUtil.isListNullOrEmpty(filterData?.filter(dd => dd.isChecked))) ? '' : (!AppUtil.isNullOrEmptyNew(searchText?.name) || !AppUtil.isListNullOrEmpty(filterData?.filter(dd => dd.isChecked))) ? 'disableButton' : ''}`} type="button" onClick={() => handleFilters('update')}>Update</button>
                        </div>
                    </div>
                </div>
                {!readOnlyAccess && !isHideAddButton ? <div className="field">
                    <button type="button" className={`button primary openModel ${headerName === headerNames.ASSETS ? 'btn-height' : ''}`} onClick={() => onAddClick(null, modelID)} data-rel={modelID}>{buttonName || 'Add'}</button>
                </div> : <></>}
            </form>

        </div>

    )
}

export default CustomFormContainer