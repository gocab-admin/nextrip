"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Header from "@/components/header";
import InsightTabs from "@/components/insightTabs";
import Footer from "@/components/footer";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { useAppSelector } from "@/redux/hooks";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";
import SelectBox from "./selectBox";

export default function OpportunityHub() {
  const { i18,responsiveView } = usePageContext();
  const { CurrencyList } = useAppSelector(currencySelector);
 
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
          <InsightTabs />
          <div className={`${styles.main_content}`}>
            <div className={`${styles.content_box}`}>
              <h3>{i18?.SETUPPAYOUTS?.SELECTMONTH || "Select month"}</h3>
              <div>
                <SelectBox />
              </div>
              <div className={`${styles.earnings}`}>
                <h1>{CurrencyList.currency}</h1>
                <p>
                  {i18?.SETUPPAYOUTS?.BOOKEDEARNINGSFOR ||
                    "Booked earnings for"}{" "}
                  2021
                </p>
                <div className={`${styles.graph_data}`}>
                  <div className={`${styles.grid}`}>
                    <h4>{CurrencyList.currency} 000.0</h4>
                    <div className={`${styles.flex}`}>
                      <div className={`${styles.box}`}></div>
                      <p>{i18?.SETUPPAYOUTS?.PAIDOUT || "Paid out"}</p>
                    </div>
                  </div>

                  <div className={`${styles.grid}`}>
                    <h4>{CurrencyList.currency} 000.0</h4>
                    <div className={`${styles.flex}`}>
                      <div className={`${styles.box2}`}></div>
                      <p>{i18?.SETUPPAYOUTS?.EXPECTED || "Expected"}</p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.graph}`}>
                  <p>{i18?.SETUPPAYOUTS?.GRAPH || "Graph"}</p>
                </div>
                <div className={`${styles.details}`}>
                  <div className={`${styles.box1}`}>
                    <h1>2021 {i18?.GUESTINBOX?.DETAILS || "Details"}</h1>
                  </div>
                  <div className={`${styles.box2}`}>
                    <p>
                      {i18?.SETUPPAYOUTS?.YOUHAVENOLISTINGS ||
                        "You have no listings currently listed"}
                    </p>
                  </div>
                  <div className={`${styles.box3}`}>
                    <div>
                      {" "}
                      <p>
                        {i18?.SETUPPAYOUTS?.CLEANINGFEES || "Cleaning fees"}
                      </p>
                    </div>
                    <div>
                      {" "}
                      <p>{CurrencyList.currency} 0</p>
                    </div>
                  </div>
                  <div className={`${styles.box2}`}>
                    <Link href="/">
                      <h6>
                        {i18?.SETUPPAYOUTS?.SHOWTRANSACTIONHISTORY ||
                          "Show transaction history"}
                      </h6>
                    </Link>
                  </div>
                  <div className={`${styles.box2}`}>
                    <Link href="/">
                      <h6>
                        {i18?.SETUPPAYOUTS?.SHOWTAXINFORMATION ||
                          "Show tax information"}
                      </h6>
                    </Link>
                  </div>
                  <div>
                    <Link href="/">
                      <h5>
                        {i18?.SETUPPAYOUTS?.GIVEUSFEEDBACK ||
                          "Give us feedback"}
                      </h5>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
