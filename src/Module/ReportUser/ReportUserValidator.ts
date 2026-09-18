import { BaseValidator } from "../BaseValidator";

class ReportUserValidator extends BaseValidator {
  constructor() {
    super();
  }

  static schemas = {
    createReportUserDescription : {
      type: "object",
      properties: {
        title: { type: "string" }
      },
      required: ["title"],
      additionalProperties: true
    },
    updateReportUserDescription : {
      type: "object",
      properties: {
        title: { type: "string" }
      },
      additionalProperties: true
    }
  }

  static messages = {
    createReportUserDescription : {
      'required:title': "Title is required",
    },
    updateReportUserDescription : {

    }
  }
}
export { ReportUserValidator }