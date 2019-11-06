import React, { Component, Fragment } from 'react';
import Validate from "../../utils/FormValidation";
import { observer } from 'mobx-react';
import Auth from '@aws-amplify/auth';
import { Link } from "react-router-dom";

class Login extends Component {
    state = {
        email: '',
        password: '',
        keepMeLoggedIn: false,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        modal: {
            status: "",
            title: "",
            text: "",
            buttonText: "",
            linkObj: {
                link: "",
                text: "",
                className: ""
            }
        },
        errors: {
            emailInvalid: false,
            passwordInvalid: false,
            cognito: null,
        },
        isSubmitted: false
    };

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                emailInvalid: false,
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
            const { email, password } = this.state;
            const user = await Auth.signIn(email, password);

            if (user.hasOwnProperty("challengeName") && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                // this.showPopUpMessageModal(
                //     'warning',
                //     'Oops!',
                //     "Seems like you are entering a temporary password. Please create a fresh new password using the link previously sent to your mail or generate a new link here.",
                //     "",
                //     {
                //         link: "/resendmail",
                //         text: "Resend link",
                //         className: ""
                //     }
                // );
                // this.props.store.emailFromPreviousScreen = this.state.email;
                // return;
            }

            //Amplitude tracking
            amplitudeAnalytics.login(user);
            this.setState({ isAuthenticated: true, isLoading: false, user });
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
                <div class="field">
                    <p class="control has-icons-left has-icons-right">
                        <input 
                            class="input" 
                            type="email" 
                            placeholder="Email" 
                            name="email"
                            onChange={this.onInputChange}
                            onKeyPress={this.onKeyPress}
                        />
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="icon is-small is-right">
                            <i class="fas fa-check"></i>
                        </span>
                    </p>
                    <div className="form-feedback">{this.state.errors.emailInvalid ? 'Please enter valid E-mail ID' : ''}</div>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" type="password" placeholder="Password" />
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </p>
                    <div className="form-feedback">{this.state.errors.passwordInvalid ? "Please enter valid Password" : ''}</div>
                </div>
                <FormGroup>
                    <div className="label-container">
                        <span className="field-label">E-mail</span>
                    </div>
                    <Input
                        
                    />
                    <FormFeedback
                    >
                        {this.state.errors.emailInvalid ? 'Please enter valid E-mail ID' : ''}
                    </FormFeedback>
                </FormGroup>
                <FormGroup>
                    <div className="label-container">
                        <span className="field-label">Password</span>
                    </div>
                    <Input
                        type="password"
                        name="password"
                        onChange={this.onInputChange}
                        onKeyPress={this.onKeyPress}
                        invalid={this.state.errors.passwordInvalid}
                    />
                    <FormFeedback
                    >
                        
                    </FormFeedback>
                </FormGroup>
                <div
                    className="response-text">
                    {this.state.errors.cognito ? this.state.errors.cognito.message : ''}
                </div>
                <div className="secondary-inputs">
                    <span className="forgot-password-button" >
                        <Link to="/forgot_password">Forgot Password?</Link>
                    </span>
                </div>
                <button
                    className="login-button"
                    size="sm"
                    onClick={this.onLoginSubmit}
                >{!this.state.isLoading ? "LOGIN" : <Spinner size="sm" color="white" />}
                </button>
                <div
                    style={{ margin: "-5px 0 -2px 0" }}>
                    <Link className="create-account-link" to="/signup"> Create an Account </Link>
                </div>
                {/* {
                    this.state.isModalOpen &&
                    <ResponseModal
                        modal={this.state.isModalOpen}
                        backdrop={true}
                        modalClass="response-modal"
                        titleClass={"title " + this.state.modal.status}
                        modalTitle={this.state.modal.title}
                        textClass="text"
                        modalText={this.state.modal.text}
                        buttonClass={"action-button " + this.state.modal.status}
                        buttonText={this.state.modal.buttonText}
                        onClickAction={this.onActionButtonClick}
                        linkObj={this.state.modal.linkObj}
                        type={this.state.modal.status}
                    />
                } */}
            </Fragment >
        );
    }
}

export default observer(Login);
