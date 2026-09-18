import { BaseValidator } from "../BaseValidator";

class ReportListingValidator extends BaseValidator {
  constructor() {
    super();
  }

  static schemas = {
    createReportDescription : {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" }
      },
      required: ["title"],
      additionalProperties: true
    },
    updateReportDescription : {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" }
      },
      additionalProperties: true
    },
    updateStatus : {
      type: "object",
      properties: {
        comments: { type: "string" },
        status: { type: "string" }
      },
      required: ["status", "comments"],
      additionalProperties: true
    }
  }

  static messages = {
    createReportDescription : {
      'required:title': "Title is required",
    },
    updateReportDescription : {
      'required:title': "Title is required",
      'required:description': "Description is required",
    },
    updateStatus : {
      'required:comments': "Comments is required",
      'required:status': "Status is required",
    }
  }
}
export { ReportListingValidator }
