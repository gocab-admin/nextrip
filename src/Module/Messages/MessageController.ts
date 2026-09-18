import mongoose from 'mongoose'
import messages from '@abserve/Module/Messages/MessagesModel'
import User from '@abserve/Module/Auth/Model/User'
import Admin from '@abserve/Module/Auth/Model/Admin'
import CustomError from '@abserve/errors/index'
import { BaseController } from '@abserve/Module/BaseControllers'
import { MessageValidator } from '@abserve/Module/Messages/MessageValidator'
import { Enum } from '@abserve/Utils/Enum'

class MessageController extends BaseController {
  constructor() {
    super()
  }

  static readonly createMessage = async (req: any, res: any) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const validation = await MessageValidator.validateData(req.body , "addMessage")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      let newDoc = new messages()

      newDoc.messageContent = req.body.messageContent
      newDoc.senderRole = req.auth.role
      newDoc.title = req.body.title
      newDoc.parentMessageId = req.body.parentMessageId
      newDoc.sender = req.auth.userId
      newDoc.receiver = req.body.receiver
      newDoc.scheduleTime = req.body.scheduleTime ? req.body.scheduleTime : Date.now()

      if (req.files && req.files.length !== 0) {
        let files = req.files.map((file: any) => {
          return {
            location: file.path,
            format: file.mimetype
          }
        })
        newDoc.file = files
      }
      let data = await newDoc.save()


      // RESPONSE
      response.data = data
      response.status = true
      response.statusCode = 200
      response.message = 'DATA_CREATED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getAllmessages = async (req: any, res: any) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { search, _limit = 10, _page = 1 } = req.query
      let query: any
      query = {
        $or: [{ receiver: req.auth.userId }, { sender: req.auth.userId }],
        scheduleTime: { $lte: Date.now() },
        deletedBy: { $nin: [req.auth.userId] },
        archeivedBy: { $nin: [req.auth.userId] }
      }

      //SEARCH QUERY
      if (search) {
        query = {
          $and: [
            { $or: [{ receiver: req.auth.userId }, { sender: req.auth.userId }] },
            {
              $or: [
                { title: { $regex: '^' + req.query.search, $options: 'i' } },
                { messageContent: { $regex: '^' + req.query.search, $options: 'i' } }
              ]
            },
            { scheduleTime: { $lte: Date.now() } },
            { archeivedBy: { $nin: [req.auth.userId] } },
            { deletedBy: { $nin: [req.auth.userId] } }
          ]
        }
      }

      let Data = await messages.find(query).skip((_page - 1) * _limit).limit(_limit)


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'DATA_LISTED'
      response.data = Data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly archiveMessage = async (req: any, res: any) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      validation: {},
      statusCode: 500
    }
    try {
      let archiveMsg = await messages.findOneAndUpdate(
        { _id: req.body.id, $or: [{ receiver: req.auth.userId }, { sender: req.auth.userId }] },
        {
          status: Enum.MESSAGESTATUS.ARCHIVED,
          $push: { archeivedBy: req.auth.userId },
          updatedAt: Date.now()
        }
      )
      if (!archiveMsg) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.status = true
      response.message = 'MESSAGE_ARCHIVED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteMessage = async (req: any, res: any) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      validation: {},
      statusCode: 500
    }
    try {
      let archiveMsg = await messages.findOneAndUpdate(
        { _id: req.body.id, $or: [{ receiver: req.auth.userId }, { sender: req.auth.userId }] },
        { status: Enum.MESSAGESTATUS.DELETED, $push: { deletedBy: req.auth.userId }, updatedAt: Date.now() }
      )
      if (!archiveMsg) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.status = true
      response.message = 'MESSAGE_DELETED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getArchiveMessage = async (req: any, res: any) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { search } = req.query
      let query: any
      query = {
        $or: [{ receiver: req.auth.userId }, { sender: req.auth.userId }],
        archeivedBy: { $in: [req.auth.userId] },
        deletedBy: { $nin: [req.auth.userId] }
      }

      //SEARCH QUERY
      if (search) {
        query = {
          $and: [
            { $or: [{ receiver: req.auth.userId }, { sender: req.auth.userId }] },
            {
              $or: [
                { title: { $regex: '^' + req.query.search, $options: 'i' } },
                { messageContent: { $regex: '^' + req.query.search, $options: 'i' } }
              ]
            },
            { archeivedBy: { $in: [req.auth.userId] } },
            { deletedBy: { $nin: [req.auth.userId] } }
          ]
        }
      }
      let archiveMsgs = await messages.find(query)


      // RESPONSE
      response.data = archiveMsgs
      response.status = true
      response.message = 'DATA_LISTED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getSupportMessages = async (req: any, res: any) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { search } = req.query

      // BASIC QUERY AND WITHOUT SEARCH
      let query = [
        {
          $match: {
            receiver: new mongoose.Types.ObjectId(req.auth.userId),
            deletedBy: { $nin: [new mongoose.Types.ObjectId(req.auth.userId)] }
          }
        },
        {
          $lookup: {
            from: 'admins',
            localField: 'sender',
            foreignField: '_id',
            as: 'result'
          }
        },
        {
          $match: {
            result: {
              $ne: []
            }
          }
        }
      ]

      //SEARCH QUERY
      if (search) {
        let searchquery = {
          $match: {
            receiver: new mongoose.Types.ObjectId(req.auth.userId),
            deletedBy: { $nin: [new mongoose.Types.ObjectId(req.auth.userId)] },
            $or: [
              { title: { $regex: req.query.search, $options: 'i' } },
              { messageContent: { $regex: req.query.search, $options: 'i' } }
            ]
          }
        }
        query.splice(0, 1, searchquery)
      }
      let archiveMsgs = await messages.aggregate(query)


      // RESPONSE
      response.data = archiveMsgs
      response.status = true
      response.message = 'DATA_LISTED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getSingleMessage = async (req: any, res: any) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let Data = await messages.find({
          $or: [{ _id: req.params.id }, { parentMessageId: req.params.id }],
          deletedBy: { $nin: [req.auth.userId] }
        }).sort({ createdAt: 1 })
      Data = JSON.parse(JSON.stringify(Data))

      for (let data of Data) {
        let senderData: any
        if (data.senderRole === 'USER') {
          senderData = await User.findOne({ _id: data.sender })
        } else if (data.senderRole === 'ADMIN') {
          senderData = await Admin.findOne({ _id: data.sender })
        } else {
          senderData = await User.findOne({ _id: data.sender })
        }
        data['senderData'] = senderData
      }


      // RESPONSE
      response.data = Data
      response.status = true
      response.statusCode = 200
      response.message = 'DATA_FETCHED'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}

export { MessageController }