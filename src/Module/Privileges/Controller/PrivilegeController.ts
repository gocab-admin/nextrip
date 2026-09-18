import mongoose from 'mongoose'
import Privilege from '@abserve/Module/Privileges/Model/Privileges'
import PrivilegeCategory from '@abserve/Module/Privileges/Model/PrivilegeCategories'
import PrivilegeItem from '@abserve/Module/Privileges/Model/PrivilegeItems'
import ModuleCategory from '@abserve/Module/Privileges/Model/ModuleCategories'
import ListingAttachment from '@abserve/Module/Listing/Model/ListingAttachment'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { PrivilegeValidator } from '@abserve/Module/Privileges/Validators/PrivilegeValidator'
import { BaseController } from '@abserve/Module/BaseControllers'
import { SingleFileRequest, AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { uploadToLocal, removeFile, cloudinaryUpload } from '@abserve/Module/FileUpload/index'
import { FolderConfig } from '@abserve/Module/FileUpload/FolderConfig'

class PrivilegeController extends BaseController {
  constructor() {
    super()
  }

  //Privileges
  static readonly addPrivilege = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body

      const validation = await PrivilegeValidator.validateData(body , "addPrivilege")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let checkCategory = await Privilege.find({ name: body.name, deletedAt: null })
      if (checkCategory.length !== 0) throw new CustomError.BadRequestError('PRIVILEGE_ALREADY_FOUND')

      const newDoc: any = new Privilege()
      newDoc.name = body.name
      newDoc.description = body.description
      let data = await newDoc.save()


      // RESPONSE
      response.message = 'PRIVILEGE_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { privilege: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listPrivilege = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let pageQuery: any = await this.paginationBuilder(req.query)
      let like = {
        $or: [
          { name: { $regex: req.query.search || '', $options: 'i' } },
          { description: { $regex: req.query.search || '', $options: 'i' } }
        ]
      }
      let matchCondition = req.params.id ? { _id: new mongoose.Types.ObjectId(req.params.id) } : {};
      let privilege: any
      
      privilege = await Privilege.aggregate([
        { $match: { ...matchCondition, ...like } },
        { $match : { deletedAt: null } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            privilege: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ]) 

      if (privilege.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.data = {
        totalCount: privilege[0]?.totalCount[0]?.total,
        privilege: privilege[0]?.privilege
      }
      response.message = 'PRIVILEGE_LISTED'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updatePrivilege = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let updateDoc = await Privilege.findById(req.params.id, {
          name: 1,
          description: 1
      }).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      // const validation = await PrivilegeValidator.addPrivilege(body)
      // if (!validation.status) {
      //   throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      // }

      updateDoc.name = body.name || updateDoc.name
      updateDoc.description = body.description || updateDoc.description
      updateDoc.save()


      // RESPONSE
      response.message = 'PRIVILEGE_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { privilege: updateDoc }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deletePrivilege = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      data: {},
      message: 'Unprocessable Entity',
      validation: {},
      statusCode: 500
    }
    try {
      let data = await Privilege.findOneAndUpdate(
        { _id: req.params.id },
        { deletedAt: Date.now() },  
        { new: true }             
      ).lean().exec()
  
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_DELETE')


      // RESPONSE
      response.message = 'PRIVILEGE_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  //PrivilegeCategory
  static readonly addPrivilegeCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const query:any = req.query

      const validation = await PrivilegeValidator.validateData(body , "addPrivilegeCategory")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let checkCategory = await PrivilegeCategory.find({ name: body.name,  deletedAt: null, privilegeId: query.privilegeId })
      if (checkCategory.length !== 0) throw new CustomError.BadRequestError('PRIVILEGE_CATEGORY_ALREADY_FOUND')

      const newDoc: any = new PrivilegeCategory()
      newDoc.privilegeId = new mongoose.Types.ObjectId( query.privilegeId ) 
      newDoc.name = body.name
      newDoc.description = body.description
      let data = await newDoc.save()


      // RESPONSE
      response.message = 'PRIVILEGE_CATEGORY_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { PrivilegeCategory: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listPrivilegeCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let query: any = req.query
      let pageQuery: any = await this.paginationBuilder(query)
      let like = {
        $or: [
          { name: { $regex: query.search || '', $options: 'i' } },
          { description: { $regex: query.search || '', $options: 'i' } }
        ]
      }
      let matchCondition = req.params.id ? { _id: new mongoose.Types.ObjectId(req.params.id) } : {};
      let queryCondition = query.privilegeId ? { privilegeId: new mongoose.Types.ObjectId(query.privilegeId) } : {};
      let privilegeCategory: any
      
      privilegeCategory = await PrivilegeCategory.aggregate([
        { $match: { ...matchCondition, ...like } },
        { $match: queryCondition },
        { $match : { deletedAt: null } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            privilegeCategory: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ]) 

      if (privilegeCategory.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.data = {
        totalCount: privilegeCategory[0]?.totalCount[0]?.total,
        privilegeCategory: privilegeCategory[0]?.privilegeCategory
      }
      response.message = 'PRIVILEGE_CATEGORY_LISTED'
      response.status = true
      response.statusCode = 200
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updatePrivilegeCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      let updateDoc = await PrivilegeCategory.findById(req.params.id, {
          privilegeId: 1,
          name: 1,
          description: 1
      }).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      updateDoc.name = body.name || updateDoc.name
      updateDoc.description = body.description || updateDoc.description
      updateDoc.save()


      // RESPONSE
      response.message = 'PRIVILEGE_CATEGORY_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { privilegeCategory: updateDoc }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deletePrivilegeCategory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      data: {},
      message: 'Unprocessable Entity',
      validation: {},
      statusCode: 500
    }
    try {

      let data = await PrivilegeCategory.findOneAndUpdate(
        { _id: req.params.id },
        { deletedAt: Date.now() },  
        { new: true }             
      ).lean().exec()
  
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_DELETE')

      // RESPONSE
      response.message = 'PRIVILEGE_CATEGORY_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  //Privilege Items
  static readonly addPrivilegeItems = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body
      const query:any = req.query
      const validation = await PrivilegeValidator.validateData(body , "addPrivilegeItem")
      if (!validation.status) {
        throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)
      }

      let checkPrivileges = await PrivilegeItem.find({ name: body.name, deletedAt: null, privilegeId: query.privilegeId, privilegeCategoryId: query.privilegeCategoryId })
      if (checkPrivileges.length !== 0) throw new CustomError.BadRequestError('PRIVILEGE_ITEMS_ALREADY_FOUND')

      const newDoc: any = new PrivilegeItem()
      newDoc.privilegeId = new mongoose.Types.ObjectId(query.privilegeId)
      newDoc.privilegeCategoryId = new mongoose.Types.ObjectId(query.privilegeCategoryId)
      newDoc.name = body.name
      newDoc.description = body.description
      newDoc.inputType = body.inputType
      if (req.file) {
        // const imagePath = await uploadToLocal( req.file, FolderConfig.Icon )
        // newDoc.icon = imagePath
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.Icon )
        newDoc.icon = cloudImage.url
        newDoc.publicId = cloudImage.publicId
      }
      let data = await newDoc.save()


      // RESPONSE
      response.message = 'PRIVILEGE_ITEMS_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { privilegeItem: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static readonly updatePrivilegeItems = async (req: SingleFileRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      const body = req.body

      let updateDoc = await PrivilegeItem.findById(req.params.id, { name: 1, description: 1, privilegeId: 1, privilegeCategoryId: 1, publicId: 1 }).exec()
      if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

      updateDoc.name = body.name || updateDoc.name
      updateDoc.description = body.description || updateDoc.description
      updateDoc.inputType = body.inputType || updateDoc.inputType

      if (req.file && updateDoc.publicId) await removeFile(updateDoc.publicId);

      if (req.file) {
        // const imagePath = await uploadToLocal( req.file, FolderConfig.Icon )
        // updateDoc.icon = imagePath
        const cloudImage = await cloudinaryUpload( req.file.buffer, FolderConfig.Icon )
        updateDoc.icon = cloudImage.url
        updateDoc.publicId = cloudImage.publicId
      }
      updateDoc.save()


      // RESPONSE
      response.message = 'PRIVILEGE_ITEMS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { privilegeItem: updateDoc }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.validationArr || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listPrivilegeItems = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      message: 'Unprocessable Entity',
      statusCode: 500,
      status: false,
      data: {},
      validation: {}
    }
    try {
      let query: any = req.query
      let pageQuery: any = await this.paginationBuilder(req.query)
      let like = {
        $or: [
          { name: { $regex: req.query.search || '', $options: 'i' } },
          { description: { $regex: req.query.search || '', $options: 'i' } }
        ]
      }
      let matchCondition = req.params.id ? { _id: new mongoose.Types.ObjectId(req.params.id) } : {};
      let queryCondition = query.privilegeCategoryId ? { privilegeCategoryId: new mongoose.Types.ObjectId(query.privilegeCategoryId) } : {};
      let privilegeItem = await PrivilegeItem.aggregate([
        { $match: { ...matchCondition, ...like } },
        { $match: queryCondition },
        { $match : { deletedAt: null } },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            totalCount: [{ $count: 'total' }],
            privilegeItem: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
          }
        }
      ])
      if (privilegeItem.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


      // RESPONSE    
      response.message = 'PRIVILEGE_ITEMS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = {
        totalCount: privilegeItem[0]?.totalCount[0]?.total,
        privilegeItem: privilegeItem[0]?.privilegeItem
      }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deletePrivilegeItems = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {

      let data = await PrivilegeItem.findOneAndUpdate(
        { _id: req.params.id },
        { deletedAt: Date.now() },  
        { new: true }             
      ).lean().exec()
  
      if (!data) throw new CustomError.BadRequestError('FAILED_TO_DELETE')

      
      // RESPONSE
      response.message = 'PRIVILEGE_ITEMS_DELETED'
      response.status = true
      response.statusCode = 200
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

//Module category

static readonly addModuleCategory = async ({ moduleId, moduleType, privilegeItemId }: any) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {},
    validation: {}
  }
  try {
    const privilegeItems = await PrivilegeItem.find({ _id: { $in: privilegeItemId }}).lean().exec()
    if (!privilegeItems.length) throw new CustomError.BadRequestError('PRIVILEGE_ITEMS_NOT_FOUND')
    
    const privilegeIds = [...new Set(privilegeItems.map(item => item.privilegeId.toString()))];
    const privilegeCategoryIds = [...new Set(privilegeItems.map(item => item.privilegeCategoryId.toString()))];
    const privilegeItemIds = [...new Set(privilegeItems.map(item => item._id.toString()))];

    let moduleData: any = await ModuleCategory.findOne({ moduleId: moduleId }).exec();
    if (moduleData) {
      moduleData.privilegeId = [...new Set([...privilegeIds])];
      moduleData.privilegeCategoryId = [...new Set([...privilegeCategoryIds])];
      moduleData.privilegeItemId = [...new Set([...privilegeItemIds])];
      
      const updatedCategory = await moduleData.save();

      response.message = 'MODULE_CATEGORIES_UPDATED';
      response.status = true;
      response.statusCode = 200;
      response.data = updatedCategory;
    }
    else{
    const newDoc: any = new ModuleCategory({
      moduleId: moduleId,
      moduleType,
      privilegeId: privilegeIds,
      privilegeCategoryId: privilegeCategoryIds,
      privilegeItemId: privilegeItemIds
    })

    const savedCategory = await newDoc.save()

    // RESPONSE
    response.message = 'MODULE_CATEGORIES_ADDED'
    response.status = true
    response.statusCode = 200
    response.data =  savedCategory 
  }
  } catch (error) {
    console.log('Error \n', error)
    response.status = false
    response.message = error.message || response.message
    response.validation = error.validationArr || {}
    response.statusCode = error.statusCode || response.statusCode
  }
  return response
}


static readonly updateModuleCategory = async (req: SingleFileRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {},
    validation: {}
  }
  try {
    const body = req.body
    const validation = await PrivilegeValidator.validateData(body , "addModuleCategory")
    if (!validation.status) {
      throw new CustomError.UnProcessableError("Validation Failed", validation.data.validate)
    }

    let updateDoc = await ModuleCategory.findById(req.params.id, { moduleType:1, privilegeId: 1, privilegeCategoryId: 1, privilegeItemId: 1 }).exec()
    if (!updateDoc) throw new CustomError.BadRequestError('DATA_NOT_FOUND')

    updateDoc.moduleType = body.moduleType
    updateDoc.privilegeId = body.privilegeId
    updateDoc.privilegeCategoryId = body.privilegeCategoryId
    updateDoc.privilegeItemId = body.privilegeItemId
    updateDoc.save()


    // RESPONSE
    response.message = 'MODULE_CATEGORY_UPDATED'
    response.status = true
    response.statusCode = 200
    response.data = { privilegeItem: updateDoc }
  } catch (error) {
    console.log('Error \n', error)
    response.status = false
    response.message = error.message || response.message
    response.validation = error.validationArr || {}
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode || 500).json(response).end()
}


