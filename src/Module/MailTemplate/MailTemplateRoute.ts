import express from 'express'
const MailTemplateRoute = express.Router()
import { MailTemplateController as mailctrl } from './MailTemplateController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware


MailTemplateRoute.route('/admin/email/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), mailctrl.getAllEmailTemplate)
  .post(authorize([Enum.ROLES.ADMIN]), mailctrl.createEmailTemplate)
  .put(authorize([Enum.ROLES.ADMIN]), mailctrl.updateEmailTemplate)
  .delete(authorize([Enum.ROLES.ADMIN]), mailctrl.deleteEmailTemplate)

export default MailTemplateRoute