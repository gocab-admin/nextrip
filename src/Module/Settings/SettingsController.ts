import fs from 'fs'
import path from 'path'
import imageSize from 'image-size'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { BaseController } from '../BaseControllers'
import { Response } from 'express'
import { Config } from '@abserve/Config/AppConfig'
import { Pwa } from '@abserve/Config/PwaConfig'
import { InstallationSteps } from '@abserve/Config/InstallationStepsConfig'

class SettingsController extends BaseController {
  constructor() {
    super()
  }

  static readonly createSettings = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const body = req.body
      const configObj = Config

      //logo
      if (req.files['logo']) {
        const path = await helper.getFilePath(req.files['logo'][0].path)
        configObj.app.logo = path
      }

      //favicon
      if (req.files['favicon']) {
        const path = await helper.getFilePath(req.files['favicon'][0].path)
        configObj.app.favicon = path
      }

      //
      if (req.files['qrcode']) {
          const path = await helper.getFilePath(req.files['qrcode'][0].path)
          configObj.app.qrcode = path
      }
      // //hostForm
      // if (req.files['hostFormImage1']) {
      //   configObj.hostForm.step1 = await helper.getFilePath(req.files['hostFormImage1'][0].path);
      // }

      // if (req.files['hostFormImage2']) {
      //   configObj.hostForm.step2 = await helper.getFilePath(req.files['hostFormImage2'][0].path);
      // }

      // if (req.files['hostFormImage3']) {
      //   configObj.hostForm.step3 = await helper.getFilePath(req.files['hostFormImage3'][0].path);
      // }

      // //createForm
      // if (req.files['createFormImage1']) {
      //   configObj.createForm.step1 = await helper.getFilePath(req.files['createFormImage1'][0].path);
      // }

      // if (req.files['createFormImage2']) {
      //   configObj.createForm.step2 = await helper.getFilePath(req.files['createFormImage2'][0].path);
      // }

      // if (req.files['createFormImage3']) {
      //   configObj.createForm.step3 = await helper.getFilePath(req.files['createFormImage3'][0].path);
      // }

