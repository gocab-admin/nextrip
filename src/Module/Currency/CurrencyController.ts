import Currency from './Currency'
import currencySymbolMap from 'currency-symbol-map'
import axios from 'axios'
import CustomError from '@abserve/errors/index'
import { BaseController } from '@abserve/Module/BaseControllers'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { Config } from '@abserve/Config/AppConfig'
import { Response } from 'express'
import { CurrencyValidator } from './CurrencyValidator'

class CurrencyController extends BaseController {
  constructor() {
    super()
  }

static readonly addCurrency = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {},
    validation: {}
  }
  try {
    const { code } = req.body

    const validation = await CurrencyValidator.validateData(req.body , "addCurrency")
    if (!validation.status) {
      throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
    }

    const existingCurrency = await Currency.findOne({ code }).exec()
    if (existingCurrency){
      throw new CustomError.BadRequestError('CURRENCY_WITH_THE_SAME_CODE_ALREADY_EXIST')
    }
      const count = await Currency.countDocuments()
      let baseCurrencyCode: any
      if(count == 0) {
        baseCurrencyCode = code
      } else {
        const defaultCurrency = await Currency.findOne({ default: true }).exec()
        baseCurrencyCode = defaultCurrency ? defaultCurrency.code : code;
      }

    const responseFromAPI = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${baseCurrencyCode}`)
    const currencyData = responseFromAPI.data.data.rates

    const currencyDetails = currencyData[code]
    if (!currencyDetails) throw new CustomError.BadRequestError(`CURRENCY_WITH_CODE ${code} NOT_FOUND`)

    const responseCurrencies = await axios.get(`https://api.coinbase.com/v2/currencies`)
    const currencyNames = responseCurrencies.data.data

    const currencyName = currencyNames.find((c: any) => c.id === code)
    if (!currencyName) {
      throw new CustomError.BadRequestError(`CURRENCY_NAME_FOR_CODE ${code} NOT_FOUND`)
    }
    
    const symbol = currencySymbolMap(code)
    const defaultCurrency = count === 0 

    const newCurrency = new Currency({
      code,
      name: currencyName.name,
      symbol,
      exchange_rate: currencyDetails,
      default: defaultCurrency
    })
    const savedCurrency = await newCurrency.save()


    // RESPONSE
    response.status = true
    response.statusCode = 200
    response.data = { currency: savedCurrency }
    response.message = 'CURRENCY_ADDED_SUCCESSFULLY'
  } catch (error) {
    console.error('Error:', error)
    response.status = false
    response.message = error.message || response.message
    response.validation = error.validationArr || {}
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode).json(response)
}


static readonly updateCurrency = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {},
    validation: {}
  }
  try {
    const { code } = req.body

    const validation = await CurrencyValidator.validateData(req.body , "updateCurrency")
    if (!validation.status) {
      throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
    }

    let baseCurrency: any
    const defaultCurrency = await Currency.findOne({ default: true })
    baseCurrency = defaultCurrency.code || 'USD'

    const responseRates = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${baseCurrency}`)
    const currencyData = responseRates.data.data.rates

    const currencyDetails = currencyData[code]
    if (!currencyDetails) throw new CustomError.BadRequestError(`CURRENCY_WITH_CODE ${code} NOT_FOUND`)
    
    const responseCurrencies = await axios.get(`https://api.coinbase.com/v2/currencies`)
    const currencyNames = responseCurrencies.data.data

    const currencyName = currencyNames.find((c: any) => c.id === code)
    if (!currencyName) throw new CustomError.BadRequestError(`CURRENCY_NAME_FOR_CODE ${code} NOT_FOUND`)
    
    // const symbol = currencySymbolMap(code)

    const existingCurrency = await Currency.findOne({ code }).exec()
    if (!existingCurrency) throw new CustomError.BadRequestError('CURRENCY_NOT_FOUND')
    
    existingCurrency.name = currencyName.name
    existingCurrency.exchange_rate = currencyDetails
    const updatedCurrency = await existingCurrency.save()


    // RESPONSE
    response.status = true
    response.statusCode = 200
    response.data = { currency: updatedCurrency }
    response.message = 'CURRENCY_UPDATED_SUCCESSFULLY'
  } catch (error) {
    console.error('Error:', error)
    response.status = false
    response.message = error.message || response.message
    response.validation = error.validationArr || {}
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode).json(response)
}


