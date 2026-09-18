"use client";

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { StripeError } from '@stripe/stripe-js'
import { dispatch } from '@/redux/store'
import { adsPaymentStatus } from '@/redux/slice/user/BookingSlice'
import { usePageContext } from "@/components/Providers/PageContext";
import styles from "./checkout.module.scss";

const CheckoutForm = ({ data }: any) => {

    const { i18 } = usePageContext();
    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async (event: any) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        const currentURL = new URL(window.location.href);
        const domainURL = currentURL.host;
        const returnPath = '/ads/packages/subscriptionSuccess?paymentMode=card';
        const returnURL = `http://${domainURL}${returnPath}`;

        const result = await stripe
            .confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnURL
                }
            })
            .then(async (response: {
                error?: StripeError;
                paymentIntent?: { status: string; id: string };
            }) => {

                if (response.error) {
                    alert(response.error.message)
                } else if (
                    response.paymentIntent
                    && response.paymentIntent.status === 'succeeded'
                ) {

                    try {

                        const id = data?.payment.id
                        const packageId = { packageId: data?.packageId }
                        const response = await dispatch(adsPaymentStatus(id, packageId))
                        // console.log(response);
                    } catch (error) {
                        console.error('GET API error:', error)
                    }
                } else {
                    console.log(
                        `Payment not completed. Status: ${response.paymentIntent?.status || 'unknown'
                        }`
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className={`${styles.box}`}>
                    <div className={`${styles.content}`}>
                        <PaymentElement />
                        <div className={`${styles.btn}`}>
                            <button disabled={!stripe}>{i18?.LISTING?.SUBMIT || "Submit"}</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default CheckoutForm;
