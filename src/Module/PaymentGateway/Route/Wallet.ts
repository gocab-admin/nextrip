import express from 'express'
const payoutModule = express.Router()
import { WalletController as walletCtrl } from '@abserve/Module/PaymentGateway/Controller/WalletController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware

payoutModule.route('/')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), walletCtrl.createWallet)
payoutModule.route('/transaction/')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), walletCtrl.transaction)
payoutModule.route('/history/')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), walletCtrl.transactionHistory)
payoutModule.route('/payout/')
  .post(authorize([Enum.ROLES.USER]), walletCtrl.selfPayoutByUser)
payoutModule.route('/payout/admin')
  .post(authorize([Enum.ROLES.ADMIN]), walletCtrl.adminPayoutToUser)
payoutModule.route('/bank/:userBankId?')
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), walletCtrl.listBankAccts)
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), walletCtrl.addBank)
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), walletCtrl.updateBank)
payoutModule.route('/deleteBank/')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), walletCtrl.deleteBank)
payoutModule.route('/payoutHistory/:userId?')
  .get(authorize([Enum.ROLES.USER]), walletCtrl.listPayoutHistories)
payoutModule.route('/update/contact')
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]),walletCtrl.updateContact)
payoutModule.route('/deactivate/contact')
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]),walletCtrl.deactivateContact)
payoutModule.route('/deactivate/fundAccount')
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]),walletCtrl.deactivateFundAccount)

export default payoutModule