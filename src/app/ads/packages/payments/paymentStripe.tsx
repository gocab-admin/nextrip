"use client";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Header from "@/app/ads/components/adsHeader";
import { usePageContext } from "@/components/Providers/PageContext";
import styles from "./paymentStripe.module.scss";


function FallbackComponent() {
    return <div>Loading...</div>;
}

const AdsElementstripe = dynamic(() => import("@/components/AdsElementStripe"), {
    ssr: false
});

const paymentStripe = () => {
    const { i18 } = usePageContext();
    const { getAdsCheckoutDetails } = useSelector((state: any) => state.bookingEstimation);
    const userType = typeof window !== "undefined" && localStorage?.getItem("usersType");
    return (
        <Suspense fallback={<FallbackComponent />}>
            <div className={`${styles.booking} p-2`}>
                <Header center="hide" type={userType === "user" ? "" : "host"} page="hide" />
                <div>{getAdsCheckoutDetails?.data && <AdsElementstripe data={getAdsCheckoutDetails} />}</div>
            </div>
        </Suspense>
    )
}

export default paymentStripe
