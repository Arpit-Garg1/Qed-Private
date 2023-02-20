import React from 'react'
import Header from '../../common/pages/header'
import Sidenav from '../../common/pages/sidenav'

function MyAccount({ children }) {
    return (<>
        <header className="mainHeader">
            <Sidenav />
        </header>
        <div className="main">
            <Header />
            <div className="mainContent">
                <div className="mainContent-account">
                    { children }
                </div>
            </div>
        </div>
    </>
    )
}

export default MyAccount