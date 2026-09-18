let rEmail =
    // eslint-disable-next-line
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const emailValidator = (email: string) => {
    if (!email) {
        return "Email is required";
    } else if (!new RegExp(rEmail).test(email)) {
        return "Incorrect email format";
    }
    return "";
};

export const passwordValidator = (password: string) => {
    if (!password) {
        return "Password is required";
    } else if (password.length < 8) {
        return "Password must have a minimum 8 characters";
    }
    return "";
}
;
