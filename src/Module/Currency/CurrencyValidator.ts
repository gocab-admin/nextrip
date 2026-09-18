import { BaseValidator } from '../BaseValidator'

class CurrencyValidator extends BaseValidator {
  constructor() {
    super()
  }
  static schemas = {
    addCurrency : {
      type: 'object',
      properties: {
        code: { type: 'string' }
      },
      additionalProperties: true
    },
    updateCurrency : {
      type: 'object',
      properties: {
        code: { type: 'string' }
      },
      additionalProperties: true
    }
  }

  static messages = {
    addCurrency : {
      'required:code': 'code is required'
    },
    updateCurrency : {
      'required:code': 'code is required'
    }
  }
}
export { CurrencyValidator }