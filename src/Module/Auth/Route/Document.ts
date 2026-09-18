import express from 'express'
import multer from 'multer'
import path from 'path'
const DocumentModule = express.Router()
import { DocumentController as documentctrl } from '../Controller/DocumentController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

const DocumentProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../public/UserDocuments'))
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

let DocumentProfile = multer({ storage: DocumentProfileStorage })

DocumentModule.route('/user/:userId?')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DocumentProfile.any(), documentctrl.uploadDocument)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), documentctrl.getUserDocuments)
DocumentModule.route('/updateStatus')
  .patch(authorize([Enum.ROLES.ADMIN]), documentctrl.updateStatus)  
DocumentModule.route('/expiredusers')
  .get(documentctrl.getExpiredUsers)  


export default DocumentModule