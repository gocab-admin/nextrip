import express from 'express'
const ReportUserModule = express.Router()
import { ReportUserController as reportuserctrl } from './ReportUserController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware


ReportUserModule.route('/description/:reportId?')
  .post(authorize([Enum.ROLES.ADMIN]), reportuserctrl.createReportUserDescription)
  .get(reportuserctrl.getReportUserDescription)
  .put(authorize([Enum.ROLES.ADMIN]), reportuserctrl.updateReportUserDescription)
  .delete(authorize([Enum.ROLES.ADMIN]), reportuserctrl.deleteReportUserDescription)
ReportUserModule.route('/update/status/:reportId')
  .put(authorize([Enum.ROLES.ADMIN]), reportuserctrl.updateStatus)
ReportUserModule.route('/:hostId')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), reportuserctrl.reportUser)
ReportUserModule.route('/:reportId?')
  .get(authorize([Enum.ROLES.ADMIN]), reportuserctrl.getUserReports)
ReportUserModule.route('/block/:hostId')
  .put(authorize([Enum.ROLES.ADMIN]), reportuserctrl.blockUser)

export default ReportUserModule