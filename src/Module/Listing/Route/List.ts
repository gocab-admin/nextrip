import express from 'express'
import multer from 'multer'
import path from 'path'
const ListModule = express.Router()
const PaymentModule = express.Router()
const AdminModule = express.Router()
import { ListingController as listCtrl } from '@abserve/Module/Listing/Controller/ListingController'
import { BookingController as bookingCtrl } from '@abserve/Module/Listing/Controller/BookingController'
import { InvoiceController as invoiceCtrl } from '@abserve/Module/Listing/Controller/InvoiceController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware


let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../public/List/offeredPlace'))
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

let offeredPlace = multer({ storage: storage })

let memoryStorage = multer.memoryStorage();
let imageUpload = multer({ storage: memoryStorage })

let offerstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../public/List/offers'))
  },
  filename: (req, file, cb) => {
    let filetypes = /jpeg|jpg|ico|svg|png/
    let mimetype = filetypes.test(file.mimetype)
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  }
})

let offerUpload = multer({ storage: offerstorage })
//test
ListModule.route('/testMail/')
  .get(listCtrl.testMail)

// step 1
ListModule.route('/todayMenu')
  .get(authorize([Enum.ROLES.USER]), listCtrl.todayMenu)
ListModule.route('/info/:listingId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.addInfo)
ListModule.route('/basicDetails/:listingId?') //
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.basicDetails)
ListModule.route('/listingAvailability/:listingId')  
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.listingAvailability)

//step 2
ListModule.route('/placesOffer/:listingId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), offeredPlace.single('file'), listCtrl.addPlacesOffer)
ListModule.route('/coverImage/:listingId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), imageUpload.single('coverImage'), listCtrl.addCoverImage)
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.updateCoverPhoto)
ListModule.route('/groupImage/:listingId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]),imageUpload.array('photos', 12),listCtrl.addGroupImages)
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.listGroupImages)
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.updateGroupImages)
ListModule.route('/rules/:listingId?')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.listRules)
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.addRules)
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.updateRule)
  .delete(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.deleteRules)
ListModule.route('/privileges/:listingId?')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.listPrivileges)
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.addPrivileges)
ListModule.route('/privilegesItems')
  .get(listCtrl.listPrivilegesItems)
// ListModule.route('/amentity/:listingId?')
//   .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.listAmentities)
//   .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.addAmenities)


// step 3
ListModule.route('/blockDates/:listingId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.addBlockedDates)
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.listBlockedDates)
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.updateBlockedDates)
  .delete(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.deleteBlockedDates)
ListModule.route('/price/:listingId?') 
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.addPricing)
ListModule.route('/availability/:listingId?')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.availability)
ListModule.route('/packages/:listingId?') 
  .post( authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.addPackages)

// listings
ListModule.route('/pending')
  .get(authorize([Enum.ROLES.USER]), listCtrl.getUntitledName)
ListModule.route('/getSteps')
  .get(listCtrl.getStepLists)
ListModule.route('/admin/config')  
  .put(listCtrl.editConfig)
ListModule.route('/detail/') // Home Page
  .get(listCtrl.multipleListings) 
ListModule.route('/all/')
  .get(authorize([Enum.ROLES.ADMIN]), listCtrl.Listings)
ListModule.route('/userListings')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.providerListings) //provider
ListModule.route('/cancellationPolicy')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.listCancellationPolicy)
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.cancellationPolicy)
ListModule.route('/delete/:listingId?')
  .delete(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.deleteListing)
ListModule.route('/status/:listingId?')
  .post(authorize([Enum.ROLES.ADMIN]), listCtrl.approveAndDeclineListing)
ListModule.route('/publish/:listingId?')
  .post(authorize([Enum.ROLES.USER]), listCtrl.publishListing) // provider
ListModule.route('/booking/estimation/:listingId?')
  .get(bookingCtrl.bookingEstimation)
ListModule.route('/booking/refund/:bookingId?')
  .post(authorize([Enum.ROLES.ADMIN]), bookingCtrl.refund)
