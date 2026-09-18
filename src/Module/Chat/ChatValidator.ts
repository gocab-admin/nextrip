import { BaseValidator } from '@abserve/Module/BaseValidator'

class ChatValidator extends BaseValidator {
  constructor() {
    super()
  }

  static schemas = {
    message : {
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
    message : {
      'required:receiver': 'receiver is required'
    }
  }
}
export { ChatValidator }