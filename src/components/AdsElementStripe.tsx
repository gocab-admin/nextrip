"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import dynamic from "next/dynamic";
import { usePageContext } from "@/components/Providers/PageContext";

const AdsCheckoutForm: any = dynamic(
  () => import("@/components/AdsCheckoutForm"),
  {
    ssr: false
  }
);

const Elementstripe = ({ data }: any) => {
  
  const { settings } = usePageContext();
  const { paymentGateway } = settings;
  const stripeKey = paymentGateway?.publishableKey;
  // const stripePromise = loadStripe(STRIPE_PROMISE)
  const stripePromise = loadStripe(stripeKey);
  const [options, setOptions] = useState<any>({});
  useEffect(() => {
    if (!data || !data?.data?.payment?.client_secret) {
      throw new Error("Payment method not found.");
    }
    setOptions({
      clientSecret: data?.data?.payment?.client_secret
    });
  }, []);

  return (
    <>
      {options.clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <AdsCheckoutForm data={data} />
        </Elements>
      )}
    </>
  );
};

export default Elementstripe;
