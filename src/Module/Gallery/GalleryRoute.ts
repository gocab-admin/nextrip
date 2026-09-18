import express from 'express'
import multer from 'multer'
import { Enum } from '@abserve/Utils/Enum'
import { GalleryController as galleryctrl } from './GalleryController'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

const GalleryModule = express.Router()

// let imagestorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let collection = req.body.collection
//     const dirPath = path.join(__dirname, `../../public/gallery/${collection}`)
//     fs.mkdirSync(dirPath, { recursive: true })
//     cb(null, dirPath)
//   },
//   filename: (req, file, cb) => {
//     let filetypes = /jpeg|jpg|svg|png|webp/
//     let mimetype = filetypes.test(file.mimetype)
//     let extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//     if (mimetype && extname) {
//       cb(null, file.fieldname.replace(/\[\]/g, '') + '-' + Date.now() + path.extname(file.originalname))
//     } else {
//       cb(new CustomError.BadRequestError('INVALID_FILE_TYPE'), '')
//     }
//   }
// })

let memoryStorage = multer.memoryStorage();
let galleryUpload = multer({ storage: memoryStorage })

GalleryModule.route('/images')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), galleryUpload.any(), galleryctrl.createOrUpdateGallery)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), galleryctrl.getGalleryImages)
  .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), galleryctrl.deleteGallery)


export default GalleryModule