      configObj.app.appName = body.appName || configObj.app.appName
      configObj.app.desc = body.desc || configObj.app.desc
      configObj.commission = Number(body.commission || configObj.commission)
      configObj.tax = Number(body.tax || configObj.tax)
      configObj.site.titleName = body.titleName || configObj.site.titleName
      configObj.site.language = body.language || configObj.site.language
      configObj.site.phoneCode = body.phoneCode || configObj.site.phoneCode
      configObj.site.countryCode = body.countryCode || configObj.site.countryCode
      configObj.site.currency = body.currency || configObj.site.currency
      configObj.site.currencySymbol = body.currencySymbol || configObj.site.currencySymbol
      configObj.chat.chatPropertyId = body.chatPropertyId || configObj.chat.chatPropertyId
      configObj.chat.chatWidgetId = body.chatWidgetId || configObj.chat.chatWidgetId
      configObj.socialLinks.facebook = body.facebook || configObj.socialLinks.facebook
      configObj.socialLinks.twitter = body.twitter || configObj.socialLinks.twitter
      configObj.socialLinks.instagram = body.instagram || configObj.socialLinks.instagram
      configObj.appLinks.playstore = body.playstore || configObj.appLinks.playstore
      configObj.appLinks.appstore = body.appstore || configObj.appLinks.appstore
      configObj.theme.fontFamily = body.fontFamily || configObj.theme.fontFamily
      configObj.theme.themeColor = body.themeColor || configObj.theme.themeColor
      configObj.theme.primaryTheme = body.primaryTheme || configObj.theme.primaryTheme
      configObj.theme.secondaryTheme = body.secondaryTheme || configObj.theme.secondaryTheme
      configObj.theme.homepage = body.homepage || configObj.theme.homepage
      configObj.hiddenSettings.hourlyBooking = body.hourlyBooking || configObj.hiddenSettings.hourlyBooking
      configObj.hiddenSettings.ads = body.ads || configObj.hiddenSettings.ads
      configObj.hiddenSettings.listing = body.listing || configObj.hiddenSettings.listing
      configObj.hiddenSettings.calendarTheme = body.calendarTheme || configObj.hiddenSettings.calendarTheme
      configObj.hiddenSettings.dateFormat = body.dateFormat || configObj.hiddenSettings.dateFormat
      configObj.hiddenSettings.documentVerification = body.documentVerification || configObj.hiddenSettings.documentVerification
      configObj.hiddenSettings.autoEnable = body.autoEnable || configObj.hiddenSettings.autoEnable
      configObj.hiddenSettings.map = body.map || configObj.hiddenSettings.map
      configObj.listings.specifications = body.specifications || configObj.listings.specifications
      configObj.listings.availableCount = body.availableCount || configObj.listings.availableCount
      configObj.hiddenSettings.listingImageCount = body.listingImageCount || configObj.hiddenSettings.listingImageCount
      configObj.listings.pricings.additions = body.pricingAddition || configObj.listings.pricings.additions
      configObj.app.baseurl = body.baseUrl || configObj.app.baseurl
      configObj.emailGateway.AppName = body.emailAppName || configObj.emailGateway.AppName
      configObj.emailGateway.smtpConfig.host = body.emailHost || configObj.emailGateway.smtpConfig.host
      configObj.emailGateway.smtpConfig.port = Number(body.emailPort) || configObj.emailGateway.smtpConfig.port
      configObj.emailGateway.smtpConfig.auth.user = body.emailUser || configObj.emailGateway.smtpConfig.auth.user
      configObj.emailGateway.smtpConfig.auth.pass = body.emailPass || configObj.emailGateway.smtpConfig.auth.pass
      configObj.smsGateway.name = body.smsName || configObj.smsGateway.name
      configObj.smsGateway.smsUrl = body.smsUrl || configObj.smsGateway.smsUrl
      configObj.smsGateway.username = body.username || configObj.smsGateway.username
      configObj.smsGateway.password = body.password || configObj.smsGateway.password
      configObj.smsGateway.senderid = body.senderid || configObj.smsGateway.senderid
      configObj.smsGateway.channel = body.channel || configObj.smsGateway.channel
      configObj.smsGateway.DCS = body.Dcs || configObj.smsGateway.DCS
      configObj.smsGateway.flashsms = body.flashsms || configObj.smsGateway.flashsms
      configObj.smsGateway.route = body.route || configObj.smsGateway.route
      configObj.smsGateway.DLTTemplateId = body.DLTTemplateId || configObj.smsGateway.DLTTemplateId
      configObj.smsGateway.EntityId = body.EntityId || configObj.smsGateway.EntityId
      configObj.mailFrom = body.mailFrom || configObj.mailFrom
      configObj.site.sensitiveDatas = body.sensitiveDatas || configObj.site.sensitiveDatas
      configObj.site.mapCoordinates.lat = body.lat || configObj.site.mapCoordinates.lat
      configObj.site.mapCoordinates.lng = body.lng || configObj.site.mapCoordinates.lng
      configObj.paymentGateway.kkSecret = body.stripeKey || configObj.paymentGateway.kkSecret
      configObj.paymentGateway.publishableKey = body.publishableKey || configObj.paymentGateway.publishableKey
      configObj.razorPayGateway.razorpayKeyId = body.razorpayKeyId || configObj.razorPayGateway.razorpayKeyId
      configObj.razorPayGateway.razorpaySecret = body.razorpaySecret || configObj.razorPayGateway.razorpaySecret
      configObj.razorPayGateway.accountNumber = body.accountNumber || configObj.razorPayGateway.accountNumber
      configObj.google.googleClientId = body.googleClientId || configObj.google.googleClientId
      configObj.google.googleClientSecret = body.googleClientSecret || configObj.google.googleClientSecret
      configObj.google.googleRecaptchaSiteKey = body.googleRecaptchaSiteKey || configObj.google.googleRecaptchaSiteKey
      configObj.google.googleRecaptchaSecretKey = body.googleRecaptchaSecretKey || configObj.google.googleRecaptchaSecretKey
      configObj.google.googleRedirectUrl = body.googleRedirectUrl || configObj.google.googleRedirectUrl
      configObj.google.mapApiKey = body.mapApiKey || configObj.google.mapApiKey
      configObj.google.googleTagId = body.googleTagId || configObj.google.googleTagId
      configObj.google.searchConsoleVerification = body.searchConsoleVerification || configObj.google.searchConsoleVerification
      configObj.hiddenSettings.mode = body.mode || configObj.hiddenSettings.mode
      configObj.hiddenSettings.sensitive = body.sensitive || configObj.hiddenSettings.sensitive
      configObj.hiddenSettings.checkIn = body.checkin || configObj.hiddenSettings.checkIn
      configObj.hiddenSettings.timeFormat = body.timeformat || configObj.hiddenSettings.timeFormat
      configObj.hiddenSettings.peopleCount = body.peoplecount || configObj.hiddenSettings.peopleCount
      configObj.hiddenSettings.stripe = body.stripe || configObj.hiddenSettings.stripe
      configObj.hiddenSettings.razorpay = body.razorpay || configObj.hiddenSettings.razorpay
      configObj.hiddenSettings.cash = body.cash || configObj.hiddenSettings.cash
      configObj.adstarConfig.adsLimitPerUser = body.adsLimit || configObj.adstarConfig.adsLimitPerUser
      configObj.adstarConfig.adsValidityInDays = body.adsDays || configObj.adstarConfig.adsValidityInDays
      configObj.auth.cipherKey = body.cipherKey || configObj.auth.cipherKey
      configObj.db.url = body.url || configObj.db.url
      configObj.winiston.logpath = body.logpath || configObj.winiston.logpath
      configObj.activePages = body.activePages || configObj.activePages

