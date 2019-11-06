//This is a modified version of Bootstrap 4 card

import React, { Component } from 'react';
import './style.scss';
import { observer } from 'mobx-react';
import Login from '../../modules/Login';
// import Signup from '../../modules/Signup';
// import CreatePassword from '../../modules/CreatePassword';
// import ForgotPassword from '../../modules/ForgotPassword';
import axios from "axios";

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
                            {/* {this.props.name === 'signUp' && (
                                <Signup {...this.props} />
                            )
                            }
                            {this.props.name === 'createPassword' && (
                                <CreatePassword {...this.props} />
                            )
                            }
                            {this.props.name === 'forgotPassword' && (
                                <ForgotPassword {...this.props} />
                            )
                            } */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default observer(MainLoginPage);
