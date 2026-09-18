import Chat from '@abserve/Module/Chat/Chat'
import mongoose from 'mongoose'
import CustomError from '@abserve/errors/index'
import { Server as HttpServer } from 'http'
import { Server as HttpsServer } from 'https'
import { Server, Socket } from 'socket.io'
import { createfolder, messageHelper } from './ChatHelper'

class SocketServer {
  private readonly io: Server

  constructor(server: HttpServer | HttpsServer) {
    this.io = new Server(server)
    try {
      // For connection
      // this.io.use((socket:CustomSocket,next)=>{
      //   //authenticate the connection
      //   authenticateSocket(socket,next);
      // });

      this.io.on('connection', (socket: Socket) => {
        console.log('A User connected')


        //Handle events here
        socket.on('joinChannel', async (data, callback) => {
          let response = {
            status: false,
            code: 500,
            message: 'Unprocessable Entity',
            data: {}
          }
          try {
            let { chatId, receiverId } = data
            let senderId = data.senderId

            if (!senderId || !receiverId) throw new CustomError.BadRequestError('PLEASE_PROVIDE_ALL_THE_DETAILS')
            if (!chatId) throw new CustomError.BadRequestError('PLEASE_PROVIDE_CHATID')

            const findChat = await Chat.findOne({ _id: chatId })
            if (!findChat) throw new CustomError.BadRequestError('GIVEN_CHATID_RECORD_DOESNT_EXIST')

            let conChannel = `CHATS_${findChat._id}`

            socket.join(conChannel)

            console.log(`User with socket ID ${socket.id} has joined room ${conChannel}`)
            response.status = true;
            response.data = {
              channel: conChannel,
              chat: findChat
            }
            response.code = 200;
            response.message = 'CONNECTION_ESTABLISHED';
          } catch (error) {
            response.data = {};
            response.message = error.message;
            response.status = false;
            response.code = 500;
          }
          //callback(response)
          if (typeof callback === 'function') callback(response)
        })


        socket.on('sendMessage', async (data, callback) => {
          let response = {
            data: {},
            message: 'Service Unavailable',
            status: false,
            code: 503
          }
          try {
            let { senderId, receiverId, message, replyId, chatId, type, fileId } = data
            let updateMsgToBothUser: any
            let msgIds = []

            if (!receiverId) throw new CustomError.BadRequestError('PROVIDE_RECEIVER_ID')

            const findChat = await Chat.findOne({ _id: chatId })
            if (!findChat) throw new CustomError.BadRequestError('NO_CHATS_FOUND!')

            let messages = {
              userId: senderId,
              message: message,
              replyId: replyId || null,
              file_id: fileId,
              imageDetails: null,
              date: Date.now(),
              type: type || 'text'
            }

            //check block status
            let checkSenderBlockStatus = await Chat.aggregate([
              { $unwind: '$participants' },
              {
                $match: {
                  $and: [
                    {
                      'participants.userId': new mongoose.Types.ObjectId(senderId)
                    },
                    { 'participants.blockStatus': true },
                    { _id: new mongoose.Types.ObjectId(chatId) }
                  ]
                }
              }
            ])

            console.log('cheackBlk', JSON.stringify(checkSenderBlockStatus))

            if (checkSenderBlockStatus[0]?.participants.blockStatus === true) throw new CustomError.BadRequestError('USER_IS_BLOCKED')

            if (type === 'file') {
              const makeFolder = await createfolder({ chatId, fileId })
              if (makeFolder.status === false) throw new CustomError.BadRequestError('FOLDER_NOT_CREATED')

              for (const files of makeFolder['data'] as any[]) {
                console.log('message', message)
                console.log('typeOfMessage', typeof message)

                if (message === '' || message === null || message === undefined) {
                  messages.message = files.details
                }
                messages.imageDetails = files.details

                updateMsgToBothUser = await messageHelper({ chatId, messages, type, fileId, receiverId })

                if (updateMsgToBothUser.status === false) throw new CustomError.BadRequestError('MESSAGE_FUNC_ISSUE!')

                msgIds.push(updateMsgToBothUser.data.msgIds)
              }
            }

            if (type !== 'file') {
              updateMsgToBothUser = await messageHelper({ chatId, messages, type, fileId, receiverId })

              if (updateMsgToBothUser.status === false) throw new CustomError.BadRequestError('UPDATE_FUNC_ERROR')

              msgIds.push(updateMsgToBothUser.data.msgIds)
            }

            let newMessages = await Chat.aggregate([
              {
                $match: {
                  _id: new mongoose.Types.ObjectId(chatId)
                }
              },
              {
                $unwind: {
                  path: '$deliverMessage'
                }
              },
              {
                $addFields: {
                  'deliverMessage.fileUrl': {
                    $cond: {
                      if: {
                        $ne: ['$files', []]
                      },
                      then: {
                        $concat: [
                          /* process.env.BASE_URL, */ 'public/files/',
                          {
                            $toString: '$_id'
                          },
                          '/',
                          '$deliverMessage.imageDetails'
                        ]
                      },
                      else: ''
                    }
                  }
                }
              },
              /*{
                  '$addFields': {
                    'message.fileUrl': {
                      '$cond': {
                        'if': {
                          '$eq': [
                            '$message.type', 'file'
                          ]
                        }, 
                        'then': {
                          '$concat': [
                            process.env.BASE_URL,'public/files/',{
                              '$toString': '$_id'
                            },'/','$message.imageDetails'
                          ]
                        }, 
                        'else': '$$REMOVE'
                      }
                    }
                  }
                },*/ {
                $match: {
                  'deliverMessage.messageId': {
                    $in: msgIds
                  }
                }
              },
              /*{
                  '$match':{
                    'message._id':{
                      '$in': msgIds
                    }
                  }
                },*/ {
                $project: {
                  message: '$deliverMessage',
                  _id: 0
                }
              },
              /*{
                  '$project':{
                    'message':'$message',
                    '_id':0
                  }
                },*/ {
                $sort: {
                  'deliverMessage.date': -1
                }
              } /*{
                  '$sort': {
                    'message.date': -1
                  }
                }*/
            ])
            this.io.to(`CHATS_${chatId}`).emit('messageBroadcast', {
              data: {
                chatId: chatId,
                newMessages
              }
            })

            response.data = {
              messages: [updateMsgToBothUser],
              newMessage: newMessages
            }
            response.message = 'CONNECTION_ESTABLISHED';
            response.status = true;
            response.code = 200;
          } catch (error) {
            console.log(error);
            response.data = {};
            response.status = false;
            response.code = 500;
          }
          //callback(response)
          if (typeof callback === 'function') callback(response)
        })


        socket.on('seenMessages', async (data, callback) => {
          let response = {
            data: {},
            message: 'Service Unavailable',
            status: false,
            code: 503
          }
          try {
            let { chatId, userId } = data

            const findData = await Chat.findOne({ _id: chatId })

            if (!findData) throw new CustomError.BadRequestError('CHAT_NOT_FOUND!')

            const updateToSeen = await Chat.findOneAndUpdate(
              { _id: chatId, 'deliverMessage.userId': userId },
              {
                $set: {
                  'deliverMessage.$[elem].status': 'seen',
                  'participants.$[elem].unseen': 0
                }
              },
              {
                arrayFilters: [{ 'elem.userId': userId }],
                new: true
              }
            )

            if (!updateToSeen) {
              throw new CustomError.BadRequestError('NOT_UPDATED')
            }
            await Chat.findOneAndUpdate(
              {
                _id: chatId,
                $and: [
                  {
                    'deliverMessage.userId': {
                      $in: [findData.participants[0].userId, findData.participants[1].userId]
                    }
                  },
                  {
                    deliverMessage: {
                      $elemMatch: { status: 'seen' }
                    }
                  }
                ]
              },
              {
                $set: {
                  'message.$[elem].status': 'seen'
                }
              },
              {
                arrayFilters: [{ 'elem.status': 'unseen' }],
                new: true
              }
            )

            //emit the sawMessage
            this.io.to(`CHATS_${chatId}`).emit('messageSawBroadCast', {
              data: {
                userId: userId,
                date: Date.now(),
                chatId: chatId
              }
            })

            response.data = {
              updatedMsg: updateToSeen
            }
            response.message = 'UPDATED_TO_SEEN';
            response.status = true;
            response.code = 200;
          } catch (error) {
            console.log(error);
            response.data = {};
            response.message = error.message;
            response.status = false;
            response.code = 503;
          }
          //callback(response)
          if (typeof callback === 'function') callback(response)
        })


        socket.on('exitChannel', async (data, callback) => {
          let response = {
            data: {},
            message: 'Service Unavailable',
            status: false,
            code: 503
          }
          try {
            let { chatId } = data

            const findData = await Chat.findOne({ _id: chatId })

            if (!findData) throw new CustomError.BadRequestError('DATA_NOT_FOUND!')
            const conChat = `CHATS_${findData._id}`
            socket.leave(conChat)

            response.data = {
              conChat,
              chat: findData
            }
            response.message =  'CONNECTION_DISCONNECTED';
            response.status = true;
            response.code = 200;
          } catch (error) {
            console.log(error);
            response.data = {};
            response.message =  error.message;
            response.status = false;
            response.code = 500;
          }
          //callback(response)
          if (typeof callback === 'function') callback(response)
        })

        //For disconnection
        socket.on('disconnect', () => {
          console.log('A User disconnected')
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Add a public method to access the io property
  public getIo(): Server {
    return this.io
  }
}

export default SocketServer