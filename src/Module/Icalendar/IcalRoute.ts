import express from 'express'
import { AuthMiddleware } from '@abserve/Middlewares/AuthMiddleware'
const { authorize } = AuthMiddleware
import { IcalController as icalctrl } from '@abserve/Module/Icalendar/IcalController'
import { Enum } from '@abserve/Utils/Enum'

const IcalModule = express.Router()

IcalModule.route('/secretCode')
    .post(authorize([Enum.ROLES.USER]), icalctrl.generateSecretCode)
IcalModule.route('/generate/:userId/:secretCode')
    .get(icalctrl.downloadIcal)
IcalModule.route('/records')
    .get(authorize([Enum.ROLES.USER]), icalctrl.getCalendar)


export default IcalModule