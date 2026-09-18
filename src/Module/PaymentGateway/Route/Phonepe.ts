import { PhonepeController as phonepeCtrl } from '@abserve/Module/PaymentGateway/Controller/PhonepeController';
import express from 'express';
const phonepeModule = express.Router();

phonepeModule.route('/webhook')
  .post(phonepeCtrl.handleWebhook);

export default phonepeModule;