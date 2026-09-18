import { BaseValidator } from '@abserve/Module/BaseValidator'

class ListValidator extends BaseValidator {
  constructor() {
    super()
  }
  static schemas = {
    amenityData : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        desc: { type: 'string' }
      },
      required: ['name', 'desc']
    },
    amenityCategory : {
      type: 'object',
      properties: {
        category: { type: 'string' },
        desc: { type: 'string' }
      },
      required: ['category', 'desc'],
      additionalProperties: false
    },
    amenityList : {
      type: 'object',
      properties: {
        amenityId: { type: 'string' },
        amenitycategoryId: { type: 'string' }
      },
      required: ['amenityId'],
      additionalProperties: false
    },
    blockedDates : {
      type: 'object',
      properties: {
        title: { type: 'string' },
        start: { type: 'string' },
        end: { type: 'string' }
      },
      required: ['start', 'end']
    },
    updateDates : {
      type: 'object',
      properties: {
        dateId: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' }
      },
      required: ['dateId'],
      additionalProperties: false
    },
    addPricing : {
      type: 'object',
      properties: {
        perHour: { type: 'number' },
        minimumNight: { type: 'integer' },
        maximumNight: { type: 'integer' },
        perDay: { type: 'number' }
      },
      required: ['perHour', 'perDay'],
      additionalProperties: true
    },
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
        // required: ["city"],
        additionalProperties: true
      }
    },
    addRules : {
      type: 'object',
      properties: {
        title: { type: 'string' },
        desc: { type: 'string' }
      },
      required: ['title', 'desc'],
      additionalProperties: true
    },
    addAmenity : {
      type: 'object',
      properties: {
        amenityId: { type: 'array' }
      },
      required: ['amenityId']
    },
    estimateListing : {
      type: 'object',
      properties: {
        adults: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        bookingType: { type: 'string' }
      },
      required: ['adults', 'startDate', 'endDate', 'bookingType']
      // additionalProperties: false,
    },
    bookListing : {
      type: 'object',
      properties: {
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        paymentMode: { type: 'string' },
        adults: { type: 'string' },
        bookingType: { type: 'string' }
      },
      required: ['startDate', 'endDate', 'paymentMode', 'adults', 'bookingType']
      // additionalProperties: false,
    },
    offer : {
      type: 'object',
      properties: {
        code: { type: 'string' },
        percentage: { type: 'string' },
        startDate: { type: 'string' },
        endDate: { type: 'string' }
      },
      required: ['code', 'startDate', 'endDate', 'percentage']
      // additionalProperties: false,
    },
    comisionAndTax : {
      type: 'object',
      properties: {
        commission: { type: 'string' },
        tax: { type: 'string' }
      },
      anyOf: [{ required: ['commission'] }, { required: ['tax'] }]
    },
    getCountryExists : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' },
        phonecode: { type: 'string' }
      },
      oneOf: [{ required: ['name'] }, { required: ['code'] }, { required: ['phonecode'] }],
      additionalProperties: false
    },
    createCountry : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' },
        phonecode: { type: 'string' }
      },
      required: ['name', 'code', 'phonecode']
    },
    updateCountry : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' },
        phonecode: { type: 'string' }
      },
      required: ['name', 'code', 'phonecode']
    },
    getStateExists : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' }
      },
      oneOf: [{ required: ['name'] }, { required: ['code'] }],
      additionalProperties: false
    },
    createState : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' }
      },
      required: ['name', 'code']
    },
    updateState : {
      type: 'object',
      properties: {
        name: { type: 'string' },
        code: { type: 'string' }
      },
      required: ['name', 'code']
    },
    getCityExists : {
      type: 'object',
      properties: {
        code: { type: 'string' },
        name: { type: 'string' },
        state_id: { type: 'string' }
      },
      oneOf: [{ required: ['code'] }, { required: ['name'] }, { required: ['state_id'] }],
      additionalProperties: false
    },
    createCity : {
      type: 'object',
      properties: {
        code: { type: 'string' },
        name: { type: 'string' },
        state_id: { type: 'string' }
      },
      required: ['code', 'name', 'state_id']
    },
    updateCity : {
      type: 'object',
      properties: {
        code: { type: 'string' },
        name: { type: 'string' },
        state_id: { type: 'string' }
      },
      required: ['code', 'name', 'state_id']
    }
  }

  static messages = {
    amenityData : {
      'required:desc': 'description is required',
      'required:name': 'name is required'
    },
    amenityCategory : {
      'required:category': 'category is required',
      'required:desc': 'description is required'
    },
    amenityList : {
      'required:amenityId': 'amenityId is required'
    },
    blockedDates : {
      'required:start': 'start date is required',
      'required:end': 'end date is required'
    },
    updateDates : {
      'required:dateId': 'dateId is required'
    },
    addPricing : {
      'required:perHour': 'perHour is required',
      'required:minimumNight': 'minimumNight is required',
      'required:maximumNight': 'maximumNight is required',
      'required:perDay': 'perDay is required'
    },
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
    },
    addRules : {
      'required:title': 'title is required',
      'required:desc': 'desc is required'
    },
    addAmenity : {
      'required:amenityId': 'amenityId is required'
    },
    estimateListing : {
      'required:adult': 'Adult is required',
      'required:startDate': 'checkIn date is required with vaild date format',
      'required:endDate': 'checkOut date is required with vaild date format',
      'required:bookingType': 'Choose Your bookingType'
    },
    bookListing : {
      'required:adults': 'adults is required',
      'required:startDate': 'startDate is required',
      'required:endDate': 'endDate is required',
      'required:paymentMode': 'payment mode is required',
      'required:bookingType': 'Choose Your bookingType'
    },
    offer : {
      'required:percentage': 'percentage is required',
      'required:code': 'Discount code is required',
      'required:startDate': 'startDate is required',
      'required:endDate': 'endDate is required'
    },
    comisionAndTax : {
      'required:commission': 'commission is required',
      'required:tax': 'tax is required'
    },
    getCountryExists : {
      'required:oneOf:name': 'name is required',
      'required:oneOf:code': 'code is required',
      'required:oneOf:phonecode': 'PhoneCode is required'
    },
    createCountry : {
      'required:name': 'name is required',
      'required:code': 'code is required',
      'required:phonecode': 'Phonecode is required'
    },
    updateCountry : {
      'required:name': 'name is required',
      'required:code': 'code is required',
      'required:phonecode': 'Phonecode is required'
    },
    getStateExists : {
      'required:oneOf:name': 'name is required',
      'required:oneOf:code': 'code is required'
    },
    createState : {
      'required:name': 'name is required',
      'required:code': 'code is required'
    },
    updateState : {
      'required:name': 'name is required',
      'required:code': 'code is required'
    },
    getCityExists : {
      'required:oneOf:code': 'code is required',
      'required:oneOf:name': 'name is required',
      'required:oneOf:state_id': 'StateID is required'
    },
    createCity : {
      'required:code': 'code is required',
      'required:name': 'name is required',
      'required:state_id': 'StateID is required'
    },
    updateCity : {
      'required:code': 'code is required',
      'required:name': 'name is required',
      'required:state_id': 'StateID is required'
    }
  }
}

export { ListValidator }