import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Button, Form, FormGroup, Spinner, Input, FormFeedback } from 'reactstrap';
import Validate from "../../utils/FormValidation";
import Auth from '@aws-amplify/auth';
import ResponseModal from '../../components/ResponseModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { Link } from 'react-router-dom';

class ForgotPasswordVerification extends Component {
	state = {
		code: '',
		newPassword: '',
		confirmPassword: '',
		isLoading: false,
		isModalOpen: false,
		modal: {
			status: "",
			title: "",
			text: "",
			buttonText: ""
		},
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
		try {
			await Auth.forgotPasswordSubmit(
				this.props.email,
				this.state.code,
				this.state.newPassword
			);
			this.setState({ isLoading: false });
			this.showPopUpMessageModal(
				'success',
				'Done!',
				"Your Password has been reset successfully. Redirecting to login page now.",
				"OKAY"
			);
			setTimeout(function () {
				self.props.history.push("/login");
			}, 2000)
		} catch (error) {
			if (error.hasOwnProperty("code") && error.hasOwnProperty("message")) { //"CodeDeliveryFailureException"/"LimitExceededException"
				message = error.message;
			} else if (typeof error === "String") {
				message = error;
			}
			this.showPopUpMessageModal(
				'error',
				'Oops!',
				message,
				"TRY AGAIN"
			);
			this.setState({ isLoading: false });
			console.log(error);
		}
	};

	showPopUpMessageModal = (status, modalTitle, modalText, buttonText) => {
		this.setState({
			isModalOpen: true,
			modal: {
				status: status,
				title: modalTitle,
				text: modalText,
				buttonText: buttonText
			}
		});
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

	// gets called on popup modal action button click and modal is hidden after state update
	onActionButtonClick = () => {
		this.setState({
			isModalOpen: false
		});
	}

	render() {
		return (
			<Fragment>
				<Form>
					<FormGroup>
						<div className="label-container">
							<span className="field-label">Verification code</span>
						</div>
						<Input
							type="text"
							name="code"
							onChange={this.onInputChange}
							invalid={this.state.errors.codeInvalid}
							onKeyPress={this.onKeyPress}
						/>
						<FormFeedback>
							{this.state.errors.codeInvalid ? "Please Enter a valid Code" : ''}
						</FormFeedback>
					</FormGroup>
					<FormGroup>
						<div className="label-container">
							<span className="field-label">
								New Password
								<FontAwesomeIcon
									className="password-info"
									icon="info-circle"
									id="email-info-popover"
								/>
								<UncontrolledPopover trigger="legacy" placement="bottom" target="email-info-popover">
									<PopoverBody>
										For security purposes, Please create a Password that contains atleast 8 characters, one uppercase, one lowercase, one number and a special character.
									</PopoverBody>
								</UncontrolledPopover>
							</span>
						</div>
						<Input
							type="password"
							name="newPassword"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
							invalid={this.state.errors.newPasswordInvalid}
						/>
						<FormFeedback >{this.state.errors.newPasswordInvalid ? "Password should contain atleast 8 characters, one uppercase, one lowercase and one number" : ''}</FormFeedback>
					</FormGroup>
					<FormGroup>
						<div className="label-container">
							<span className="field-label">Confirm Password</span>
						</div>
						<Input
							type="password"
							name="confirmPassword"
							onChange={this.onInputChange}
							onKeyPress={this.onKeyPress}
							invalid={this.state.errors.confirmPasswordInvalid}
						/>
						<FormFeedback >{this.state.errors.confirmPasswordInvalid ? "Passwords Don't match" : ""}</FormFeedback>
					</FormGroup>
					<Button
						className="change-password-button"
						size="sm"
						onClick={this.passwordVerificationHandler}
					>
						{!this.state.isLoading ? "SUBMIT" : ""}
						{this.state.isLoading && <Spinner size="sm" color="white" />}
					</Button>
					<div
						style={{ margin: "-5px 0 -2px 0" }}>
						<Link className="back-to-login-link" to="/login"> Go back to Login </Link>
					</div>
				</Form>
				{this.state.isModalOpen &&
					<ResponseModal
						modal={this.state.isModalOpen}
						backdrop='static'
						modalClass="response-modal"
						titleClass={"title " + this.state.modal.status}
						modalTitle={this.state.modal.title}
						textClass="text"
						modalText={this.state.modal.text}
						buttonClass={"action-button " + this.state.modal.status}
						buttonText={this.state.modal.buttonText}
						onClickAction={this.onActionButtonClick}
						type={this.state.modal.status}
					/>
				}
			</Fragment>
		);
	}
}

export default observer(ForgotPasswordVerification);
