import { createPasswordErrors } from '../templates/Auth';

export function handleCreatePassword(err) {
    let errorMapping = {
        ...createPasswordErrors
    };

    if (err && err.hasOwnProperty('code')) {
        if (errorMapping.hasOwnProperty(err.code)) {
            return errorMapping[err.code];
        } else if (err.code === "NotAuthorizedException" && err.hasOwnProperty("message")) {
            return err.message;
        } else {
            return errorMapping.default;
        }
    } else {
        return errorMapping.default;
    }
}
