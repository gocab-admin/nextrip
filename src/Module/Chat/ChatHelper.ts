import mongoose from 'mongoose'
import ChatFiles from './ChatFiles'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import Chat from '@abserve/Module/Chat/Chat'
import CustomError from '@abserve/errors/index'

const createfolder = async (data: any) => {
  let response = {
    data: {},
    message: 'Unprocessable Entity',
    status: false,
    code: 500
  }
  try {
    let { chatId, fileId } = data

    let finddata = await ChatFiles.find({ $or: [{ _id: fileId }, { groupId: fileId }] })

    if (finddata.length != 0) {
      for (let file of finddata) {
        if (!fs.existsSync(`${process.env.CHAT_FILES_PATH}/${chatId}`)) {
          fs.mkdirSync(`${process.env.CHAT_FILES_PATH}/${chatId}`)
        }
        await FileMoving(file.details, chatId)
      }
    } else {
      throw new CustomError.BadRequestError('DATA_NOT_FOUND')
    }
    response.message = 'DATA_MOVED';
    response.status = true;
    response.code = 200;
    response.data = finddata;
  } catch (error) {
    response.data = {};
    response.message = error.message;
    response.status = false;
    response.code = 500;
  }
  return response
}


const FileMoving = async (file: any, chatId: any) => {
  const currentPath = `${process.env.CHAT_TEMP_PATH}/${file}`
  const newPath = path.join(`${process.env.CHAT_FILES_PATH}/${chatId}`, file)
  fs.rename(currentPath, newPath, function (err) {
    if (err) {
      throw err
    } else {
      console.log('Successfully moved the file!')
    }
  })
}


const messageHelper = async ({ chatId, messages, type, fileId, receiverId }) => {
  let response = {
    status: false,
    code: 500,
    message: 'Unprocessable Entity',
    data: {}
  }
  try {
    let lastIndex: any
    let msgIds: any
    let deliverMessage = []
    let update = {}
    const messageUpdate = await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        $push: {
          message: messages
        }
      },
      { new: true, runValidators: true }
    )

    if (!messageUpdate) throw new CustomError.BadRequestError('MESSAGE_NOT_UPDATED!')

    if (messageUpdate.message.length > 1) {
      lastIndex = messageUpdate.message.length - 1
    } else {
      lastIndex = 0
    }

    let senderData = {
      messageId: messageUpdate.message[lastIndex]._id,
      userId: messages.userId,
      message: messages.message,
      status: 'seen',
      replyId: messages.replyId ? messages.replyId : null,
      imageDetails: messages.imageDetails,
      date: Date.now(),
      file_id: fileId,
      type: type || 'text'
    }

    let receiverData = {
      messageId: messageUpdate.message[lastIndex]._id,
      userId: receiverId,
      message: messages.message,
      status: 'unseen',
      replyId: messages.replyId ? messages.replyId : null,
      imageDetails: messages.imageDetails,
      date: Date.now(),
      file_id: fileId,
      type: type || 'text'
    }

    const reciverParticipant = messageUpdate.participants.find((user) => user.userId.equals(receiverId))

    if (reciverParticipant?.blockStatus) {
      deliverMessage.push(senderData)
    } else {
      deliverMessage.push(senderData)
      deliverMessage.push(receiverData)
    }

    msgIds = messageUpdate.message[lastIndex]._id

    update = {
      $push: {
        deliverMessage: deliverMessage
      },
      $inc: { 'participants.$[elem].unseen': 1 },
      updatedAt: Date.now()
    }

    if (reciverParticipant && reciverParticipant.delChat === true) {
      update['participants.$[elem].delChat'] = false
    }

    let updateMsgToBothUser = await Chat.findOneAndUpdate({ _id: chatId }, update, {
      new: true,
      runValidators: true,
      arrayFilters: [{ 'elem.userId': new mongoose.Types.ObjectId(receiverId) }]
    })

    if (!updateMsgToBothUser){
      throw new CustomError.BadRequestError('MESSAGE_NOT_UPDATED_TO_BOTH_USERS')
    }
    response.data = {
       updateMsgToBothUser,
       msgIds
    }
    response.status = true;
    response.code = 200;
    response.message = 'DATA_PROVIDED';
  } catch (error) {
     response.data = {};
     response.message = error.message;
     response.status = false;
     response.code = 500;
  }
  return response
}


const sendPushNotification = async (data: any) => {
  let response = {
    data: {},
    message: 'Unprocessable Entity',
    status: false,
    code: 500
  }
  try {
    const message = data
    const pushResponse = await axios.post('https://fcm.googleapis.com/v1/projects/airstar-6e36f/messages:send', message,
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVER_KEY}`
        }
      }
    )
    if (!pushResponse){
      throw new CustomError.UnAvailableError('NOTIFICATION_NOT_SENT!')
    }
    response.data = pushResponse;
    response.message = 'sent push notification';
    response.status = true;
    response.code = 200;
  } catch (error) {
    response.data = {};
    response.message = error.message;
    response.status = false;
    response.code = 500;
  }
  return response
}

export { createfolder, messageHelper, FileMoving, sendPushNotification }
