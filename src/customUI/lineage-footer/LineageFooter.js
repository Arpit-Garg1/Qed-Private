import React from 'react'
import { headerNames } from '../../_helperFunctions/HelperFunctions';

function LineageFooter(props) {
    const { tabType, setTabType, assetDataObj } = props;
    console.log(assetDataObj?.tokenId)
    return (
        <div className="linageFooter">
            <div className="footerActionContent">
                <ul className="links">
                    <li className={tabType == 0 ? 'links-details' : ''} onClick={() => setTabType(0)}>
                        {/* <Link to={`${path.LINEAGE_DETAILS}${params.id}`}> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            className="feather feather-box" color="rgba(156, 163, 175, 1)" pointer-events="none">
                            <path
                                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
                            </path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        <span>Details</span>
                        {/* </Link> */}
                    </li>
                    {assetDataObj?.tokenId ?
                        <li className={tabType == 1 ? 'links-details' : ''} onClick={() => setTabType(1)}>
                            {/* <Link to={`${path.VIEW_LINEAGE}${params.id}`}> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-activity" color="rgba(156, 163, 175, 1)" pointer-events="none">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            <span>Lineage View</span>
                            {/* </Link> */}
                        </li> : <></>}
                    {assetDataObj?.tokenId ?
                        <li className={tabType == 2 ? 'links-details' : ''} onClick={() => setTabType(2)}>
                            {/* <Link to={`/link-assets/${params.id}`}> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                                className="feather feather-link" color="rgba(156, 163, 175, 1)" pointer-events="none">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            <span>{headerNames.LINKED_ASSETS}</span>
                            {/* </Link> */}
                        </li>
                        : <></>}

                </ul>
            </div>
        </div>
    )
}

export default LineageFooter