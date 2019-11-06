let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordFormat = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_~]).{8,}$";

function validateForm(page, state) {
	let newState = {};
	switch (page) {
		case 'login':
			if (state.hasOwnProperty("email") && state.email === "") {
				newState = { emailInvalid: true };
			}
			if (state.hasOwnProperty("password") && state.password === "") {
				newState = { passwordInvalid: true };
			}
			break;

		case 'signUp':
		case 'resendMail':
		case 'requestVerificationCode':
			if (state.hasOwnProperty("email") && (state.email === "" || !state.email.match(mailformat))) {
				newState = { emailInvalid: true };
			}
			break;

		case 'createPassword':
			if (state.hasOwnProperty("tempPassword")) {
				if (state.tempPassword === "" || state.tempPassword.length < 8) {
					newState = { tempPasswordInvalid: true };
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

		case 'forgotPasswordVerification':
			if (state.hasOwnProperty("email") && state.email === "") {
				newState = { emailInvalid: true };
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

		case 'documentUpload':
			if (state.payload.hasOwnProperty("file") && state.payload.file) {
				let mime_types = [
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'application/pdf',
					'application/vnd.ms-powerpoint',
					'application/vnd.openxmlformats-officedocument.presentationml.presentation',
					'application/rtf',
					'text/plain'
				];
				let extensions = ['doc', 'docx', 'pdf', 'ppt', 'pptx', 'rtf', 'txt'];
				let data = state.payload.file;
				for (let i = 0; i < data.length; i++) {
					let file = data[i];
					let extension = file.name.split('.').pop();
					if ((data && data.length !== 0) && mime_types.includes(file.type) && extensions.includes(extension)) {
						newState = { file_invalid: true };
						break;
					} else {
						newState = { file_invalid: false };
						break;
					}
				}
			} else {
				newState = { file_invalid: true };
			}
			break;
	}
	return newState;
}

export default validateForm;
