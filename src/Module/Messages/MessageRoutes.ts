import express from 'express'
import multer from 'multer'
import path from 'path'
const messageModule = express.Router()
import { MessageController as msgCtrl } from '@abserve/Module/Messages/MessageController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/Message/Files'))
  },
  filename: (req, file, cb) => {
    let filetypes = /jpeg|jpg|png|svg|ico|gif|mp4|MPEG-4|mkv|pdf/
    let mimetype = filetypes.test(file.mimetype)
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  }
})

const fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
  }
})

messageModule.route('/messages')
  .post(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.ADMIN, Enum.ROLES.USER]), fileUpload.array('files', 5), msgCtrl.createMessage)
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.ADMIN, Enum.ROLES.USER]), msgCtrl.getAllmessages)
  .put(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.ADMIN, Enum.ROLES.USER]), msgCtrl.archiveMessage)
  .delete(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.ADMIN, Enum.ROLES.USER]), msgCtrl.deleteMessage)
messageModule.route('/archivedMessages')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.ADMIN, Enum.ROLES.USER]), msgCtrl.getArchiveMessage)
messageModule.route('/supportMessages')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER]), msgCtrl.getSupportMessages)
messageModule.route('/getMessage/:id')
  .get(authorize([Enum.ROLES.PROVIDER, Enum.ROLES.USER, Enum.ROLES.ADMIN]), msgCtrl.getSingleMessage)

export default messageModule