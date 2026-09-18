import mongoose from 'mongoose'
import ReportUser from './ReportUser'
import ReportUserDescription from './ReportUserDescription'
import User from '../Auth/Model/User'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { BaseController } from '../BaseControllers'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import { ReportUserValidator } from './ReportUserValidator'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { Constants } from '@abserve/Config/Constants'

class ReportUserController extends BaseController {
  constructor() {
    super()
  }

  static readonly reportUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const hostId = req.params.hostId
      const userId = req.auth.userId
      const { reason, details } = req.body

      if (!hostId) throw new CustomError.BadRequestError('USERID_IS_REQUIRED')

      if (hostId === userId) throw new CustomError.BadRequestError('CANNOT_REPORT_YOURSELF')
        
      const hostData = await User.findOne({ _id: hostId, softdel: false, isActive: true, verified: true })
      if (!hostData) throw new CustomError.BadRequestError('USER_NOT_FOUND')

      const reportData = {
        hostId: hostId,
        userId: userId,
        reason: reason,
        details: details,
        createdAt: new Date()
      }
      const newReport = await ReportUser.create(reportData)
      if (!newReport) throw new CustomError.BadRequestError('USER_NOT_REPORTED')


      // RESPONSE
      response.data = newReport
      response.status = true
      response.statusCode = 201
      response.message = 'REPORT_USER_CREATED_SUCCESSFULLY'
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getUserReports = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const reportId = req.params.reportId
      const matchCondition = reportId ? { _id: new mongoose.Types.ObjectId(reportId) } : {};

