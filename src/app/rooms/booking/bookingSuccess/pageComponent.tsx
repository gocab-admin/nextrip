"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import ImageComponent from "@/components/ImageComponent";
import Header from "@/components/header";
import { dispatch } from "@/redux/store";
import { paymentStatus } from "@/redux/slice/user/BookingSlice";
import Footer from "@/components/footer";
import isAuth from "@/components/isAuth";
import { handleImageError } from "@/services/utils/utils";
import { usePageContext } from "@/components/Providers/PageContext";

import "../../../../components/header.scss";
import styles from "./page.module.scss";

const image = require("../../../images/booking.jpg");
const imagePay = require("../../../images/pay.jpeg");

const BookingSuccess = () => {
  const { i18 } = usePageContext();
  const BookingID = useSelector((state: any) => state.bookingEstimation);
  const [response, setResponse] = useState<any>(null);
  const [paymentMode, setPaymentMode] = useState<any>(null);
  const router = useRouter() as any;

  const handlePaymentSuccess = () => {
    if (response?.instantBooking) {
      router.push("/user/trips/?trip=acceptedBooking");
    } else {
      router.push("/user/trips/?trip=pendingBooking");
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get("paymentMode");
    setPaymentMode(param);
    if (paymentMode === "card") {
      const urlParams = new URLSearchParams(window.location.search);
      const payment_intent = urlParams.get("payment_intent");
      const invoiceId = localStorage.getItem("invoiceId");

      const fetchData = async () => {
        try {
          const apiResponse = await dispatch(
            paymentStatus(payment_intent, { invoiceId })
          );
          setResponse(apiResponse);
        } catch (error) {
          console.log("Error:", error);
        }
      };
      fetchData();
    }
  }, [paymentMode, dispatch]);
  
  return (
    <>
      <div className={`${styles.success} success-msg`}>
        <Header center="hide" page="hide" />
        {paymentMode === "cash" ? (
          <div className={`${styles.content}`}>
            <div className={`${styles.Image_container}`}>
              <ImageComponent
                className={`${styles.Image}`}
                src={image}
                alt="bookingSuccess"
                onError={handleImageError}
                width={800}
                height={800}
                img='static'
              />
            </div>
            <div className={styles.content1}>
              <h4>
                {i18?.BOOKINGPAGE?.THANKYOUFORBOOKING ||
                  "Thank You for Booking Your Adventure!"}
              </h4>
            </div>
            <div className={styles.content1}>
              <p>
                {" "}
                <b>
                  {i18?.BOOKINGPAGE?.CONGRATULATIONS || "Congratulations!"}
                </b>{" "}
                {i18?.BOOKINGPAGE?.BOOKINGSUCCESSTEXT ||
                  "Your  booking has been successfully confirmed. We are thrilled to have you join us for an unforgettable experience. Below, you will find all the details for your upcoming visit."}
              </p>
            </div>
            <div className={styles.content1}>
              <button onClick={handlePaymentSuccess}>
                {i18?.BOOKINGPAGE?.BOOKINGDETAILS || "Booking Details"}
              </button>
            </div>
          </div>
        ) : (
          <div className={`${styles.content}`}>
            <div className={`${styles.Image_container}`}>
              <ImageComponent
                className={`${styles.Image}`}
                src={imagePay}
                alt="paymentSuccess"
                onError={handleImageError}
                width={800}
                height={800}
                 img='static'
              />
            </div>
            <div className={styles.content1}>
              <h4>
                {i18?.BOOKINGPAGE?.PAYMENTSUCCESSFUL || "Payment Successful!"}
              </h4>
            </div>
            <div className={styles.content1}>
              <p>
                {" "}
                <b>
                  {i18?.BOOKINGPAGE?.CONGRATULATIONS || "Congratulations!"}
                </b>{" "}
                {i18?.BOOKINGPAGE?.BOOKINGSUCCESSTEXT ||
                  "Your  booking has been successfully confirmed. We are thrilled to have you join us for an unforgettable experience. Below, you will find all the details for your upcoming visit."}
              </p>
            </div>
            <div className={styles.content1}>
              <button onClick={handlePaymentSuccess}>
                {i18?.BOOKINGPAGE?.BOOKINGDETAILS || "Booking Details"}
              </button>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};
export default isAuth(BookingSuccess);
