import Gallery from './Gallery'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { BaseController } from '@abserve/Module/BaseControllers'
import { GalleryValidator } from './GalleryValidator'
import { Enum } from '@abserve/Utils/Enum'
import { FolderConfig } from '@abserve/Module/FileUpload/FolderConfig'
import { uploadToLocal, cloudinaryUpload } from '@abserve/Module/FileUpload/index'

class GalleryController extends BaseController {
  constructor() {
    super()
  }

  static readonly createOrUpdateGallery = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try { 
      const files: any = req.files
      const { collection, description } = req.body
      const collectionName = req.query.collectionName || collection
      const nowDate = new Date()

      if (!files?.length) throw new CustomError.BadRequestError('NO_FILES_UPLOADED')
      const validation = await GalleryValidator.validateData(req.body , "createGallery")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      let collectionExists = await Gallery.findOne({ collectionName: collection }).exec()

      let uploadedImages = [];

      for (const file of files) {
          // const imagePath = await uploadToLocal( file, `${FolderConfig.Gallery}/${collectionName}` )
          const cloudImage = await cloudinaryUpload( file.buffer, `${FolderConfig.Gallery}/${collectionName}` )
          uploadedImages.push({
            imageName: file.originalname,
            // path: imagePath,
            path: cloudImage.url,
            publicId: cloudImage.publicId,
            collectionName: collectionName,
            description,
            createdBy: req.auth.userId,
            addedBy: req.auth.role,
            addedAt: nowDate
        });
      }

      await Gallery.insertMany(uploadedImages);


      // RESPONSE
      response.status = true
      response.message = collectionExists ? 'IMAGES_ADDED_TO_EXISTING_COLLECTION' : 'IMAGE_ADDED_SUCCESSFULLY'
      response.data = uploadedImages
      response.statusCode = 201
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getGalleryImages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const { collection, search, collectionName }: any = req.query
      const { role, userId } = req.auth;
      let pageQuery = await this.paginationBuilder(req.query)

      if (!collection) {
        let query = { softdel: false };
        if (search) {
          const regex = new RegExp(search, 'i');
          query['collectionName'] = regex;
        }
        if (collectionName) query['collectionName'] = { $regex: new RegExp(collectionName, 'i') };
        
        const collectionNames = await Gallery.distinct('collectionName', query)
        if (!collectionNames.length) throw new CustomError.BadRequestError('NO_COLLECTIONS_FOUND');


        // RESPONSE
        response.data = { collections: collectionNames };
        response.totalCount = collectionNames.length;
        response.message = 'COLLECTIONS_FETCHED_SUCCESSFULLY';
        response.status = true;
        response.statusCode = 200;
        return res.status(response.statusCode).json(response).end();
      }

      let datas: any = { collectionName: collection, softdel: false }
      if ( role === Enum.ROLES.ADMIN ) { datas['addedBy'] = 'ADMIN' } 
      else { datas['$or'] = [{ addedBy: 'ADMIN' }, { createdBy: userId }] }
      const galleryImage = await Gallery.find(datas).skip(pageQuery.skip).limit(pageQuery.take).sort({ _id: -1})
      const countDoc = await Gallery.countDocuments(datas)
      if (!galleryImage?.length) throw new CustomError.BadRequestError('NO_IMAGES_FOUND_FOR_COLLECTION')


      // RESPONSE
      response.data = { galleryImage }
      response.totalCount = countDoc
      response.message = `${collection.toUpperCase()}_IMAGES_FETCHED_SUCCESSFULLY`
      response.status = true
      response.statusCode = 200
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly deleteGallery = async (req: AuthenticateRequest, res: Response) => {
    const response = {
      status: false,
      message: 'Unprocessable Entity',
      statusCode: 422
    };

    try {
      const { imageIds, collection }: any = req.query;
      if (!imageIds && !collection) throw new CustomError.UnProcessableError('IMAGEID_OR_COLLECTION_IS_REQUIRED', []);

      const imageIdsArray = imageIds?.split(',')

      if (imageIds && Array.isArray(imageIdsArray)) {
        const galleryImage = await Gallery.find({ _id: { $in: imageIdsArray }, status: false, softdel: false });
        if (!galleryImage?.length) throw new CustomError.BadRequestError('IMAGE_NOT_FOUND');
        await Gallery.updateMany(
          { _id: { $in: imageIdsArray }, status: false, softdel: false }, 
          { softdel: true },
        )


        // RESPONSE
        response.status = true;
        response.message = 'IMAGE_DELETED_SUCCESSFULLY';
        response.statusCode = 200;
        return res.status(response.statusCode).json(response).end();
      }
 
      if(!collection) throw new Error("collection is unavaiable")

      // if (collection) {
        const galleryImages = await Gallery.find({ collectionName: collection, status: false, softdel: false });
        if (galleryImages && galleryImages.length > 0) {
          for (const image of galleryImages) {
            image.softdel = true;
            await image.save();
          }
        }

        const remainingActiveImages = await Gallery.find({ collectionName: collection, status: true, softdel: false });
        if (remainingActiveImages && remainingActiveImages.length > 0) throw new CustomError.BadRequestError('ONLY_UNUSED_IMAGES_DELETED_SUCCESSFULLY');


        // RESPONSE
        response.status = true;
        response.message = 'COLLECTION_IMAGES_DELETED_SUCCESSFULLY';
        response.statusCode = 200;
      // }
    } catch (error: any) {
      console.error('Error:', error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  };
}

export { GalleryController }