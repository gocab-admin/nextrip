import { BaseValidator } from '@abserve/Module/BaseValidator'

class WalletValidator extends BaseValidator {
  constructor() {
    super()
  }

  static schemas = {
    bank : {
      type: 'object',
      properties: {
        acctType: { type: 'string' },
        bankName: { type: 'string' },
        acctHolderName: { type: 'string' },
        acctNumber: { type: 'string' },
        routing_number: { type: 'string' },
        permanentAcctNum: { type: 'string' },
        country: { type: 'string' }
      },
      required: [
        'acctType',
        'bankName',
        'acctHolderName',
        'acctNumber',
        'routing_number',
        'permanentAcctNum',
        'country'
      ],
      additionalProperties: true
    },
    updateBank : {
      type: 'object',
      properties: {
        userBankId: { type: 'string' },
        stripeBankId: { type: 'string' },
        stripeAcctId: { type: 'string' }
      },
      required: ['userBankId', 'stripeBankId', 'stripeAcctId'],
      additionalProperties: true
    }
  }

  static messages = {
    bank : {
      'required:acctType': 'Account Type is required',
      'required:bankName': 'Bank Name is required',
      'required:acctHolderName': 'Account Hoder Name is required',
      'required:acctNumber': 'Account Number is required',
      'required:routing_number': 'routing_number is required',
      'required:permanentAcctNum': 'Permanent Account Number is required',
      'required:country': 'Country is required'
    },
    updateBank : {
      'required:userBankId': 'User Bank Id is required',
      'required:stripeBankId': 'Stripe Bank Id is required',
      'required:stripeAcctId': 'Stripe Account Id is required'
    }
  }

  static updateContact = async (data: any) => {
    let response = {
      status: false,
      message: 'Validation Failed',
      data: {
        validate: [] as any[]
      }
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          contactId: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          reference_id: { type: 'string' },
          notes: { type: 'string' },
        },
        required: ['contactId'],
        additionalProperties: true
      }
      const messages = {
        'required:contactId': 'Contact Id is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0) throw new Error('Validation Failed', { cause: validate })
      response = {
        status: true,
        message: 'Validation Success',
        data: {
            validate: []
        }
      }
    } catch (Error) {
      response = {
        status: false,
        message: Error.message || 'Validation failed',
        data: {
          validate: Array.isArray(Error.cause) ? Error.cause : []
        }
      }
    }
    return response
  }
}

export { WalletValidator }