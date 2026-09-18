import mongoose from 'mongoose'
import ReportListing from './ReportListing'
import ReportDescription from './ReportDescription'
import Listings from '../Listing/Model/Listings'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { BaseController } from '../BaseControllers'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import { ReportListingValidator } from './ReportListingValidator'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'

class ReportListingController extends BaseController {
  constructor() {
    super()
  }

  static readonly reportListing = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const listingId = req.params.listingId
      const userId = req.auth.userId
      const { reason, subReason, details } = req.body

      if (!listingId) throw new CustomError.BadRequestError('LISTINGID_IS_REQUIRED')
      const listingData = await Listings.findOne({ _id: listingId, softdel: false, status: 'approve', availability: true })
      if (!listingData) throw new CustomError.BadRequestError('LISTING_NOT_FOUND')

      const reportData = {
        listingId: listingId,
        userId: userId,
        reason: reason,
        subReason: subReason,
        details: details,
        createdAt: new Date(),
      }
      const newReport = await ReportListing.create(reportData)
      if (!newReport) throw new CustomError.BadRequestError('LISTING_NOT_REPORTED')


      // RESPONSE
      response.data = newReport
      response.status = true
      response.statusCode = 201
      response.message = 'REPORT_CREATED_SUCCESSFULLY'
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getListingReports = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      const reportId = req.params.reportId
      const queryData: any = req.query;
      const pageQuery: any = await this.paginationBuilder(req.query);
      const like = {}
      const matchCondition = reportId ? { _id: new mongoose.Types.ObjectId(reportId) } : {};
      if (queryData.search) {
        const searchRegex = { $regex: queryData.search, $options: 'i' };
        like['$or'] = [
          { 'propertyCategoryDetails.category': searchRegex },
          { 'listingDetails.propertyName': searchRegex },
          { 'reportingUserDetails.firstname': searchRegex },
          { 'listingOwnerDetails.firstname': searchRegex },
        ];
      }
      if (queryData.category) like['propertyCategoryDetails.category'] = { $regex: queryData.category, $options: 'i' };
      if (queryData.propertyName) like['listingDetails.propertyName'] = { $regex: queryData.propertyName, $options: 'i' };
      if (queryData.username) like['reportingUserDetails.firstname'] = { $regex: queryData.username, $options: 'i' };
      if (queryData.providername) like['listingOwnerDetails.firstname'] = { $regex: queryData.providername, $options: 'i' };


