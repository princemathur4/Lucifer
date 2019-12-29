import React from 'react';
import ReactDOM from 'react-dom';
// import "@babel/polyfill"; // for enabling async-await in babel 7
import App from './App';
import Auth from '@aws-amplify/auth';

Auth.configure({
    mandatorySignId: true,
    region: process.env.REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.APP_CLIENT_ID,
    // IdentityPoolId: process.env.IDENTITY_POOL_ID,
    // oauth: {
    //     process.env.oauth
    // }
});

ReactDOM.render( <App/>, document.getElementById('root') );