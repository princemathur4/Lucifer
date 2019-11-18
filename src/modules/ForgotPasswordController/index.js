import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import ForgotPasswordVerification from '../ForgotPasswordVerification';
import RequestVerificationCode from '../RequestVerificationCode';

class ForgotPasswordController extends Component {
	state = {
		email: '',
		// screen: 'requestVerificationCode'
		screen: 'requestVerificationCode'
	};

	changeScreen = (screen) => {
		this.setState({ screen });
	};

	setEmail = (email) => { 
		this.setState({ email });
	};

	render() {
		return (
			<Fragment>
				{this.state.screen === 'requestVerificationCode' && (
					<RequestVerificationCode
						{ ...this.props }
						changeScreen={this.changeScreen}
						setEmail={this.setEmail}
					/>
				)}
				{this.state.screen=== 'forgotPasswordVerification' &&(
					<ForgotPasswordVerification
						{...this.props}
						email={this.state.email}
					/>
			)}
			</Fragment>
		);
	}
}

export default observer(ForgotPasswordController);
