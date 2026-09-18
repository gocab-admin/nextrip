import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class Cms extends BaseModel {
  constructor() {
    super()
  }
}

const appBannerSchema = new mongoose.Schema({
  bannerImage: {
    image: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  cmsLinks: [
    {
      name: { type: String, default: '' },
      url: { type: String, default: '' }
    }
  ]
})

const cmsSchema = new mongoose.Schema(
  {
    type: { type: String, default: '' },
    title: { type: String },
    content: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
)

cmsSchema.loadClass(Cms)

const AppBannerModel = mongoose.model('appbanners', appBannerSchema)

export { AppBannerModel }

export default mongoose.model('cms', cmsSchema)