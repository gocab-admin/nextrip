import { BaseValidator } from '@abserve/Module/BaseValidator'

class AdsValidator extends BaseValidator {
  constructor() {
    super()
  }
  static schemas = {
    Info : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        desc: { type: 'string' }
      },
      required: ['name', 'desc'],
      additionalProperties: true
    },

    address : {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: {
            city: { type: 'string' },
            state: { type: 'string' },
            country: { type: 'string' },
            zipcode: { type: 'string' },
            Address: { type: 'string' },
            lat: { type: 'string' },
            lng: { type: 'string' }
          }
        },
        additionalProperties: false
      }
    }
  }

  static messages = {
    Info : {
      'required:name': 'name is required',
      'required:desc': 'description is required'
    },
    address : {
      'required:city': 'city is required',
      'required:state': 'state is required',
      'required:country': 'country is required',
      'required:zipcode': 'zipcode is required',
      'required:address': 'address is required',
      'required:lat': 'lat is required',
      'required:lng': 'lng is required'
    }
  }

  static addPackages = async (data: any) => {
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
          packageName: { type: 'string' },
          price: { type: 'number'},
          currency: { type: 'string' },
          validityDays: { type: 'number'},
          adsLimit: { type: 'number'},
          type: { type: 'string' }
        },
        required: ['packageName', 'price', 'validityDays', 'type', 'adsLimit'],
        additionalProperties: true
      }
      const messages = {
        'required:packageName': 'Package name is required',
        'required:price': 'Price is required',
        'required:validityDays': 'Validity Days is required',
        'required:type': 'Type is required',
        'required:adsLimit': 'Ads Limit is required',
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })

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

  static updatePackages = async (data: any) => {
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
          packageName: { type: 'string' },
          price: { type: 'number'},
          currency: { type: 'string' },
          validityDays: { type: 'number'},
          adsLimit: { type: 'number'},
          type: { type: 'string' }
        },
        additionalProperties: true
      }
      const messages = {
        'required:packageName': 'Package name is required',
        'required:price': 'Price is required',
        'required:validityDays': 'Validity Days is required',
        'required:type': 'Type is required',
        'required:adsLimit': 'Ads Limit is required',

      }
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })

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

export { AdsValidator }