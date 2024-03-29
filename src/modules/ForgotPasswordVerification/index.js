import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';

class ForgotPasswordVerification extends Component {
	contextRef = React.createRef();
	state = {
		code: '',
		newPassword: '',
		confirmPassword: '',
		isLoading: false,
		infoMessage: "A Verification code is sent to your registered mail ID. Please submit it here to change your password.",
		errors: {
			responseText: "",
			codeInvalid: false,
			newPasswordInvalid: false,
			confirmPasswordInvalid: false,
		}
	};

	clearErrorState = () => {
		this.setState({
			errors: {
				responseText: "",
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
		// AWS Cognito integration here
		try {
			await Auth.forgotPasswordSubmit(
				"+91" + this.props.mobile,
				this.state.code,
				this.state.newPassword
			);
			this.setState({ 
				infoMessage: "Success! Password changed succesfully.", 
				errors: { ...this.state.errors, responseText: "" },
				isLoading: false
			});
			setTimeout(function () {
				self.props.history.push("/login");
			}, 2500);
		} catch (error) {
			let responseText = "We couldn't reset your Password at the moment. Please try again after sometime";
			if (error.hasOwnProperty("code") && error.hasOwnProperty("message")) { //"CodeDeliveryFailureException"/"LimitExceededException"
				responseText = error.message;
			} else if (typeof error === "String") {
				responseText = error;
			}
			this.setState({
				errors: {
					...this.state.errors, responseText
				},
				infoMessage: "",
				isLoading: false
			})
			console.log(error);
		}
	};

	changeFocus = (state) => {
		this.setState({ focus: state });
	}

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

	onCloseResponse = () => {
		this.setState({
			responseText: "",
			responseType: "",
			errors: { ...this.state.errors }
		})
	}

	render() {
		return (
			<Fragment>
				{
                    this.state.responseText &&
					<div className={`response-text is-${this.state.responseType}`}>
                        <span className="response-tag">
                            {this.state.responseText}
                        </span>
                        <button className="delete is-small" onClick={this.onCloseResponse} ></button>
                    </div>
                }
				<div className="field">
					<div className={!this.state.errors.codeInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input
							className={!this.state.errors.codeInvalid ? "input" : "input is-danger"}
							type="text"
							placeholder="Enter Verification Code"
							name="code"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="key" />
						</span>
						{
							this.state.errors.codeInvalid &&
							<Fragment>
								<span className="icon is-small is-right">
									<FontAwesomeIcon icon="exclamation-triangle" />
								</span>
								<p className="help is-danger">
									Enter a valid verfication code
                                </p>
							</Fragment>
						}
					</div>
				</div>
				<Popup
					context={this.contextRef}
					content='Password must be atleast 8 characters, contain atleast one alphabet, one Number and one Special character.'
					position='right center'
					open={this.state.focus}
				/>
				<div className="field">
					<div className={!this.state.errors.newPasswordInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input 
							className={!this.state.errors.newPasswordInvalid ? "input" : "input is-danger"}
							type="password"
							ref={this.contextRef}
							placeholder="Enter new password"
							name="newPassword"
							onFocus={()=>{this.changeFocus(true)}}
							onBlur={()=>{this.changeFocus(false)}}
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="lock" />
						</span>
						{
							this.state.errors.newPasswordInvalid &&
							<Fragment>
								<span className="icon is-small is-right">
									<FontAwesomeIcon icon="exclamation-triangle" />
								</span>
								<p className="help is-danger">
									Password must contain atleast 8 characters, one uppercase, one lowercase and one number.
                                </p>
							</Fragment>
						}
					</div>
				</div>
				<div className="field">
					<div className={!this.state.errors.confirmPasswordInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input 
							className={!this.state.errors.confirmPasswordInvalid ? "input" : "input is-danger"}
							type="password"
							placeholder="Re-enter new password"
							name="confirmPassword"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="lock" />
						</span>
						{
							this.state.errors.confirmPasswordInvalid &&
							<Fragment>
								<span className="icon is-small is-right">
									<FontAwesomeIcon icon="exclamation-triangle" />
								</span>
								<p className="help is-danger">
									Passwords don't match
                                </p>
							</Fragment>
						}
					</div>
				</div>
				<button
					className={this.state.isLoading ? "button change-password-button is-loading" : "change-password-button"}
					onClick={this.passwordVerificationHandler}
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
