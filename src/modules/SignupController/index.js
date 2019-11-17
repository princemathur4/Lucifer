import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import Signup from '../Signup';
import ConfirmSignup from '../ConfirmSignup';

class SignupController extends Component {
	state = {
		phone: '',
		screen: 'signup'
	};

	changeScreen = (screen) => {
		this.setState({ screen });
	};

	setPhone = (phone) => { 
		this.setState({ phone });
	};

	render() {
		return (
			<Fragment>
				{this.state.screen === 'signup' && (
					<Signup
						{ ...this.props }
						changeScreen={this.changeScreen}
						setPhone={this.setPhone}
					/>
				)}
				{this.state.screen=== 'confirmSignup' &&(
					<ConfirmSignup
						{...this.props}
						phone={this.state.phone}
					/>
			)}
			</Fragment>
		);
	}
}

export default observer(SignupController);
