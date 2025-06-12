import { Router } from "express";

import { createShortUrl, redirectUrl, anaylisticUrl, getUrls } from "../controller/url";

const router = Router();

/**
 * @swagger
 * /api/url:
 *   post:
 *     summary: Create a new short URL
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: The original URL to be shortened
 *     responses:
 *       201:
 *         description: URL successfully shortened
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all URLs for the authenticated user
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of URLs
 *       401:
 *         description: Unauthorized
 */
router.route("/").post(createShortUrl).get(getUrls);

// Get all URLs
// router.get("/", getUrls);

/**
 * @swagger
 * /api/url/redirect/{id}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL ID
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: URL not found
 */
router.get("/redirect/:id", redirectUrl);

/**
 * @swagger
 * /api/url/analytics/{id}:
 *   get:
 *     summary: Get URL analytics
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL ID
 *     responses:
 *       200:
 *         description: URL analytics data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: URL not found
 */
router.get("/analytics/:id", anaylisticUrl);

export default router;