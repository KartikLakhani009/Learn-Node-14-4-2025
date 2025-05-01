import { Request, Response } from 'express';
import { AuthRequest, BlogRequest } from '../types/user';
import { Blog } from '../models/Blog';
import mongoose from 'mongoose';

// Display form for creating a new blog post
export const getAddBlogForm = (req: Request, res: Response): void => {
  res.render('add-blog', {
    pageTitle: 'Add New Blog',
    errors: [],
    inputData: {}
  });
};

// Handle blog post creation
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  const { title, description, body } = req.body;
  const authReq = req as AuthRequest;
  const file = authReq.file;
  
  try {
    // Validate required fields
    if (!title || !description || !body) {
      return res.render('add-blog', {
        pageTitle: 'Add New Blog',
        errors: [{ msg: 'Title, description and content are required' }],
        inputData: { title, description, body },
        user: res.locals.user
      });
    }
    
    // Create new blog post
    const blogData: any = {
      title,
      description,
      body,
      createdBy: authReq.user?.userId
    };
    
    // If a cover image was uploaded, add it to the blog data
    if (file) {
      blogData.coverImage = `/uploads/blogs/${file.filename}`;
    }
    
    // Save to database
    const newBlog = await Blog.create(blogData);
    
    // Redirect to the newly created blog post
    res.redirect(`/blog/${newBlog._id}`);
  } catch (error) {
    console.error('Create blog error:', error);
    res.render('add-blog', {
      pageTitle: 'Add New Blog',
      errors: [{ msg: 'Failed to create blog post. Please try again.' }],
      inputData: { title, description, body },
      user: res.locals.user
    });
  }
};

// Get all blogs for home page
export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email profilePic');
    
    res.render('home', {
      pageTitle: 'Home',
      blogs,
      user: res.locals.user,
      req // Pass the request object to access query parameters in the template
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).render('error', {
      pageTitle: 'Error',
      error: process.env.NODE_ENV === 'development' ? error : {},
      user: res.locals.user
    });
  }
};

// View a single blog
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  
  
  try {
    const authReq = req as BlogRequest;
    const blog = authReq.blog;
    
    res.render('view-blog', {
      pageTitle: blog.title,
      blog,
      user: res.locals.user
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).render('error', {
      pageTitle: 'Error',
      error: process.env.NODE_ENV === 'development' ? error : {},
      user: res.locals.user
    });
  }
};

// Display form for editing a blog post
export const getEditBlogForm = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as BlogRequest;
  
  try {
    const blog = authReq.blog;
    const user = authReq.user;
    
    res.render('edit-blog', {
      pageTitle: `Edit: ${blog.title}`,
      blog,
      errors: [],
      user: user || res.locals.user
    });
  } catch (error) {
    console.error('Get edit blog form error:', error);
    res.status(500).render('error', {
      pageTitle: 'Error',
      error: process.env.NODE_ENV === 'development' ? error : {},
      user: res.locals.user
    });
  }
};

// Handle blog post update
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, body } = req.body;
  
  try {
    const authReq = req as BlogRequest;
    const file = authReq.file;
    const blog = authReq.blog;
    const user = authReq.user;
    
    
    // Validate required fields
    if (!title || !description || !body) {
      return res.render('edit-blog', {
        pageTitle: `Edit: ${blog.title}`,
        blog: blog,
        errors: [{ msg: 'Title, description and content are required' }],
        user: user || res.locals.user
      });
    }
    
    // Update blog data
    const blogData: any = {
      title,
      description,
      body
    };
    
    // If a new cover image was uploaded, update it
    if (file) {
      blogData.coverImage = `/uploads/blogs/${file.filename}`;
    }
    
    // Update in database
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      blogData,
      { new: true, runValidators: true }
    );
    
    // Redirect to the updated blog post
    res.redirect(`/blog/${updatedBlog?._id}`);
  } catch (error) {
    console.error('Update blog error:', error);
    res.render('edit-blog', {
      pageTitle: `Edit: ${title}`,
      blog: { _id: id, title, description, body },
      errors: [{ msg: 'Failed to update blog post. Please try again.' }],
      user: res.locals.user
    });
  }
};

// Delete a blog post
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const authReq = req as AuthRequest;
  
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ 
        success: false,
        message: 'Invalid blog ID format' 
      });
      return;
    }

    // Find blog
    const blog = await Blog.findById(id);
    
    if (!blog) {
      res.status(404).json({ 
        success: false,
        message: 'Blog post not found' 
      });
      return;
    }
    
    // Check if user is the author of the blog
    if (blog.createdBy.toString() !== authReq.user?.userId) {
      res.status(403).json({ 
        success: false,
        message: 'You do not have permission to delete this blog post' 
      });
      return;
    }
    
    // Delete from database
    await Blog.findByIdAndDelete(id);
    
    // Return success response with a status that indicates redirection is needed
    res.status(200).json({ 
      success: true,
      message: 'Blog deleted successfully',
      redirect: '/?deleted=true'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while deleting the blog post' 
    });
  }
};