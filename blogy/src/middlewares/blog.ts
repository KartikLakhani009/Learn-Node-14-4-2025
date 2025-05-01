import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Blog } from '../models/Blog';
import { BlogRequest } from '../types/user';


export const isBlogValid = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;

    try {
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).render('404', {
                pageTitle: 'Blog Not Found',
                user: res.locals.user
            });
        }

        // Find blog and populate author information
        const blog = await Blog.findById(id).populate('createdBy', 'name email profilePic');

        if (!blog) {
            return res.status(404).render('404', {
                pageTitle: 'Blog Not Found',
                user: res.locals.user
            });
        }

        // @ts-ignore
        (req as BlogRequest).blog = blog; // Attach the blog to the request object
        res.locals.blog = blog; // Make blog available in locals for rendering

        next();
    }catch (error) {
        console.error('Get blog by ID error:', error);
        return res.status(500).render('error', {
            pageTitle: 'Error',
            error: process.env.NODE_ENV === 'development' ? error : {},
            user: res.locals.user
        });
    }
};

export const isBlogAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as BlogRequest;
    const blog = authReq.blog;

    if (!blog) {
        return res.status(404).render('404', {
            pageTitle: 'Blog Not Found',
            user: res.locals.user
        });
    }

    // Check if the logged-in user is the author of the blog
    if (blog.createdBy._id.toString() !== authReq.user?.userId) {
        return res.status(403).render('403', {
            pageTitle: 'Forbidden',
            user: res.locals.user
        });
    }

    next();
}