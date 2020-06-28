import React, { Component, Fragment } from 'react';
import Validate from "../../utils/FormValidation";
import { observer } from 'mobx-react';
import Auth from '@aws-amplify/auth';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FacebookButton from "../../components/FacebookButton";
import GoogleButton from "../../components/GoogleButton";
import commonApi from "../../apis/common";
import ReactHtmlParser from 'react-html-parser';


class Login extends Component {
    state = {
        mobile: '',
        mobile: '',
        password: '',
        isLoading: false,
        isAuthenticated: false,
        user: null,
        responseText: "",
        errors: {
            mobileInvalid: false,
            mobileInvalid: false,
            passwordInvalid: false,
        },
        isSubmitted: false
    };

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                mobileInvalid: false,
                mobileInvalid: false,
                passwordInvalid: false,
            }
        });
    };

    onLoginSubmit = async event => {
        event.preventDefault();

        try {
            this.setState({ isLoading: true });
            this.clearErrorState();

            const error = Validate('login', this.state);

            if (Object.keys(error).length) {
                this.setState({
                    errors: { ...this.state.errors, ...error },
                    isLoading: false
                });
                return;
            }

            // AWS Cognito integration here
            const { password } = this.state;
            const username = "+91" + this.state.mobile;
            const user = await Auth.signIn(username, password);

            if (user.hasOwnProperty("challengeName") && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                console.log("challenge encountered");
                //     "Seems like you are entering a temporary password. Please create a fresh new password using the link previously sent to your mail or generate a new link here.",
                //     {
                //         link: "/resendmail",
                //         text: "Resend link",
                //         className: ""
                //     }
                // this.props.store.mobileFromPreviousScreen = this.state.mobile;
                return;
            }
            
            try{
                await commonApi.post('login', {}, 
                    { headers: { "Authorization": user.signInUserSession.accessToken.jwtToken } }
                );
            }catch(e){
                console.log(e);
            }
            this.setState({ isLoading: false });
            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(user);
            let redirectUrl = this.props.store.redirectRoute ? this.props.store.redirectRoute : "/";
            this.props.history.push(redirectUrl);
        } catch (err) {
            let responseText = 'Something went wrong, Please try again later!';
            if (err.code === 'UserNotConfirmedException') {
                responseText = "Seems like you didn't finish the mobile verification. Please click on the link below to resend verification mail.";
                this.setState({ resendLinkActive: true })
                // The error happens if the user didn't finish the confirmation step when signing up
                // In this case you need to resend the code and confirm the user
                // About how to resend the code and confirm the user, please check the signUp part
            } else if (err.code === 'PasswordResetRequiredException') {
                responseText = "Password needs to be reset. Please go to forgot password page to finish the process.";
                // The error happens when the password is reset in the Cognito console
                // In this case you need to call forgotPassword to reset the password
                // Please check the Forgot Password part.
            } else if (err.code === 'NotAuthorizedException') {
                responseText = "Incorrect phone number or password";
                // The error happens when the incorrect password is provided
            } else if (err.code === 'UserNotFoundException') {
                responseText = "User does not exist. Please try signing up with us first to login.";
                // The error happens when the supplied username/mobile does not exist in the Cognito user pool
            } else {
                console.log(err);
            }
            this.setState({
                responseText,
                errors: {
                    ...this.state.errors,
                },
                isLoading: false
            });
        }
    };

    onCloseResponse = () => {
        let { errors } = this.state;  
        this.setState({
            responseText: '',
            errors: { ...errors }
        })
    }

    onInputChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onLoginSubmit(e);
        }
    };

    render() {
        return (
            <Fragment>
                {
                    this.state.responseText &&
                    <div className="response-text is-error">
                        <span className="response-tag">
                            {this.state.responseText}
                        </span>
                        <button className="delete is-small" onClick={this.onCloseResponse} ></button>
                    </div>
                }
                {
                    this.state.resendLinkActive && 
                    <div className="resend-link-container">
                        <Link to="/resend_verification_code" className="main-link">Resend Link</Link>
                    </div>
                }
                {/* <div className="sign-up-using-text">
                    Sign in using
				</div>
                <div className="field has-addons" style={{ display: "flex", justifyContent: "center" }}>
                    <p className="control">
                        <GoogleButton {...this.props} />
                    </p>
                    <p className="control">
                        <FacebookButton {...this.props} />
                    </p>
                </div>
                <div className="or-text-container">
                    <b>OR</b>
                </div> */}
                <div className="field">
                    <div className={!this.state.errors.mobileInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
                        <input
                            className={!this.state.errors.mobileInvalid ? "input" : "input is-danger"}
                            type="text"
                            placeholder="Enter your Phone number"
                            name="mobile"
                            onChange={this.onInputChange}
                            onKeyPress={this.onKeyPress}
                        />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="mobile-alt" />
                        </span>
                        {
                            this.state.errors.mobileInvalid &&
                            <Fragment>
                                <span className="icon is-small is-right">
                                    <FontAwesomeIcon icon="exclamation-triangle" />
                                </span>
                                <p className="help is-danger">Please enter your registered phone number here</p>
                            </Fragment>
                        }
                    </div>
                </div>
                <div className="field">
                    <div className={!this.state.errors.passwordInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
                        <input 
                            className={!this.state.errors.passwordInvalid ? "input" : "input is-danger"}
                            type="password"
                            placeholder="Enter your Password"
                            name="password"
                            onChange={this.onInputChange}
                            onKeyPress={this.onKeyPress}
                        />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="lock" />
                        </span>
                        {
                            this.state.errors.passwordInvalid &&
                            <Fragment>
                                <span className="icon is-small is-right">
                                    <FontAwesomeIcon icon="exclamation-triangle" />
                                </span>
                                <p className="help is-danger">
                                    Please enter your password here
								</p>
                            </Fragment>
                        }
                    </div>
                </div>
                <button
                    className={this.state.isLoading ? "button login-button is-loading" : "login-button"}
                    onClick={this.onLoginSubmit}
                >
                    Sign In
                </button>
                <div className="links-container">
                    <Link className="forgot-password-link" to="/forgot_password"> Forgot Password? </Link>
                    <Link className="create-account-link" to="/signup"> Create Account </Link>
                </div>
            </Fragment >
        );
    }
}

export default observer(Login);
