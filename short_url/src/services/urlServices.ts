import ShortUniqueId from "short-unique-id";
import Url from "../model/urlSchema";
import { User } from "../types/user";
import mongoose from "mongoose";

const {randomUUID} = new ShortUniqueId({ length: 8, dictionary:'alphanum' });

export async function createOrGetShortUrl(user:User,originalUrl?: string,) {
    if(!originalUrl) {
        throw new Error("Original URL is required");
    }
    // Check if the URL already exists
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
        return {statusCode:200, data: existingUrl};
    }
    // Generate a new short URL
     // Generate a random short URL (you can use a better algorithm for production)
    // const _shortUrl = Math.random().toString(36).substring(2, 8);
    // console.log("from code --- _shortUrl", _shortUrl);

    const shortUrl = randomUUID();

    console.log("nanoid --- shortUrl", shortUrl);

    const newUrl = await Url.create({ shortUrl, originalUrl, visitHistory: [], createdBy: user._id });
    if(!newUrl) {
        throw new Error("Failed to create short URL");
    }
    return {statusCode:201, data: newUrl};
}


export async function getUrls(uid: string) {
    // const urls = await Url.find({ createdBy: uid });
    const urls = await Url.aggregate([
        {
            $match: { createdBy: new mongoose.Types.ObjectId(uid) }
        },
        {
            $addFields:{
                visitCount: { $size: "$visitHistory" }
            }
        }
    ]);
    if(!urls) {
        return {statusCode: 404, error: "No URLs found" };
    }
    return {statusCode:200, data: urls};
}


