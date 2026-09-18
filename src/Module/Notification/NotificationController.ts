import mongoose from 'mongoose'
import moment from 'moment'
import Mustache from 'mustache'
import Notification from '@abserve/Module/Notification/NotificationModel'
import User from '@abserve/Module/Auth/Model/User'
import Admin from '@abserve/Module/Auth/Model/Admin'
import PushNotifications from '@abserve/Module/Notification/PushNotificationModel'
import CustomError from '@abserve/errors/index'
import { Config } from '@abserve/Config/AppConfig'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { Response } from 'express'
import { BaseController } from '@abserve/Module/BaseControllers'
import { NotificationValidator } from '@abserve/Module/Notification/NotificationValidator'
import { Template } from '@abserve/Module/Notification/Template'
import { pushNotification } from '@abserve/Module/Notification/PushNotification'
class NotificationController extends BaseController {
  constructor() {
    super()
  }

  static readonly notification = async (Data: any) => {
      try {
        if (Data.userType && Data.userType.length !== 0) {
          let findQuery = { _id: new mongoose.Types.ObjectId(Data.forWhom) }
          if (Data.userType === 'user') {
            //USER VERIFY
            let userdata = await User.find(findQuery)
            if (userdata.length === 0) {
              throw new CustomError.BadRequestError('USER_NOT_FOUND')
            }
          }
          if (Data.userType === 'admin') {
            //ADMIN VERIFY
            let adminData = await Admin.find(findQuery)
            if (adminData.length === 0) {
              throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')
            }
          }
        }
        let newDoc = await new Notification()

        newDoc.status = 'sent'
        newDoc.forWhom = new mongoose.Types.ObjectId(Data.forWhom)
        newDoc.message = Data.message
        newDoc.fromWhom = Data.fromWhom
        newDoc.image = Data.image
        newDoc.title = Data.title
        newDoc.link = Data.link
        newDoc.userType = Data.userType

        newDoc.save()
        // console.log(newDoc)
        return newDoc
        // resolve(newDoc)
      } catch (error) {
        console.log(error)
      }
  }


static readonly createPushNotification = async (messageData: any) => {
  let response = {
    status: false,
    data: {},
    message: 'Unprocessable Entry'
  }
  try {
    const { data = {} } = messageData
    let body = data.body;
    let title = data.title;

    const templateDoc = await PushNotifications.findOne({ key: data.key, softdel: false }).lean();
    if (templateDoc) {
      title = Mustache.render(templateDoc.title, data.templateData || {});
      body = Mustache.render(templateDoc.body, data.templateData || {});
    } else {
      title = title;
      body = body;
    }
      await pushNotification.init();
      const sendPushNotification = await pushNotification.sendNotification({
        pushToken: data.pushToken,
        data: {
          title: title,
          body: body
        }
      })
    response.status = sendPushNotification
    response.message = sendPushNotification ? 'Notified' : response.message
    response = {
      status: true,
      data: {},
      message: 'NOTIFICATION_UPDATED'
    }
  } catch (error) {
    response = {
      status: false,
      data: {},
      message: error.message || response.message
    }
  }
  return response
}

  static readonly sendNotification = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        datas,
        notifiData

      let validation = await NotificationValidator.validateData(req.body , "notification")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      let find = req.body.forWhom
        .slice(1, -1)
        .split(',')
        .map((str: any) => new mongoose.Types.ObjectId(str))

      for (let id of find) {
        let newDoc: any = new Notification()
        newDoc.forWhom = id
        newDoc.message = body.message
        newDoc.fromWhom = 'ADMIN'
        newDoc.title = body.title
        newDoc.userType = body.userType
        newDoc.link = body.link
        newDoc.status = 'sent'
        await newDoc.save()
      }


