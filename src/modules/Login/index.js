import React, { Component, Fragment } from 'react';
import Validate from "../../utils/FormValidation";
import { observer } from 'mobx-react';
import Auth from '@aws-amplify/auth';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Login extends Component {
    state = {
        phone: '',
        password: '',
        keepMeLoggedIn: false,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        errors: {
            phoneInvalid: false,
            passwordInvalid: false,
            cognito: null,
        },
        isSubmitted: false
    };

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                phoneInvalid: false,
                passwordInvalid: false,
                cognito: null,
            }
        });
    };

    componentDidUpdate() {
        if (this.state.isAuthenticated) {
            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(this.state.user);
            this.props.history.push("/");
        }
    }

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
            const username = this.state.phone;
            const user = await Auth.signIn(username, password);

            if (user.hasOwnProperty("challengeName") && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                console.log("challenge encountered");
                //     "Seems like you are entering a temporary password. Please create a fresh new password using the link previously sent to your mail or generate a new link here.",
                //     {
                //         link: "/resendmail",
                //         text: "Resend link",
                //         className: ""
                //     }
                // this.props.store.phoneFromPreviousScreen = this.state.phone;
                return;
            }

            this.setState({ isLoading: false });
            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(user);
            this.props.history.push("/");
        } catch (error) {
            let err = null;
            !error.message ? err = { "message": error } : err = error;
            this.setState({
                errors: {
                    ...this.state.errors,
                    cognito: err
                },
                isLoading: false
            });
        }
    };

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
                <div className="response-text">
                    {this.state.errors.cognito || this.state.errors.phoneInvalid || this.state.errors.passwordInvalid ? <span className="tag is-danger is-light is-medium">Incorrect Phone Number or Password</span>: ''}
                </div>
                <div className="field">
                    <div className="field-label">PHONE NUMBER</div>
                    <p className="control has-icons-left has-icons-right">
                        <input 
                        className="input" 
                            type="text"
                            placeholder="XXXXXXXXXX" 
                            name="phone"
                            onChange={this.onInputChange}
                            onKeyPress={this.onKeyPress}
                        />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="mobile-alt" />
                        </span>
                    </p>
                </div>
                <div className="field">
                    <div className="field-label-container">
                        <div className="field-label">
                            PASSWORD
                        </div>
                        <span className="forgot-password-button" >
                            <Link to="/forgot_password">Forgot?</Link>
                        </span>
                    </div>
                    <p className="control has-icons-left">
                        <input className="input" 
                            type="password" 
                            placeholder="" 
                            name="password"
                            onChange={this.onInputChange}
                            onKeyPress={this.onKeyPress}
                        />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="lock" />
                        </span>
                    </p>
                </div>
                <button
                    className={this.state.isLoading ? "button login-button is-loading" : "login-button"}
                    onClick={this.onLoginSubmit}
                >
                    Sign In
                </button>
                <div className="link-container">
                    <Link className="create-account-link" to="/signup"> Create an Account </Link>
                </div>
                <div className="or-text-container">
                    <b>OR</b> 
                    <div className="sign-up-using-text">
                        Sign in using 
                    </div>
                </div>
                <div className="field has-addons" style={{ display: "flex", justifyContent: "center"}}>
                    <p className="control">
                        <button className="button">
                            <span className="icon is-small" style={{ height: "1rem" }}>
                                <FontAwesomeIcon icon={['fab', 'google']} style={{ color: "#cb0808" }}/>
                            </span>
                            <span>Google</span>
                        </button>
                    </p>
                    <p className="control">
                        <button className="button">
                            <span className="icon is-small" style={{ height: "1rem" }}>
                                <FontAwesomeIcon icon={['fab', 'facebook']} style={{ color: "#3e3eb5" }}/>
                            </span>
                            <span>Facebook</span>
                        </button>
                    </p>
                </div>
            </Fragment >
        );
    }
}

export default observer(Login);
