import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Gallery extends BaseModel {
  constructor() {
    super()
  }
}

const GallerySchema = new mongoose.Schema({
    imageName: { 
        type: String,
        default: '', 
    },
    path: { 
        type: String,
        default: '', 
    },
    publicId:{
        type: String,
        default: '', 
    },
    description:{
        type: String,
        default: ''
    },
    collectionName: {
        type: String, 
        enum: ['profiles', 'listings', 'icons', 'amenities', 'themes'],
        required: true
    },
    status:{
        type:Boolean,
        default:false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    addedBy: {
        type: String,
        default: ''
    },
    addedAt: { 
        type: Date, 
        default: null
    },
    softdel: { 
        type: Boolean, 
        default: false
    }
});

GallerySchema.loadClass(Gallery)

export default mongoose.model('gallery', GallerySchema)
