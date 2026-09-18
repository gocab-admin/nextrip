
import express from 'express'
import multer from "multer"
const AuthModule = express.Router();
import { UserController as userCtrl } from '@abserve/Module/Auth/Controller/UserController'
import { AdminController as adminCtrl } from '@abserve/Module/Auth/Controller/AdminController'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
import { Enum } from '@abserve/Utils/Enum'
const { authorize } = AuthMiddleware


let memoryStorage = multer.memoryStorage();
let Userprofile = multer({ storage: memoryStorage });
let adminProfile = multer({ storage: memoryStorage });

//User Routes
AuthModule.route('/user/exists')
  .get(userCtrl.getUserExists)
AuthModule.route('/user/verifyOTP')
  .post(userCtrl.verification)
AuthModule.route('/user/sendOtp')
  .post(userCtrl.sendOtp)
AuthModule.route('/user/sendOtpByEmail')
  .post(userCtrl.sendOtpByEmail)
AuthModule.route('/user/verifyOtpByEmail')
  .post(userCtrl.verifyOtpByEmail)
AuthModule.route('/user/login')
  .post(userCtrl.login)
  .put(userCtrl.socialLoginUser) 
AuthModule.route('/user/logout')
  .put(authorize([Enum.ROLES.USER]), userCtrl.logout)  
AuthModule.route('/user/mode')
  .put(authorize([Enum.ROLES.USER]), userCtrl.userMode)  
AuthModule.route('/user/VerifyAndActiveStatus/:id?')
  .put(authorize([Enum.ROLES.ADMIN]), userCtrl.VerifyAndActiveStatus)
AuthModule.route('/user/password/:id?')
  .post(authorize([Enum.ROLES.ADMIN]), userCtrl.resetPassword)
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), userCtrl.changePassword);
AuthModule.route('/user/forgetPassword')
  .post(userCtrl.forgetPassword)
AuthModule.route('/user/verifyKey')
  .get(userCtrl.verifyKeyForForgetPassword)
AuthModule.route('/user/setPassword')
  .put(userCtrl.setPasswordForForgetPassword)
AuthModule.route('/users')
  .get(authorize([Enum.ROLES.ADMIN]), userCtrl.listUsers)
AuthModule.route('/providers')
  .get(authorize([Enum.ROLES.ADMIN]), userCtrl.listproviders)
AuthModule.route('/user/details/:id?')
  .get(userCtrl.userDetails)
AuthModule.route('/user/listings/:id?')
  .get(userCtrl.listingsOfUser)
AuthModule.route('/users/list')
  .get(authorize([Enum.ROLES.ADMIN]), userCtrl.getUsers)
AuthModule.route('/user/:id?')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), userCtrl.getUser)
  .post(Userprofile.single('file'), userCtrl.addUser)
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), Userprofile.single('file'), userCtrl.updateUser)
  .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), userCtrl.deleteUser)
AuthModule.route('/user/deleteAccount/:id')  
  .delete(authorize([Enum.ROLES.USER]), userCtrl.deleteAccount)

//Admin Routes
AuthModule.route('/admin/verifyOTP')
  .post(adminCtrl.verification)
AuthModule.route('/admin/sendOtp')
  .post(adminCtrl.sendOtp)
AuthModule.route('/admin/login')
  .put(adminCtrl.socialLoginAdmin)
  .post(adminCtrl.login)
AuthModule.route('/admin/VerifyAndActiveStatus/:id?')
  .put(authorize([Enum.ROLES.ADMIN]), adminCtrl.VerifyAndActiveStatus)
  // AuthModule.route('/admin/password/:id?')
  //   .post(authorize([Enum.ROLES.ADMIN]), adminCtrl.resetPassword)
  .put(authorize([Enum.ROLES.ADMIN]), adminCtrl.changePassword)
AuthModule.route('/admin/forgetPassword')
  .post(adminCtrl.forgetPassword)
AuthModule.route('/admin/setPassword')
  .put(adminCtrl.setPasswordForForgetPassword)
AuthModule.route('/admins')
  .get(authorize([Enum.ROLES.ADMIN]), adminCtrl.listAdmins)
AuthModule.route('/admin/profile')
  .get(authorize([Enum.ROLES.ADMIN]), adminCtrl.adminProfile)
AuthModule.route('/admin/addUser')
  .post(authorize([Enum.ROLES.ADMIN]), Userprofile.single('file'), adminCtrl.addUserByAdmin)
AuthModule.route('/admin/menusList')
  .get(adminCtrl.getMenuList)
AuthModule.route('/admin/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), adminCtrl.getAdmin)
  .post(adminProfile.single('file'), adminCtrl.addAdmin)
  .put(authorize([Enum.ROLES.ADMIN]), adminProfile.single('file'), adminCtrl.updateAdmin)
  .delete(authorize([Enum.ROLES.ADMIN]), adminCtrl.deleteAdmin)

//Admin Roles
AuthModule.route('/adminRole/list').get(authorize([Enum.ROLES.ADMIN]), adminCtrl.listAdminRole)
AuthModule.route('/adminRole/:adminRoleId?')
  .get(authorize([Enum.ROLES.ADMIN]), adminCtrl.getAdminRole)
  .post(authorize([Enum.ROLES.ADMIN]), adminCtrl.addAdminRole)
  .put(authorize([Enum.ROLES.ADMIN]), adminCtrl.updateAdminRole)
  .delete(authorize([Enum.ROLES.ADMIN]), adminCtrl.deleteAdminRole)

export default AuthModule;