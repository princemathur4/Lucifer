import React, { Component, Fragment } from 'react';
import Validate from "../../utils/FormValidation";
import { Button, Form, FormGroup, Label, Input, FormFeedback, FormText, Spinner } from 'reactstrap';
import { observer } from 'mobx-react';
import axios from "axios";
import ResponseModal from '../../components/ResponseModal';
import Auth from '@aws-amplify/auth';
const queryString = require('query-string');
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { handleCreatePassword } from '../../utils/HandleAuthResponse';
import {Link} from 'react-router-dom';

class CreatePassword extends Component {
    constructor(props) {
        super(props);
        this.loaderStateElemRef = React.createRef();
    }
    state = {
        email: "",
        tempPassword: "",
        newPassword: "",
        confirmPassword: "",
        isLoading: false,
        isModalOpen: false,
        isLinkValid: 0,
        verifyLinkMsg: "",
        modal: {
            status: "",
            title: "",
            text: "",
            buttonText: ""
        },
        errors: {
            tempPasswordInvalid: false,
            newPasswordInvalid: false,
            confirmPasswordInvalid: false,
            cognito: null,
        }
    };

    /**
     * clears any error validation states so as to return back the component to normal state
     */
    clearErrorState = () => {
        this.setState({
            errors: {
                newPasswordInvalid: false,
                confirmPasswordInvalid: false,
                tempPasswordInvalid: false,
                cognito: null,
            }
        });
    };

    /**
     * this function handles the click on Submit button
     * It calls Validate function to check the validity of the inputs and takes action accordingly
     */
    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        let self = this;
        // Form validation
        this.clearErrorState();
        const error = Validate('createPassword', this.state);
        if (Object.keys(error).length) {
            this.setState({
                errors: { ...this.state.errors, ...error },
                isLoading: false
            });
            return;
        }
        // AWS Cognito integration here
        const { email, tempPassword, newPassword } = this.state;
        try {
            let user = await Auth.signIn(email, tempPassword); // calling signin API to try and sign in User directly
            let loggedUser = '';

            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') { // if account requires new password then complete the sign in flow with the new password 
                const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
                loggedUser = await Auth.completeNewPassword(
                    user,               // the Cognito User Object
                    newPassword,       // the new password
                    // OPTIONAL, the required attributes
                    { email }
                );
                user = loggedUser;
            }
            user = await Auth.currentAuthenticatedUser();
            this.showPopUpMessageModal(
                'success',
                'Success!',
                "You will be redirected to the app in a few seconds..",
                "OK"
            );

            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(user);

            setTimeout(function () {
                self.props.history.push("/");
            }, 1500);

