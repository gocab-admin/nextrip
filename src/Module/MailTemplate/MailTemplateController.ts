import MailTemplate from './MailTemplate'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { BaseController } from '../BaseControllers'
import { MailTemplateValidator } from './MailTemplateValidator'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { Config } from '@abserve/Config/AppConfig'

class MailTemplateController extends BaseController {
  constructor() {
    super()
  }

  static readonly createEmailTemplate = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { subject, description, body } = req.body

      let validation = await MailTemplateValidator.validateData(req.body , "createEmailTemplate")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const existEmail = await MailTemplate.findOne({ softDel: false, description })

      if (existEmail) throw new CustomError.BadRequestError('THIS_TYPE_OF_EMAIL_ALREADY_EXIST')

      const newEmailTemplate = await MailTemplate.create({
        subject,
        description,
        body
      })

      const savedEmailTemplate = await newEmailTemplate.save()
      if (!savedEmailTemplate) throw new CustomError.BadRequestError('EMAIL_TEMPLATE_NOT_CREATED')


      //RESPONSE
      response.data = savedEmailTemplate
      response.status = true
      response.statusCode = 201
      response.message = 'EMAIL_TEMPLATE_CREATED_SUCCESSFULLY'
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getAllEmailTemplate = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500,
      totalCount: 0
    }
    try {
      let emailTemplates: any
      const { id } = req.params
      const { _page = 1, _limit = 10 } = req.query
      let queryData:any = req.query
      const skip = (Number(_page) - 1) * Number(_limit)

      if (id) {
        emailTemplates = await MailTemplate.findOne({ _id: id })
        if (!emailTemplates) throw new CustomError.BadRequestError('EMAIL_TEMPLATE_NOT_FOUND')
        response.totalCount = 1
      } else {
        let query:any = { softDel: false }
        if (queryData.search) {
          const regex = new RegExp(queryData.search, 'i')
          query = { $or: [{ subject: regex }, { description: regex }] }
        }
        if(queryData.subject) query.subject = { $regex: queryData.subject, $options: 'i' };
        if(queryData.description) query.description = { $regex: queryData.description, $options: 'i' };
        response.totalCount = await MailTemplate.countDocuments(query)
        emailTemplates = await MailTemplate.find(query).skip(skip).limit(Number(_limit))
        
        const isEmailTemplate = !emailTemplates || emailTemplates.length <= 0
        if (isEmailTemplate) throw new CustomError.BadRequestError('EMAIL_TEMPLATE_NOT_FOUND')
      }


      // RESPONSE
      response.data = { emailTemplates }
      response.message = 'EMAIL_TEMPLATES_FETCHED_SUCCESSFULLY'
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


  static readonly updateEmailTemplate = async (req: AuthenticateRequest, res: Response) => {
    let response: any = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const body = req.body

      let validation = await MailTemplateValidator.validateData(req.body , "updateEmailTemplate")
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const updatedEmailTemplate = await MailTemplate.findOneAndUpdate(
        { _id: body.mailId, softDel: false },
        { ...body },
        { new: true }
      )
      if(!updatedEmailTemplate) throw new CustomError.BadRequestError("FAILED_TO_UPDATE_TEMPLATE")


      //RESPONSE
      response.data = updatedEmailTemplate
      response.message = 'EMAIL_TEMPLATE_UPDATED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error: any) {
      console.error('Error', error.message)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteEmailTemplate = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      statusCode: 500
    }
    try {
      const emailId = req.params.id
      if (Config.hiddenSettings.mode == '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_TEST_MODE', [])

      const deletedEmailTemplate = await MailTemplate.findOneAndUpdate(
        { _id: emailId, description: { $nin: ['RESET_PASSWORD', 'VERIFY_OTP'] } },
        { softDel: true },
        { new: true }
      )
      if (!deletedEmailTemplate) throw new CustomError.BadRequestError("DEFAULT_TEMPLATE_ARE_NOT_ALLOWED_TO_DELETE")


      //RESPONSE
      response.data = deletedEmailTemplate
      response.status = true
      response.message = 'TEMPLATE_DELETED_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error: any) {
      console.error('Error', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}

export { MailTemplateController }