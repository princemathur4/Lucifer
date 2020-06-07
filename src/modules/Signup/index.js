import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FacebookButton from "../../components/FacebookButton";
import commonApi from "../../apis/common";
import GoogleButton from '../../components/GoogleButton';
import { Popup } from "semantic-ui-react";

class Signup extends Component {
	contextRef = React.createRef();
	state = {
		focus: false,
		name: "",
		email: '',
		mobile: '',
		newPassword: '',
		confirmPassword: '',
		isLoading: false,
		responseText: '',
		errors: {
			nameInvalid: false,
			emailInvalid: false,
			mobileInvalid: false,
			newPasswordInvalid: false,
			confirmPasswordInvalid: false,
		}
	};
	
	clearErrorState = () => {
		this.setState({
			responseText: '',
			errors: {
				nameInvalid: false,
				mobileInvalid: false,
				emailInvalid: false,
				newPasswordInvalid: false,
				confirmPasswordInvalid: false,
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
				errors: { ...error },
				isLoading: false
			});
			return;
		}
		const { name, email } = this.state;
		const username = "+91" + this.state.mobile ;
		const password = this.state.newPassword;
		let self = this;
		// AWS Cognito integration here
		try{
			let response = await Auth.signUp({
				username,
				password,
				attributes:{
					name,
					email
				}
			})
			console.log(response);
			this.props.setMobile(this.state.mobile);
			self.props.changeScreen('confirmSignup');
		}catch(error){
			console.error(error);
			let responseText = "";
			if (error.hasOwnProperty("code") && error.hasOwnProperty("message")) { //"CodeDeliveryFailureException"/"LimitExceededException"
				if(error.code === "UsernameExistsException"){
					responseText = "An Account already exists with the given phone number/Email.";
				} else {
					responseText = error.message;
				}
			} else if (typeof error === "String") {
				responseText = error;
			}
			this.setState({
				responseText,
				errors: {
					...this.state.errors,
				},
				isLoading: false
			})
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
		console.log(e);
		if (e.key === 'Enter') {
			this.signUpHandler(e);
		}
	}

	render() {
		return (
			<Fragment>
				{
					this.state.responseText &&
					<div className="response-text is-error">
						<span className="response-tag">
							{this.state.responseText}
						</span>
						<button className="delete is-small" onClick={this.onCloseResponse} ></button>
					</div>
				}
				{/* <div className="sign-up-using-text">
					Sign in using
				</div>
				<div className="field has-addons" style={{ display: "flex", justifyContent: "center" }}>
					<p className="control">
						<GoogleButton {...this.props}/>
					</p>
					<p className="control">
						<FacebookButton {...this.props}/>
					</p>
				</div>
				<div className="or-text-container">
					<b>OR</b>
				</div> */}
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
									This is a compulsory name
                                </p>
							</Fragment>
						}
					</div>
				</div>
				<div className="field">
					<div className={!this.state.errors.mobileInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input
							className={!this.state.errors.mobileInvalid ? "input" : "input is-danger"}
							type="text"
							placeholder="Enter your phone number"
							name="mobile"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="mobile-alt" />
						</span>
						{
							this.state.errors.mobileInvalid &&
							<Fragment>
								<span className="icon is-small is-right">
									<FontAwesomeIcon icon="exclamation-triangle" />
								</span>
								<p className="help is-danger">Phone number must be ten digits</p>
							</Fragment>
						}
					</div>
				</div>
				<div className="field">
					<div className={!this.state.errors.emailInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
						<input
							className={!this.state.errors.emailInvalid ? "input" : "input is-danger"}
							type="text"
							placeholder="Enter your Email (Optional)"
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
							placeholder="Enter New Password"
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
					<Link className="forgot-password-link" to="/resend_verification_code"> Resend Code! </Link>
				</div>
			</Fragment>
		);
	}
}

export default observer(Signup);
