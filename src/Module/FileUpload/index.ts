import path from 'path'
import CustomError from '@abserve/errors/index'

let CloudinaryModule: any = null;

try {
  CloudinaryModule = require('@abserve/Module/FileUpload/cloudinary');
} catch (error) {
  console.warn("Cloudinary module not found, proceeding without Cloudinary functionality.");
}

export const uploadToLocal = async (file: Express.Multer.File, folderName: string): Promise<string> => {
    const filetypes = /jpeg|svg|jpg|ico|png/;
      const isMimeTypeValid = filetypes.test(file.mimetype);
      const isExtNameValid = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (isMimeTypeValid && isExtNameValid) {
        //const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
          const fileName = file.fieldname.replace(/\[\]/g, '') + '-' + Date.now() + path.extname(file.originalname)
          const filePath = path.join(__dirname, `../../public/${folderName}`, fileName);
          const fs = require('fs').promises;
          await fs.writeFile(filePath,file.buffer);
          return getFilePath(filePath);
      }
      else {
          throw new CustomError.BadRequestError('INVALID_FILE_TYPE');
      }
  };

  export const getFilePath = async (path: any) => {
    let folderName = 'public'
    path = path.split(folderName)
    return folderName + path[1]
  }

  export const cloudinaryUpload = async (file: Buffer, folderName: string): Promise<{ url: string; publicId: string }> => {
    if (CloudinaryModule) {
      return await CloudinaryModule.uploadToCloudinary(file, folderName);
    } else {
      console.warn("Cloudinary module is unavailable, skipping Cloudinary upload.");
      return null;
    }
  };

  export const removeFile = async (publicId: string): Promise<void> => {
    if (CloudinaryModule) {
      return await CloudinaryModule.removeFileFromCloudinary(publicId);
    } else {
      console.warn("Cloudinary module is unavailable, skipping file removal.");
    }
  };
