let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordFormat = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_~]).{8,}$";

function validateForm(page, state) {
	let newState = {};
	switch (page) {
		case 'login':
			if (state.hasOwnProperty("phone") && (state.phone === "" || isNaN(state.phone) || state.phone.length < 10)) {
				newState = { phoneInvalid: true };
			}
			if (state.hasOwnProperty("password") && state.password === "") {
				newState = { passwordInvalid: true };
			}
			break;

		case 'signUp':
			if (state.hasOwnProperty("phone") && (state.phone === "" || isNaN(state.phone) || state.phone.length < 10)) {
				newState = { phoneInvalid: true };
			}
			if (state.hasOwnProperty("newPassword")) {
				if (state.newPassword === "" || !state.newPassword.match(passwordFormat)) {
					newState = { newPasswordInvalid: true };
				}
			}
			if (state.hasOwnProperty("confirmPassword")) {
				if (state.confirmPassword === "" || state.newPassword !== state.confirmPassword) {
					newState = { confirmPasswordInvalid: true };
				}
			}
			break;
		case 'confirmSignup':
			// if (state.hasOwnProperty("code")) {
			// 	if (state.code.length !== 6) {
			// 		newState = { codeInvalid: true };
			// 	}
			// }
			break;
		case 'resendMail':
		case 'requestVerificationCode':
			if (state.hasOwnProperty("phone") && (state.phone === "" || isNaN(state.phone) || state.phone.length < 10)) {
				newState = { phoneInvalid: true };
			}
			break;
		case 'forgotPasswordVerification':
			if (state.hasOwnProperty("phone") && (state.phone === "" || isNaN(state.phone) || state.phone.length < 10)) {
				newState = { phoneInvalid: true };
			}
			if (state.hasOwnProperty("code")) {
				if (state.code.length !== 6) {
					newState = { codeInvalid: true };
				}
			}
			if (state.hasOwnProperty("newPassword")) {
				if (state.newPassword === "" || !state.newPassword.match(passwordFormat)) {
					newState = { newPasswordInvalid: true };
				}
			}
			if (state.hasOwnProperty("confirmPassword")) {
				if (state.confirmPassword === "" || state.newPassword !== state.confirmPassword) {
					newState = { confirmPasswordInvalid: true };
				}
			}
			break;
	}
	return newState;
}

export default validateForm;
