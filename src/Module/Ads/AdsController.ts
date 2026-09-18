import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import User from '@abserve/Module/Auth/Model/User'
import Ads from '@abserve/Module/Ads/Model/Ads'
import AdsFavourite from '@abserve/Module/Ads/Model/AdsFavourite'
import AdsPackages from '@abserve/Module/Ads/Model/AdsPackages'
import AdsSubscription from '@abserve/Module/Ads/Model/AdsSubscription'
import Category from '@abserve/Module/Ads/Model/AdsCategory'
import SubCategory from '@abserve/Module/Ads/Model/AdsSubCategory'
import CustomError from '@abserve/errors/index'
import Gallery from '@abserve/Module/Gallery/Gallery'
import { Response } from 'express'
import { pages, steps as Steps } from '@abserve/Module/Ads/AdsConfig'
import { SingleFileRequest, MultipleFileRequest, AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { EmailController as Mail } from '@abserve/MailGateway/SendMail'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { StripeController as stripe } from '@abserve/Module/PaymentGateway/Controller/StripeController'
import { AdsValidator } from '@abserve/Module/Ads/Validator'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import { BaseController } from '@abserve/Module/BaseControllers'
import { Constants } from '@abserve/Config/Constants'
import { Config } from '@abserve/Config/AppConfig'


class AdvertisementController extends BaseController {
  constructor() {
    super()
  }

  static readonly checkActiveAdvertisement = async () => {
    let currentDate = new Date()
    let advertisementToUpdate = await Ads.find({ status: 'approve', inactiveAt: { $lt: currentDate } }).lean().exec()
    console.log("advertisementToUpdate", advertisementToUpdate);


    for (let ad of advertisementToUpdate) {
      await Ads.findOneAndUpdate({ _id: ad._id }, { status: 'expired' }).exec()
      let userData = await User.findById(ad.userId).lean().exec()
      let mailData = { advertisementId: ad._id };
      await Mail.sendMail(userData.email, mailData, 'advertisementAutoInactivated');
      let notifiData = {
        forWhom: ad.userId,
        message: 'your advertisement ' + ad.name + ' has been inactived ',
        fromWhom: 'ADMIN',
        userType: 'PROVIDER',
        title: 'Advertisement Inactived'
      }
      await NotificationController.notification(notifiData)
    }
  }

  static subscribedAdvertisement = async () => {
    let currentDate = new Date()
    let expiredData = await AdsSubscription.find({ status: 'active', endDate: { $lt: currentDate }}).lean().exec();
    
    for (let data of expiredData) {
      await AdsSubscription.findOneAndUpdate({ _id: data._id }, { status: 'expired' }).exec();
      await Ads.updateMany(
        { subscriptionId: data._id, status: { $ne: 'expired' } },{ $set: { status: 'expired', inactiveAt: currentDate }}).exec();
      let notifiData = {
        forWhom: data.userId,
        message: 'Your subscription has been expired',
        fromWhom: 'ADMIN',
        userType: 'PROVIDER',
        title: 'Subscription Expired'
      }
      await NotificationController.notification(notifiData)
    }
  }


  static readonly advertisementData = async (id: string) => {
      try {
         let data = await Ads.findById(id).exec()
         if (!data) {
          throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND') 
       } else {
        return data;
       }
    } catch (error) {
      throw new Error(error)
    }
  }


  static readonly getUntitledName = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const advertisementData: any = await Ads.find({ name: 'untitled', status: 'pending', userId: req.auth.userId }, { _id: 1 }).lean().exec()
      if (!advertisementData?.length) throw new CustomError.BadRequestError('NO_LISITNG_DATA_FOUND')

      const data = advertisementData[0] || {}


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED_DATAS'
      response.data = data
    } catch (error) {
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly getStepLists = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
    }
    try {
      const steps = Steps.map((steps: any, index: any) => {
        return {
          ...steps,
          // icon: Config.hostForm[`step${index + 1}`],
          // image: Config.createForm[`step${index + 1}`]
        }
      })


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'STEPS_LISTED_SUCCESSFULLY'
      response.data = { pages: pages, steps }
    } catch (error) {
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly getAdvertisement = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { advertisementId } = req.params
      const { auth, body } = req
      const userId = auth.role === Constants.userRole.USER ? auth.userId : body.userId
      if (!advertisementId || !userId) throw new CustomError.BadRequestError('ADVERTISEMENT_ID_REQUIRED')

      const providerAdvertisement = await Ads.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(advertisementId),
            userId: new mongoose.Types.ObjectId(userId),
            softdel: false
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'adscategories',
            localField: 'category',
            foreignField: '_id',
            as: 'adsCategoryName'
          }
        },
        {
          $unwind: {
            path: '$adsCategoryName',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'adssubcategories',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategoryName'
          }
        },
        {
          $unwind: {
            path: '$subCategoryName',
            preserveNullAndEmptyArrays: true
          }
        },
      ])

      if (!providerAdvertisement?.length) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'ADVERTISEMENT_DETAILS_LISTED'
      response.data = { ads: providerAdvertisement }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  //STEP 1
  static readonly addInfo = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }

    try {
      const { body, auth, params } = req
      const userId = auth.role === Constants.userRole.USER ? auth.userId : body.userId
      const advertisementId = params.advertisementId || ''

      if (!userId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      const validation = await AdsValidator.validateData(body , "Info")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let advertisement: any
      if (advertisementId) {
        advertisement = await this.advertisementData(advertisementId)
      } else {
        const adsCount = await Ads.countDocuments({ userId: userId, status: 'publish' })
        advertisement = new Ads({ userId })
        advertisement.userId = userId
        if(adsCount === 0) advertisement.isFreeAd = true
      }

      advertisement.name = body.name
      advertisement.desc = body.desc
      const data = await advertisement.save()


      // RESPONSE
      response.message = 'DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { ads: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly basicDetails = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }

    try {
      const { body, auth, params } = req
      const userId = auth.role === Constants.userRole.USER ? auth.userId : body.userId
      const advertisementId = params.advertisementId || ''

      if (!userId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')
      if (!advertisementId) throw new CustomError.BadRequestError('ADVERTISEMENT_ID_REQUIRED')

      const validation = await AdsValidator.validateData(body , "address")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const updateDoc: any = await this.advertisementData(advertisementId)

      const subscription = await AdsSubscription.findOne({ userId: userId, status: 'active'}).lean().exec()
      if (subscription) updateDoc.subscriptionId = subscription._id
      
      // Update document fields
      updateDoc.category = body.category || updateDoc.category
      updateDoc.subCategory = body.subCategory || updateDoc.subCategory
      updateDoc.price = body.price || updateDoc.price
      updateDoc.address = {
        city: body.city || updateDoc.address?.city,
        state: body.state || updateDoc.address?.state,
        country: body.country || updateDoc.address?.country,
        zipcode: body.zipcode || updateDoc.address?.zipcode,
        address: body.Address || updateDoc.address?.address,
        landmark: body.landmark || updateDoc.address?.landmark,
        location: body.location || updateDoc.address?.location,
        coordinates: [body.lat || updateDoc.address?.coordinates[0], body.lng || updateDoc.address?.coordinates[1]]
      }
      updateDoc.location = [body.lng || updateDoc.location[0], body.lat || updateDoc.location[1]]
      updateDoc.progressPercentage = body.progressPercentage || updateDoc.progressPercentage

      const result = await updateDoc.save()


      // RESPONSE
      response.message = 'BASIC_DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { ads: result }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  //STEP 2
  static readonly addCoverImage = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }

    try {
      const { file, params, body } = req
      const { selectedImage } = body
      const advertisementId = params.advertisementId || ''
      const updateCondition = {}
      const advertisementData: any = await Ads.findOne({ _id: advertisementId }).lean().exec()
      if (!advertisementData) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')

      if (file) {
        file.path = await helper.getFilePath(file.path)
        updateCondition['image.coverImage'] = file.path
        updateCondition['image.coverImageId'] = new mongoose.Types.ObjectId()
      } else if (mongoose.isValidObjectId(selectedImage)) {
        const galleryData = await Gallery.findOne({ _id: selectedImage })
        if (!galleryData) throw new CustomError.BadRequestError('IMAGE_NOT_FOUND')
        updateCondition['image.coverImage'] = galleryData.path
        updateCondition['image.coverImageId'] = galleryData._id
      } else throw new CustomError.BadRequestError('INVALID_INPUT')

      const updateDoc = await Ads.findOneAndUpdate(
        { _id: advertisementId },
        { $set: updateCondition },
        { new: true }
      ).exec()

      if (!updateDoc) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'COVER_IMAGE_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { adsImg: updateDoc }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly deleteCoverPhoto = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const advertisementId = req.params.advertisementId || ''

      let advertisementData = await Ads.findOneAndUpdate(
        { _id: advertisementId, userId: req.auth.userId },
        { 'image.coverImage': '', 'image.coverImageId': null },
        { new: true }
      ).lean().exec()
      if (!advertisementData) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { adsImg: advertisementData }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addGroupImages = async (req: MultipleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const advertisementId = req.params.advertisementId || ''
      const { selectedImages } = req.body
      let { files: groupImages } = req, groupImagesPath = []

      let userId = req.auth.role == Constants.userRole.ADMIN ? req.body.userId : req.auth.userId
      userId = new mongoose.Types.ObjectId(userId)

      let advertisementData = await Ads.findOne({ _id: advertisementId, userId: userId }).lean().exec()
      if (!advertisementData) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')

      if (groupImages?.length > 0) {
        for (let image of groupImages) {
          groupImagesPath.push({ imagePath: await helper.getFilePath(image.path), groupImageId: new mongoose.Types.ObjectId() })
        }
      } else if (Array.isArray(selectedImages) && selectedImages?.length > 0) {
        for (let imagesId of selectedImages) {
          if (mongoose.isValidObjectId(imagesId)) {
            const galleryData = await Gallery.findOne({ _id: imagesId }).lean().exec()
            if (!galleryData) throw new CustomError.BadRequestError('IMAGE_NOT_FOUND')
            groupImagesPath.push({ imagePath: galleryData.path, groupImageId: galleryData._id })
          }
        }
      }

      let updateDoc = await Ads.findOneAndUpdate(
        { _id: advertisementData._id },
        { 'image.groupImage': groupImagesPath },
        { new: true }
      )

      if (!updateDoc) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { adsImg: updateDoc }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listGroupImages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const advertisementId = req.params.advertisementId || ''

      const advertisementData = await Ads.findOne({ _id: advertisementId, userId: req.auth.userId }, { 'image.groupImage': 1, 'image.coverImage': 1 }).lean().exec()
      if (!advertisementData) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { adsImg: advertisementData }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteGroupImages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const advertisementId = req.params.advertisementId || ''
      const { imageId } = req.body

      let advertisementData = await Ads.findOneAndUpdate(
        { _id: advertisementId, userId: req.auth.userId },
        { $pull: { 'image.groupImage': { _id: { $in: imageId } } } },
        { new: true }
      ).lean().exec()
      if (!advertisementData) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.data = advertisementData
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  // Advertisements
  static readonly getCategories = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      // const categories = await Category.find({}, { category: 1, icon: 1 }).lean().exec()
      // if (!categories || !categories.length) throw new CustomError.BadRequestError('CATEGORIES_NOT_FOUND')
      const { subcat } = req.query;
      const isSubcat = subcat === 'true';

      const pipeline: any[] = [
        {
          $lookup: {
            from: 'adssubcategories',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'adsSubCategory',
          },
        },
      ];

      if (isSubcat) {
        pipeline.push({
          $match: {
            'adsSubCategory.0': { $exists: true },
          },
        });
      }

      pipeline.push({
        $project: {
          _id: 1,
          category: 1,
          icon: 1,
        },
      });

      const categories = await Category.aggregate(pipeline);
      if (!categories || categories.length === 0) throw new CustomError.BadRequestError('CATEGORIES_NOT_FOUND');


      // RESPONSE
      response.message = 'ADV_CATEGORIES_DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { categories: categories }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getSubCategories = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const subCategories = await SubCategory.aggregate([
        {
          $match: { categoryId: new mongoose.Types.ObjectId(req.params.id) }
        },
        {
          $lookup: {
            from: 'advertisements',
            localField: '_id',
            foreignField: 'subCategory',
            as: 'advertisements'
          }
        },
        {
          $unwind: { path: '$advertisements', preserveNullAndEmptyArrays: true }
        },
        {
          $match: {
            'advertisements.status': 'approve',
            'advertisements.softdel': false
          }
        },
        {
          $group: {
            _id: '$_id',
            subCategory: { $first: '$subCategory' },
            desc: { $first: '$desc' },
            count: { $sum: 1 }
          }
        },
        { $sort: { subCategory: 1, desc: 1 } }
      ]);


      // RESPONSE
      response.message = 'SUB_CATEGORIES_DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { subCategories: subCategories }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly advertisements = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { query }: any = req
      const pageQuery = await this.paginationBuilder(query)
      const searchRegex = { name: { $regex: query.search || '', $options: 'i' } }

      const findAndCondition: any = [
        { softdel: false },
        { 'userData.softdel': false },
        { 'userData.isActive': true }
      ]

      if (query.user) {
        findAndCondition.push({
          $or: [
            { 'userData.email': query.user },
            { 'userData.phone': query.user },
            { 'userData.firstname': query.user }
          ]
        })
      }

      const findOrCondition = []

      if (findOrCondition.length > 0) findAndCondition.push({ $or: findOrCondition })

      const advertisementData = await Ads.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'adscategories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryName'
          }
        },
        {
          $unwind: {
            path: '$categoryName',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'adssubcategories',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategoryName'
          }
        },
        {
          $unwind: {
            path: '$subCategoryName',
            preserveNullAndEmptyArrays: true
          }
        },
        { $match: { $and: findAndCondition } },
        { $sort: { createdAt: -1 } },
        { $match: searchRegex },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            data: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])


      // RESPONSE
      response.message = 'ADVERTISEMENTS_DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: advertisementData[0]?.totalCount[0]?.total || 0,
        adsData: advertisementData[0]?.data
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly singleAdvertisement = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const advertisementId = !req.params.advertisementId ? '' : new mongoose.Types.ObjectId(req.params.advertisementId)
      let userId: any, singleAdvertisement: any, pipeline: any

      const viewByAdmin = req.query.viewBy == 'admin'
      const matchStage = viewByAdmin ? { _id: advertisementId, softdel: false } : { _id: advertisementId, status: 'approve', softdel: false }

      const advertisementData = await Ads.findOne(matchStage).lean().exec()

      if (advertisementData) {
        if (req.query.userId) {
          let query: any = req.query
          userId = new mongoose.Types.ObjectId(query.userId)
          pipeline = [
            {
              $match: { $and: [matchStage] }
            },
            {
              $lookup: {
                from: 'adscategories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryName'
              }
            },
            {
              $unwind: {
                path: '$categoryName',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: 'adssubcategories',
                localField: 'subCategory',
                foreignField: '_id',
                as: 'subCategoryName'
              }
            },
            {
              $unwind: {
                path: '$subCategoryName',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userData'
              }
            },
            {
              $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'wishlists',
                localField: '_id',
                foreignField: 'collectionData',
                as: 'wish'
              }
            },
            {
              $addFields: {
                isBooking: {
                  $cond: {
                    if: {
                      $eq: ['$userData._id', userId]
                    },
                    then: true,
                    else: false
                  }
                }
              }
            },
            {
              $addFields: {
                wishlist: {
                  $filter: {
                    input: '$wish',
                    as: 'i',
                    cond: {
                      $and: [
                        { $not: { $eq: ['$wish', []] } },
                        {
                          $eq: ['$$i.userId', userId]
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                wishlist: {
                  $cond: {
                    if: {
                      $eq: ['$wishlist', []]
                    },
                    then: false,
                    else: true
                  }
                },
                categoryId: '$categoryName._id',
                categoryName: '$categoryName.category',
                subCategoryId: '$subCategoryName._id',
                subCategoryName: '$subCategoryName.subCategory',
                name: 1,
                desc: 1,
                address: 1,
                price: 1,
                status: 1,
                image: 1,
                'providerData.firstname': '$userData.firstname',
                'providerData._id': '$userData._id',
                'providerData.email': '$userData.email',
                'providerData.verifiedDate': '$userData.verifiedDate',
                'providerData.profileImage': '$userData.profileImage',
                isBooking: 1
              }
            }
          ]
        } else {
          pipeline = [
            {
              $match: { $and: [matchStage] }
            },
            {
              $lookup: {
                from: 'adscategories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryName'
              }
            },
            {
              $unwind: {
                path: '$categoryName',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: 'adssubcategories',
                localField: 'subCategory',
                foreignField: '_id',
                as: 'subCategoryName'
              }
            },
            {
              $unwind: {
                path: '$subCategoryName',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userData'
              }
            },
            {
              $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
            },
            {
              $project: {
                categoryId: '$categoryName._id',
                categoryName: '$categoryName.category',
                subCategoryId: '$subCategoryName._id',
                subCategoryName: '$subCategoryName.subCategory',
                name: 1,
                desc: 1,
                address: 1,
                price: 1,
                status: 1,
                image: 1,
                'providerData.firstname': '$userData.firstname',
                'providerData._id': '$userData._id',
                'providerData.email': '$userData.email',
                'providerData.verifiedDate': '$userData.verifiedDate',
                'providerData.profileImage': '$userData.profileImage',
              }
            }
          ]
        }
        singleAdvertisement = await Ads.aggregate(pipeline)
        if (!singleAdvertisement?.length) throw new CustomError.BadRequestError('ADVERTISEMENT_IS_EMPTY')
      } else throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')


      // RESPONSE
      response.message = 'ADVERTISEMENT_DETAIL_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { ads: singleAdvertisement[0] }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly multipleAdvertisements = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let query: any = req.query
      const queryParams = { ...req.query };
      delete queryParams._page;
      delete queryParams._limit;
      const queryParamCount = Object.keys(queryParams).length;
      let findAndCondition: any[] = []
      let pageQuery: any = await this.paginationBuilder(req.query)

      const dateFilterObj = {
        last24Hours: 1,
        last3Days: 3,
        last7Days: 7,
        last15Days: 15
      }
      if(query.dateFilter) {
        const currentDate = new Date()
        const days = dateFilterObj[query.dateFilter]
        if(days) {
          const dateRange = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);
          findAndCondition.push({ createdAt: { $gte: dateRange } });
        } else throw new CustomError.BadRequestError('INVALID|FORMAT')
      }

      let sortBy: any = {
        _id: 1
      }

      await this.checkActiveAdvertisement()
      await this.subscribedAdvertisement()

      if (query.category) {
        const category = await Category.findOne({ _id: query.category });
        if (!category?.isAll) findAndCondition.push({ 'categoryName._id': new mongoose.Types.ObjectId(query.category) })
      }

      //!query.category ? '' : findAndCondition.push({ 'categoryName._id': new mongoose.Types.ObjectId(query.category) })
      !query.subCategory ? '' : findAndCondition.push({ subCategory: new mongoose.Types.ObjectId(query.subCategory) })
      // !query.coordinates ? "" : findAndCondition.push({ "address.coordinates": { $in: query.coordinates.slice(1, -1).split(',').map(parseFloat) } });
      !query.name ? '' : findAndCondition.push({ name: { $regex: new RegExp(query.name, 'i') } });
      !query.maxPrice || !query.minPrice ? 0 : findAndCondition.push({ price: { $gte: Number(query.minPrice), $lte: Number(query.maxPrice) } })
      findAndCondition.push(
        { status: 'approve' },
        { softdel: false },
        { 'userData.softdel': false },
        { 'userData.isActive': true }
      )

      if (query.sort == 'distance' && (!query.lat || !query.lng)) {
        throw new CustomError.BadRequestError('COORDINATES_REQUIRED_FOR_DISTANCE_SORTING')
      }

      let requestRadius = req.query.requestRadius ? req.query.requestRadius : Config.requestRadius
      let maxDistanceInMeter = Number(requestRadius) * 1609
      let pipeline: any, pipeline1: any, userId: any
      if (query.lat && query.lng) {
        pipeline = {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(query.lng), parseFloat(query.lat)]
            },
            maxDistance: maxDistanceInMeter,
            spherical: true,
            distanceField: 'distance'
          }
        }
        sortBy = query.sort == 'distance' ? { distance: 1 } : sortBy
      } else {
        pipeline = {
          $match: {}
        }
      }

      if (query.sort == 'date') {
        sortBy = {
          createdAt: -1
        }
      }
      else if (query.sort == 'priceLowToHigh') {
        sortBy = {
          price: 1
        }
      }
      else if (query.sort == 'priceHighToLow') {
        sortBy = {
          price: -1
        }
      }


      if (req.query.userId) {
        let query: any = req.query
        userId = new mongoose.Types.ObjectId(query.userId)
        pipeline1 = [
          pipeline,
          {
            $lookup: {
              from: 'adscategories',
              localField: 'category',
              foreignField: '_id',
              as: 'categoryName'
            }
          },
          {
            $unwind: {
              path: '$categoryName',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'adssubcategories',
              localField: 'subCategory',
              foreignField: '_id',
              as: 'subCategoryName'
            }
          },
          {
            $unwind: {
              path: '$subCategoryName',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userData'
            }
          },
          {
            $unwind: {
              path: '$userData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'wishlists',
              localField: '_id',
              foreignField: 'collectionData',
              as: 'wish'
            }
          },
          {
            $lookup: {
              from: 'wishlists',
              localField: '_id',
              foreignField: 'collectionData',
              as: 'wish'
            }
          },
          {
            $addFields: {
              wishlist: {
                $filter: {
                  input: '$wish',
                  as: 'i',
                  cond: {
                    $and: [
                      { $not: { $eq: ['$wish', []] } },
                      {
                        $eq: ['$$i.userId', userId]
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: '$userData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: { $and: findAndCondition }
          },
          {
            $sort: sortBy,
          },
          {
            $project: {
              wishlist: {
                $cond: {
                  if: {
                    $eq: ['$wishlist', []]
                  },
                  then: false,
                  else: true
                }
              },
              categoryName: '$categoryName.category',
              subCategoryName: '$subCategoryName.subCategory',
              image: 1,
              name: 1,
              desc: 1,
              address: 1,
              price: 1,
              status: 1,
              createdAt: 1,
              'userData._id': 1,
              'userData.firstname': 1,
              'userData.lastname': 1
            }
          },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              ads: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ]
      } else {
        pipeline1 = [
          pipeline,
          {
            $lookup: {
              from: 'adscategories',
              localField: 'category',
              foreignField: '_id',
              as: 'categoryName'
            }
          },
          {
            $unwind: {
              path: '$categoryName',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'adssubcategories',
              localField: 'subCategory',
              foreignField: '_id',
              as: 'subCategoryName'
            }
          },
          {
            $unwind: {
              path: '$subCategoryName',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userData'
            }
          },
          {
            $unwind: {
              path: '$userData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: { $and: findAndCondition }
          },
          {
            $sort: sortBy,
          },
          {
            $project: {
              categoryName: '$categoryName.category',
              subCategoryName: '$subCategoryName.subCategory',
              image: 1,
              name: 1,
              desc: 1,
              address: 1,
              price: 1,
              status: 1,
              createdAt: 1,
              'userData._id': 1,
              'userData.firstname': 1,
              'userData.lastname': 1
            }
          },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              ads: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ]
      }
      console.log(findAndCondition)
      let approvedAdvertisement = await Ads.aggregate(pipeline1)


      // RESPONSE
      response.message = 'ADVERTISEMENTS_DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        filterCount: queryParamCount,
        totalCount: approvedAdvertisement[0]?.totalCount[0]?.total,
        approvedAds: approvedAdvertisement[0]?.ads
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static AdSuggestion = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let { search = "" } = req.query

      await this.checkActiveAdvertisement()

      const searchData = await Ads.aggregate([
        {
          $lookup: {
            from: 'adscategories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryName'
          }
        },
        {
          $unwind: {
            path: '$categoryName',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'adssubcategories',
            localField: 'subCategory',
            foreignField: '_id',
            as: 'subCategoryName'
          }
        },
        {
          $unwind: {
            path: '$subCategoryName',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            status: 'approve',
            $or:
              [
                { $and: [{ "categoryName.category": { $regex: search, $options: "i" } }, { "categoryName.isAll": false }] },
                { "subCategoryName.subCategory": { $regex: search, $options: "i" } },
                { "name": { $regex: search, $options: "i" } }
              ],
          }
        },
        {
          $project: {
            category: "$categoryName.category",
            subCategory: "$subCategoryName.subCategory",
            name: 1
          }
        },
        {
          $limit: 5
        }
      ])

      response.message = 'SUCCESS'
      response.status = true
      response.statusCode = 200
      response.data = searchData

    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static suggestions = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
    const  search: any = req.query?.search?.toString();
    if (!search || search.trim() === '') {
      response.message = 'DETAILS_LISTED';
      response.status = true;
      response.statusCode = 200;
      response.data = { suggestions: [] };
      return res.status(response.statusCode).json(response).end();
    }

    const regex = new RegExp(search, 'i'); 
    let categories = [];
    let subcategories = [];
    let products = [];

    categories = await Category.find({ category: { $regex: regex }, isAll: false }).limit(3).select('_id category').lean();
    subcategories = await SubCategory.find({ subCategory: { $regex: regex } }).limit(3).select('_id subCategory categoryId').lean();
    products = await Ads.find({ name: { $regex: regex }, status: 'approve' }).limit(3).select('_id name category subCategory').lean();

    if (categories.length === 0 && subcategories.length === 0) products = await Ads.find({ name: { $regex: regex }, status: 'approve' }).limit(9).select('_id name').lean();
    
    const suggestions = [
      ...categories.map((cat) => ({ key: 'category', value: cat.category, id: cat._id })),
      ...subcategories.map((sub) => ({ key: 'subcategory', value: sub.subCategory, id: sub._id, catid: sub.categoryId })),
      ...products.map((prod) => ({ key: 'product', value: prod.name, id: prod._id, catid: prod.category, subcatid: prod.subCategory })),
    ];
  

      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { suggestions }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly featureAdvertisements = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Ads.aggregate([
        {
          $match: {
            $and: [{ softdel: false }, { status: 'approve' }]
          }
        },
        {
          $project: {
            address: 1,
            name: 1,
            desc: 1,
            price: 1,
            status: 1,
            image: 1,
            createdAt: 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { featureAds: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteAdvertisement = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }

    try {
      const { auth, params: { advertisementId } } = req
      const userId = auth.role === Constants.userRole.USER ? auth.userId : req.body.userId

      if (!userId) throw new CustomError.BadRequestError('USER_ID_REQUIRED')

      if (Config.hiddenSettings.mode === '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_TEST_MODE', [])
      const data = await Ads.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(advertisementId),
          userId: new mongoose.Types.ObjectId(userId),
          softdel: false
        },
        { softdel: true },
        { new: true }
      ).exec()

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      const isAdmin = auth.role !== Constants.userRole.USER
      const notificationMessage = isAdmin ? `Your listing ${data.name} has been removed by admin` : `Your listing ${data.name} has been removed by yourself`
      const notifiData = {
        forWhom: data.userId,
        message: notificationMessage,
        fromWhom: isAdmin ? 'ADMIN' : 'USER',
        userType: 'PROVIDER',
        title: 'Advertisement Removed'
      }

      await NotificationController.notification(notifiData)


      // RESPONSE
      response.message = 'ADVERTISEMENT_DETAILS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { ads: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly providerAdvertisements = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { auth, query }: any = req
      let userId = auth.role == Constants.userRole.USER ? auth.userId : req.body.userId
      if (!userId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      const user = await Ads.findOne({ userId: userId })
      if (!user) throw new CustomError.BadRequestError('USER_ADVERTISEMENT_NOT_FOUND')

      const pageQuery = await this.paginationBuilder(query)
      const like = { name: { $regex: query.search || '', $options: 'i' } }

      let findAndCondition: any = [{ softdel: false, userId: new mongoose.Types.ObjectId(userId) }]
      let findOrCondition: any = []
      if (query.list === 'incomplete') findOrCondition.push({ status: 'pending' }, { status: 'decline' })

      if (findOrCondition.length > 0) findAndCondition.push({ $or: findOrCondition })

      console.log(JSON.stringify(findAndCondition))

      const providerAdvertisement = await Ads.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
        { $match: { $and: findAndCondition } },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            coverImage: '$image.coverImage',
            address: 1,
            name: 1,
            desc: 1,
            status: 1,
            price: 1,
            providerId: '$userData._id',
            progressPercentage: 1,
            updatedAt: 1
          }
        },
        { $match: like },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            provider: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])


      // RESPONSE
      response.message = 'PROVIDER_DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        total: providerAdvertisement[0]?.totalCount[0]?.total || 0,
        providerAds: providerAdvertisement[0]?.provider || []
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  //advertisement status
  static readonly publishAdvertisement = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let advertisementId = req.params.advertisementId

      let userData = await User.findOne({ _id: new mongoose.Types.ObjectId(req.auth.userId), verified: true }).lean().exec()
      if (!userData) throw new CustomError.BadRequestError('PROVIDER_NOT_VERIFIED')

      let advertisement: any = await this.advertisementData(advertisementId)
      if (advertisement.status == 'publish') throw new CustomError.BadRequestError('ADVERTISEMENT_PUBLISHED_ALREADY')

      let updateStaus = await Ads.findOneAndUpdate({ _id: advertisementId, status: 'pending' }, { status: 'publish' }, { new: true }).lean().exec()

      if (!updateStaus) throw new CustomError.BadRequestError('ADMIN_DECLINED_YOUR_ADVERTISEMENT CONTACT_ADMIN')

      let notifiData = {
        forWhom: req.auth.userId,
        message: updateStaus.name + ' published By ' + userData.firstname,
        fromWhom: 'PROVIDER',
        userType: 'ADMIN',
        title: 'Advertisement published'
      }
      await NotificationController.notification(notifiData)


      // RESPONSE
      response.message = 'ADVERTISEMENT_DETAILS_PUBLISHED'
      response.status = true
      response.data = updateStaus
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly approveAndDeclineAdvertisement = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let advertisementId = req.params.advertisementId,
        body = req.body,
        data: any,
        find: any,
        update: any;

      let advertisement = await Ads.findOne({ _id: new mongoose.Types.ObjectId(advertisementId) }).lean().exec()
      if (!advertisement) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND')

      if (body.status == 'approve') {
        if (advertisement.status == 'approve') throw new CustomError.BadRequestError('ADVERTISEMENT_IS_ALREADY_APPROVED')

        let currentDate = new Date()
        let inactiveDate = new Date()
        inactiveDate.setDate(inactiveDate.getDate() + Config.adstarConfig.adsValidityInDays)

        update = { status: 'approve', approveAt: currentDate, inactiveAt: inactiveDate }

        find = {
          _id: advertisementId,
          $or: [{ status: 'publish' }, { status: 'decline' }]
        }

        let notifiData = {
          forWhom: advertisement.userId,
          message: 'Your Advertisement ' + advertisement.name + ' approved by Admin',
          fromWhom: 'ADMIN',
          userType: 'PROVIDER',
          title: 'Advertisement Approved'
        }
        await NotificationController.notification(notifiData)

        data = await Ads.findOneAndUpdate(find, update, { new: true })
        if (!data) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

        let userData = await User.findById(data.userId).lean().exec()
        let mailData = { advertisementId: advertisementId }
        await Mail.sendMail(userData.email, mailData, 'Advertisement Approved')

        response.message = 'ADVERTISEMENT_APPROVED'
      }
      if (body.status == 'decline') {
        if (!body.reason) throw new CustomError.BadRequestError('DECLINE_REASON_REQUIRED')
        if (advertisement.status == 'decline') throw new CustomError.BadRequestError('ADVERTISEMENT_DECLINED_ALREADY')

        update = { status: 'decline' }

        find = {
          _id: advertisementId,
          $or: [{ status: 'publish' }, { status: 'approve' }]
        }

        let notifiData = {
          forWhom: advertisement.userId,
          message: 'Your Advertisement ' + advertisement.name + ' declined by Admin ',
          fromWhom: 'ADMIN',
          userType: 'PROVIDER',
          title: 'Advertisement Declined'
        }
        await NotificationController.notification(notifiData)

        data = await Ads.findOneAndUpdate(find, update, { new: true })
        if (!data) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

        let userData = await User.findById(data.userId).lean().exec()
        let mailData = { advertisementId: advertisementId }
        await Mail.sendMail(userData.email, mailData, 'advertisementDeclined')
        response.message = 'ADVERTISEMENT_DECLINED'
      }


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.data = { ads: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addToFavourite = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth,
        advertisementId = req.body.advertisementId
      if (!advertisementId) throw new CustomError.BadRequestError('ADVERTISEMENT_ID_IS_REQUIRED')
      await this.advertisementData(advertisementId)

      const advFav = await AdsFavourite.findOne({ favData: advertisementId })
      if (advFav) throw new CustomError.BadRequestError('THIS_ADVERTISEMENT_ALREADY_EXIST_IN_FAVOURITE')

      const advFavData = await AdsFavourite.create({
        userId: new mongoose.Types.ObjectId(auth.userId),
        favData: new mongoose.Types.ObjectId(advertisementId),
        createdAt: Date.now()
      })

      const savedFavData = await advFavData.save()
      if (!savedFavData) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_SAVED_TO_FAVOURITE')


      // RESPONSE
      response.message = 'SAVED_TO_YOUR_FAVOURITE'
      response.data = { savedFavData }
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getFavourite = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth
      const queryData = req.query

      let pageQuery = await this.paginationBuilder(queryData)
      let favourite: any

      favourite = await AdsFavourite.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(auth.userId),
            softdel: false
          }
        },
        {
          $lookup: {
            from: 'advertisements',
            localField: 'favData',
            foreignField: '_id',
            as: 'advertisementData'
          }
        },
        {
          $unwind: {
            path: '$advertisementData',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $match: {
            'advertisementData.softdel': false,
            'advertisementData.status': 'approve'
          }
        },
        {
          $group: {
            _id: { advertisementId: '$_id' },
            data: { $push: '$$ROOT' }
          }
        },
        {
          $sort: {
            _id: 1
          }
        },
        {
          $project: {
            'data.advertisementData.name': 1,
            'data.advertisementData.desc': 1,
            'data.advertisementData.price': 1,
            'data.advertisementData.image': 1,
            'data.advertisementData.approvedAt': 1
          }
        },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            favData: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])

      if (!favourite?.length) throw new CustomError.BadRequestError('FAVOURITES_NOT_FOUND')


      // RESPONSE
      response.message = 'FAVOURITES_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { favData: favourite[0].favData, totalCount: favourite[0]?.totalCount[0]?.total }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly removeFavourite = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth
      let favId: any = req.query.favId
      if (!favId) throw new CustomError.BadRequestError('FAV_ID_IS_REQUIRED')

      let favData: any = await AdsFavourite.findOne({ _id: favId, userId: new mongoose.Types.ObjectId(auth.userId) }).exec()
      if (!favData) throw new CustomError.BadRequestError('FAVOURITE_ADVERTISEMENT_NOT_FOUND')
      if (favData.softdel) throw new CustomError.BadRequestError('FAVOURITE_ADVERTISEMENT_ALREADY_DELETED')
      favData.softdel = true
      await favData.save()
      if (!favData) throw new CustomError.BadRequestError("FAVOURITE_ADVERTISEMENT_NOT_DELETED")


      // RESPONSE
      response.message = 'FAVOURITE_ADVERTISEMENT_REMOVED'
      response.data = { favData }
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly addCategory = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const newDoc: any = new Category()
      if (!req.body.category) throw new CustomError.BadRequestError('CATEGORY_REQUIRED')

      // if (req.file) {
      //   req.file.path = await helper.getFilePath(req.file.path)
      //   newDoc.icon = req.file.path
      // }
      if (req.files?.['icon']) {
        req.files['icon'][0].path = await helper.getFilePath(req.files['icon'][0].path)
        newDoc.icon = req.files['icon'][0].path
      }

      if (req.files?.['image']) {
        req.files['image'][0].path = await helper.getFilePath(req.files['image'][0].path)
        newDoc.image = req.files['image'][0].path
      }
      let checkCategory = await Category.find({ category: req.body.category }).exec()
      if (checkCategory.length != 0) throw new CustomError.BadRequestError('CATEGORY_ALREADY_FOUND')

      newDoc.category = req.body.category
      let data = await newDoc.save()


      // RESPONSE
      response.message = 'ADS_CATEGORY_DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { adsCategory: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateCategory = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        icon = '',
        image = ''
      let updateDoc = await Category.findById(req.params.id).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')
      if (body.category) {
        let checkCategory: any = await Category.find({ category: body.category }).exec()
        if (checkCategory.length != 0) throw new CustomError.BadRequestError('CATEGORY_ALREADY_FOUND')
      }

      // if (req.file) {
      //   req.file.path = await helper.getFilePath(req.file.path)
      //   icon = req.file.path
      // }
      if (req.files?.['icon']) {
        req.files['icon'][0].path = await helper.getFilePath(req.files['icon'][0].path);
        icon = req.files['icon'][0].path;
      }

      if (req.files?.['image']) {
        req.files['image'][0].path = await helper.getFilePath(req.files['image'][0].path);
        image = req.files['image'][0].path;
      }
      let update = await Category.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        {
          $set: {
            category: body.category,
            icon: icon || updateDoc.icon,
            image: image || updateDoc.image,
            updatedAt: Date.now()
          }
        },
        { new: true }
      ).lean().exec()


      // RESPONSE
      response.message = 'ADS_CATEGORY_DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { adsCategory: update }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth,
        categories: any
      let pageQuery: any = await this.paginationBuilder(req.query)
      let like = { category: { $regex: req.query.search || '', $options: 'i' } }

      if (auth.role == Constants.userRole.USER) {
        categories = await Category.aggregate([
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              categories: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])
      }
      if (auth.role == Constants.userRole.ADMIN) {
        categories = await Category.aggregate([
          { $match: like },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              categories: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])
      }
      if (!categories?.length) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE
      response.message = 'ADS_CATEGORY_DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: categories[0]?.totalCount[0]?.total,
        adsCategories: categories[0]?.categories
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Category.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id) }).lean().exec()
      if (!data) throw new CustomError.BadRequestError('CATEGORY_NOT_FOUND')
      await Category.deleteMany({ categoryId: new mongoose.Types.ObjectId(req.params.id) })


      // RESPONSE
      response.message = 'ADS_CATEGORY_DETAILS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { adsCategory: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addSubCategory = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      if (!req.params.id) throw new CustomError.BadRequestError('MISSING_FIELDS')
      if (!req.body.subCategory) throw new CustomError.BadRequestError('SUB_CATEGORY_IS_REQUIRED')
      const advCategory = await Category.findOne({ _id: req.params.id })
      if (!advCategory) throw new CustomError.BadRequestError('CATEGORY_NOT_FOUND')

      const newDoc = {
        categoryId: new mongoose.Types.ObjectId(req.params.id),
        subCategory: req.body.subCategory,
        desc: req.body.desc
      }
      const data = await SubCategory.create(newDoc)


      // RESPONSE
      response.message = 'SUB_CATEGORY_DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { subCategory: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateSubCategory = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body
      let updateDoc = await SubCategory.findById(req.params.id).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      let update = await SubCategory.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        {
          $set: {
            subCategory: body.subCategory,
            desc: body.desc,
            updatedAt: Date.now()
          }
        },
        { new: true }
      ).lean().exec()


      // RESPONSE
      response.message = 'SUB_CATEGORY_DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { subCategory: update }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listSubCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      let auth = req.auth,
        subCategories: any,
        like
      let pageQuery: any = await this.paginationBuilder(req.query)
      like = {
        $or: [{ subCategory: { $regex: req.query.search || '', $options: 'i' } }]
      }
      if (auth.role == Constants.userRole.USER) {
        subCategories = await SubCategory.aggregate([
          { $match: { categoryId: new mongoose.Types.ObjectId(req.params.id) } },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              subCategory: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])
      }
      if (auth.role == Constants.userRole.ADMIN) {
        subCategories = await SubCategory.aggregate([
          { $match: { categoryId: new mongoose.Types.ObjectId(req.params.id) } },
          { $match: like },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              subCategory: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])
      }

      if (!subCategories) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: subCategories[0]?.totalCount[0]?.total,
        subCategories: subCategories[0]?.subCategory
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteSubCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await SubCategory.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id) })
        .lean()
        .exec()
      if (!data) throw new CustomError.BadRequestError('SUB_CATEGORY_NOT_DELETED')

      // RESPONSE
      response.message = 'SUB_CATEGORY_DETAILS_DELETED';
      response.status = true
      response.statusCode = 200
      response.data = { subCategory: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly editConfig = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { steps } = req.body
      Steps.length = 0
      Steps?.push(...steps)

      const __dirname = path.resolve()
      const filePath = `${__dirname}/src/Module/Ads/AdsConfig.ts`
      const actualfilePath = `${__dirname}/build/Module/Ads/AdsConfig.js`

      const fileContent = `const pages = ${JSON.stringify(pages, null, 2)}\n const steps = ${JSON.stringify(Steps, null, 2)}\nexport { pages, steps }`
      
      await fs.writeFileSync(filePath, fileContent)
      await fs.copyFileSync(filePath, actualfilePath)


      // REPONSE
      response.data = { pages, steps }
      response.status = true
      response.statusCode = 200
      response.message = 'ADS_CONFIG_UPDATED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static addPackages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body

      const validation = await AdsValidator.addPackages(body)
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let checkPackage = await AdsPackages.find({ packageName: body.packageName, deletedAt: null })
      if (checkPackage.length !== 0) throw new CustomError.BadRequestError('PACKAGE_ALREADY_FOUND')

      const newDoc: any = new AdsPackages()
      newDoc.packageName = body.packageName
      newDoc.description = body.description
      newDoc.price = body.price
      newDoc.currency = body.currency
      newDoc.adsLimit = body.adsLimit
      newDoc.validityDays = body.validityDays
      newDoc.type = body.type
      let data = await newDoc.save()

      // REPONSE
      response.data =  data 
      response.status = true
      response.statusCode = 200
      response.message = 'ADS_PACKAGE_ADDED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static getPackages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let query: any = req.query
      let pageQuery: any = await this.paginationBuilder(query)
      let like = {
        $or: [
          { packageName: { $regex: query.search || '', $options: 'i' } },
          { price: { $regex: query.search || '', $options: 'i' } }
        ]
      }
      let matchCondition: any = req.params.id ? { _id: new mongoose.Types.ObjectId(req.params.id) } : {};
      if (query.categoryId) matchCondition.categoryId = new mongoose.Types.ObjectId(query.categoryId)
      
      let packages: any
      
      packages = await AdsPackages.aggregate([
        { $match: { ...matchCondition, ...like } },
        { $match : { deletedAt: null } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            packages: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ]) 

      if (packages.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.data = {
        totalCount: packages[0]?.totalCount[0]?.total,
        packages: packages[0]?.packages
      }
      response.status = true
      response.statusCode = 200
      response.message = 'ADS_PACKAGE_FETCHED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static updatePackages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let updateDoc = await AdsPackages.findById(req.params.id).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      const validation = await AdsValidator.updatePackages(body)
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      updateDoc.packageName = body.packageName || updateDoc.packageName
      updateDoc.description = body.description || updateDoc.description
      updateDoc.price = body.price || updateDoc.price
      updateDoc.currency = body.currency || updateDoc.currency
      updateDoc.adsLimit = body.adsLimit || updateDoc.adsLimit
      updateDoc.validityDays = body.validityDays || updateDoc.validityDays
      updateDoc.type = body.type || updateDoc.type
      updateDoc.save()
    

      // REPONSE
      response.data =  updateDoc 
      response.status = true
      response.statusCode = 200
      response.message = 'ADS_PACKAGE_UPDATED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static deletePackages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await AdsPackages.findOneAndUpdate(
        { _id: req.params.id },
        { deletedAt: Date.now() },  
        { new: true }             
      ).lean().exec()
  
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_DELETE')

      // REPONSE
      response.data =  data 
      response.status = true
      response.statusCode = 200
      response.message = 'ADS_PACKAGE_DELETED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static packageStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 200,
      status: false,  
      data: { createAd: false },
      validation: {}
    };
  
    try {
      const userId = req.auth.userId;
  
      const userAdsCount = await Ads.findOne({ userId: userId, isFreeAd: true });
      if (!userAdsCount) {
        response.status = true;
        response.message = 'CREATE_FREE_AD';
        response.data.createAd = true;
        return res.status(response.statusCode).send(response).end();
      }
      const subscriptionData = await AdsSubscription.findOne({ userId: userId, status: 'active', endDate: { $gte: new Date() }}).sort({ endDate: -1 }).lean().exec();
      if (!subscriptionData) {
        const lastSubscription = await AdsSubscription.findOne({ userId: userId }).sort({ endDate: -1 }).lean().exec();
        response.message = lastSubscription ? "PACKAGE_EXPIRED_PURCHASE_PACKAGE" : "PURCHASE_PACKAGE";
        return res.status(response.statusCode).send(response).end();
      }
  
      const userActiveAdsCount = await Ads.countDocuments({ userId: userId, subscriptionId: subscriptionData._id, status: { $ne: 'expired' }});
  
      if (userActiveAdsCount >= subscriptionData.adsLimit) {
        response.message = "ADS_LIMIT_EXCEEDED";
        return res.status(response.statusCode).send(response).end();
      }
  
      response.status = true;
      response.message = 'CREATE_AD';
      response.data.createAd = true;
  
    } catch (error) {
      console.log('Unexpected Error:', error);
      response.status = false;
      response.message = error.message || 'Internal Server Error';
      response.statusCode = 500; 
    }
  
    return res.status(response.statusCode).send(response).end();
  };
  
  

  static subscribePackages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { body, auth }  = req
      const  packageId = req.params.packageId
      const currency = req.query.currency || Config.site.currency

      if (!packageId || !body.amount) throw new CustomError.BadRequestError('MISSING_PACKAGEID_OR_AMOUNT');

      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(auth.userId),
        verified: true,
        isActive: true,
        softdel: false,
      }).lean();
      if (!user) throw new CustomError.BadRequestError('USER_NOT_VERIFIED');

      const packageData = await AdsPackages.findById(packageId).lean();
      if (!packageData) throw new CustomError.BadRequestError('PACKAGE_NOT_FOUND');

      const paymentIntent = await stripe.paymentIntent({ totalAmount: body.amount, currency: currency });

      const responseData = { payment: paymentIntent, packageId: packageId, userId: auth.userId };

      response.message = 'PAYMENT_INITIATED';
      response.status = true;
      response.statusCode = 200;
      response.data = responseData 

    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  } 

  static verifyPayment = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const paymentIntentId = req.params.id;
      const { packageId } = req.body;
      const userId = req.auth.userId;

      const paymentData:any = await stripe.stripePaymentStatus(paymentIntentId)
      
      const packageData = await AdsPackages.findOne({ _id: packageId })
      if (!packageData) throw new CustomError.BadRequestError('PACKAGE_NOT_FOUND');
  
      const userData = await User.findOne({ _id: userId })
      if (!userData) throw new CustomError.BadRequestError('USER_NOT_FOUND');
  
      if ( paymentData.status === 'succeeded' ) {
      const subscribe = await AdsSubscription.findOne({ paymentId: paymentIntentId })
      if (subscribe) {
        response.message = 'PAYMENT_INTENT_ALREADY_USED';
        response.data = { subscriptionData: subscribe };
        response.status = true;
        response.statusCode = 200;
        return res.status(response.statusCode).json(response);
      }
  
      const newSubscription = new AdsSubscription({
        userId,
        packageId: packageData._id,
        adsLimit: packageData.adsLimit,
        type: packageData.type,
        paidAmount: packageData.price ,
        currency: packageData.currency || Config.site.currency,
        startDate: new Date(),
        endDate: new Date(Date.now() + packageData.validityDays * 24 * 60 * 60 * 1000), 
        status: 'active',
        paymentId: paymentIntentId,
        paymentStatus: 'paid'
      });
  
      await newSubscription.save();
  
      response.message = 'PAYMENT_SUCCESS';
      response.data = { subscription: newSubscription };
      response.status = true;
      response.statusCode = 200;
    }
  
  } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static markAsSold = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let adsData: any

      const advertisementId = req.params.id;
      if(!advertisementId)  throw new CustomError.BadRequestError("ADSID_IS_REQUIRED")
      
      adsData = await Ads.findOne({ _id: advertisementId, userId: req.auth.userId })
      if (!adsData) throw new CustomError.BadRequestError('ADVERTISEMENT_NOT_FOUND');

      if (adsData.status === 'sold') throw new CustomError.BadRequestError('ADVERTISEMENT_ALREADY_SOLD')
      
      adsData.status = 'sold'
      await adsData.save()


      // REPONSE
      response.data = { adsData }
      response.status = true
      response.statusCode = 200
      response.message = 'ADS_CONFIG_UPDATED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static userPackages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { body, auth, params, query } = req
      const status = query.status
      const userId = auth.role === Constants.userRole.USER ? auth.userId : body.userId

      if (!userId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      const findCondition: any = { userId: new mongoose.Types.ObjectId(userId), deletedAt: null };

      if (status === 'active') findCondition.status = 'active'
      else if (status === 'expired') findCondition.status = 'expired'
        
      const userPackages = await AdsSubscription.find(findCondition).populate('packageId').sort({ endDate: -1 }); 

    
      // REPONSE
      response.data = { userPackages }
      response.status = true
      response.statusCode = 200
      response.message = `FETCHED_PACKAGES`
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}


export { AdvertisementController }