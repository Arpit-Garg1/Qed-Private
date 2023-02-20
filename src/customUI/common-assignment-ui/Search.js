import React from 'react'
import styled from "styled-components";

function Search(props) {
const {filterText, onFilter, onClear} = props;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
  return (
    <div className="form-group col-md-5 col-xs-12 mt-3">
        <label>Search</label>
        <input type="search" 
        value={filterText}
        onChange={onFilter}
        className="form-control searhInput" placeholder="Enter your keywords here" />
        {/* <ClearButton onClick={onClear}>X</ClearButton> */}
        <div className='searchListArea'>
        {/* {customerData.length > 0 ? (

        customerData.map((item, index) => {
        return (
            <div className='custemerList' onClick={() => selectCustomerHandler(item)}>
            <span>{item.firstName}</span> <span>{item.lastName}</span><br />
            <span>{item.mobile}</span>
            </div>
        )
        })
        ) : (
        <span> </span>
        )} */}
        </div>
    </div>
  )
}

export default Search