static readonly getCurrency = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    totalCount: 0,
    data: {}
  }
  try {
    let currency: any
    const { code } = req.params
    const { _page = 1, _limit = 20 }: any = req.query
    let queryData:any = req.query
    const skip = (Number(_page) - 1) * Number(_limit)

    if (code) {
      currency = await Currency.findOne({ code }).exec()
      if (!currency) throw new CustomError.BadRequestError(`CURRENCY_WITH_CODE ${code} NOT_FOUND`)
    } else {
      let query:any = {}
      if (queryData.search) {
        const regex = new RegExp(queryData.search, 'i')
        query = { $or: [{ name: regex }, { code: regex }] }
      }
      if(queryData.name) query.name = { $regex: queryData.name, $options: 'i' };
      if(queryData.code) query.code = { $regex: queryData.code, $options: 'i' };
      response.totalCount = await Currency.countDocuments(query)

      currency = await Currency.find(query).skip(skip).limit(Number(_limit)).exec()
      if (!currency || currency.length == 0) throw new CustomError.BadRequestError(`NO_CURRENCIES_FOUND_MATCHING ${queryData.search}`)
    }


    // RESPONSE
    response.status = true
    response.statusCode = 200
    response.data = { currency }
    response.message = 'CURRENCY_FETCHED_SUCCESSFULLY'
  } catch (error) {
    console.error('Error:', error)
    response.status = false
    response.message = error.message || response.message
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode).json(response)
}


static readonly deleteCurrency = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {}
  }
  try {
    const id = req.params.id
    const currency = await Currency.findById(id).exec()
    if (!currency) throw new CustomError.BadRequestError(`CURRENCY_NOT_FOUND`)

    if (currency.default) throw new CustomError.BadRequestError('BASE_CURRENCY_CANNOT_BE_DELETED')
    
    if (Config.hiddenSettings.mode == '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_DEMO_MODE', [])
    
    const deletedCurrency: any = await Currency.findByIdAndDelete(id).exec()
    if (!deletedCurrency) throw new CustomError.BadRequestError(`CURRENCY_NOT_FOUND`)
    
    if (deletedCurrency.default) {
      const newDefaultCurrency = await Currency.findOneAndUpdate(
        { code: 'USD' }, 
        { default: true },
        { new: true } 
      ).exec()
      if (!newDefaultCurrency) throw new CustomError.BadRequestError('FAILED_TO_SET_USD_AS_A_NEW_DEFAULT_CURRENCY')
    }


    // RESPONSE
    response.status = true
    response.statusCode = 200
    response.data = { deletedCurrency }
    response.message = 'CURRENCY_DELETED_SUCCESSFULLY'
  } catch (error) {
    console.error('Error:', error)
    response.status = false
    response.message = error.message || response.message
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode).json(response)
}


static readonly setDefaultCurrency = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {}
  }
  try {
    const id = req.params.id
    const updatedCurrency = await Currency.findByIdAndUpdate(
      id,
      { default: true },
      { new: true } 
    ).exec()
    if (!updatedCurrency) {
      throw new CustomError.BadRequestError(`CURRENCY_NOT_FOUND`)
    }
    
      await Currency.updateMany(
        { _id: { $ne: id } },
      { default: false }
    ).exec()
    
    await this.updateAllCurrencyMethod()

    // RESPONSE
    response.status = true
    response.statusCode = 200
    response.data = { updatedCurrency }
    response.message = 'CURRENCY_SET_DEFAULT_SUCCESSFULLY'
  } catch (error) {
    console.error('Error:', error)
    response.status = false
    response.message = error.message || response.message
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode).json(response)
}


static readonly updateAllCurrencyMethod =  async () => {
  let baseCurrency: any
    const defaultCurrency = await Currency.findOne({ default: true })
    baseCurrency = defaultCurrency.code || 'USD'

    const responseFromAPI = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${baseCurrency}`)
    const currencyData = responseFromAPI.data.data.rates
    
    const currencies = await Currency.find().exec()
    for (const currency of currencies) {
      const { code } = currency

      if (currencyData[code]) {
        const currencyDetails = currencyData[code]
        
        await Currency.findByIdAndUpdate(
          currency._id,
          { exchange_rate: currencyDetails },
          { new: true }
        ).exec()
      }
    }
}


static readonly updateAllCurrencyRates = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {}
  }
  try { 
    await this.updateAllCurrencyMethod();


    // RESPONSE
    response.status = true
    response.statusCode = 200
    response.message = 'CURRENCIES_EXCHANGE_RATES_UPDATED_SUCCESSFULLY'
  } catch (error) {
    console.error('Error:', error)
    response.status = false
    response.message = error.message || response.message
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode).json(response)
}
}

export { CurrencyController }