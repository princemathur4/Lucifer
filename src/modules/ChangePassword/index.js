import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./style.scss";
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import { Popup } from "semantic-ui-react";

class ChangePassword extends Component {
	contextRef = React.createRef();
	state = {
		focus: false,
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
		isLoading: false,
		responseText: '',
		errors: {
			oldPasswordInvalid: false,
			newPasswordInvalid: false,
			confirmPasswordInvalid: false,
		}
	};

	clearErrorState = () => {
		this.setState({
			responseText: '',
			errors: {
				oldPasswordInvalid: false,
				newPasswordInvalid: false,
				confirmPasswordInvalid: false,
			}
		})
	};

	changePasswordHandler = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });

		// Form validation
		this.clearErrorState();
		const error = Validate('changePassword', this.state);
		if (Object.keys(error).length) {
			this.setState({
				errors: { ...error },
				isLoading: false
			});
			return;
		}
		const { oldPassword, newPassword } = this.state;
		let self = this;
		// AWS Cognito integration here
		try {
			let user = await Auth.currentAuthenticatedUser();
			let response = await Auth.changePassword(
				user,
				oldPassword,
				newPassword
			);
			this.setState({ isLoading: false, responseText: "Password Changed successfully", responseType: "success" });
			console.log(response);
		} catch (error) {
			console.error(error);
			let responseText = "";
			if (error.hasOwnProperty("code") && error.hasOwnProperty("message")) { //"CodeDeliveryFailureException"/"LimitExceededException"
				responseText = error.message;
			} else if (typeof error === "String") {
				responseText = error;
			}
			this.setState({
				responseText,
				responseType: "error",
				errors: {
					...this.state.errors,
				},
				isLoading: false
			})
		}
	};

	onCloseResponse = () => {
		this.setState({ responseText: "" });
	}

	changeFocus = (state) => {
		this.setState({ focus: state });
	}

	onInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	
	render() {
		return (
			<Fragment>
				<div className="security-container">
					<div className="security-header">
						<div className="header-text is-size-5">
							Change Password
						</div>
					</div>
					<div className="security-body">
						<div className="field">
							<div className={!this.state.errors.oldPasswordInvalid ? "control has-icons-left" : "control has-icons-left has-icons-right is-danger"}>
								<input
									className={!this.state.errors.oldPasswordInvalid ? "input" : "input is-danger"}
									type="password"
									placeholder="Enter Old Password"
									name="oldPassword"
									onChange={this.onInputChange}
								/>
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon="lock" />
								</span>
								{
									this.state.errors.oldPasswordInvalid &&
									<Fragment>
										<span className="icon is-small is-right">
											<FontAwesomeIcon icon="exclamation-triangle" />
										</span>
										<p className="help is-danger">
											Invalid old password
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
									ref={this.contextRef}
									className={!this.state.errors.newPasswordInvalid ? "input" : "input is-danger"}
									type="password"
									placeholder="Enter New Password"
									name="newPassword"
									onFocus={()=>{this.changeFocus(true)}}
									onBlur={()=>{this.changeFocus(false)}}
									onChange={this.onInputChange}
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
											Password must contain atleast 8 characters, a combination of alphabets and numbers.
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
							className={this.state.isLoading ? "button save-button is-loading" : "button save-button"}
							onClick={this.changePasswordHandler}
						>
							Save and continue
						</button>
						{
							this.state.responseText &&
							<div className={`response-text is-${this.state.responseType}`}>
								<span className="response-tag">
									{this.state.responseText}
								</span>
								<button className="delete is-small" onClick={this.onCloseResponse} ></button>
							</div>
						}
					</div>
				</div>
			</Fragment>
		);
	}
}

export default observer(ChangePassword);