      // RESPONSE
      response.message = 'NOTIFICATION_SENT_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      //ERROR RESPONCE
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listNotification = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let pageQuery: any = await this.paginationBuilder(req.query)
      let threeDaysAgo = moment()
        .subtract(3, 'days')
        .format('yyyy-MM-DD' + 'T' + 'HH:mm:ss')
        .toString()
      let notifications = await Notification.aggregate([
        {
          $match: {
            $and: [{ createdAt: { $gte: new Date(threeDaysAgo) } }, { softdel: false }]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            noti: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])
      if(!notifications) throw new CustomError.BadRequestError("NOTIFICATIONS_NOT_FOUND")


      // RESPONSE
      response.message = 'NOTIFICATION_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: notifications[0]?.totalCount[0]?.total,
        notifications: notifications[0]?.noti
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listNotificationOfUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let pageQuery: any = await this.paginationBuilder(req.query)
      let notifications = await Notification.aggregate([
        {
          $match: {
            $and: [{ status: 'sent' }, { forWhom: new mongoose.Types.ObjectId(req.auth.userId) }]
          }
        },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            noti: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])
      if(!notifications) throw new CustomError.BadRequestError("USERS_NOTIFICATIONS_NOT_FOUND")
      let totalCount = notifications[0]?.totalCount[0]?.total || 0;

      const unreadCount = await Notification.countDocuments({ forWhom: req.auth.userId, markAsRead: false });


      // RESPONSE
      response.message = 'NOTIFICATION_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: unreadCount === 0 ? 0 : totalCount,
        notifications: notifications[0]?.noti
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly viewNotification = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Notification.aggregate([
        {
          $match: {
            $and: [{ status: { $ne: 'deleted' } }, { _id: new mongoose.Types.ObjectId(req.params.id) }]
          }
        }
      ])


      // RESPONSE
      response.message = 'NOTIFICATION_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { notification: data[0] }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Notification.updateMany(
        { forWhom: req.auth.userId },
        { $set: { status: 'seen', updatedAt: Date.now() } }
      )
      if(!data) throw new CustomError.BadRequestError("FAILED_TO_UPDATE_STATUS")


      // RESPONSE
      response.message = 'NOTIFICATION_UPDATED'
      response.status = true
      response.data = data
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly markAsRead = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Notification.updateMany(
        { forWhom: req.auth.userId, markAsRead: false },
        { $set: { markAsRead: true, updatedAt: Date.now() } }
      )
      if(!data) throw new CustomError.BadRequestError("FAILED_TO_UPDATE_STATUS")


      // RESPONSE
      response.message = 'NOTIFICATION_UPDATED'
      response.status = true
      response.data = data
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly updateOneNotification = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Notification.updateMany(
        { _id: req.params.notificationId, status: 'sent' },
        { $set: { status: 'seen', updatedAt: Date.now() } }
      )
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE_NOTIFICATION')


      // RESPONSE    
      response.message = 'NOTIFICATION_UPDATED'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteNotification = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let data = await Notification.findByIdAndUpdate(
        req.params.id,
        { softdel: true, updatedAt: Date.now() },
        { new: true }
      )
      if(!data) throw new CustomError.BadRequestError("FAILED_TO_DELETE_NOTIFICATION")


      // RESPONSE
      response.message = 'NOTIFICATION_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = { notification: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.cause || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly createPushNotificationTemplate = async (req: AuthenticateRequest, res: Response) => {
      let response = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        validation: {},
        statusCode: 500
      }
      try {
        const { key, title, body } = req.body
  
        const existTemplate = await PushNotifications.findOne({ softdel: false, key })
  
        if (existTemplate) throw new CustomError.BadRequestError('THIS_TYPE_OF_PUSH_NOTIFICATION_TEMPLATE_ALREADY_EXIST')
  
        const newTemplate = await PushNotifications.create({
          key, 
          title,
          body
        })
  
        const savedTemplate = await newTemplate.save()
        if (!savedTemplate) throw new CustomError.BadRequestError('PUSH_NOTIFICATION_TEMPLATE_NOT_CREATED')
  
  
        //RESPONSE
        response.data = savedTemplate
        response.status = true
        response.statusCode = 201
        response.message = 'PUSH_NOTIFICATION_TEMPLATE_CREATED_SUCCESSFULLY'
      } catch (error: any) {
        console.error('Error', error.message)
        response.status = false
        response.message = error.message || response.message
        response.validation = error.validationArr || {};
        response.statusCode = error.statusCode || response.statusCode
      }
      return res.status(response.statusCode || 500).json(response).end()
    }
  
  
    static readonly getPushNotificationTemplate = async (req: AuthenticateRequest, res: Response) => {
      let response = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        statusCode: 500,
        totalCount: 0
      }
      try {
        let templates: any
        const { id } = req.params
        const { _page = 1, _limit = 10 } = req.query
        let queryData:any = req.query
        const skip = (Number(_page) - 1) * Number(_limit)
  
        if (id) {
          templates = await PushNotifications.findOne({ _id: id })
          if (!templates) throw new CustomError.BadRequestError('PUSH_NOTIFICATION_TEMPLATES_NOT_FOUND')
          response.totalCount = 1
        } else {
          let query:any = { softdel: false }
          if (queryData.search) {
            const regex = new RegExp(queryData.search, 'i')
            query = { $or: [{ subject: regex }, { description: regex }] }
          }
          if(queryData.subject) query.subject = { $regex: queryData.subject, $options: 'i' };
          if(queryData.description) query.description = { $regex: queryData.description, $options: 'i' };
          console.log('Query', query)
          response.totalCount = await PushNotifications.countDocuments(query)
          console.log('Total Count', response.totalCount)
          templates = await PushNotifications.find(query).skip(skip).limit(Number(_limit))
          console.log('Templates', templates)
          
          const isTemplate = !templates || templates.length <= 0
          if (isTemplate) throw new CustomError.BadRequestError('PUSH_NOTIFICATION_TEMPLATES_NOT_FOUND')
        }
  
  
        // RESPONSE
        response.data = { templates }
        response.message = 'PUSH_NOTIFICATION_TEMPLATES_FETCHED_SUCCESSFULLY'
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
  
  
    static readonly updatePushNotificationTemplate = async (req: AuthenticateRequest, res: Response) => {
      let response: any = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        validation: {},
        statusCode: 500
      }
      try {
        const body = req.body
  
        const updatedTemplate = await PushNotifications.findOneAndUpdate(
          { _id: body.templateId, softdel: false },
          { ...body },
          { new: true }
        )
        if(!updatedTemplate) throw new CustomError.BadRequestError("FAILED_TO_UPDATE_TEMPLATE")
  
  
        //RESPONSE
        response.data = updatedTemplate
        response.message = 'PUSH_NOTIFICATION_TEMPLATES_UPDATED_SUCCESSFULLY'
        response.status = true
        response.statusCode = 200
      } catch (error: any) {
        console.error('Error', error.message)
        response.status = false
        response.message = error.message || response.message
        response.validation = error.validationArr || {};
        response.statusCode = error.statusCode || response.statusCode
      }
      return res.status(response.statusCode || 500).json(response).end()
    }
  
  
    static readonly deletePushNotificationTemplate = async (req: AuthenticateRequest, res: Response) => {
      let response = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        statusCode: 500
      }
      try {
        const Id = req.params.id
        if (Config.hiddenSettings.mode == '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_TEST_MODE', [])
  
        const deletedTemplate = await PushNotifications.findOneAndUpdate(
          { _id: Id },
          { softdel: true },
          { new: true }
        )
        if (!deletedTemplate) throw new CustomError.BadRequestError("DEFAULT_TEMPLATE_ARE_NOT_ALLOWED_TO_DELETE")
  
  
        //RESPONSE
        response.data = deletedTemplate
        response.status = true
        response.message = 'PUSH_NOTIFICATION_TEMPLATES_DELETED_SUCCESSFULLY'
        response.statusCode = 200
      } catch (error: any) {
        console.error('Error', error)
        response.status = false
        response.message = error.message || response.message
        response.statusCode = error.statusCode || response.statusCode
      }
      return res.status(response.statusCode || 500).json(response).end()
    }
}

export { NotificationController }