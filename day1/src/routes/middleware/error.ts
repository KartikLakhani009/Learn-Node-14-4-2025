import { Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response) => {
    // console.error(err.stack);
    // const showStack = process.env.NODE_ENV === 'development';
    // if (showStack) {
    //     console.error(err.stack);
    // }

    console.log("Error occurred:");
    res.status(err?.status || 500).json({status: 'error', message: err.message || 'Internal Server Error' });
};
export default errorHandler;