import verifyOtp from '@abserve/Module/Auth/Model/VerifyOtp'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { BaseController } from '@abserve/Module/BaseControllers'
import { EmailController as Mail } from '@abserve/MailGateway/SendMail'
import { Enum } from '@abserve/Utils/Enum'
import { Config } from '@abserve/Config/AppConfig'

class VerificationService extends BaseController {
  static readonly create = async (dataObj: any) => {
      let response = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        validation: {}
      }
      try {
        const {
          email = '',
          phoneNumber = '',
          phoneCode = '',
          userType = Enum.ROLES.ADMIN,
          verifyBy = '',
          verifyFrom = Enum.VERIFICATION.LOGIN
        } = dataObj
        console.log(dataObj, 'dataObj')
        if (
          (verifyBy == 'email' && email == '') ||
          (verifyBy != 'email' && (phoneNumber == '' || phoneCode == ''))
        ) {
          throw new Error('CHECK_YOUR_PARAMETERS...', { cause: { statusCode: 422 } })
        }

        const andCondition: any = [{ userType: userType }]
        if (verifyBy == 'email') {
          andCondition.push({ email: email })
        } else {
          andCondition.push({ phoneCode: phoneCode })
          andCondition.push({ phoneNumber: phoneNumber })
        }
        const randomSMS = await helper.getOtp()
        const setData = {
          otp: randomSMS,
          verifyBy: verifyBy,
          verifyFrom: verifyFrom,
          userType: userType,
          phoneCode: phoneCode,
          phoneNumber: phoneNumber,
          email: email,
          verified: false
        }
        const addVerify = await verifyOtp.findOneAndUpdate({ $and: andCondition }, { $set: setData }, { upsert: true, new: true }).lean().exec()
        if (addVerify && verifyBy == 'email') {
          let mailData = { OTP: addVerify.otp, appName: Config.app.appName }
          await Mail.sendMail(email, mailData, verifyFrom)
        } 
        if (addVerify && verifyBy == 'phone') {
          await Mail.sendOtpToMobile(phoneCode, phoneNumber, addVerify?.otp)
        }


        // RESPONSE
        response.data = addVerify
        response.status = true
        response.message = 'Verification added.'
      } catch (error) {
        console.log(error)
        response.status = false
        response.data = {}
        response.message = error.message || response.message
      }
      return response
  }


  static readonly validate = async (dataObj: any) => {
      let response = {
        status: false,
        message: 'Unprocessable Entity',
        data: {},
        validation: {}
      }
      try {
        const {
          email = '',
          phoneNumber = '',
          phoneCode = '',
          userType = Enum.ROLES.ADMIN,
          verifyBy = '',
          verifyFrom = Enum.VERIFICATION.LOGIN,
          code = ''
        } = dataObj
        const andCondition: any = [{ userType: userType }, { verified: false }, { verifyFrom: verifyFrom }]
        if (verifyBy == 'email') {
          andCondition.push({ email: email })
        } else {
          andCondition.push({ phoneCode: phoneCode })
          andCondition.push({ phoneNumber: phoneNumber })
        }

        const getVerify = await verifyOtp.findOne({ $and: andCondition }).exec()
        console.log('____', getVerify)

        /*                 if (getVerify != undefined && getVerify) {
                    if (getVerify.otp !== code) {
                        reject(new Error('Check Your Code!', { cause: { statusCode: 422 } }))
                    }
                    getVerify.verified = true
                    const updateVerify = await getVerify.save()

                    response.data = updateVerify;
                    response.status = true;
                    response.message = 'Verification Success.'
                } else {
                    reject(new Error('Please Resend!', { cause: { statusCode: 422 } }))
                } */
        if (!getVerify) throw new Error('PLEASE_RESEND!', { cause: { statusCode: 422 } })
        if (getVerify.otp !== code) throw new Error('CHECK_YOUR_CODE!', { cause: { statusCode: 422 } })

        getVerify.verified = true
        const updateVerify = await getVerify.save();
        response.status = true
        response.message = 'VERIFICATION_SUCCESS'
        response.data = updateVerify
      } catch (error) {
        response.status = false
        response.data = {}
        response.message = error.message || response.message
      }
      return response
  }
}

export { VerificationService }