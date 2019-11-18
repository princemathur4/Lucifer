import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

class ForgotPasswordVerification extends Component {
	state = {
		code: '',
		newPassword: '',
		confirmPassword: '',
		isLoading: false,
		errors: {
			codeInvalid: false,
			newPasswordInvalid: false,
			confirmPasswordInvalid: false,
			cognito: null,
		}
	};

	clearErrorState = () => {
		this.setState({
			errors: {
				cognito: null,
				codeInvalid: false,
				newPasswordInvalid: false,
				confirmPasswordInvalid: false,
			}
		});
	};

	passwordVerificationHandler = async event => {
		event.preventDefault();
		let self = this;
		this.setState({ isLoading: true });
		// Form validation
		this.clearErrorState();
		const error = Validate('forgotPasswordVerification', this.state);
		if (Object.keys(error).length) {
			this.setState({
				errors: { ...this.state.errors, ...error }
			});
			this.setState({ isLoading: false });
			return;
		}
		let message = "We couldn't reset your Password at the moment. Please try again after sometime or write to sales@sparkcapital.in";
		// AWS Cognito integration here
		const username = this.props.email;
		try {
			await Auth.forgotPasswordSubmit(
				username,
				this.state.code,
				this.state.newPassword
			);
			this.setState({ isLoading: false });
			setTimeout(function () {
				self.props.history.push("/login");
			}, 2000)
		} catch (error) {
			if (error.hasOwnProperty("code") && error.hasOwnProperty("message")) { //"CodeDeliveryFailureException"/"LimitExceededException"
				message = error.message;
			} else if (typeof error === "String") {
				message = error;
			}
			this.setState({ isLoading: false });
			console.log(error);
		}
	};

	onInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onKeyPress = (e) => {
		console.log(e)
		if (e.key === 'Enter') {
			this.passwordVerificationHandler(e);
		}
	}

	render() {
		return (
			<Fragment>
				<div className="response-text">
					{this.state.errors.cognito || this.state.errors.emailInvalid || this.state.errors.passwordInvalid ? <span className="tag is-danger is-light is-medium">Incorrect Email or Password</span> : ''}
				</div>
				<div className="field">
					<div className="field-label">VERIFICATION CODE</div>
					<p className="control has-icons-left has-icons-right">
						<input
							className="input"
							type="text"
							placeholder=""
							name="code"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="key" />
						</span>
					</p>
				</div>
				<div className="field">
					<div className="field-label">
						NEW PASSWORD
					</div>
					<p className="control has-icons-left">
						<input className="input"
							type="password"
							placeholder=""
							name="newPassword"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="lock" />
						</span>
					</p>
				</div>
				<div className="field">
					<div className="field-label">
						CONFIRM NEW PASSWORD
					</div>
					<p className="control has-icons-left">
						<input className="input"
							type="password"
							placeholder=""
							name="confirmPassword"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="lock" />
						</span>
					</p>
				</div>
				<button
					className={this.state.isLoading ? "button change-password-button is-loading" : "change-password-button"}
					onClick={this.signUpHandler}
				>
					Change password
                </button>
				<div className="link-container">
					<Link className="back-to-login-link" to="/login"> Go back to Sign In </Link>
				</div>
			</Fragment>
		);
	}
}

export default observer(ForgotPasswordVerification);
