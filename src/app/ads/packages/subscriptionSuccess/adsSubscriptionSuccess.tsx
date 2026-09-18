"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import ImageComponent from "@/components/ImageComponent";
import Header from "@/app/ads/components/adsHeader";
import { dispatch } from "@/redux/store";
import { adsPaymentStatus } from "@/redux/slice/user/BookingSlice";
import isAuth from "@/components/isAuth";
import { handleImageError } from "@/services/utils/utils";
import { usePageContext } from "@/components/Providers/PageContext";
import "../../../../components/header.scss";
import styles from "./adsSubscriptionSuccess.module.scss";

const imagePay = require("../../../images/pay.jpeg");

const SubscriptionSuccess = () => {
    const { i18 } = usePageContext();
    const [response, setResponse] = useState<any>(null);
    const [paymentMode, setPaymentMode] = useState<any>(null);
    const router = useRouter() as any;
    const userType = typeof window !== "undefined" && localStorage?.getItem("usersType");
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const param = urlParams.get("paymentMode");
        setPaymentMode(param);
    }, []);

    useEffect(() => {
        if (paymentMode === "card") {
            const urlParams = new URLSearchParams(window.location.search);
            const payment_intent = urlParams.get("payment_intent");
            const packageId = localStorage.getItem("packageId");

            const fetchData = async () => {
                try {
                    const apiResponse = await dispatch(
                        adsPaymentStatus(payment_intent, { packageId })
                    );
                    setResponse(apiResponse);
                } catch (error) {
                    console.log("Error:", error);
                }
            };
            fetchData();
        }
    }, [paymentMode, dispatch]);

    const handlePaymentSuccess = () => {
        
        if (!response) return;
        if (response) {
            router.push("/ads/packages/packageStatus/?status=active");
        } else {
            router.push("/user/trips/?trip=pendingBooking");
        }
    };

    return (
        <>
            <div className={`${styles.success} success-msg`}>
                <Header center="hide" type={userType === "user" ? "" : "host"} page="hide" />
                <div className={`${styles.content}`}>
                    <div className={`${styles.Image_container}`}>
                        <ImageComponent
                            className={`${styles.Image}`}
                            src={imagePay}
                            alt="paymentSuccess"
                            onError={handleImageError}
                        />
                    </div>
                    <div className={styles.content1}>
                        <h4>
                            {i18?.SUBSCRIPTIONPAGE?.PAYMENTSUCCESSFUL || "Payment Successful!"}
                        </h4>
                    </div>
                    <div className={styles.content1}>
                        <p>
                            {" "}
                            <b>
                                {i18?.SUBSCRIPTIONPAGE?.CONGRATULATIONS || "Congratulations!"}
                            </b>{" "}
                            {i18?.SUBSCRIPTIONPAGE?.SUBSCRIPTIONSUCCESSTEXT ||
                                "Your subscription has been successfully activated. We are excited to have you on board. Below, you will find all the details of your subscription."}
                        </p>
                    </div>
                    <div className={styles.content1}>
                        <button onClick={handlePaymentSuccess}>
                            {i18?.SUBSCRIPTIONPAGE?.SUBSCRIPTIONDETAILS || "Subscription Details"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default isAuth(SubscriptionSuccess);
