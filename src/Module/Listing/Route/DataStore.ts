import express from 'express'
import multer from 'multer'
import path from 'path'
import CustomError from '@abserve/errors/index'
const MasterModule = express.Router()
import { DataStoreController as DataStore } from '@abserve/Module/Listing/Controller/DataStoreController'
import { ListingController as Listing } from '@abserve/Module/Listing/Controller/ListingController'
import { Enum } from '@abserve/Utils/Enum'
import { ServerConfigController } from '@abserve/Module/Services/Common/Common'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

let memoryStorage = multer.memoryStorage();
let iconUpload = multer({ storage: memoryStorage });

MasterModule.route('/howItWorks')
  .get(DataStore.getHowItWorks)
  // .post(authorize([Enum.ROLES.ADMIN]),  iconUpload.array('icons'), DataStore.howToUpload)
  .put(authorize([Enum.ROLES.ADMIN]), DataStore.howItWorks)
MasterModule.route('/property/:id?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DataStore.listProperties)
  .post(authorize([Enum.ROLES.ADMIN]), iconUpload.single('icon'), DataStore.addProperty)
  .put(authorize([Enum.ROLES.ADMIN]), iconUpload.single('icon'), DataStore.updateProperty)
  .delete(authorize([Enum.ROLES.ADMIN]), DataStore.deleteProperty)
MasterModule.route('/category/:id?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DataStore.listPropertyCategory)
  .post(authorize([Enum.ROLES.ADMIN]), iconUpload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), DataStore.addPropertyCategory)
  .put(authorize([Enum.ROLES.ADMIN]), iconUpload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), DataStore.updatePropertyCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), DataStore.deletePropertyCategory)
MasterModule.route('/icon/:id?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DataStore.listIcon)
  .post(authorize([Enum.ROLES.ADMIN]), iconUpload.single('icon'), DataStore.addIcon)
  .delete(authorize([Enum.ROLES.ADMIN]), DataStore.deleteIcon)
MasterModule.route('/server')
  .get(authorize([Enum.ROLES.ADMIN]), ServerConfigController.getConfig)
  .post(authorize([Enum.ROLES.ADMIN]), ServerConfigController.serverCon)
MasterModule.route('/language/:languageid?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DataStore.GetAllLanguage)
  .post(authorize([Enum.ROLES.ADMIN]), DataStore.AddLanguage)
  .put(authorize([Enum.ROLES.ADMIN]), DataStore.UpdateLanguage)
  .delete(authorize([Enum.ROLES.ADMIN]), DataStore.DeleteLanguage)
MasterModule.route('/dashboard/totalCount')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.totalCount)
MasterModule.route('/dashboard/bookingStat')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.bookingStat)
MasterModule.route('/dashboard/earningReport')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.getTripEarningReport)
MasterModule.route('/dashboard/ratingReport')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.ratingReport)
MasterModule.route('/dashboard/recentUsers')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.recentUsers)
MasterModule.route('/dashboard/recentProviders')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.recentProviders)
MasterModule.route('/dashboard/bookingReport')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.bookingReport)
MasterModule.route('/create/invoice')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.createInvoice)
MasterModule.route('/earningReport')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.getEarningReports)
MasterModule.route('/download/report')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.downloadEarningReports)
MasterModule.route('/reviews')
  .get(authorize([Enum.ROLES.ADMIN]), Listing.getAllReviews)
  .delete(authorize([Enum.ROLES.ADMIN]), Listing.deleteReview)
MasterModule.route('/country/exists').get(authorize([Enum.ROLES.ADMIN]), DataStore.getCountryExists)
MasterModule.route('/country/:countryId?')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.getAllCountry)
  .post(authorize([Enum.ROLES.ADMIN]), DataStore.createCountry)
  .put(authorize([Enum.ROLES.ADMIN]), DataStore.updateCountry)
  .delete(authorize([Enum.ROLES.ADMIN]), DataStore.deleteCountry)

MasterModule.route('/list/country')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DataStore.listAllCountries)
MasterModule.route('/list/state/:countryId?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DataStore.listAllStates)
MasterModule.route('/list/city/:countryId?/:stateId?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),DataStore.listAllCities)

MasterModule.route('/state/exists')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.getStateExists)
MasterModule.route('/state/:stateId?')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.getAllState)
  .post(authorize([Enum.ROLES.ADMIN]), DataStore.createState)
  .put(authorize([Enum.ROLES.ADMIN]), DataStore.updateState)
  .delete(authorize([Enum.ROLES.ADMIN]), DataStore.deleteState)

MasterModule.route('/city/exists')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.getCityExists)
MasterModule.route('/city/:cityId?')
  .get(authorize([Enum.ROLES.ADMIN]), DataStore.getAllCity)
  .post(authorize([Enum.ROLES.ADMIN]), DataStore.createCity)
  .put(authorize([Enum.ROLES.ADMIN]), DataStore.updateCity)
  .delete(authorize([Enum.ROLES.ADMIN]), DataStore.deleteCity)

// MasterModule.route('/common/import/countries').post(fileUpload, DataStore.importCountries)
// MasterModule.route('/common/import/states').post(fileUpload, DataStore.importCities)
// MasterModule.route('/common/import/cities').post(fileUpload, DataStore.importStates)

export default MasterModule