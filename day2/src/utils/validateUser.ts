import { USER } from "./user.type"

export const validateUser = (user:USER) => {
    if(!user) {
        return { error: "User Details is required" }
    }
    if (!user.firstName || user.firstName.length < 2) {
        return { error: "First name is required or First name length is less than 2" }
    }
    if (!user.lastName || user.lastName.length < 2) {
        return { error: "Last name is required or Last Name length is less than 1" }
    }
    if (!user.email || !user.email.includes("@")) {
        return { error: "Email is required or Email is not valid" }
    }
    if (!user.gender) {
        return { error: "Gender is required" }
    }

    return { error: null }
}