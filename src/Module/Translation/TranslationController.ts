import mongoose from 'mongoose'
import Translation from './models/Translation'
import Transcribe from './models/Transcribe'
import Language from './models/Language'
import CustomError from '@abserve/errors/index'
import { Worker } from 'worker_threads'
import { readFileSync, readdir } from 'node:fs'
import { BaseController } from '../BaseControllers'
import { TranslationValidator } from './TranslationValidator'
import { QueryBuilder } from '@abserve/Helper/QueryBuilder'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { Response } from 'express'
import { HelperFunctionController as Helper } from '@abserve/Helper/Function'
import { Config } from '@abserve/Config/AppConfig'

class TranslationController extends BaseController {
  constructor() {
    super()
  }

  static readonly jsonParse = (buffer: any, { reviver }: any = {}) => {
    const data = new TextDecoder().decode(buffer)
    return JSON.parse(data, reviver)
  }


  static readonly jsonLoad = async (filePath: any, options: any) => {
    const buffer = await readFileSync(filePath)
    return this.jsonParse(buffer, options)
  }


  static readonly readFiles = (__dirname: any) => {
    return new Promise((resolve, reject) => {
      readdir(__dirname, async (err, __files) => {
        try {
          if (err) reject(new Error(err.message))
          else {
            const __fileData = {}
            for (const __file of __files) {
              __fileData[__file.split('.')[0] || __file] = await this.jsonLoad(__dirname + '/' + __file, {})
            }
            resolve(__fileData)
          }
        } catch (error) {
          reject(new Error(error))
        }
      })
    })
  }


  static readonly getTranslation = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const queryData = req.query
      const perPage: any = queryData.limit || 10
      const page: any = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject: any = {}
      const queryBuilder: any = await QueryBuilder.getSearchable(Translation, queryData)
      queryObject = queryBuilder.queryObject
      if (queryData.search) {
        queryObject['interpret'] = { $regex: queryData.search, $options: 'i' }
      }

      const groupIds = await Translation.distinct('group', {
        group: { $ne: null }
      }).exec()
      if (groupIds) queryObject['_id'] = { $nin: groupIds }
      const translationsCount = await Translation.find(queryObject).count().exec()
      const translations = await Translation.find(queryObject, { interpret: 1 }).populate('group', 'interpret').skip(skip).limit(perPage).lean().exec()


      //RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'TRANSLATION_LISTED'
      response.data = { translations: translations, count: translationsCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error?.cause?.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getTranslationJson = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const translations = await this.readFiles('locale')
      if (!translations) throw new CustomError.BadRequestError('NO_TRANSLATION_FOUND')

      //RESPONSE
      response.data = translations
      response.message = 'LISTED_TRANSLATION_JSON'
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


  static readonly updateTranslationFile = async (translations: any) => {
    try {
      const { language, fileData, group = null } = translations
      if (typeof fileData) {
        for (const key of Object.keys(fileData)) {
          const findQuery = { interpret: key }
          // if (group) findQuery["group"] = group;
          findQuery['group'] = group

          const getTranslation = await Translation.findOneAndUpdate(
            findQuery,
            {},
            { new: true, upsert: true }
          )
            .lean()
            .exec()

          if (typeof fileData[key] === 'object') {
            this.updateTranslationFile({
              language: language,
              fileData: fileData[key],
              group: getTranslation._id
            })
          } else {
            await Transcribe.findOneAndUpdate(
              { language: language, translation: getTranslation._id },
              { describe: fileData[key] },
              { upsert: true }
            ).lean().exec()
          }
        }
      }
    } catch (error) {
      console.error('UPDATE_TRANSLATION_FILE_ERROR', error)
    }
  }


  static readonly getTranslationGroup = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const queryData = req.query
      const perPage: any = queryData.limit || 10
      const page: any = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject: any = {}
      const queryBuilder: any = await QueryBuilder.getSearchable(Translation, queryData)
      queryObject = queryBuilder.queryObject

      const groupIds = await Translation.distinct('group', {
        group: { $ne: null }
      }).exec()
      if (groupIds) queryObject['_id'] = { $in: groupIds }
      const translationsCount = await Translation.find(queryObject).count().exec()
      const translations = await Translation.find(queryObject, { interpret: 1 }).populate('group', 'interpret').skip(skip).limit(perPage).lean().exec()


      //RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED_TRANSLATION_GROUPS'
      response.data = { translations: translations, count: translationsCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error?.cause?.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly setDefaultLanguage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const { languageId } = req.params

      const updatedLanguage = await Language.findOneAndUpdate(
        { _id: languageId, softDel: false },
        { default: true },
        { new: true }
      ).exec()
      if (!updatedLanguage) throw new CustomError.BadRequestError(`LANGUAGE_NOT_FOUND`)

      await Language.updateMany({ _id: { $ne: languageId } }, { default: false }).exec()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.data = { updatedLanguage }
      response.message = 'LANGUAGE_SET_AS_DEFAULT_SUCCESSFULLY'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteTranslation = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      validation: {},
      data: {}
    }
    try {
      const paramData = req.params
      const validation = await TranslationValidator.validateData(paramData , "deleteTranslation")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }
      const getTranslation: any = await Translation.findOne({
        _id: new mongoose.Types.ObjectId(paramData.translationId),
        deletedAt: null
      }).lean().exec()
      if (!getTranslation) throw new CustomError.BadRequestError('TRANSLATION_NOT_FOUND')
      getTranslation.deletedAt = new Date()
      await getTranslation.save()


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'TRANSLATION_DELETED_SUCCESSFULLY'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || response.validation
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getLanguages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      validation: {},
      status: false,
      data: {}
    }
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage: any = queryData.limit || 10
      const page: any = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const validation = await TranslationValidator.validateData(queryData , "getLanguage")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let queryObject: any = {}

