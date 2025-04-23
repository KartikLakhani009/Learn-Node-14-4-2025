import {Router} from "express";
import { createShortUrlForPage, redirectUrlForPage, handleSignup, handleLogin } from "../controller/pagesController";
import { restictUserOnly } from "../middleware/authMid";
import { getUrls } from "../services/urlServices";

const router = Router();

router.get("/", restictUserOnly, async (req, res) => {
    
    // @ts-expect-error
    const user = req.user;
    console.log("from code --- page request ---- user", user);

    const urls = await getUrls(user._id);

    res.render("home",{
        urlData:urls
    });
    // res.end("Welcome to Short URL API");
});

router.route("/login").get((req, res) => {
    res.render("login",{
        error: null
    });
}).post(handleLogin);

router.route("/signup").get((req, res) => {
    res.render("signup",{
        error: null
    });
}).post(handleSignup);

router.post("/signout", (req, res) => {
    const sessionId = req.cookies.uid;

    res.clearCookie("uid");
    
    res.redirect("/login");
});


router.get("/path/:id", restictUserOnly, redirectUrlForPage);

router.post("/path/create_url", restictUserOnly,createShortUrlForPage)

router.get("/page_not_found", (req, res) => {
    res.render("pageNotFound",{
        error: "URL not found",
        statusCode: 404
    });
});


export default router;