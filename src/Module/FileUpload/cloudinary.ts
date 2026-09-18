import { v2 as cloudinary } from 'cloudinary';
import CustomError from '@abserve/errors/index'
import { Config } from '@abserve/Config/AppConfig';

cloudinary.config({
    cloud_name: Config.cloudinary.cloud_name,
    api_key: Config.cloudinary.api_key,
    api_secret: Config.cloudinary.api_secret,
  });


export const uploadToCloudinary = (file: Buffer, folderName: string): Promise<{ url: string; publicId: string }> => {
    const isMulterFile = (file: Express.Multer.File | Buffer): file is Express.Multer.File => (file as Express.Multer.File).mimetype !== undefined;
    const buffer = isMulterFile(file) ? file.buffer : file;
    if (!(buffer instanceof Buffer)) throw new CustomError.BadRequestError('Invalid file type for Cloudinary upload');
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folderName
          //allowed_formats: ['jpeg', 'jpg', 'png', 'svg', 'ico', 'webp']
        },
        (error, result) => {
          if (error) {
            reject(new CustomError.BadRequestError('Cloudinary Upload Failed'));
          } else {
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        }
      );
      stream.end(file);
    });
};

export const removeFileFromCloudinary = (publicId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(new CustomError.BadRequestError('Cloudinary Deletion Failed'));
        } else {
          resolve();
        }
      });
    });
};
  

