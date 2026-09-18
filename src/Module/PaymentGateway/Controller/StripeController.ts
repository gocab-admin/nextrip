import { BaseController } from '@abserve/Module/BaseControllers'
import { Config } from '@abserve/Config/AppConfig'
import request from 'request'
const stripe = require('stripe')(Config.paymentGateway.kkSecret)
const stripeKey = Config.paymentGateway.kkSecret

class StripeController extends BaseController {
  static readonly accountLinks: any
  constructor() {
    super()
  }
  //pay amount after booking in card
  static readonly paymentIntent = async (paymentData: any) => {
    console.log('PAYMETN_INTENT_', paymentData)

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(paymentData.totalAmount * 100),
          currency: paymentData.currency,
          //payment_method_types: ['card', 'upi', 'netbanking', 'wallet']
          automatic_payment_methods: {
            enabled: true
          }
        })
        console.log(paymentIntent, '______')
        return paymentIntent
      } catch (error) {
        throw new Error(error, { cause: { statusCode: 422 } })
      }
  }

  
  //check payment status
  static readonly stripePaymentStatus = async (paymentIntentId: any) => {
    console.log('PAYMENT_STATUS___', paymentIntentId)

    let smsRequestURL = `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`
    let data = {
      url: smsRequestURL,
      headers: {
        Authorization: 'Bearer ' + stripeKey
      }
    }

    return new Promise((resolve, reject) => {
      request.get(data, function (error, res, body: any) {
        if (!error && res.statusCode == 200) {
          resolve(JSON.parse(res.body))
          console.log(JSON.parse(body), '_______')
          console.log(JSON.parse(res.body), '_')
        } else {
          reject(new Error(error, { cause: { statusCode: 422 } }))
        }
      })
    })
  }


  //refund according to policy
  static readonly refund = async (data: any) => {
    console.log('REFUND______', data)

      try {
        const refunds = await stripe.refunds.create({
          payment_intent: data.payment_intent,
          amount: Math.round(data.fareAmount)
        })
        console.log('_______', refunds)
        return refunds
      } catch (error) {
        throw new Error(error, { cause: { statusCode: 422 } })
      }
  }


  //create Bank Account
  static readonly createBankAcct = async (bank: any) => {
    console.log('CREATEBANK___', bank)

      try {
        //create ecpress acct
        const account = await stripe.accounts.create({
          type: 'express',
          country: bank.country,
          business_type: 'individual', // You can use 'company' for a business account
          capabilities: {
            card_payments: {
              requested: true
            },
            transfers: {
              requested: true
            }
          },
          individual: {
            first_name: bank.acctHolderName.split(' ')[0],
            last_name: bank.acctHolderName.split(' ')[1],
            email: bank.email,
            phone: bank.phone,
            address: {
              line1: bank.address.line1,
              city: bank.address.city,
              state: bank.address.state,
              postal_code: bank.address.postal_code
            }
          }
        })

        // Create an external account (bank account) for the account
        const externalAccount: any = await stripe.accounts.createExternalAccount(account.id, {
          external_account: {
            object: 'bank_account',
            country: 'US',
            currency: 'usd',
            account_holder_name: bank.acctHolderName,
            // account_holder_type: 'individual',
            routing_number: bank.routing_number, // Replace with actual routing number
            account_number: bank.acctNumber // Replace with actual account number
          },
          metadata: {
            order_id: bank.bankId
          }
        })

        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: 'https://example.com/reauth',
          //return_url: 'https://example.com/return',
          return_url: `${Config.app.baseurl}/account-settings/payments/payment-method/`,
          type: 'account_onboarding'
        })

        console.log('Account Link:', accountLink)
        console.log('External Account:', externalAccount)
        return { externalAccount, accountLink }
      } catch (error) {
        throw new Error(error, { cause: { statusCode: 422 } })
      }
  }


  //update bank
  static readonly updateBankAcct = async (bank: any, stripeAcctId: any) => {
      try {
        const externalAccount = await stripe.accounts.updateExternalAccount(stripeAcctId, {
          external_account: {
            object: 'bank_account',
            country: 'US',
            currency: 'usd',
            account_holder_name: bank.acctHolderName,
            routing_number: bank.routing_number,
            account_number: bank.acctNumber
          },
          metadata: {
            order_id: bank.bankId
          }
        })
        console.log('External Account:', externalAccount)
        return { externalAccount }
      } catch (error) {
        return new Error(error, { cause: { statusCode: 422 } })
      }
  }


  //remove bank
  static readonly deleteBankAcct = async (bank: any) => {
      try {
        const deleted = await stripe.accounts.del(bank.stripeAcctId)
        const externalAccount = await stripe.accounts.deleteExternalAccount(bank.stripeBankId, deleted.id)
        return externalAccount
      } catch (error) {
        console.log('error', error)
        throw new Error(error, { cause: { statusCode: 422 } })
      }
  }


  static readonly retrieveBalance = async () => {
      try {
        const balance = await stripe.balance.retrieve()
        console.log('BALANCE', balance)
        return balance
      } catch (error) {
        throw new Error(error, { cause: { statusCode: 422 } })
      }
  }


  static readonly payout = async (data: any) => {
    console.log('PAYOUT______', data)

      try {
        const payout = await stripe.transfers.create({
          amount: data.amount,
          currency: 'usd',
          destination: data.acctId
        })
        console.log(payout)

        return payout
      } catch (error) {
        throw new Error(error, { cause: { statusCode: 422 } })
      }
  }

  static readonly triggerPayout = async (data: any) => {
    try {
        const triggerPayout = await stripe.payouts.create({
          amount: data.amount,
          currency: 'usd'
        }, {
          stripeAccount: data.acctId
        });

        console.log("triggerPayout",triggerPayout)

        return triggerPayout
     } catch (error) {
        console.error('Stripe payout failed:', error.message);
        throw new Error(error, { cause: { statusCode: 422 } })
     }
  };
}

export { StripeController }