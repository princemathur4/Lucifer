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
			emailInvalid: false,
			newPasswordInvalid: false,
			confirmPasswordInvalid: false,
			cognito: null,
		}
	};

	clearErrorState = () => {
		this.setState({
			responseText: "",
			errors: {
				cognito: null,
				nameInvalid: false,
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
			this.setState({ isLoading: false });
			this.props.setEmail(this.state.email);
			setTimeout(function () {
				self.props.changeScreen('confirmSignup')
			}, 2500);
		}catch(e){
			console.error(e);
		}
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
				<div className="response-text">
					{this.state.errors.cognito || this.state.errors.emailInvalid || this.state.errors.passwordInvalid ? <span className="tag is-danger is-light is-medium">Incorrect Email Number or Password</span> : ''}
				</div>
				<div className="field">
					<div className="field-label">NAME</div>
					<p className="control has-icons-left has-icons-right">
						<input
							className="input"
							type="text"
							placeholder=""
							name="name"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="user" />
						</span>
					</p>
				</div>
				<div className="field">
					<div className="field-label">E-MAIL</div>
					<p className="control has-icons-left has-icons-right">
						<input
							className="input"
							type="text"
							placeholder=""
							name="email"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="envelope" />
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
					className={this.state.isLoading ? "button signup-button is-loading" : "signup-button"}
					onClick={this.signUpHandler}
				>
					Sign Up!
                </button>
				<div className="or-text-container">
					<b>OR</b>
					<div className="sign-up-using-text">
						Sign in using
                    </div>
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
				<div className="link-container">
					<Link className="back-to-login-link" to="/login"> Go back to Sign In </Link>
				</div>
			</Fragment>
		);
	}
}

export default observer(Signup);
