import { Response } from 'express'
import { BaseController } from '@abserve/Module/BaseControllers'
import { AuthValidator } from '@abserve/Module/Auth/Validators/AuthValidator'
import { Constants } from '@abserve/Config/Constants'
import { SingleFileRequest, AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { VerificationService } from '@abserve/Module/Services/Common/VerificationService'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { Config } from '@abserve/Config/AppConfig'
import { permissions } from '@abserve/Config/Permissions'
import { Enum } from '@abserve/Utils/Enum'
import Admin from '@abserve/Module/Auth/Model/Admin'
import AdminRole from '@abserve/Module/Auth/Model/AdminRole'
import User from '@abserve/Module/Auth/Model/User'
import verifyOtp from '@abserve/Module/Auth/Model/VerifyOtp'
import nodemailer from 'nodemailer'
import moment from 'moment'
import CustomError from '@abserve/errors/index'
import { uploadToLocal, removeFile, cloudinaryUpload } from '@abserve/Module/FileUpload/index'
import { FolderConfig } from '@abserve/Module/FileUpload/FolderConfig'

class AdminController extends BaseController {
  constructor() {
    super()
  }

  static readonly adminData = async (id : string) =>{
    try{
      const data = await Admin.findById(id).exec()
      if (!data) {
        throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')
      }else{
        return data;
      }
    }
    catch(error){
      throw new Error(error)
    }
  }


  static readonly addAdmin = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const validation = await AuthValidator.validateData(body , "addUser")
      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const validateEmailPhone = await Admin.find({ softdel: false }, { email: 1, phone: 1, firstname: 1 }).exec()
      if (validateEmailPhone.length !== 0) {
        for (let validate of validateEmailPhone) {
          if (body.email) {
            if (validate.email.toString() === body.email.toString())
              throw new CustomError.UnProcessableError('EMAIL_ALREADY_EXISTS', [])
          }
          if (body.phone) {
            if (validate.phone.toString() === body.phone.toString())
              throw new CustomError.UnProcessableError('PHONE_NUMBER_ALREADY_EXISTS', [])
          }
        }
      }
      let profileImage: any
      let publicId: any
      if (req.file) {
        // profileImage = await uploadToLocal( req.file, FolderConfig.AdminProfile )
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.AdminProfile )

        profileImage = cloudImage.url
        publicId = cloudImage.publicId
      }

      //ADMIN DOCUMENT CREATION
      let newDoc: any = new Admin({
        ...body,
        profileImage: profileImage || '',
        publicId: publicId || ''
      })
      let saltNHash = newDoc.setPassword(body.password)
      newDoc.hash = saltNHash.hash
      newDoc.salt = saltNHash.salt
      let adminData = await newDoc.save()

      let tokenData = {
        userId: adminData._id,
        email: adminData.email,
        name: adminData.firstname,
        type: Constants.userRole.ADMIN
      }
      let token = adminData.generateJwt(tokenData)
      let datas = await Admin.findById(adminData._id).lean()
      datas['token'] = token


      // RESPONSE
      response.data = { admin: datas }
      response.status = true
      response.message = 'ADMIN_REGISTERED_SUCCESSFULLY'
      response.statusCode = 201
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly sendOtp = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const validation = await AuthValidator.validateData(body , "sendOtpverify")
      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      let verifyObj: any = {
        verifyFrom: body.verifyFrom || Enum.VERIFICATION.LOGIN,
        userType: body.userType
      }
      if (body.verifyBy == 'email') {
        verifyObj = {
          ...verifyObj,
          email: body.email,
          verifyBy: 'email'
        }
      } else {
        verifyObj = {
          ...verifyObj,
          phoneNumber: body.phone,
          phoneCode: body.phoneCode,
          verifyBy: 'phone'
        }
      }
      const verifyRes: any = await VerificationService.create(verifyObj)
      if (!verifyRes.status) throw new CustomError.UnAvailableError('Cant Send OTP, Please Contact Support')


      // RESPONSE
      response.data = { otp: verifyRes.data }
      response.status = true
      response.message = 'OTP_SENT_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly verification = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let account: any, User: any;
      const validation = await AuthValidator.validateData(body , "verification")
      if (!validation.status)
         throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const skipArray = [
        Enum.VERIFICATION.LOGIN,
        Enum.VERIFICATION.FORGETPASSWORD,
        Enum.VERIFICATION.CHANGEPASSWORD
      ]

      let verifyObj: any = {
        code: body.code,
        userType: body.userType,
        verifyFrom: body.verifyFrom
      }

      if (body.verifyBy == 'email') {
        verifyObj = {
          ...verifyObj,
          email: body.email,
          verifyBy: 'email'
        }
      } else {
        verifyObj = {
          ...verifyObj,
          phoneNumber: body.phone,
          phoneCode: body.phoneCode,
          verifyBy: 'phone'
        }
      }

      const verifyRes: any = await VerificationService.validate(verifyObj)
      if (!verifyRes.status) throw new CustomError.UnProcessableError('OTP_DOES_NOT_VERIFIED', [])

      if (skipArray.includes(body.verifyFrom)) {
        const userWhere = {}
        if (req.auth == null) {
          if (body.email) {
            userWhere['email'] = body.email
          } else {
            userWhere['phone'] = body.phone
            userWhere['phoneCode'] = body.phoneCode
          }
        } else {
          userWhere['_id'] = req.auth.userId
        }
        account = await Admin.findOne(userWhere).exec()
        if (!account) throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')
      }

      if (account) {
        if (body.verifyBy == 'email') {
          account.emailVerified = true
        } else {
          account.phoneVerified = true
        }

        User = await account.save()
      }


      // RESPONSE
      response.data = { verification: User }
      response.status = true
      response.message = 'OTP_VERIFED_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly login = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body;
      let adminData: any;
      const validation = await AuthValidator.validateData(body , "adminLogin")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      //CHECK DATA
      let findCondition: {
        email?: string
        phone?: string
      } = {}

      if (body.email) findCondition.email = body.email
      if (body.phone) findCondition.phone = body.phone

      let adminCheck: any = await Admin.findOne(findCondition).populate('role').lean()
      if (!adminCheck) throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')

      if (adminCheck.softdel) throw new CustomError.BadRequestError('ADMIN_ACCOUNT_DELETED');
        
      if (!adminCheck.isActive) throw new CustomError.BadRequestError('ADMIN_ACCOUNT_INACTIVE');
        
      adminData = await Admin.findOne(findCondition)
      if (body.password) {
        const passwordIsValid = await adminData.validPassword(body.password, adminData.salt, adminData.hash)
        if (!passwordIsValid) throw new CustomError.UnProcessableError('MAKE_SURE_YOUR_PASSWORD', [])
      }
    adminData.fcmId = body.fcmId || ""
    await adminData.save()
      let tokenData = {
        userId: adminCheck._id,
        email: adminCheck.email,
        name: adminCheck.firstname,
        type: Constants.userRole.ADMIN
      }

      let token = adminData.generateJwt(tokenData)
      adminCheck['token'] = token


      // RESPONSE
      response.data = { admin: adminCheck }
      response.status = true
      response.message = 'ADMIN_LOGINED_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly socialLoginAdmin = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      token: '',
      statusCode: 500
    }
    try {
      let { accessToken, type } = req.body
      let adminInfo: any, data: any, activeAdmin: any
      const validation = await AuthValidator.validateData(req.body , "socialLogin")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      if (type === 'google') {
        adminInfo = await this.getGoogleUserInfo(accessToken)

        activeAdmin = await Admin.find({
          $and: [{ email: adminInfo.email }, { isActive: false }]
        })
        if (activeAdmin.length !== 0) {
          throw new CustomError.UnProcessableError('ADMIN_INACTIVE,CONTACT_SUPER_ADMIN', [])
        }

        data = await Admin.findOne({
          email: adminInfo.email,
          softdel: false
        })
        if (!data) {
          const newDoc: any = new Admin()
          newDoc.email = adminInfo.email
          newDoc.firstname = adminInfo.given_name
          let saltNHash = newDoc.setPassword('')
          newDoc.hash = saltNHash.hash
          newDoc.salt = saltNHash.salt
          newDoc.softdel = false
          newDoc.profileImage = adminInfo.picture
          data = await newDoc.save()
        }
        adminInfo['userId'] = data._id
      }
      // if (type === 'facebook') {
      //   userInfo = await this.getFacebookUserData(access_token)
      // }
      let tokenData = {
        userId: data._id,
        email: data.email,
        name: data.firstname,
        type: Constants.userRole.USER
      }
      let token = data.generateJwt(tokenData)
      adminInfo['token'] = token


      // RESPONSE
      response.statusCode = 200
      response.message = 'ADMIN_LOGINED_SUCCESSFULLY'
      response.status = true
      response.data = { socialLogin: adminInfo }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getAdmin = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const adminId = req.params.id || req.auth.userId
      let data: any = await Admin.findById(adminId).lean().populate('role', 'role')
      if (!data) throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')
      data['type'] = 'ADMIN'


      // RESPONSE
      response.data = { admin: data }
      response.status = true
      response.message = 'ADMIN_DETAILS_LISTED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error?.cause?.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listAdmins = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let queryData: any = req.query;
      const pageQuery: any = await this.paginationBuilder(req.query)
      let matchCondition: any = { softdel: false };
      if (queryData.search) {
        const regex = { $regex: new RegExp(queryData.search, 'i') };
        matchCondition.$or = [{ firstname: regex }, { email: regex }, { phone: regex }];
      }
      if (queryData.firstname) matchCondition.firstname = { $regex: new RegExp(queryData.firstname, 'i') };
      if (queryData.email) matchCondition.email = { $regex: new RegExp(queryData.email, 'i') };
      if (queryData.phone) matchCondition.phone = { $regex: new RegExp(queryData.phone, 'i') };

      let adminData = await Admin.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: 'adminroles',
            localField: 'role',
            foreignField: '_id',
            as: 'adminRolesData'
          }
        },
        { $unwind: { path: '$adminRolesData', preserveNullAndEmptyArrays: true } }, 
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            admins: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])


      // RESPONSE
      response.data = {
        totalCount: adminData[0]?.totalCount[0]?.total,
        adminData: adminData[0]?.admins
      }
      response.status = true
      response.message = 'ADMIN_DETAILS_LISTED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error?.cause?.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly adminProfile = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      type: {},
      statusCode: 500
    }
    try {
      //let data: any = await this.adminData(req.auth.userId)
      let data: any = await Admin.findById(req.auth.userId).lean().populate('role', 'role description permission')
      if (!data) throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')


      // RESPONCE
      response.data = { profileData: data }
      response.type = 'ADMIN'
      response.status = true
      response.message = 'ADMIN_PROFILE_LISTED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error?.cause?.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateAdmin = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        adminId = req.params.id
      let datas: any = await this.adminData(adminId)
      let validateEmailPhone = await Admin.find({ _id: { $ne: datas._id }, softdel: false }, { email: 1, phone: 1, publicId: 1 }).exec()

      if (validateEmailPhone.length !== 0) {
        for (let datas of validateEmailPhone) {
          if (body.email) {
            if (datas.email.toString() === body.email.toString()) throw new CustomError.UnProcessableError('EMAIL_ALREADY_EXISTS', [])
          }
          if (body.phone) {
            if (datas.phone.toString() === body.phone.toString()) throw new CustomError.UnProcessableError('PHONE_NUMBER_ALREADY_EXISTS', [])
          }
        }
      }

      if (req.file && datas.publicId) await removeFile(datas.publicId);

      let profileImage = datas.profileImage
      let publicId: any
      if (req.file) {
        // profileImage = await uploadToLocal( req.file, FolderConfig.AdminProfile )
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.AdminProfile )
        profileImage = cloudImage.url
        publicId  = cloudImage.publicId
      }

      let updateDoc = await Admin.findByIdAndUpdate(
          adminId,
          { ...body, profileImage: profileImage,publicId: publicId, updatedAt: Date.now() },
          { new: true }
        ).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('FAILED_TO_UPDATE_ADMIN')


      // RESPONSE 
      response.data = { profileData: updateDoc }
      response.status = true
      response.message = 'ADMIN_DETAILS_UPDATED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteAdmin = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      if (Config.hiddenSettings.mode == '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_TEST_MODE', [])
      let data = await Admin.findOneAndUpdate({ _id: req.params.id }, { softdel: true }, { new: true }).exec()
      if (!data) throw new CustomError.UnProcessableError('FAILED_TO_DELETE', [])


      // RESPONSE  
      response.status = true
      response.message = 'ADMIN_DETAILS_DELETED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addUserByAdmin = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const validation = await AuthValidator.validateData(body , "addUser")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      if (req.auth.role !== Constants.userRole.ADMIN) throw new CustomError.UnAuthenticatedError('ONLY_ADMINS_CAN_ADD_USERS')


      let validateEmailPhone = await User.find(
        { softdel: false },
        { email: 1, phone: 1, firstname: 1 }
      ).exec()

      if (validateEmailPhone.length !== 0) {
        for (let validate of validateEmailPhone) {
          if (body.email) {
            if (validate.email.toString() === body.email.toString())
              throw new CustomError.UnProcessableError('EMAIL_ALREADY_EXISTS', [])
          }
          if (body.phone) {
            if (validate.phone.toString() === body.phone.toString())
              throw new CustomError.UnProcessableError('PHONE_NUMBER_ALREADY_EXISTS', [])
          }
        }
      }

      // create a new user
      let newUser: any = new User({
        ...body,
        profileImage: req.file ? await helper.getFilePath(req.file.path) : ''
      })
      let saltNHash = newUser.setPassword(body.password)
      newUser.fullname = body.firstname + ' ' + body.lastname
      newUser.hash = saltNHash.hash
      newUser.salt = saltNHash.salt
      const data = await newUser.save()


      // RESPONSE
      response.data = data
      response.status = true
      response.message = 'USER_ADDED_SUCESSFULLY'
      response.statusCode = 201
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly VerifyAndActiveStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let adminId = req.auth.userId,
        body = req.body,
        data: any
      if (!body.active && !body.verify) throw new CustomError.UnProcessableError('INSUFFICIENT_DATA', [])

      let adminCheck: any = await this.adminData(adminId)

      if (body.active) {
        data = await Admin.findByIdAndUpdate(req.params.id, { isActive: body.active }, { new: true })
        if (!data) throw new CustomError.UnProcessableError(`FAILED_TO_UPDATE`, [])
      }
      if (body.verify) {
        if (adminCheck.verified && body.verify == 'true') {
          throw new CustomError.UnProcessableError(`USER_VERIFIED_ALREADY`, [])
        }
        data = await Admin.findByIdAndUpdate(
          req.params.id,
          { verified: body.verify, verifiedBy: adminId, verifiedDate: Date.now() },
          { new: true }
        )
        if (!data) throw new CustomError.UnProcessableError('FAILED_TO_UPDATE', [])
      }


      // RESPONSE
      response.status = true
      response.message = 'ADMIN_UPDATED'
      response.data = { admin: data }
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly forgetPassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { email, userType, verifyFrom, verifyBy } = req.body
      const adminData = await Admin.findOne({ email })

      if (!adminData) throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')

      let otp = await helper.getOtp()
      await this.sendOtpToEmailForForgetPassword(email, otp)
      console.log(otp)

      const otpDoc = new verifyOtp({
        otp: otp,
        userType: userType,
        verifyBy: verifyBy,
        verifyFrom: verifyFrom,
        email: email
      })
      console.log('OTPDOC', otpDoc)
      await otpDoc.save()


      // RESPONSE
      response.data = otpDoc
      response.status = true
      response.message = 'OTP_SENT_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error: any) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly sendOtpToEmailForForgetPassword = async (email: any, otp: any) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'mail.abserve.tech',
        port: 465,
        secure: true,
        auth: {
          user: Config.emailGateway.smtpConfig.auth.user,
          pass: Config.emailGateway.smtpConfig.auth.pass
        }
      })

      const mailOption = {
        from: `${Config.emailGateway.AppName} <${Config.mailFrom}>`,
        to: email,
        subject: 'RESET YOUR PASSWORD',
        text: `YOUR VERIFICATION OTP IS: ${otp}`
      }

      await transporter.sendMail(mailOption)
      console.log('EMAIL SENT SUCCESSFULLY: ', `{ from: ${mailOption.from}, to: [ ${mailOption.to} ] }`)
    } catch (error) {
      console.error('EMAIL SENDING ERROR', error)
      throw new CustomError.UnAvailableError('FAILED_TO_SEND_EMAIL')
    }
  }


  static readonly setPasswordForForgetPassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const { email, otp, newPassword, confirmNewPassword } = req.body
      if (newPassword != confirmNewPassword) throw new CustomError.BadRequestError('BOTH_PASSWORD_MUST_BE_SAME')

      //validate otp
      let otpData = await verifyOtp.findOne({ otp, expired: false })
      if (!otpData) throw new CustomError.BadRequestError('INVALID_OTP_OR_EXPIRED')

      // check if otp is expired
      const otpExpirationTime = 1 // 1 minute
      const currentTime = moment()
      const otpCreationTime = moment(otpData.createdAt)
      if (currentTime.diff(otpCreationTime, 'milliseconds') > otpExpirationTime * 60 * 1000) throw new CustomError.BadRequestError('OTP_EXPIRED')
  

      //update user password
      let adminExist = await Admin.findOne({ email })

      if (!adminExist) throw new CustomError.BadRequestError('ADMIN_NOT_FOUND')

      let newDoc: any = new Admin()
      let { hash: newHash, salt: newSalt } = newDoc.setPassword(newPassword)

      let adminData = await Admin.findOneAndUpdate({ email }, { hash: newHash, salt: newSalt }, { new: true })
      if (!adminData) throw new CustomError.BadRequestError('FAILED_TO_UPDATE_PASSWORD')

      //update otp to true
      await verifyOtp.findOneAndUpdate({ _id: otpData._id }, { verified: true, expired: true }, { new: true })


      // RESPONSE
      response.data = adminData
      response.status = true
      response.message = 'PASSWORD_UPDATED_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error: any) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.cause || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly resetPassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let newDoc: any = new Admin()
      let { hash, salt } = newDoc.setPassword()
      let adminId = req.params.id

      if (!adminId) throw new CustomError.UnProcessableError(`ADMIN_ID_IS_REQUIRED`, [])

      await this.adminData(adminId)

      let adminData = await Admin.findByIdAndUpdate(adminId, { hash: hash, salt: salt }, { new: true })
      if (!adminData) throw new CustomError.UnProcessableError(`FAILED_TO_UPDATE`, [])

       
      // RESPONSE  
      response.data = { admin: adminData }
      response.status = true
      response.message = 'PASSWORD_RESET_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly changePassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { newPassword, currentPassword } = req.body;
      let adminId = req.params.id, data: any;

      let users: any = await this.adminData(adminId)

      // const validation = await AuthValidator.changePassword(req.body, adminId)
      const validation = await AuthValidator.validateData(req.body, "changePassword" )
      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const checkCurrentPassword = users.validPassword(currentPassword, users.salt, users.hash)
      if (!checkCurrentPassword) throw new CustomError.UnProcessableError('INCORRECT_CURRENT_PASSWORD', [])

      const newHash = users.checkNewPassword(newPassword, users.hash, users.salt)
      if (!newHash) throw new CustomError.UnProcessableError('NO_CHANGE_IN_NEW_PASSWORD', [])

      data = await Admin.findOneAndUpdate({ _id: adminId }, { hash: newHash }, { new: true })
      if (!data) throw new CustomError.UnProcessableError('PASSWORD_NOT_CHANGED', [])

      
      // REPONSE  
      response.data = { admin: data }
      response.status = true
      response.message = 'PASSWORD_CHANGED_SUCCESSFULLY'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addFCMId = async (fcmId, userId) => {
    //ADDING THE FCM ID
    let response = await Admin.findOne({ _id: userId })
    response.fcmId = fcmId
    response.save()
  }
  static readonly getMenuList = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      response.data = permissions
      response.message = 'MENU_LISTED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  //Admin Roles
  static readonly addAdminRole = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const validation = await AuthValidator.validateData(body , "createAdminRole")
      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const adminExist = await AdminRole.findOne({ softdel: false, role: body.role}).lean().exec()
      if(adminExist) throw new CustomError.BadRequestError('ADMIN_ROLE_ALREADY_EXISTS')
      
      const adminRole = {
          role: body.role,
          description: body.description,
          permission: body.permission
      }
      const newAdminRole = await AdminRole.create(adminRole)
      if (!newAdminRole) throw new CustomError.BadRequestError('ADMIN_ROLE_NOT_CREATED')

      // RESPONSE
      response.data = { adminRole: newAdminRole }
      response.status = true
      response.message = 'ADMIN_ROLE_CREATED_SUCCESSFULLY'
      response.statusCode = 201
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly getAdminRole = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500,
      totalCount: 0
    }
    try {

      const { adminRoleId } = req.params
      const { query, search, role }: any = req.query
      let pageQuery: any = await this.paginationBuilder(query)
      let matchCondition: any = { softdel: false };
      let adminRoleData: any
      let count: any


      if (adminRoleId) {
        adminRoleData = await AdminRole.findOne({ _id: adminRoleId, softdel: false })
        if (!adminRoleData) throw new CustomError.BadRequestError('ADMIN_ROLE_NOT_FOUND')
        count = 1
      }
      else {
        if (search) {
          const regex = new RegExp(search, 'i');
          matchCondition['role'] = regex;
        }
        if (role) {
          matchCondition['role'] = { $regex: new RegExp(role, 'i') };
        }
        adminRoleData = await AdminRole.find(matchCondition).skip(pageQuery.skip).limit(pageQuery.take)
        count = adminRoleData.length
        if (!adminRoleData?.length) throw new CustomError.BadRequestError('NO_ADMIN_ROLES_FOUND')
      }
    

      // RESPONSE
      response.data = { adminRole: adminRoleData }
      response.totalCount = count
      response.status = true
      response.message = 'ADMIN_ROLES_LISTED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error?.cause?.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly updateAdminRole = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { adminRoleId } = req.params;
      const { role, description, permission } = req.body;

      let validation = await AuthValidator.validateData(req.body , "updateAdminRole");
      if (!validation.status) throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate);

      const adminRoleData = await AdminRole.findOne({ _id: adminRoleId, softdel: false });
      if (!adminRoleData) throw new CustomError.BadRequestError('ADMIN_ROLE_NOT_FOUND');

      adminRoleData.role = role || adminRoleData.role;
      adminRoleData.description = description || adminRoleData.description;
      adminRoleData.permission = permission || adminRoleData.permission;

      const newAdminRoleData = await adminRoleData.save();
      if (!newAdminRoleData) throw new CustomError.BadRequestError('ADMIN_ROLE_NOT_UPDATED');


      // RESPONSE 
      response.data = { newAdminRoleData }
      response.status = true
      response.message = 'ADMIN_DETAILS_UPDATED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly deleteAdminRole = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const adminRoleId = req.params.adminRoleId

      if (Config.hiddenSettings.mode == '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_TEST_MODE', [])

      let roleData = await AdminRole.findOne({ _id: adminRoleId }).exec()
      if (!roleData) throw new CustomError.BadRequestError("ADMIN_ROLE_NOT_FOUND")

      if (roleData.role == 'SUPERADMIN') throw new CustomError.BadRequestError('NO_ACCESS_TO_EDIT')

      if(roleData.softdel) throw new CustomError.BadRequestError("ADMIN_ROLE_ALREADY_DELETED")

      const admins = await Admin.countDocuments({ role: adminRoleId, softdel: false }).exec();
      if (admins > 0) throw new CustomError.BadRequestError("ADMIN_ROLE_HAS_ASSOCIATED_ADMINS");
        
      roleData.softdel = true

      await roleData.save()
      if (!roleData) throw new CustomError.BadRequestError("ADMIN_ROLE_NOT_DELETED")

      // RESPONSE 
      response.data = { roleData } 
      response.status = true
      response.message = 'ADMIN_ROLES_DELETED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly listAdminRole = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const { query, search }: any = req.query
      let pageQuery: any = await this.paginationBuilder(query)
      let adminRoleData: any
      let count: any

      if(search) {
          const regex = new RegExp(search, 'i')
          query['role'] = regex
      }
      adminRoleData = await AdminRole.find({ softdel: false}, { _id: 1, role: 1 }).skip(pageQuery.skip).limit(pageQuery.take)
      count = adminRoleData.length
      if (!adminRoleData?.length) throw new CustomError.BadRequestError('NO_ADMIN_ROLES_FOUND')

      const data = adminRoleData.map((role: any) => ({ value: role._id, label: role.role }))


      // RESPONSE
      response.data = { adminRoleData: data, totalCount: count }
      response.status = true
      response.message = 'ADMIN_ROLES_LISTED'
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error?.cause?.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}

export { AdminController }