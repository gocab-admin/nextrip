import mongoose from 'mongoose'
import moment from 'moment'
import pdf from 'html-pdf-node';
import fs from 'fs';
import XLSX from 'xlsx'
import path from 'path';
import { Worker } from 'worker_threads'
import Category from '@abserve/Module/Listing/Model/PropertyCategories'
import Property from '@abserve/Module/Listing/Model/Properties'
import Country from '@abserve/Module/Listing/Model/Country'
import State from '@abserve/Module/Listing/Model/State'
import City from '@abserve/Module/Listing/Model/City'
import Icon from '@abserve/Module/Listing/Model/Icon'
import Language from '@abserve/Module/Listing/Model/Language'
import List from '@abserve/Module/Listing/Model/Listings'
import User from '@abserve/Module/Auth/Model/User'
import Booking from '@abserve/Module/Listing/Model/Booking'
import CustomError from '@abserve/errors/index'
import { FolderConfig } from '@abserve/Module/FileUpload/FolderConfig';
import { works as Works } from '@abserve/Config/HowItWorks'
import { PresetService } from '@abserve/Module/Services/DataStore/PresetService';
import { QueryBuilder } from '@abserve/Helper/QueryBuilder';
import { Response } from 'express'
import { ListValidator } from '@abserve/Module/Listing/Validators/ListValidator'
import { BaseController } from '@abserve/Module/BaseControllers'
import { SingleFileRequest, AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { Constants } from '@abserve/Config/Constants'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { cloudinaryUpload, removeFile } from '@abserve/Module/FileUpload';

class DataStoreController extends BaseController {
  constructor() {
    super()
  }
  //dashboard
  static readonly totalCount = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let currentMonth = new Date().getMonth() + 1 // JavaScript months are zero-based, so add 1

      let userCnt = await User.find({ softdel: false }).count()
      let listCnt = await List.find({ softdel: false }).count()
      let categoryCnt = await Category.find({}).count()
      let providerCount = await List.aggregate(
        [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userData'
            }
          },
          { $unwind: '$userData' },
          {
            $match: {
              softdel: false,
              'userData.softdel': false
            }
          },
          { $count: 'totalProvider' }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      )
      //month based
      let bookingCnt = await Booking.aggregate([
        {
          $match: {
            status: { $nin: ['pending', 'cancelled', 'failed'] },
            $expr: {
              $eq: [{ $month: '$createdAt' }, currentMonth]
            }
          }
        },
        { $count: 'Booking' }
      ])
      let activeUserCnt = await User.aggregate([
        {
          $match: { isActive: true, softdel: false }
        },
        { $count: 'activeUser' }
      ])

      let hostAmt = await Booking.aggregate([
        { $match: { status: 'checkOut' } },
        { $project: { hostAmount: { $sum: '$hostAmount' } } }
      ])
      let data = {
        totalUser: userCnt,
        totalProvider: providerCount.length !== 0 ? providerCount[0].totalProvider : 0,
        totalCategories: categoryCnt,
        totalListings: listCnt,
        activeUser: activeUserCnt.length !== 0 ? activeUserCnt[0].activeUser : 0,
        totalBookingThisMonth: bookingCnt.length !== 0 ? bookingCnt[0].Booking : 0,
        providerEarningsThisMonth: hostAmt.length !== 0 ? hostAmt[0].hostAmount : 0
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { totalCount: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly bookingStat = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let query: any = req.query
      let startDate = moment(query.date).startOf(query.status).format('YYYY-MM-DD'),
        endDate = moment(query.date).endOf(query.status).format('YYYY-MM-DD')
      let que: any = { $dayOfMonth: '$createdAt' }
      if (req.query.status == 'year') {
        que = { $month: '$createdAt' }
      }

      let bookingStat = Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
          }
        },
        {
          $project: {
            status: 1,
            month: que,
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          }
        },
        {
          $group: {
            _id: { status: '$status', month: '$month' },
            count: { $sum: 1 },
            date: { $first: '$date' }
          }
        },
        {
          $group: {
            _id: '$_id.month',
            value: {
              $push: {
                status: '$_id.status',
                checkoutCount: '$count'
              }
            },
            count: { $sum: '$count' },
            date: { $first: '$date' }
          }
        },
        {
          $project: {
            _id: '$_id',
            value: {
              $filter: {
                input: '$value',
                as: 'item',
                cond: { $eq: ['$$item.status', 'checkOut'] }
              }
            },
            bookingCount: '$count',
            date: '$date'
          }
        }
      ])
      let promises = await Promise.all([bookingStat])
      let resstr = promises[0]


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { bookingStat: resstr }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly bookingReport = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let countData = await Booking.aggregate([
        {
          $lookup: {
            from: 'listings',
            localField: 'listingId',
            foreignField: '_id',
            as: 'listinginfo'
          }
        },
        {
          $unwind: {
            path: '$listinginfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'listinginfo.userId',
            foreignField: '_id',
            as: 'hostinginfo'
          }
        },
        {
          $unwind: {
            path: '$hostinginfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userinfo'
          }
        },
        {
          $unwind: {
            path: '$userinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            bookedDates: 1,
            perDay: 1,
            paidDate: 1,
            paidAmount: 1,
            hostAmount: 1,
            paymentMode: 1,
            status: 1,
            paymentStatus: 1,
            fareAmount: 1,
            commission: 1,
            tax: 1,
            // user details
            userName: '$userinfo.firstname',
            // hosting details
            hostingName: '$hostinginfo.firstname',
            propertyName: '$listinginfo.propertyName'
          }
        }
      ])
      console.log('COUNTDATA', countData)


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED_REPORTS'
      response.data = countData
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getTripEarningReport = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let ISODateADay = moment().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      let filterType = req.query.filterType,
        toDate,
        fromDate,
        fromMonth
      if (!filterType) {
        filterType = 'daily'
      }

      if (filterType == 'daily') {
        toDate = moment(ISODateADay).format('YYYY-MM-DD')
        fromDate = moment(toDate).subtract(1, 'days').format('YYYY-MM-DD')
      } else if (filterType == 'weekly') {
        toDate = moment(ISODateADay).format('YYYY-MM-DD')
        fromDate = moment(toDate).subtract(7, 'days').format('YYYY-MM-DD')
      } else if (filterType == 'monthly') {
        fromMonth = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        fromDate = moment(fromMonth).format('YYYY-MM-DD')
        toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
      }
      let datas = {
        totalBookings: 0,
        totalHostAmount: 0,
        totalBookingPayment: 0,
        totalBookingCommision: 0
      }

      let earning = await Booking.aggregate([
        {
          $match: { createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) }, status: 'checkOut' }
        },
        {
          $project: {
            hostAmount: 1,
            commission: 1,
            fareAmount: 1
          }
        },
        {
          $group: {
            _id: 0,
            hostAmount: { $sum: '$hostAmount' },
            commission: { $sum: '$commission' },
            fareAmount: { $sum: '$fareAmount' },
            count: { $sum: 1 }
          }
        }
      ])
      if (earning.length == 0) {
        response.data = []
      } else {
        datas = {
          totalBookings: earning[0].count,
          totalHostAmount: earning[0].hostAmount,
          totalBookingPayment: earning[0].fareAmount,
          totalBookingCommision: earning[0].commission
        }
        response.data = { report: datas }
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
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


  static readonly ratingReport = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let highRate = await List.aggregate([
        {
          $match: {
            status: 'approve',
            softdel: false
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
          $unwind: {
            path: '$attachmentData',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            propertyName: 1,
            totalRatingCount: 1,
            'attachmentData.image.coverImage': 1
          }
        },
        {
          $limit: 10
        },
        {
          $sort: {
            totalRatingCount: -1
          }
        }
      ])


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { rate: highRate }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly recentUsers = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let recentUser = await User.aggregate([
        {
          $project: {
            firstname: 1,
            profileImage: 1,
            createdAt: 1,
            email: 1,
            phone: 1
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $limit: 10
        }
      ])


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { recentUser: recentUser }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly recentProviders = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let recentUser = await User.aggregate([
        {
          $lookup: {
            from: 'listings',
            localField: '_id',
            foreignField: 'userId',
            as: 'listData'
          }
        },
        {
          $match: {
            listData: { $exists: true, $ne: [] }
          }
        },
        {
          $project: {
            firstname: 1,
            profileImage: 1,
            createdAt: 1,
            email: 1,
            phone: 1
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $limit: 10
        }
      ])


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { recentUser: recentUser }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly howItWorks = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { works } = req.body;
      Works.length = 0
      Works?.push(...works)


      const __dirname = path.resolve()
      const filePath = `${__dirname}/src/Config/HowItWorks.ts`
      const actualfilePath = `${__dirname}/build/Config/HowItWorks.js`

      const fileContent = `const works = ${JSON.stringify(Works, null, 2)}\nexport { works }`
      await fs.writeFileSync(filePath, fileContent)
      await fs.copyFileSync(filePath, actualfilePath)


      // RESPONSE
      response.data = works
      response.status = true
      response.message = 'WORKS_UPDATED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  // static howToUpload = async (req: AuthenticateRequest, res: Response) => {
  //   let response = {
  //     message: 'Unprocessable Entity',
  //     statusCode: 500,
  //     status: false
  //   }
  //   try {
  //     req.body.fileIndex.split(',').forEach((index: any, key: string) => {
  //       index = parseInt(index);
  //       if (req.files[key]) {
  //         Works[index].icon = `public/icon/${req.files[key].filename}`;
  //       }
  //     });


  //     const __dirname = path.resolve()
  //     const filePath = `${__dirname}/src/Config/HowItWorks.ts`
  //     const actualfilePath = `${__dirname}/build/Config/HowItWorks.js`

  //     const fileContent = `const works = ${JSON.stringify(Works, null, 2)}\nexport { works }`
  //     const fileWrite = await fs.writeFileSync(filePath, fileContent)
  //     const fileCopy = await fs.copyFileSync(filePath, actualfilePath)


  //     // RESPONSE
  //     response.status = true
  //     response.message = 'WORKS_UPDATED'
  //     response.statusCode = 200
  //   } catch (error) {
  //     console.log('Error \n', error)
  //     response.status = false
  //     response.message = error.message || response.message
  //     response.statusCode = error.statusCode || response.statusCode
  //   }
  //   return res.status(response.statusCode || 500).json(response).end() 
  // }


  static readonly getHowItWorks = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {

      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED_SUCCESSFULLY'
      response.data = { works: Works }
    } catch (error) {
      console.log("ERROR", error);
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }

  static readonly addProperty = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const newDoc: any = new Property()
      if (!req.body.property) throw new CustomError.BadRequestError('PROPERTY_REQUIRED')
      if (req.file) {
        // req.file.path = await helper.getFilePath(req.file.path)
        // newDoc.icon = req.file.path
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.Icon )
        newDoc.icon = cloudImage.url
        newDoc.publicId  = cloudImage.publicId
      }

      newDoc.categoryId = new mongoose.Types.ObjectId(req.params.id)
      newDoc.property = req.body.property
      newDoc.desc = req.body.desc

      let data = await newDoc.save()


      // RESPONSE
      response.message = 'DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { property: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateProperty = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        icon: any, publicId: any
      let updateDoc = await Property.findById(req.params.id).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      if (req.file && updateDoc.publicId) await removeFile(updateDoc.publicId);
      if (req.file) {
        // req.file.path = await helper.getFilePath(req.file.path)
        // icon = req.file.path
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.Icon )
        icon = cloudImage.url
        publicId = cloudImage.publicId
      }
      let update = await Property.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        {
          $set: {
            property: body.property,
            icon: icon || updateDoc.icon,
            publicId: publicId || updateDoc.publicId,
            desc: body.desc,
            updatedAt: Date.now()
          }
        },
        { new: true }
      ).lean().exec()


      // RESPONSE    
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { property: update }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listProperties = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      // let auth = req.auth
      let properties: any
      let queryData: any = req.query;
      let pageQuery: any = await this.paginationBuilder(queryData)
      const matchCondition: any = { categoryId: new mongoose.Types.ObjectId(req.params.id) };
      if (queryData.search) matchCondition.property = { $regex: queryData.search, $options: 'i' };
      if (queryData.property) matchCondition.property = { $regex: queryData.property, $options: 'i' };
    
      properties = await Property.aggregate([
          { $match: matchCondition },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              property: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])

      if (!properties) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: properties[0]?.totalCount[0]?.total,
        properties: properties[0]?.property
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


  static readonly deleteProperty = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Property.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id) }).lean().exec()
      if (!data) throw new CustomError.BadRequestError("PROPERTY_NOT_DELETED")


      // RESPONSE
      response.message = 'DETAILS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { property: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addPropertyCategory = async (req: SingleFileRequest, res: Response) => {
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

      if (req.files?.['icon']) {
        // req.files['icon'][0].path = await helper.getFilePath(req.files['icon'][0].path)
        // newDoc.icon = req.files['icon'][0].path
        const cloudImage = await cloudinaryUpload( req.files['icon'][0].buffer, FolderConfig.Icon )
        newDoc.icon = cloudImage.url
        newDoc.publicId  = cloudImage.publicId
      }

      if (req.files?.['image']) {
        // req.files['image'][0].path = await helper.getFilePath(req.files['image'][0].path)
        // newDoc.image = req.files['image'][0].path
        const cloudImage = await cloudinaryUpload( req.files['image'][0].buffer, FolderConfig.Icon )
        newDoc.image = cloudImage.url
        newDoc.publicId  = cloudImage.publicId        
      }

      let checkCategory = await Category.find({ category: req.body.category }).exec()
      if (checkCategory.length != 0) throw new CustomError.BadRequestError('CATEGORY_ALREADY_FOUND')
      if (req.body.isAll) {
          let category = await Category.find({ isAll: true }).exec()
          if (category.length > 0) throw new CustomError.BadRequestError('ALL_CATEGORY_ALREADY_EXISTS')
      }
      newDoc.category = req.body.category
      newDoc.isAll = req.body.isAll || newDoc.isAll
      let data = await newDoc.save()


      // RESPONSE
      response.message = 'DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { propertyCategory: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updatePropertyCategory = async (req: SingleFileRequest, res: Response) => {
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
        image = '',
        publicId = ''
      let updateDoc = await Category.findById(req.params.id).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')
      if (body.category) {
        let checkCategory: any = await Category.find({ category: body.category }).exec()
        if (checkCategory.length != 0) throw new CustomError.BadRequestError('CATEGORY_ALREADY_FOUND')
      }

      if (req.files?.['icon']) {
        // req.files['icon'][0].path = await helper.getFilePath(req.files['icon'][0].path);
        // icon = req.files['icon'][0].path;
        const cloudImage = await cloudinaryUpload( req.files['icon'][0].buffer, FolderConfig.Icon )
        updateDoc.icon = cloudImage.url
        updateDoc.publicId  = cloudImage.publicId
      }

      if (req.files?.['image']) {
        // req.files['image'][0].path = await helper.getFilePath(req.files['image'][0].path);
        // image = req.files['image'][0].path;
        const cloudImage = await cloudinaryUpload( req.files['image'][0].buffer, FolderConfig.Icon )
        updateDoc.image = cloudImage.url
        updateDoc.publicId  = cloudImage.publicId
      }

      let update = await Category.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        {
          $set: {
            category: body.category,
            isAll: body.isAll || updateDoc.isAll,
            icon: icon || updateDoc.icon,
            image: image || updateDoc.image,
            publicId: publicId || updateDoc.publicId,
            updatedAt: Date.now()
          }
        },
        { new: true }
      ).lean().exec()


      // RESPONSE    
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { propertyCategory: update }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listPropertyCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let auth = req.auth,
        categories
      let pageQuery: any = await this.paginationBuilder(req.query)
      let matchCondition: any = {};
      if (req.query.search) matchCondition.category = { $regex: req.query.search, $options: 'i' };
      if (req.query.category) matchCondition.category = { $regex: req.query.category, $options: 'i' };
      
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
          { $match: matchCondition },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              categories: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])
      }
      if (!categories || categories.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')
      const isAll = categories[0]?.categories?.[0]?.isAll || false;


      // RESPONSE    
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: categories[0]?.totalCount[0]?.total,
        isAll,
        categories: categories[0]?.categories
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


  static readonly deletePropertyCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Category.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id) }).lean().exec()
      if (!data) throw new CustomError.BadRequestError("PROPERTY_CATEGORY_NOT_DELETED")


      // RESPONSE    
      response.message = 'DETAILS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { propertyCategory: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addIcon = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const newDoc: any = new Icon()
      if (!req.file) throw new CustomError.BadRequestError('ICON_REQUIRED')

      if (req.file) {
        // req.file.path = await helper.getFilePath(req.file.path)
        // newDoc.icon = req.file.path
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.Icon )
        newDoc.icon = cloudImage.url
        newDoc.publicId  = cloudImage.publicId
      }
      newDoc.name = body.name
      newDoc.label = body.label
      let data = await newDoc.save()


      // RESPONSE
      response.message = 'DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { icons: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listIcon = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let auth = req.auth
      let query = req.query
      let icons: any
      let pageQuery: any = await this.paginationBuilder(query)
      let searchQuery: any = {};
      if (query.search) {
        searchQuery.$or = [
            { label: { $regex: query.search, $options: 'i' } },
            { name: { $regex: query.search, $options: 'i' } }
        ];
      } else {
        if (query.name) searchQuery.name = { $regex: query.name, $options: 'i' };
        if (query.label) searchQuery.label = { $regex: query.label, $options: 'i' };
      }
      if (auth.role == Constants.userRole.USER) {
        icons = await Icon.aggregate([
          { $match: {} },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              icons: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])
      }
      if (auth.role == Constants.userRole.ADMIN) {
        icons = await Icon.aggregate([
          { $match: searchQuery },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              totalCount: [{ $count: 'total' }],
              icons: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
            }
          }
        ])
      }


      // RESPONSE
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: icons[0]?.totalCount[0]?.total,
        icons: icons[0]?.icons
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


  static readonly deleteIcon = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Icon.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.params.id) }).lean().exec()
      if (!data) throw new CustomError.BadRequestError("ICON_NOT_DELETED")


      //RESPONSE    
      response.message = 'DETAILS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { icon: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly createInvoice = async (req: AuthenticateRequest, res: Response): Promise<Response> => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {},
    };

    try {
      const bookingId: any = req.query.bookingId 
      if (!bookingId) throw new CustomError.BadRequestError('BOOKINGID_IS_REQUIRED')

      const bookingData = await Booking.findOne({ _id: new mongoose.Types.ObjectId(bookingId) }).lean().exec();
      if (!bookingData) throw new CustomError.NotFoundError('BOOKING_NOT_FOUND');

      const listingData = await List.findOne({ _id: bookingData.listingId }).lean().exec();
      if (!listingData) throw new CustomError.NotFoundError('LISTING_NOT_FOUND');

      const userData = await User.findOne({ _id: bookingData.userId }).lean().exec();
      if (!userData) throw new CustomError.NotFoundError('USER_NOT_FOUND');

      const providerData = await User.findOne({ _id: bookingData.providerId }).lean().exec();
      if (!providerData) throw new CustomError.NotFoundError('PROVIDER_NOT_FOUND');
  
      const invoice = {
        bookingNo: bookingData.bookingNo,
        createdAt: new Date(bookingData.createdAt).toDateString(),
        currency: bookingData.currency,
        startDate: bookingData.bookedDates.start,
        endDate: bookingData.bookedDates.end,
        totalFare: bookingData.paidAmount,
        paymentMode: bookingData.paymentMode,
        // pickupAddress: tripData.invoice.start,
        // dropAddress: tripData.invoice.end,
        listing: {
          name: listingData.propertyName,
          address: listingData.address,
          city: listingData.address.city,
          state: listingData.address.state,
          country: listingData.address.country
        },
        userFullname: userData.fullname,
        providerFullname: providerData.fullname,
        items: [
          { item: 'Host Amount', value: bookingData.hostAmount || 'N/A' },
          { item: 'Tax', value: bookingData.tax || 'N/A' },
          { item: 'Commission', value: bookingData.commission || 'N/A' },
          { item: 'Discount Amount', value: bookingData.discountAmount || 'N/A' },
          { item: 'Refund Amount', value: bookingData.refundAmount || 'N/A' },
        ],
      };

      const worker = new Worker('./build/Utils/InvoiceWorker.js', {
        workerData: { invoice, path: 'output.pdf' },
      });

      worker.on('message', (stream) => {
        if (stream.error) {
          response.message = 'Worker Error';
          response.statusCode = 500;
          return res.status(500).json(response).end();
        } else {
          console.log('Invoice PDF Generation Complete');
          response.status = true;
          response.statusCode = 200;
          response.message = 'INVOICE_GENERATED_SUCCESSFULLY';
          response.data = { file: Buffer.from(stream.buffer) };

          res.header('Access-Control-Allow-Headers', '*');
          res.setHeader('x-filename', 'Report.pdf');
          res.setHeader('Content-type', 'application/pdf');
          return res.status(200).send(Buffer.from(stream.buffer));
        }
      });

      worker.on('error', (error) => {
        console.error('Worker Error:', error);
        response.message = 'WORKER_ERROR';
        response.statusCode = 500;
        return res.status(500).json(response).end();
      });
    } catch (error) {
      console.error('CREATE_INVOICE_ERROR:', error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.reasons || {};
      response.statusCode = error.statusCode || response.statusCode;
      return res.status(response.statusCode).json(response).end();
    }
  };


  static readonly getEarningReports = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const queryData: any = req.query
      let matchCondition: any = {}
      let pageQuery = await this.paginationBuilder(queryData)

      //matchCondition = { status: 'checkOut' } 
      if (queryData.bookingNo) {
        const regex = new RegExp(queryData.bookingNo, 'i')
        matchCondition['$expr'] = {
          $regexMatch: { input: { $toString: '$bookingNo' }, regex: regex }
        };
      }
      if (queryData.updatedAt) {
        const updatedAt = new Date(queryData.updatedAt);
        const startDay = new Date(updatedAt.setHours(0, 0, 0, 0));
        const endDay = new Date(updatedAt.setHours(23, 59, 59, 999));
        matchCondition.updatedAt = { $gte: startDay, $lte: endDay };
      }
      if (queryData.propertyCategory) matchCondition['propertyCategoryDetails.category'] = { $regex: new RegExp(queryData.propertyCategory, "i") };
      if (queryData.propertyName) matchCondition['listingDetails.propertyName'] = { $regex: new RegExp(queryData.propertyName, "i") };
      if (queryData.userName) matchCondition['userDetails.fullname'] = { $regex: new RegExp(queryData.userName, "i") };
      if (queryData.providerName) matchCondition['providerDetails.fullname'] = { $regex: new RegExp(queryData.providerName, "i") };


      const bookings = await Booking.aggregate([
        {
          $lookup: {
            from: 'listings',
            localField: 'listingId',
            foreignField: '_id',
            as: 'listingDetails'
          }
        },
        queryData.propertyName ?
          { $match: { 'listingDetails.propertyName': { $regex: new RegExp(queryData.propertyName, 'i') } } } :
          { $match: {} },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'listingDetails.propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'providerId',
            foreignField: '_id',
            as: 'providerDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        { $unwind: { path: '$listingDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$propertyCategoryDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$providerDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            bookingNo: 1,
            'listingDetails.propertyName': 1,
            'propertyCategoryDetails.category': 1,
            'providerDetails.fullname': 1,
            'providerDetails.phoneCode': 1,
            'providerDetails.phone': 1,
            'providerDetails.email': 1,
            'userDetails.fullname': 1,
            'userDetails.phoneCode': 1,
            'userDetails.phone': 1,
            'userDetails.email': 1,
            currency: 1,
            currencySymbol: 1,
            bookedDates: 1,
            updatedAt: 1,
            status: 1,
            fareAmount: 1,
            hostAmount: 1,
            tax: 1,
            commission: 1,
            paymentMode: 1,
            refundAmount: 1,
            discountAmount: 1,
            adminEarned: { $round: [{ $add: ['$commission', '$tax'] }, 2] }
          }
        },
        { $match: matchCondition },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            bookingData: [{ $sort: { _id: -1 } }, { $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ]);

      if (!bookings?.length) throw new CustomError.BadRequestError('BOOKINGS_NOT_FOUND')


      // RESPONSE
      response.message = 'EARNING_REPORTS_LISTED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
      response.data = { bookingData: bookings[0].bookingData, totalCount: bookings[0]?.totalCount[0]?.total }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly downloadEarningReports = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Error generating PDF',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    };

    try {
      const queryData: any = req.query;
      let matchCondition: any = {};
      let pageQuery = await this.paginationBuilder(queryData);

      if (queryData.bookingNo) {
        const regex = new RegExp(queryData.bookingNo, 'i')
        matchCondition['$expr'] = {
          $regexMatch: { input: { $toString: '$bookingNo' }, regex: regex }
        };
      }
      if (queryData.updatedAt) {
        const updatedAt = new Date(queryData.updatedAt);
        const startDay = new Date(updatedAt.setHours(0, 0, 0, 0));
        const endDay = new Date(updatedAt.setHours(23, 59, 59, 999));
        matchCondition.updatedAt = { $gte: startDay, $lte: endDay };
      }

      const bookings = await Booking.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: 'listings',
            localField: 'listingId',
            foreignField: '_id',
            as: 'listingDetails'
          }
        },
        queryData.propertyName ?
          { $match: { 'listingDetails.propertyName': { $regex: new RegExp(queryData.propertyName, 'i') } } } :
          { $match: {} },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'listingDetails.propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'providerId',
            foreignField: '_id',
            as: 'providerDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        { $unwind: { path: '$listingDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$propertyCategoryDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$providerDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            bookingNo: 1,
            'listingDetails.propertyName': 1,
            'propertyCategoryDetails.category': 1,
            'providerDetails.fullname': 1,
            'providerDetails.phoneCode': 1,
            'providerDetails.phone': 1,
            'providerDetails.email': 1,
            'userDetails.fullname': 1,
            'userDetails.phoneCode': 1,
            'userDetails.phone': 1,
            'userDetails.email': 1,
            bookedDates: 1,
            updatedAt: 1,
            status: 1,
            fareAmount: 1,
            hostAmount: 1,
            commission: 1,
            tax: 1,
            refundAmount: 1,
            adminEarned: { $round: [{ $add: ['$commission', '$tax'] }, 2] }
          }
        },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            bookingData: [{ $sort: { _id: -1 } }, { $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ]);

      if (!bookings?.length) throw new CustomError.BadRequestError('BOOKINGS_NOT_FOUND');


      const htmlPath = path.join(__dirname, '../../../public/EarningReport.html');
      let htmlContent = fs.readFileSync(htmlPath, 'utf8');

      const bookingRows = bookings[0].bookingData.map((booking: any) => `
        <tr>
          <td>${booking.bookingNo}</td>
          <td>${booking.updatedAt}</td>
          <td>${booking.listingDetails?.propertyName || ''}</td>
          <td>${booking.propertyCategoryDetails?.category || ''}</td>
          <td>${booking.providerDetails?.fullname || ''}</td>
          <td>${booking.userDetails?.fullname || ''}</td>
          <td>${booking.fareAmount}</td>
          <td>${booking.hostAmount}</td>
          <td>${booking.tax}</td>
          <td>${booking.commission}</td>
          <td>${booking.adminEarned}</td>
          <td>${booking.refundAmount}</td>
          <td>${booking.status}</td>
        </tr>
      `).join('');

      htmlContent = htmlContent.replace('<!-- Booking rows will be inserted here dynamically -->', bookingRows);

      const options = { format: 'A4' };

      const invoiceDir = path.join(__dirname, '../../../invoicePDF');
      const pdfFilePath = path.join(invoiceDir, `EarningReport_${Date.now()}.pdf`);

      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir);
      }
      const file = { content: htmlContent };
      const pdfBuffer = await pdf.generatePdf(file, options);

      fs.writeFileSync(pdfFilePath, pdfBuffer);


      response.message = 'PDF_GENERATED_SUCCESSFULLY';
      response.status = true;
      response.statusCode = 200;
      response.data = { filePath: pdfFilePath };

      return res.status(200).json(response);

    } catch (error) {
      console.log('Error generating PDF:', error);
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  };


  // Add language
  static readonly AddLanguage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      let already = await Language.findOne({ Language: req.body.Language }).exec()
      if (already) throw new CustomError.BadRequestError('ALREADY_EXIST')

      let data = new Language(req.body)
      let lang = await data.save()


      // RESPONSE
      response.message = 'DETAILS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { langData: lang }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }


  static readonly UpdateLanguage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      let doc = await Language.findByIdAndUpdate(
        { _id: req.params.languageid },
        { ...req.body },
        { new: true, updatedAt: Date.now() }
      ).exec()
      if (!doc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.message = 'DETAILS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = doc
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }


  static readonly GetAllLanguage = async (req: AuthenticateRequest, res: Response) => {
    let response: any = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      let pageQuery: any = await this.paginationBuilder(req.query)

      let lang = await Language.aggregate([
        { $sort: { createdAt: -1 } },
        { $match: { Language: { $regex: req.query.search || '', $options: 'i' } } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            language: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])

      if (!(lang[0]?.totalCount?.length)) {
        response.message = 'DATA_NOT_FOUND'
      }


      // RESPONSE  
      response.message = response.message == 'DATA_NOT_FOUND' ? response.message : 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: lang[0]?.totalCount[0]?.total,
        language: lang[0]?.language
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }


  static readonly DeleteLanguage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      let doc = await Language.findByIdAndDelete({ _id: req.params.languageid }).exec()
      if (!doc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.message = 'DETAILS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = doc
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly getCountryExists = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const query = req.query

      const validation: any = await ListValidator.validateData(query , "getCountryExists")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getCountry(query)
      if (account?.status) throw new CustomError.BadRequestError('EXIST|COUNTRY')


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'NOT_EXIST|COUNTRY'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly getAllCountry = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage: any = queryData.limit || 10
      const page: any = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject: any = {}

      const queryBuilder: any = await QueryBuilder.getSearchable(Country, queryData)
      queryObject = queryBuilder.queryObject

      if (paramData.countryId) {
        queryObject._id = new mongoose.Types.ObjectId(paramData.countryId)
      }
      const getDataCount = await Country.find(queryObject).count()
      const getData = await Country.find(queryObject).skip(skip).limit(perPage)


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED|COUNTRY'
      response.data = { countries: getData, total: getDataCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly listAllCountries = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const queryData = req.query

      const queryObj: any = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      const getDataCount = await Country.find(queryObj).count()
      const getData = await Country.find(queryObj).exec()

      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED|COUNTRIES'
      response.data = { countries: getData, total: getDataCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly createCountry = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const body = req.body

      const validation: any = await ListValidator.validateData(body , "createCountry")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getCountry(body)
      if (account?.status) throw new CustomError.BadRequestError('EXISTS')

      const newCountry = new Country({
        code: body.code,
        name: body.name,
        phonecode: body.phonecode
      })

      const country = await newCountry.save()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'CREATED|COUNTRY'
      response.data = { country: country }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly updateCountry = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const body = req.body
      const countryId = req.params.countryId
      body.exceptId = countryId

      // const validation: any = await ListValidator.updateCountry(body)
      const validation: any = await ListValidator.validateData(body , "updateCountry")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getCountry(body)
      if (account?.status) {
        throw new CustomError.BadRequestError('EXISTS')
      }
      const country = await Country.findById(countryId).exec()

      country.code = body.code || country.code
      country.name = body.name || country.name
      country.phonecode = body.phonecode || country.phonecode

      const updatedCountry = await country.save()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'UPDATED|COUNTRY'
      response.data = { country: updatedCountry }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly deleteCountry = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const body = req.body
      const userId = req.params.countryId
      body._id = userId

      const account = await PresetService.getCountry(body)
      if (!account?.status) {
        throw new CustomError.BadRequestError('NOT_EXISTS')
      }
      const country = await Country.findByIdAndDelete(userId).exec()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DELETED|COUNTRY'
      response.data = { country: country }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly getStateExists = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const query = req.query

      const validation: any = await ListValidator.validateData(query , "getStateExists")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getState(query)
      if (account?.status) throw new CustomError.BadRequestError('EXIST|STATE')


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'NOT_EXIST|STATE'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly getAllState = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage: any = queryData.limit || 10
      const page: any = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject: any = {}

      const queryBuilder: any = await QueryBuilder.getSearchable(State, queryData)
      queryObject = queryBuilder.queryObject

      if (paramData.stateId) {
        queryObject._id = new mongoose.Types.ObjectId(paramData.stateId)
      }
      const getDataCount = await State.find(queryObject).count()
      const getData = await State.find(queryObject).skip(skip).limit(perPage)


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED|STATE'
      response.data = { states: getData, total: getDataCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly listAllStates = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const queryData = req.query
      const paramData = req.params

      const queryObj: any = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      if (paramData.countryId) {
        queryObj.country_id = new mongoose.Types.ObjectId(paramData.countryId)
      }
      const getDataCount = await State.find(queryObj).count()
      const getData = await State.find(queryObj).exec()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED|STATE'
      response.data = { states: getData, total: getDataCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly createState = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const body = req.body

      const validation: any = await ListValidator.validateData(body , "createState")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getState(body)
      if (account?.status) throw new CustomError.BadRequestError('EXISTS')

      const newState = new State({
        name: body.name,
        code: body.code,
        country_id: body.country_id
      })

      const state = await newState.save()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'CREATED|STATE'
      response.data = { state: state }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly updateState = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const body = req.body
      const userId = req.params.stateId
      body.exceptId = userId
      const validation: any = await ListValidator.validateData(body , "updateState")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getState(body)
      if (account?.status) {
        // if(account.data.customer._id != mongoose.Types.ObjectId(userId))
        throw new CustomError.BadRequestError('EXISTS')
      }

      const state = await State.findById(userId).exec()

      state.name = body.name || state.name
      state.code = body.code || state.code
      state.country_id = body.country_id || state.country_id

      const updatedState = await state.save()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'UPDATED|STATE'
      response.data = { state: updatedState }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly deleteState = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const body = req.body
      const userId = req.params.stateId
      body._id = userId

      const account = await PresetService.getState(body)
      if (!account && !account.status) {
        throw new CustomError.BadRequestError('NOT_FOUND|STATE')
      }
      const state = await State.findByIdAndDelete(userId).exec()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DELETED|STATE'
      response.data = { state: state }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly getCityExists = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      validation: {},
      statusCode: 500
    }
    try {
      const query = req.query

      const validation: any = await ListValidator.validateData(query , "getCityExists")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getCity(req.query)
      if (account?.status) throw new CustomError.BadRequestError('EXIST|CITY')


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'NOT_EXIST|CITY'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly getAllCity = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage: any = queryData.limit || 10
      const page: any = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject: any = {}

      const queryBuilder: any = await QueryBuilder.getSearchable(City, queryData)
      queryObject = queryBuilder.queryObject

      if (paramData.cityId) {
        queryObject._id = new mongoose.Types.ObjectId(paramData.cityId)
      }
      const getDataCount = await City.find(queryObject).count()
      const getData = await City.find(queryObject).skip(skip).limit(perPage)


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'SUCCESS'
      response.data = { cities: getData, total: getDataCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly listAllCities = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const queryData = req.query
      const paramData = req.params

      const queryObj: any = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      if (paramData.countryId) {
        queryObj.country_id = new mongoose.Types.ObjectId(paramData.countryId)
      }
      if (paramData.stateId) {
        queryObj.state_id = new mongoose.Types.ObjectId(paramData.stateId)
      }
      const getDataCount = await City.find(queryObj).count()
      const getData = await City.find(queryObj).exec()

      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED|CITIES'
      response.data = { cities: getData, total: getDataCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly createCity = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const body = req.body

      const validation: any = await ListValidator.validateData(body , "createCity")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getCity(body)
      if (account?.status) throw new CustomError.BadRequestError('EXISTS')

      const newCity = new City({
        name: body.name,
        code: body.code,
        country_id: body.country_id,
        state_id: body.state_id,
        latitude: body.latitude,
        longitude: body.longitude
      })

      const city = await newCity.save()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'CREATED|CITY'
      response.data = { city: city }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly updateCity = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const body = req.body
      const userId = req.params.cityId
      body.exceptId = userId

      const validation: any = await ListValidator.validateData(body , "updateCity")
      if (!validation.status) throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)

      const account = await PresetService.getCity(body)
      if (account?.status) {
        // if(account.data.customer._id != mongoose.Types.ObjectId(userId))
        throw new CustomError.BadRequestError('EXISTS')
      }

      const city = await City.findById(userId).exec()

      city.name = body.name || city.name
      city.code = body.code || city.code
      city.country_id = body.country_id || city.country_id
      city.state_id = body.state_id || city.state_id
      city.latitude = body.latitude || city.latitude
      city.longitude = body.longitude || city.longitude

      const updatedCity = await city.save()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'UPDATED|CITY'
      response.data = { city: updatedCity }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly deleteCity = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const body = req.body
      const userId = req.params.cityId
      body._id = userId

      const account = await PresetService.getCity(body)
      if (!account?.status) {
        throw new CustomError.BadRequestError('NOT_EXISTS')
      }
      const city = await City.findByIdAndDelete(userId).exec()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DELETED|CITY'
      response.data = { city: city }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly importCountries = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const workbooks = XLSX.read(req.file.buffer, { type: 'buffer' })
      const sheetName = workbooks.SheetNames[0]
      const sheet = workbooks.Sheets[sheetName]

      const jsonData: any = XLSX.utils.sheet_to_json(sheet)
      for (const element of jsonData) {
        const existData = await Country.findOne({
          code: element.numeric_code,
          name: element.country_name
        })
        if (!existData) {
          await Country.create({
            name: element.name,
            code: element.numeric_code,
            phonecode: element.phone_code
          })
        }
      }


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DATA_IMPORTED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly importStates = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const workbooks = XLSX.read(req.file.buffer, { type: 'buffer' })
      const sheetName = workbooks.SheetNames[0]
      const sheet = workbooks.Sheets[sheetName]

      const jsonData: any = XLSX.utils.sheet_to_json(sheet)
      let countryData = null
      for (const element of jsonData) {
        if (countryData == null || countryData.name != element.country_name) {
          countryData = await Country.findOne({
            status: true,
            name: element.country_name
          })
        }
        const existData = await State.findOne({
          name: element.name,
          code: element.state_code
        })

        if (!existData) {
          await State.create({
            name: element.name,
            code: element.state_code,
            country_id: countryData._id
          })
        }
      }


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DATA_IMPORTED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly importCities = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      totalCount: 0,
      statusCode: 500
    }
    try {
      const workbooks = XLSX.read(req.file.buffer, { type: 'buffer' })
      const sheetName = workbooks.SheetNames[0]
      const sheet = workbooks.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(sheet)
      const totalRecords = jsonData.length
      const chunkSize = 10000
      let chunkStart = 0
      const notFound = []
      // Process the data in chunks
      while (chunkStart < totalRecords) {
        const chunkEnd = Math.min(chunkStart + chunkSize, totalRecords)
        const chunk = jsonData.slice(chunkStart, chunkEnd)
        const citiesNotFound = await this.processCitiesChunk(chunk)
        if (citiesNotFound.length > 0) notFound.push(citiesNotFound)
        chunkStart += chunkSize
      }


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DATA_IMPORTED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).send(response)
  }

  static readonly processCitiesChunk = async (citiesData: any) => {
    let stateData = null
    const notFound = []
    for (const cities of citiesData) {
      if (stateData == null || stateData.name != cities.state_name) {
        const stateDataArr = await State.aggregate([
          {
            $match: { name: cities.state_name }
          },
          {
            $lookup: {
              from: 'countries',
              localField: 'country_id',
              foreignField: '_id',
              as: 'country'
            }
          },
          {
            $unwind: '$country'
          },
          {
            $match: { 'country.name': cities.country_name }
          },
          {
            $project: {
              name: 1,
              country: 1
            }
          }
        ])
        stateData = stateDataArr.length > 0 ? stateDataArr[0] : null
        console.log('NEW_STATE', JSON.stringify(stateData))
      }
      if (stateData) {
        const existData = await City.findOne({
          name: cities.name,
          code: cities.name.slice(0, 2),
          country_id: stateData.country?._id,
          state_id: stateData?._id
        })
        if (!existData) {
          await City.create({
            name: cities.name,
            code: cities.name.slice(0, 2).toUpperCase() || 'UN',
            country_id: stateData.country?._id,
            state_id: stateData?._id,
            latitude: cities.latitude,
            longitude: cities.longitude
          })
        }
      } else {
        notFound.push(cities)
      }
    }
    return notFound
  }
}

export { DataStoreController }