ListModule.route('/reviewsAndRating/:listingId?/:bookingId?')
  .get(listCtrl.listReviewsAndRating)
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER, Enum.ROLES.PROVIDER]), listCtrl.reviewsAndRating)
ListModule.route('/viewUserReview/:listingId?/:bookingId?')
   .get(authorize([Enum.ROLES.USER]), listCtrl.viewUserReview)
ListModule.route('/providerReviews')
  .get(authorize([Enum.ROLES.USER]), listCtrl.providerReviews) //provider
ListModule.route('/review/:reviewId?')
  .get(authorize([Enum.ROLES.USER]), listCtrl.viewSingleReview) //provider
ListModule.route('/booking/cancel/:bookingId?')
  .post(authorize([Enum.ROLES.USER]), bookingCtrl.cancelBooking)
ListModule.route('/wishList/:collectionId?')
  .get(authorize([Enum.ROLES.USER]), listCtrl.getWishList)
  .post(authorize([Enum.ROLES.USER]), listCtrl.addToWishList)
  .delete(authorize([Enum.ROLES.USER]), listCtrl.removeWishListCollection)
  .patch(authorize([Enum.ROLES.USER]), listCtrl.updateWishListCollection)
ListModule.route('/booking/confirm/:bookingId?')
  .post(authorize([Enum.ROLES.USER]), bookingCtrl.confirmBooking)
ListModule.route('/booking/approval')
  .get(authorize([Enum.ROLES.USER]), bookingCtrl.bookingApprovalHistory)
ListModule.route('/booking/complete/:bookingId?')
  .post(authorize([Enum.ROLES.USER]), bookingCtrl.completeBooking)
// ListModule.route('/amenities/')
//   .get(listCtrl.getAmenities)
  ListModule.route('/featureListings/')
  .get(listCtrl.featureListings)
ListModule.route('/categories/')
  .get(listCtrl.getCategories)
ListModule.route('/properties/:id?')
  .get(listCtrl.getproperties)
ListModule.route('/booking/pending/')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), bookingCtrl.pendingBookingHistory)
ListModule.route('/booking/accepted')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), bookingCtrl.acceptedBookingHistory)
ListModule.route('/calender/')
  .get(authorize([Enum.ROLES.USER]), listCtrl.providerCalender)
ListModule.route('/detail/admin/:listingId?')
  .get(authorize([Enum.ROLES.ADMIN]), listCtrl.singleListingForAdmin)
ListModule.route('/detail/:listingId?')
  .get(listCtrl.singleListing)
ListModule.route('/discountCode/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), listCtrl.listDiscount)
  .post(authorize([Enum.ROLES.ADMIN]), offerUpload.single('offer'), listCtrl.discountAndOffers)
  .put(authorize([Enum.ROLES.ADMIN]), offerUpload.single('offer'), listCtrl.updatediscount)
  .delete(authorize([Enum.ROLES.ADMIN]), listCtrl.deleteDiscount)
ListModule.route('/discountCode')
  .get(authorize([Enum.ROLES.ADMIN]), listCtrl.listDiscount)
ListModule.route('/update/status/:listingId?')
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), listCtrl.updateListingStatus)
ListModule.route('/slot/availability/:listingId?')
  .post(/* authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]),  */listCtrl.slotAvailability)
ListModule.route('/block/dates/:listingId?')
  .post(listCtrl.blockDate)
ListModule.route('/booking/count/:listingId?')
  .get(bookingCtrl.upcomingBookingsCount)

//commission
ListModule.route('/comisionAndTax/')
  .get(authorize([Enum.ROLES.ADMIN]), listCtrl.listCommAndTax)
  .post(authorize([Enum.ROLES.ADMIN]), listCtrl.commAndTax)
ListModule.route('/:listingId?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), listCtrl.getListing) //provider
ListModule.route('/booking/:list?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),bookingCtrl.bookingHistory)

//Reserve Booking flow
ListModule.route('/initiateBooking/:listingId?')
  .post(authorize([Enum.ROLES.USER]), invoiceCtrl.initiatebooking)
ListModule.route('/paymentStatus/:invoiceId?')
  .get(invoiceCtrl.paymentStatus)
  .post(authorize([Enum.ROLES.USER]),invoiceCtrl.paymentStatus)

export { ListModule, PaymentModule, AdminModule }