      const updatedSteps = new Set(configObj.setupProgress.completedSteps || [])
      if (body.appName && body.baseUrl && req.files['logo'] && req.files['favicon']) updatedSteps.add('appSettings')
      if (body.googleClientId && body.googleClientSecret && body.mapApiKey && body.googleRecaptchaSiteKey && body.googleRecaptchaSecretKey ) updatedSteps.add('googleSettings')
      if (body.emailHost && body.emailUser && body.emailPass) updatedSteps.add('smtpSettings')
      if (body.stripeKey && body.publishableKey || body.razorpayKeyId && body.razorpaySecret && body.accountNumber ) updatedSteps.add('paymentSettings')
      if (body.signedUp) updatedSteps.add('signedUp')
            
      
      const stepsCompleted = [...updatedSteps]
      const percentComplete = Math.round((stepsCompleted.length / InstallationSteps.length) * 100)
      
      configObj.setupProgress.completedSteps = stepsCompleted
      configObj.setupProgress.percent = percentComplete
      configObj.isInstalled = percentComplete === 100


      const __dirname = path.resolve()
      const filePath = `${__dirname}/src/Config/AppConfig.ts`
      const actualfilePath = `${__dirname}/build/Config/AppConfig.js`

      // const fileContent = `const Config = ${JSON.stringify(configObj, null, 2)};\nexport { Config }`
      // const fileWrite = await fs.writeFileSync(filePath, fileContent)
      // const fileCopy = await fs.copyFileSync(filePath, actualfilePath)

      // Read the entire file content
      let oldContentJs = fs.readFileSync(actualfilePath, 'utf-8');
      // Use a regular expression to find and replace only the `myVar` part
      const newContentJs = oldContentJs.replace(
        /const Config = {[\s\S]*?};/, // Regex to find the `myVar` object
        `const Config = ${JSON.stringify(configObj, null, 2)};` // Replace it with the new object string
      );
      await fs.writeFileSync(actualfilePath, newContentJs, 'utf-8')

