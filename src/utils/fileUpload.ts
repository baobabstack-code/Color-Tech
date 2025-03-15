import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

// Define types for multer if not available
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

// Ensure upload directories exist
const createDirectories = () => {
  const dirs = [
    './uploads',
    './uploads/gallery',
    './uploads/vehicles',
    './uploads/services',
    './uploads/profiles'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });
};

// Create directories on startup
createDirectories();

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    // Determine the destination folder based on the upload type
    let uploadPath = './uploads';
    
    if (req.path.includes('/gallery')) {
      uploadPath = './uploads/gallery';
    } else if (req.path.includes('/vehicles')) {
      uploadPath = './uploads/vehicles';
    } else if (req.path.includes('/services')) {
      uploadPath = './uploads/services';
    } else if (req.path.includes('/profiles')) {
      uploadPath = './uploads/profiles';
    }
    
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Generate a unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter to allow only images
const imageFilter = (
  req: Request, 
  file: Express.Multer.File, 
  cb: (error: Error | null, acceptFile: boolean) => void
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'), false);
  }
};

// Create upload instances
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Helper function to delete a file
export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      logger.warn(`File not found for deletion: ${filePath}`);
      return resolve();
    }
    
    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error(`Error deleting file ${filePath}: ${err.message}`);
        return reject(err);
      }
      logger.info(`Successfully deleted file: ${filePath}`);
      resolve();
    });
  });
};

// Helper function to get file URL from filename
export const getFileUrl = (filename: string, type: 'gallery' | 'vehicles' | 'services' | 'profiles' = 'gallery'): string => {
  return `/uploads/${type}/${filename}`;
};

export default {
  uploadImage,
  deleteFile,
  getFileUrl
};
