import express from 'express'
import path from 'path'
import multer from 'multer'
const ChatModule = express.Router()
import { ChatController as chatCtrl } from '@abserve/Module/Chat/ChatController'
import { Enum } from '@abserve/Utils/Enum'
import { Server } from 'socket.io'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/temp')
  },
  filename: (req, file, cb) => {
    let filetypes = /png|jpg|gif|jpeg|mp4|mpeg|ogv|webm|ico|wav|wave|mp3|aac|oga|weba|pdf/
    let mimetype = filetypes.test(file.mimetype)
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  }
})

const upload = multer({ storage: storage })
const FileUpload = upload.array('files', 5)

ChatModule.route('/burgerCount')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.notificationCount)
ChatModule.route('/chatInfo')
  .get(/*authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]),*/ chatCtrl.chatInfo)
ChatModule.route('/adsChatInfo')
  .get(chatCtrl.adsChatInfo)
ChatModule.route('/list')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.chatList1)
ChatModule.route('/importantChat/:chatId?')
  .patch(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.markImportantChat)
ChatModule.route('/send/')
  .post(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.sendMessages)
ChatModule.route('/status/:chatId?')
  .put(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.messageStatus)
ChatModule.route('/deleteMessage/:MessageId?')
  .delete(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.deleteMessage)
ChatModule.route('/deleteMultipleMessage')
  .delete(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.multipleDeleteMessage)
ChatModule.route('/clearAll/:chatId?')
  .put(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.clearAllMessage)
ChatModule.route('/deleteChat/:chatId?')
  .delete(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.deleteChat)
ChatModule.route('/deleteMultipleChat/')
  .delete(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.deleteMultipleChat)
ChatModule.route('/deleteConversation/:chatId?')
  .put(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.deleteConversation)
ChatModule.route('/archive/:chatId?')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.archiveChat)
  .put(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.addToArchive)
ChatModule.route('/block/:chatId?')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.listBlockedUser)
  .put(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.updateBlockStatus)
ChatModule.route('/fileUpload/:chatId?')
  .post(FileUpload, chatCtrl.fileUpload)
ChatModule.route('/ads/:chatId?')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.adsListConversation)
ChatModule.route('/:chatId?')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), chatCtrl.listConversation)


export { ChatModule, Server }