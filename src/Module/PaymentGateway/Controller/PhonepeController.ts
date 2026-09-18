import { BaseController } from "@abserve/Module/BaseControllers";
import { Config } from "@abserve/Config/AppConfig";
import { StandardCheckoutPayRequest, StandardCheckoutClient, CreateSdkOrderRequest, Env, MetaInfo } from 'pg-sdk-node'
import { HelperFunctionController as Helper } from "@abserve/Helper/Function";
import { randomUUID } from "crypto";
const { phonepeClientId, phonepeClientSecret, phonepeClientVersion }: any = Config.phonepeGateway

const client: any = StandardCheckoutClient.getInstance(phonepeClientId, phonepeClientSecret, Number(phonepeClientVersion), Env.SANDBOX);

class PhonepeController extends BaseController {
    constructor() {
        super();
    }
    static createPayment = async (paymentData: any) => {
        console.log("Payment Data:", paymentData);
        
        return new Promise(async (resolve, reject) => {
            try {
                const merchantOrderId = randomUUID();
                console.log("Merchant Order ID:", merchantOrderId);
                
                let totalAmount = paymentData.totalAmount;
                if(paymentData.currency !== "INR") {
                    let exchangeRate: any = await Helper.getExchangeRateForPhonePe(paymentData.currency);
                    totalAmount = totalAmount * exchangeRate?.exchangeRate;
                }

                const amount = Math.round(totalAmount * 100);
                const redirectUrl = `${Config.app.apiurl}module/listing/paymentStatus/${paymentData.invoiceId}?userId=${paymentData.userId}&paymentMethod=phonepe&merchant_order_id=${merchantOrderId}`;

                if(paymentData?.isMobile) {
                    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
                        .merchantOrderId(merchantOrderId)
                        .amount(amount)
                        .redirectUrl(redirectUrl)
                        .build();

                    const response = await client.createSdkOrder(request);
                    console.log("------------create-payment-mobile response", response);
                    resolve({...response, merchantOrderId});
                }

                const metaInfo = MetaInfo.builder()
                .udf1(merchantOrderId)
                .build();

                const request: any = StandardCheckoutPayRequest.builder()
                    .merchantOrderId(merchantOrderId)
                    .amount(amount)
                    .redirectUrl(redirectUrl)
                    .metaInfo(metaInfo)
                    .build();
                
                const response = await client.pay(request);
                console.log("-----------create-payment-response", response);
                resolve({...response, merchantOrderId});
            } catch (error) {
                reject(new Error(error, { cause: { statusCode: 422 } }));
            }
        })
    }

    static checkStatus = async (merchant_order_id: any) => {
        return new Promise(async (resolve, reject) => {
            try {   
              const response = await client.getOrderStatus(merchant_order_id);
              console.log("-----------check-status-response",response)
              resolve(response);
            } catch (error) {
              console.error('Status Error:', error);
              reject(error)
            }
        })
    }

    static handleWebhook = async (req: any, res: any) => {
        try {
            const body = req.body;
            console.log("Webhook Body:", JSON.stringify(body));

            const merchantOrderId = body.merchantTransactionId || body.transactionId || body.merchantOrderId;
            if(!merchantOrderId) return res.status(400).send({ message: "Missing merchant order ID" });
            
            const statusResponse = await client.status(Config.phonepeGateway.phonepeClientId, merchantOrderId);
            const status = statusResponse.data?.state;

            console.log(`Payment status for ${merchantOrderId}: ${status}`);
            return res.status(200).send("OK");
        } catch (error) {
            console.error("Webhook error:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
}


export { PhonepeController }