      // Read the entire file content
      let oldContentTs = fs.readFileSync(filePath, 'utf-8');
      // Use a regular expression to find and replace only the `myVar` part
      const newContentTs = oldContentTs.replace(
        /const Config = {[\s\S]*?};/, // Regex to find the `myVar` object
        `const Config = ${JSON.stringify(configObj, null, 2)};` // Replace it with the new object string
      );
      await fs.writeFileSync(filePath, newContentTs, 'utf-8')


      // RESPONSE
      response.data = configObj
      response.message = 'SETTINGS_UPDATED'
      response.status = true
      response.statusCode = 201
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getAllSetting = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    // const updatedConfig = {
    //   ...Config,
    //   hostForm: {
    //     step1: `${Config.baseUrl}${Config.hostForm.step1}`,
    //     step2: `${Config.baseUrl}${Config.hostForm.step2}`,
    //     step3: `${Config.baseUrl}${Config.hostForm.step3}`,
    //   },
    //   createForm: {
    //     step1: `${Config.baseUrl}${Config.createForm.step1}`,
    //     step2: `${Config.baseUrl}${Config.createForm.step2}`,
    //     step3: `${Config.baseUrl}${Config.createForm.step3}`,
    //   }
    // }
    try {
      response.data = Config
      response.message = 'SETTINGS_LISTED_SUCCESSFULLY'
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

  static readonly getInstallationSteps = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      response.data = InstallationSteps
      response.message = 'INSTALLATION_STEPS_FETCHED_SUCCESSFULLY'
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


  static readonly fetchFieldStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: "Unprocessable Entity",
      statusCode: 500,
      status: false,
      data: {}
    };
  