      const pipeline: any = [
        { $match: matchCondition },
        {
          $lookup: {
            from: 'listings',
            localField: 'listingId',
            foreignField: '_id',
            as: 'listingDetails'
          }
        },
        { $unwind: { path: '$listingDetails', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'properties',
            localField: 'listingDetails.propertyType',
            foreignField: '_id',
            as: 'propertyTypeDetails'
          }
        },
        { $unwind: { path: '$propertyTypeDetails', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'propertycategories',
            localField: 'listingDetails.propertyCategory',
            foreignField: '_id',
            as: 'propertyCategoryDetails'
          }
        },
        { $unwind: { path: '$propertyCategoryDetails', preserveNullAndEmptyArrays: true } },
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
            from: 'users',
            localField: 'listingDetails.userId',
            foreignField: '_id',
            as: 'listingOwnerDetails'
          }
        },
        { $unwind: { path: '$listingOwnerDetails', preserveNullAndEmptyArrays: true } },
        { $match: like },
        { $sort: { _id: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            reportDetails: [
              { $skip: pageQuery.skip },
              { $limit: pageQuery.take },
              {
                $project: {
                  _id: 1,
                  reason: 1,
                  subReason: 1,
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
                  'listingDetails.propertyName': 1,
                  'propertyTypeDetails.property': 1,
                  'propertyCategoryDetails.category': 1,
                  'listingOwnerDetails.firstname': 1,
                  'listingOwnerDetails.lastname': 1,
                  'listingOwnerDetails.phoneCode': 1,
                  'listingOwnerDetails.phone': 1,
                  'listingOwnerDetails.email': 1
                }
              }
            ]
          }
        }
      ];
      const results = await ReportListing.aggregate(pipeline);
      const totalCount = results[0]?.totalCount[0]?.count || 0;
      const reportDetails = results[0]?.reportDetails || [];

      if (!reportDetails.length) throw new CustomError.BadRequestError('NO_REPORTS_FOUND');
      
      // RESPONSE
      response.data = { reportDetails }
      response.totalCount = totalCount;
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

      let validation = await ReportListingValidator.validateData(req.body , "updateStatus")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      reportStatus = await ReportListing.findOne({ _id: reportId });
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

  static readonly createReportDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { title, subCategoryType, subOptions } = req.body
      const userId = req.auth.userId

      if(subOptions?.length > 5) throw new CustomError.BadRequestError('SUBOPTIONS_LIMIT_EXCEEDS')

      let validation = await ReportListingValidator.validateData(req.body , "createReportDescription")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const reportdescription = await ReportDescription.findOne({ title, softdel: false })
      if (reportdescription) throw new CustomError.BadRequestError('THIS_TYPE_OF_TITLE_ALREADY_EXIST')

      const reportDescription = await ReportDescription.create({
        title,
        subCategoryType,
        subOptions,
        createdBy: userId,
        addedAt: Date.now()
      })

      const savedreportDescription = await reportDescription.save()
      if (!savedreportDescription) throw new CustomError.BadRequestError('REPORT_DESCRIPTION_NOT_CREATED')


      // RESPONSE
      response.data = { savedreportDescription }
      response.status = true
      response.statusCode = 201
      response.message = 'REPORT_DESCRIPTION_CREATED_SUCCESSFULLY'
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getReportDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      const { reportId } = req.params;
      const queryData: any = req.query;
      const pageQuery: any = await this.paginationBuilder(req.query);

      let matchCondition: any = { softdel: false };

      if (queryData.search) {
          const regex = { $regex: new RegExp(queryData.search, 'i') };
          matchCondition.$or = [{ title: regex }];
      }

      if (queryData.title) matchCondition.title = { $regex: new RegExp(queryData.title, 'i') };
      

      let reportDescription: any;
      let totalCount: number;

      if (reportId) {
          reportDescription = await ReportDescription.findOne({ _id: reportId, softdel: false });
          if (!reportDescription) throw new CustomError.BadRequestError('REPORT_DESCRIPTION_NOT_FOUND');
          totalCount = 1;
      } else {
          const pipeline: any = [
            { $match: matchCondition },
            { $sort: { addedAt: -1 } },
            {
                $facet: {
                    totalCount: [{ $count: 'total' }],
                    reportDescriptions: [
                        { $skip: pageQuery.skip },
                        { $limit: pageQuery.take }
                    ]
                }
            }
        ];

        const results = await ReportDescription.aggregate(pipeline);
        totalCount = results[0]?.totalCount[0]?.total || 0;
        reportDescription = results[0]?.reportDescriptions || [];

        if (!reportDescription?.length) throw new CustomError.BadRequestError('NO_REPORT_DESCRIPTION_FOUND_FOR_THIS_CATEGORY');
        
      }

      // RESPONSE
      response.data = { reportDescription };
      response.totalCount = totalCount;
      response.message = 'REPORT_DESCRIPTION_FETCHED_SUCCESSFULLY';
      response.status = true;
      response.statusCode = 200;
  } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getReportTitle = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      let reportTitle: any
      let count: any

      reportTitle = await ReportDescription.find({ softdel: false }, { title: 1, subCategoryType: 1 })
      count = reportTitle.length
      if (!reportTitle?.length) throw new CustomError.BadRequestError('NO_FOUND_FOR_CATEGORY')


      // RESPONSE
      response.data = { reportTitle }
      response.totalCount = count
      response.message = 'REPORT_TITLE_FETCHED_SUCCESSFULLY'
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

  static readonly updateReportDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      const { reportId } = req.params;
      const { title, subCategoryType, subOptions, status } = req.body;

      let validation = await ReportListingValidator.validateData(req.body , "updateReportDescription");
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate);

      const reportDescription: any = await ReportDescription.findOne({ _id: reportId, softdel: false });
      if (!reportDescription) throw new CustomError.BadRequestError('REPORT_DESCRIPTION_NOT_FOUND');

      reportDescription.title = title || reportDescription.title;
      reportDescription.subCategoryType = subCategoryType || reportDescription.subCategoryType;
      reportDescription.subOptions = subOptions || reportDescription.subOptions;
      reportDescription.status = status || reportDescription.status;

      if(subCategoryType === 'text' || subCategoryType === 'none') {
        reportDescription.subOptions = []
      }

      const newReportDescription = await reportDescription.save();
      if (!newReportDescription) throw new CustomError.BadRequestError('REPORT_DESCRIPTION_NOT_UPDATED');


      // RESPONSE
      response.data = { newReportDescription }
      response.message = 'REPORT_DESCRIPTION_UPDATED_SUCCESSFULLY'
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

  static readonly deleteReportDescription = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      const { reportId } = req.params

      const deletedReportDescription = await ReportDescription.findOne({ _id: reportId })
      deletedReportDescription.softdel = true
      await deletedReportDescription.save()
      if (!deletedReportDescription) throw new CustomError.BadRequestError("REPORT_DESCRIPTION_NOT_DELETED")

        
      // RESPONSE
      response.data = { deletedReportDescription }
      response.message = 'REPORT_DESCRIPTION_DELETED_SUCCESSFULLY'
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

export { ReportListingController }