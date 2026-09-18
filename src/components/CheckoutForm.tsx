"use client";

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { StripeError } from '@stripe/stripe-js'

import { dispatch } from '@/redux/store'
import { paymentStatus } from '@/redux/slice/user/BookingSlice'
import Footer from '@/components/footer';
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./checkout.module.scss";
import { useRouter } from 'next/navigation';

const CheckoutForm = ({ data }: any) => {

  const { i18 } = usePageContext();
  const bookingData = data.booking
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const currentURL = new URL(window.location.href);
    const domainURL = currentURL.host;
    const returnPath = '/rooms/booking/bookingSuccess?paymentMode=card';
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

            const id1 = bookingData.payment.id
            const data = { invoiceId: bookingData.invoiceId }
            console.log("booking", id1, data)
            const response = await dispatch(paymentStatus(id1, data))

            // if (response.status === 200) {
            //   router.push('/rooms/booking/bookingSuccess?paymentMode=card')
            // } else {
            //   console.error('Unexpected status code:', response.status)
            // }
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
      {/* <Footer/> */}
    </div>
  )
}
export default CheckoutForm;
