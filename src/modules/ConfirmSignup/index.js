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
		infoMessage: "One more step! A Verification code is sent to your registered mail ID. Please submit it here to confirm your account.",
		errors: {
			responseText: '',
			codeInvalid: false,
		}
	};

	clearErrorState = () => {
		this.setState({
			errors: {
				responseText: '',
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
			this.setState({ infoMessage: "Done! You can now login to continue shopping.", errors: { ...this.state.errors, responseText: "" }, isLoading: false });
			setTimeout(function () {
				self.props.history.push("/login");
			}, 2500);
		} catch (error) {
			let responseText = "";
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

	onCloseResponse = () => {
		let { errors } = this.state; 
		this.setState({
			errors: { ...errors, responseText: ""} 
		})
	}

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
				{
                    this.state.errors.responseText &&
					<div className="response-text is-error">
                        <span className="response-tag">
                            {this.state.errors.responseText}
                        </span>
                        <button className="delete is-small" onClick={this.onCloseResponse} ></button>
                    </div>
                }
				{
					!this.state.errors.responseText &&
					this.state.infoMessage &&
					<div className="response-text is-info">
						<span className="response-tag">
							{this.state.infoMessage}
						</span>
						<button className="delete is-small" onClick={() => { this.setState({ infoMessage: "" }) }} ></button>
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
									Enter valid verfication code
                                </p>
							</Fragment>
						}
					</div>
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