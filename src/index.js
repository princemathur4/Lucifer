import React from 'react';
import ReactDOM from 'react-dom';
// import "@babel/polyfill"; // for enabling async-await in babel 7
import App from './App';
import Auth from '@aws-amplify/auth';
import config from './config';

Auth.configure({
    mandatorySignId: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    oauth: {
        ...config.oauth
    }
});

ReactDOM.render( <App/>, document.getElementById('root') );