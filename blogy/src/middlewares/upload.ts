import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define storage configuration for different file types
const createStorage = (uploadFolder: string, filePrefix: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, `../../uploads/${uploadFolder}`);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Create unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${filePrefix}-${uniqueSuffix}${ext}`);
    }
  });
};

// File filter to only allow image uploads
const imageFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'));
  }
};

// Configure multer for profile pictures
export const uploadProfilePic = multer({
  storage: createStorage('profiles', 'profile'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFileFilter
});

// Configure multer for blog cover images
export const upload = multer({
  storage: createStorage('blogs', 'blog-cover'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFileFilter
});