static readonly listModuleCategory = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {},
    validation: {}
  }
  try {
    let query: any = req.query
    let pageQuery: any = await this.paginationBuilder(query)
    let privilegeItem = await ModuleCategory.aggregate([
      // { $match: { ...like } },
      // { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'privileges',
          localField: 'privilegeId',
          foreignField: '_id',
          as: 'privilegesData'
        }
      },
      {
        $lookup: {
          from: 'privilegecategories', 
          localField: 'privilegeCategoryId',
          foreignField: '_id',
          as: 'privilegeCategoriesData'
        }
      },
      {
        $lookup: {
          from: 'privilegeitems', 
          localField: 'privilegeItemId', 
          foreignField: '_id',
          as: 'privilegeItemsData'
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          totalCount: [{ $count: 'total' }],
          privilegeItem: [{ $skip: pageQuery.skip }, { $limit: pageQuery.take }]
        }
      }
    ])
    if (privilegeItem.length == 0) throw new CustomError.BadRequestError('DATA_NOT_FOUND')


    // RESPONSE    
    response.message = 'MODULE_CATEGORIES_LISTED'
    response.status = true
    response.statusCode = 200
    response.data = {
      totalCount: privilegeItem[0]?.totalCount[0]?.total,
      privilegeItem: privilegeItem[0]?.privilegeItem.map(item => ({
        _id: item._id,
        moduleType: item.moduleType,
        deletedAt: item.deletedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        privilegesData: item.privilegesData || [],
        privilegeCategoriesData: item.privilegeCategoriesData || [],
        privilegeItemsData: item.privilegeItemsData || [] 
      }))
    }
  } catch (error) {
    console.log('Error \n', error)
    response.status = false
    response.message = error.message || response.message
    response.validation = error.reasons || {}
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode || 500).json(response).end()
}


