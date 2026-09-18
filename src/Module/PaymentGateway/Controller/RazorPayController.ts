import { BaseController } from '@abserve/Module/BaseControllers';
import { Config } from '@abserve/Config/AppConfig';
import Razorpay from 'razorpay';
import axios from 'axios';
const { razorpayKeyId, razorpaySecret, accountNumber} = Config.razorPayGateway


const razorpay = new Razorpay({
  key_id:  razorpayKeyId,
  key_secret: razorpaySecret,
});

class RazorpayController extends BaseController {
  constructor() {
    super();
  }

  // Create a new payment order
  static createOrder = async (paymentData: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          amount: Math.round(paymentData.totalAmount * 100),
          currency: paymentData.currency,
          receipt: `receipt_${Date.now()}`,
          payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);
        resolve(order);
      } catch (error) {
        reject(new Error(error, { cause: { statusCode: 422 } }));
      }
    });
  };

  // Verify payment signature
  static verifyPayment = async (paymentDetails: any) => {
    return new Promise((resolve, reject) => {
      try {
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', razorpaySecret);
        hmac.update(paymentDetails.razorpay_order_id + '|' + paymentDetails.razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === paymentDetails.razorpay_signature) {
          resolve({ verified: true });
        } else {
          reject(new Error('Invalid payment signature', { cause: { statusCode: 400 } }));
        }
      } catch (error) {
        reject(new Error(error, { cause: { statusCode: 422 } }));
      }
    });
  };

  // Capture a payment
  static capturePayment = async (paymentId: any, amount: any, currency: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const captureResponse = await razorpay.payments.capture(paymentId, amount, currency);
        resolve(captureResponse);
      } catch (error) {
        reject(new Error(error, { cause: { statusCode: 422 } }));
      }
    });
  };

  // Refund a payment
  static refundPayment = async (paymentId: any, amount: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const refund = await razorpay.payments.refund(paymentId, { amount });
        resolve(refund);
      } catch (error) {
        reject(new Error(error, { cause: { statusCode: 422 } }));
      }
    });
  };

  // Fetch payment details
  static getPaymentDetails = async (paymentId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const paymentDetails = await razorpay.payments.fetch(paymentId);
        resolve(paymentDetails);
      } catch (error) {
        reject(new Error(error, { cause: { statusCode: 422 } }));
      }
    });
  };
  
  static createContact = async (contactDetails: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          'https://api.razorpay.com/v1/contacts',
          {
            name: contactDetails.name,
            email: contactDetails.email,
            contact: contactDetails.phone,
            type: 'employee', // 'employee' or 'vendor'
            reference_id: contactDetails.reference_id,
            notes: {
              note1: contactDetails.notes
            }
          },
          {
            auth: {
              username: razorpayKeyId,
              password: razorpaySecret,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        reject(new Error('Failed to create Razorpay contact: ' + error.message));
      }
    });
  }

  static createFundAccount = async (fundAccountDetails: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          'https://api.razorpay.com/v1/fund_accounts',
          {
            contact_id: fundAccountDetails.contact_id, 
            account_type: 'bank_account',
            bank_account : {
              name: fundAccountDetails.name,
              ifsc: fundAccountDetails.ifsc,
              account_number: fundAccountDetails.account_number
            }
          },
          {
            auth: {
              username: razorpayKeyId,
              password: razorpaySecret,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        reject(new Error('Failed to create Razorpay fund account: ' + error.message));
      }
    });
  }

  static updateContact = async (contactId: any, contactDetails: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.put(
          `https://api.razorpay.com/v1/contacts/${contactId}`,
          {
            name: contactDetails.name,
            email: contactDetails.email,
            contact: contactDetails.phone,
            type: 'employee', // 'employee' or 'vendor'
            reference_id: contactDetails.reference_id,
            notes: {
              note1: contactDetails.notes
            }
          },
          {
            auth: {
              username: razorpayKeyId,
              password: razorpaySecret,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        reject(new Error('Failed to update Razorpay contact: ' + error.message));
      }
    });
  }
  
  static updateFundAccount = async (fundAccountId: any, fundAccountDetails: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.put(
          `https://api.razorpay.com/v1/fund_accounts/${fundAccountId}`,
          {
            contact_id: fundAccountDetails.contact_id,
            fund_account_type: 'bank_account',
            account_number: fundAccountDetails.account_number,
            ifsc_code: fundAccountDetails.ifsc_code,
            bank_name: fundAccountDetails.bank_name,
            account_holder_name: fundAccountDetails.account_holder_name,
            email: fundAccountDetails.email,
            phone: fundAccountDetails.phone,
          },
          {
            auth: {
              username: razorpayKeyId,
              password: razorpaySecret,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        reject(new Error('Failed to update Razorpay fund account: ' + error.message));
      }
    });
  }

  static deactivateContact = async (contactId: any, activeStatus: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.patch(
          `https://api.razorpay.com/v1/contacts/${contactId}`,
          {
            active: activeStatus.active
          },
          {
            auth: {
              username: razorpayKeyId,
              password: razorpaySecret,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        reject(new Error('Failed to delete Razorpay contact: ' + error.message));
      }
    });
  }

  static deactivateFundAccount = async (fundAccountId: any, activeStatus: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.patch(
          `https://api.razorpay.com/v1/fund_accounts/${fundAccountId}`,
          {
            active: activeStatus.active
          },
          {
            auth: {
              username: razorpayKeyId,
              password: razorpaySecret,
            },
          }
        );
        resolve(response.data); 
      } catch (error) {
        reject(new Error('Failed to delete Razorpay fund account: ' + error.message));
      }
    });
  }


  static retrieveBalance = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        'https://api.razorpay.com/v1/balance',
        {
          auth: {
            username: razorpayKeyId,
            password: razorpaySecret,
          },
        }
      )
      console.log('BALANCE RESPONSE', response.data)
      resolve(response.data)
    } catch (error) {
      reject(new Error('Failed to retrieve Razorpay balance: ' + error.message))
    }
  })
  } 

  

  static createPayout = async (payoutDetails: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          'https://api.razorpay.com/v1/payouts',
          {
            account_number: accountNumber,
            fund_account_id: payoutDetails.fund_account_id, 
            amount: payoutDetails.amount, 
            currency: payoutDetails.currency, 
            mode: payoutDetails.mode,
            purpose: payoutDetails.purpose,
            queue_if_low_balance: true,
            reference_id: payoutDetails.reference_id,
            notes:{
                remark: payoutDetails.notes
            }
          },
          {
            auth: {
              username: razorpayKeyId,
              password: razorpaySecret,
            },
          }
        );
        resolve(response.data);
      } catch (error) {
        reject(new Error('Failed to create Razorpay payout: ' + error.message));
      }
    });
  }
  
  
  
}

export { RazorpayController };
