import mongoose from 'mongoose'
import moment from 'moment'
import Wallet from '@abserve/Module/PaymentGateway/Model/Wallet'
import User from '@abserve/Module/Auth/Model/User'
import Bank from '@abserve/Module/PaymentGateway/Model/userBank'
import PayoutHistory from '@abserve/Module/PaymentGateway/Model/payoutHistory'
import CustomError from '@abserve/errors/index'
import { Response } from 'express'
import { AuthenticateRequest } from '@abserve/Interfaces/Requests'
import { BaseController } from '@abserve/Module/BaseControllers'
import { Constants } from '@abserve/Config/Constants'
import { HelperFunctionController as helper } from '@abserve/Helper/Function'
import { NotificationController } from '@abserve/Module/Notification/NotificationController'
import { WalletValidator } from '@abserve/Module/PaymentGateway/Validators/WalletValidator'
import { StripeController as stripe } from '@abserve/Module/PaymentGateway/Controller/StripeController'
import { RazorpayController as Razor } from '@abserve/Module/PaymentGateway/Controller/RazorPayController'

class WalletController extends BaseController {
  constructor() {
    super()
  }
  static readonly createWallet = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const body = req.body
      const auth = req.auth
      let userId, userType

      if (auth.role == Constants.userRole.ADMIN) {
        userId = body.userId
        userType = body.userType
      } else {
        userId = auth.userId
        userType = auth.role
      }

      let walletData = { userId, userType }
      let data = await this.addWallet(walletData)


      // RESPONSE
      response.message = 'WALLET_ADDED'
      response.status = true
      response.statusCode = 200
      response.data = { wallet: data }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error?.cause?.reasons || {}
      response.statusCode = error?.cause?.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly transaction = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const body = req.body
      const auth = req.auth
      let userId, userType

      if (auth.role == Constants.userRole.ADMIN) {
        userId = body.userId
        userType = body.role
      } else {
        userId = auth.userId
        userType = auth.role
      }

      let transactionData = {
        amount: body.amount,
        type: body.type,
        description: body.desc,
        reference: body.refId,
        scheduledDate: body.scheduleDate,
        userType: userType,
        userId: userId
      }

      let data: any = await this.updateWallet(transactionData)


      // RESPONSE
      response.message = 'TRANSACTION_SUCCESS'
      response.status = true
      response.statusCode = 200
      response.data = data
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly addWallet = async (walletData: any) => {
      try {
        let userId = walletData.userId
        let userType = walletData.userType
        let orderId = walletData.orderId
        if (!userType && !userId) {
          throw new CustomError.BadRequestError('INSUFFICIENT_DATA')
        }
        let userCheck: any = await User.findById(userId).lean().exec()
        if (userCheck == '') {
          throw new Error('user not found', { cause: { statusCode: 401 } })
        }

        let walletCheck: any = await Wallet.findOne({ userId: userId, userType: userType }).lean().exec()
        if (walletCheck) {
          throw new CustomError.BadRequestError('WALLET_CREATED_ALREADY')
        } else {
          let newDoc: any = new Wallet()
          newDoc.userId = userId
          newDoc.userType = userType
          newDoc.orderId = orderId
          let data = await newDoc.save()
          return data
          //if (data) {
            // let notifiData = {
            //     forWhom: userId,
            //     message: "Your Wallet Created Successfully",
            //     fromWhom: "ADMIN",
            //     userType: userType,
            //     title: "Wallet Created",
            //     link: "",
            //     image: ""
            // }
            // await notificationController.notification(notifiData);
          //}
        }
      } catch (error) {
         throw new Error(error)
      }
  }


