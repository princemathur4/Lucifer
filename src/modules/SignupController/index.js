import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Signup from '../Signup';
import ConfirmSignup from '../ConfirmSignup';
import ResendVerificationCode from '../ResendVerificationCode';

class SignupController extends Component {
	constructor(props){
		super(props);
		this.state = {
			mobile: '',
			screen: this.props.name
		};
	}

	changeScreen = (screen) => {
		this.setState({ screen });
	};

	setMobile = (mobile) => { 
		this.setState({ mobile });
	};

	render() {
		return (
			<Fragment>
				{this.state.screen === 'signUp' && (
					<Signup
						{ ...this.props }
						changeScreen={this.changeScreen}
						setMobile={this.setMobile}
					/>
				)}
				{this.state.screen === 'resendVerificationCode' && (
					<ResendVerificationCode
						{...this.props}
						changeScreen={this.changeScreen}
						setMobile={this.setMobile}
					/>
				)}
				{this.state.screen=== 'confirmSignup' &&(
					<ConfirmSignup
						{...this.props}
						mobile={this.state.mobile}
					/>
			)}
			</Fragment>
		);
	}
}

export default observer(SignupController);
