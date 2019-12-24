let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$!%_*#?&]{8,}$/;

function validateForm(page, state) {
	let newState = {};
	switch (page) {
		case 'login':
			if (state.hasOwnProperty("email") && state.email === "") {
				newState = { ...newState, emailInvalid: true };
			}
			if (state.hasOwnProperty("password") && state.password === "") {
				newState = { ...newState, passwordInvalid: true };
			}
			break;

		case 'signUp':
			if (state.hasOwnProperty("name") && state.name === "" ) {
				newState = { ...newState, nameInvalid: true };
			}
			if (state.hasOwnProperty("mobile") && (!state.mobile || isNaN(state.mobile) || String(state.mobile).length !== 10 )) {
				newState = { ...newState, mobileInvalid: true };
			}
			if (state.hasOwnProperty("email") && !!state.email.length && !state.email.match(mailformat)) {
				newState = { ...newState, emailInvalid: true };
			}
			if (state.hasOwnProperty("newPassword")) {
				if (state.newPassword === "" || !state.newPassword.match(passwordFormat)) {
					newState = { ...newState, newPasswordInvalid: true };
				}
			}
			if (state.hasOwnProperty("confirmPassword")) {
				if (state.confirmPassword === "" || state.newPassword !== state.confirmPassword) {
					newState = { ...newState, confirmPasswordInvalid: true };
				}
			}
			break;
		case 'confirmSignup':
			if (state.hasOwnProperty("code")) {
				if (state.code.length !== 6) {
					newState = { codeInvalid: true };
				}
			}
			break;
		case 'resendMail':
		case 'requestVerificationCode':
			if (state.hasOwnProperty("email") && (state.email === "" || !state.email.match(mailformat))) {
				newState = { ...newState, emailInvalid: true };
			}
			break;
		case 'changePassword':
			if (state.hasOwnProperty("oldPassword")) {
				if (state.oldPassword === "") {
					newState = { ...newState, oldPasswordInvalid: true };
				}
			}
			if (state.hasOwnProperty("newPassword")) {
				if (state.newPassword === "" || !state.newPassword.match(passwordFormat)) {
					newState = { ...newState, newPasswordInvalid: true };
				}
			}
			if (state.hasOwnProperty("confirmPassword")) {
				if (state.confirmPassword === "" || state.newPassword !== state.confirmPassword) {
					newState = { ...newState, confirmPasswordInvalid: true };
				}
			}
			break;
		case 'forgotPasswordVerification':
			if (state.hasOwnProperty("email") && (state.email === "" || !state.email.match(mailformat))) {
				newState = { ...newState, emailInvalid: true };
			}
			if (state.hasOwnProperty("code")) {
				if (state.code.length !== 6) {
					newState = { ...newState, codeInvalid: true };
				}
			}
			if (state.hasOwnProperty("newPassword")) {
				if (state.newPassword === "" || !state.newPassword.match(passwordFormat)) {
					newState = { ...newState, newPasswordInvalid: true };
				}
			}
			if (state.hasOwnProperty("confirmPassword")) {
				if (state.confirmPassword === "" || state.newPassword !== state.confirmPassword) {
					newState = { ...newState, confirmPasswordInvalid: true };
				}
			}
			break;
	}
	return newState;
}

export default validateForm;
