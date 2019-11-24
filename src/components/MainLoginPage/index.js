//This is a modified version of Bootstrap 4 card

import React, { Component } from 'react';
import './style.scss';
import { observer } from 'mobx-react';
import Login from '../../modules/Login';
import SignupController from '../../modules/SignupController';
import ForgotPasswordController from '../../modules/ForgotPasswordController';
import ResendMail from '../../modules/ResendMail';

class MainLoginPage extends Component {

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/'); // redirect user to app if user is authenticated
        }
    }

    render() {
        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="card-title" style={{ fontSize: (this.props.title.length > 10 ) ? "1.7em": "2em" }}>{this.props.title}</div>
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
