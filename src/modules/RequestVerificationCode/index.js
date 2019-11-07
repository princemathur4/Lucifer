import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';

class RequestVerificationCode extends Component {
	state = {
		email: '',
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
			emailInvalid: false,
			cognito: null,
		}
	};

	clearErrorState = () => {
		this.setState({
			responseText: "",
			errors: {
				cognito: null,
				emailInvalid: false,
			}
		});
	};

	forgotPasswordHandler = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });
		// Form validation
		this.clearErrorState();
		const error = Validate('requestVerificationCode', this.state);
		if (Object.keys(error).length) {
			this.setState({
				errors: { ...this.state.errors, ...error },
				isLoading: false
			});
			return;
		}
		let self = this;
		let message, buttonText, linkObj;
		let status = 'error';
		// AWS Cognito integration here
		try {
			await Auth.forgotPassword(this.state.email);
			this.setState({ isLoading: false });
			this.props.setEmail(this.state.email);
			setTimeout(function () {
				self.props.changeScreen('forgotPasswordVerification')
			}, 2500);
			this.showPopUpMessageModal(
				'success',
				'One more step',
				"We have sent a verification code to your E-mail ID. Please copy it to the next screen along with your new password to complete the process!",
				"Okay"
			);
		} catch (error) {
			if (error.code === "NotAuthorizedException") {
				if (error.message === "User is disabled") {
					message = "User is Disabled. Please contact Spark Capital at sales@sparkcapital.in"
				} else {
					message = "Looks like you've not completed the sign up process yet. Click here to generate a fresh new password for your account.";
					buttonText = "";
					linkObj = {
						link: "/resendmail",
						text: "Resend link",
						className: ""
					}
				}
			} else if (error.code === "UserNotFoundException") {
				message = "We are sorry, but we couldn't verify your account. Try to sign up again on our platform or else if you're facing a problem you may write to sales@sparkcapital.in";
				buttonText = "";
				linkObj = {
					link: "/signup",
					text: "Sign Up!",
					className: ""
				}
			} else if (error.code === "CodeDeliveryFailureException") {
				message = "We are sorry, but we couldn't send the verification code to your E-mail. Please check the email you've entered and try again.";
				buttonText = "OKAY";
			} else if (error.code === "InternalErrorException") {
				message = "Our servers are down for the moment. Please try again after sometime.";
				buttonText = "TRY AGAIN";
			} else {
				message = "Something went wrong. Please try again later.";
				buttonText = "OKAY";
			}
			// TODO: add an if statement here for error code wise response handling
			this.showPopUpMessageModal(
				status,
				'Oops!',
				message,
				buttonText,
				linkObj
			);
			this.setState({ isLoading: false });
			console.log(error);
		}
	};

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

	onInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onActionButtonClick = () => {
		this.setState({
			isModalOpen: false
		});
	}

	render() {
		return (
			<Fragment>
					<div className="field">
						<div className="field-label">EMAIL</div>
						<p className="control has-icons-left has-icons-right">
							<input
								className="input"
								type="email"
								placeholder="Email"
								name="email"
								onChange={this.onInputChange}
								onKeyPress={this.onKeyPress}
							/>
							<span className="icon is-small is-left">
								<FontAwesomeIcon icon="envelope" />
							</span>
						</p>
						<div className="form-feedback">{this.state.errors.emailInvalid ? 'Please enter valid E-mail ID' : ''}</div>
					</div>
					<div
						className="response-text">
						{this.state.errors.cognito ? this.state.errors.cognito.message : ''}
					</div>
					<button
						className="change-password-button"
						onClick={this.forgotPasswordHandler}
					>{!this.state.isLoading ? "SUBMIT" : <Spinner size="sm" color="white" />}
					</button>
					<div
						style={{ margin: "-5px 0 -2px 0" }}>
						<Link className="back-to-login-link" to="/login"> Go back to Login </Link>
					</div>
			</Fragment>
		);
	}
}

export default observer(RequestVerificationCode);
