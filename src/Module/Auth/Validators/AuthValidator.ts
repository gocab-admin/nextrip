import { BaseValidator } from '@abserve/Module/BaseValidator'

class AuthValidator extends BaseValidator {
  constructor() {
    super()
  }

  static schemas = {
    getUserExists : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        phoneCode: { type: 'string' }
      },
      additionalProperties: false,
      oneOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }]
    },

    addUser : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        fcmId: { type: 'string' },
        phone: { type: 'string' },
        password: { type: 'string' }
      },
      anyOf: [{ required: ['email'] }, { required: ['phone'] }],
      required: ['password'],
      additionalProperties: true
    },

    socialLogin : {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        type: { type: 'string' }
      },
      required: ['type', 'accessToken'],
      additionalProperties: true
    },

    login : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        phoneCode: { type: 'string' },
        password: { type: 'string' },
        code: { type: 'string' },
        verifyBy: { type: 'string' },
        userType: { type: 'string' },
        fcmId: { type: 'string' }
      },
      allOf: [
        { oneOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }] },
        { oneOf: [{ required: ['code'] }, { required: ['password'] }] }
      ],
      additionalProperties: true
    },

    adminLogin : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        phoneCode: { type: 'string' },
        password: { type: 'string' },
        fcmId: { type: 'string' }
      },
      oneOf: [{ required: ['email'] }, { required: ['phone'] }],
      required: ['password'],
      additionalProperties: false
    },

    updateUser : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        phoneCode: { type: 'string' },
        password: { type: 'string' },
        fcmId: { type: 'string' }
      },
      oneOf: [{ required: ['email'] }, { required: ['phone'] }],
      required: ['password'],
      additionalProperties: false
    },

    verification : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        phoneCode: { type: 'string' },
        code: { type: 'string' },
        verifyBy: { type: 'string' },
        userType: { type: 'string' },
        verifyFrom: { type: 'string' }
      },
      anyOf: [
        {
          required: ['phone', 'phoneCode']
        },
        {
          required: ['email'],
          propertyNames: { not: { enum: ['phone', 'phoneCode'] } }
        }
      ],
      required: ['userType', 'verifyFrom', 'code', 'verifyBy'],
      additionalProperties: false
    },

    sendOtpverify : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phoneNumber: { type: 'string' },
        phoneCode: { type: 'string' },
        userType: { type: 'string' },
        verifyBy: { type: 'string' },
        verifyFrom: { type: 'string' }
      }
    },

    forgetPassword : {
      type: 'object',
      properties: {
        email: { type: 'string' },
        phone: { type: 'string' },
        otp: { type: 'string' },
        newPassword: { type: 'string' },
        confirmPassword: { type: 'string' }
      },
      oneOf: [{ required: ['email'] }, { required: ['phone'] }],
      required: ['newPassword', 'confirmPassword', 'otp'],
      additionalProperties: false
    },

    changePassword : {
      type: 'object',
      properties: {
        newPassword: { type: 'string' },
        currentPassword: { type: 'string' }
      },
      required: ['newPassword', 'currentPassword'],
      additionalProperties: true
    },

    wallet : {
      type: 'object',
      properties: {
        userType: { type: 'string' },
        userId: { type: 'string' }
      },
      additionalProperties: false,
      required: ['userType', 'userId']
    },

    createAdminRole : {
      type: 'object',
      properties: {
        role: { type: 'string' },
        description: { type: 'string' },
        permission: { type: 'array' }
      },
      additionalProperties: true
    },

    updateAdminRole : {
      type: 'object',
      properties: {
        role: { type: 'string' },
        description: { type: 'string' },
        permission: { type: 'array' }
      },
      additionalProperties: true
    }

  }

  static messages = {
    getUserExists : {
      'required:oneOf:email': 'Email is required',
      'required:oneOf:phone': 'Phone is required',
      'required:oneOf:phoneCode': 'Phone Code is required'
    },

    addUser : {
      'required:email': 'email is required',
      'required:phone': 'phone is required',
      'required:phoneCode': 'phoneCode is required',
      'required:password': 'password is required'
    },

    socialLogin : {
      'required:type': 'Type is required',
      'required:accessToken': 'Access Token is required'
    },

    login : {
      'required:oneOf:email': 'Email is required',
      'required:oneOf:phone': 'Phone is required',
      'required:oneOf:phoneCode': 'Phone Code is required',
      'required:oneOf:password': 'Password or code is required',
      'required:oneOf:code': 'Password or code is required'
    },

    adminLogin : {
      'required:oneOf:email': 'Email is required',
      'required:oneOf:phone': 'Phone is required',
      'required:oneOf:phoneCode': 'Phone Code is required',
      'required:password': 'password is required'
    },

    updateUser : {
      'required:email': 'email is required',
      'required:phone': 'phone is required',
      'required:firstname': 'firstname is required'
    },

    verification : {
      'required:anyOf:email': 'Email is required',
      'required:anyOf:phone': 'Phone is required',
      'required:anyOf:phoneCode': 'Phone Code is required',
      'required:userType': 'userType is required',
      'required:verifyFrom': 'verifyFrom is required',
      'required:code': 'code is required',
      'required:verifyBy': 'verifyBy is required'
    },

    sendOtpverify : {},

    forgetPassword : {
      'required:oneOf:email': 'email is required',
      'required:oneOf:phone': 'phone is required',
      'required:newPassword': 'password is required',
      'required:confirmPassword': 'confirmPassword is required',
      'required:otp': 'otp is required'
    },

    changePassword : {
      'required:newPassword': 'New Password is required',
      'required:currentPassword': 'Current Password is required'
    },

    wallet : {
      'required:userId': 'User Id is required',
      'required:userType': 'User Type is required'
    },

    createAdminRole : {},

    updateAdminRole : {},
  }
}
export { AuthValidator }