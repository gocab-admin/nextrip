import { BaseValidator } from '@abserve/Module/BaseValidator'

class MessageValidator extends BaseValidator {
  constructor() {
    super()
  }
  static schemas = {
    addMessage : {
      type: 'object',
      properties: {
        title: { type: 'string' },
        messageContent: { type: 'string' }
      },
      required: ['receiver'],
      additionalProperties: true
    }
  }

  static messages = {
    addMessage : {
      'required:receiver': 'receiver is required'
    }
  }
}
export { MessageValidator }