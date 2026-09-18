import firebase from 'firebase-admin'
import mongoose from 'mongoose'
import Chat from '@abserve/Module/Chat/Chat'
import ChatFiles from '@abserve/Module/Chat/ChatFiles'
import List from '@abserve/Module/Listing/Model/Listings'
import Ads from '@abserve/Module/Ads/Model/Ads'
import CustomError from '@abserve/errors/index'
import { AuthenticateRequest, MultipleFileRequest } from '@abserve/Interfaces/Requests'
import { BaseController } from '@abserve/Module/BaseControllers'
import { Response } from 'express'
import { Constants } from '@abserve/Config/Constants'
import { Server } from 'socket.io'
import { serviceAccount } from '@abserve/Config/boatstar-c79ea-firebase-adminsdk-6oyp8-cb9b3fca10'
import User from '../Auth/Model/User'
import BadRequestError from '@abserve/errors/BadRequestError'

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as any),
  databaseURL: 'https://boatstar-c79ea-default-rtdb.firebaseio.com/' // Replace with your database URL
})

class ChatController extends BaseController {
  private static io: Server
  constructor(io: Server) {
    super()
    ChatController.io = io
  }
  // send messages
  static readonly sendMessages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { message, receiverId, replyId } = req.body
      const senderId = req.auth.userId
      let chatId: any, updateDeliverMessage: any, data: any;

