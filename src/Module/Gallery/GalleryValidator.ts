import { BaseValidator } from "../BaseValidator";

class GalleryValidator extends BaseValidator {
  constructor() {
    super();
  }
  static schemas = {
    createGallery : {
      type: 'object',
      properties: {
        collection: { type: "string" },
        collectionName: { type: "string" },
        description: { type: "string" }
      },
      additionalProperties: true,
    }
  }

  static messages = {
    createGallery : {
      'required:collection': 'collection is required',
      'required:collectionName': 'collectionName is required',
    }
  }
}
export { GalleryValidator }