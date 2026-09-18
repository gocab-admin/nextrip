import mongoose from 'mongoose'
import { BaseModel } from '@abserve/Module/BaseModel'

class AdminRole extends BaseModel {
  constructor() {
    super()
  }
}

const AdminRoleSchema = new mongoose.Schema({
        role: {
          type: String,
          default: '',
          options: {
            isSearch: true
          }
        },
        description: {
          type: String,
          default: ''
        },
        permission: {
          type: Array,
          default: []
        },
        softdel: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
        isActive: { type: Boolean, default: true },
    })

AdminRoleSchema.loadClass(AdminRole)

export default mongoose.model('adminroles', AdminRoleSchema)