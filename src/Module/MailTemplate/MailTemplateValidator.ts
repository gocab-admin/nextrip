import { BaseValidator } from "../BaseValidator";

class MailTemplateValidator extends BaseValidator {
  constructor() {
      super();
  }

  static schemas = {
    createEmailTemplate : {
      type: "object",
      properties: {
        subject: { type: "string" },
        description: { type: "string" },
        body: { type: "string" },
      },
      required: ["subject", "description", "body",],
      additionalProperties: true
    },
    updateEmailTemplate : {
      type: "object",
      properties: {
        mailId: { type: "string" },
        subject: { type: "string" },
        description: { type: "string" },
        body: { type: "string" },
      },
      required: ["mailId",],
      additionalProperties: true
    }
  }

  static messages = {
    createEmailTemplate : {
      'required:subject': "subject is required",
      'required:description': "description is required",
      'required:body': "body is required",
    },
    updateEmailTemplate : {
      'required.mailId': 'mailId is required',
      'required:subject': "subject is required",
      'required:description': "description is required",
      'required:body': "body is required",
    }

  }
}

export { MailTemplateValidator }