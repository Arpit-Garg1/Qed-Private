import React from 'react'
import { DarkLogo } from '../../../svgimages/svg'
import { imageType } from '../../../_helperFunctions/HelperFunctions'


function Login({ children }) {
    return (
        <>
            <div className="div1">
                <div className="logo">
                    {imageType.DARK_LOGO}
                </div>
                <section className="container forms">
                    <div className="form login">
                        {children}
                    </div>
                </section>
            </div>
        </>
    )
}

export default Login