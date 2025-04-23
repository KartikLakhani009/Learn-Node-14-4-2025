import { User } from "../types/user";
import jwt from "jsonwebtoken";

const secretKey = "secret";

export async function addUserToMap(user: User) {
    return jwt.sign({ email : user.email }, secretKey);
}

export function removeUserFromMap(sessionId: string) {
    // userMap.delete(sessionId);
}

export async function getUserFromMap(token: string) {
    try {
        if(!token)  return null;
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}
