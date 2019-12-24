import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import ForgotPasswordVerification from '../ForgotPasswordVerification';
import RequestVerificationCode from '../RequestVerificationCode';

class ForgotPasswordController extends Component {
	state = {
		mobile: '',
		// screen: 'requestVerificationCode'
		screen: 'requestVerificationCode'
	};

	changeScreen = (screen) => {
		this.setState({ screen });
	};

	setMobile = (mobile) => { 
		this.setState({ mobile });
	};

	render() {
		return (
			<Fragment>
				{this.state.screen === 'requestVerificationCode' && (
					<RequestVerificationCode
						{ ...this.props }
						changeScreen={this.changeScreen}
						setMobile={this.setMobile}
					/>
				)}
				{this.state.screen=== 'forgotPasswordVerification' &&(
					<ForgotPasswordVerification
						{...this.props}
						mobile={this.state.mobile}
					/>
			)}
			</Fragment>
		);
	}
}

export default observer(ForgotPasswordController);
