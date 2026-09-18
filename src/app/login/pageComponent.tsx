"use client";
import React from "react";

import Login from "@/components/login";
import Header from "@/components/header";
import MobileFooternav from "@/components/MobileFooterNav";
import { usePageContext } from "@/components/Providers/PageContext";

const Loginpage = () => {
  const { i18, responsiveView, settings } = usePageContext();
  console.log("Setings Data", settings)
  return (
    <>
      {responsiveView === "sm" || responsiveView === "xs" ? (
        <div
          className="d-flex align-items-center border-bottom p-2"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "white"
          }}
        >
          <h3 className="flex-fill text-center m-0">
            {i18?.ROOMPAGE?.LOGINORSIGNUP || "Log in or sign up"}
          </h3>
        </div>
      ) : (
        <Header center="hide" page="hide" />
      )}
      <div className="my-5">
        <Login />
      </div>
      {(responsiveView === "sm" || responsiveView === "xs") && (
        <MobileFooternav />
      )}
      {/* <Footer /> */}
    </>
  );
};

export default Loginpage;