static readonly deleteModuleCategory = async (req: AuthenticateRequest, res: Response) => {
  let response = {
    status: false,
    message: 'Unprocessable Entity',
    data: {},
    validation: {},
    statusCode: 500
  }
  try {

    let data = await ModuleCategory.findOneAndUpdate(
      { _id: req.params.id },
      { deletedAt: Date.now() },  
      { new: true }             
    ).lean().exec()

    if (!data) throw new CustomError.BadRequestError('FAILED_TO_DELETE')

    
    // RESPONSE
    response.message = 'MODULE_CATEGORY_DELETED'
    response.status = true
    response.statusCode = 200
    response.data = data
  } catch (error) {
    console.log('Error \n', error)
    response.status = false
    response.message = error.message || response.message
    response.validation = error.reasons || {}
    response.statusCode = error.statusCode || response.statusCode
  }
  return res.status(response.statusCode || 500).json(response).end()
}

static readonly getPrivileges = async (moduleId: any) => {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: {},
    validation: {}
  }
  try {
    
    const privileges: any = await ModuleCategory.findOne({ moduleId: moduleId })
    .populate('privilegeId')
    .populate('privilegeCategoryId')
    .populate('privilegeItemId')
    .exec()
    if (privileges) {
      privileges.privilegeId.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      privileges.privilegeCategoryId.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      privileges.privilegeItemId.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

      return privileges;
    } else {
      return {}; 
    }
  } catch (error) {
    console.log('Error \n', error)
    response.status = false
    response.message = error.message || response.message
    response.validation = error.validationArr || {}
    response.statusCode = error.statusCode || response.statusCode
  }
  return response
}


