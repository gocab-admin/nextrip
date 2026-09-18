import randomize from 'randomatic'
import fs from 'fs'
import path from 'path'
import CustomError from '@abserve/errors/index'
import Currency from '@abserve/Module/Currency/Currency'
import { AdminController } from '@abserve/Module/Auth/Controller/AdminController'
import { UserController } from '@abserve/Module/Auth/Controller/UserController'
import { Config } from '@abserve/Config/AppConfig'

interface Helper extends AdminController, UserController {}

class HelperFunctionController implements Helper {
  static readonly makeDirectory = async (pathUrl: any) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const movePath = {
        newPath: pathUrl
      }
      if (fs.existsSync(pathUrl)) {
        movePath['exist'] = true
      } else {
        fs.mkdirSync(pathUrl, { recursive: true });
        movePath['exist'] = false;
      }
      response = {
        status: true,
        data: movePath,
        message: 'UNPROCESSABLE_ENTITY'
      }
    } catch (error) {
      console.error('MAKE_DIRECTORY', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    console.log(response)
    return response
  }


  static readonly moveFile = async (path1: any, path2: any) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      await new Promise((resolve, reject) => {
        fs.rename(path1, path2, (err: any) => {
          if (err) reject(new Error(err))
          else resolve(true)
        })
      })
      response = {
        status: true,
        data: {},
        message: 'FILE_MOVED'
      }
    } catch (error) {
      console.error('MOVE_FILE', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }


  static readonly removeFile = async (data: any) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      fs.unlinkSync(data)
      return true
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }


  static readonly getFilePath = async (path: any) => {
    let folderName = 'public'
    path = path.split(folderName)
    return folderName + path[1]
  }


  static readonly uploadDoc = async (documentData: any, pathUL: any, body: any, dbData: any) => {
    let response: any = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const removeOldFiles = []
      let findFile: any = {}

      const fieldArr = []
      for (const document of documentData.fields) {
        const fieldData = {
          name: document.indexName
        }
        let findField: any
        if (dbData) {
          findFile = dbData.find((e: any) => e.name == body.fieldName)
          if (findFile?.status == 'rejected') {
            findFile.status = 'pending'
            findFile.reason = ''
          }
        }
        if (findFile?.fields) {
          findField = findFile.fields.find((e: any) => e.name == document.indexName)
        }
        if (document.type == 'image') {
          const filesData: any[] = body.files
          const imagePath = filesData.find((elem: any) => elem.fieldname == document.indexName)
          if (imagePath) {
            // Remove Existing File
            if (findField) {
              removeOldFiles.push(pathUL + '/' + findField.value)
            }
            const getPath: any = await this.makeDirectory(pathUL)

            if (!getPath.status) throw new Error(getPath.message)
            const directory = getPath.data.newPath + '/' + path.basename(imagePath.path)
            await this.moveFile(imagePath.path, directory)
            fieldData['value'] = path.basename(imagePath.path)
          } else {
            fieldData['value'] = findField?.value ? findField.value : ''
          }
        } else if (document.type == 'string') {
          fieldData['value'] = body[document.indexName] || findField.value
        } else if (document.type == 'date') {
          let dateData = body[document.indexName] || findField.value
          dateData = new Date(dateData)
          dateData.setHours(0, 0, 0, 0)
          fieldData['value'] = dateData.toISOString()
        }
        fieldArr.push(fieldData)
      }
      response['data']['removeOldFiles'] = removeOldFiles
      response['data']['fieldArr'] = fieldArr
      response['data']['findFile'] = findFile
      response['status'] = true
      response['message'] = 'success'
    } catch (error) {
      console.error('Upload Docs Error: ', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }


  static readonly getTime = async (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes = 0] = time.split(':').map(Number);
    // Convert to 24-hour format
    if ((modifier === 'PM' || modifier === 'pm') && hours !== 12) {
        hours += 12;
    } else if ((modifier === 'AM' || modifier === 'am') && hours === 12) {
        hours = 0;
    }
    const totalSeconds = (hours * 3600) + (minutes * 60);
    return totalSeconds;
  }


  // static getOtp = async (id) => {
  //   let val = Math.floor(1000 + Math.random() * 9000);
  //   let otpArray: any = await verifyOtp.find({ receiver: id }, { otp: 1 })
  //   const equal = data => data.otp === val
  //   while (otpArray.some(equal)) {
  //     val = Math.floor(1000 + Math.random() * 9000);
  //   }
  //   return val;
  // }


  static readonly getOtp = async (type = '0', no = 4) => {
    if (Config.app.appMode == 'dev') {
      return 1111
    } else {
      return randomize(type, no)
    }
  }


  static readonly fixedNum = async (value) => {
    return Number((parseFloat(value) || 0).toFixed(Number(Config?.toFixedCount) || 0))
  }


  static readonly convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number> => {
    try {
      const fromCurrencyData = await Currency.findOne({ code: fromCurrency }).exec()
      const toCurrencyData = await Currency.findOne({ code: toCurrency }).exec()

      if (!fromCurrencyData || !toCurrencyData) throw new CustomError.BadRequestError('CURRENCY_DATA_NOT_FOUND')

      const fromExchangeRate: number = parseFloat(fromCurrencyData.exchange_rate)
      const toExchangeRate: number = parseFloat(toCurrencyData.exchange_rate)

      if (isNaN(fromExchangeRate) || isNaN(toExchangeRate))
        throw new CustomError.BadRequestError('INVALID_EXCHANGE_RATE_DATA')

      const exchangeRate: number = toExchangeRate / fromExchangeRate

      const convertedAmount: number = amount * exchangeRate

      return convertedAmount
    } catch (error) {
      throw new Error(`Currency conversion failed: ${error.message}`)
    }
  }


  static readonly getExchangeRate = async (currency: any) => {
    try {
      let queryCurrency = {};
      if(!currency)
            queryCurrency = { default:true }
      else
            queryCurrency = { code: currency }

      const fromCurrencyData = await Currency.findOne(queryCurrency).exec()
      const toCurrencyData = await Currency.findOne(queryCurrency).exec()

      if (!fromCurrencyData || !toCurrencyData) throw new CustomError.BadRequestError('CURRENCY_DATA_NOT_FOUND')

      const fromExchangeRate: number = parseFloat(fromCurrencyData.exchange_rate)
      const toExchangeRate: number = parseFloat(toCurrencyData.exchange_rate)

      if (isNaN(fromExchangeRate) || isNaN(toExchangeRate))
        throw new CustomError.BadRequestError('INVALID_EXCHANGE_RATE_DATA')

      let exchangeRate: number = toExchangeRate / fromExchangeRate
      exchangeRate = parseFloat(exchangeRate.toFixed(Number(Config?.toFixedCount) || 2))
      return {
        exchangeRate,
        toCode: toCurrencyData.code,
        toSymbol: toCurrencyData.symbol
      }
    } catch (error) {
      // throw new Error(`Failed to retrieve exchange rate: ${error.message}`)
      return { exchangeRate: 1, toCode: 'USD', toSymbol: '$' }
    }
  }

  static readonly getExchangeRateForPhonePe = async (currency: any) => {
    try {
      let queryCurrency = { code: currency }
  
      const fromCurrencyData = await Currency.findOne(queryCurrency).exec()
      const toCurrencyData = await Currency.findOne({ code: 'INR' }).exec()

      if (!fromCurrencyData || !toCurrencyData) throw new CustomError.BadRequestError('CURRENCY_DATA_NOT_FOUND')

      const fromExchangeRate: number = parseFloat(fromCurrencyData.exchange_rate)
      const toExchangeRate: number = parseFloat(toCurrencyData.exchange_rate)

      if (isNaN(fromExchangeRate) || isNaN(toExchangeRate))
        throw new CustomError.BadRequestError('INVALID_EXCHANGE_RATE_DATA')

      let exchangeRate: number = toExchangeRate / fromExchangeRate
      exchangeRate = parseFloat(exchangeRate.toFixed(Number(Config?.toFixedCount) || 2))
      return {
        exchangeRate,
        toCode: toCurrencyData.code,
        toSymbol: toCurrencyData.symbol
      }
    } catch (error) {
      return { exchangeRate: 1, toCode: 'USD', toSymbol: '$' }
    }
  }
}

export { HelperFunctionController }