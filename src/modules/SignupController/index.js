import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Signup from '../Signup';
import ConfirmSignup from '../ConfirmSignup';

class SignupController extends Component {
	state = {
		email: '',
		screen: 'signup'
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
				{this.state.screen === 'signup' && (
					<Signup
						{ ...this.props }
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
