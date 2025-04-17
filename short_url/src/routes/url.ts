import { Router } from "express";

import { createShortUrl, redirectUrl, anaylisticUrl, getUrls } from "../controller/url";

const router = Router();

// Create a new URL
router.route("/").post(createShortUrl).get(getUrls);

// Get all URLs
// router.get("/", getUrls);

// Get a URL by ID
router.get("/redirect/:id", redirectUrl);

// anaylisticUrl
router.get("/analytics/:id", anaylisticUrl);


export default router;