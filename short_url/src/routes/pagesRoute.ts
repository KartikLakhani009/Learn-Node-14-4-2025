import {Router} from "express";
import { createShortUrlForPage, redirectUrlForPage } from "../controller/pagesController";

const router = Router();

router.get("/", (req, res) => {
    res.render("home",{
        urlData:null
    });
    // res.end("Welcome to Short URL API");
});

router.get("/path/:id", redirectUrlForPage);

router.get("/page_not_found", (req, res) => {
    res.render("pageNotFound",{
        error: "URL not found",
        statusCode: 404
    });
});


router.post("/create_url",createShortUrlForPage)




export default router;