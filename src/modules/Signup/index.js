import React, { Component, Fragment } from 'react';
import Validate from "../../utils/FormValidation";
import { Button, Form, FormGroup, Spinner, Input, FormFeedback } from 'reactstrap';
import { observer } from 'mobx-react';
import ResponseModal from '../../components/ResponseModal';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import AmplitudeAnalytics from "../../backends/amplitudeAnalytics";
import { Link } from 'react-router-dom';

class Signup extends Component {
    amplitudeAnalytics = new AmplitudeAnalytics();

    state = {
        email: "",
        isLoading: false,
        isModalOpen: false,
        modal: {
            status: "",
            title: "",
            text: "",
            buttonText: "",
            linkObj: {}
        },
        errors: {
            cognito: null,
            emailInvalid: false,
        }
    };

    /**
     * clears any error validation states so as to return back the component to normal state 
     */
    clearErrorState = () => {
        this.setState({
            errors: {
                cognito: null,
                emailInvalid: false,
            }
        });
    };

    /**
     * this function handles the click on Submit button
     * It calls Validate function to check the validity of the inputs and takes action accordingly
     * It also calls the API which signs up the user on our platform
     */
    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });

        // Form validation
        this.clearErrorState();

        const error = Validate('signUp', this.state);

        if (Object.keys(error).length) {
            this.setState({
                errors: { ...this.state.errors, ...error }
            });
            this.setState({ isLoading: false });
            return;
        }

        // AWS Cognito integration here
        const { email } = this.state;
        let status = "error";
        let heading = "Oops!";
        let linkObj;
        let buttonText = "OKAY";
        let message = "Something went wrong. Please try again later!";

        try {
            const params = {
                email: email,
            };
            let url = process.env.REACT_APP_LIB_DOMAIN + '/signup';
            let signUpResponse = await axios.post(url, params);

            if (signUpResponse && signUpResponse.hasOwnProperty('status') && signUpResponse.status === 200 && signUpResponse.data) {
                if (signUpResponse.data.status) {
                    status = "success";
                    heading = "Awesome!";
                    message = "Thank you for signing up with us. Please generate your password via the link sent to your email and login to our platform to access our research.";

                    //Amplitude tracking
                    this.amplitudeAnalytics.signup(email);
                } else if (signUpResponse.data.error_code >= 900) {
                    message = signUpResponse.data.error_message; // if starting with 9 then display response as it is
                    if (signUpResponse.data.error_code === 901) { // if mail already sent then display a warning response with a link on popup
                        status = "warning";
                        buttonText = "";
                        heading = "Mail already sent";
                        linkObj = {
                            link: "/resendmail",
                            text: "Resend link",
                            className: ""
                        }
                    }
                } else if (signUpResponse.data.error_code === 103) {
                    message = "Something went wrong. Please try again one more time.";
                    heading = "Something went wrong";
                    status = "warning";
                    buttonText = "GO BACK";
                } else {
                    message = "Sorry, our system does not recognize you. Please contact Spark Sales at sales@sparkcapital.in";
                    buttonText = "TRY AGAIN";
                }
            }
        } catch (err) {
            status = "error";
            buttonText = "TRY AGAIN";

            if (err.hasOwnProperty("status")) {
                if (err.status >= 500) {
                    message = "Our servers seems to be down at the moment. Please try again after sometime.";
                } else if (err.status >= 400) {
                    if (err.hasOwnProperty("data") && err.data.hasOwnProperty("error_message")) {
                        message = err.data.error_message;
                    }
                }
            }
            console.log(err);
        }

        this.showPopUpMessageModal(
            status,
            heading,
            message,
            buttonText,
            linkObj
        );
        this.setState({ isLoading: false });
    };

    /**
     * It changes popup modal state to render popup messages according to the configuration passed into the function
     *  @param { string } status - Modal status, if opened or closed
     *  @param { string } modalTitle - Title you want displayed on header of the modal
     *  @param { string } modalText - Text you want displayed on header of the modal
     *  @param { string } buttonText - text to be displayed on the close modal action button
     *  @param { object } linkObj - The link object
     */
    showPopUpMessageModal = (status, modalTitle, modalText, buttonText, linkObj) => {
        this.setState({
            isModalOpen: true,
            modal: {
                status: status,
                title: modalTitle,
                text: modalText,
                buttonText: buttonText,
                linkObj: linkObj
            }
        });
    };

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
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    };

    onActionButtonClick = () => {
        this.setState({
            isModalOpen: false
        });
    };

    render() {
        return (
            <Fragment>
                <Form>
                    <FormGroup>
                        <div className="label-container">
                            <span className="field-label">E-mail</span>
                        </div>
                        <Input
                            type="text"
                            name="email"
                            placeholder="example@abc.com"
                            onChange={this.onInputChange}
                            onKeyPress={this.onKeyPress}
                            invalid={this.state.errors.emailInvalid}
                        />
                        <FormFeedback>
                            {this.state.errors.emailInvalid ? 'Please Enter Valid E-mail ID' : ''}
                        </FormFeedback>
                    </FormGroup>
                    <div
                        style={{ margin: "-5px 0 -2px 0" }}>
                        <Link className="resend-mail-link" to="/resendmail"> Resend E-mail </Link>
                        <FontAwesomeIcon
                            className="email-info"
                            icon="info-circle"
                            id="email-info-popover"
                        />
                        <UncontrolledPopover trigger="legacy" placement="bottom" target="email-info-popover">
                            <PopoverBody>
                                If you didn't complete the sign up process by generating a new password for your account then click on this link to recieve a new mail again.
                            </PopoverBody>
                        </UncontrolledPopover>
                    </div>
                    <Button
                        className="signup-button"
                        size="sm"
                        onClick={this.handleSubmit}
                    >
                        {!this.state.isLoading ? "SIGNUP" : ""}
                        {this.state.isLoading && <Spinner size="sm" color="white" />}
                    </Button>
                    <div
                        style={{ margin: "-5px 0 -2px 0" }}>
                        <Link className="back-to-login-link" to="/login"> Go back to Login </Link>
                    </div>
                </Form>
                {
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
                }
            </Fragment>
        );
    }
}

export default observer(Signup);