      const reportDetails = await ReportUser.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: 'users',
            localField: 'hostId',
            foreignField: '_id',
            as: 'reportingHostDetails'
          }
        },
        { $unwind: { path: '$reportingHostDetails', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'reportingUserDetails'
          }
        },
        { $unwind: { path: '$reportingUserDetails', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'reportusers', 
            let: { hostId: "$hostId", currentReportId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$hostId", "$$hostId"] } } },
              { $match: { $expr: { $ne: ["$_id", "$$currentReportId"] } } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'hostId',
                  foreignField: '_id',
                  as: 'reportingHostDetails'
                }
              },
              { $unwind: { path: '$reportingHostDetails', preserveNullAndEmptyArrays: true } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'reportingUserDetails'
                }
              },
              { $unwind: { path: '$reportingUserDetails', preserveNullAndEmptyArrays: true } },
              { $replaceRoot: { newRoot: "$$ROOT" } }
            ],
            as: 'previousHostReports'
          }
        },
        {
          $project: {
            _id: 1,
            reason: 1,
            details: 1,
            status: 1,
            adminComments: 1,
            createdAt: 1,
            updatedAt: 1,
            'reportingUserDetails.firstname': 1,
            'reportingUserDetails.lastname': 1,
            'reportingUserDetails.phoneCode': 1,
            'reportingUserDetails.phone': 1,
            'reportingUserDetails.email': 1,
            'reportingHostDetails.firstname': 1,
            'reportingHostDetails.lastname': 1,
            'reportingHostDetails.phoneCode': 1,
            'reportingHostDetails.phone': 1,
            'reportingHostDetails.email': 1,
             previousHostReports: {
                 _id: 1,
                 reason: 1,
                 details: 1,
                 status: 1,
                 adminComments: 1,
                 createdAt: 1,
                 updatedAt: 1,
                 'reportingUserDetails.firstname': 1,
                 'reportingUserDetails.lastname': 1,
                 'reportingUserDetails.phoneCode': 1,
                 'reportingUserDetails.phone': 1,
                 'reportingUserDetails.email': 1,
                 'reportingHostDetails.firstname': 1,
                 'reportingHostDetails.lastname': 1,
                 'reportingHostDetails.phoneCode': 1,
                 'reportingHostDetails.phone': 1,
                 'reportingHostDetails.email': 1
            }
          }
        }
      ]);


      // RESPONSE
      response.data = { reportDetails }
      response.message = 'REPORT_FETCHED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly updateStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let reportStatus: any, updateStatus: any
      const { reportId } = req.params
      const { status, comments } = req.body

      reportStatus = await ReportUser.findOne({ _id: reportId });
      if (!reportStatus) throw new CustomError.BadRequestError('REPORT_NOT_FOUND')
      reportStatus.status = status;
      reportStatus.adminComments = comments;
      reportStatus.updatedAt = new Date();
      updateStatus = await reportStatus.save();

      if(!updateStatus) throw new CustomError.BadRequestError('STATUS_NOT_UPDATED')

      let notifiData = {
          forWhom: reportStatus.userId,
          message: `Your Report is ${status}`,
          fromWhom: "ADMIN",
          userType: "USER",
          title: "Report Status Updated",
      }
      await NotificationController.notification(notifiData);


      // RESPONSE
      response.data = updateStatus
      response.status = true
      response.statusCode = 200
      response.message = 'REPORT_STATUS_UPDATED_SUCCESSFULLY'
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly blockUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {

      let userStatus: any, updateStatus: any;
      const { hostId } = req.params;
      const { blockStatus } = req.body;
  
      userStatus = await User.findOne({ _id: hostId });
      if (!userStatus) throw new CustomError.BadRequestError('USER_NOT_FOUND');
  
      const isBlocked = userStatus.softdel;
  
      if (blockStatus === Constants.blockStatus.block) {
        if (isBlocked) throw new CustomError.BadRequestError('USER_ALREADY_BLOCKED');
        userStatus.softdel = true;
      } else{
        if (!isBlocked) throw new CustomError.BadRequestError('USER_ALREADY_UNBLOCKED');
        userStatus.softdel = false;
      }
      
      updateStatus = await userStatus.save();
      if (!updateStatus) throw new CustomError.BadRequestError('USER_BLOCKING_STATUS_NOT_UPDATED');


      // RESPONSE
      response.data = updateStatus
      response.status = true
      response.statusCode = 200
      response.message = blockStatus === Constants.blockStatus.block ? 'USER_BLOCKED_SUCCESSFULLY' : 'USER_UNBLOCKED_SUCCESSFULLY';
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly createReportUserDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { title } = req.body
      const userId = req.auth.userId

      let validation = await ReportUserValidator.validateData(req.body , "createReportUserDescription")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const reportuserdescription = await ReportUserDescription.findOne({ title, softdel: false })
      if (reportuserdescription) throw new CustomError.BadRequestError('THIS_TYPE_OF_TITLE_ALREADY_EXIST')

      const reportUserDescription = await ReportUserDescription.create({
        title,
        createdBy: userId,
        addedAt: Date.now()
      })

      const savedreportUserDescription = await reportUserDescription.save()
      if (!savedreportUserDescription) throw new CustomError.BadRequestError('REPORT_USER_DESCRIPTION_NOT_CREATED')


      // RESPONSE
      response.data = { savedreportUserDescription }
      response.status = true
      response.statusCode = 201
      response.message = 'REPORT_USER_DESCRIPTION_CREATED_SUCCESSFULLY'
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getReportUserDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      const { reportId } = req.params
      const { query, search }: any = req.query
      let pageQuery: any = await this.paginationBuilder(query)
      let reportUserDescription: any
      let count: any


      if (reportId) {
        reportUserDescription = await ReportUserDescription.findOne({ _id: reportId, softdel: false })
        if (!reportUserDescription) throw new CustomError.BadRequestError('REPORT_USER_DESCRIPTION_NOT_FOUND')
        count = 1
      }
      else {
        const query = { softdel: false }
        if(search) {
          const regex = new RegExp(search, 'i')
          query['title'] = regex
        }
        reportUserDescription = await ReportUserDescription.find(query).skip(pageQuery.skip).limit(pageQuery.take)
        count = reportUserDescription.length
        if (!reportUserDescription?.length) throw new CustomError.BadRequestError('NO_REPORT_DESCRIPTION_FOUND_FOR_THIS_CATEGORY')
      }


      // RESPONSE
      response.data = { reportUserDescription }
      response.totalCount = count
      response.message = 'REPORT_USER_DESCRIPTION_FETCHED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateReportUserDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      const { reportId } = req.params;
      const { title, status } = req.body;

      let validation = await ReportUserValidator.validateData(req.body , "updateReportUserDescription");
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate);

      const reportUserDescription = await ReportUserDescription.findOne({ _id: reportId, softdel: false });
      if (!reportUserDescription) throw new CustomError.BadRequestError('REPORT_USER_DESCRIPTION_NOT_FOUND');

      reportUserDescription.title = title || reportUserDescription.title;
      reportUserDescription.status = status ||  reportUserDescription.status
      
      const newReportDescription = await reportUserDescription.save();
      if (!newReportDescription) {
        throw new CustomError.BadRequestError('REPORT_DESCRIPTION_NOT_UPDATED');
      }

      // RESPONSE
      response.data = { newReportDescription };
      response.message = 'REPORT_USER_DESCRIPTION_UPDATED_SUCCESSFULLY';
      response.status = true;
      response.statusCode = 200;
    } catch (error: any) {
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }

  static readonly deleteReportUserDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      const { reportId } = req.params

      const reportUserDescription = await ReportUserDescription.findOne({ _id: reportId })
      reportUserDescription.softdel = true
      await reportUserDescription.save()
      if (!reportUserDescription) throw new CustomError.BadRequestError("REPORT_DESCRIPTION_NOT_DELETED")

        
      // RESPONSE
      response.data = { reportUserDescription }
      response.message = 'REPORT_USER_DESCRIPTION_DELETED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

}

export { ReportUserController }