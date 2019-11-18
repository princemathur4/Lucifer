import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

class ConfirmSignUp extends Component {
	state = {
		code: '',
		isLoading: false,
		errors: {
			codeInvalid: false,
			cognito: null,
		}
	};

	clearErrorState = () => {
		this.setState({
			errors: {
				cognito: null,
				codeInvalid: false,
			}
		});
	};

	submitVerificationHandler = async event => {
		let self = this;
		this.setState({ isLoading: true });
		// Form validation
		this.clearErrorState();
		const error = Validate('confirmSignup', this.state);
		if (Object.keys(error).length) {
			this.setState({
				errors: { ...this.state.errors, ...error }
			});
			this.setState({ isLoading: false });
			return;
		}
		// AWS Cognito integration here
		const username = this.props.email;
		const code = this.state.code; 
		try {
			await Auth.confirmSignUp(username, code);
			this.setState({ isLoading: false });
			setTimeout(function () {
				self.props.history.push("/login");
			}, 2000);
		} catch (error) {
			let message = "";
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
			this.submitVerificationHandler(e);
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
				<button
					className={this.state.isLoading ? "button submit-button is-loading" : "submit-button"}
					onClick={this.submitVerificationHandler}
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

export default observer(ConfirmSignUp);