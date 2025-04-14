import { NextFunction } from "express";
import fs from "fs";

const loggerFile = (req:Request, res:Response, next:NextFunction) => {

    const { method, url } = req;
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${method} request to ${url}\n`;
    // Append the log message to a file
    fs.appendFileSync("request.log", logMessage);
    next();
    
}

export default loggerFile;