  static readonly updateWallet = async (updateWalletData: any) => {
      try {
        let walletData: any, update: any, notifiData: any
        let currentBalance: any = 0,
          balance: any,
          data: any
        // const validation = await walletValidator.transaction(updateWalletData);
        // if (!validation.status) throw new Error('Validation Failed', { cause: validation.data })
        if (!updateWalletData.userId && !updateWalletData.userType) {
          throw new CustomError.BadRequestError('INSUFFICIENT_DATA')
        }
        if (!updateWalletData.amount) {
          throw new CustomError.BadRequestError('AMOUNT_REQUIRED')
        }
        if (!updateWalletData.type) {
          throw new CustomError.BadRequestError('TYPE_REQUIRED')
        }

        walletData = await Wallet.findOne({ userId: updateWalletData.userId }).lean().exec()
        if (walletData == null || !walletData) {
          let wallet = {
            userId: updateWalletData.userId,
            userType: updateWalletData.userType,
            orderId: updateWalletData.orderId
          }
          walletData = await this.addWallet(wallet)
        }
        if (walletData.trx.length == 0) {
          currentBalance = updateWalletData.type == 'debit' ? await helper.fixedNum(currentBalance - Number(updateWalletData.amount)) : updateWalletData.amount;
        } else {
          for (const trxData of walletData.trx) {
            if (updateWalletData.type == 'debit') {
              currentBalance = await helper.fixedNum(trxData.currentBalance - Number(updateWalletData.amount))
            }
            if (updateWalletData.type == 'credit') {
              currentBalance = await helper.fixedNum(trxData.currentBalance + Number(updateWalletData.amount))
            }
          }
        }
        update = {
          orderId: updateWalletData.orderId,
          amount: Number(updateWalletData.amount),
          type: updateWalletData.type,
          description: updateWalletData.description,
          reference: updateWalletData.reference,
          scheduledDate: updateWalletData.scheduledDate,
          currentBalance: Number(currentBalance)
        }

        data = await Wallet.findOneAndUpdate(
          { userId: walletData.userId },
          { $push: { trx: update }, balance: currentBalance },
          { new: true }
        ).exec()
        if (data) {
          console.log('amount debited to provider wallet', data)
          //notify
          let msg: any =
            updateWalletData.type == 'credit'
              ? 'credited with ' + updateWalletData.amount + ' to your Wallet'
              : 'debited with ' + updateWalletData.amount + ' to your Wallet'
          notifiData = {
            forWhom: updateWalletData.userId,
            message: msg,
            fromWhom: 'ADMIN',
            userType: updateWalletData.userType,
            title: updateWalletData.type == 'credit' ? 'Credited' : 'Debited',
            link: '',
            image: ''
          }
          await NotificationController.notification(notifiData)
        }
        data = await Wallet.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(updateWalletData.userId)
            }
          },
          {
            $addFields: {
              trxcount: {
                $size: '$trx'
              }
            }
          },
          {
            $addFields: {
              data: {
                $subtract: ['$trxcount', 1]
              }
            }
          },
          {
            $project: {
              _id: 1,
              userId: 1,
              userType: 1,
              balance: 1,
              status: 1,
              trx: {
                $arrayElemAt: ['$trx', '$data']
              }
            }
          }
        ])
        if (data){
          return data
        } 
      } catch(error) {
        throw new Error(error)
      }
  }


  static readonly transactionHistory = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const auth = req.auth
      let data,
        userId: any = '',
        query: any = req.query,
        findQuery: any
      // var pageQuery: any = await this.paginationBuilder(req.query);
      if (auth.role == Constants.userRole.USER) userId = auth.userId
      else userId = req.query.userId

      const startDate = moment(`${query.month1} 1, ${query.year1}`, 'MMMM D, YYYY').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      const endDate = moment(`${query.month2} , ${query.year2}`, 'MMMM D, YYYY').endOf('month').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      console.log(startDate, endDate)

      findQuery = [
        { $gte: ['$$trx.createdAt', new Date(startDate)] },
        { $lt: ['$$trx.createdAt', new Date(endDate)] }
      ]
      !query.listingId
        ? ''
        : findQuery.push({
            $eq: ['$$trx.orderId', new mongoose.Types.ObjectId(query.listingId)]
          })

      let pipeline: any = [
        {
          $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
          $lookup: {
            from: 'wallets',
            localField: '_id',
            foreignField: 'userId',
            as: 'trx'
          }
        },
        {
          $unwind: { path: '$trx', preserveNullAndEmptyArrays: false }
        },

        {
          $addFields: {
            transaction: {
              $filter: {
                input: '$trx.trx',
                as: 'trx',
                cond: {
                  $and: findQuery
                }
              }
            }
          }
        },
        {
          $sort: { 'transaction.createdAt': -1 }
        },
        // {
        //     $skip: pageQuery.skip
        // },
        // {
        //     $limit: pageQuery.take
        // },
        {
          $project: {
            walletId: '$trx._id',
            userId: '$trx.userId',
            firstname: 1,
            lastname: 1,
            userType: '$trx.userType',
            balance: '$trx.balance',
            status: '$trx.status',
            trx: '$transaction',
            createdAt: '$trx.createdAt',
            _id: 0,
            transactionCount: { $size: '$transaction' }
          }
        }
      ]


      // RESPONSE
      data = await User.aggregate(pipeline)
      response.message = 'DETAILS_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { transaction: data.length == 0 ? [] : data[0] }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly currentBalance = async (currentBalance: any) => {
    // return new Promise(async (resolve, reject) => {
      try {
        let currentBalanceData
        currentBalanceData = await Wallet.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(currentBalance.userId)
            }
          },
          {
            $addFields: {
              trxcount: {
                $size: '$trx'
              }
            }
          },
          {
            $addFields: {
              data: {
                $subtract: ['$trxcount', 1]
              }
            }
          },
          {
            $project: {
              userId: 1,
              trx: {
                $arrayElemAt: ['$trx', '$data']
              }
            }
          }
        ])
        return currentBalanceData
      } catch (error) {
        throw new Error(error)
      }
  }


  static readonly addBank = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let body = req.body,
        auth = req.auth,
        bankDetail = {},
        datas: any
      let userId = auth.role == Constants.userRole.ADMIN ? req.body.userId : auth.userId
      let paymentAccount: any
      userId = new mongoose.Types.ObjectId(userId)

      if (!userId) throw new CustomError.BadRequestError('USER_ID_IS_REQUIRED')

      let validation = await WalletValidator.validateData(body , "bank")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let bankAcct = await Bank.find({
        acctNumber: body.acctNumber,
        userId: new mongoose.Types.ObjectId(userId)
      }).lean().exec()
      if (bankAcct.length != 0) throw new CustomError.BadRequestError('BANK_ACCOUNT_ALREADY_EXIST')

      let newDoc: any = new Bank();
        (newDoc.userId = userId),
        (newDoc.acctType = body.acctType),
        (newDoc.bankName = body.bankName),
        (newDoc.acctHolderName = body.acctHolderName),
        (newDoc.acctNumber = body.acctNumber),
        (newDoc.email = body.email),
        (newDoc.phone = body.phone),
        (newDoc.address.line1 = body.line1),
        (newDoc.address.city = body.city),
        (newDoc.address.state = body.state),
        (newDoc.address.postal_code = body.postal_code),
        (newDoc.paymentMethod = body.paymentMethod),
        (newDoc.routing_number = body.routing_number),
        (newDoc.permanentAcctNum = body.permanentAcctNum),
        (newDoc.country = body.country),
        (datas = newDoc)

      await User.findOneAndUpdate({ _id: userId }, { userBankId: datas._id })

      bankDetail = {
        acctType: body.acctType,
        bankName: body.bankName,
        acctHolderName: body.acctHolderName,
        acctNumber: body.acctNumber,
        email: body.email,
        phone: body.phone,
        address: {
          line1: body.line1,
          city: body.city,
          state: body.state,
          postal_code: body.postal_code
        },
        routing_number: body.routing_number,
        permanentAcctNum: body.permanentAcctNum,
        country: body.country,
        userId: userId,
        bankId: datas._id.toString()
      }
      
      if (body.paymentMethod === 'razorpay') {
        const contactDetails = {
          name: body.acctHolderName,
          email: body.email,
          phone: body.phone,
          reference_id: `user_${userId}`,
          notes: `Account holder for ${body.acctType} account`
        };
        let razorpayContact: any = await Razor.createContact(contactDetails);
        if (!razorpayContact || !razorpayContact.id) throw new CustomError.BadRequestError('FAILED_TO_CREATE_RAZORPAY_CONTACT');
        const fundAccountDetails = {
          contact_id: razorpayContact.id,
          account_number: body.acctNumber,
          ifsc: body.routing_number,
          name: body.bankName,
          account_holder_name: body.acctHolderName,
          email: body.email,
          phone: body.phone,
        };
        let razorpayFundAccount: any = await Razor.createFundAccount(fundAccountDetails);
        if (!razorpayFundAccount || !razorpayFundAccount.id) throw new CustomError.BadRequestError('FAILED_TO_CREATE_RAZORPAY_FUND_ACCOUNT');
        
        datas = await newDoc.save();
        datas = await Bank.findByIdAndUpdate(new mongoose.Types.ObjectId(datas._id),
          {
            $set: {
              razorpayContactId: razorpayContact.id,
              razorpayFundAccountId: razorpayFundAccount.id,
            }
          },
          { new: true }
        ).exec();
        paymentAccount = razorpayFundAccount;
      }
      else {
        let stripeAcct: any = await stripe.createBankAcct(bankDetail)
        if (!stripeAcct || !stripeAcct.externalAccount.account)
           throw new CustomError.BadRequestError('FAILED_TO_CREATE_STRIPE_ACCOUNT')
        datas = await newDoc.save()
        datas = await Bank.findByIdAndUpdate(new mongoose.Types.ObjectId(datas._id),
        {
          $set: {
            stripeAcctId: stripeAcct.externalAccount.account,
            stripeBankId: stripeAcct.externalAccount.id
          }
        },
        { new: true }
        ).exec()
        paymentAccount = stripeAcct;
      }
      // RESPONSE
      response.message = 'BANK_ADDED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
      response.data = { bankDetail: datas, link: paymentAccount.accountLink || paymentAccount.account_link }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly updateBank = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      const body = req.body

      let validation = await WalletValidator.validateData(body , "updateBank")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      const bankAcct = await Bank.findById(new mongoose.Types.ObjectId(body.userBankId)).lean().exec()
      if (!bankAcct) throw new CustomError.BadRequestError('BANK_ACCOUNT_NOT_FOUND')

      const updateData = {
        bankId: body.userBankId,
        acctType: body.acctType,
        bankName: body.bankName,
        acctHolderName: body.acctHolderName,
        acctNumber: body.acctNumber,
        email: body.email,
        phone: body.phone,
        address: {
          line1: body.line1,
          city: body.city,
          state: body.state,
          postal_code: body.postal_code
        },
        routing_number: body.routing_number,
        permanentAcctNum: body.permanentAcctNum,
        country: body.country
      }

      const updatedBank = await Bank.findByIdAndUpdate(
        new mongoose.Types.ObjectId(body.userBankId),
        updateData,
        { new: true }
      )

      let stripeAcct: any = await stripe.updateBankAcct(updateData, bankAcct.stripeAcctId)
      if (!stripeAcct?.externalAccount.account)
        throw new CustomError.BadRequestError('FAILED_TO_UPDATE_STRIPE_ACCOUNT')


      // RESPONSE
      response.message = 'BANK_DETAIL_UPDATED_SUCCESSFULLY'
      response.status = true
      response.statusCode = 200
      response.data = { bankDetail: updatedBank }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly deleteBank = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let updateBank,
        bankDetail,
        body: any = req.body

      let validation = await WalletValidator.validateData(body , "updateBank")
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      bankDetail = {
        userBankId: body.userBankId,
        stripeBankId: body.stripeBankId,
        stripeAcctId: body.stripeAcctId
      }

      await stripe.deleteBankAcct(bankDetail)
      updateBank = await Bank.findByIdAndUpdate(
        new mongoose.Types.ObjectId(body.userBankId),
        {
          softDelete: true
        },
        { new: true }
      ).exec()


      // RESPONSE
      response.message = 'BANK_DETAIL_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { bankDetail: updateBank }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly listBankAccts = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let bankDetail
      if (req.params.userBankId) {
        bankDetail = await Bank.findById(new mongoose.Types.ObjectId(req.params.userBankId), {
          softDelete: 0,
          userId: 0,
          updatedAt: 0
        })
      } else {
        bankDetail = await Bank.find(
          { userId: new mongoose.Types.ObjectId(req.auth.userId) },
          { softDelete: 0, userId: 0, updatedAt: 0 }
        )
      }


      // RESPONSE
      response.message = 'BANK_DETAIL_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { bankDetail: bankDetail }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }


  static readonly debitOnly = async (updateWalletData: any) => {
    try {
      if (!updateWalletData.userId || !updateWalletData.userType || !updateWalletData.amount || !updateWalletData.type) throw new CustomError.BadRequestError('INSUFFICIENT_DATA')

      // Find the wallet data
      let walletData = await Wallet.findOne({ userId: updateWalletData.userId }).exec()

      // If wallet data doesn't exist, create a new wallet entry
      if (!walletData) {
        let newWallet = {
          userId: updateWalletData.userId,
          userType: updateWalletData.userType,
          orderId: updateWalletData.orderId,
          trx: [], // Initialize trx as an empty array
          balance: 0 // Initialize balance
        }
        walletData = await Wallet.create(newWallet)
      }

      // Calculate the new balance based on the transaction type
      let currentBalance: any;
      if (updateWalletData.type === 'debit') {
        currentBalance = await helper.fixedNum(walletData.balance - Number(updateWalletData.amount))
      } else {
        throw new Error('Invalid transaction type')
      }

      // Create the transaction object
      let transaction = {
        reference: updateWalletData.orderId ? updateWalletData.orderId : '',
        amount: Number(updateWalletData.amount),
        type: updateWalletData.type,
        description: updateWalletData.description,
        currentBalance: Number(currentBalance)
      }

      // Update the wallet data by pushing the transaction object to the trx array and setting the balance
      let updatedWallet = await Wallet.findOneAndUpdate(
        { userId: updateWalletData.userId },
        { $push: { trx: transaction }, $set: { balance: currentBalance } },
        { new: true }
      ).exec()

      // Notify the user about the debit transaction
      if (updatedWallet) {
        let msg = 'debited with ' + updateWalletData.amount + ' to your Wallet'
        let notifiData = {
          forWhom: updateWalletData.userId,
          message: msg,
          fromWhom: 'ADMIN',
          userType: updateWalletData.userType,
          title: 'Debited',
          link: '',
          image: ''
        }
        await NotificationController.notification(notifiData)
      }
      return updatedWallet
    } catch (error) {
      console.error('Error during debit operation:', error)
      throw error
    }
  }


  static readonly selfPayoutByUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let bankDetail = await Bank.findById(new mongoose.Types.ObjectId(req.body.userBankId), {
        stripeBankId: 1,
        stripeAcctId: 1,
        razorpayFundAccountId: 1,
        razorpayContactId: 1,
        paymentMethod: 1,
        userId: 1
      })

      let userId = bankDetail.userId.toString()
      let walletCheck = await Wallet.findOne({ userId: userId }).lean().exec()

      let walletBalance = walletCheck ? walletCheck.balance : 0

      let amount = req.body.amt
      if (walletBalance < amount) throw new CustomError.BadRequestError('INSUFFICIENT_FUND_IN_YOUR_WALLET')
      let payoutData; 
    
      if (bankDetail.paymentMethod === 'razorpay'){
        if (!bankDetail.razorpayFundAccountId) throw new CustomError.BadRequestError('RAZORPAY_FUND_ACCOUNT_NOT_FOUND')
          let razorpayPayoutData = {
            fund_account_id: bankDetail.razorpayFundAccountId,
            amount: amount * 100, 
            currency: req.body.currency,
            mode: req.body.mode,
            purpose: req.body.purpose,
            reference_id: req.body.reference_id,
            notes: req.body.notes,
            queue_if_low_balance: true
          }
          payoutData = await Razor.createPayout(razorpayPayoutData)
      }
      else {
        let data = { amount: req.body.amt, acctId: bankDetail.stripeAcctId }
        payoutData = await stripe.payout(data)
      }
      
      // Call debitOnly function after successful payout
      await WalletController.debitOnly({
        userId: userId,
        userType: 'USER',
        orderId: payoutData.id, // Assuming the orderId should be the ID returned by the payout
        amount: req.body.amt,
        type: 'debit', // Assuming the type is always 'debit' after a payout
        description: 'Payout debit transaction'
      })

      let payout: any = new PayoutHistory()
      payout.userId = userId
      payout.userType = 'USER'
      payout.transferId = payoutData.id
      payout.objectType = payoutData.object
      payout.amount = payoutData.amount
      payout.amountReversed = payoutData.amount_reversed
      payout.balanceTransaction = payoutData.balance_transaction
      payout.createdAt = payoutData.created
      payout.currency = payoutData.currency
      payout.description = payoutData.description
      payout.destination = payoutData.destination
      payout.destination_payment = payoutData.destination_payment
      payout.livemode = payoutData.livemode
      payout.source_type = payoutData.source_type

      await payout.save()


      // RESPONSE
      response.message = 'SELF_PAYOUT_SUCCESSFULLY_BY_USER'
      response.status = true
      response.statusCode = 200
      response.data = payoutData
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response).end()
  }


  static readonly adminPayoutToUser = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let userDetail = await User.findById(new mongoose.Types.ObjectId(req.body.userId), { userBankId: 1 })

      let bankDetail = await Bank.findById(new mongoose.Types.ObjectId(userDetail.userBankId), {
        stripeBankId: 1,
        stripeAcctId: 1,
        razorpayFundAccountId: 1,
        paymentMethod: 1,
        userId: 1
      })
      let userId = bankDetail.userId.toString()
      let amount = req.body.amt;
      let payoutData: any;

      if(bankDetail.paymentMethod === 'razorpay'){
        if (!bankDetail.razorpayFundAccountId) throw new CustomError.BadRequestError('RAZORPAY_FUND_ACCOUNT_NOT_FOUND');
        let razorpayBalance: any = await Razor.retrieveBalance();
        if (razorpayBalance.balance < amount * 100) throw new CustomError.BadRequestError('INSUFFICIENT_FUND_IN_YOUR_RAZORPAY_ACCOUNT');
  
        let razorpayPayoutData = {
          fund_account_id: bankDetail.razorpayFundAccountId,
          amount: amount * 100, 
          currency: req.body.currency,
          mode: req.body.mode,
          purpose: req.body.purpose,
          reference_id: req.body.reference_id,
          notes: req.body.notes,
          queue_if_low_balance: true
        };
        let razorpayResponse = await Razor.createPayout(razorpayPayoutData);
        payoutData = razorpayResponse;
      }
      else {
        let balanceCheck: any = await stripe.retrieveBalance()
        const availableBalance = balanceCheck.available.map((amt: any) => amt.amount)
        if (availableBalance < amount) throw new CustomError.BadRequestError('INSUFFICIENT_FUND_IN_YOUR_STRIPE_ACCOUNT');
        let stripeAcct: any = await stripe.payout({amount, acctId: bankDetail.stripeAcctId})
        payoutData = stripeAcct;
      }

        let payout: any = new PayoutHistory()
        payout.userId = userId
        payout.userType = 'ADMIN'
        payout.transferId = payoutData.id
        payout.objectType = payoutData.object
        payout.amount = payoutData.amount
        payout.amountReversed = payoutData.amount_reversed
        payout.balanceTransaction = payoutData.balance_transaction
        payout.createdAt = payoutData.created
        payout.currency = payoutData.currency
        payout.description = payoutData.description
        payout.destination = payoutData.destination
        payout.destination_payment = payoutData.destination_payment
        payout.livemode = payoutData.livemode
        payout.source_type = payoutData.source_type
        let dataStore = await payout.save()


        // RESPONSE
        response.message = 'PAYOUT_DONE_BY_ADMIN'
        response.status = true
        response.statusCode = 200
        response.data = payoutData
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response)
  }


  static readonly listPayoutHistories = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }

    try {
      let payoutHistories: any
      if (req.params.userId) {
        // If user ID is provided in the request parameters, fetch payout histories for that user
        payoutHistories = await PayoutHistory.find(
          { userId: new mongoose.Types.ObjectId(req.params.userId) },
          { updatedAt: 0 }
        )
      } else {
        // If user ID is not provided, fetch all payout histories
        payoutHistories = await PayoutHistory.find({}, { updatedAt: 0 })
      }


      // RESPONSE
      response.message = 'PAYOUT_HISTORIES_LISTED'
      response.status = true
      response.statusCode = 200
      response.data = { payoutHistories: payoutHistories }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode).json(response)
  }

  static updateContact = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let body: any = req.body;

      let validation = await WalletValidator.updateContact(body)
      if (!validation.status) {
        throw new CustomError.UnProcessableError('Validation Failed', validation.data.validate)
      }

      let contactDetails: any = {
         contactId: body.contactId,
         name: body.name,
         email: body.email,
         phone: body.phone,
         reference_id: body.reference_id,
         notes: body.notes,
     };

     let updatedContact = await Razor.updateContact(body.contactId, contactDetails);

      // RESPONSE
      response.message = 'CONTACT_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { updatedContact: updatedContact }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static deactivateContact = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {
      let body: any = req.body;

      if(!body.contactId || !body.active) throw new CustomError.BadRequestError("MISSING_REQUIRED_FIELDS")

      let activeStatus: any = {
         active: body.active
      };

      let updatedContact = await Razor.deactivateContact(body.contactId, activeStatus);


      // RESPONSE
      response.message = 'CONTACT_STATUS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { updatedContact: updatedContact }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }

  static deactivateFundAccount = async (req: AuthenticateRequest, res: Response) => {
    let response = {
      status: false,
      message: 'Unprocessable Entity',
      data: {},
      validation: {},
      statusCode: 500
    }
    try {

      let body: any = req.body;

      if(!body.fundAccountId || !body.active) throw new CustomError.BadRequestError("MISSING_REQUIRED_FIELDS")

      let activeStatus: any = {
         active: body.active
      };

      let updatedfundAccount = await Razor.deactivateFundAccount(body.fundAccountId, activeStatus);


      // RESPONSE
      response.message = 'CONTACT_STATUS_UPDATED'
      response.status = true
      response.statusCode = 200
      response.data = { updatedfundAccount: updatedfundAccount }
    } catch (error) {
      console.log('Error \n', error)
      response.status = false
      response.message = error.message || response.message
      response.validation = error.reasons || {}
      response.statusCode = error.statusCode || response.statusCode
    }
    return res.status(response.statusCode || 500).json(response).end()
  }
}

export { WalletController }