export const validatePassword = (password) => {
    return typeof password === "string" && password.trim().length >= 8;
}
