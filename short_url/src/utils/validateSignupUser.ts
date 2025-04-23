import { SignUpUser } from "../types/user";


export const validateSignupUser = (user: SignUpUser):string[] => {
    const { username, email, password, confirmPassword } = user;
    const errors: string[] = [];

    if (!username || username.length < 3) {
        errors.push("Username must be at least 3 characters long");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Email is not valid");
    }
    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }
    if (password !== confirmPassword) {
        errors.push("Passwords do not match");
    }

    return errors;
};