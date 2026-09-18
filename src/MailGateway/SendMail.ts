import nodemailer from 'nodemailer'
import Mustache from 'mustache'
import User from '@abserve/Module/Auth/Model/User'
import axios from 'axios'
import MailTemplate from '@abserve/Module/MailTemplate/MailTemplate'
import { AdminController } from '@abserve/Module/Auth/Controller/AdminController'
import { UserController } from '@abserve/Module/Auth/Controller/UserController'
import { Config } from '@abserve/Config/AppConfig'

interface MailGateway extends AdminController, UserController {}

class EmailController implements MailGateway {

  // static sendMail = async (email, data: any, description: any, language = 'es') => {
  //   let subject: any, htmlBody

  //   const generalData: any = {
  //     imageurl: Config.fileurl + 'companylogo.png',
  //     mailHeaderRight: Config.fileurl + 'mailImages/right.png',
  //     mailHeaderLeft: Config.fileurl + 'mailImages/left.png',
  //     mailLogo: Config.fileurl + 'mailImages/companylogo.png',
  //     appname: Config.app.appName,
  //     companyaddress: Config.companyaddress
  //     // 'driverApproveLink': Config.frontendurl + '#/pages/tables/driver-table',
  //     // 'companyemail': Config.companymail
  //   }
  //   let database = await Email.findOne({ description: description }).exec()
  //   data = Object.assign(data, generalData)
  //   if (database) {
  //     subject = database.subject
  //     let template = Mustache.render(database.body, data)
  //     htmlBody = database.header + template + '</body></html>' // html body;
  //   } else {
  //     subject = description
  //     htmlBody = data.OTP_CODE
  //   }

  //   if (Config.emailGateway.name == 'gmail') {
  //     let smtpConfig = Config.emailGateway.smtpConfig
  //     let mailoption = {
  //       from: Config.mailFrom,
  //       to: email,
  //       subject: subject,
  //       html: htmlBody,
  //       text: subject
  //     }
  //     let mailTransporter = nodemailer.createTransport(smtpConfig)

  //     mailTransporter.sendMail(mailoption, (error) => {
  //       if (error) {
  //         console.log('err', error, 'err')
  //         return false
  //       }
  //     })
  //     return true
  //   }
  // }

  static readonly sendMail = async (email, data: any, description: any, language = 'es') => {
    let subject: any, htmlBody

    const generalData: any = {
      imageurl: Config.fileurl + 'companylogo.png',
      mailHeaderRight: Config.fileurl + 'mailImages/right.png',
      mailHeaderLeft: Config.fileurl + 'mailImages/left.png',
      mailLogo: Config.fileurl + 'mailImages/companylogo.png',
      appname: Config.app.appName,
      companyaddress: Config.companyaddress
      // 'driverApproveLink': Config.frontendurl + '#/pages/tables/driver-table',
      // 'companyemail': Config.companymail
    }
    let database = await MailTemplate.findOne({ description: description }).exec()
    data = Object.assign(data, generalData)
    if (database) {
      subject = database.subject
      htmlBody = Mustache.render(database.body, data)
    }
    else {
      console.error(`No template found for description: ${description}`);
      return false;
    }

    if (Config.emailGateway.name == 'gmail') {
      let smtpConfig = Config.emailGateway.smtpConfig
      let mailoption = {
        from: Config.mailFrom,
        to: email,
        subject: subject,
        html: htmlBody,
        text: subject
      }
      let mailTransporter = nodemailer.createTransport(smtpConfig)

      mailTransporter.sendMail(mailoption, (error) => {
        if (error) {
          console.log('err', error, 'err')
          return false
        }
      })
      return true
    }
  }


  static readonly sendOtpToEmail = async ({ receiverMail, otp, name }) => {
    try {
      let smtpConfig = Config.emailGateway.smtpConfig
      const transporter = nodemailer.createTransport(smtpConfig)

      const mailDatas = await MailTemplate.findOne({ description: 'VERIFY_OTP' })
      console.log('MAILDATS__', mailDatas)

      const fileData = Mustache.render(mailDatas.body, { name, otp })

      const mailOption: any = {
        from: `${Config.emailGateway.AppName} <${Config.mailFrom}>`,
        to: receiverMail,
        subject: mailDatas.subject,
        html: fileData
      }

      const mailSent = await transporter.sendMail(mailOption)
      console.log('EMAIL SENT SUCCESSFULLY: ', `{ from: ${mailOption.from}, to: [ ${mailOption.to} ] }`)

      //user
      const users = await User.findOneAndUpdate({ email: receiverMail }, { emailOtp: otp }, { new: true })
      await users.save()
      if (!mailSent) {
        return false
      } else {
        return true
      }
    } catch (error) {
      console.log('ERROR', error)
      return false
    }
  }


  static readonly sendOtpToEmailForForgetPassword = async ({ receiverMail, passwordKey }: any) => {
    try {
      let smtpConfig = Config.emailGateway.smtpConfig
      const transporter = nodemailer.createTransport(smtpConfig)

      const mailDatas = await MailTemplate.findOne({ description: 'RESET_PASSWORD' })
      console.log('MAILDATA<_', mailDatas)

      const fileData = await Mustache.render(mailDatas.body, { key: passwordKey })
      
      const mailOption: any = {
        from: `${Config.emailGateway.AppName} <${Config.mailFrom}>`,
        to: receiverMail,
        subject: mailDatas.subject,
        html: fileData
      }

      const mailSent = await transporter.sendMail(mailOption)
      console.log('EMAIL SENT SUCCESSFULLY: ', `{ from: ${mailOption.from}, to: [ ${mailOption.to} ] }`)
      if (!mailSent) {
        return false
      } else {
        return true
      }
    } catch (error) {
      console.error('EMAIL SENDING ERROR', error)
      return false
    }
  }


  static readonly sendOtpToMobile = async (phoneCode: any, phone: any, otp: any ) => {
    try {
      const params = {
        user: Config.smsGateway.username,
        password: Config.smsGateway.password,
        senderid: Config.smsGateway.senderid,
        channel: Config.smsGateway.channel,
        DCS: Config.smsGateway.DCS,
        flashsms: Config.smsGateway.flashsms,
        number: `${phoneCode}${phone}`.replace('+', ''),
        text: `${otp} is your one time password to proceed on Purple9 Rooms. It is valid for 10 minutes. Do not share your OTP with anyone - Purple9 Rooms`,
        DLTTemplateId: Config.smsGateway.DLTTemplateId,
        route: Config.smsGateway.route,
        PEId: Config.smsGateway.EntityId,
      }
      console.log('PARAMS', params);
      
      
      const response = await axios.get(Config.smsGateway.smsUrl, { params })
      if (response.data && response.data?.ErrorCode == '000') {
        console.log('SMS sent successfully', response.data);
      } else {
        console.error('Failed to send SMS:', response.data);
      }
    } catch (error) {
      console.error('SMS sending error:', error.message);      
    }
  }
}

export { EmailController }