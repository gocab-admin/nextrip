import Ajv, { Schema } from 'ajv'

class BaseValidator {
  static schemas?: Record<string, Schema>;
  static getSchema(schemaName: string): Schema {
    if (!this.schemas || !this.schemas[schemaName]) {
      throw new Error(`Schema "${schemaName}" not found in ${this.name}`);
    }
    return this.schemas[schemaName];
  }

  static readonly ajvFormater = async (formatObject) => {
    let errorMessages = []
    try {
      const { errors = [], messages = [] } = formatObject
      if (errors && errors.length > 0) {
        for (const error of errors) {
          let schemaPath = error.keyword
          if (error.schemaPath) {
            let schemaPathArr = error.schemaPath.split('/')
            let schemaPathEle = schemaPathArr[1] || ''
            schemaPath = schemaPath == schemaPathEle ? schemaPath : `${schemaPath}:${schemaPathEle}`
          }
          schemaPath = `${schemaPath}:${error.params.missingProperty}`
          errorMessages.push(messages[schemaPath] || error.message)
        }
      }
    } catch (error) {
      errorMessages = [error.message]
    }
    return errorMessages
  }

  static readonly ajvCompiler = async (compileObject) => {
    try {
      const { schema = {}, messages = {}, data = {} } = compileObject
      const ajv = new Ajv({});
      ajv.addKeyword({
        keyword : 'ObjectId',
        type : 'string',
        validate: function (schema: any, data: any) {
          const validateFn: any = function (schema: any, data: any) {
            return typeof data === 'string' && data.trim() !== '';
          };
      
          validateFn.errors = [
            {
              keyword: 'ObjectId',
              message: 'Parameter is not in the type of ObjectId.',
              params: { keyword: 'ObjectId' },
            },
          ];
      
          return validateFn(schema, data);
        },
        errors: true,
      })
      ajv.addKeyword({
        keyword: 'isNotEmpty',
        type: 'string',
        validate: function validate(schema, data) {
          const validateFn: any = function (schema: any, data: any) {
            return typeof data === 'string' && data.trim() !== '';
          };
          validateFn.errors = [
            {
              keyword: 'isNotEmpty',
              message: 'Parameter is not empty.',
              params: { keyword: 'isNotEmpty' },
            },
          ];
          return validateFn(schema, data);
        },
        errors: true,
      })
      const validate = ajv.compile(schema)
      validate(data)
      const formatError = await this.ajvFormater({ errors: validate.errors, messages: messages })
      return formatError || []
    }
    catch (error) {
      return [error.message]
    }
  }
  static messages: any

  // static readonly ajvCompiler = async (compileObject) => {
  //   try {
  //     const { schema = {}, messages = {}, data = {} } = compileObject
  //     const ajv = new Ajv({})
  //     const validate = ajv.compile(schema)
  //     validate(data)
  //     const formatError = await this.ajvFormater({ errors: validate.errors, messages: messages })
  //     return formatError || []
  //   } catch (error) {
  //     console.log(error)
  //     return [error.message]
  //   }
  // }

  static async validateData(data, schemaName = null) {
    const response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {
        validate: [] as any[]
      }
    }

    try {
      schemaName = schemaName || this.validateData.name
      if (!schemaName) throw new Error('SCHEMA_NOT_FOUND')
      const schema = this.getSchema(schemaName)
      const messages = (this.messages && this.messages[schemaName]) || {}
      const validate = await this.ajvCompiler({ schema, data, messages })

      if (validate && validate.length > 0) {
        throw new Error('VALIDATION_FAILED', { cause: validate })
      }
      response.status = true
      response.message = 'VALIDATION_SUCCESS'
      response.data = {
        validate: []
      }
    } catch (error) {
      response.status = false
      response.message = error.message || 'VALIDATION_FAILED'
      response.data = {
        validate: Array.isArray(error.cause) ? error.cause : []
        // validate: error.cause
      }
    }
    return response
  }
}

export { BaseValidator }