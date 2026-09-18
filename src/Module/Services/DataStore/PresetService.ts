import mongoose from 'mongoose'
import Country from '@abserve/Module/Listing/Model/Country'
import State from '@abserve/Module/Listing/Model/State'
import City from '@abserve/Module/Listing/Model/City'

class PresetService {
  static readonly getCountry = async (query: any) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const orCond = []
      const findCondition = {}

      if (query.exceptId) findCondition['_id'] = { $ne: new mongoose.Types.ObjectId(query.exceptId) }

      // if (query._id) findCondition['_id'] = { _id: mongoose.Types.ObjectId(query._id) }
      if (query._id) orCond.push({ _id: new mongoose.Types.ObjectId(query._id) })
      if (query.name) orCond.push({ name: query.name })

      if (query.code) orCond.push({ code: query.code })

      if (query.phonecode) orCond.push({ phonecode: query.phonecode })

      findCondition['$or'] = orCond

      const account = await Country.findOne(findCondition).exec()

      if (!account) throw new Error('NOT_FOUND|COUNTRY')

      response.status = true
      response.data = {
        Country: account
      }
      response.message = 'FOUND|COUNTY'
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static readonly getState = async (query: any) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const orCond = []
      const findCondition = {}

      if (query.exceptId) findCondition['_id'] = { $ne: new mongoose.Types.ObjectId(query.exceptId) }

      if (query._id) orCond.push({ _id: new mongoose.Types.ObjectId(query._id) })

      if (query.name) orCond.push({ name: query.name })

      if (query.code) orCond.push({ code: query.code })

      findCondition['$or'] = orCond
      const account = await State.findOne(findCondition).exec()

      if (!account) throw new Error('NOT_FOUND|STATE')

      response.status = true
      response.data = {
        State: account
      }
      response.message = 'FOUND|STATE'
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static readonly getCity = async (query: any) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const orCond = []
      const findCondition = {}
      if (query.exceptId) findCondition['_id'] = { $ne: new mongoose.Types.ObjectId(query.exceptId) }

      if (query._id) orCond.push({ _id: new mongoose.Types.ObjectId(query._id) })

      if (query.name) orCond.push({ name: query.name })

      if (query.country_id || query.state_id || query.code) {
        const andCond = []

        if (query.country_id) andCond.push({ country_id: query.country_id })

        if (query.state_id) andCond.push({ state_id: query.state_id })

        if (query.code) andCond.push({ code: query.code })

        if (andCond.length > 0) {
          orCond.push({ $and: andCond })
        }
      }

      findCondition['$or'] = orCond

      const account = await City.findOne(findCondition).exec()

      if (!account) throw new Error('NOT_FOUND|CITY')

      response.status = true;
      response.data = {
        City: account
      }
      response.message = 'FOUND|CITY';
    } catch (error) {
      response.status = false;
      response.data = {};
      response.message = error.message || response.message;
    }
    return response
  }
}

export { PresetService }
