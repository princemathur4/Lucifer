import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Signup from '../Signup';
import ConfirmSignup from '../ConfirmSignup';
import ResendMail from '../ResendMail';

class SignupController extends Component {
	constructor(props){
		super(props);
		this.state = {
			email: '',
			screen: this.props.name
		};
	}

	changeScreen = (screen) => {
		this.setState({ screen });
	};

	setEmail = (email) => { 
		this.setState({ email });
	};

	render() {
		return (
			<Fragment>
				{this.state.screen === 'signUp' && (
					<Signup
						{ ...this.props }
						changeScreen={this.changeScreen}
						setEmail={this.setEmail}
					/>
				)}
				{this.state.screen === 'resendMail' && (
					<ResendMail
						{...this.props}
						changeScreen={this.changeScreen}
						setEmail={this.setEmail}
					/>
				)}
				{this.state.screen=== 'confirmSignup' &&(
					<ConfirmSignup
						{...this.props}
						email={this.state.email}
					/>
			)}
			</Fragment>
		);
	}
}

export default observer(SignupController);
