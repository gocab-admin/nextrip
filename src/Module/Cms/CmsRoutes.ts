import express from 'express'
import multer from 'multer'
const CmsModule = express.Router()
import { CmsController as cmsctrl } from './CmsController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

let memoryStorage = multer.memoryStorage();
let BannerImage = multer({ storage: memoryStorage });

CmsModule.route('/create')
  .post(authorize([Enum.ROLES.ADMIN]), cmsctrl.createCms)
CmsModule.route('/update')
  .put(authorize([Enum.ROLES.ADMIN]), cmsctrl.updateCms)
CmsModule.route('/getLinks')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), cmsctrl.getLinksAndBanners)
CmsModule.route('/createLinks')
  .post(authorize([Enum.ROLES.ADMIN]), cmsctrl.createLinks)
CmsModule.route('/createBanners')
  .post(authorize([Enum.ROLES.ADMIN]), BannerImage.single('file'), cmsctrl.createBanners)
CmsModule.route('/:cmsId?')
  .get(cmsctrl.getCms)
CmsModule.route('/:cmsId')
  .delete(authorize([Enum.ROLES.ADMIN]), cmsctrl.deleteCms)

export default CmsModule