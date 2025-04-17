import Url from "../model/urlSchema";
import { Request, Response } from "express";
import { validateShortUrlFromParam } from "../utils/validateShortUrlFromParam";
import { createOrGetShortUrl } from "../services/urlServices";



// Function to create a short URL
export async function createShortUrl(req: Request, res: Response) {
    try {
    
        const { originalUrl } = req.body;

        const result = await createOrGetShortUrl(originalUrl);
        
        if(result){
            res.status(result.statusCode).json({
                message: result.statusCode == 200 ? "Short URL already Created." :"Short URL created successfully",
                data: {
                    shortUrl: result.data?.shortUrl,
                    originalUrl: result.data?.originalUrl,
                    visitHistory: result.data?.visitHistory,
                    totalVisit: result.data?.visitHistory.length,
                },
            });
            return;
        }

    } catch (error) {
        console.log("Error creating short URL: ====== ", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
    
}

export async function redirectUrl(req: Request, res: Response) {
    const short_url = validateShortUrlFromParam(req, res);
    const url = await Url.findOneAndUpdate({ shortUrl: short_url },{
        $push:{
            visitHistory:[{
                timeStamp:Date.now(),
            }]
        }
    });
    if (!url) {
        res.status(404).json({ error: "URL not found" });
        return;
    }
    res.redirect(url.originalUrl);
    return;
}

export async function anaylisticUrl(req: Request, res: Response) {
    const short_url = validateShortUrlFromParam(req, res);
    const url = await Url.findOne({ shortUrl: short_url });
    const count = url?.visitHistory.length || 0;
    console.log("from code --- count", count);
    if (!url) {
        res.status(404).json({ error: "URL not found" });
        return;
    }
    res.status(200).json({ message: "URL found", data:{
        shortUrl: url.shortUrl,
        originalUrl: url.originalUrl,
        visitHistory: url.visitHistory,
        totalVisit: count
    } });
    return;
}

// Function to get all URLs (optional)
export async function getUrls(req: Request, res: Response) {
    const urls = await Url.aggregate([
        {
            $addFields: {
                totalVisit: { $size: "$visitHistory" },
            },
        }
    ]);
    res.status(200).json(urls); 
}