    try {
      const configObj = Config;
      const FieldStatus = (obj: any) => {
          const fields: Record<string, any> = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const value = obj[key];
              if (typeof value === "object" && value !== null) fields[key] = FieldStatus(value);
              else fields[key] = value !== null && value !== "";    
            }
          }
          return fields;
      };
      const fieldStatus = FieldStatus(configObj);
  
      response.data = fieldStatus;
      response.message = "FIELD_VALUES_STATUS_FETCHED";
      response.status = true;
      response.statusCode = 200;
    } catch (error) {
      console.error("Error \n", error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
  
    return res.status(response.statusCode || 500).json(response).end();
  };
  

  static readonly updatePWA = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    };
  
    try {
      const body = req.body
      const pwaObj = Pwa

      if (req.files['maskable']?.[0]) {
        const maskFile = req.files['maskable'][0];
        const maskDimension =  imageSize(maskFile.path);
        const maskSize = `${maskDimension.width}x${maskDimension.height}`;
        pwaObj.icons = pwaObj.icons.filter(icon => icon.purpose !== 'maskable');
        pwaObj.icons.unshift({
          src: path.join('public/pwa', maskFile.filename),
          sizes: maskSize,
          type: 'image/png',
          purpose: 'maskable'
        });
      }
      
      if (req.files['icons'] && Array.isArray(req.files['icons']) && req.files['icons'].length > 0) {
        const newIcons = await Promise.all(req.files['icons'].map(async (file: any) => {
          const dimensions =imageSize(file.path);
          const sizes = `${dimensions.width}x${dimensions.height}`;
  
          return {
            src: path.join('public/pwa', file.filename),
            sizes: sizes,
            type: 'image/png'
          };
        }));
        pwaObj.icons =[...pwaObj.icons, ...newIcons];
      }
      
      pwaObj.name = body.name || pwaObj.name;
      pwaObj.short_name = body.shortName || pwaObj.short_name;
      pwaObj.theme_color = body.themeColor || pwaObj.theme_color;
      pwaObj.background_color = body.backgroundColor || pwaObj.background_color;
      pwaObj.start_url = body.startUrl || pwaObj.start_url;
      pwaObj.display = body.display || pwaObj.display;
      pwaObj.orientation = body.orientation || pwaObj.orientation;

      const __dirname = path.resolve();
      const filePath = `${__dirname}/src/Config/PwaConfig.ts`;
      const actualfilePath = `${__dirname}/build/Config/PwaConfig.js`

      // const fileContent = `const Pwa = ${JSON.stringify(pwaObj, null, 2)};\nexport { Pwa }`
      // const fileWrite = await fs.writeFileSync(filePath, fileContent)
      // const fileCopy = await fs.copyFileSync(filePath, actualfilePath)

      // Read the entire file content
      let oldContentJs = fs.readFileSync(actualfilePath, 'utf-8');
      // Use a regular expression to find and replace only the `myVar` part
      const newContentJs = oldContentJs.replace(
        /const Pwa = {[\s\S]*?};/, // Regex to find the `myVar` object
        `const Pwa = ${JSON.stringify(pwaObj, null, 2)};` // Replace it with the new object string
      );
      await fs.writeFileSync(actualfilePath, newContentJs, 'utf-8')

      // Read the entire file content
      let oldContentTs = fs.readFileSync(filePath, 'utf-8');
      // Use a regular expression to find and replace only the `myVar` part
      const newContentTs = oldContentTs.replace(
        /const Pwa = {[\s\S]*?};/, // Regex to find the `myVar` object
        `const Pwa = ${JSON.stringify(pwaObj, null, 2)};` // Replace it with the new object string
      );
      await fs.writeFileSync(filePath, newContentTs, 'utf-8')
      
      // RESPONSE
      response.data = pwaObj;
      response.message = 'PWA_UPDATED';
      response.status = true;
      response.statusCode = 201;
    } catch (error) {
      console.log('Error \n', error);
      response.status = false;
      response.message = error.message || response.message;
      response.statusCode = error.statusCode || response.statusCode;
    }
  
    return res.status(response.statusCode || 500).json(response).end();
  }

  
  static readonly getAllPWA = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
  
    const updatedIcon = Pwa.icons.map(icon => ({
      ...icon,
      src: `${Config.baseUrl}${icon.src}`
    }))
  
    const updatedPWA = {
      ...Pwa,
      icons: updatedIcon
    }
    try {
      response.data = updatedPWA
      response.message = 'PWA_LISTED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly removeIcon = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const { index } = req.body;

      if (typeof index !== 'number' || index < 0 || index >= Pwa.icons.length) {
        throw new Error('INVALID_INDEX_VALUE_GIVEN');
      }

      Pwa.icons = Pwa.icons.filter((_, i) => i !== index);

      const __dirname = path.resolve();
      const filePath =`${__dirname}/src/Config/PwaConfig.ts`;
      const actualfilePath = `${__dirname}/build/Config/PwaConfig.js`

      //  const fileContent = `const PWA = ${JSON.stringify(PWA, null, 2)};\nexport { PWA }`
      //  const fileWrite = await fs.writeFileSync(filePath, fileContent)
      //  const fileCopy = await fs.copyFileSync(filePath, actualfilePath)

      // Read the entire file content
      let oldContentJs = fs.readFileSync(actualfilePath, 'utf-8');
      // Use a regular expression to find and replace only the `myVar` part
      const newContentJs = oldContentJs.replace(
        /const PWA = {[\s\S]*?};/, // Regex to find the `myVar` object
        `const PWA = ${JSON.stringify(Pwa, null, 2)};` // Replace it with the new object string
      );
      await fs.writeFileSync(actualfilePath, newContentJs, 'utf-8')

      // Read the entire file content
      let oldContentTs = fs.readFileSync(filePath, 'utf-8');
      // Use a regular expression to find and replace only the `myVar` part
      const newContentTs = oldContentTs.replace(
        /const PWA = {[\s\S]*?};/, // Regex to find the `myVar` object
        `const PWA = ${JSON.stringify(Pwa, null, 2)};` // Replace it with the new object string
      );
      await fs.writeFileSync(filePath, newContentTs, 'utf-8')

      response.data = Pwa
      response.message = 'PWA_ICON_REMOVED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}

export { SettingsController }