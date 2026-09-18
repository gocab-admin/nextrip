import mongoose from 'mongoose'
import User from '../Model/User'
import CustomError from '@abserve/errors/index'
import { HelperFunctionController as Helper } from '@abserve/Helper/Function'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { DocumentValidator } from '../Validators/DocumentValidator'
import { BaseController } from '@abserve/Module/BaseControllers'
import { DocumentConfig } from '../../../Config/DocumentConfig'
import { Response } from 'express'
import { Enum } from '@abserve/Utils/Enum'

class DocumentController extends BaseController {
  constructor() {
    super()
  }

  static readonly parseDocument = async (documentType: any, inputDocument: any, additionalData: any) => {
    let parseDocument = []
    try {
      const settings = DocumentConfig[documentType]
      if (!settings) throw new CustomError.BadRequestError('NOT_FOUND_DOCUMENT_TYPE')
      const documentData = JSON.parse(JSON.stringify(settings))
      for (const document of documentData) {
        document.dataType = documentType
        document.reason = ''
        const documentIndex = inputDocument.findIndex((i: any) => i.name === document.indexName)
        if (documentIndex != -1) {
          const actualDocument = inputDocument[documentIndex]
          const addPath = additionalData?.addPath ? additionalData.addPath : ''
          document.isUploaded = true
          document.status = actualDocument.status
          document.reason = actualDocument.reason || ''
          if (document.fields) {
            for (const field of document.fields) {
              if (actualDocument.fields) {
                const fieldIndex = actualDocument.fields.findIndex((i: any) => i.name == field.indexName)
                if (fieldIndex != -1) {
                  if (field.type == 'image') {
                    field.value = `${document.storage}/${addPath}/${actualDocument.fields[fieldIndex].value}`
                  } else {
                    field.value = actualDocument.fields[fieldIndex].value
                  }
                }
              }
            }
          }
        } else {
          document.isUploaded = false
          document.status = 'needAction'
          document.reason = ''
        }
        delete document['storage']
        parseDocument.push(document)
      }
    } catch (error) {
      console.error('PARSE_DOCUMENT_ERROR: ', error)
      parseDocument = []
    }
    return parseDocument
  }