      if (!message || !receiverId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')
      let chatData = await Chat.aggregate([
        {
          $match: {
            participants: {
              $elemMatch: {
                userId: { $in: [new mongoose.Types.ObjectId(senderId)] }
              }
            }
          }
        },
        {
          $match: {
            participants: {
              $elemMatch: {
                userId: { $in: [new mongoose.Types.ObjectId(receiverId)] }
              }
            }
          }
        }
      ])
      //check block status
      const checkSenderBlockStatus = await Chat.aggregate([
        { $unwind: '$participants' },
        {
          $match: {
            $and: [
              { 'participants.userId': new mongoose.Types.ObjectId(senderId) },
              { 'participants.blockStatus': true },
              { _id: new mongoose.Types.ObjectId(chatId) }
            ]
          }
        }
      ])

      const checkReciverBlockStatus = await Chat.aggregate([
        { $unwind: '$participants' },
        {
          $match: {
            $and: [
              { 'participants.userId': new mongoose.Types.ObjectId(receiverId) },
              { 'participants.blockStatus': true },
              { _id: new mongoose.Types.ObjectId(chatId) }
            ]
          }
        }
      ])

      if ((checkSenderBlockStatus.length !== 0 || checkReciverBlockStatus.length !== 0) && chatData.length !== 0) {
        chatId = chatData[0]._id
        data = await Chat.findOneAndUpdate({ _id: chatId },
          {
            $push: {
              message: {
                userId: senderId,
                message: message,
                replyId: replyId || null,
                date: Date.now()
              }
            },
            updatedAt: Date.now()
          }
        ).exec()

        const mssgId = await Chat.findOne({ _id: chatId }).lean().exec()
        if (!mssgId) throw new CustomError.BadRequestError('CHAT_NOT_FOUND')

        const lastIndex = mssgId.message.length - 1
        updateDeliverMessage = await Chat.findOneAndUpdate(
          { _id: chatId },
          {
            $push: {
              deliverMessage: [
                {
                  messageId: mssgId.message[lastIndex]._id,
                  userId: senderId,
                  message: message,
                  replyId: replyId || null,
                  date: Date.now()
                }
              ]
            },
            updatedAt: Date.now()
          }
        ).exec()

        if (checkSenderBlockStatus.length !== 0) throw new CustomError.BadRequestError('YOU_HAVE_BLOCKED_THIS_USER')


        // RESPONSE
        response.message = 'CHAT_UPDATED'
        response.data = data
        response.status = true
        response.statusCode = 200
      } else if (chatData.length !== 0) {
        chatId = chatData[0]._id
        data = await Chat.findOneAndUpdate(
          { _id: chatId },
          {
            $push: {
              message: {
                userId: senderId,
                message: message,
                replyId: replyId || null,
                date: Date.now()
              }
            },
            updatedAt: Date.now()
          }
        ).exec()

        let mssgId = await Chat.findOne({ _id: chatId }).lean().exec()
        if (!mssgId) throw new CustomError.BadRequestError('CHAT_NOT_FOUND')

        const lastIndex = mssgId.message.length - 1

        updateDeliverMessage = await Chat.findOneAndUpdate(
          { _id: chatId },
          {
            $push: {
              deliverMessage: [
                {
                  messageId: mssgId.message[lastIndex]._id,
                  userId: senderId,
                  message: message,
                  replyId: replyId || null,
                  date: Date.now()
                },
                {
                  messageId: mssgId.message[lastIndex]._id,
                  userId: receiverId,
                  message: message,
                  replyId: replyId || null,
                  date: Date.now()
                }
              ]
            },
            updatedAt: Date.now()
          }
        ).exec()
      } else if (chatData.length == 0) {
        const newDoc: any = new Chat();
           newDoc.participants = [{ userId: senderId }, { userId: receiverId }]
            newDoc.message = {
              userId: senderId,
              message: message,
              date: Date.now()
            }
        data = await newDoc.save()

        updateDeliverMessage = await Chat.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(data._id) },
          {
            $push: {
              deliverMessage: [
                {
                  messageId: data.message[0]._id,
                  userId: senderId,
                  message: message,
                  replyId: replyId || null,
                  date: Date.now()
                },
                {
                  messageId: data.message[0]._id,
                  userId: receiverId,
                  message: message,
                  replyId: replyId || null,
                  date: Date.now()
                }
              ]
            },
            updatedAt: Date.now()
          }
        ).exec()
      }
      if (!data || !updateDeliverMessage) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
      const mssg = {
        chatId: data._id,
        message: message,
        onlineStatus: '0',
        date: Date.now()
      }

      //send to socket.io
      ChatController.emitChatMessage(mssg)


      // RESPONSE
      response.message = 'CHAT_UPDATED'
      response.data = data
      response.status = true
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


  static readonly chatList = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth = req.auth;
      let lookup: { from: string; localField: string; foreignField: string; as: string }

      if (auth.role == Constants.userRole.USER) {
        lookup = {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'users'
        }
      }

      const page: any = req.query.page || 1
      const limit: any = req.query.limit || 10

      const data = await Chat.aggregate([
        {
          $lookup: lookup
        },
        {
          $addFields: {
            userDetails: {
              $filter: {
                input: '$users',
                as: 'userDetail',
                cond: {
                  $eq: ['$$userDetail._id', new mongoose.Types.ObjectId(req.auth.userId)]
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: '$userDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: '$participants',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            $and: [
              {
                'participants.userId': new mongoose.Types.ObjectId(auth.userId)
              },
              {
                'participants.delChat': false
              },
              {
                'participants.archived': false
              }
            ]
          }
        },
        {
          $addFields: {
            deliverMessage: {
              $filter: {
                input: '$deliverMessage',
                as: 'j',
                cond: {
                  $and: [
                    {
                      $eq: ['$$j.userId', new mongoose.Types.ObjectId(auth.userId)]
                    },
                    {
                      $eq: ['$$j.softdel', false]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $addFields: {
            lastMessage: {
              $arrayElemAt: ['$deliverMessage', -1]
            }
          }
        },
        {
          $sort: {
            'lastMessage.date': -1
          }
        },
        {
          $project: {
            userId: '$users._id',
            name: '$users.firstname',
            profileImage: '$users.profileImage',
            lastMessage: '$lastMessage.message',
            date: '$lastMessage.date',
            newMessage: '$participants.unseen'
          }
        },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        }
      ])


      // RESPONSE
      response.message = 'CHAT_LISTED_SUCCESSFULLY'
      response.data = data
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.stack || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static markImportantChat = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { important } = req.body
      const { chatId } = req.params

      if (typeof important != 'boolean') {
        throw new BadRequestError('BOOLEAN_VALUES_REQUIRED')
      }


      const chatDetails: any = await Chat.findByIdAndUpdate(
        chatId,
        { isImportant: important },
        { new: true }
      )

      if (!chatDetails) {
        throw new BadRequestError('UPDATION_FAILED')
      }

      // RESPONSE
      response.message = 'SUCCESS'
      response.data = chatDetails
      response.status = true
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


  static readonly chatList1 = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let data: any
      if (req.query.type == 'ads') {
        let blockedQuery: any
        let filterQuery: any
        const page: any = req.query.page || 1
        const limit: any = req.query.limit || 10
        const status = req.query.status

        if (status === 'blocked') {
          blockedQuery = {
            $match: {
              'participants.blockStatus': true
            }
          }
        } else {
          blockedQuery = {
            $match: {
              'participants.blockStatus': false
            }
          }
        }
        if (status === 'hosting') {
          filterQuery = {
            $match: {
              'adsDetails.userId': new mongoose.Types.ObjectId(req.auth.userId)
            }
          }
        } else if (status === 'travelling') {
          filterQuery = {
            $match: {
              'adsDetails.userId': { $ne: new mongoose.Types.ObjectId(req.auth.userId) }
            }
          }
        } else if (status === 'important') {
          filterQuery = {
            $match: {
              isImportant: true
            }
          }
        } else {
          filterQuery = {
            $match: {}
          }
        }
        data = await Chat.aggregate([
          {
            $match: {
              'participants.userId': new mongoose.Types.ObjectId(req.auth.userId),
              'participants.delChat': false,
              'participants.archived': false
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'participants.userId',
              foreignField: '_id',
              as: 'userDetails'
            }
          },
          {
            $lookup: {
              from: 'advertisements',
              localField: 'adsId',
              foreignField: '_id',
              as: 'adsDetails'
            }
          },
          { $unwind: '$adsDetails' },
          {
            $addFields: {
              deliverMessages: {
                $filter: {
                  input: '$deliverMessage',
                  as: 'message',
                  cond: {
                    $and: [
                      { $eq: ['$$message.userId', new mongoose.Types.ObjectId(req.auth.userId)] },
                      { $eq: ['$$message.softdel', false] }
                    ]
                  }
                }
              }
            }
          },
          {
            $addFields: {
              lastMessage: {
                $arrayElemAt: ['$deliverMessages', -1]
              }
            }
          },
          {
            $sort: {
              'lastMessage.date': -1
            }
          },
          filterQuery,
          {
            $project: {
              participants: {
                $filter: {
                  input: '$participants',
                  as: 'participant',
                  cond: {
                    $and: [
                      {
                        $eq: ['$$participant.userId', new mongoose.Types.ObjectId(req.auth.userId)]
                      },
                      {
                        $eq: ['$$participant.delChat', false]
                      },
                      {
                        $eq: ['$$participant.archived', false]
                      }
                    ]
                  }
                }
              },
              deliverMessage: '$deliverMessages',
              userDetails: {
                $map: {
                  input: {
                    $filter: {
                      input: '$userDetails',
                      as: 'user',
                      cond: {
                        $ne: ['$$user._id', new mongoose.Types.ObjectId(req.auth.userId)]
                      }
                    }
                  },
                  as: 'filteredUser',
                  in: {
                    _id: '$$filteredUser._id',
                    name: '$$filteredUser.firstname',
                    profilePicture: {
                      $concat: [/* Config.baseUrl, */ '$$filteredUser.profileImage']
                    },
                  }
                }
              },
              lastMessage: '$lastMessage.message',
              lastMessageDate: '$lastMessage.date',
              adsName: '$adsDetails.name',
              adsImages: '$adsDetails.image',
              isImportant: 1
            }
          },
          blockedQuery,
          {
            $skip: (page - 1) * limit
          },
          {
            $limit: limit
          }
        ])
      }
      else {
        let blockedQuery: any
        let filterQuery: any
        const page: any = req.query.page || 1
        const limit: any = req.query.limit || 10
        const status = req.query.status

        if (status === 'blocked') {
          blockedQuery = {
            $match: {
              'participants.blockStatus': true
            }
          }
        } else {
          blockedQuery = {
            $match: {
              'participants.blockStatus': false
            }
          }
        }
        if (status === 'hosting') {
          filterQuery = {
            $match: {
              'listingDetails.userId': new mongoose.Types.ObjectId(req.auth.userId)
            }
          }
        } else if (status === 'travelling') {
          filterQuery = {
            $match: {
              'listingDetails.userId': { $ne: new mongoose.Types.ObjectId(req.auth.userId) }
            }
          }
        } else if (status === 'important') {
          filterQuery = {
            $match: {
              isImportant: true
            }
          }
        } else {
          filterQuery = {
            $match: {}
          }
        }
        data = await Chat.aggregate([
          {
            $match: {
              'participants.userId': new mongoose.Types.ObjectId(req.auth.userId),
              'participants.delChat': false,
              'participants.archived': false
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'participants.userId',
              foreignField: '_id',
              as: 'userDetails'
            }
          },
          {
            $lookup: {
              from: 'listings',
              localField: 'adsId',
              foreignField: '_id',
              as: 'listingDetails'
            }
          },
          { $unwind: '$listingDetails' },
          {
            $lookup: {
              from: 'listingattachments',
              localField: 'adsId',
              foreignField: 'listingId',
              as: 'listingImages'
            }
          },
          { $unwind: '$listingImages' },
          {
            $addFields: {
              deliverMessages: {
                $filter: {
                  input: '$deliverMessage',
                  as: 'message',
                  cond: {
                    $and: [
                      { $eq: ['$$message.userId', new mongoose.Types.ObjectId(req.auth.userId)] },
                      { $eq: ['$$message.softdel', false] }
                    ]
                  }
                }
              }
            }
          },
          {
            $addFields: {
              lastMessage: {
                $arrayElemAt: ['$deliverMessages', -1]
              }
            }
          },
          {
            $sort: {
              'lastMessage.date': -1
            }
          },
          filterQuery,
          {
            $project: {
              participants: {
                $filter: {
                  input: '$participants',
                  as: 'participant',
                  cond: {
                    $and: [
                      {
                        $eq: ['$$participant.userId', new mongoose.Types.ObjectId(req.auth.userId)]
                      },
                      {
                        $eq: ['$$participant.delChat', false]
                      },
                      {
                        $eq: ['$$participant.archived', false]
                      }
                    ]
                  }
                }
              },
              deliverMessage: '$deliverMessages',
              userDetails: {
                $map: {
                  input: {
                    $filter: {
                      input: '$userDetails',
                      as: 'user',
                      cond: {
                        $ne: ['$$user._id', new mongoose.Types.ObjectId(req.auth.userId)]
                      }
                    }
                  },
                  as: 'filteredUser',
                  in: {
                    _id: '$$filteredUser._id',
                    name: '$$filteredUser.firstname',
                    profilePicture: {
                      $concat: [/* Config.baseUrl, */ '$$filteredUser.profileImage']
                    }
                  }
                }
              },
              lastMessage: '$lastMessage.message',
              lastMessageDate: '$lastMessage.date',
              listingName: '$listingDetails.propertyName',
              listingImages: '$listingImages.image',
              isImportant: 1
            }
          },
          blockedQuery,
          {
            $skip: (page - 1) * limit
          },
          {
            $limit: limit
          }
        ])
      }


      // RESPONSE
      response.message = 'CHAT_LISTED_SUCCESSFULLY'
      response.data = data
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.stack || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listConversation = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      listingDetails: {},
      userData: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth: any = req.query.senderId || req.auth.userId
      const user = await Chat.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.chatId)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'participants.userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $project: {
            userDetails: {
              $map: {
                input: '$userData',
                as: 'userDetails',
                in: {
                  userId: '$$userDetails._id',
                  name: '$$userDetails.firstname',
                  profileImage: {
                    $concat: [/* Config.baseUrl, */ '$$userDetails.profileImage']
                  }
                }
              }
            }
          }
        }
      ])

      const data = await Chat.aggregate([
        { $unwind: '$deliverMessage' },
        {
          $match: {
            $and: [
              { _id: new mongoose.Types.ObjectId(req.params.chatId) },
              { 'deliverMessage.userId': new mongoose.Types.ObjectId(auth) },
              { 'participants.blockStatus': false },
              { 'deliverMessage.softdel': false },
              { 'deliverMessage.deleteAt': null }
            ]
          }
        },
        {
          $addFields: {
            msgs: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$message',
                    as: 'j',
                    cond: { $eq: ['$deliverMessage.messageId', '$$j._id'] }
                  }
                },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            'msgs.reply': {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$message',
                    as: 'j',
                    cond: { $eq: ['$msgs.replyId', '$$j._id'] }
                  }
                },
                0
              ]
            }
          }
        },
        { $match: { msgs: { $ne: {} } } },
        {
          $addFields: {
            'msgs.fileUrl': {
              $cond: {
                if: { $eq: ['$msgs.type', 'file'] },
                then: {
                  $concat: [
                    /* Config.baseUrl, */ 'public/files/',
                    { $toString: '$_id' },
                    '/',
                    '$msgs.imageDetails'
                  ]
                },
                else: '$$REMOVE'
              }
            }
          }
        },
        {
          $addFields: {
            'msgs.messageId': '$msgs._id'
          }
        },
        {
          $group: {
            _id: '$_id',
            message: { $push: '$msgs' }
          }
        }
      ])

      const listingDetail = await Chat.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req.params.chatId) }
        },
        {
          $lookup: {
            from: 'listings',
            localField: 'adsId',
            foreignField: '_id',
            as: 'listingDetails'
          }
        },
        { $unwind: '$listingDetails' },
        {
          $lookup: {
            from: 'listingattachments',
            localField: 'adsId',
            foreignField: 'listingId',
            as: 'listingImageDetails'
          }
        },
        { $unwind: '$listingImageDetails' },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'catId',
            foreignField: '_id',
            as: 'listingCategoryDetails'
          }
        },
        { $unwind: '$listingCategoryDetails' },
        {
          $group: {
            _id: '$_id',
            listingId: { $first: '$listingDetails._id' },
            listingName: { $first: '$listingDetails.propertyName' },
            listingCategoryName: { $first: '$listingCategoryDetails.category' },
            listingImages: { $first: '$listingImageDetails.image' }
          }
        }
      ])


      // RESPONSE
      response.message = 'CONVERSATION_LISTED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
      response.userData = user
      response.listingDetails = listingDetail
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly adsListConversation = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      adsDetails: {},
      userData: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth: any = req.query.senderId || req.auth.userId
      const user = await Chat.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.chatId)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'participants.userId',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $project: {
            userDetails: {
              $map: {
                input: '$userData',
                as: 'userDetails',
                in: {
                  userId: '$$userDetails._id',
                  name: '$$userDetails.firstname',
                  profileImage: {
                    $concat: [/* Config.baseUrl, */ '$$userDetails.profileImage']
                  }
                }
              }
            }
          }
        }
      ])

      const data = await Chat.aggregate([
        { $unwind: '$deliverMessage' },
        {
          $match: {
            $and: [
              { _id: new mongoose.Types.ObjectId(req.params.chatId) },
              { 'deliverMessage.userId': new mongoose.Types.ObjectId(auth) },
              { 'participants.blockStatus': false },
              { 'deliverMessage.softdel': false },
              { 'deliverMessage.deleteAt': null }
            ]
          }
        },
        {
          $addFields: {
            msgs: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$message',
                    as: 'j',
                    cond: { $eq: ['$deliverMessage.messageId', '$$j._id'] }
                  }
                },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            'msgs.reply': {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$message',
                    as: 'j',
                    cond: { $eq: ['$msgs.replyId', '$$j._id'] }
                  }
                },
                0
              ]
            }
          }
        },
        { $match: { msgs: { $ne: {} } } },
        {
          $addFields: {
            'msgs.fileUrl': {
              $cond: {
                if: { $eq: ['$msgs.type', 'file'] },
                then: {
                  $concat: [
                    /* Config.baseUrl, */ 'public/files/',
                    { $toString: '$_id' },
                    '/',
                    '$msgs.imageDetails'
                  ]
                },
                else: '$$REMOVE'
              }
            }
          }
        },
        {
          $addFields: {
            'msgs.messageId': '$msgs._id'
          }
        },
        {
          $group: {
            _id: '$_id',
            message: { $push: '$msgs' }
          }
        }
      ])

      const adsDetail = await Chat.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req.params.chatId) }
        },
        {
          $lookup: {
            from: 'advertisements',
            localField: 'adsId',
            foreignField: '_id',
            as: 'adsDetails'
          }
        },
        { $unwind: '$adsDetails' },
        {
          $lookup: {
            from: 'adscategories',
            localField: 'catId',
            foreignField: '_id',
            as: 'adsCategoryDetails'
          }
        },
        { $unwind: '$adsCategoryDetails' },
        {
          $group: {
            _id: '$_id',
            adsId: { $first: '$adsDetails._id' },
            adsName: { $first: '$adsDetails.name' },
            adsImages: { $first: '$adsDetails.image' },
            adsCategoryName: { $first: '$adsCategoryDetails.category' }
          }
        }
      ])


      // RESPONSE
      response.message = 'CONVERSATION_LISTED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
      response.userData = user
      response.adsDetails = adsDetail
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly messageStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      ChatController.emitLastSeen()
      const auth = req.auth
      const db = firebase.database()
      const messagesRef = db.ref(`chat`)
      let usersRef = messagesRef.child(req.params.chatId.toString())
      let update = {
        lastSeen: Date.now(),
        onlineStatus: req.body.onlineStatus
      }
      usersRef.update(update, function (error) {
        if (error) {
          throw error
        }
      })

      const sentMssg: any = await Chat.aggregate([
        { $unwind: '$message' },
        {
          $match: {
            $and: [
              { _id: new mongoose.Types.ObjectId(req.params.chatId) },
              { 'message.userId': { $ne: new mongoose.Types.ObjectId(auth.userId) } },
              { 'message.status': 'sent' }
            ]
          }
        },
        {
          $group: {
            _id: '$_id',
            message: { $push: '$message' }
          }
        }
      ]).exec()
      console.log(sentMssg.length)
      if (sentMssg.length == 0) {
        response.message = 'STATUS_UPDATED'
        response.status = true
        response.statusCode = 200
      } else {
        const message = sentMssg[0].message

        message.map(async function (x) {
          const deliverMessages = await Chat.aggregate([
            { $unwind: '$deliverMessage' },
            {
              $match: {
                $and: [
                  { 'deliverMessage.messageId': new mongoose.Types.ObjectId(x._id) },
                  { 'deliverMessage.userId': new mongoose.Types.ObjectId(auth.userId) }
                ]
              }
            },
            {
              $project: {
                messageId: '$deliverMessage.messageId',
                userId: '$deliverMessage.userId'
              }
            }
          ])

          deliverMessages.map(async function (y) {
            let updateMessageStatus = await Chat.findOneAndUpdate(
              { 'message._id': new mongoose.Types.ObjectId(y.messageId) },
              { $set: { 'message.$.status': 'seen' } }
            ).exec()
            if (!updateMessageStatus) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')
          })
        })
        response.message = 'STATUS_UPDATED'
        response.status = true
        response.statusCode = 200
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteMessage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth: any = req.query.senderId || req.auth.userId
      if (!req.params.MessageId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      const MessageIdData = await Chat.aggregate([
        { $unwind: '$deliverMessage' },
        {
          $match: {
            $and: [
              { 'deliverMessage.messageId': new mongoose.Types.ObjectId(req.params.MessageId) },
              { 'deliverMessage.userId': new mongoose.Types.ObjectId(auth) }
            ]
          }
        },
        { $project: { deleteMessageId: '$deliverMessage._id' } }
      ])
      if (!MessageIdData) {
        return res.status(404).send('MESSAGEID_NOT_FOUND')
      }

      const data = await Chat.findOneAndUpdate(
        {
          'deliverMessage._id': new mongoose.Types.ObjectId(MessageIdData[0].deleteMessageId)
        },
        { $set: { 'deliverMessage.$.softdel': true, 'deliverMessage.$.deleteAt': Date.now() } }
      ).exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE    
      response.message = 'DELETE_CHAT'
      response.status = true
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


  static readonly multipleDeleteMessage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }

    try {
      const auth: any = req.query.senderId || req.auth.userId
      const { messageIds }: any = req.query

      if (!messageIds) throw new CustomError.BadRequestError('INVALID_OR_MISSING_MESSAGEIDS')

      const messageIdsArrray = messageIds.split(',')

      const updateResult = await Chat.updateMany(
        {
          'deliverMessage.messageId': { $in: messageIdsArrray },
          'participants.userId': new mongoose.Types.ObjectId(auth)
        },
        {
          $set: {
            'deliverMessage.$[elem].softdel': true,
            'deliverMessage.$[elem].deleteAt': Date.now()
          }
        },
        { arrayFilters: [{ 'elem.messageId': { $in: messageIdsArrray } }] }
      )

      if (!updateResult) throw new CustomError.BadRequestError('FAILED_TO_DELETE_MESSAGES')


      // RESPONSE
      response.message = 'MULTIPLE_MESSAGES_DELETED'
      response.status = true
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


  static readonly deleteConversation = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth: any = req.query.senderId || req.auth.userId
      const chatId = req.params.chatId

      const data = await Chat.updateMany(
        {
          $and: [
            { _id: new mongoose.Types.ObjectId(chatId) },
            { 'participants.userId': new mongoose.Types.ObjectId(auth) }
          ]
        },
        {
          $set: {
            'deliverMessage.$[elem].softdel': true,
            'deliverMessage.$[elem].deleteAt': Date.now(),
            'participants.$[elem1].delChat': true
          }
        },
        {
          arrayFilters: [
            { 'elem.userId': { $in: new mongoose.Types.ObjectId(auth) } },
            { 'elem1.userId': { $in: new mongoose.Types.ObjectId(auth) } }
          ]
        }
      )

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE    
      response.message = 'DELETE_CONVERSATION'
      response.data = data
      response.status = true
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


  static readonly deleteChat = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth: any = req.query.senderId || req.auth.userId
      const chatId = req.params.chatId
      const data = await Chat.updateMany(
        {
          $and: [
            { _id: new mongoose.Types.ObjectId(chatId) },
            { 'participants.userId': new mongoose.Types.ObjectId(auth) }
          ]
        },
        {
          $set: {
            'participants.$[elem].unseen': 0,
            'participants.$[elem].delChat': true,
            'deliverMessage.$[elem].softdel': true,
            'deliverMessage.$[elem].deleteAt': Date.now()
          }
        },
        {
          arrayFilters: [{ 'elem.userId': { $in: new mongoose.Types.ObjectId(auth) } }]
        }
      )

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')



      // RESPONSE
      response.message = 'DELETE_CHAT'
      response.data = data
      response.status = true
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


  static readonly deleteMultipleChat = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }

    try {
      const { chatIds } = req.body
      if (!chatIds) throw new CustomError.BadRequestError('INVALID_OR_MISSING_CHATID')
      const chatIdsArray = chatIds.split(',')

      const auth: any = req.query.senderId || req.auth.userId

      const updateResult = await Chat.updateMany(
        {
          $and: [
            { _id: { $in: chatIdsArray.map((id) => new mongoose.Types.ObjectId(id)) } },
            { 'participants.userId': new mongoose.Types.ObjectId(auth) }
          ]
        },
        {
          $set: {
            'participants.$[elem].unseen': 0,
            'participants.$[elem].delChat': true,
            'deliverMessage.$[elem].softdel': true,
            'deliverMessage.$[elem].deleteAt': Date.now()
          }
        },
        {
          arrayFilters: [{ 'elem.userId': { $in: new mongoose.Types.ObjectId(auth) } }]
        }
      )
      if (!updateResult) throw new CustomError.BadRequestError('FAILED_TO_DELETE_CHATS')


      // RESPONSE
      response.message = 'DELETE_MULTIPLE_CHATS'
      response.status = true
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


  static readonly clearAllMessage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth: any = req.query.senderId || req.auth.userId
      const data = await Chat.updateMany(
        {
          $and: [
            { 'deliverMessage.userId': new mongoose.Types.ObjectId(auth) },
            { 'participants.userId': new mongoose.Types.ObjectId(auth) }
          ]
        },
        {
          $set: {
            'deliverMessage.$[elem].softdel': true,
            'deliverMessage.$[elem].deleteAt': Date.now()
          }
        },
        {
          arrayFilters: [{ 'elem.userId': { $in: new mongoose.Types.ObjectId(auth) } }]
        }
      )
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE    
      response.message = 'CHAT_CLEARED'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.stack || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addToArchive = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth = req.auth
      if (!req.body.archive || !req.params.chatId) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      const data = await Chat.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.chatId),
          'participants.userId': new mongoose.Types.ObjectId(auth.userId)
        },
        { $set: { 'participants.$.archived': req.body.archive } }
      )

      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE    
      response.message = 'CHAT_ARCHIVE_UPDATED'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.stack || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly archiveChat = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth = req.auth
      let lookup: any

      if (auth.role == Constants.userRole.PROVIDER) {
        lookup = {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'users'
        }
      } else if (auth.role == Constants.userRole.USER) {
        lookup = {
          from: 'providers',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'users'
        }
      } else {
        console.log('Invalid userRole')
      }
      const data = await Chat.aggregate([
        {
          $match: {
            $and: [
              { 'participants.userId': new mongoose.Types.ObjectId(auth.userId) },
              { 'participants.archived': true }
            ]
          }
        },
        { $lookup: lookup },
        { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
        { $addFields: { lastMessage: { $arrayElemAt: ['$message', -1] } } },
        {
          $project: {
            userName: '$users.firstname',
            userId: '$users._id',
            profileImage: '$users.profileImage',
            lastMessage: 1
          }
        }
      ])

      if (!data) throw new CustomError.BadRequestError('CHAT_NOT_ARCHIVED')


      // RESPONSE    
      response.message = 'ARCHIVED_CHAT'
      response.data = data
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.stack || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateBlockStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth: any = req.query.senderId || req.auth.userId
      if (req.body.blockStatus === '' || !req.params.chatId || req.body.blockStatus === null || req.body.blockStatus === undefined) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      const chatData = await Chat.findOne({ _id: new mongoose.Types.ObjectId(req.params.chatId) }).lean().exec()
      if (!chatData) throw new CustomError.BadRequestError('CHAT_NOT_FOUND')

      const data = await Chat.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.chatId),
          'participants.userId': new mongoose.Types.ObjectId(auth)
        },
        {
          $set: {
            'participants.$.blockedBy': auth,
            'participants.$.blockStatus': req.body.blockStatus,
            'participants.$.blockedAt': Date.now()
          }
        },
        { new: true }
      ).exec()
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_UPDATE')


      // RESPONSE    
      response.message = 'USER_BLOCKSTATUS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.stack || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listBlockedUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth = req.auth
      let lookup: any
      if (auth.role == Constants.userRole.USER) {
        lookup = {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'userData'
        }
      } else {
        console.log('Invalid userRole')
      }
      let data = await Chat.aggregate([
        {
          $match: {
            $and: [
              { 'participants.userId': new mongoose.Types.ObjectId(auth.userId) },
              { 'participants.blockStatus': true }
            ]
          }
        },
        { $lookup: lookup },
        {
          $unwind: {
            path: '$userData',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            userId: '$userData._id',
            firstname: '$userData.firstname',
            profileImage: '$userData.profileImage'
          }
        }
      ]).exec()


      // RESPONSE
      response.message = 'BLOCKED_CHATS_LISTED'
      response.data = data
      response.status = true
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


  static readonly fileUpload = async (req: MultipleFileRequest, res: Response) => {
    let response = {
      data: {},
      message: 'Unprocessable Entity',
      status: false,
      code: 500
    }
    try {
      const userId = req.body.userId || req.auth.userId
      const chatId = req.params.chatId
      const chatInfo = await Chat.findOne({ _id: chatId })

      if (!chatInfo) throw new CustomError.BadRequestError('CHAT_NOT_EXIST')

      let filedetail = []
      let groupId = null
      for (let filedata of req.files) {
        const regex = /([^/]+)/;
        const result = regex.exec(filedata.mimetype);
        let splittext = result[0]
        if (filedata.mimetype == 'application/pdf' && splittext == 'application') {
          splittext = 'file'
        }

        const insertdata = await ChatFiles.create({
          user_id: userId,
          chat_id: chatId,
          type: splittext,
          details: filedata.filename,
          property: {
            size: filedata.size,
            filename: filedata.originalname,
            fileType: filedata.mimetype
          },
          status: 'uploaded',
          groupId: groupId
        })

        if (groupId == null) {
          groupId = insertdata._id
        }
        filedetail.push(insertdata)
      }
      response = {
        data: {
          files: filedetail,
          filesCount: filedetail.length,
          fileId: filedetail[0]._id
        },
        message: 'DATA_CREATED',
        status: true,
        code: 200
      }
    } catch (error) {
      console.log(error)
      response = {
        data: {},
        message: error.message,
        status: false,
        code: error.statusCode || response.code
      }
    }
    return res.status(response.code).json(response).end()
  }


  static readonly chatInfo = async (req: AuthenticateRequest, res: Response) => {
    let response: any = {
      data: {},
      message: 'Unprocessable Entity',
      status: false,
      code: 500
    }
    try {
      // let { senderId, receiverId, adsId } = req.query
      const senderId: any = req.query.senderId
      const receiverId: any = req.query.receiverId
      const adsId: any = req.query.adsId
      const catId: any = req.query.catId
      let chat: any

      if (!adsId) throw new CustomError.BadRequestError('NO_AD_ID_PROVIDED')
      if (!catId) throw new CustomError.BadRequestError('NO_CAT_ID_PROVIDED')

      chat = await Chat.findOne({
        adsId: new mongoose.Types.ObjectId(adsId),
        catId: new mongoose.Types.ObjectId(catId),
        $or: [
          {
            $and: [
              { 'participants.0.userId': new mongoose.Types.ObjectId(senderId) },
              { 'participants.1.userId': new mongoose.Types.ObjectId(receiverId) }
            ]
          },
          {
            $and: [
              { 'participants.0.userId': new mongoose.Types.ObjectId(receiverId) },
              { 'participants.1.userId': new mongoose.Types.ObjectId(senderId) }
            ]
          }
        ]
      })

      if (chat?.participants[0]?.delChat || chat?.participants[1]?.delChat) {
        chat = await Chat.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(chat._id)
          },
          {
            $set: {
              'participants.$[elem].delChat': false
            }
          },
          {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'elem.userId': { $in: [new mongoose.Types.ObjectId(senderId)] } }]
          }
        )
      }

      const listingDetails = await List.findOne({ _id: adsId })

      const listingImageDetails = await Chat.aggregate([
        {
          $lookup: {
            from: 'listingattachments',
            localField: 'adsId',
            foreignField: 'listingId',
            as: 'listingImageDetail'
          }
        },
        { $unwind: '$listingImageDetail' },
        {
          $project: {
            _id: 0,
            listingImages: '$listingImageDetail.image'
          }
        }
      ])

      const listingImageDetailsObject =
        listingImageDetails.length > 0 ? listingImageDetails[0].listingImages : {}

      if (!chat || chat === null || chat === undefined) {
        const newDoc: any = new Chat()
        newDoc['participants'] = [{ userId: senderId }, { userId: receiverId }]
        newDoc['adsId'] = new mongoose.Types.ObjectId(adsId)
        newDoc['catId'] = new mongoose.Types.ObjectId(catId)
        chat = await newDoc.save()
      }

      response = {
        status: true,
        data: chat,
        listingName: listingDetails.propertyName,
        listingImages: listingImageDetailsObject,
        code: 200,
        message: 'DATA_RECEIVED'
      }
    } catch (error) {
      console.log(error)
      response = {
        data: {},
        message: error.message,
        status: false,
        code: error.statusCode || response.code
      }
    }
    return res.status(response.code).json(response)
  }


  static readonly adsChatInfo = async (req: AuthenticateRequest, res: Response) => {
    let response: any = {
      data: {},
      message: 'Unprocessable Entity',
      status: false,
      code: 500
    }
    try {
      const { senderId, receiverId, adsId, catId }: any = req.query
      if (!adsId || !catId) throw new CustomError.BadRequestError('REQUIRED_FIELDS')
      let chat: any

      chat = await Chat.findOne({
        adsId: new mongoose.Types.ObjectId(adsId),
        catId: new mongoose.Types.ObjectId(catId),
        $or: [
          {
            $and: [
              { 'participants.0.userId': new mongoose.Types.ObjectId(senderId) },
              { 'participants.1.userId': new mongoose.Types.ObjectId(receiverId) }
            ]
          },
          {
            $and: [
              { 'participants.0.userId': new mongoose.Types.ObjectId(receiverId) },
              { 'participants.1.userId': new mongoose.Types.ObjectId(senderId) }
            ]
          }
        ]
      })

      if (chat?.participants[0]?.delChat || chat?.participants[1]?.delChat) {
        chat = await Chat.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(chat._id)
          },
          {
            $set: {
              'participants.$[elem].delChat': false
            }
          },
          {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'elem.userId': { $in: [new mongoose.Types.ObjectId(senderId)] } }]
          }
        )
      }

      const adsDetails = await Ads.findOne({ _id: adsId })
      if (!adsDetails) throw new CustomError.BadRequestError('ADS_NOT_FOUND')

      if (!chat || chat === null || chat === undefined) {
        const newDoc: any = new Chat()
        newDoc['participants'] = [{ userId: senderId }, { userId: receiverId }]
        newDoc['adsId'] = new mongoose.Types.ObjectId(adsId)
        newDoc['catId'] = new mongoose.Types.ObjectId(catId)
        chat = await newDoc.save()
      }

      response = {
        status: true,
        data: chat,
        adsName: adsDetails.name,
        adsImages: adsDetails?.image,
        code: 200,
        message: 'DATA_RECEIVED'
      }
    } catch (error) {
      console.log(error)
      response = {
        data: {},
        message: error.message,
        status: false,
        code: error.statusCode || response.code
      }
    }
    return res.status(response.code).json(response)
  }


  static readonly notificationCount = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      data: {},
      message: 'Unprocessable Entity',
      status: false,
      code: 500
    }
    try {
      const getCount = await Chat.aggregate([
        {
          $match: {
            participants: {
              $elemMatch: {
                userId: new mongoose.Types.ObjectId(req.auth.userId),
                unseen: { $gt: 0 }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            unseenCount: { $sum: 1 }
          }
        }
      ])
      const overallCount = getCount.length > 0 ? getCount[0].unseenCount : 0

      response = {
        data: overallCount,
        message: 'COUNT_PROVIDED',
        status: true,
        code: 200
      }
    } catch (error) {
      console.log(error)
      response = {
        data: {},
        message: error.message,
        status: false,
        code: error.statusCode || response.code
      }
    }
    return res.status(response.code).json(response)
  }


  static emitChatMessage(message: any) {
    if (ChatController.io) {
      ChatController.io.emit('receivedMessages', message)
    }
  }


  static emitLastSeen() {
    if (ChatController.io) {
      ChatController.io.emit('receivedMessages', {
        lastSeen: Date.now()
      })
    }
  }
}

export { ChatController }