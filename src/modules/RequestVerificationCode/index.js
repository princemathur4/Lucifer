import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class RequestVerificationCode extends Component {
	state = {
		email: '',
		isLoading: false,
		isModalOpen: false,
		errors: {
			emailInvalid: false,
			responseText: "",
		}
	};

	clearErrorState = () => {
		this.setState({
			errors: {
				emailInvalid: false,
				responseText: "",
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
		let responseText;
		// AWS Cognito integration here
		try {
			await Auth.forgotPassword(this.state.email);
			this.props.setEmail(this.state.email);
			this.setState({ isLoading: false });
			this.props.changeScreen('forgotPasswordVerification');
		} catch (error) {
			console.log(error);
			if (error.code === "NotAuthorizedException") {
				if (error.message === "User is disabled") {
					responseText = "User is Disabled. Please ask for support from our support page."
				} else {
					responseText = "Looks like you've not completed the sign up process yet. Go to our sign up page to create a new account.";
				}
			} else if (error.code === "UserNotFoundException") {
				responseText = "Sorry we couldn't verify your account. Try to sign up again on our platform.";
			} else if (error.code === "CodeDeliveryFailureException") {
				responseText = "Sorry we couldn't send the verification code to your E-mail. Please check the email you've entered and try again.";
			} else if (error.code === "InternalErrorException") {
				responseText = "Our servers are down for the moment. Please try again after sometime.";
			} else if (error.code === "LimitExceededException") {
				responseText = "Attempt limit exceeded, please try again after sometime.";
			} else {
				responseText = "Something went wrong. Please try again after sometime.";
			}
			this.setState({
				errors: {
					...this.state.errors, responseText
				},
				isLoading: false
			})
		}
	};

	onInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.forgotPasswordHandler(e);
		}
	};
 
	onCloseResponse = () => {
		this.setState({
			errors: { ...this.state.errors, responseText: "" }
		})
	}

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
				<div className="field">
					<div className={!this.state.errors.emailInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input
							className={!this.state.errors.emailInvalid ? "input" : "input is-danger"}
							type="email"
							placeholder="Enter your Email-ID"
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
								<p className="help is-danger">
									Please enter your registered Email-ID
                                </p>
							</Fragment>
						}
					</div>
				</div>
				<button
					className={this.state.isLoading ? "button submit-button is-loading" : "submit-button"}
					onClick={this.forgotPasswordHandler}
				>
					Submit
                </button>
				<div className="link-container">
					<Link className="back-to-login-link" to="/login"> Go back to Sign In </Link>
				</div>
			</Fragment>
		);
	}
}

export default observer(RequestVerificationCode);
