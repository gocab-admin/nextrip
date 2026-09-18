import mongoose from "mongoose"
import { BaseModel } from "../BaseModel"

class Theme extends BaseModel {
    constructor() {
        super()
    }
}

const ThemeSchema = new mongoose.Schema(
    {
        name: { type: String },
        title: { type: String },
        description: { type: String },
        location: { type: String },
        status: { type: String, default: 'inActive', enum: ['active', 'inActive'] },
        lat: { type: Number },
        lng: { type: Number },
        theme: {
            images: [{ ImageId: { type: mongoose.Types.ObjectId }, imagePath: { type: String } }],
            categories: [{_id:{ type: mongoose.Types.ObjectId, ref: 'propertyCategories', default: null }, order: { type: Number }}],
            categorizedBy: { type: mongoose.Types.ObjectId, ref: 'propertyCategories', default: null }
        }
    },
    { timestamps: true }
)

ThemeSchema.loadClass(Theme)

export default mongoose.model('theme', ThemeSchema)

