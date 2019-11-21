import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FacebookButton from "../../components/FacebookButton";

class Signup extends Component {
	state = {
		name: "",
		email: '',
		newPassword: '',
		confirmPassword: '',
		isLoading: false,
		errors: {
			nameInvalid: false,
			emailInvalid: false,
			newPasswordInvalid: false,
			confirmPasswordInvalid: false,
			responseText: ''
		}
	};
	
	clearErrorState = () => {
		this.setState({
			errors: {
				nameInvalid: false,
				emailInvalid: false,
				newPasswordInvalid: false,
				confirmPasswordInvalid: false,
				responseText: ''
			}
		})
	};

	signUpHandler = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });

		// Form validation
		this.clearErrorState();
		const error = Validate('signUp', this.state);
		if (Object.keys(error).length) {
			this.setState({
				errors: { ...this.state.errors, ...error },
				isLoading: false
			});
			return;
		}
		const { name } = this.state;
		const username = this.state.email;
		const password = this.state.newPassword;
		let self = this;
		// AWS Cognito integration here
		try{
			let response = await Auth.signUp({
				username,
				password,
				attributes:{
					name
				}
			})
			console.log(response);
			this.props.setEmail(this.state.email);
			self.props.changeScreen('confirmSignup');
		}catch(error){
			console.error(error);
			let responseText = "";
			if (error.hasOwnProperty("code") && error.hasOwnProperty("message")) { //"CodeDeliveryFailureException"/"LimitExceededException"
				responseText = error.message;
			} else if (typeof error === "String") {
				responseText = error;
			}
			this.setState({
				errors: {
					...this.state.errors,
					responseText
				},
			})
		}
		this.setState({ isLoading: false });
	};

	onInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onKeyPress = (e) => {
		console.log(e);
		if (e.key === 'Enter') {
			this.signUpHandler(e);
		}
	}

	render() {
		return (
			<Fragment>
				{
					this.state.errors.responseText &&
					<div className="response-text">
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
							<span className="icon is-small" style={{ height: "1rem" }}>
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
					<div className={!this.state.errors.nameInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input
							className={!this.state.errors.nameInvalid ? "input" : "input is-danger"}
							type="text"
							placeholder="Enter your Name"
							name="name"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="user" />
						</span>
						{
							this.state.errors.nameInvalid &&
							<Fragment>
								<span className="icon is-small is-right">
									<FontAwesomeIcon icon="exclamation-triangle" />
								</span>
								<p className="help is-danger">
									This is a mandatory field
                                </p>
							</Fragment>
						}
					</div>
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
								<p className="help is-danger">Please enter a valid E-mail ID</p>
							</Fragment>
						}
					</div>
				</div>
				<div className="field">
					<div className={!this.state.errors.newPasswordInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input 
							className={!this.state.errors.newPasswordInvalid ? "input" : "input is-danger"}
							type="password"
							placeholder="Enter New Password"
							name="newPassword"
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
							placeholder="Re-enter New Password"
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
					className={this.state.isLoading ? "button signup-button is-loading" : "signup-button"}
					onClick={this.signUpHandler}
				>
					Sign Up!
                </button>
				<div className="links-container">
					<Link className="back-to-login-link" to="/login"> Go back to Sign In </Link>
					<Link className="forgot-password-link" to="/resend_mail"> Resend Mail! </Link>
				</div>
			</Fragment>
		);
	}
}

export default observer(Signup);
