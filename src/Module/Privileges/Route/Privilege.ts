import express from 'express'
import multer from 'multer'
const PrivilegeModule = express.Router()
import { PrivilegeController as Privilege } from '@abserve/Module/Privileges/Controller/PrivilegeController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

let memoryStorage = multer.memoryStorage();
let privilegeIcon = multer({ storage: memoryStorage })

PrivilegeModule.route('/privilege/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), Privilege.listPrivilege)
  .post(authorize([Enum.ROLES.ADMIN]), Privilege.addPrivilege)
  .put(authorize([Enum.ROLES.ADMIN]), Privilege.updatePrivilege)
  .delete(authorize([Enum.ROLES.ADMIN]), Privilege.deletePrivilege)

PrivilegeModule.route('/privilegeCategory/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), Privilege.listPrivilegeCategory)
  .post(authorize([Enum.ROLES.ADMIN]), Privilege.addPrivilegeCategory)
  .put(authorize([Enum.ROLES.ADMIN]), Privilege.updatePrivilegeCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), Privilege.deletePrivilegeCategory)

PrivilegeModule.route('/privilegeItems/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), Privilege.listPrivilegeItems)
  .post(authorize([Enum.ROLES.ADMIN]), privilegeIcon.single('icon'), Privilege.addPrivilegeItems)
  .put(authorize([Enum.ROLES.ADMIN]), privilegeIcon.single('icon'), Privilege.updatePrivilegeItems)
  .delete(authorize([Enum.ROLES.ADMIN]), Privilege.deletePrivilegeItems)

PrivilegeModule.route('/moduleCategory/:id?')
  .get(authorize([Enum.ROLES.ADMIN]), Privilege.listModuleCategory)
  .post(authorize([Enum.ROLES.ADMIN]), Privilege.addModuleCategory)
  .put(authorize([Enum.ROLES.ADMIN]), Privilege.updateModuleCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), Privilege.deleteModuleCategory)

export default PrivilegeModule