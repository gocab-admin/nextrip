import mongoose, { Schema } from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class ListingAttachment extends BaseModel {
  constructor() {
    super()
  }
}

const listingAttachmentSchema = new mongoose.Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'listings', default: null },
  image: {
    imageId: { type: Schema.Types.ObjectId, default: null },
    coverImage: { type: String, default: '' },
    publicId: { type: String, default: '' },
    groupImage: [{ imagePath: { type: String }, groupImageId: { type: Schema.Types.ObjectId, default: null }, publicId: { type: String, default: '' } }]
  },
  rules: [
    {
      title: { type: String, default: '' },
      desc: { type: String, default: '' },
      image: { type: String, default: '' }
    }
  ],
  amenity: [mongoose.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

listingAttachmentSchema.loadClass(ListingAttachment)

listingAttachmentSchema.statics.getCoverImagePath = function (imageName) {
  return `/public/list/Image/${imageName}` //coverImage
}

export default mongoose.model('listingAttachments', listingAttachmentSchema)
