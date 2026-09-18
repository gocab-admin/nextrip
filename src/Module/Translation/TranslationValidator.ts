import { BaseValidator } from '../BaseValidator'

class TranslationValidator extends BaseValidator {
  constructor() {
    super()
  }

  static schemas = {
    getTranscribe : {
      type: 'object',
      properties: {
        translationId: { type: 'string' }
      },
      additionalProperties: true
    },
    updateTranscribe : {
      type: 'object',
      properties: {
        // translationId: { type: 'string', ObjectId: true }
      },
      additionalProperties: true
    },
    getLanguage : {
      type: 'object',
      properties: {
        limit: { type: 'string' },
        page: { type: 'string' }
      },
      additionalProperties: true
    },
    updateLanguage : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        indexName: { type: 'string' },
        status: { type: 'string' }
      },
      additionalProperties: true
    },
    deleteTranslation : {
      type: 'object',
      properties: {
        translationId: { type: 'string', ObjectId: true }
      },
      additionalProperties: true
    }
  }
}
export { TranslationValidator }