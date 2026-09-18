import mongoose from 'mongoose'
import User from '@abserve/Module/Auth/Model/User'
import List from '@abserve/Module/Listing/Model/Listings'
import crypto from 'crypto'
import CustomError from '@abserve/errors/index'
import axios from 'axios'
import { Response } from 'express'
import { BaseController } from '@abserve/Module/BaseControllers'
import { AuthValidator } from "@abserve/Module/Auth/Validators/AuthValidator"
import { Constants } from '@abserve/Config/Constants'
import { SingleFileRequest, AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { EmailController as Mail } from '@abserve/MailGateway/SendMail'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { Config } from '@abserve/Config/AppConfig'
import { WalletController as wallet } from '@abserve/Module/PaymentGateway/Controller/WalletController'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import { VerificationService } from '@abserve/Module/Services/Common/VerificationService'
import { uploadToLocal, removeFile, cloudinaryUpload } from '@abserve/Module/FileUpload/index'
import { FolderConfig } from '@abserve/Module/FileUpload/FolderConfig'
import { Enum } from '@abserve/Utils/Enum'
import Ads from '@abserve/Module/Ads/Model/Ads'

class UserController extends BaseController {
  constructor() {
    super();
  }

  static readonly userData = async (id: string) =>{
    try{
      let data = await User.findById(id).exec();
      if (!data) { 
        throw new CustomError.BadRequestError('USER_NOT_FOUND');
      }else{
        return data
      }
    }
    catch(error){
      throw new CustomError.UnProcessableError(error.message, [])
    }
  }


  static readonly getUserExists = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const query = req.query
      const filter:any = { softdel: false }
      
      const validation = await AuthValidator.validateData(query , "getUserExists")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }
      if (query.email && query.email != "") {
        filter.email = query.email
        response.data = { email: query.email }
      } else if (query.phone && query.phone != "") {
        filter.phone = query.phone
        response.data = { phone: query.phone }
      } else throw new CustomError.BadRequestError('REQUIRED_FIELDS')

      const findUser = await User.findOne(filter)
      if (!findUser) throw new CustomError.BadRequestError("USER_NOT_EXIST")


      // RESPONSE  
      response.status = true;
      response.message = 'USER_EXIST';
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).send(response).end();
  }


  static readonly addUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let data: any
      const validation = await AuthValidator.validateData(body , 'addUser');
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let validateEmailPhone = await User.find({ softdel: false }, { "email": 1, "phone": 1, "firstname": 1 }).exec();

      if (validateEmailPhone.length !== 0) {
        for (let validate of validateEmailPhone) {
          if (body.email) {
            if (validate.email.toString() === body.email.toString()) throw new CustomError.UnProcessableError("EMAIL_ALREADY_EXISTS", [])
          }
          if (body.phone) {
            if (validate.phone.toString() === body.phone.toString()) throw new CustomError.UnProcessableError('PHONE_NUMBER_ALREADY_EXISTS', []);
          }
        }
      }

      const newDoc: any = new User({ ...body });
      let saltNHash = newDoc.setPassword(body.password)
      newDoc.fullname = body.firstname + " " + body.lastname
      newDoc.hash = saltNHash.hash
      newDoc.salt = saltNHash.salt
      data = await newDoc.save();

      let tokenData = {
        userId: data._id,
        email: data.email,
        type: Constants.userRole.USER,
      }
      let token = data.generateJwt(tokenData);
      let datas = await User.findById(data._id).lean();
      datas['token'] = token

      //create wallet
      let walletData = { userId: data._id.toString(), userType: Constants.userRole.USER }
      await wallet.addWallet(walletData);


      // RESPONSE
      response.message = "USER_REGISTERED_SUCCESSFULLY";
      response.statusCode = 200;
      response.status = true;
      response.data = { user: datas };
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly sendOtpByEmail = async (req: AuthenticateRequest, res: Response) => {
    let response: any = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
    }
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) throw new CustomError.BadRequestError('USER_NOT_FOUND');

      const savedOtp = await helper.getOtp()
      let otp = await savedOtp;

      const mail = await Mail.sendOtpToEmail({ receiverMail: email, otp: otp, name: existingUser.firstname });
      console.log("MAIL", mail);
      if (!mail) throw new CustomError.BadRequestError("SOMETHING ERROR")


      // RESPONSE
      response.status = true;
      response.statusCode = 200;
      response.message = "EMAIL_SENT_SUCCESSFULLY";
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly verifyOtpByEmail = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      verified: {},
    }
    try {
      const { email, otp } = req.body;
      if (!email || !otp) throw new CustomError.BadRequestError("OTP_REQUIRED")

      const existingUser = await User.findOne({ email });
      if (!existingUser) throw new CustomError.BadRequestError('USER_NOT_FOUND');

      if (existingUser.emailOtp !== otp) throw new CustomError.BadRequestError('INVALID_OTP');

      //user as verified
      if (Config.hiddenSettings.autoEnable == '1') existingUser.verified = true;
      await existingUser.save();


      // RESPONSE
      response.status = true;
      response.statusCode = 200;
      response.message = "EMAIL_VERIFIED_SUCCESSFULLY";
      response.verified = existingUser.verified;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly forgetPassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
    }
    try {
      let { email } = req.body;
      let userData = await User.findOne({ email: email, softdel: false }).exec();

      if (!userData) throw new CustomError.BadRequestError("EMAIL_NOT_VALID_OR_USER_NOT_FOUND");

      let uuid = crypto.randomUUID();

      const updatedUser = await User.findOneAndUpdate(
        { email: email, softdel: false, },
        { 'passwordKeys.forgetPasswordKey': uuid, 'passwordKeys.isValidKey': true },
        { new: true }
      );

      if (!updatedUser) throw new CustomError.BadRequestError("SOMETHING_THROWS_AN_ERROR_FROM_PASSWORD_KEY");

      const mail = await Mail.sendOtpToEmailForForgetPassword({ receiverMail: userData.email, passwordKey: updatedUser.passwordKeys.forgetPasswordKey })
      console.log("MAIL__", mail);

      if (!mail) throw new CustomError.UnAvailableError("MAIL_SENDING_ERROR")


      // RESPONSE
      response.status = true;
      response.message = "RESET_PASSWORD_LINK_SENT_SUCCESSFULLY";
      response.statusCode = 200;
    } catch (error: any) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly verifyKeyForForgetPassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: "Unprocessable Entity",
      data: {},
      statusCode: 500,
    };
    try {
      const passwordKey = req.query.key;
      console.log("PASSWORD_KEY_,", passwordKey);

      let validKey = await User.findOne(
        { softdel: false, 'passwordKeys.forgetPasswordKey': passwordKey, 'passwordKeys.isValidKey': true },
      ).exec();

      console.log("VALID_KEY,", validKey);


      // RESPONSE
      response.status = validKey ? true : false;
      response.message = validKey ? "LINK_IS_VALID" : "LINK EXPIRED";
      response.statusCode = validKey ? 200 : 400;
    } catch (error: any) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly setPasswordForForgetPassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: "Unprocessable Entity",
      data: {},
      validation: {},
      statusCode: 500,
    };
    try {
      const { newPassword, confirmNewPassword } = req.body;
      const key = req.query.key;

      if (newPassword != confirmNewPassword) throw new CustomError.BadRequestError("BOTH_PASSWORD_MUST_BE_SAME");

      const userData: any = await User.findOne({ 'passwordKeys.forgetPasswordKey': key, 'passwordKeys.isValidKey': true, softdel: false })

      if (!userData) throw new CustomError.BadRequestError("SOMETHING_WRONG")

      // set the new password
      const saltNHash = userData.setPassword(newPassword);
      userData.hash = saltNHash.hash;
      userData.salt = saltNHash.salt;
      userData.passwordKeys.isValidKey = false;
      userData.passwordKeys.resetDate = new Date()
      const updatedUser = await userData.save();


      // RESPONSE
      response.data = updatedUser;
      response.status = true;
      response.message = "PASSWORD_UPDATED_SUCCESSFULLY";
      response.statusCode = 200;
    } catch (error: any) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.cause || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly login = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      userListings: 0,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let datas: any, token = "";
      const validation = await AuthValidator.validateData(body , "login")
      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const isWeb = req.query.platform === 'web'

      if (isWeb && body.email) {
        const { recaptchaId } = body
        const responseFromCaptcha = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
          params: {
            secret: Config.google.googleRecaptchaSecretKey,
            response: recaptchaId
          }
        });
        if (!responseFromCaptcha.data.success) throw new CustomError.BadRequestError('CAPTCHA_NOT_VERIFIED')
      }

      let otpUsed = false;
      if (body.code) {
        let verifyObj: any = {
          code: body.code,
          userType: body.userType,
        }
        if (body.verifyBy == 'email') {
          verifyObj.email = body.email;
          verifyObj.verifyBy = 'email';
        } else {
          verifyObj.phoneNumber = body.phone;
          verifyObj.phoneCode = body.phoneCode;
          verifyObj.verifyBy = 'phone';
        }
      }
      const query = {
        "isActive": true,
        "softdel": false,
      }

      if (body.email) {
        query['email'] = body.email
      } else {
        query['phone'] = body.phone
        query['phoneCode'] = body.phoneCode
      }

      const update = {
        fcmId: body.fcmId || '',
      }
      datas = await User.findOne(query).lean();
      if (!datas) throw new CustomError.BadRequestError('USER_NOT_FOUND')

      await User.findOneAndUpdate(query, update, { new: true }).exec();

      let userdata: any = await User.findOne(query)
      if (!body.code && !otpUsed) {
        const passwordIsValid = await userdata.validPassword(body.password, userdata.salt, userdata.hash)
        if (!passwordIsValid) throw new CustomError.UnProcessableError('MAKE_SURE_YOUR_PASSWORD', [])
      }
      let tokenData = {
        userId: datas._id,
        email: datas.email,
        name: datas.firstname,
        type: Constants.userRole.USER,
      }
      token = userdata.generateJwt(tokenData);
      let totalCount = await List.countDocuments({ softdel: false, userId: datas._id })
      datas['token'] = token


      // RESPONSE
      response.data = { user: datas };
      response.status = true;
      response.userListings = totalCount;
      response.message = "USER_LOGINED_SUCCESSFULLY";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly logout = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const auth = req.auth

      const update = { fcmId: '' }
      
      const userData = await User.findOneAndUpdate({ _id: auth.userId }, update, { new: true }).exec()
      if(!userData) throw new CustomError.NotFoundError('USER_NOT_FOUND')


      // RESPONSE
      response.data = { user: userData };
      response.status = true;
      response.message = "USER_LOGGEDOUT_SUCCESSFULLY";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly socialLoginUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      userListings: 0,
      data: {},
      validation: {}
    }
    try {
      const { accessToken, type } = req.body;
      let userInfo: any, data: any, activeUser: any;
      const validation = await AuthValidator.validateData(req.body , 'socialLogin');

      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      if (type === 'google') {
        userInfo = await this.getGoogleUserInfo(accessToken)

        activeUser = await User.find({
          $and: [{ email: userInfo.email }, { isActive: false }]
        });
        if (activeUser.length !== 0) throw new CustomError.UnProcessableError('USER_INACTIVE, CONTACT_ADMIN', [])

        data = await User.findOne({
          email: userInfo.email, softdel: false
        });
        if (!data) {
          const newDoc: any = new User();
          newDoc.email = userInfo.email
          newDoc.firstname = userInfo.given_name
          newDoc.lastname = userInfo.family_name
          let saltNHash = newDoc.setPassword("")
          newDoc.hash = saltNHash.hash
          newDoc.salt = saltNHash.salt
          newDoc.softdel = false
          newDoc.verified = userInfo.verified_email
          newDoc.profileImage = userInfo.picture
          data = await newDoc.save();
        }
        userInfo['userId'] = data._id;
        userInfo['verified'] = data.verified;
      }
      // if (type === 'facebook') {
      //   userInfo = await this.getFacebookUserData(access_token)
      // }
      let tokenData = {
        userId: data._id,
        email: data.email,
        name: data.firstname,
        type: Constants.userRole.USER,
      }
      let token = data.generateJwt(tokenData);
      let totalCount = await List.countDocuments({ softdel: false, userId: data._id })
      userInfo['token'] = token;


      // RESPONSE
      response.statusCode = 200;
      response.message = "USER_LOGINED_SUCCESSFULLY";
      response.userListings = totalCount;
      response.status = true;
      response.data = { socialLogin: userInfo };
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }

  //single user
  static readonly getUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      totalCount: 0,
      data: {},
      validation: {}
    }
    try {
      const userId = req.params.id || req.auth.userId
      let data: any = await User.findById(userId).lean();
      let totalCount = await List.countDocuments({ softdel: false, userId: userId })
      data['type'] = "USER";

      let adsCount = await Ads.find({ status: 'approve', userId: req.auth.userId || null }).countDocuments()

      if (adsCount <= Config.adstarConfig.adsLimitPerUser) {
        data["adsRestriction"] = true
      }
      else
        data["adsRestriction"] = false


      // RESPONSE
      response.message = "DETAILS_LISTED";
      response.status = true;
      response.totalCount = totalCount;
      response.statusCode = 200;
      response.data = { userDetail: data };
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error?.cause?.reasons || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  //user lists in admin dashboard
  static readonly listUsers = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const pageQuery: any = await this.paginationBuilder(req.query);
      const { search, firstname, phone, email }: any = req.query;

      let matchCondition: any = { softdel: false };
      if (search) {
        const regex = { $regex: new RegExp(search, "i") };
        matchCondition.$or = [
          { firstname: regex },
          { email: regex },
          { phone: regex }
        ];
      }
      if (firstname) matchCondition.firstname = { $regex: new RegExp(firstname, "i") };
      if (phone) matchCondition.phone = { $regex: new RegExp(phone, "i") };
      if (email) matchCondition.email = { $regex: new RegExp(email, "i") };

      let userData = await User.aggregate([
        { $match: matchCondition },
        { "$sort": { "createdAt": -1 } },
        {
          '$lookup': {
            'from': 'wallets',
            'localField': '_id',
            'foreignField': 'userId',
            'as': 'trx'
          }
        },
        {
          $unwind: { path: "$trx", preserveNullAndEmptyArrays: true }
        }, {
          '$project': {
            "currentBalance": '$trx.balance',
            "firstname": 1,
            "fullname": 1,
            "lastname": 1,
            "phoneCode": 1,
            "phone": 1,
            "email": 1,
            "profileImage": 1,
            "gender": 1,
            "dob": 1,
            "verified": 1,
            "verifiedBy": 1,
            "isActive": 1,
            "cancellationPolicyId": 1,
            "instantBooking": 1,
            "verifiedDate": 1,
          }
        }, {
          '$facet':
          {
            totalCount: [{ $count: "total" }],
            users: [{ "$skip": pageQuery.skip },
            { "$limit": pageQuery.take },]
          }
        }
      ])

      response.data = {
        totalCount: userData[0]?.totalCount[0]?.total,
        userList: userData[0]?.users
      };


      // RESPONSE
      response.status = true;
      response.message = "USER_DETAILS_LISTED";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error?.cause?.reasons || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly listproviders = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let pageQuery: any = await this.paginationBuilder(req.query);
      let regex = { $regex: req.query.search || "", "$options": "i" }

      let providerData = await User.aggregate([
        {
          $match: {
            softdel: false, "$or": [
              { "firstname": regex },
              { "email": regex },
              { "phone": regex },
              { "address.city": regex },
              { "address.state": regex },
              { "address.country": regex }
            ]
          }
        },
        {
          '$lookup': {
            'from': 'listings',
            'localField': '_id',
            'foreignField': 'userId',
            'as': 'listData'
          }
        },
        {
          $match: {
            listData: { $exists: true, $ne: [] }
          }
        },
        {
          '$lookup': {
            'from': 'wallets',
            'localField': '_id',
            'foreignField': 'userId',
            'as': 'trx'
          }
        },
        {
          $unwind: { path: "$trx", preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            "currentBalance": '$trx.balance',
            "firstname": 1,
            "lastname": 1,
            "phoneCode": 1,
            "phone": 1,
            "email": 1,
            "profileImage": 1,
            "gender": 1,
            "dob": 1,
            "verified": 1,
            "verifiedBy": 1,
            "isActive": 1,
            "cancellationPolicyId": 1,
            "instantBooking": 1,
            "verifiedDate": 1,
          },
        },
        { "$sort": { "createdAt": -1 } }, {
          '$facet':
          {
            totalCount: [{ $count: "total" }],
            users: [{ "$skip": pageQuery.skip },
            { "$limit": pageQuery.take },]
          }
        }
      ])


      // RESPONSE
      response.data = response.data = {
        totalCount: providerData[0]?.totalCount[0]?.total,
        providerData: providerData[0]?.users
      };
      response.status = true;
      response.message = "PROVIDER_DETAILS_LISTED";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error?.cause?.reasons || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  //list username in admin dashboard
  static readonly getUsers = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const users = await User.find({ "softdel": false, "isActive": true, "verified": true }, { firstname: 1, email: 1 }).lean().exec();
      if (!users || users.length == 0) throw new CustomError.BadRequestError("USERS_NOT_FOUND")


      // RESPONSE
      response.message = "USER_DETAILS_LISTED";
      response.status = true;
      response.statusCode = 200;
      response.data = { users: users };
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error?.cause?.reasons || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  //user account details in listing
  static readonly userDetails = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const userId = req.params.id || "";
      const users = await User.findById(userId, {
        'firstname': 1,
        'lastname': 1,
        'email': 1,
        'profileImage': 1,
        'gender': 1,
        'dob': 1,
        'language': 1,
        'school': 1,
        'work': 1,
        'pet': 1,
        'song': 1,
        'obsessed': 1,
        'funFact': 1,
        'useLessSkill': 1,
        'bio': 1,
        'hobby': 1,
        'desc': 1,
        'address': 1,
        'verifiedDate': 1
      }).exec();


      // RESPONSE
      response.data = { accountDeteails: users };
      response.status = true;
      response.message = "USER_DETAILS_LISTED";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error?.cause?.reasons || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly updateUser = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let body = req.body,
        auth = req.auth,
        userId = "";

      if (auth.role == Constants.userRole.USER)
        userId = auth.userId;
      else
        userId = req.params.id;
      if (userId == "" || !userId) throw new CustomError.UnProcessableError('INSUFFICIENT_DATA', [])

      let userDetail: any = await this.userData(req.params.id);

      let validateEmailPhone = await User.find({ _id: { $ne: userDetail._id }, softdel: false }, { "email": 1, "phone": 1 }).exec();

      if (validateEmailPhone.length !== 0) {
        for (let validate of validateEmailPhone) {
          if (body.email) {
            if (validate.email.toString() === body.email.toString()) throw new CustomError.UnProcessableError('EMAIL_ALREADY_EXISTS', [])
          }
          if (body.phone) {
            if (validate.phone.toString() === body.phone.toString()) throw new CustomError.UnProcessableError('PHONE_NUMBER_ALREADY_EXISTS', []);
          }
        }
      }
      if (req.file && userDetail.publicId) await removeFile(userDetail.publicId);

      let profileImage = userDetail.profileImage;
      let publicId: any
      if (req.file) {
        // profileImage = await uploadToLocal(req.file, FolderConfig.UserProfile)
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.UserProfile )
        profileImage = cloudImage.url
        publicId  = cloudImage.publicId
      }

      let updateData = {
        city: body.city,
        state: body.state,
        country: body.country,
        zipcode: body.zipcode,
        address: body.address,
        landmark: body.landmark,
        coordinates: [body.lat, body.lng],
      };

      const updateDoc = await User.findByIdAndUpdate(userId, { ...body, profileImage: profileImage, publicId: publicId, address: updateData, updatedAt: Date.now() }, { new: true }).exec();
      if (!updateDoc) throw new CustomError.UnProcessableError("USER_DATA_NOT_FOUND", []);

      let walletData = {
        userId: userId
      }
      await wallet.currentBalance(walletData)


      // RESPONSE
      response.status = true;
      response.message = "USER_DETAILS_UPDATED";
      response.statusCode = 200;
      response.data = { profileData: updateDoc };
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly deleteUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let updateData = { softdel: true };

      if (Config.hiddenSettings.mode == "1") throw new CustomError.UnProcessableError("SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_DEMO_MODE", [])
      const data = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).exec();
      if (!data) throw new CustomError.UnProcessableError('FAILED_TO_DELETE', [])


      // RESPONSE  
      response.status = true;
      response.data = data;
      response.message = "USER_DETAILS_DELETED";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly deleteAccount = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let updateData = { softdel: true };

      const data = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).exec();
      if (!data) throw new CustomError.UnProcessableError('FAILED_TO_DELETE', [])


      // RESPONSE  
      response.status = true;
      response.data = data;
      response.message = "USER_DETAILS_DELETED";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly VerifyAndActiveStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let adminId = req.auth.userId,
        body = req.body,
        userDetail: any;
      if (!body.active && !body.verify) throw new CustomError.UnProcessableError('INSUFFICIENT_DATA', [])

      let userCheck: any = await this.userData(req.params.id);

      if (body.active) {
        userDetail = await User.findByIdAndUpdate(req.params.id, { isActive: body.active }, { new: true });
        if (!userDetail) throw new CustomError.UnProcessableError(`FAILED_TO_UPDATE`, []);
      }
      if (body.verify) {
        if ((userCheck.verified) && (body.verify == "true")) {
          throw new CustomError.UnProcessableError(`USER_VERIFIED_ALREADY`, []);
        }
        userDetail = await User.findByIdAndUpdate(req.params.id, { verified: body.verify, verifiedBy: adminId, verifiedDate: Date.now() }, { new: true });
        if (!userDetail) throw new CustomError.UnProcessableError('FAILED_TO_UPDATE', []);

        if (userDetail.verified) {
          let mailData = { userName: userDetail.firstname + " " + userDetail.lastname }
          await Mail.sendMail(userDetail.email, mailData, "verify");

          let notifiData = {
            forWhom: req.params.id,
            message: "Verified Successfully",
            fromWhom: "ADMIN",
            userType: "USER",
            title: "verified",
            link: "",
            image: ""
          }
          await NotificationController.notification(notifiData);
        }
      }


      // RESPONSE
      response.status = true;
      response.message = "USER_UPDATED";
      response.data = { userDetail: userDetail };
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly resetPassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let newDoc: any = new User();
      let { hash, salt } = newDoc.setPassword()
      let userId = req.body.userId;

      if (!req.body.userId) throw new CustomError.UnProcessableError(`USER_ID_IS_REQUIRED`, [])

      await this.userData(userId);

      let userData = await User.findByIdAndUpdate(userId, { hash: hash, salt: salt }, { new: true });
      if (!userData) throw new CustomError.UnProcessableError(`FAILED_TO_UPDATE`, []);


      // RESPONSE
      response.data = { user: userData }
      response.status = true;
      response.message = "PASSWORD_RESET_SUCCESSFULLY";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly changePassword = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let { newPassword, currentPassword } = req.body, data;
      let auth = req.auth, userId = "";
      let validation = await AuthValidator.validateData(req.body, "changePassword")
      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      if (auth.role == Constants.userRole.USER) userId = auth.userId;
      else {
        if (!req.params.id) throw new CustomError.UnProcessableError(`USER_ID_IS_REQUIRED`, [])
        userId = req.params.id;
      }

      let users: any = await this.userData(userId);
      if (!users) throw new CustomError.BadRequestError(`USER_NOT_FOUND`);

      let checkCurrentPassword = users.validPassword(currentPassword, users.salt, users.hash);
      if (!checkCurrentPassword) throw new CustomError.UnProcessableError('INCORRECT_CURRENT_PASSWORD', [])

      let newHash = users.checkNewPassword(newPassword, users.hash, users.salt);
      if (!newHash) throw new CustomError.UnProcessableError('NO_CHANGE_IN_NEW_PASSWORD', [])

      data = await User.findOneAndUpdate({ _id: userId }, { hash: newHash }, { new: true })
      if (!data) throw new CustomError.UnProcessableError('PASSWORD_NOT_CHANGED', [])


      // RESPONSE  
      response.data = { user: data }
      response.status = true;
      response.message = "PASSWORD_CHANGED_SUCCESSFULLY";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly listingsOfUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let userId = req.params.id || ""
        // query: any = req.query;
      /* if (!query.listingId) throw new CustomError.UnProcessableError(`LISTING_ID_IS_REQUIRED`, []); */

      const userListings = await List.aggregate(
        [
          {
            $match: {
              $and: [
                /* { _id: { $ne: new mongoose.Types.ObjectId(query.listingId) } }, */
                { userId: new mongoose.Types.ObjectId(userId) },
                { status: 'approve' },
                { availability: true },
                { softdel: false }
              ]
            }
          },
          {
            $lookup: {
              from: 'listingattachments',
              localField: '_id',
              foreignField: 'listingId',
              as: 'listingattachmentsData'
            }
          },
          {
            $unwind: {
              path: '$listingattachmentsData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'listingpricings',
              localField: '_id',
              foreignField: 'listingId',
              as: 'listingPricingsData'
            }
          },
          {
            $unwind: {
              path: '$listingPricingsData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'propertycategories',
              localField: 'propertyCategory',
              foreignField: '_id',
              as: 'categoryNameData'
            }
          },
          {
            $unwind: {
              path: '$categoryNameData',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: { listing: '$_id' },
              data: { $push: '$$ROOT' }
            }
          },
          { $sort: { 'data.totalRatingCount': 1 } },
          {
            $project: {
              'data.propertyDesc': 1,
              'data.propertyName': 1,
              'data.totalRatingCount': 1,
              'data.totalReviewCount': 1,
              'data.guest': 1,
              'data.accomodation': 1,
              'data.listingattachmentsData.image.coverImage': 1,
              'data.listingattachmentsData.image.groupImage': 1,
              'data.listingPricingsData.pricing': 1,
              'data.status': 1,
              'data.availability': 1,
              'data.categoryNameData.category': 1,
              'data.userId': 1,
              'data.createdAt': 1,
              'data.reviewRating': 1
            }
          }
        ]);


      // RESPONSE  
      response.data = { userListings: userListings };
      response.status = true;
      response.message = "DETAILS_LISTED";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly addFCMId = async (fcmId, userId) => {
    let response = await User.findOne({ _id: userId })
    response.fcmId = fcmId;
    response.save();
  }


  static readonly sendOtp = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
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
        userType: body.userType,
      }
      if (body.verifyBy == 'email') {
        verifyObj = {
          ...verifyObj,
          email: body.email,
          verifyBy: 'email',
        }
      } else {
        verifyObj = {
          ...verifyObj,
          phoneNumber: body.phone,
          phoneCode: body.phoneCode,
          verifyBy: 'phone',
        }
      }
      const verifyRes: any = await VerificationService.create(verifyObj)
      if (!verifyRes.status) throw new CustomError.UnAvailableError('Cant Send OTP, Please Contact Support')


      // RESPONSE
      response.data = { otp: verifyRes.data };
      response.status = true;
      response.message = 'OTP_SENT_SUCCESSFULLY';
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }


  static readonly verification = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let account: any, user: any;
      const validation = await AuthValidator.validateData(body , "verification")
      if (!validation.status)
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)

      const skipArray = [
        Enum.VERIFICATION.LOGIN,
        Enum.VERIFICATION.FORGETPASSWORD,
        Enum.VERIFICATION.CHANGEPASSWORD,
      ]

      let verifyObj: any = {
        code: body.code,
        userType: body.userType,
        verifyFrom: body.verifyFrom,
      }

      if (body.verifyBy == 'email') {
        verifyObj = {
          ...verifyObj,
          email: body.email,
          verifyBy: 'email',
        }
      } else {
        verifyObj = {
          ...verifyObj,
          phoneNumber: body.phone,
          phoneCode: body.phoneCode,
          verifyBy: 'phone',
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
        account = await User.findOne(userWhere).exec();
        if (!account) throw new CustomError.BadRequestError('USER_NOT_FOUND')
      }

      if (account) {
        if (body.verifyBy == 'email') {
          account.emailVerified = true
        } else {
          account.phoneVerified = true
          account.verified = true
        }
        user = await account.save()
      }


      // RESPONSE
      response.message = 'OTP_VERIFED';
      response.statusCode = 200;
      response.status = true;
      response.data = { verification: user };
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }

    static readonly userMode = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const auth = req.auth

      const update = { mode: req.body.mode || 'traveller' }
      
      const userData = await User.findOneAndUpdate({ _id: auth.userId }, update, { new: true }).exec()
      if(!userData) throw new CustomError.NotFoundError('USER_NOT_FOUND')


      // RESPONSE
      response.data = { user: userData };
      response.status = true;
      response.message = "USER_MODE_UPDATED_SUCCESSFULLY";
      response.statusCode = 200;
    } catch (error) {
      console.log("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.validation = error.validationArr || {};
      response.statusCode = error.statusCode || response.statusCode;
    }
    return res.status(response.statusCode || 500).json(response).end();
  }
}

export { UserController };