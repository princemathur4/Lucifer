import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import ForgotPasswordVerification from '../ForgotPasswordVerification';
import RequestVerificationCode from '../RequestVerificationCode';

class ForgotPasswordController extends Component {
	state = {
		phone: '',
		// screen: 'requestVerificationCode'
		screen: 'forgotPasswordVerification'
	};

	changeScreen = (screen) => {
		this.setState({ screen })
	};

	setPhone = (phone) => { 
		this.setState({ phone })
	};

	render() {
		return (
			<Fragment>
				{this.state.screen === 'requestVerificationCode' && (
					<RequestVerificationCode
						{ ...this.props }
						changeScreen={this.changeScreen}
						setPhone={this.setPhone}
					/>
				)}
				{this.state.screen=== 'forgotPasswordVerification' &&(
					<ForgotPasswordVerification
						{...this.props}
						phone={this.state.phone}
					/>
			)}
			</Fragment>
		);
	}
}

export default observer(ForgotPasswordController);
