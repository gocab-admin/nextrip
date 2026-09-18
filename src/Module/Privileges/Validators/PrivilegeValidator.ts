import { BaseValidator } from '@abserve/Module/BaseValidator'

class PrivilegeValidator extends BaseValidator {
  constructor() {
    super()
  }

  static schemas = {
    addPrivilege : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['name', 'description'],
      additionalProperties: false
    },
    addPrivilegeCategory : {
      type: 'object',
      properties: {
        privilegeId: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['name', 'description'],
      additionalProperties: false
    },
    addPrivilegeItem : {
      type: 'object',
      properties: {
        privilegeId: { type: 'string' },
        privilegeCategoryId: {  type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['name', 'description'],
      additionalProperties: true
    },
    addModuleCategory : {
      type: 'object',
      properties: {
        moduleId: { type: 'string'},
        moduleType: { type: 'string' },
        privilegeId: { type: 'array' },
        privilegeCategoryId: { type: 'array' },
        privilegeItemId: { type: 'array' }
      },
      additionalProperties: true
    }
  }

  static messages = {
    addPrivilege : {
      'required:name': 'name is required',
      'required:description': 'description is required'
    },
    addPrivilegeCategory : {
      'required:name': 'name is required',
      'required:description': 'description is required'
    },
    addPrivilegeItem : {
      'required:name': 'name is required',
      'required:description': 'description is required'
    },
    addModuleCategory : {
      'required:moduleId': 'moduleId is required'
    }
  }
}
export { PrivilegeValidator }