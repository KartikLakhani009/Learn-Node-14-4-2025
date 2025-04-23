import UserModel from "../model/userSchema";
import { getUserFromMap } from "./authStorage";



export async function authService(sessionId:string) {
    console.log("from code --- page request ---- sessionId", sessionId);
    if (!sessionId) {
        return {
            statusCode: 401,
            error: "Unauthorized",
        }
    }
    const tokenRes = await getUserFromMap(sessionId);
    console.log("from code --- page request --- sessionId ---- tokenRes", sessionId, tokenRes);

    if (!tokenRes) {
        return {
            statusCode: 401,
            error: "Unauthorized",
        }
    }

    // Check if the user is authenticated
    if (typeof tokenRes !== "object" || !("email" in tokenRes)) {
        return {
            statusCode: 401,
            error: "Unauthorized",
        };
    }
    const user = await UserModel.findOne({ email: tokenRes.email });
    // console.log("from code --- page request ---- user", user);
    if (!user) {
        return {
            statusCode: 401,
            error: "Unauthorized",
        };
    }
    
    return{
        statusCode: 200,
        user: user,
        error: null,
    };

}