            this.setState({ isLoading: false });
        } catch (err) {
            let message;
            console.log(err);
            message = handleCreatePassword(err);
            this.showPopUpMessageModal('error', 'Oops!', message, "TRY AGAIN");
            this.setState({ isLoading: false });
        }
    };

    /**
     * It changes popup modal state to render popup messages according to the configuration passed into the function
     *  @param { status } ['error', 'warning', 'success']
     *  @param { modalTitle } , title you want displayed on header of the modal
     *  @param { modalText }, text to be displayed inside the modal
     *  @param { buttonText }, text to be displayed on the close modal action button
     */
    showPopUpMessageModal = (status, modalTitle, modalText, buttonText) => {
        this.setState({
            isModalOpen: true,
            modal: {
                status: status,
                title: modalTitle,
                text: modalText,
                buttonText: buttonText
            }
        });
    };

    /**
     * calls check URL validity API for the given key and then content renders accordingly
     */
    checkUrlValidity = async () => {
        let url = process.env.REACT_APP_LIB_DOMAIN + '/create_password';
        let params = { key: queryString.parse(this.props.location.search, { ignoreQueryPrefix: true })['key'] };
        let verifyLinkMsg = "Something went wrong. Please try again later!";
        try {
            let response = await axios.post(url, params);
            console.log("response", response)
            if (response && response.status === 200 && response.data.status &&
                response.data.hasOwnProperty('data') && response.data.hasOwnProperty('status') && response.data.hasOwnProperty('data')) {
                this.setState({
                    isLinkValid: 1,
                    email: response.data.data
                });
            } else {
                verifyLinkMsg = "This link seems to have expired or is Invalid. Please request for another link from the signup page.";
                this.setState({
                    verifyLinkMsg: verifyLinkMsg,
                    isLinkValid: -1
                });
            }
        } catch (err) {
            console.log("error", err);
            if (err.hasOwnProperty("status")) {
                if (err.status >= 500) {
                    verifyLinkMsg = "Our servers seems to be down at the moment. Try refreshing the page after sometime.";
                } else if (err.status >= 400) {
                    verifyLinkMsg = "This link seems to be an invalid one.";
                }
            }
            this.setState({
                verifyLinkMsg: verifyLinkMsg,
                isLinkValid: -1
            });
        }
    };

    componentDidMount() {
        //TODO: Call to action on promise should be defined briefly
        this.checkUrlValidity().then(r => { console.log(r); });
    }

    /**
     * Handles Input changes on all fields
     * and updates state according to the name attribute present on target element
     */
    onInputChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    onKeyPress = (e) => {
        console.log(e)
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    }

    // gets called on popup modal action button click and modal is hidden after state update
    onActionButtonClick = () => {
        this.setState({
            isModalOpen: false
        });
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.isLinkValid === 0 &&
                    <div ref={this.loaderStateElemRef}>
                        <Spinner type="grow" color="secondary" />
                        <Spinner type="grow" color="secondary" />
                        <Spinner type="grow" color="secondary" />
                    </div>
                }
                {
                    this.state.isLinkValid === 1 &&
                    <Form>
                        <FormGroup>
                            <div className="label-container">
                                <span className="field-label">E-mail</span>
                            </div>
                            <Input
                                className="field-disabled"
                                type="text"
                                name="email"
                                value={this.state.email}
                                disabled
                            />
                        </FormGroup>
                        <FormGroup>
                            <div className="label-container">
                                <span className="field-label">Temporary Password</span>
                            </div>
                            <Input
                                type="password"
                                name="tempPassword"
                                onChange={this.onInputChange}
                                onKeyPress={this.onKeyPress}
                                // valid={!this.state.errors.newPasswordInvalid && this.state.newPassword && this.state.newPassword.length}
                                invalid={this.state.errors.tempPasswordInvalid}
                            />
                            <FormFeedback>{this.state.errors.tempPasswordInvalid ? 'Enter valid temporary password here' : ''}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <div className="label-container">
                                <span className="field-label">
                                    New Password
                                    <FontAwesomeIcon
                                        className="password-info"
                                        icon="info-circle"
                                        id="email-info-popover"
                                    />
                                    <UncontrolledPopover trigger="legacy" placement="bottom" target="email-info-popover">
                                        <PopoverBody>
                                            For security purposes, Please create a Password that contains atleast 8 characters, one uppercase, one lowercase, one number and a special character.
                                        </PopoverBody>
                                    </UncontrolledPopover>
                                </span>
                            </div>
                            <Input
                                type="password"
                                name="newPassword"
                                onChange={this.onInputChange}
                                onKeyPress={this.onKeyPress}
                                invalid={this.state.errors.newPasswordInvalid}
                            />
                            <FormFeedback>{this.state.errors.newPasswordInvalid ? 'Password must contain atleast 8 characters, one uppercase, one lowercase, one number and a special character.' : ''}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <div className="label-container">
                                <span className="field-label">Confirm Password</span>
                            </div>
                            <Input
                                type="password"
                                name="confirmPassword"
                                onChange={this.onInputChange}
                                onKeyPress={this.onKeyPress}
                                invalid={this.state.errors.confirmPasswordInvalid}
                            />
                            <FormFeedback >{this.state.errors.confirmPasswordInvalid ? "New Passwords don't match" : ''}</FormFeedback>
                            <FormText />
                        </FormGroup>
                        <div
                            className="response-text">
                            {this.state.responseText}
                        </div>
                        <div className="secondary-inputs">
                            <FormGroup check={true} className="keep-me-signed-in-container" check inline>
                                <Label check>
                                    <Input
                                        onChange={this.onInputChange}
                                        type="checkbox"
                                        defaultChecked={true}
                                    />
                                    <span className="keep-me-signed-in"> Keep me signed in</span>
                                </Label>
                            </FormGroup>
                        </div>
                        <Button className="login-button" size="sm" onClick={this.handleSubmit}>
                            {!this.state.isLoading ? "LOGIN" : <Spinner size="sm" color="white" />}
                        </Button>
                    </Form>
                }
                {
                    this.state.isLinkValid === -1 &&
                    <div
                        className="page-not-found"
                    >
                        <div className="link-error-title">Oops!</div>
                        <div className="link-error-message">{this.state.verifyLinkMsg}</div>
                        <div
                            style={{ margin: "-5px 0 -2px 0" }}>
                            <Link
                                className="create-account-link"
                                to="/signup"> Go back to Signup </Link>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}

export default observer(CreatePassword);
