import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from '../pages/error-module/Error';
import AdminOrgainzations from '../pages/main-module/AdminOrgainzations';
import Assets from '../pages/main-module/Assets';
import Categories from '../pages/main-module/Categories';
import EmailTemplates from '../pages/main-module/EmailTemplates';
import Home from '../pages/main-module/Home';
import Make from '../pages/main-module/Make';
import Model from '../pages/main-module/Model';
import Users from '../pages/main-module/Users';
import Login from '../pages/user-module/login-page/Login';
import LoginSignupPage from '../pages/user-module/login-signup-page/LoginSignupPage';
import ResetPassword from '../pages/user-module/reset-password-page/ResetPassword';
import PrivateRoute from './PrivateRoute';
import AcceptEmail from '../pages/user-module/accept-email-component/AcceptEmail'
import MyAccount from '../pages/main-module/MyAccount';
import ProfileSection from '../customUI/profile-section-page/ProfileSection';
import LoginAndSecurity from '../customUI/login-and-security-section/LoginAndSecurity';
import ViewLineage from '../customUI/view-lineage-content/ViewLineage';
import LinkAssets from '../customUI/lineage-link-assets/LinkAssets';
import AssetDeatils from '../customUI/asset-deatils-content/AssetDetails';
import ForgetPassword from '../pages/user-module/forget-password-page/ForgetPassword';
import { path } from '../_helperFunctions/HelperFunctions';
import SignUp from '../pages/user-module/signup-page/SignUp';
function Routing() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path={path.LOGIN} element={<Login><LoginSignupPage /></Login>} />
        <Route path={path.RESET_PASSWORD} element={<Login><ResetPassword /></Login>} />
        <Route path={path.SIGN_UP} element={<Login><SignUp /></Login>} />
        <Route path={path.ACCEPT_INVITE + ':id/:inviteCode'} element={<Login><AcceptEmail /></Login>} />
        <Route path={path.CONFIRM_PASSWORD + ':email'} element={<Login><ForgetPassword /></Login>} />
        <Route path={path.ERROR} element={<Error />} />
        <Route path={path.MAKES} element={<PrivateRoute><Home><Make /></Home></PrivateRoute>} />
        <Route path={path.MODELS} element={<PrivateRoute><Home><Model /></Home></PrivateRoute>} />
        <Route path={path.ASSETS} element={<PrivateRoute><Home><Assets /></Home></PrivateRoute>} />
        <Route path={path.USERS} element={<PrivateRoute><Home><Users /></Home></PrivateRoute>} />
        <Route path={path.CATEGORIES} element={<PrivateRoute><Home><Categories /></Home></PrivateRoute>} />
        <Route path={path.ORGANIZATIONS} element={<PrivateRoute><Home><AdminOrgainzations /></Home></PrivateRoute>} />
        <Route path={path.EMAIL_TEMPLATES} element={<PrivateRoute><Home><EmailTemplates /></Home></PrivateRoute>} />
        <Route path={path.VIEW_LINEAGE + ':id'} element={<PrivateRoute><Home><ViewLineage /></Home></PrivateRoute>} />
        <Route path={path.LINEAGE_DETAILS + ':id'} element={<PrivateRoute><Home><AssetDeatils /></Home></PrivateRoute>} />
        <Route path={path.LINK_ASSETS + ':id'} element={<PrivateRoute><Home><LinkAssets /></Home></PrivateRoute>} />
        <Route path={path.USER_PROFILE} element={<PrivateRoute><MyAccount><ProfileSection /></MyAccount></PrivateRoute>} />
        <Route path={path.SECURITY} element={<PrivateRoute><MyAccount><LoginAndSecurity /></MyAccount></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing