import { Request, Response } from 'express';
import { createOrGetShortUrl, getUrls } from '../services/urlServices';
import Url from '../model/urlSchema';
import UserModel from '../model/userSchema';
import { validateSignupUser } from '../utils/validateSignupUser';

import { addUserToMap } from '../services/authStorage';

export async function createShortUrlForPage(req:Request, res:Response) {
    try{
        const { originalUrl } = req.body;

        // @ts-expect-error
        const user = req.user;
        
        console.log("from code --- page request ---- originalUrl", originalUrl);

        const result = await createOrGetShortUrl(user,originalUrl);
        
        if(result.statusCode === 201 || result.statusCode === 200) {
            const urls = await getUrls(user._id);
            console.log("from code --- page request ---- urls", urls);
            res.render("home", {
                urlData:urls
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

    const url = await Url.findOneAndUpdate({ shortUrl: short_url },{
        $push:{
            visitHistory:[{
                timeStamp:Date.now(),
            }]
        }
    });
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

export async function handleSignup(req:Request, res:Response) {
    const { username, password, email } = req.body;

    const errors = validateSignupUser(req.body);
    console.log("from code --- page request ---- errors", errors);
    if (errors.length > 0) {
        res.render("signup", {
            error: errors[0],
        });
        return;
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    console.log("from code --- page request ---- existingUser", existingUser);
    if (existingUser) {
        res.render("signup", {
            error: "User already exists",
        });
        return;
    }
    // Create a new user
    const newUser = UserModel.create({
        name: username,
        email,
        password,
    });
    if (!newUser) {
        res.render("signup", {
            error: "Internal server error",
        });
        return;
    }
    res.render("login",{
        error:null
    });

    return;
}

export async function handleLogin(req:Request, res:Response) {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email, password });
    if (!existingUser) {
        res.render("login", {
            error: "User not found",
        });
        return;
    }
    const token = await addUserToMap(existingUser);
    // Create a new session
    res.cookie("uid", token,
        {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true,
        }
        // {
        //     maxAge: 1000 * 60 * 60 * 24, // 1 day
        //     httpOnly: true,
        //     secure: false, // Set to true if using HTTPS
        //     sameSite: "strict",
        // }
    );
    // Store the session in the database temp
    
    // @ts-expect-error
    const urls = await getUrls(existingUser._id!);
    console.log("from code --- page request ---- urls", urls);
    res.render("home", {
        urlData:urls
    });
    return;
}