  static readonly uploadDocument = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      validation: {},
      data: {}
    }
    try {
      console.log('getin')
      const body = req.body
      const authData: any = req.auth || {}
      const userId = authData.role == Enum.ROLES.USER ? authData.userId : new mongoose.Types.ObjectId(req.params.userId)

      const validation = await DocumentValidator.documentValidate(body)
      console.log(validation)
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const userData: any = await User.findOne({ _id: userId })
      if (!userData) throw new CustomError.BadRequestError('NOT_FOUND_USER')

      const fieldName = body.fieldName
      const documentIndex = DocumentConfig.user.findIndex((el) => el.indexName == fieldName)

      if (documentIndex == -1) throw new CustomError.BadRequestError('NOT_FOUND_DOCUMENT')
      const documentData = { ...DocumentConfig.user[documentIndex] }
      body['files'] = req.files
      
      const resData = await Helper.uploadDoc(
        documentData,
        `./${documentData.storage}/${userData._id}/`,
        body,
        userData.document
      )
      
      if (!resData.status) throw new CustomError.BadRequestError('DOCUMENT_NOT_UPLOADED')
      const findFieldName: any = await User.findOne({
        _id: userId,
        document: { $elemMatch: { name: fieldName } }
      })

      let updateQuery: any = {}
      let findQuery = {}

      if (!findFieldName) {
        updateQuery = {
          $push: {
            document: {
              name: body.fieldName,
              // status: resData['data'].findFile.status,
              // reason: resData['data'].findFile.reason,
              fields: resData['data'].fieldArr
            }
          }
        }
        findQuery = {
          _id: userId
        }
      } else {
        updateQuery = {
          $set: {
            'document.$.name': fieldName,
            'document.$.status': resData['data'].findFile.status,
            'document.$.reason': resData['data'].findFile.reason,
            'document.$.fields': resData['data'].fieldArr
          }
        }
        findQuery = {
          _id: userId,
          'document.name': fieldName
        }
      }

      const updateData: any = await User.findOneAndUpdate(findQuery, updateQuery, { new: true })

      if (updateData) {
        if (resData['data'].removeOldFiles.length > 0) {
          resData['data'].removeOldFiles.forEach(async (e: any) => await Helper.removeFile(e))
        }
      }

      const userDocs = updateData.document.length > 0 ? updateData.document : []
      const getParseDocument = await this.parseDocument('user', userDocs, { addPath: userId })


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'UPLOAD_DOCUMENT'
      response.data = { documents: getParseDocument }
    } catch (error) {
      console.error('UPLOAD_DOCUMENT_ERROR: ', error)
      response.status = false
      response.statusCode = error.statusCode || response.statusCode
      response.validation = error.validationArr || {};
      response.message = error.message || response.message
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getUserDocuments = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const authData: any = req.auth || {}
      const userId = authData.role == Enum.ROLES.USER ? authData.userId : new mongoose.Types.ObjectId(req.params.userId)

      const userData: any = await User.findOne({ _id: userId }).lean().exec()
      if (!userData) throw new CustomError.BadRequestError('USER_NOT_FOUND')
      const userDocs = userData.document?.length > 0 ? userData.document : []
      const getParseDocument = await this.parseDocument('user', userDocs, { addPath: userId })


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'GET_USER_DOCUMENTS'
      response.data = { documents: getParseDocument }
    } catch (error) {
      console.error('GET_USER_DOCUMENTS_ERROR: ', error)
      response.status = false
      response.statusCode = error.statusCode || response.statusCode
      response.message = error.message || response.message
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly getExpiredUsers = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const queryData = req.query || {}
      const perPage: any = queryData.limit || 10
      const page: any = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const nameFilters = []
      let dateFieldFilters = []

      for (const data of DocumentConfig.user) {
        const addItems = data.fields.reduce((acc, cur) => {
          if (cur.type === 'date') {
            acc = [...acc, cur.indexName]
          }
          return acc
        }, [])
        if (addItems.length > 0) {
          nameFilters.push(data.indexName)
          dateFieldFilters = [...dateFieldFilters, ...addItems]
        }
      }

      const userList = await User.aggregate([
        {
          $match: {
            document: {
              $elemMatch: {
                name: { $in: nameFilters },
                status: 'approved',
                fields: {
                  $elemMatch: {
                    name: { $in: dateFieldFilters }
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            document: {
              $map: {
                input: '$document',
                as: 'doc',
                in: {
                  $mergeObjects: [
                    '$$doc',
                    {
                      fields: {
                        $map: {
                          input: '$$doc.fields',
                          as: 'field',
                          in: {
                            $mergeObjects: [
                              '$$field',
                              {
                                convertedDate: {
                                  $convert: {
                                    input: '$$field.value',
                                    to: 'date',
                                    onError: null
                                  }
                                }
                              }
                            ]
                            // $cond: {
                            //   if: {
                            //     $setIsSubset: [['$$field.name'], dateFieldFilters]
                            //   },
                            //   then: {
                            //     $mergeObjects: [
                            //       '$$field',
                            //       {
                            //         convertedDate: {
                            //           $convert: {
                            //             input: '$$field.value',
                            //             to: 'date',
                            //             onError: null
                            //           }
                            //         }
                            //       }
                            //     ]
                            //   },
                            //   else: '$$field'
                            // }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $match: {
            document: {
              $elemMatch: {
                name: { $in: nameFilters },
                status: 'approved',
                fields: {
                  $elemMatch: {
                    $and: [
                      { name: { $in: dateFieldFilters } },
                      { convertedDate: { $lt: new Date() } }
                      // { $or: [{ convertedDate: { $ne: null } }, { convertedDate: { $lt: new Date() } }] }
                    ]
                  }
                }
              }
            }
          }
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $sort: { _id: -1 } },
              { $skip: Number(skip) || 0 },
              { $limit: Number(perPage) || 10 },
              {
                $project: {
                  fname: 1,
                  email: 1,
                  phone: 1,
                  phoneCode: 1,
                  uniCode: 1
                }
              }
            ]
          }
        }
      ])


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = 'GET_USER_DOCUMENT_EXPIRY_NOTIFY'
      response.data = {
        partnerList: userList[0]?.data || [],
        total: userList[0]?.metadata[0]?.total || 0
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.statusCode = error.statusCode || response.statusCode
      response.message = error.message || response.message
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateStatus = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {}
    }
    try {
      const { userId = '', name = '', status = '', reason = '' } = req.body
      let docsData = []

      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) }).exec()
      if (!user) throw new CustomError.BadRequestError('NOT_FOUND_USER')

      const updateDocs: any = await User.findOneAndUpdate(
        { _id: userId, document: { $elemMatch: { name: name } } },
        {
          $set: {
            'document.$.status': status,
            'document.$.reason': reason
          }
        },
        { new: true }
      ).exec()

      if (!updateDocs) throw new CustomError.BadRequestError('USER_HAS_SOME_ISSUE_TO_UPDATE_THIS_STATUS')
      docsData = updateDocs.document || []


      // RESPONSE
      response.status = true
      response.statusCode = 200
      response.message = "STATUS_UPDATED"
      response.data = docsData
    } catch (error) {
      console.log("ERROR", error);
      response.status = false
      response.statusCode = error.statusCode || response.statusCode
      response.message = error.message || response.message
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}

export { DocumentController }