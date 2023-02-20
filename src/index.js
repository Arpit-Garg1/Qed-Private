import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/normalize.css'
import './assets/css/base.css'
import './assets/css/login.css'
import './assets/css/header.css'
import './assets/js/login'
import './assets/js/custom'
// import './assets/js/slick.min.js'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import AlertOptions from './constants/AlertOptions';

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...AlertOptions}>
      <App />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();