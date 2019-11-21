//This is a modified version of Bootstrap 4 card

import React, { Component } from 'react';
import './style.scss';
import { observer } from 'mobx-react';
import Login from '../../modules/Login';
import SignupController from '../../modules/SignupController';
import ForgotPasswordController from '../../modules/ForgotPasswordController';
import axios from "axios";
import ResendMail from '../../modules/ResendMail';

axios.interceptors.response.use((response) => {
    return response;
}, error => {
    let err;
    if (error.hasOwnProperty("response")) {
        console.log("interceptor", error.response)
        err = error.response;
    } else {
        err = error;
    }
    return Promise.reject(err);
});

class MainLoginPage extends Component {

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/'); // redirect user to app if user is authenticated
        } else if (this.props.name === 'mainPage') {
            this.props.history.push('/login'); // redirect user to login if no endpoint is given
        }
    }

    render() {
        console.log("title",this.props.title)
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="card-title">{this.props.title}</div>
                    <div className="card-body">
                        <div className="section auth">
                            {this.props.name === 'login' && (
                                <Login {...this.props} />
                            )
                            }
                            {this.props.name === 'signUp' && (
                                <SignupController {...this.props} />
                            )
                            }
                            {this.props.name === 'resendMail' && (
                                <SignupController {...this.props} />
                            )
                            }
                            {this.props.name === 'forgotPassword' && (
                                <ForgotPasswordController {...this.props} />
                            )
                            } 
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default observer(MainLoginPage);
