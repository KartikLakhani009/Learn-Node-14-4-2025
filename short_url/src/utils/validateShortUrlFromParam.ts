
import { Request, Response } from 'express';


export function validateShortUrlFromParam(req: Request, res:Response) {
    // Check if the short URL is valid (you can customize this regex)
    const short_url = req.params.id;
    console.log("from code --- short_url", short_url);
    if (!short_url) {
        res.status(400).json({ error: "short_url is required" });
        return;
    }
    return short_url;
}