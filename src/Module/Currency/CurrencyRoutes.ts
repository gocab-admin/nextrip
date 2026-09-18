import express from 'express'
const CurrencyModule = express.Router()
import { CurrencyController as Currencyctrl } from './CurrencyController'
import { Enum } from '@abserve/Utils/Enum'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware


CurrencyModule.route('/currencies')
  .get(Currencyctrl.getCurrency)
  .post(authorize([Enum.ROLES.ADMIN]), Currencyctrl.addCurrency)
  .put(authorize([Enum.ROLES.ADMIN]), Currencyctrl.updateCurrency)
CurrencyModule.route('/currencies/:code')
  .get(Currencyctrl.getCurrency)
CurrencyModule.route('/currencies/:id')
  .delete(authorize([Enum.ROLES.ADMIN]), Currencyctrl.deleteCurrency)
CurrencyModule.route('/set-default/:id')
  .put(authorize([Enum.ROLES.ADMIN]), Currencyctrl.setDefaultCurrency)
CurrencyModule.route('/update-all-rates')
  .post(Currencyctrl.updateAllCurrencyRates)
  
export default CurrencyModule