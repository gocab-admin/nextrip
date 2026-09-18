import express from 'express'
import multer from 'multer'
import path from 'path'
const AdvertisementModule = express.Router()
import { AdvertisementController as adsctrl } from '@abserve/Module/Ads/AdsController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

const advertisementStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/Advertisement/Image'))
  },
  filename: (req, file, cb) => {
    let filetypes = /jpeg|jpg|svg|ico|png|webp/
    let mimetype = filetypes.test(file.mimetype)
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  }
})

let iconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/Advertisement/Icon'))
  },
  filename: (req, file, cb) => {
    let filetypes = /jpeg|jpg|svg|ico|png|webp/
    let mimetype = filetypes.test(file.mimetype)
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  }
})

let advImageUpload = multer({ storage: advertisementStorage })

let advIconUpload = multer({ storage: iconStorage })

// step 1
AdvertisementModule.route('/info/:advertisementId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), adsctrl.addInfo)
AdvertisementModule.route('/basicDetails/:advertisementId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), adsctrl.basicDetails)

//step 2
AdvertisementModule.route('/coverImage/:advertisementId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), advImageUpload.single('coverImage'), adsctrl.addCoverImage)
  .delete(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), adsctrl.deleteCoverPhoto)
AdvertisementModule.route('/groupImage/:advertisementId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), advImageUpload.array('photos', 15), adsctrl.addGroupImages)
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), adsctrl.listGroupImages)
  .delete(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), adsctrl.deleteGroupImages)

// advertisements
AdvertisementModule.route('/pending')
  .get(authorize([Enum.ROLES.USER]), adsctrl.getUntitledName)
AdvertisementModule.route('/getSteps')
  .get(adsctrl.getStepLists)
AdvertisementModule.route('/userAds')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), adsctrl.providerAdvertisements)
AdvertisementModule.route('/detail/')
  .get(adsctrl.multipleAdvertisements)

AdvertisementModule.route('/detail/suggestions')
  .get(adsctrl.AdSuggestion)
AdvertisementModule.route('/suggestions')
  .get(adsctrl.suggestions)
AdvertisementModule.route('/detail/:advertisementId?')
  .get(adsctrl.singleAdvertisement)
AdvertisementModule.route('/all/')
  .get(authorize([Enum.ROLES.ADMIN]), adsctrl.advertisements)
AdvertisementModule.route('/delete/:advertisementId?')
  .delete(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), adsctrl.deleteAdvertisement)
AdvertisementModule.route('/status/:advertisementId?')
  .put(authorize([Enum.ROLES.ADMIN]), adsctrl.approveAndDeclineAdvertisement)
AdvertisementModule.route('/publish/:advertisementId?')
  .post(authorize([Enum.ROLES.USER]), adsctrl.publishAdvertisement) //provider
AdvertisementModule.route('/featureAdvertisements/')
  .get(adsctrl.featureAdvertisements)
AdvertisementModule.route('/categories/')
  .get(adsctrl.getCategories)
AdvertisementModule.route('/subCategories/:id?')
  .get(adsctrl.getSubCategories)
AdvertisementModule.route('/sold/:id?')
  .put(authorize([Enum.ROLES.USER]),adsctrl.markAsSold)
AdvertisementModule.route('/packages/:id?')
  .post(authorize([Enum.ROLES.ADMIN]),adsctrl.addPackages)
  .get(authorize([Enum.ROLES.ADMIN,Enum.ROLES.USER]),adsctrl.getPackages)
  .put(authorize([Enum.ROLES.ADMIN]),adsctrl.updatePackages)
  .delete(authorize([Enum.ROLES.ADMIN]),adsctrl.deletePackages)
AdvertisementModule.route('/subscribe/package/:packageId?')
  .post(authorize([Enum.ROLES.USER]), adsctrl.subscribePackages)
AdvertisementModule.route('/verify/payment/:id?')
  .post(authorize([Enum.ROLES.USER]), adsctrl.verifyPayment)
AdvertisementModule.route('/packageStatus')
  .get(authorize([Enum.ROLES.USER]), adsctrl.packageStatus)
AdvertisementModule.route('/user/packages')
  .get(authorize([Enum.ROLES.ADMIN,Enum.ROLES.USER]), adsctrl.userPackages)
//Favourite
AdvertisementModule.route('/favourite')
  .get(authorize([Enum.ROLES.USER]), adsctrl.getFavourite)
  .post(authorize([Enum.ROLES.USER]), adsctrl.addToFavourite)
  .delete(authorize([Enum.ROLES.USER]), adsctrl.removeFavourite)
AdvertisementModule.route('/:advertisementId?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), adsctrl.getAdvertisement) //provider

//Admins
AdvertisementModule.route('/admin/config')
  .put(authorize([Enum.ROLES.ADMIN]), adsctrl.editConfig)
AdvertisementModule.route('/admin/category/:id?')
  .post(authorize([Enum.ROLES.ADMIN]), advIconUpload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), adsctrl.addCategory)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), adsctrl.listCategory)
  .put(authorize([Enum.ROLES.ADMIN]), advIconUpload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), adsctrl.updateCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), adsctrl.deleteCategory)
AdvertisementModule.route('/admin/subCategory/:id?')
  .post(authorize([Enum.ROLES.ADMIN]), advIconUpload.single('icon'), adsctrl.addSubCategory)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), adsctrl.listSubCategory)
  .put(authorize([Enum.ROLES.ADMIN]), advIconUpload.single('icon'), adsctrl.updateSubCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), adsctrl.deleteSubCategory)

export { AdvertisementModule }