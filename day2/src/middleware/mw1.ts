import { NextFunction, response, Router, Request, Response } from "express";

const mw1 = (request:Request, response:Response, next:NextFunction) => {

    console.log("Middleware 1");
    // @ts-expect-error
    request.myParam = "Hello from mw1";
    next();
}

export default mw1;