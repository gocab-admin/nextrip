import { BaseValidator } from '@abserve/Module/BaseValidator'
import { DocumentConfig } from '@abserve/Config/DocumentConfig'
import CustomError from '@abserve/errors/index'

class DocumentValidator extends BaseValidator {
  constructor() {
    super()
  }

  static readonly documentValidate = async (data: any) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {
        validate: [] as any[]
      }
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          fieldName: { type: 'string' }
        },
        additionalProperties: false
      }
      const documentIndex = DocumentConfig.user.findIndex((el) => el.indexName == data.fieldName)

      if (documentIndex == -1) throw new CustomError.BadRequestError('DOCUMENT_NOT_FOUND')
      const documentData = { ...DocumentConfig.user[documentIndex] }

      for (const document of documentData.fields) {
        if (document.type == 'image' || document.type == 'string' || document.type == 'date') {
          schema.properties[document.indexName] = { type: 'string' }
        }
      }
      const messages = {}
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0){
        throw new Error('VALIDATION_FAILED', { cause: validate })
      }
      response.status = true;
      response.message = 'VALIDATION_SUCCESS';
      response.data = {
        validate: []
      }
    } catch (error) {
      response.status = false;
      response.message = error.message || 'VALIDATION_FAILED';
      response.data = {
        validate: Array.isArray(error.cause) ? error.cause : []
      }
    }
    return response
  }
}

export { DocumentValidator }
