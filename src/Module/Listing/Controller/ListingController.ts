import mongoose , { HydratedDocument } from 'mongoose'
import moment from 'moment'
import path from 'path'
import fs from 'fs'
import List from '@abserve/Module/Listing/Model/Listings'
import { Steps, Pages } from '@abserve/Config/ListConfig'
import ListingAttachment from '@abserve/Module/Listing/Model/ListingAttachment'
import ListingPricing from '@abserve/Module/Listing/Model/ListingPricing'
import  {  PrivilegeController as Privilege  }  from '@abserve/Module/Privileges/Controller/PrivilegeController'
import { PrivilegeValidator } from '@abserve/Module/Privileges/Validators/PrivilegeValidator'
import User from '@abserve/Module/Auth/Model/User'
import WishList from '@abserve/Module/Listing/Model/WishList'
import Offers from '@abserve/Module/Listing/Model/Offers'
import Comision from '@abserve/Module/Listing/Model/Commission'
import Booking from '@abserve/Module/Listing/Model/Booking'
import Currency from '@abserve/Module/Currency/Currency'
import Category from '@abserve/Module/Listing/Model/PropertyCategories'
import Property from '@abserve/Module/Listing/Model/Properties'
import Gallery from '@abserve/Module/Gallery/Gallery'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { SingleFileRequest, MultipleFileRequest, AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { EmailController as Mail } from '@abserve/MailGateway/SendMail'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { ListValidator } from '@abserve/Module/Listing/Validators/ListValidator'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import { BaseController } from '@abserve/Module/BaseControllers'
import { Constants } from '@abserve/Config/Constants'
import { Config } from '@abserve/Config/AppConfig'
import { uploadToLocal, removeFile, cloudinaryUpload } from '@abserve/Module/FileUpload/index'
import { FolderConfig } from '@abserve/Module/FileUpload/FolderConfig'


class ListingController extends BaseController {
  constructor() {
    super()
  }
  static readonly testMail = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let otpMail: any;

      if (body.emailFor == 'forgetPassword') {
        otpMail = await Mail.sendMail(body.email, body.otp, 'forgetPassword')
      } else if (body.emailFor == 'CheckOut') {
        let find = await Booking.findById(body.bookingId).lean().exec()
        const formattedDate = new Date(find.checkOutDate).toLocaleString()
        let data = { totalAmount: find.fareAmount, checkoutDate: formattedDate, bookingId: body.bookingId }
        otpMail = await Mail.sendMail(body.email, data, 'CheckOut')
      } else if (body.emailFor == 'test') {
        otpMail = await Mail.sendMail(body.email, 'test', 'test')
      }

      if (!otpMail) throw new CustomError.BadRequestError('OTP_MAIL_FAILED')


      // RESPONSE
      response.message = 'TEST_MAIL_SENT_SUCCESSFULLY'
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


  static readonly listingData = async (id: string) => {
      try {
        let data = await List.findById(id).exec()
        if (!data) {
          throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
        } else {
          return data
        }
      } catch (error) {
          throw new Error(error)
      }
  }


  static readonly updateListDate = async (id: string) => {
      try {
        let data = await List.findByIdAndUpdate(id, { $set: { updatedAt: Date.now() } }, { new: true, upsert: true }).exec()
        if (!data) {
          throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
        } else {
          return data
        }
      } catch (error) {
          throw new Error(error)
      }
  }


  static readonly checkUserData = async (id: string) => {
      try {
        let data = await List.findOne({ userId: id }).exec()
        if (!data) {
          throw new CustomError.BadRequestError('USER_LISTINGS_NOT_FOUND')
        } else {
          return data
        }
      } catch (error) {
          throw new Error(error)
        }
  }


  static readonly updateToPendingStatus = async (listingId, isPricing?: boolean) => {
    let status: any, availability: any
    if (isPricing !== undefined) {
      status = (isPricing && Config.hiddenSettings.autoEnable == '1') ? 'approve' : 'pending'
      availability = isPricing && Config.hiddenSettings.autoEnable == '1';
    }
    else{
      status = 'pending';
      availability = false;
    }
    await List.findByIdAndUpdate(listingId, { status: status, availability: availability }, { new: true }).exec()
  }

  static readonly updateListingStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let status: any, availability: any
      let listingId = req.params.listingId
      status = Config.hiddenSettings.autoEnable == '1' ? 'approve' : 'pending'
      availability = Config.hiddenSettings.autoEnable == '1';

      let data = await List.findByIdAndUpdate(listingId, { status: status, availability: availability }, { new: true }).exec()

      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTING_STATUS_UPDATED'  
      response.data = data
    }
    catch (error) {
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly progressStatus = async (progressPercentage, listingId) => {
    progressPercentage = Number(progressPercentage)
    await List.findByIdAndUpdate(listingId, { progress: progressPercentage }, { new: true }).exec()
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
      if(!req.auth.userId) throw new CustomError.UnAuthorizedError('INVALID_USER')
      const listData: any = await List.find({ propertyName: 'untitled', status: 'pending', userId: req.auth.userId, sofdel: false }, { _id: 1 }).lean().exec()
      if(!listData?.length) throw new CustomError.BadRequestError('NO_LISITNG_DATA_FOUND')

      const data = listData[0] || {}  


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED_DATAS'  
      response.data = data
    } catch (error) {
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.reasons || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly getStepLists = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const steps = Steps.map((steps) => {
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
      response.data = { steps, pages: Pages }
    } catch (error) {
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
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
      const filePath = `${__dirname}/src/Config/ListConfig.ts`
      const actualfilePath = `${__dirname}/build/Config/ListConfig.js`

      const fileContent = `const Pages = ${JSON.stringify(Pages, null, 2)}\n const Steps = ${JSON.stringify(Steps, null, 2)}\nexport { Pages, Steps }`
      await fs.writeFileSync(filePath, fileContent)
      await fs.copyFileSync(filePath, actualfilePath)


      // REPONSE
      response.data = { Pages, steps }
      response.status = true
      response.statusCode = 200
      response.message = 'LISTING_CONFIG_UPDATED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  
  static readonly getListing = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let privileges: any
      const { listingId } = req.params
      const { auth, body } = req
      const userId = auth.role === Constants.userRole.USER ? auth.userId : body.userId
      if (!listingId || !userId) throw new CustomError.BadRequestError('LISTING_ID_REQUIRED')

      const data = await List.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(listingId),
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
            from: 'listingattachments',
            localField: '_id',
            foreignField: 'listingId',
            as: 'attachmentData'
          }
        },
        { $unwind: { path: '$attachmentData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'listingpricings',
            localField: '_id',
            foreignField: 'listingId',
            as: 'priceData'
          }
        },
        { $unwind: { path: '$priceData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'properties',
            localField: 'propertyType',
            foreignField: '_id',
            as: 'propertyTypeName'
          }
        },
        { $unwind: { path: '$propertyTypeName', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryName'
          }
        },
        { $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true } },
        // {
        //   $lookup: {
        //     from: 'amenities',
        //     localField: 'attachmentData.amenity',
        //     foreignField: '_id',
        //     as: 'amenities'
        //   }
        // },
        // {
        //   $lookup: {
        //     from: 'amenitycategories',
        //     localField: 'amenities.categoryId',
        //     foreignField: '_id',
        //     as: 'amenityCategories'
        //   }
        // },
        {
          $addFields: {
            schedule: { $ifNull: ["$schedule", []] }
          }
        }
      ])

      if (!data) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
      privileges = await Privilege.getPrivileges(listingId) || {}
 
      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DETAILS_LISTED'
      response.data = { listing: data, privileges: privileges.privilegeId, privilegeCategories: privileges.privilegeCategoryId, privilegeItems: privileges.privilegeItemId }
      response.validation = {}
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
      const listingId = params.listingId || ''

      if (!userId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      const validation = await ListValidator.validateData(body , "Info")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let listing: HydratedDocument<any>
      if (listingId) {
        // await this.updateToPendingStatus(listingId)
        await this.updateListDate(listingId)
        listing = await this.listingData(listingId)
      } else {
        listing = new List({ userId })
        listing.userId = userId
      }

      listing.propertyName = body.name
      listing.propertyDesc = body.desc
      listing.progress = body.progressPercentage
      const data = await listing.save()


      // RESPONSE
      response.message = 'DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { listing: data }
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
      const listingId = params.listingId || ''

      if (!userId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')
      if (!listingId) throw new CustomError.BadRequestError('LISTING_ID_REQUIRED')
      // if (!body.propertyCategory || !body.propertyType) throw new CustomError.BadRequestError('MUST_PASS_PROPERTYCATEGORY & PROPERTYTYPE')
      // if (!body.adult) throw new CustomError.BadRequestError('ADULT_COUNT_REQUIRED')

      const validation = await ListValidator.validateData(body , "address")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const updateDoc: any = await this.listingData(listingId)

      // Update document fields

      //property type
      updateDoc.propertyCategory = body.propertyCategory || updateDoc.propertyCategory
      updateDoc.propertyType = body.propertyType || updateDoc.propertyType
      updateDoc.progress = body.progressPercentage || updateDoc.progress
      //guest accomodation
      updateDoc.guest = {
        adult: body.adult || updateDoc.guest?.adult,
        children: body.children || updateDoc.guest?.children,
        pets: body.pets || updateDoc.guest?.pets
      }
      //room count and type
      updateDoc.accomodation = {
        bedRoomCount: body.bedRoomCount ?? updateDoc.accomodation?.bedRoomCount,
        bathRoom: {
            bathRoomCount: body.bathRoomCount ?? updateDoc.accomodation?.bathRoom?.bathRoomCount,
            shared: body.shared || updateDoc.accomodation?.bathRoom?.shared
        },
        bedRoomBedtype: body.bedRoomtype ?? updateDoc.accomodation?.bedRoomBedtype
      }
      //address
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

      const result = await updateDoc.save()
      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { listing: result }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly listingAvailability = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const { body, params } = req
      const listingId = params.listingId

      if (!listingId) throw new CustomError.BadRequestError("LISTING_ID_NOT_PROVIDED")

      const listing: any = await this.listingData(listingId)

      // update listing availability
      listing.schedule = body.schedule
      await listing.save();


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = "LISTING_AVAILABILITY_UPDATED"
      response.data = listing
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }

  static readonly slotAvailability = async (req: AuthenticateRequest, res: Response) => {
    try {

      const { listingId } = req.params
      const { weeklySchedule, progressPercentage } = req.body

      const listing = await this.listingData(listingId)

      listing.weeklySchedule = weeklySchedule
      listing.progress = progressPercentage 


      await listing.save()

      return res.json({
      status: true,
      message: "WEEKLY_SCHEDULE_UPDATED",
      data: listing
      })

    } catch (error) {

      return res.status(500).json({
      status: false,
      message: error.message
      })
    }

  }

  static readonly blockDate = async (req: AuthenticateRequest, res: Response) => {

    try {

      const { listingId } = req.params
      const { date } = req.body

      const listing = await this.listingData(listingId)

      listing.dateOverrides.push({
      date,
      isUnavailable: true
      })

      await listing.save()

      return res.json({
      status: true,
      message: "DATE_BLOCKED"
      })

    } catch (error) {

      return res.status(500).json({
      status: false,
      message: error.message
      })

    }

  }

  static readonly addPlacesOffer = async (req: SingleFileRequest, res: Response) => {
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
      const listingId = params.listingId || ''

      if (!userId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')
      if (!listingId) throw new CustomError.BadRequestError('LISTING_ID_NOT_FOUND')
      if (!body.name) throw new CustomError.BadRequestError('FIELD_IS_EMPTY')

      await this.listingData(listingId)

      const imagePath = req.file ? await helper.getFilePath(req.file.path) : ''
      const update = {
        name: body.name,
        desc: body.desc,
        Image: imagePath
      }

      const data = await List.findByIdAndUpdate(
        listingId,
        { $push: { placesToOffer: update }, progress: body.progressPercentage },
        { new: true }
      ).exec()

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      await this.progressStatus(body.progressPercentage, listingId)
      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { listing: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
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
      const { file, params, body }: any = req
      const { selectedImage } = body
      const listingId = params.listingId || ''
      const updateCondition = {}
      const listData = await List.findOne({ _id: listingId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      const listImageData = await ListingAttachment.findOne({ listingId: listingId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      if (file && listImageData.image?.publicId) await removeFile(listImageData.image.publicId);

      if (file) {
        // file.path = await uploadToLocal( file, FolderConfig.Listing )
        // updateCondition['image.coverImage'] = file.path
        file.path = await cloudinaryUpload( file.buffer, FolderConfig.Listing )
        updateCondition['image.coverImage'] = file.path.url
        updateCondition['image.publicId'] = file.path.publicId
        updateCondition['image.imageId'] = new mongoose.Types.ObjectId()
      } else if (mongoose.isValidObjectId(selectedImage)) {
        const galleryData = await Gallery.findOne({ _id: selectedImage })
        if (!galleryData) throw new CustomError.BadRequestError('IMAGE_NOT_FOUND')
        updateCondition['image.coverImage'] = galleryData.path
        updateCondition['image.publicId'] = galleryData.publicId
        updateCondition['image.imageId'] = galleryData._id
      } else throw new CustomError.BadRequestError('INVALID_INPUT')

      const updateDoc = await ListingAttachment.findOneAndUpdate(
        { listingId: listData._id },
        { $set: updateCondition, updatedAt: Date.now() },
        { new: true, upsert: true }
      ).exec()
      if (!updateDoc) throw new CustomError.BadRequestError("UPDATE_FAILED")


      await this.progressStatus(body.progressPercentage, listingId)
      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { listImg: updateDoc }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly updateCoverPhoto = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let listingId = req.params.listingId || ''

      let listData = await List.findOne({ _id: listingId, userId: req.auth.userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      let data = await ListingAttachment.findOneAndUpdate({ listingId: listingId }, { 'image.coverImage': '' }, { new: true }).exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { listImg: data }
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
      const listingId = req.params.listingId || ''
      const { selectedImages } = req.body
      let { files: groupImages } = req, groupImagesPath = []

      let userId = req.auth.role == Constants.userRole.ADMIN ? req.body.userId : req.auth.userId
      userId = new mongoose.Types.ObjectId(userId)

      let listData = await List.findOne({ _id: listingId, userId: userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
      const listImageData = await ListingAttachment.findOne({ listingId: listingId }).lean().exec();
      if (listImageData && listImageData.image?.groupImage?.length > 0) {
        for (const img of listImageData.image.groupImage) {
          if (img.publicId) {
            await removeFile(img.publicId);
          }
        }
      }

      if (groupImages && groupImages.length > 0) {
        for (let image of groupImages) {
          // image.path = await uploadToLocal( image, FolderConfig.Listing )
          // groupImagesPath.push({ imagePath: image.path, groupImageId: new mongoose.Types.ObjectId() })
          const cloudImage= await cloudinaryUpload( image.buffer, FolderConfig.Listing )
          groupImagesPath.push({ imagePath: cloudImage.url, groupImageId: new mongoose.Types.ObjectId(), publicId: cloudImage.publicId })
        }
      } else if (selectedImages && Array.isArray(selectedImages) && selectedImages.length > 0) {
        for (let imagesId of selectedImages) {
          if (mongoose.isValidObjectId(imagesId)) {
            const galleryData = await Gallery.findOne({ _id: imagesId }).lean().exec()
            if (!galleryData) throw new CustomError.BadRequestError('IMAGE_NOT_FOUND')
            groupImagesPath.push({ imagePath: galleryData.path, groupImageId: galleryData._id, publicId: galleryData.publicId })
          }
        }
      }

      let updateDoc = await ListingAttachment.findOneAndUpdate(
        { listingId: listingId },
        { $set: { 'image.groupImage': groupImagesPath }, updatedAt: Date.now() },
        { new: true, upsert: true }
      )
      if (!updateDoc) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      await this.progressStatus(req.body.progressPercentage, listingId)
      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { listImg: updateDoc }
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
      const listingId = req.params.listingId || ''

      const listData = await List.findOne({ _id: listingId, userId: req.auth.userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      const data = await ListingAttachment.findOne({ listingId: listingId }, { 'image.groupImage': 1, 'image.coverImage': 1 }).lean().exec()
      if (!data) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { listImg: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateGroupImages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = req.params.listingId || ''
      const { imageId } = req.body

      let listData = await List.findOne({ _id: listingId, userId: req.auth.userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      let data = await ListingAttachment.findOneAndUpdate(
        { listingId: listingId },
        { $pull: { 'image.groupImage': { _id: { $in: imageId } } } },
        { new: true }
      ).lean().exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.data = data
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


  static readonly addRules = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const listingId = req.params.listingId || ''
      let userId = req.auth.role == Constants.userRole.ADMIN ? req.body.userId : req.auth.userId
      userId = new mongoose.Types.ObjectId(userId)

      let validation = await ListValidator.validateData(body , "addRules")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let listData = await List.findOne({ _id: listingId, userId: userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      let updateData = {
        title: body.title,
        desc: body.desc,
        image: body.rules
      }

      let updateDoc = await ListingAttachment.findOneAndUpdate(
        { listingId: listingId },
        { $push: { rules: updateData }, updatedAt: Date.now() },
        { new: true, upsert: true }
      )
      if (!updateDoc) throw new CustomError.BadRequestError('ERROR_IN_ADDING')

      await this.progressStatus(req.body.progressPercentage, listingId)
      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { listingRules: updateDoc }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listRules = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }

    try {
      const { params, query, auth }: any = req
      const listingId = params.listingId || ''
      const userId = auth.userId

      const listData = await List.findOne({ _id: listingId, userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      let data: any
      if (query.ruleId) {
        data = await ListingAttachment.findOne({ 'rules._id': new mongoose.Types.ObjectId(query.ruleId) }).lean().exec()
        if (data) {
          const rule = data.rules.find((rule) => rule._id.toString() === query.ruleId)
          if (rule) response.data = rule
        }
      } else {
        data = await ListingAttachment.findOne({ listingId }, { rules: 1 }).lean().exec()
        if (data) response.data = { listingRules: data.rules }
      }

      if (!data) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.statusCode = 200
      response.status = true
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly updateRule = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = new mongoose.Types.ObjectId(req.params.listingId)
      const validation = await ListValidator.validateData(req.body , "addRules")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const listData = await List.findOne({ _id: listingId, userId: req.auth.userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      const updateData = {
        'rules.$.title': req.body.title,
        'rules.$.desc': req.body.desc,
        'rules.$.image': req.body.rules,
        updatedAt: Date.now()
      }

      const data = await ListingAttachment.findOneAndUpdate(
        { listingId: listingId, 'rules._id': new mongoose.Types.ObjectId(req.body.ruleId) },
        { $set: updateData },
        { new: true }
      ).lean().exec()

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(req.params.listingId)


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { listingRules: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteRules = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { ruleId } = req.body
      const listingId = req.params.listingId || ''
      let userId = req.auth.role == Constants.userRole.ADMIN ? req.body.userId : req.auth.userId
      userId = new mongoose.Types.ObjectId(userId)

      const listData = await List.findOne({ _id: listingId, userId: userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      const data = await ListingAttachment.findOneAndUpdate(
        { listingId: listingId },
        { $pull: { rules: { _id: { $in: ruleId } } } },
        { new: true }
      ).exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.data = data
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
 
  static readonly listPrivileges = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {},
    }
    try {
      const pageQuery: any = await this.paginationBuilder(req.query);
      let regex = { $regex: req.query.search || "", "$options": "i" };

      const privilegeData = await Privilege.fetchPrivileges(regex, pageQuery);

      response.data = {
        totalCount: privilegeData.totalCount,
        privilegeList: privilegeData.privileges
      };
      response.status = true;
      response.message = "PRIVILEGES_LISTED";
      response.statusCode = 200;
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly listPrivilegesItems = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {},
    }
    try {
      let query: any = req.query
      //const pageQuery: any = await this.paginationBuilder(req.query)
      let regex = { $regex: req.query.search || "", "$options": "i" }
      let queryCondition = query.privilegeId ? { privilegeId: new mongoose.Types.ObjectId(query.privilegeId) } : {};

      const privilegeItemData = await Privilege.fetchPrivilegeItems(regex, queryCondition);

      response.data = {
        totalCount: privilegeItemData.totalCount,
        privilegeItemList: privilegeItemData.privilegeItems
      };
      response.status = true;
      response.message = "PRIVILEGES_ITEMS_LISTED";
      response.statusCode = 200;
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly addPrivileges = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const moduleId = req.params.listingId || ''
      const { moduleType, privilegeItemId } = req.body

      const validation = await PrivilegeValidator.validateData(req.body , "addModuleCategory")
      if (!validation.status) { throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate) }

      const listData = await List.findOne({ _id: moduleId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
      
      //await Privilege.ifPrivilegeExists(listingId);
      
      const moduleCategory: any = await Privilege.addModuleCategory({
          moduleId,
          moduleType,
          privilegeItemId
      });
      if (!moduleCategory.status) throw new CustomError.BadRequestError('FAILED_TO_UPDATE');

      await this.progressStatus(req.body.progressPercentage, moduleId)
      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(moduleId)


      // RESPONSE
      response.data ={ moduleCategory: moduleCategory.data } 
      response.status = true
      response.message = 'DETAILS_UPDATED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  // static listAmentities = async (req: AuthenticateRequest, res: Response) => {
  //   let response = {
  //     message: 'Unprocessable Entity',
  //     statusCode: 500,
  //     status: false,
  //     data: {},
  //     validation: {}
  //   }
  //   try {
  //     const amenity = await AmenityCategory.aggregate([
  //       {
  //         $lookup: {
  //           from: 'amenities',
  //           localField: '_id',
  //           foreignField: 'categoryId',
  //           as: 'amenities'
  //         }
  //       }
  //     ])


  //     // RESPONSE
  //     response.data = { amenityData: amenity }
  //     response.status = true
  //     response.message = 'DETAILS_LISTED'
  //     response.statusCode = 200
  //   } catch (error) {
  //     console.log('Error \n', error)
  //     response.status = false
  //     response.message = error.message || response.message
  //     response.validation = error.reasons || {}
  //     response.statusCode = error.statusCode || response.statusCode
  //   }
  //   return res.status(response.statusCode || 500).json(response).end()
  // }


  // static addAmenities = async (req: AuthenticateRequest, res: Response) => {
  //   let response = {
  //     message: 'Unprocessable Entity',
  //     statusCode: 500,
  //     status: false,
  //     data: {},
  //     validation: {}
  //   }
  //   try {
  //     const listingId = req.params.listingId || ''
  //     const { amenityId } = req.body

  //     const validation = await ListValidator.addAmenity(req.body)
  //     if (!validation.status) {
  //       throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
  //     }

  //     const listData = await List.findOne({ _id: listingId }).lean().exec()
  //     if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

  //     const checkData = await Amenity.find({ _id: { $in: [...amenityId] } }).lean().exec()
  //     if (!checkData || checkData.length == 0) throw new CustomError.BadRequestError('AMENITY_NOT_EXIST')

  //     const updateData = await ListingAttachment.findOneAndUpdate(
  //       { listingId: listingId },
  //       { amenity: [...amenityId], updatedAt: Date.now() },
  //       { new: true, upsert: true }
  //     )
  //     if (!updateData) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

  //     await this.progressStatus(req.body.progressPercentage, listingId)
  //     // await this.updateToPendingStatus(listingId)
  //     await this.updateListDate(listingId)


  //     // RESPONSE
  //     response.data = { amenity: updateData }
  //     response.status = true
  //     response.message = 'DETAILS_UPDATED'
  //     response.statusCode = 200
  //   } catch (error) {
  //     console.log('Error \n', error)
  //     response.status = false
  //     response.message = error.message || response.message
  //     response.validation = error.validationArr || {}
  //     response.statusCode = error.statusCode || response.statusCode
  //   }
  //   return res.status(response.statusCode || 500).json(response).end()
  // }


  //STEP 3
  static readonly addPricing = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = req.params.listingId || ''
      const { perHour, perDay, minimumNight, maximumNight, availableCount, extraGuest, extraGuestFee, maxNightSelect, discountPercentage, currency } = req.body

      //validation
      const validation = await ListValidator.validateData(req.body , "addPricing")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }


      let perHourUSD = perHour
      let perDayUSD = perDay

      if (currency && currency !== "USD") {
        const currencyData: any = await Currency.findOne({ code: currency })
        if (currencyData && currencyData.exchange_rate) {
          perHourUSD = perHour / currencyData.exchange_rate
          perDayUSD = perDay / currencyData.exchange_rate
        }
      }

    // Discount Calculation
    let discountedPrice = 0; 
    if (discountPercentage > 0) discountedPrice = perDay * (1 - discountPercentage / 100);
    

      //add the data
      const listPricing = await ListingPricing.findOneAndUpdate(
        { listingId: listingId },
        {
          'pricing.perHour': perHourUSD,
          'pricing.perDay': perDayUSD,
          'pricing.discountPercentage': discountPercentage,
          'pricing.discountedPrice': discountedPrice,
          'availableCount': availableCount,
          'maxNightSelect': maxNightSelect,
          'bookingType.minimumNight': minimumNight,
          'bookingType.maximumNight': maximumNight,
          'bookingType.extraGuest': extraGuest,
          'bookingType.extraGuestFee': extraGuestFee
        },
        { new: true, upsert: true }
      )

      if (!listPricing) {
        // await this.updateToPendingStatus(listingId)
        throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
      }
      else{
        const isPricing = true;
        await this.updateToPendingStatus(listingId, isPricing)
      }

      await this.progressStatus(req.body.progressPercentage, listingId)
      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'PRICING_DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { listingPrice: listPricing }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

    static readonly addPackages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }

    try {
      const listingId = req.params.listingId || ''
      console.log("----------packages", req.body)
      const { dayPassPackages = [] } = req.body

      if (!Array.isArray(dayPassPackages) || dayPassPackages.length === 0) {
        throw new CustomError.BadRequestError('PACKAGE_REQUIRED')
      }

      const listPricing = await ListingPricing.findOneAndUpdate(
        { listingId: listingId },
        { 
          $set: { 
            dayPassPackages: dayPassPackages,
            updatedAt: new Date()
          } 
        },
        { new: true, upsert: true }
      )

      if (!listPricing) {
        throw new CustomError.BadRequestError('FAILED_TO_UPDATE_PACKAGES')
      }
      await this.updateListDate(listingId)

      response.message = 'PACKAGES_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { listingPrice: listPricing }

    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }

    return res.status(response.statusCode || 500).json(response).end()
  }



  static readonly addBlockedDates = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = req.params.listingId || ''
      const { body } = req

      //validation
      const validation = await ListValidator.validateData(req.body , "blockedDates")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const listData = await List.findOne({ _id: listingId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
      if (listData.status !== 'approve') throw new CustomError.BadRequestError('LISTING_NOT_APPROVED');
      
      //checking blocked dates
      const checkDate = await ListingPricing.findOne({
        listingId,
        'blockedDates.start': { $eq: body.start },
        'blockedDates.end': { $eq: body.end }
      }).lean().exec()
      if (checkDate) throw new CustomError.BadRequestError('DATES_BLOCKED_ALREADY')

      const update = {
        start: body.start,
        end: body.end,
        desc: 'blockedDates'
      }

      //adding data
      const data = await ListingPricing.findOneAndUpdate(
        { listingId },
        { $push: { blockedDates: update } },
        { new: true }
      )
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { dates: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listBlockedDates = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = req.params.listingId || ''

      const listData = await List.findOne({ _id: new mongoose.Types.ObjectId(listingId), userId: req.auth.userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      const data = await ListingPricing.findOne(
        { listingId: new mongoose.Types.ObjectId(listingId) },
        { blockedDates: 1 }
      )
      if (!data) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { dates: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateBlockedDates = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = req.params.listingId || ''
      const { dateId, startDate, endDate } = req.body

      const validation = await ListValidator.validateData(req.body , "updateDates")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const listData = await List.findOne({ _id: listingId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('DATA_NOT_FOUND')
      if (listData.status !== 'approve') throw new CustomError.BadRequestError('LISTING_NOT_APPROVED');

      // let data = await listingPricing.findOneAndUpdate({ listingId: listingId, "blockedDates._id": new mongoose.Types.ObjectId(dateId), "blockedDates.desc": "blockedDates" },
      //     { '$set': { 'blockedDates.$.start': startDate, 'blockedDates.$.end': endDate } }, { new: true });

      const data = await ListingPricing.updateMany(
        {
          listingId: listingId,
          'blockedDates._id': new mongoose.Types.ObjectId(dateId),
          'blockedDates.desc': 'blockedDates'
        },
        {
          $set: {
            'blockedDates.$[elem].start': startDate,
            'blockedDates.$[elem].end': endDate
          }
        },
        { arrayFilters: [{ 'elem._id': new mongoose.Types.ObjectId(dateId) }] }
      )

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { dates: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteBlockedDates = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = req.params.listingId
      const { dateId } = req.body
      if (!dateId) throw new CustomError.BadRequestError('DATE_ID_REQUIRED')
      const listData = await List.findOne({ _id: new mongoose.Types.ObjectId(listingId), userId: req.auth.userId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      const data = await ListingPricing.findOneAndUpdate(
        { listingId: listingId, 'blockedDates._id': dateId },
        { $pull: { blockedDates: { _id: { $in: dateId } } } },
        { new: true }
      ).exec()
      console.log(data)
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      // await this.updateToPendingStatus(listingId)
      await this.updateListDate(listingId)


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { dates: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  //Listings
  static readonly availability = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const listingId = req.params.listingId;
      const { body } = req
      if (body.availability === undefined || body.availability === null) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')
      //checking data
      const listData = await List.findOne({ _id: listingId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      //adding data
      const data = await List.findOneAndUpdate(
        { _id: listingId },
        { availability: body.availability },
        { new: true }
      )
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.data = data
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


  // static getAmenities = async (req: AuthenticateRequest, res: Response) => {
  //   let response = {
  //     message: 'Unprocessable Entity',
  //     statusCode: 500,
  //     status: false,
  //     data: {},
  //     validation: {}
  //   }
  //   try {
  //     const amenities: any = await Amenity.find({}, { name: 1, icon: 1, desc: 1 }).lean().exec()
  //     if (!amenities || amenities.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


  //     // RESPONSE
  //     response.message = 'DETAILS_LISTED'
  //     response.status = true
  //     response.statusCode = 200
  //     response.data = { amenities: amenities }
  //   } catch (error) {
  //     console.log('Error \n', error)
  //     response.status = false
  //     response.message = error.message || response.message
  //     response.validation = error.reasons || {}
  //     response.statusCode = error.statusCode || response.statusCode
  //   }
  //   return res.status(response.statusCode || 500).json(response).end()
  // }


  static readonly getproperties = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const properties = await Property.find({ categoryId: new mongoose.Types.ObjectId(req.params.id) }, { property: 1, icon: 1, desc: 1 }).sort({ property: 1, desc: 1 }).lean().exec()
    //if (!properties || properties.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { properties: properties }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getCategories = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { subcat } = req.query; 
      const isSubcat = subcat === 'true'; 

      const pipeline: any[] = [
        {
          $lookup: {
            from: 'properties',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'properties',
          },
        },
      ];

      if (isSubcat) {
        pipeline.push({
          $match: {
            'properties.0': { $exists: true },
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
      if (!categories || categories.length === 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND');
    
      // RESPONSE
      response.message = 'DETAILS_LISTED'
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


  static readonly Listings = async (req: AuthenticateRequest, res: Response) => {
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

      const findAndCondition: any = [
        { softdel: false },
        { 'userData.softdel': false },
        { 'userData.isActive': true }
      ]

      if (query.propertyName) findAndCondition.push({ propertyName: { $regex: new RegExp(query.propertyName, "i") } });
      if (query.firstname) findAndCondition.push({ 'userData.firstname': { $regex: new RegExp(query.firstname, "i") } });
      if (query.city) findAndCondition.push({ 'address.city': { $regex: new RegExp(query.city, "i") } });
      if (query.state) findAndCondition.push({ 'address.state': { $regex: new RegExp(query.state, "i") } });
      if (query.country) findAndCondition.push({ 'address.country': { $regex: new RegExp(query.country, "i") } });
      
      if (query.search) {
        findAndCondition.push({
          $or: [
            { propertyName: { $regex: new RegExp(query.search, "i") } },
            { 'userData.firstname': { $regex: new RegExp(query.search, "i") } },
            { 'address.city': { $regex: new RegExp(query.search, "i") } },
            { 'address.state': { $regex: new RegExp(query.search, "i") } },
            { 'address.country': { $regex: new RegExp(query.search, "i") } }
          ]
        });
      }
      if (query.bathRoom)
        findAndCondition.push({ 'accomodation.bathRoom.bathRoomCount': Number(query.bathRoom) })
      if (query.bedRoom) findAndCondition.push({ 'accomodation.bedRoomCount': Number(query.bedRoom) })

      const findOrCondition = []
      if (query.list === 'listed') findOrCondition.push({ status: 'approve' })
      if (query.list === 'inProgress') findOrCondition.push({ status: 'publish' })
      if (query.list === 'incomplete') findOrCondition.push({ status: 'pending' })
      if (query.list === 'decline') findOrCondition.push({ status: 'decline' })
      if (query.list === 'unListed') findOrCondition.push({ availability: false })
      // if (query.amenities) {
      //   findAndCondition.push({
      //     'attachmentData.amenity': {
      //       $in: query.amenities
      //         .slice(1, -1)
      //         .split(',')
      //         .map((id) => new mongoose.Types.ObjectId(id))
      //     }
      //   })
      // }
      if (query.privileges) {
        const privilegesCondition = await Privilege.getModulesByPrivileges(query.privileges);
        if (privilegesCondition) findAndCondition.push(privilegesCondition);
      }

      if (findOrCondition.length > 0) findAndCondition.push({ $or: findOrCondition })

      const listData = await List.aggregate([
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
            from: 'listingattachments',
            localField: '_id',
            foreignField: 'listingId',
            as: 'attachmentData'
          }
        },
        { $unwind: { path: '$attachmentData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'listingpricings',
            localField: '_id',
            foreignField: 'listingId',
            as: 'priceData'
          }
        },
        { $unwind: { path: '$priceData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'properties',
            localField: 'propertyType',
            foreignField: '_id',
            as: 'propertyTypeName'
          }
        },
        { $unwind: { path: '$propertyTypeName', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryName'
          }
        },
        { $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true } },
        // {
        //   $lookup: {
        //     from: 'amenities',
        //     localField: 'attachmentData.amenity',
        //     foreignField: '_id',
        //     as: 'amenities'
        //   }
        // },
        // {
        //   $lookup: {
        //     from: 'amenitycategories',
        //     localField: 'amenities.categoryId',
        //     foreignField: '_id',
        //     as: 'amenityCategories'
        //   }
        // },
        {
          $lookup: {
            from: 'commissions',
            localField: '_id',
            foreignField: 'listingId',
            as: 'commissionTaxDetails'
          }
        },
        { $unwind: { path: '$commissionTaxDetails', preserveNullAndEmptyArrays: true } },
        { $match: { $and: findAndCondition } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            data: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: listData[0]?.totalCount[0]?.total || 0,
        listingData: listData[0]?.data
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


  static readonly providerListings = async (req: AuthenticateRequest, res: Response) => {
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

      await this.checkUserData(userId)

      const pageQuery = await this.paginationBuilder(query)
      const like = { propertyName: { $regex: query.search || '', $options: 'i' } }

      let findAndCondition: any = [{ softdel: false, userId: new mongoose.Types.ObjectId(userId) }]
      let findOrCondition: any = []

      if (query.bathRoom)
        findAndCondition.push({ 'accomodation.bathRoom.bathRoomCount': Number(query.bathRoom) })
      if (query.bedRoom) findAndCondition.push({ 'accomodation.bedRoomCount': Number(query.bedRoom) })
      if (query.list === 'listed') findOrCondition.push({ status: 'approve' })
      if (query.list === 'inProgress') findOrCondition.push({ status: 'publish' })
      if (query.list === 'incomplete')
        findOrCondition.push({ status: 'pending' }, { status: 'decline' })
      if (query.list === 'unListed') findOrCondition.push({ availability: false })
      if (query.status === 'approve') findOrCondition.push({ status: 'approve' })
      // if (query.amenities) {
      //   findAndCondition.push({
      //     'attachmentData.amenity': {
      //       $in: query.amenities.slice(1, -1).split(',').map((str) => new mongoose.Types.ObjectId(str))
      //     }
      //   })
      // }
      if (query.privileges) {
        const privilegesCondition = await Privilege.getModulesByPrivileges(query.privileges);
        if (privilegesCondition) findAndCondition.push(privilegesCondition);
      }

      if (findOrCondition.length > 0) {
        findAndCondition.push({ $or: findOrCondition })
      }

      console.log(JSON.stringify(findAndCondition))

      const providerListings = await List.aggregate([
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
            from: 'listingpricings',
            localField: '_id',
            foreignField: 'listingId',
            as: 'priceData'
          }
        },
        { $unwind: { path: '$priceData', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'listingattachments',
            localField: '_id',
            foreignField: 'listingId',
            as: 'attachmentData'
          }
        },
        { $unwind: { path: '$attachmentData', preserveNullAndEmptyArrays: true } },
        // {
        //   $lookup: {
        //     from: 'amenities',
        //     localField: 'attachmentData.amenity',
        //     foreignField: '_id',
        //     as: 'amenities'
        //   }
        // },
        // {
        //   $lookup: {
        //     from: 'amenitycategories',
        //     localField: 'amenities.categoryId',
        //     foreignField: '_id',
        //     as: 'amenityCategories'
        //   }
        // },
        {
          $lookup: {
            from: 'modulecategories',
            localField: '_id',
            foreignField: 'moduleId',
            as: 'moduleCategoryData'
          }
        },
        {
          $lookup: {
            from: 'privilegeitems',
            localField: 'moduleCategoryData.privilegeItemId',
            foreignField: '_id',
            as: 'privilegeItemData'
          }
        },
        {
          $lookup: {
            from: 'privilegecategories',
            localField: 'privilegeItemData.privilegeCategoryId',
            foreignField: '_id',
            as: 'privilegeCategoryData'
          }
        },
        { $match: { $and: findAndCondition } },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            coverImage: '$attachmentData.image.coverImage',
            address: 1,
            propertyName: 1,
            propertyDesc: 1,
            status: 1,
            accomodation: 1,
            'priceData.pricing': 1,
            // 'amenities.name': 1,
            // 'amenities.desc': 1,
            // 'amenities._id': 1,
            'privilegeItemData.privilegeCategoryId': 1,
            'privilegeItemData.name': 1,
            'privilegeItemData.description': 1,
            'privilegeItemData.icon': 1,
            'privilegeItemData._id':1,
            availability: 1,
            providerId: '$userData._id',
            instantBooking: '$userData.instantBooking',
            progress: 1,
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
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        total: providerListings[0]?.totalCount[0]?.total || 0,
        providerListings: providerListings[0]?.provider || []
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


  static readonly singleListingForAdmin = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let privileges: any
      const listingId = !req.params.listingId ? '' : new mongoose.Types.ObjectId(req.params.listingId)
      const policy = Config.cancelationPolicy
      let userId: any, singleList: any, pipeline: any;


      const listData = await List.findOne({ _id: listingId }).lean().exec()
      if (listData) {
        if (req.query.userId) {
          let query: any = req.query
          userId = new mongoose.Types.ObjectId(query.userId)
          pipeline = [
            {
              $match: { $and: [{ _id: listingId }, { softdel: false }] }
            },
            {
              $lookup: {
                from: 'properties',
                localField: 'propertyType',
                foreignField: '_id',
                as: 'propertyTypeName'
              }
            },
            {
              $unwind: { path: '$propertyTypeName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'propertycategories',
                localField: 'propertyCategory',
                foreignField: '_id',
                as: 'propertyCategoryName'
              }
            },
            {
              $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'listingattachments',
                localField: '_id',
                foreignField: 'listingId',
                as: 'attachmentData'
              }
            },
            {
              $lookup: {
                from: 'listingpricings',
                localField: '_id',
                foreignField: 'listingId',
                as: 'priceData'
              }
            },
            // {
            //   $lookup: {
            //     from: 'amenities',
            //     localField: 'attachmentData.amenity',
            //     foreignField: '_id',
            //     as: 'amenities'
            //   }
            // },
            // {
            //   $lookup: {
            //     from: 'amenitycategories',
            //     localField: 'amenities.categoryId',
            //     foreignField: '_id',
            //     as: 'amenityCategories'
            //   }
            // },
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
                propertyTypeId: '$propertyTypeName._id',
                propertyTypeName: '$propertyTypeName.property',
                propertyCategoryId: '$propertyCategoryName._id',
                propertyCategoryName: '$propertyCategoryName.category',
                propertyName: 1,
                propertyDesc: 1,
                address: 1,
                guest: 1,
                accomodation: 1,
                status: 1,
                placesToOffer: 1,
                reviewRating: 1,
                // 'amenityCategories.category': 1,
                // 'amenityCategories.desc': 1,
                // 'amenityCategories._id': 1,
                // 'amenities._id': 1,
                // 'amenities.categoryId': 1,
                // 'amenities.name': 1,
                // 'amenities.desc': 1,
                // 'amenities.icon': 1,
                'attachmentData.image': 1,
                'attachmentData.rules': 1,
                'priceData.pricing': 1,
                'priceData.blockedDates': 1,
                'priceData.bookingType': 1,
                'providerData.firstname': '$userData.firstname',
                'providerData._id': '$userData._id',
                'providerData.email': '$userData.email',
                'providerData.instantBooking': '$userData.instantBooking',
                'providerData.verifiedDate': '$userData.verifiedDate',
                'providerData.profileImage': '$userData.profileImage',
                cancellationPolicyId: '$userData.cancellationPolicyId',
                totalRatingCount: 1,
                totalReviewCount: 1,
                isBooking: 1
              }
            }
          ]
        } else {
          pipeline = [
            {
              $match: { $and: [{ _id: listingId }, { softdel: false }] }
            },
            {
              $lookup: {
                from: 'properties',
                localField: 'propertyType',
                foreignField: '_id',
                as: 'propertyTypeName'
              }
            },
            {
              $unwind: { path: '$propertyTypeName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'propertycategories',
                localField: 'propertyCategory',
                foreignField: '_id',
                as: 'propertyCategoryName'
              }
            },
            {
              $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'listingattachments',
                localField: '_id',
                foreignField: 'listingId',
                as: 'attachmentData'
              }
            },
            {
              $lookup: {
                from: 'listingpricings',
                localField: '_id',
                foreignField: 'listingId',
                as: 'priceData'
              }
            },
            // {
            //   $lookup: {
            //     from: 'amenities',
            //     localField: 'attachmentData.amenity',
            //     foreignField: '_id',
            //     as: 'amenities'
            //   }
            // },
            // {
            //   $lookup: {
            //     from: 'amenitycategories',
            //     localField: 'amenities.categoryId',
            //     foreignField: '_id',
            //     as: 'amenityCategories'
            //   }
            // },
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
                propertyTypeId: '$propertyTypeName._id',
                propertyTypeName: { $ifNull: ['$propertyTypeName.property', ''] },
                propertyCategoryId: '$propertyCategoryName._id',
                propertyCategoryName: { $ifNull: ['$propertyCategoryName.category', ''] },
                propertyName: 1,
                propertyDesc: 1,
                address: 1,
                guest: 1,
                accomodation: 1,
                status: 1,
                placesToOffer: 1,
                reviewRating: 1,
                // 'amenityCategories.category': 1,
                // 'amenityCategories.desc': 1,
                // 'amenityCategories._id': 1,
                // 'amenities._id': 1,
                // 'amenities.categoryId': 1,
                // 'amenities.name': 1,
                // 'amenities.desc': 1,
                // 'amenities.icon': 1,
                'attachmentData.image': 1,
                'attachmentData.rules': 1,
                'priceData.pricing': 1,
                'priceData.blockedDates': 1,
                'priceData.bookingType': 1,
                'providerData.firstname': '$userData.firstname',
                'providerData._id': '$userData._id',
                'providerData.email': '$userData.email',
                'providerData.instantBooking': '$userData.instantBooking',
                'providerData.verifiedDate': '$userData.verifiedDate',
                'providerData.profileImage': '$userData.profileImage',
                cancellationPolicyId: '$userData.cancellationPolicyId',
                totalRatingCount: 1,
                totalReviewCount: 1
              }
            }
          ]
        }
        singleList = await List.aggregate(pipeline)
      } else {
        throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
      }
      privileges = await Privilege.getPrivileges(listingId) || {}
      const selectedCurrency: any = (req.query.currency) || null
      let exchangeData: { exchangeRate: any; toCode: any; toSymbol: any }

      try {
        exchangeData = await helper.getExchangeRate(selectedCurrency)
      } catch (error) {
        exchangeData = { exchangeRate: 1, toCode: 'USD', toSymbol: '$' } // Default values
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        multipleCurrency: exchangeData,
        listing: singleList,
        privileges: privileges.privilegeId,
        privilegeCategories: privileges.privilegeCategoryId,
        privilegeItems: privileges.privilegeItemId,
        cancellationPolicy: singleList.length != 0 ? policy : []
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


  static readonly singleListing = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let privileges: any
      const listingId = !req.params.listingId ? '' : new mongoose.Types.ObjectId(req.params.listingId)
      const policy = Config.cancelationPolicy
      let userId: any, singleList: any, pipeline: any

      const viewByAdmin = req.query.viewBy == 'admin'
      const matchStage = viewByAdmin ? { _id: listingId, softdel: false } : { _id: listingId, status: 'approve', availability: true, softdel: false }

      const listData = await List.findOne(matchStage).lean().exec()

      if (listData) {
        if (req.query.userId) {
          let query: any = req.query
          userId = new mongoose.Types.ObjectId(query.userId)
          pipeline = [
            {
              $match: { $and: [matchStage] }
            },
            {
              $lookup: {
                from: 'properties',
                localField: 'propertyType',
                foreignField: '_id',
                as: 'propertyTypeName'
              }
            },
            {
              $unwind: { path: '$propertyTypeName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'propertycategories',
                localField: 'propertyCategory',
                foreignField: '_id',
                as: 'propertyCategoryName'
              }
            },
            {
              $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'listingattachments',
                localField: '_id',
                foreignField: 'listingId',
                as: 'attachmentData'
              }
            },
            {
              $lookup: {
                from: 'listingpricings',
                localField: '_id',
                foreignField: 'listingId',
                as: 'priceData'
              }
            },
            // {
            //   $lookup: {
            //     from: 'amenities',
            //     localField: 'attachmentData.amenity',
            //     foreignField: '_id',
            //     as: 'amenities'
            //   }
            // },
            // {
            //   $lookup: {
            //     from: 'amenitycategories',
            //     localField: 'amenities.categoryId',
            //     foreignField: '_id',
            //     as: 'amenityCategories'
            //   }
            // },
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
                propertyTypeId: '$propertyTypeName._id',
                propertyTypeName: '$propertyTypeName.property',
                propertyCategoryId: '$propertyCategoryName._id',
                propertyCategoryName: '$propertyCategoryName.category',
                propertyName: 1,
                propertyDesc: 1,
                address: 1,
                guest: 1,
                accomodation: 1,
                status: 1,
                placesToOffer: 1,
                reviewRating: 1,
                schedule: 1,
                weeklySchedule: 1,
                dateOverrides: 1,
                // 'amenityCategories.category': 1,
                // 'amenityCategories.desc': 1,
                // 'amenityCategories._id': 1,
                // 'amenities.categoryId': 1,
                // 'amenities.name': 1,
                // 'amenities.desc': 1,
                // 'amenities.icon': 1,
                'attachmentData.image': 1,
                'attachmentData.rules': 1,
                'priceData.pricing': 1,
                'priceData.blockedDates': 1,
                'priceData.bookingType': 1,
                'priceData.dayPassPackages': 1,
                'providerData.firstname': '$userData.firstname',
                'providerData._id': '$userData._id',
                'providerData.email': '$userData.email',
                'providerData.verifiedDate': '$userData.verifiedDate',
                'providerData.profileImage': '$userData.profileImage',
                cancellationPolicyId: '$userData.cancellationPolicyId',
                totalRatingCount: 1,
                totalReviewCount: 1,
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
                from: 'properties',
                localField: 'propertyType',
                foreignField: '_id',
                as: 'propertyTypeName'
              }
            },
            {
              $unwind: { path: '$propertyTypeName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'propertycategories',
                localField: 'propertyCategory',
                foreignField: '_id',
                as: 'propertyCategoryName'
              }
            },
            {
              $unwind: { path: '$propertyCategoryName', preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: 'listingattachments',
                localField: '_id',
                foreignField: 'listingId',
                as: 'attachmentData'
              }
            },
            {
              $lookup: {
                from: 'listingpricings',
                localField: '_id',
                foreignField: 'listingId',
                as: 'priceData'
              }
            },
            // {
            //   $lookup: {
            //     from: 'amenities',
            //     localField: 'attachmentData.amenity',
            //     foreignField: '_id',
            //     as: 'amenities'
            //   }
            // },
            // {
            //   $lookup: {
            //     from: 'amenitycategories',
            //     localField: 'amenities.categoryId',
            //     foreignField: '_id',
            //     as: 'amenityCategories'
            //   }
            // },
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
              $addFields: {
                isBooking: false, 
                wishlist: false  
              }
            },
            {
              $project: {
                propertyTypeId: '$propertyTypeName._id',
                propertyTypeName: '$propertyTypeName.property',
                propertyCategoryId: '$propertyCategoryName._id',
                propertyCategoryName: '$propertyCategoryName.category',
                propertyName: 1,
                propertyDesc: 1,
                address: 1,
                guest: 1,
                accomodation: 1,
                status: 1,
                placesToOffer: 1,
                reviewRating: 1,
                schedule: 1,
                weeklySchedule: 1,
                dateOverrides: 1,
                // 'amenityCategories.category': 1,
                // 'amenityCategories.desc': 1,
                // 'amenityCategories._id': 1,
                // 'amenities.categoryId': 1,
                // 'amenities.name': 1,
                // 'amenities.desc': 1,
                // 'amenities.icon': 1,
                'attachmentData.image': 1,
                'attachmentData.rules': 1,
                'priceData.pricing': 1,
                'priceData.blockedDates': 1,
                'priceData.bookingType': 1,
                'priceData.dayPassPackages': 1,
                'providerData.firstname': '$userData.firstname',
                'providerData._id': '$userData._id',
                'providerData.email': '$userData.email',
                'providerData.verifiedDate': '$userData.verifiedDate',
                'providerData.profileImage': '$userData.profileImage',
                cancellationPolicyId: '$userData.cancellationPolicyId',
                totalRatingCount: 1,
                totalReviewCount: 1,
                isBooking: 1, 
                wishlist: 1 
              }
            }
          ]
        }
        singleList = await List.aggregate(pipeline)
        privileges = await Privilege.getPrivileges(listingId)|| {}
        if (!singleList) throw new CustomError.BadRequestError('LISTING_IS_EMPTY')
      } else throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      const selectedCurrency: any = (req.query.currency) || null
      let exchangeData: { exchangeRate: any; toCode: any; toSymbol: any }

      try {
        exchangeData = await helper.getExchangeRate(selectedCurrency)
      } catch (error) {
        exchangeData = { exchangeRate: 1, toCode: 'USD', toSymbol: '$' } // Default values
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        multipleCurrency: exchangeData,
        listing: singleList,
        privileges: privileges.privilegeId,
        privilegeCategories: privileges.privilegeCategoryId,
        privilegeItems: privileges.privilegeItemId,
        cancellationPolicy: singleList.length != 0 ? policy : []
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

  static readonly multipleListings = async (req: AuthenticateRequest, res: Response) => {
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
      let findOrCondition: any[] = [
        // { "address.city": { $regex: query.place || "" } },
        // { "address.state": { $regex: query.place || "" } },
        // { "address.country": { $regex: query.place || "" } }
      ]

      let instantBooking = query.instantBooking == 'true'

      if (query.propertyCategory) {
        const category = await Category.findOne({_id:query.propertyCategory});
        if (!category?.isAll) findAndCondition.push({ 'propertyCategoryName._id': new mongoose.Types.ObjectId(query.propertyCategory) });
      }
      //!query.propertyCategory ? '' : findAndCondition.push({ 'propertyCategoryName._id': new mongoose.Types.ObjectId(query.propertyCategory) })
      !query.propertyType ? '' : findAndCondition.push({ propertyType: new mongoose.Types.ObjectId(query.propertyType) })
      !query.instantBooking ? '' : findAndCondition.push({ 'userData.instantBooking': instantBooking })
      // !query.coordinates ? "" : findAndCondition.push({ "address.coordinates": { $in: query.coordinates.slice(1, -1).split(',').map(parseFloat) } });
      !query.bathRoom ? '' : findAndCondition.push({ 'accomodation.bathRoom.bathRoomCount': Number(query.bathRoom) })
      !query.bedRoom ? '' : findAndCondition.push({ 'accomodation.bedRoomCount': Number(query.bedRoom) })
      //!query.amenities ? '' : findAndCondition.push({ 'attachmentData.amenity': { $in: query.amenities.slice(1, -1).split(',').map((str: any) => new mongoose.Types.ObjectId(str)) } })
      !query.adult ? '' : findAndCondition.push({ $expr: { $gte: [{ $toInt: "$guest.adult" }, Number(query.adult)] } })
      !query.children ? '' : findAndCondition.push({ $expr: { $gte: [{ $toInt: "$guest.children" }, Number(query.children)] } })
      !query.pets ? '' : findAndCondition.push({  $expr: { $gte: [{ $toInt: "$guest.pets" }, Number(query.pets)] } })
      !query.startDate && !query.endDate ? '' : findAndCondition.push({
          $nor: [
            {
              'priceData.blockedDates': {
                $elemMatch: {
                  $or: [
                    {
                      start: { $lte: new Date(query.endDate) }, 
                      end: { $gte: new Date(query.startDate) }
                    },
                    {
                      start: { $gte: new Date(query.startDate) },
                      end: { $lte: new Date(query.endDate) }
                    }
                  ]
                }
              }
            }
          ]
        });
      !query.maxPrice || !query.minPrice ? 0 : findAndCondition.push({ 'priceData.pricing.perDay': { $gte: Number(query.minPrice), $lte: Number(query.maxPrice) } })
      findAndCondition.push(
        { status: 'approve' },
        { availability: true },
        { softdel: false },
        { 'userData.softdel': false },
        { 'userData.isActive': true }
      )

      // Calculate the number of nights
      let nights = 0
      if (query.startDate && query.endDate) {
        const startDate = new Date(query.startDate)
        const endDate = new Date(query.endDate)
        nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
      }

      // Add condition for maximumNight
      if (nights > 0) {
        findAndCondition.push({
          'priceData.bookingType.maximumNight': { $gte: nights }
        })
      }

      if (query.privileges) {
        const privilegesCondition = await Privilege.getModulesByPrivileges(query.privileges);
        if (privilegesCondition) findAndCondition.push(privilegesCondition);
      }

      let requestRadius = req.query.requestRadius ? req.query.requestRadius : Config.requestRadius
      let maxDistanceInMeter = Number(requestRadius) * 1609
      let pipeline: any, pipeline1: any, userId
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
      } else {
        pipeline = {
          $match: {}
        }
      }

      if (req.query.userId) {
        let query: any = req.query
        userId = new mongoose.Types.ObjectId(query.userId)
        // !query.userId ? "" : findAndCondition.push({ "userId": { '$not': { '$eq': new mongoose.Types.ObjectId(query.userId) } } });
        pipeline1 = [
          pipeline,
          {
            $lookup: {
              from: 'listingpricings',
              localField: '_id',
              foreignField: 'listingId',
              as: 'priceData'
            }
          },
          {
            $unwind: {
              path: '$priceData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'properties',
              localField: 'propertyType',
              foreignField: '_id',
              as: 'propertyTypeName'
            }
          },
          {
            $unwind: {
              path: '$propertyTypeName',
              preserveNullAndEmptyArrays: true
            }
          },

          {
            $lookup: {
              from: 'propertycategories',
              localField: 'propertyCategory',
              foreignField: '_id',
              as: 'propertyCategoryName'
            }
          },
          {
            $unwind: {
              path: '$propertyCategoryName',
              preserveNullAndEmptyArrays: true
            }
          },

          {
            $lookup: {
              from: 'listingattachments',
              localField: '_id',
              foreignField: 'listingId',
              as: 'attachmentData'
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
            $sort: { '_id': -1 },
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
              propertyTypeName: '$propertyTypeName.property',
              propertyCategoryName: '$propertyCategoryName.category',
              'attachmentData.image': 1,
              'attachmentData.rules': 1,
              propertyName: 1,
              propertyDesc: 1,
              address: 1,
              status: 1,
              priceData: 1,
              'userData._id': 1,
              'userData.firstname': 1,
              'userData.instantBooking': 1,
              totalRatingCount: 1,
              totalReviewCount: 1
            }
          },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              minPrice: [{ $group: { _id: null, minPrice: { $min: '$priceData.pricing.perDay' } } }],
              maxPrice: [{ $group: { _id: null, maxPrice: { $max: '$priceData.pricing.perDay' } } }],
              listings: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ]
      } else {
        pipeline1 = [
          pipeline,
          {
            $lookup: {
              from: 'listingpricings',
              localField: '_id',
              foreignField: 'listingId',
              as: 'priceData'
            }
          },
          {
            $unwind: {
              path: '$priceData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'properties',
              localField: 'propertyType',
              foreignField: '_id',
              as: 'propertyTypeName'
            }
          },
          {
            $unwind: {
              path: '$propertyTypeName',
              preserveNullAndEmptyArrays: true
            }
          },

          {
            $lookup: {
              from: 'propertycategories',
              localField: 'propertyCategory',
              foreignField: '_id',
              as: 'propertyCategoryName'
            }
          },
          {
            $unwind: {
              path: '$propertyCategoryName',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'listingattachments',
              localField: '_id',
              foreignField: 'listingId',
              as: 'attachmentData'
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
            $sort: { '_id': -1 },
          },
          {
            $project: {
              propertyTypeName: '$propertyTypeName.property',
              propertyCategoryName: '$propertyCategoryName.category',
              'attachmentData.image': 1,
              'attachmentData.rules': 1,
              propertyName: 1,
              propertyDesc: 1,
              address: 1,
              status: 1,
              priceData: 1,
              'userData._id': 1,
              'userData.firstname': 1,
              'userData.instantBooking': 1,
              totalRatingCount: 1,
              totalReviewCount: 1
            }
          },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              minPrice: [{ $group: { _id: null, minPrice: { $min: '$priceData.pricing.perDay' } } }],
              maxPrice: [{ $group: { _id: null, maxPrice: { $max: '$priceData.pricing.perDay' } } }],
              listings: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ]
      }
      console.log(findAndCondition)
      let approvedListing = await List.aggregate(pipeline1)

      const selectedCurrency: any = (req.query.currency) || null
      let exchangeData: { exchangeRate: any; toCode: any; toSymbol: any }

      try {
        exchangeData = await helper.getExchangeRate(selectedCurrency)
      } catch (error) {
        exchangeData = { exchangeRate: 1, toCode: 'USD', toSymbol: '$' } // Default values
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        filterCount: queryParamCount,
        totalCount: approvedListing[0]?.totalCount[0]?.total,
        multipleCurrency: exchangeData,
        approvedListing: approvedListing[0]?.listings,
        minPrice: approvedListing[0]?.minPrice[0]?.minPrice,
        maxPrice: approvedListing[0]?.maxPrice[0]?.maxPrice,
        defaultMinPrice: approvedListing[0]?.minPrice[0]?.minPrice-1,
        defaultMaxPrice: approvedListing[0]?.maxPrice[0]?.maxPrice+1
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


  static readonly featureListings = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await List.aggregate([
        {
          $match: {
            $and: [{ softdel: false }, { status: 'approve' }]
          }
        },
        {
          $lookup: {
            from: 'listingpricings',
            localField: '_id',
            foreignField: 'listingId',
            as: 'priceData'
          }
        },
        {
          $unwind: '$priceData'
        },
        {
          $lookup: {
            from: 'listingattachments',
            localField: '_id',
            foreignField: 'listingId',
            as: 'attachmentData'
          }
        },
        {
          $unwind: '$attachmentData'
        },
        {
          $project: {
            address: 1,
            propertyName: 1,
            propertyDesc: 1,
            status: 1,
            totalRatingCount: 1,
            totalReviewCount: 1,
            price: '$priceData.pricing',
            Image: '$attachmentData.image',
            createdAt: 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      const selectedCurrency: any = (req.query.currency) || null
      let exchangeData: { exchangeRate: any; toCode: any; toSymbol: any }

      try {
        exchangeData = await helper.getExchangeRate(selectedCurrency)
      } catch (error) {
        exchangeData = { exchangeRate: 1, toCode: 'USD', toSymbol: '$' } // Default values
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { multipleCurrency: exchangeData, featureListings: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly todayMenu = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let startDate = moment().startOf('day').format('yyyy-MM-DD' + 'T' + 'HH:mm:ss').toString()
      let endDate = moment().endOf('day').format('yyyy-MM-DD' + 'T' + 'HH:mm:ss').toString()

      let checkingOut = await Booking.find({
        $and: [
          { providerId: new mongoose.Types.ObjectId(req.auth.userId) },
          { status: 'booked' },
          { 'bookedDates.end': { $gte: startDate, $lte: endDate } }
        ]
      }).count()
      let arrivingSoon = await Booking.find({
        $and: [
          { providerId: new mongoose.Types.ObjectId(req.auth.userId) },
          { status: 'booked' },
          { 'bookedDates.start': { $gte: startDate } }
        ]
      }).count()

      let reservation = {
        checkingOut: checkingOut,
        arrivingSoon: arrivingSoon
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { reservation: reservation }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteListing = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }

    try {
      const { auth, params: { listingId } } = req
      const userId = auth.role === Constants.userRole.USER ? auth.userId : req.body.userId
      
      if (!userId) throw new CustomError.BadRequestError('USER_ID_REQUIRED')

      if (Config.hiddenSettings.mode === '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_TEST_MODE', [])
      const updateData = { softdel: true }
      const data = await List.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(listingId),
          userId: new mongoose.Types.ObjectId(userId),
          softdel: false
        },
        updateData,
        { new: true }
      ).exec()

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')

      const isAdmin = auth.role !== Constants.userRole.USER
      const notificationMessage = isAdmin
          ? `Your listing ${data.propertyName} has been removed by admin`
          : `Your listing ${data.propertyName} has been removed by you`

      const notifiData = {
        forWhom: data.userId,
        message: notificationMessage,
        fromWhom: isAdmin ? 'ADMIN' : 'USER',
        userType: 'PROVIDER',
        title: 'Listing Removed',
        link: '',
        image: ''
      }

      await NotificationController.notification(notifiData)


      // RESPONSE
      response.message = 'DETAILS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { listing: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  //listing status
  static readonly publishListing = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let listingId = req.params.listingId;

      let listingData = await ListingPricing.findOne({ listingId: listingId }).lean().exec()
      if (!listingData) throw new CustomError.BadRequestError('COMPLETE_YOUR_LISTING')

      let userData = await User.findOne({ _id: new mongoose.Types.ObjectId(req.auth.userId), verified: true }).lean().exec()
      if (!userData) throw new CustomError.BadRequestError('PROVIDER_NOT_VERIFIED_BY_ADMIN')

      let statusCheck: any = await this.listingData(listingId)
      if (statusCheck.status == 'publish') throw new CustomError.BadRequestError('LISTING_PUBLISHED_ALREADY')

      let updateStaus = await List.findOneAndUpdate({ _id: listingData.listingId, status: 'pending' }, { status: 'publish' }).lean().exec()

      if (!updateStaus) {
        throw new CustomError.BadRequestError('ADMIN_DECLINED_YOUR_LISTING CONTACT_ADMIN')
      } else {
        let notifiData = {
          forWhom: req.auth.userId,
          message: updateStaus.propertyName + ' published By ' + userData.firstname,
          fromWhom: 'PROVIDER',
          userType: 'ADMIN',
          title: 'listing published',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)
      }


      // RESPONSE
      response.message = 'DETAILS_PUBLISHED'
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


  static readonly approveAndDeclineListing = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let listingId = req.params.listingId,
        body = req.body,
        data: any,
        find: any,
        update: any;

      let statusCheck = await List.findOne({ _id: listingId }).lean().exec()
      if (!statusCheck) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

        if(body.status !== 'approve') throw new Error("STATUS_NOT_APPROVE")

        if (statusCheck.status == 'approve') throw new CustomError.BadRequestError('LISTING_IS_ALREADY_APPROVED')

        update = { $addToSet: { events: { title: 'listing approved' } }, status: 'approve' }

        find = {
          _id: listingId,
          $or: [{ status: 'publish' }, { status: 'decline' }]
        }

        let notifiData = {
          forWhom: statusCheck.userId,
          message: 'your listing ' + statusCheck.propertyName + ' approved by admin',
          fromWhom: 'ADMIN',
          userType: 'PROVIDER',
          title: 'listing approved',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)

        data = await List.findOneAndUpdate(find, update, { new: true })
        if (!data) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

        let userData = await User.findById(data.userId).lean().exec()
        let mailData = { listingId: listingId }
        await Mail.sendMail(userData.email, mailData, 'listingAproved')

        response.message = 'LISTING_APPROVED'
      if (body.status == 'decline') {
        if (!body.reason) throw new CustomError.BadRequestError('DECLINE_REASON_REQUIRED')
        if (statusCheck.status == 'decline') throw new CustomError.BadRequestError('LISTING_DECLINED_ALREADY')

        update = {
          $addToSet: { events: { title: 'listing declined', desc: body.reason } },
          status: 'decline'
        }

        find = {
          _id: listingId,
          $or: [{ status: 'publish' }, { status: 'approve' }]
        }

        let notifiData = {
          forWhom: statusCheck.userId,
          message: 'your listing ' + statusCheck.propertyName + ' declined by admin ',
          fromWhom: 'ADMIN',
          userType: 'PROVIDER',
          title: 'listing declined',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)

        data = await List.findOneAndUpdate(find, update, { new: true })
        if (!data) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

        let userData = await User.findById(data.userId).lean().exec()
        let mailData = { listingId: listingId }
        await Mail.sendMail(userData.email, mailData, 'listingDeclined')

        response.message = 'LISTING_DECLINED'
      }


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.data = { listing: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  //cancellation policy
  static readonly cancellationPolicy = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth,
        data: any,
        body = req.body,
        listingId = req.query.listingId
      if(!listingId) throw new CustomError.BadRequestError('LISTING_ID_IS_REQUIRED')
      if (!body.cancellationPolicyId) throw new CustomError.BadRequestError('CANCELLATION_POLICY_ID_IS_REQUIRED')
      if (req.auth.role == Constants.userRole.ADMIN) {
          data = await List.findOneAndUpdate(
            { _id:listingId },
            { cancellationPolicyId: body.cancellationPolicyId },
            { new: true }
          ).exec()
        } else {
          data = await List.findOneAndUpdate(
            {_id:listingId },
            { cancellationPolicyId: body.cancellationPolicyId },
            { new: true, upsert: true }
          ).exec()
        }

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { policies: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listCancellationPolicy = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let configData = JSON.parse(JSON.stringify(Config)),
        policies = configData.cancelationPolicy


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { policies: policies }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  //reviews and rating
  static readonly reviewsAndRating = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        auth = req.auth,
        listingId = req.params.listingId,
        bookingId = req.params.bookingId,
        data: any,
        update: any
      if (!body.type) throw new CustomError.BadRequestError('TYPE_REQUIRED')
      let listingData: any = await this.listingData(listingId)
      let userData = await User.findOne({ _id: auth.userId }).exec()
      if(body.reviewId){
      if (auth.role == Constants.userRole.USER && body.type == 'provider' || auth.role == Constants.userRole.ADMIN && body.type == 'admin') {
        if (!body.response || !body.reviewId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

        let userId = ''

        if (auth.role == Constants.userRole.USER) userId = auth.userId
        else userId = listingData.reviewRating.map((e: { userId: Object }) => e.userId == auth.userId)
        if (userId == '' || !userId) throw new CustomError.BadRequestError('USER_ID_REQUIRED')

        update = {
          response: body.response,
          userType: auth.role,
          userId: new mongoose.Types.ObjectId(auth.userId)
        }

        data = await List.findOneAndUpdate(
          { 'reviewRating._id': body.reviewId },
          { $push: { 'reviewRating.$.reply': update } },
          { new: true, upsert: true }
        ).exec()
        console.log(data)
        let findUser = await List.findOne({ 'reviewRating._id': body.reviewId }).exec()
        if (data) {
          let notifiData = {
            forWhom: findUser.reviewRating[0].userId,
            message: `Your Review in '${listingData.propertyName}' has been responded by host`,
            fromWhom: `${auth.role}`,
            userType: 'USER',
            title: 'Review And Rating',
            link: '',
            image: ''
          }
          await NotificationController.notification(notifiData)
        }
      }
    }
    else if (auth.role == Constants.userRole.USER && body.type == 'user' || auth.role == Constants.userRole.ADMIN && body.type == 'admin') {
        update = {
          review: body.review,
          rating: {
            Cleanliness: body.Cleanliness ? parseInt(body.Cleanliness) : 0,
            Accuracy: body.Accuracy ? parseInt(body.Accuracy) : 0,
            Communication: body.Communication ? parseInt(body.Communication) : 0,
            Location: body.Location ? parseInt(body.Location) : 0,
            Check_in: body.CheckIn ? parseInt(body.CheckIn) : 0,
            Value: body.Value ? parseInt(body.Value) : 0
          },
          userId: new mongoose.Types.ObjectId(auth.userId),
          bookingId: bookingId,
          isReviewed: true
        }

        data = await List.findOneAndUpdate(
          { _id: listingId },
          { $push: { reviewRating: update } },
          { new: true, upsert: true }
        ).exec();
        console.log(data)
        let pipeline = [
          {
            $match: { _id: new mongoose.Types.ObjectId(listingId) }
          },
          {
            $addFields: {
              rateCount: { $size: '$reviewRating' }
            }
          },
          {
            $addFields: {
              totalCleanlinessRate: {
                $divide: [{ $sum: ['$reviewRating.rating.Cleanliness'] }, '$rateCount']
              },
              totalAccuracyRate: {
                $divide: [{ $sum: ['$reviewRating.rating.Accuracy'] }, '$rateCount']
              },

              totalCommunicationRate: {
                $divide: [{ $sum: ['$reviewRating.rating.Communication'] }, '$rateCount']
              },

              totalLocationRate: {
                $divide: [{ $sum: ['$reviewRating.rating.Location'] }, '$rateCount']
              },
              totalValueRate: {
                $divide: [{ $sum: ['$reviewRating.rating.Value'] }, '$rateCount']
              },
              totalCheckInRate: {
                $divide: [{ $sum: ['$reviewRating.rating.Check_in'] }, '$rateCount']
              }
            }
          },
          {
            $addFields: {
              totalRatings: {
                $divide: [
                  {
                    $sum: [
                      '$totalCleanlinessRate',
                      '$totalAccuracyRate',
                      '$totalCommunicationRate',
                      '$totalLocationRate',
                      '$totalValueRate',
                      '$totalCheckInRate'
                    ]
                  },
                  6
                ]
              }
            }
          },
          // {
          //     $match: {
          //         reviewRating: {
          //             $elemMatch: {
          //                 review: { $ne: "" }
          //             }
          //         }
          //     }
          // },
          {
            $addFields: {
              totalReviews: {
                $size: {
                  $filter: {
                    input: '$reviewRating',
                    as: 'review',
                    cond: { $ne: ['$$review.review', ''] }
                  }
                }
              }
            }
          },
          {
            $addFields: {
              totalCleanlinessRate: '$totalCleanlinessRate',
              totalAccuracyRate: '$totalAccuracyRate',
              totalCommunicationRate: '$totalCommunicationRate',
              totalLocationRate: '$totalLocationRate',
              totalValueRate: '$totalValueRate',
              totalCheckInRate: '$totalCheckInRate',
              totalRatingCount: '$totalRatings',
              totalReviewCount: '$totalReviews'
            }
          },
          {
            $project: {
              reviewRating: 1,
              totalCleanlinessRate: 1,
              totalAccuracyRate: 1,
              totalCommunicationRate: 1,
              totalLocationRate: 1,
              totalValueRate: 1,
              totalCheckInRate: 1,
              totalRatingCount: 1,
              totalReviewCount: 1
            }
          }
        ]
        let getCount = await List.aggregate(pipeline)
        let updateCount = {
          totalCleanlinessRate: await helper.fixedNum(getCount[0].totalCleanlinessRate),
          totalAccuracyRate: await helper.fixedNum(getCount[0].totalAccuracyRate),
          totalCommunicationRate: await helper.fixedNum(getCount[0].totalCommunicationRate),
          totalLocationRate: await helper.fixedNum(getCount[0].totalLocationRate),
          totalValueRate: await helper.fixedNum(getCount[0].totalValueRate),
          totalCheckInRate: await helper.fixedNum(getCount[0].totalCheckInRate),
          totalRatingCount: await helper.fixedNum(getCount[0].totalRatingCount),
          totalReviewCount: await helper.fixedNum(getCount[0].totalReviewCount)
        }
        data = await List.findByIdAndUpdate(listingId, { $set: updateCount }, { new: true, upsert: true }).exec()
        if (data) {
          let notifiData = {
            forWhom: listingData.userId,
            message:
              'Your Listing ' + listingData.propertyName + ' reviewed and rated by ' + userData.firstname,
            fromWhom: 'USER',
            userType: 'PROVIDER',
            title: 'Review And Rating',
            link: '',
            image: ''
          }
          await NotificationController.notification(notifiData)
        }
      }


      // RESPONSE
      response.message = 'REVIEW_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { reviewAndRating: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listReviewsAndRating = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let query = req.query
      let listingId = req.params.listingId || ''
      let listData = await List.findOne({ _id: listingId }).lean().exec()
      if (!listData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')
      let pageQuery: any = await this.paginationBuilder(req.query)
      let like = { 'reviewRating.review': { $regex: query.search || '', $options: 'i' } }
      let reviewAndRating = await List.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(listingId) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'providerData'
          }
        },
        { $unwind: '$reviewRating' },
        {
          $lookup: {
            from: 'users',
            localField: 'reviewRating.userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        { $unwind: '$userData' },
        { $sort: { 'reviewRating.dateOfReview': -1 } },
        { $match: like },
        {
          $project: {
            reviewRating: 1,
            userFirstname: '$userData.firstname',
            userLastname: '$userData.lastname',
            userId: '$userData._id',
            userProfileImage: '$userData.profileImage'
            // "providerData.profileImage": 1,
            // "providerData.firstname": 1,
            // "providerData._id": 1,
          }
        },
        // {
        //     $group: {
        //         _id: "_id",
        //         'documents': {
        //             '$push': {
        //                 'userId': '$userData._id',
        //                 'firstname': '$userData.firstname',
        //                 'profileImage': '$userData.profileImage',
        //                 'reviewRating': "$reviewRating",
        //             }
        //         }
        //     }
        // },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            rating: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])


      // RESPONSE
      response.message = 'REVIEW_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: reviewAndRating[0]?.totalCount[0]?.total,
        reviewAndRating: reviewAndRating[0]?.rating
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


  static readonly providerReviews = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let pageQuery: any = await this.paginationBuilder(req.query)
      let like = {
        $or: [
          { propertyName: { $regex: req.query.search || '', $options: 'i' } },
          { 'review.review': { $regex: req.query.search || '', $options: 'i' } }
        ]
      }

      let userData = await User.findOne({ _id: req.auth.userId, softdel: false }).lean().exec()
      if (!userData) throw new CustomError.BadRequestError('PROVIDER_NOT_FOUND')

      let providerListingReviews = await List.aggregate([
        {
          $match: {
            $and: [
              { softdel: false },
              { status: 'approve' },
              { userId: new mongoose.Types.ObjectId(req.auth.userId) }
            ]
          }
        },
        {
          $lookup: {
            from: 'listingattachments',
            localField: '_id',
            foreignField: 'listingId',
            as: 'attachmentData'
          }
        },
        {
          $unwind: '$attachmentData'
        },
        {
          $addFields: {
            userReviews: {
              $filter: {
                input: '$reviewRating',
                as: 'review',
                cond: {
                  $ne: ['$$review.review', '']
                }
              }
            }
          }
        },
        {
          $addFields: {
            review: {
              $arrayElemAt: [
                '$userReviews',
                {
                  $subtract: [{ $size: '$userReviews' }, 1]
                }
              ]
            }
          }
        },
        {
          $sort: {
            'review.dateOfReview': -1
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'review.userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        { $match: like },
        {
          $project: {
            listingId: '$_id',
            propertyName: 1,
            coverImage: '$attachmentData.image.coverImage',
            groupImage: '$attachmentData.image.groupImage',
            totalRatingCount: 1,
            totalReviewCount: 1,
            review: '$review',
            userName: '$user.firstname',
            userProfile: '$user.profileImage'
          }
        },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            review: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])


      // RESPONSE
      response.message = 'REVIEW_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: providerListingReviews[0]?.totalCount[0]?.totalCount,
        reviews: providerListingReviews[0]?.review
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


  static readonly viewSingleReview = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const reviewId = req.params.reviewId
      let ReviewData = await List.findOne(
        { 'reviewRating._id': new mongoose.Types.ObjectId(reviewId) },
        //{ reviewRating: 1 }
        { reviewRating: { $elemMatch: { _id: new mongoose.Types.ObjectId(reviewId) } } }
      ).lean().exec()

      if (!ReviewData) {
        response.message = 'REVIEW_NOT_FOUND'
        response.status = true
        response.statusCode = 200
        response.data = {}
      }
      else {
        // RESPONSE
        response.message = 'REVIEW_LISTED'
        response.status = true
        response.statusCode = 200
        response.data = { listingReview: ReviewData }
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


  static readonly viewUserReview = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { listingId, bookingId } = req.params
      if (!mongoose.Types.ObjectId.isValid(listingId)) throw new CustomError.BadRequestError('INVALID_LISTING_ID');
      if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new CustomError.BadRequestError('INVALID_BOOKING_ID')
      const userId = req.auth.userId

      let userReview = await List.findOne(
        {
          _id: listingId,
          'reviewRating.bookingId': bookingId
        },
        {
          reviewRating: {
            $filter: {
              input: '$reviewRating',
              as: 'review',
              cond: {
                $and: [
                  { $eq: ['$$review.userId', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$$review.bookingId', new mongoose.Types.ObjectId(bookingId)] },
                ],
              },
            },
          },
        }
      ).lean().exec();

      if (userReview) {
        response.message = 'USER_REVIEW_LISTED';
        response.status = true;
        response.statusCode = 200;
        response.data = { listingReview: userReview.reviewRating[0] };
      } else {
        response.message = 'USER_REVIEW_NOT_FOUND';
        response.status = true;
        response.statusCode = 200;
        response.data = { listingReview: [] };
      }
    }
    catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly addToWishList = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth,
        listingId = req.body.listingId,
        collectionId = req.body.collectionId
      if (!listingId) throw new CustomError.BadRequestError('LISTING_ID_IS_REQUIRED')
      await this.listingData(listingId)

      let wishListed: any = await WishList.findOne({ collectionData: { $in: [listingId] }, userId: new mongoose.Types.ObjectId(auth.userId) }).lean().exec()

      if (collectionId) {
        let listingExists = await WishList.findOne({
          _id: new mongoose.Types.ObjectId(collectionId),
          collectionData: listingId
        })
        if (listingExists) throw new CustomError.BadRequestError('LISTING_ID_ALREADY_EXISTS_IN_THE_SPECIFIED_COLLECTION')
        let addWishlist = await WishList.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(collectionId) },
          {
            $push: {
              collectionData: listingId
            }
          },
          { new: true }
        ).exec()

        response.message = 'SAVED_TO_YOUR_COLLECTION'
        response.data = { wishList: addWishlist }
      } else if(!wishListed || wishListed == '') {
          let collectionName = req.body.collectionName
          if (!collectionName) throw new CustomError.BadRequestError('COLLECTION_NAME_REQUIRED')

          let newDoc = new WishList()
          newDoc.collectionName = collectionName
          newDoc.collectionData = [new mongoose.Types.ObjectId(listingId)]
          newDoc.userId = new mongoose.Types.ObjectId(auth.userId)
          let data = await newDoc.save()

          response.message = 'WISHLIST_ADDED'
          response.data = { wishList: data }
        } else {
          let removeWishList = await WishList.findOneAndUpdate(
            { collectionData: { $in: [listingId] }, userId: auth.userId },
            {
              $pull: {
                collectionData: listingId
              }
            },
            { new: true }
          ).exec()

          response.message = 'WISHLIST_REMOVED'
          response.data = { wishList: removeWishList }
        }

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


  static readonly getWishListCollection = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let wishListed: any = await WishList.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.auth.userId)
          }
        },
        {
          $unwind: {
            path: '$collectionData',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'listingattachments',
            localField: 'collectionData',
            foreignField: 'listingId',
            as: 'img'
          }
        },
        {
          $unwind: {
            path: '$img',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            documents: {
              $push: {
                img: '$img.image.coverImage',
                collectionName: '$collectionName'
              }
            }
          }
        },
        {
          $addFields: {
            data: {
              $last: '$documents'
            }
          }
        },
        {
          $project: {
            data: 1
          }
        }
      ])


      // RESPONSE
      response.message = 'WISHLIST_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { collections: wishListed }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getWishList = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let wishListed: any

      if (req.params.collectionId) {
        let wishLists = await WishList.findById(req.params.collectionId).lean().exec()
        if (!wishLists) throw new CustomError.BadRequestError('COLLECTION_NOT_FOUND')
        wishListed = await WishList.aggregate([
          {
            $match: {
              $and: [
                {
                  userId: new mongoose.Types.ObjectId(req.auth.userId)
                },
                {
                  _id: new mongoose.Types.ObjectId(req.params.collectionId)
                }
              ]
            }
          },
          {
            $unwind: {
              path: '$collectionData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'listingattachments',
              localField: 'collectionData',
              foreignField: 'listingId',
              as: 'attachments'
            }
          },
          {
            $unwind: {
              path: '$attachments',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'listings',
              localField: 'collectionData',
              foreignField: '_id',
              as: 'listingData'
            }
          },
          {
            $unwind: {
              path: '$listingData',
              preserveNullAndEmptyArrays: false
            }
          },
          {
            $match: {
              'listingData.softdel': false,
              'listingData.availability': true,
              'listingData.status': 'approve'
            }
          },
          {
            $lookup: {
              from: 'listingpricings',
              localField: 'collectionData',
              foreignField: 'listingId',
              as: 'priceData'
            }
          },
          {
            $unwind: {
              path: '$priceData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'propertycategories',
              localField: 'listingData.propertyCategory',
              foreignField: '_id',
              as: 'propertyCategoryDetails'
            }
          },
          {
            $unwind: {
              path: '$propertyCategoryDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 1,
              listingId: '$listingData._id',
              collectionName: 1,
              address: '$listingData.address',
              categoryName: '$propertyCategoryDetails.category',
              listingName: '$listingData.propertyName',
              listingDesc: '$listingData.propertyDesc',
              status: '$listingData.status',
              rating: '$listingData.totalRatingCount',
              review: '$listingData.totalReviewCount',
              price: '$priceData.pricing',
              image: '$attachments.image',
              createdAt: 1
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ])
        if (wishListed == '') throw new CustomError.BadRequestError('WISHLIST_IS_EMPTY')
      } else {
        wishListed = await WishList.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(req.auth.userId)
            }
          },
          {
            $addFields: {
              collectionDataCount: { $size: '$collectionData' }
            }
          },
          {
            $unwind: {
              path: '$collectionData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'listings',
              localField: 'collectionData',
              foreignField: '_id',
              as: 'listingData'
            }
          },
          {
            $unwind: {
              path: '$listingData',
              preserveNullAndEmptyArrays: false
            }
          },
          {
            $match: {
              'listingData.softdel': false,
              'listingData.availability': true,
              'listingData.status': 'approve'
            }
          },
          {
            $lookup: {
              from: 'listingattachments',
              localField: 'collectionData',
              foreignField: 'listingId',
              as: 'img'
            }
          },
          {
            $unwind: {
              path: '$img',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: '$_id',
              collectionDataCount: { $sum: 1 },
              documents: {
                $push: {
                  img: '$img.image.coverImage',
                  collectionName: '$collectionName',
                }
              }
            }
          },
          {
            $addFields: {
              data: {
                $last: '$documents'
              }
            }
          },
          {
            $project: {
              data: 1,
              collectionDataCount: 1
            }
          },
          {
            $sort: {
              _id: 1
            }
          }
        ])
      }


      // RESPONSE
      response.message = 'WISHLIST_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { wishLists: wishListed }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly removeWishListCollection = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth,
        collectionId = new mongoose.Types.ObjectId(req.params.collectionId)

      let data = await WishList.findOneAndRemove({ _id: collectionId, userId: new mongoose.Types.ObjectId(auth.userId) }).lean().exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'WISHLIST_COLLECTION_REMOVED'
      response.data = {}
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


  static readonly updateWishListCollection = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth,
        collectionId = req.params.collectionId

      if (!req.body.collectionName) throw new CustomError.BadRequestError('COLLECTION_NAME_REQUIRED')

      let data = await WishList.findOneAndUpdate(
        { _id: collectionId, userId: new mongoose.Types.ObjectId(auth.userId) },
        { collectionName: req.body.collectionName }
      ).lean().exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'WISHLIST_COLLECTION_UPDATED'
      response.data = {}
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


  // static listingsWishlistStatus = async (req: AuthenticateRequest, res: Response) => {
  //     let response = {
  //         message: "Unprocessable Entity",
  //         statusCode: 500,
  //         status: false,
  //         data: {},
  //         validation: {}
  //     }
  //     try {
  //         let listingId = req.params.listingId || "",
  //             auth = req.auth;

  //         let data: any = await wishList.findOne({ "collectionData": { $in: [listingId] }, userId: auth.userId }).lean().exec();
  //         if (!data) {
  //             response.wishlist = false;
  //         } else {
  //             response.wishlist = true;
  //         }
  //         response.message = "DETAILS_LISTED";
  //         response.status = true;
  //         response.statusCode = 200;
  //         response.data = data;

  //     } catch (error) {
  //         console.log("Error \n", error);
  //         response.status = false;
  //         response.message = error.message || response.message;
  //         response.validation = error?.cause?.reasons || {};
  //         response.statusCode = error?.cause?.statusCode || response.statusCode;

  //     }
  //     return res.status(response.statusCode || 500).json(response).end();
  // }


  static readonly providerCalender = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let blockedDates = await List.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.auth.userId)
          }
        },
        {
          $lookup: {
            from: 'listingpricings',
            localField: '_id',
            foreignField: 'listingId',
            as: 'bolckedDatesData'
          }
        },
        {
          $unwind: { path: '$bolckedDatesData', preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            _id: 1,
            propertyName: 1,
            userId: 1,
            bolckedDates: '$bolckedDatesData.blockedDates'
          }
        }
      ])


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { providerCalender: blockedDates }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  //discounts and offers
  static readonly discountAndOffers = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body
      // validation
      let validation = await ListValidator.validateData(body , "offer")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let newDoc = new Offers()
      if (req.file) {
        req.file.path = await helper.getFilePath(req.file.path)
      }

      newDoc.title = body.title
      newDoc.desc = body.desc
      newDoc.percentage = body.percentage
      newDoc.code = body.code
      newDoc.file = !req.file ? '' : req.file.path
      newDoc.startDate = body.startDate
      newDoc.endDate = body.endDate
      let data = await newDoc.save()


      // RESPONSE
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { discounts: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listDiscount = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let pageQuery: any = await this.paginationBuilder(req.query)
      let like = { code: { $regex: req.query.search || '', $options: 'i' } }
      let discount: any
      if (req.params.id) {
        discount = await Offers.findById(req.params.id).lean().exec()
        if (!discount) throw new CustomError.BadRequestError('DISCOUNT_NOT_FOUND')
      } else {
        discount = await Offers.aggregate([
          { $match: like },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              discount: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])

        if (!discount || discount.length == 0) throw new CustomError.BadRequestError('DISCOUNT_NOT_FOUND')
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { discount: discount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updatediscount = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        discountId = new mongoose.Types.ObjectId(req.params.id),
        offersData = await Offers.findById(discountId).exec()

      let offerImage = offersData.file
      if (req.file) {
        offerImage = await helper.getFilePath(req.file.path)
      }

      let data = await Offers.findByIdAndUpdate(discountId, { ...body, file: offerImage, updatedAt: Date.now() }, { new: true }).exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { discounts: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteDiscount = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let discountId = new mongoose.Types.ObjectId(req.params.id)

      let discountData = await Offers.findById(discountId).lean().exec()
      if (!discountData) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      let data = await Offers.findOneAndRemove({ _id: discountId }).lean().exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE
      response.message = 'DETAIL_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { discount: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly commAndTax = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        data: any,
        userId: any = req.query.userId,
        listingId: any = req.query.listingId
      if (req.query.userId && req.query.listingId) throw new CustomError.BadRequestError('REQUIRED_ONLY_ONE_FIELD_IN_QUERY_PARAMS')
      let user = userId ? new mongoose.Types.ObjectId(userId) : null
      let list = listingId ? new mongoose.Types.ObjectId(listingId) : null
      let validation = await ListValidator.validateData(body , "comisionAndTax")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let commData: any = await Comision.findOne({
        $or: [
          { $and: [{ userId: user }, { listingId: null }] },
          { $and: [{ userId: null }, { listingId: list }] }
        ]
      }).lean().exec()
      if (!commData) {
        const newDoc: any = new Comision()
        newDoc.commission = body.commission
        newDoc.status = body.status
        newDoc.listingId = list
        newDoc.userId = user
        newDoc.tax = body.tax
        data = await newDoc.save()
      } else {
        data = await Comision.findOneAndUpdate(
          {
            $or: [
              { $and: [{ userId: user }, { listingId: null }] },
              { $and: [{ userId: null }, { listingId: list }] }
            ]
          },
          { $set: { commission: body.commission, status: body.status, tax: body.tax } },
          { new: true }
        ).lean().exec()
        if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
      }


      // RESPONSE
      response.data = { comisionAndTax: data }
      response.message = 'COMMISSION & TAX DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listCommAndTax = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let userId: any = req.query.userId
      let listingId: any = req.query.listingId
      let user = userId ? new mongoose.Types.ObjectId(userId) : null
      let list = listingId ? new mongoose.Types.ObjectId(listingId) : null
      if (req.query.userId && req.query.listingId) throw new CustomError.BadRequestError('REQUIRED_ONLY_ONE_FIELD_IN_QUERY_PARAMS')

      let data: any = await Comision.find({
        $or: [
          { $and: [{ userId: user }, { listingId: null }] },
          { $and: [{ userId: null }, { listingId: list }] }
        ]
      }).lean().exec()
      if (!data || data.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE
      response.message = 'COMMISSION & TAX_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { comisionAndTax: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getAllReviews = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let queryData: any = req.query
      let reviewId: any = queryData.reviewId
      const matchCondition = reviewId ? { 'reviewRating._id': new mongoose.Types.ObjectId(reviewId) } : {};
      console.log("match",matchCondition)
      let pageQuery: any = await this.paginationBuilder(queryData)
      let searchCondition: any = {};

      if (queryData.search) {
        searchCondition.$or = [
          { propertyName: { $regex: new RegExp(queryData.search, "i") } },
          { reviewedUserName: { $regex: new RegExp(queryData.search, "i") } },
          { providerName: { $regex: new RegExp(queryData.search, "i") } },
          { propertyCategory: { $regex: new RegExp(queryData.search, "i") } }
        ];
      }
      if (queryData.propertyName) searchCondition.propertyName = { $regex: new RegExp(queryData.propertyName, "i") };
      if (queryData.userName) searchCondition['reviewedUserName'] = { $regex: new RegExp(queryData.userName, "i") };
      if (queryData.providerName) searchCondition['providerName'] = { $regex: new RegExp(queryData.providerName, "i") };
      if (queryData.propertyCategory) searchCondition['propertyCategory'] = { $regex: new RegExp(queryData.propertyCategory, "i") };

      let reviewAndRating = await List.aggregate([
        { $unwind: '$reviewRating' },
        { $match: matchCondition },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'providerData'
          }
        },
        { $unwind: '$providerData' },
        {
          $lookup: {
            from: 'users',
            localField: 'reviewRating.userId',
            foreignField: '_id',
            as: 'reviewedUserData'
          }
        },
        { $unwind: '$reviewedUserData' },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryName'
          }
        },
        { $unwind: '$propertyCategoryName' },
        {
          $lookup: {
            from: 'admins',
            localField: 'reviewRating.reply.userId', 
            foreignField: '_id',
            as: 'adminReplyData'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'reviewRating.reply.userId',
            foreignField: '_id',
            as: 'providerReplyData'
          }
        },
        { $sort: { 'reviewRating.dateOfReview': -1 } },
        {
          $project: {
            reviewId: '$reviewRating._id',
            propertyName: 1,
            propertyCategory: '$propertyCategoryName.category',
            reviewedUserName: '$reviewedUserData.fullname',
            userEmail: '$reviewedUserData.email',
            userPhone: '$reviewedUserData.phone',
            userPhoneCode: '$reviewedUserData.phoneCode',
            providerName: '$providerData.fullname',
            providerEmail: '$providerData.email',
            providerPhone: '$providerData.phone',
            providerPhoneCode: '$providerData.phoneCode',
            review: '$reviewRating.review',
            rating: '$reviewRating.rating',
            dateOfReview: '$reviewRating.dateOfReview',
            bookingId: '$reviewRating.bookingId',
            reply: {
              $map: {
                input: '$reviewRating.reply',
                as: 'reply',
                in: {
                  replyId: '$$reply._id',
                  response: '$$reply.response',
                  repliedBy: {
                    $cond: {
                      if: { $eq: ['$$reply.userType', 'ADMIN'] },
                      then: 'ADMIN',                              
                      else: 'PROVIDER'                          
                    }
                  },
                  replierName: {
                    $cond: {
                      if: { $eq: ['$$reply.userType', 'ADMIN'] },
                      then: { $arrayElemAt: ['$adminReplyData.firstname', 0] }, 
                      else: { $arrayElemAt: ['$providerReplyData.fullname', 0] } 
                    }
                  },
                  dateOfReply: '$$reply.dateOfReview'
                }
              }
            }
          }
        }, 
        { $match: searchCondition },       
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            rating: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])

      // RESPONSE
      response.message = 'REVIEWS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: reviewAndRating[0]?.totalCount[0]?.total,
        reviewAndRating: reviewAndRating[0]?.rating
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

  static readonly deleteReview = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let queryData = req.query
      let listingId: any = queryData.listingId
      let reviewId: any = queryData.reviewId
      let replyId: any = queryData.replyId
      let deleteResponse: any;

      if (!listingId || !reviewId) throw new CustomError.BadRequestError('LISTINGID_&_REVIEWID_IS_REQUIRED')
      
      if (replyId) {
        deleteResponse = await List.findOneAndUpdate(
              { _id: listingId, 'reviewRating._id': reviewId }, 
              { $pull: { 'reviewRating.$.reply': { _id: replyId } } }
        ).exec()
      }
      else {
        deleteResponse = await List.findOneAndUpdate(
              { _id: listingId, 'reviewRating._id': reviewId },
              { $pull: { reviewRating: { _id: reviewId } } }
        ).exec()
      }

      console.log(deleteResponse)

      // RESPONSE
      response.message = 'REVIEW_RESPONSE_DATA_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}

export { ListingController }