static readonly ifPrivilegeExists = async (moduleId: any) => {

  const moduleData = await ModuleCategory.findOne({ moduleId: moduleId }).lean().exec();
  if(moduleData) throw new CustomError.BadRequestError('PRIVILEGE_ALREADY_ADDED_FOR_LISTING')
    
};

static async getModulesByPrivileges(privileges: any) {
  let response = {
    message: 'Unprocessable Entity',
    statusCode: 500,
    status: false,
    data: [],
    validation: {}
  };

  try {
      const privilegeIds = privileges.slice(1, -1).split(',').map((str: any) => new mongoose.Types.ObjectId(str));
      const moduleData = await ModuleCategory.find(
        { privilegeItemId: { $in: privilegeIds } },
        { moduleId: 1 }
      );

      const moduleIds = [...new Set(moduleData.map(item => item.moduleId))];
      return moduleIds.length > 0
      ? { _id: { $in: moduleIds } }
      : { _id: { $exists: false } };

  } catch (error) {
    console.log('Error\n', error);
    response.message = error.message || response.message;
    response.validation = error.validationArr || {};
    response.statusCode = error.statusCode || response.statusCode;
  }

  return response;
}

static async fetchPrivileges(regex: any, pageQuery: any) {
  try {
    const privilegeData = await Privilege.aggregate([
      {
        $match: {
          deletedAt: null,
          "$or": [
            { "name": regex },
            { "description": regex }
          ]
        }
      },
      { "$sort": { "createdAt": -1 } },
      {
        "$facet": {
          totalCount: [{ $count: "total" }],
          privileges: [{ "$skip": pageQuery.skip }, { "$limit": pageQuery.take }]
        }
      }
    ]);

    return {
      totalCount: privilegeData[0]?.totalCount[0]?.total || 0,
      privileges: privilegeData[0]?.privileges || []
    };
  } catch (error) {
    console.log('Error\n', error);
    throw error;
  }
}

static async fetchPrivilegeItems(regex: any, queryCondition: any) {
try {
     const privilegeItemData = await PrivilegeItem.aggregate([
      {
        $match: {
          ...queryCondition,
          deletedAt: null,
          "$or": [
            { "name": regex },
            { "description": regex }
          ]
        }
      },
      { "$sort": { "createdAt": -1 } },
      // {
      //   '$facet': {
      //     totalCount: [{ $count: "total" }],
      //     privilegeItems: [{ "$skip": pageQuery.skip }, { "$limit": pageQuery.take }]
      //   }
      // }
    ]);

    // return {
    //   totalCount: privilegeItemData[0]?.totalCount[0]?.total || 0,
    //   privilegeItems: privilegeItemData[0]?.privilegeItems || []
    // };
    return {
      totalCount: privilegeItemData.length || 0,
      privilegeItems: privilegeItemData || [],
    };
  } catch (error) {
    console.log('Error\n', error);
    throw error;
  }
}
}

export  { PrivilegeController };