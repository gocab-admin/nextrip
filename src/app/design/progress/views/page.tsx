"use client";
import { useEffect, useState } from "react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

export default function Views() {
  const { i18,responsiveView } = usePageContext();
  return (
    <>
      <div>
        <Header
          page="hide"
          center={
            responsiveView === "sm" || responsiveView === "xs"
              ? "center"
              : "inbox"
          }
          type="provider"
        />
      </div>
      <div className={`${styles.opportunity_hub}`}>
        <div className={`${styles.container}`}>
          {/* <InsightTabs /> */}
          <div className={` ${styles.main_content}`}>
            <div className={`${styles.content_resources}`}>
              <div>
                <h1>0</h1>
                <p>July 2023 {i18?.HEADER?.VIEWS || "Views"}</p>
              </div>
              <div>
                <h1>0</h1>
                <p>
                  October 2023 {i18?.BOOKINGPAGE?.NEWBOOKINGS || "new bookings"}
                </p>
              </div>
              <div>
                <h1>0</h1>
                <p>{i18?.BOOKINGPAGE?.BOOKINGRATE || "Booking rate"}</p>
              </div>
            </div>
          </div>
          <div className={`${styles.graph}`}>
            <h2>{i18?.SETUPPAYOUTS?.GRAPH || "graph"}</h2>
          </div>
          <div className={` ${styles.main_content}`}>
            <span>
              {i18?.SETUPPAYOUTS?.DATAMAYBEDELAYED ||
                "Data may be delayed up to 3 days"}
            </span>
            <h3>{i18?.SETUPPAYOUTS?.GIVEUSFEEDBACK || "Give us feedback"}</h3>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
