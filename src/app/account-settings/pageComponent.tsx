"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

import { dispatch } from "@/redux/store";
import { fetchUserAboutData } from "@/redux/slice/user/userAboutDataSlice";
import { usePageContext } from "@/components/Providers/PageContext";
import SwitchHeader from "@/components/SwitchHeader";
import isAuth from "@/components/isAuth";

import styles from "./page.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { userSelector } from "@/redux/slice/user/userSlice";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
const Footer = dynamic(() => import("@/components/footer"));
const MobileFooternav = dynamic(
  () => import("@/components/MobileFooterNav")
);
const Link = dynamic(() => import("next/link"));
const Skeleton = dynamic(() => import("@mui/material/Skeleton"));
const DisplaySettingsIcon = dynamic(
  () => import("@mui/icons-material/DisplaySettings")
);

const Accounts = () => {
  const Router = useRouter()
  const { i18, responsiveView, settings } = usePageContext();
  const { status } = useAppSelector(userSelector);
  const { listCount } = status;
  const data = useSelector(
    (state: any) => state?.about?.aboutData?.data?.userDetail
  );

  useEffect(() => {
    dispatch(fetchUserAboutData());
  }, []);

  return (
    <>
      <div className={`${styles.host}`}>
        <SwitchHeader center="hide" page="hide" />

        <section className={`${styles.form} mt-4 mb-5  container`}>
          <div className={`${styles.size}m-auto account-page`}>
            <div className={`${styles.formleft} mx-3`}>
              <h1>{i18?.HEADER?.ACCOUNT || "Account"}</h1>
              {data ? (
                <p>
                  <span>
                    {data?.firstname} {data?.lastname}
                  </span>
                  , {data?.email} <br />{" "}
                  <a href="/profiles/user">
                    {i18?.PROFILE?.GOTOPROFILE || "Go to profile"}
                  </a>
                </p>
              ) : (
                <Skeleton variant="rectangular" width={200} height={30} />
              )}
            </div>
            <div
              className={`${styles.accountset} row justify-content-between mx-3 mt-4`}
            >
              <Link href="/personalinfo" className={`${styles.boxes}`}>
                <DisplaySettingsIcon />
                <h5>{i18?.PROFILE?.PERSONALINFO || "Personal info"}</h5>
                <p>
                  {i18?.ACCOUNTINFO?.PERSONALINFO ||
                    "Provide personal details and how we can reach you"}
                </p>
              </Link>
              <Link href="/logininfo" className={`${styles.boxes}`}>
                <DisplaySettingsIcon />
                <h5>{i18?.PROFILE?.LOGINSECURITY || "Login & security"}</h5>
                <p>
                  {i18?.ACCOUNTINFO?.LOGINSECURITY ||
                    "Update your password and secure your account"}
                </p>
              </Link>
              {settings.hiddenSettings.listing !== '0' && <>
                {listCount === 0 ?
                  <Tooltip
                    title={`Please ${i18?.HEADER?.BECOMEAHOST || "Become a Host"} ${i18?.ACCOUNTINFO?.VIEW_SECTION || "to view this section"}`}
                    arrow
                    followCursor
                  >
                    <div
                      className={`${styles.boxes}`}
                      style={{
                        opacity: 0.5,
                        cursor: 'not-allowed'
                      }}
                    >
                      <DisplaySettingsIcon />
                      <h5>
                        {i18?.PROFILE?.PAYTMENTSPAYOUTS || "Payments & payouts"}
                      </h5>
                      <p>
                        {i18?.ACCOUNTINFO?.PAYMENTSPAYOUTSPARA ||
                          "Review payments, payouts, coupons and gift cards"}
                      </p>
                    </div></Tooltip> :
                  <Link
                    href="/account-settings/payments/payment-method"
                    className={`${styles.boxes}`}
                  >
                    <DisplaySettingsIcon />
                    <h5>
                      {i18?.PROFILE?.PAYTMENTSPAYOUTS || "Payments & payouts"}
                    </h5>
                    <p>
                      {i18?.ACCOUNTINFO?.PAYMENTSPAYOUTSPARA ||
                        "Review payments, payouts, coupons and gift cards"}
                    </p>
                  </Link>
                }</>}
            </div>
          </div>
        </section>
        {(responsiveView === "sm" || responsiveView === "xs") && (
         <div className="d-flex  justify-content-center">
           <div className={`${styles.switch_btn}`} onClick={() => Router.push(listCount !== 0 ? "/hosting" : "/propertyform")}>
            <img src="/svg/swap.svg" alt="img" className={`${styles.icon}`} />
            {listCount === 0
              ? `${i18?.HEADER?.BECOMEAHOST || "Become a Host"}`
              : `${i18?.HOMEPAGE?.SWITCHTOHOSTING || "Switch to Hosting"
              }`}
          </div>
         </div>

        )}
        <Footer />
      </div>
      {(responsiveView === "sm" || responsiveView === "xs") && (
        <MobileFooternav />
      )}
    </>
  );
};
export default isAuth(Accounts);
