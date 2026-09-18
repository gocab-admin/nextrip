"use client";
import { useEffect, useState } from "react";

import Header from "@/components/header";
import InsightTabs from "@/components/insightTabs";
import Footer from "@/components/footer";

import styles from "./page.module.scss";

export default function ListingIssues() {
  const [responsiveView, setResponsiveView] = useState<any>("");

  useEffect(() => {}, [responsiveView]);

  const handleResize = () => {
    const windowWidth = window.innerWidth;

    const breakpoints = [
      { name: "xs", width: 0, maxWidth: 575 },
      { name: "sm", width: 576, maxWidth: 767 },
      { name: "md", width: 768, maxWidth: 991 },
      { name: "lg", width: 992, maxWidth: 1199 },
      { name: "xl", width: 1200, maxWidth: 1399 },
      { name: "xxl", width: 1400 }
    ];

    let responsiveVw =
      breakpoints.find(
        (bp: any) => windowWidth >= bp?.width && windowWidth <= bp?.maxWidth
      )?.name || "xxl";

    if (responsiveVw !== responsiveView) {
      setResponsiveView(responsiveVw);
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [numItemsToScroll, setNumItemsToScroll] = useState(3);

  useEffect(() => {
    // Detect screen size changes and set the number of items to scroll accordingly
    const handleResize = () => {
      if (window.innerWidth < 780) {
        setNumItemsToScroll(1);
      } else {
        setNumItemsToScroll(3);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call the function initially

    return () => {
      window.removeEventListener("resize", handleResize); // Remove the event listener on unmount
    };
  }, []);
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
            <h1>No issues here!</h1>
            <p>
              If issues are reported in the future, you&#39;ll be able to find
              that info here. It may take up to 1 day for the latest info to
              appear.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