      const queryBuilder: any = await QueryBuilder.getSearchable(Language, queryData)
      queryObject = queryBuilder.queryObject
      queryObject.deletedAt = null

      if (paramData.languageId) queryObject['_id'] = new mongoose.Types.ObjectId(paramData.languageId)
      const languageCount = await Language.find(queryObject, {}).count().exec()

      const languageList = await Language.find(queryObject, {}).skip(skip).limit(perPage).exec()

      //RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED_LANGUAGE'
      response.data = { language: languageList, count: languageCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || response.validation
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getLanguagesForUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      validation: {},
      data: {}
    }
    try {
      const queryData = req.query
      const paramData = req.params

      const validation = await TranslationValidator.validateData(queryData , "getLanguage")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let queryObject: any = {}

      const queryBuilder: any = await QueryBuilder.getSearchable(Language, queryData)
      queryObject = queryBuilder.queryObject
      queryObject.deletedAt = null

      if (paramData.languageId) queryObject['_id'] = new mongoose.Types.ObjectId(paramData.languageId)
      const languageCount = await Language.find(queryObject, {}).count().exec()

      const languageList = await Language.find(queryObject, {}).exec()


      //RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LISTED_LANGUAGE'
      response.data = { language: languageList, count: languageCount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || response.validation
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteLanguages = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      let languageId: any = req.params.languageId

      const language = await Language.findOne({ _id: new mongoose.Types.ObjectId(languageId) }).exec()
      if (!language) throw new CustomError.BadRequestError('LANGUAGE_NOT_FOUND')

      if (Config.hiddenSettings.mode == '1') throw new CustomError.UnProcessableError('SORRY, YOU_ARE_NOT_ALLOWED_TO_DELETE_IN_DEMO_MODE', [])
      const deletedLanguage = await Language.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(languageId), softDel: false, default: false },
        { softDel: true, deletedAt: Date.now(), status: false },
        { new: true }
      ).exec()
      if (!deletedLanguage) throw new CustomError.BadRequestError("DEFAULT_LANGUAGE_CANNOT_BE_DELETED")


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'LANGUAGE_DELETED'
      response.data = { deletedLanguage }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateLanguage = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      validation: {},
      data: {}
    }
    try {
      const body = req.body
      const validation = await TranslationValidator.validateData(body , "updateLanguage")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let fileData = null
      let filePath = ''
      if (req.file?.path) {
        fileData = await this.jsonLoad(req.file.path, {})
        if (!fileData) throw new Error('DATA_NOT_PROCESSABLE')

        const hasNestedArrays = (obj: any) => {
          if (Array.isArray(obj)) {
            return true
          }
          for (const key in obj) {
            if (typeof obj[key] === 'object' && hasNestedArrays(obj[key])) {
              return true
            }
          }
          return false
        }

        if (typeof fileData != 'object' || Array.isArray(fileData) || hasNestedArrays(fileData))
          throw new Error('DATA_STRUCTURE_IS_NOT_PROCESSABLE')

        const pathUrl = 'locale'
        const fileName = body.indexName + '.json'
        filePath = pathUrl + '/' + fileName

        const getPath = await Helper.makeDirectory(pathUrl)
        if (!getPath.status) throw new Error(getPath.message)

        const moveFile = await Helper.moveFile(req.file.path, filePath)
        console.log('i am here', moveFile)
        if (!moveFile.status) throw new Error(moveFile.message)
      }

      let getLanguage = await Language.findOne({
        name: body.name,
        indexName: body.indexName,
        softDel: false
      }).exec()
      if (!getLanguage) {
        getLanguage = new Language()
      }
      getLanguage.name = body.name
      getLanguage.indexName = body.indexName
      getLanguage.file = filePath != '' ? filePath : getLanguage.file
      getLanguage.status = body.status || false
      const language = await getLanguage.save()

      if (fileData) {
        this.updateTranslationFile({
          fileData: fileData,
          language: language._id,
          group: null
        })
      }


      //RESPONSE
      response.status = true
      response.statusCode = 200
      response.data = { language: language }
      response.message = 'ADD_LANGUAGE'
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || response.validation
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getTranscribe = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      validation: {},
      data: {}
    }
    try {
      const paramData = req.params
      const validation = await TranslationValidator.validateData(paramData , "getTranscribe")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const languages = await Language.aggregate([
        {
          $match: {
            status: true
          }
        },
        {
          $lookup: {
            from: 'transcribes',
            let: {
              languageId: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$language', '$$languageId'] },
                      {
                        $eq: ['$translation', new mongoose.Types.ObjectId(paramData.translationId)]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'transcribe'
          }
        },
        {
          $unwind: {
            path: '$transcribe',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            'transcribe._id': { $ifNull: ['$transcribe._id', null] },
            'transcribe.translation': {
              $ifNull: ['$transcribe.translation', null]
            },
            'transcribe.describe': { $ifNull: ['$transcribe.describe', null] }
          }
        }
      ])
      if (languages.length <= 0) throw new CustomError.BadRequestError('TRANSLATION_NOT_FOUND')


      //RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'TRANSCRIBE_LISTED'
      response.data = languages
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || response.validation
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateTranscribe = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      validation: {},
      data: {}
    }
    try {
      const paramData = req.params
      const bodyData = req.body

      const validation = await TranslationValidator.validateData(bodyData , "updateTranscribe")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const transcribeData: any = []
      const findQuery = {}
      const transactionID = bodyData.translationId || paramData.translationId;
      if (transactionID)
        findQuery['_id'] = new mongoose.Types.ObjectId(transactionID)
      else {
        findQuery['interpret'] = bodyData.interpret
        if (bodyData.group) findQuery['group'] = bodyData.group
      }
      const getTranslation = await Translation.findOneAndUpdate(findQuery, {}, { new: true, upsert: true }).lean().exec()
      if (!getTranslation) throw new CustomError.BadRequestError('TRANSLATION_NOT_ADDED')
      if (!bodyData.isGroup) {
        for (const transcribe of bodyData.transcribe) {
          const transcribeUpdate = await Transcribe.findOneAndUpdate(
            { language: transcribe.language, translation: getTranslation._id },
            { describe: transcribe.describe },
            { new: true, upsert: true }
          ).lean().exec()
          transcribeData.push({
            _id: transcribeUpdate._id,
            translation: transcribeUpdate.translation,
            translationLanguage: transcribeUpdate.language,
            describe: transcribeUpdate.describe
          })
        }
      }


      //RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'TRANSCRIBE_UPDATED_SUCCESSFULLY'
      response.data = {
        translation: {
          _id: getTranslation._id,
          group: getTranslation.group,
          interpret: getTranslation.interpret
        },
        transcribe: transcribeData
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || response.validation
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly generateJson = async (req: AuthenticateRequest, res: any) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const worker = new Worker('./build/Utils/TranslationWorker.js')

      worker.on('message', (stream) => {
        if (stream?.error) {
          console.log(stream.error)
          if (!res.headersSent) return res.status(500).send('Worker error')
        } else if(!res.headersSent){
          return res.status(200).send('File Generated')
        } 
      })

      worker.on('error', (error) => {
        console.error('WORKER_ERROR:', error)
        if (!res.headersSent) return res.status(500).send('Worker error')
      })
    } catch (error) {
      console.error('GENERATE_JSON_ERROR: ', error)
      if (!res.headersSent) {
        response.status = false
        response.message = error.message || response.message
        response.statusCode = error?.cause?.statusCode || response.statusCode
      }
    }
  }
}

export { TranslationController }