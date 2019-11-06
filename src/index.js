import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Auth from '@aws-amplify/auth';
import config from './config';
import "@babel/polyfill"; // for enabling async-await in babel 7

Auth.configure({
    mandatorySignId: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
});

ReactDOM.render( <App/>, document.getElementById('root') );