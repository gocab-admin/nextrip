import express from 'express'
const ReportListingModule = express.Router()
import { ReportListingController as reportlistingctrl } from './ReportListingController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware


ReportListingModule.route('/description/:reportId?')
  .post(authorize([Enum.ROLES.ADMIN]), reportlistingctrl.createReportDescription)
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), reportlistingctrl.getReportDescription)
  .put(authorize([Enum.ROLES.ADMIN]), reportlistingctrl.updateReportDescription)
  .delete(authorize([Enum.ROLES.ADMIN]), reportlistingctrl.deleteReportDescription)
ReportListingModule.route('/reportTitle')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), reportlistingctrl.getReportTitle)
ReportListingModule.route('/update/status/:reportId')
  .put(authorize([Enum.ROLES.ADMIN]), reportlistingctrl.updateStatus)
ReportListingModule.route('/listing/:listingId')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), reportlistingctrl.reportListing)
ReportListingModule.route('/listing/:reportId?')
  .get(authorize([Enum.ROLES.ADMIN]), reportlistingctrl.getListingReports)

export default ReportListingModule