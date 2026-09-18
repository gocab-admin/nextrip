import { BaseValidator } from "@abserve/Module/BaseValidator";

class NotificationValidator extends BaseValidator {
    constructor() {
        super();
    }

    static schemas = {
        notification : {
            type: "object",
            properties: {
                forWhom: { type: "string" },
                message: { type: "string" },
                userType: { type: "string" },
                title: { type: "string" },
            },
            required: ["forWhom", "message", "userType"],
        }
    }

    static messages = {
        notification : {
            'required:forWhom': "UserId is required",
            'required:type': "User Type is required",
            'required:message': "message required",
        }
    }
}
export { NotificationValidator }