import express from 'express'
import multer from 'multer'
import path from 'path'
const noticationModule = express.Router()
import { NotificationController as notifiCtrl } from '@abserve/Module/Notification/NotificationController'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
import { Enum } from '@abserve/Utils/Enum'
const { authorize } = AuthMiddleware

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/notification'))
  },
  filename: (req, file, cb) => {
    let filetypes = /jpeg|jpg|ico|svg|png/
    let mimetype = filetypes.test(file.mimetype)
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  }
})
let imageUpload = multer({ storage: storage })

noticationModule.route('/pushNotification/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), notifiCtrl.getPushNotificationTemplate)
  .post(authorize([Enum.ROLES.ADMIN]), notifiCtrl.createPushNotificationTemplate)
  .put(authorize([Enum.ROLES.ADMIN]), notifiCtrl.updatePushNotificationTemplate)
  .delete(authorize([Enum.ROLES.ADMIN]), notifiCtrl.deletePushNotificationTemplate)
noticationModule.route('/')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER, Enum.ROLES.PROVIDER]), notifiCtrl.listNotificationOfUser)
noticationModule.route('/lists')
  .get(authorize([Enum.ROLES.ADMIN]), notifiCtrl.listNotification)
noticationModule.route('/markAsRead')
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER, Enum.ROLES.PROVIDER]), notifiCtrl.markAsRead)
noticationModule.route('/clearAll/')
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER, Enum.ROLES.PROVIDER]), notifiCtrl.updateStatus)
noticationModule.route('/clear/:notificationId?')
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER, Enum.ROLES.PROVIDER]), notifiCtrl.updateOneNotification)
noticationModule.route('/send')
  .post(authorize([Enum.ROLES.ADMIN]), imageUpload.single('file'), notifiCtrl.sendNotification)
noticationModule.route('/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), notifiCtrl.viewNotification)
  .put(authorize([Enum.ROLES.ADMIN]), notifiCtrl.deleteNotification)

export default noticationModule