"use client";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

import Header from "@/components/header";
import isAuth from "@/components/isAuth";
import { usePageContext } from "@/components/Providers/PageContext";
// import Footer from '@/components/footer';

import styles from "./page.module.scss";

function FallbackComponent() {
  return <div>Loading...</div>;
}

const Elementstripe = dynamic(() => import("@/components/Elementstripe"), {
  ssr: false
});

const StripPayment = () => {
  const { i18 } = usePageContext();
  const bookingData = useSelector(
    (state: any) => state.bookingEstimation.bookingData
  );
  return (
    <Suspense fallback={<FallbackComponent />}>
      <div className={`${styles.booking} p-2`}>
        <Header center="hide" page="hide" />
        <div>{bookingData.data && <Elementstripe data={bookingData} />}</div>
      </div>
    </Suspense>
  );
};
export default isAuth(StripPayment);
