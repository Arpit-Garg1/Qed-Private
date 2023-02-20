import React from 'react'
import Header from '../../common/pages/header'
import Sidenav from '../../common/pages/sidenav'

function Home({ children }) {
    return (
        <>
            <header className="mainHeader">
                <Sidenav />
            </header>
            <div className="main">
                <Header />
                { children }
            </div>
        </>
    )
}

export default Home