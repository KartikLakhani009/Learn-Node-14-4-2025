import { Request, Response } from 'express';
import { createOrGetShortUrl } from '../services/urlServices';
import Url from '../model/urlSchema';

export async function createShortUrlForPage(req:Request, res:Response) {
    try{
        const { originalUrl } = req.body;
        
        console.log("from code --- page request ---- originalUrl", originalUrl);

        const result = await createOrGetShortUrl(originalUrl);
        
        if(result){
            res.render("home", {
                urlData:result
            });
        }

        return;
    }catch(error){
        console.log("Error creating short URL: ====== ", error);
        res.render("home", {
            urlData:{
                error: "Internal server error",
                statusCode:500
            }
        });
        return;
    }
}

export async function redirectUrlForPage(req:Request, res:Response) {
    const short_url = req.params.id;

    const url = await Url.findOne({ shortUrl: short_url });
    if (!url) {
        // not found
        res.render("pageNotFound", {
            error: "URL not found",
            statusCode: 404
        });
        return;
    }
    res.redirect(url?.originalUrl!);
    return;
}