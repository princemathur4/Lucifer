import React, { Component, Fragment } from 'react';
import Validate from "../../utils/FormValidation";
import { observer } from 'mobx-react';
import Auth from '@aws-amplify/auth';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FacebookButton from "../../components/FacebookButton";

class Login extends Component {
    state = {
        email: '',
        password: '',
        isLoading: false,
        isAuthenticated: false,
        user: null,
        errors: {
            responseText: "",
            emailInvalid: false,
            passwordInvalid: false,
        },
        isSubmitted: false
    };

    clearErrorState = () => {
        this.setState({
            errors: {
                responseText: "",
                emailInvalid: false,
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
            const username = this.state.email;
            const user = await Auth.signIn(username, password);

            if (user.hasOwnProperty("challengeName") && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                console.log("challenge encountered");
                //     "Seems like you are entering a temporary password. Please create a fresh new password using the link previously sent to your mail or generate a new link here.",
                //     {
                //         link: "/resendmail",
                //         text: "Resend link",
                //         className: ""
                //     }
                // this.props.store.emailFromPreviousScreen = this.state.email;
                return;
            }

            this.setState({ isLoading: false });
            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(user);
            this.props.history.push("/");
        } catch (err) {
            let responseText = 'Something went wrong, Please try again later!';
            if (err.code === 'UserNotConfirmedException') {
                responseText = "Seems like you didn't finish the email verification. Please try signing up with us again to login.";
                // The error happens if the user didn't finish the confirmation step when signing up
                // In this case you need to resend the code and confirm the user
                // About how to resend the code and confirm the user, please check the signUp part
            } else if (err.code === 'PasswordResetRequiredException') {
                responseText = "Password needs to be reset. Please go to forgot password page to finish the process.";
                // The error happens when the password is reset in the Cognito console
                // In this case you need to call forgotPassword to reset the password
                // Please check the Forgot Password part.
            } else if (err.code === 'NotAuthorizedException') {
                responseText = "Incorrect Email or Password";
                // The error happens when the incorrect password is provided
            } else if (err.code === 'UserNotFoundException') {
                responseText = "User does not exist. Please try signing up with us first to login.";
                // The error happens when the supplied username/email does not exist in the Cognito user pool
            } else {
                console.log(err);
            }
            this.setState({
                errors: {
                    ...this.state.errors,
                    responseText
                },
                isLoading: false
            });
        }
    };

    onCloseResponse = () => {
        let { errors } = this.state;  
        this.setState({
            errors: { ...errors, responseText: '' }
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
                    this.state.errors.responseText &&
                    <div className="response-text is-error">
                        <span className="response-tag">
                            {this.state.errors.responseText}
                        </span>
                        <button className="delete is-small" onClick={this.onCloseResponse} ></button>
                    </div>
                }
                <div className="sign-up-using-text">
                    Sign in using
				</div>
                <div className="field has-addons" style={{ display: "flex", justifyContent: "center" }}>
                    <p className="control">
                        <button className="button">
                            <span className="icon" style={{ height: "1rem" }}>
                                <FontAwesomeIcon icon={['fab', 'google']} style={{ color: "#cb0808" }} />
                            </span>
                            <span>Google</span>
                        </button>
                    </p>
                    <p className="control">
                        <FacebookButton
                            {...this.props}
                        />
                    </p>
                </div>
                <div className="or-text-container">
                    <b>OR</b>
                </div>
                <div className="field">
                    <div className={!this.state.errors.emailInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
                        <input
                            className={!this.state.errors.emailInvalid ? "input" : "input is-danger"}
                            type="text"
                            placeholder="Your Email-ID"
                            name="email"
                            onChange={this.onInputChange}
                            onKeyPress={this.onKeyPress}
                        />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="envelope" />
                        </span>
                        {
                            this.state.errors.emailInvalid &&
                            <Fragment>
                                <span className="icon is-small is-right">
                                    <FontAwesomeIcon icon="exclamation-triangle" />
                                </span>
                                <p className="help is-danger">Please enter your registered E-mail here</p>
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
