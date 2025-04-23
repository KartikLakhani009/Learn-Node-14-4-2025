import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authServices";
import { User } from "../types/user";

export type  customRequest = {user:User} & Request;  

export async function restictUserOnly(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies?.uid;
    const _res = await authService(sessionId);

    console.log("from code --- page request --- authService -----_res",_res);

    if(_res.statusCode !== 200) {
        // res.status(_res.statusCode).json({
        //     error: _res.error,
        // });
        res.render("login",{
            error: _res.error,
        });
        return;
    }
    
    (req as customRequest).user = _res.user!;
    next();
}


export async function checkIfUserLoggedIn(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies?.uid;
    console.log("from code --- page request ---- sessionId", sessionId);
    const _res = await authService(sessionId);
    console.log("from code --- page request --- authService -----_res",_res);
    if(_res.statusCode !== 200) {
        res.sendStatus(_res.statusCode).json({error: _res.error});
        return;
    }
    
    (req as customRequest).user = _res.user!;
    next();
}


export async function retrictUserOnlyWithHeaders(req: Request, res: Response, next: NextFunction) {
    
    const sessionId = req.headers.authorization?.split(" ")[1]!;
    const _res = await authService(sessionId);
    if(_res.statusCode !== 200) {
        res.status(_res.statusCode).json({
            error: _res.error,
        });
        return;
    }
    
    (req as customRequest).user = _res.user!;
    next();
}