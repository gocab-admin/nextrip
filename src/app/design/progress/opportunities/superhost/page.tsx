"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import ImageComponent from "@/components/ImageComponent";
import {
  Badge,
  Bonus,
  Coupon,
  Features,
  Guest,
  Search,
  Support
} from "@/app/global/svg";
import Header from "@/components/header";
import InsightTabs from "@/components/insightTabs";
import Footer from "@/components/footer";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";
import SelectBox from "./selectBox";

export default function Superhost() {
  const { i18 } = usePageContext();
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
  const slides = [
    {
      icon: (
        <Coupon
          style={{
            height: "24px",
            width: "24px",
            fill: "#fff"
          }}
        />
      ),
      heading: "<Website/> coupon",
      para: "Each time you maintain your Superhost status for a whole year, you get a $100 <Website/> coupon."
    },
    {
      icon: (
        <Guest
          style={{
            height: "24px",
            width: "24px",
            fill: "#fff"
          }}
        />
      ),
      heading: "Promoted to guests",
      para: "You’ll be featured to guests in promotional emails."
    },
    {
      icon: (
        <Search
          style={{
            height: "24px",
            width: "24px",
            fill: "#fff"
          }}
        />
      ),
      heading: "Easy to find in search",
      para: "Guests can filter their searches for Superhosts."
    },
    {
      icon: (
        <Badge
          style={{
            height: "24px",
            width: "24px",
            fill: "#fff"
          }}
        />
      ),
      heading: "Superhost badge",
      para: "This trusted symbol of great hospitality will show up on your profile and listing pages."
    },
    {
      icon: (
        <Bonus
          style={{
            height: "24px",
            width: "24px",
            fill: "#fff"
          }}
        />
      ),
      heading: "Extra referral bonus",
      para: "You get an additional 20% bonus on top of the standard Host referral bonus."
    },
    {
      icon: (
        <Features
          style={{
            height: "24px",
            width: "24px",
            fill: "#fff"
          }}
        />
      ),
      heading: "Early access to new features",
      para: "You can pilot new programmes and test features before they launch to everyone."
    },
    {
      icon: (
        <Support
          style={{
            height: "24px",
            width: "24px",
            fill: "#fff"
          }}
        />
      ),
      heading: "Priority support",
      para: "You get priority assistance when you contact <Website/> Support."
    }
  ];
  const HostingDetails = [
    {
      imageUrl: "/images/people.webp",
      content: "Why it’s smart to offer flexible cancellations right now"
    },
    {
      imageUrl: "/images/people.webp",
      content: "Getting started with <Website/>’s cleaning protocol"
    },
    {
      imageUrl: "/images/people.webp",
      content: "The dos and don’ts of providing self check-in"
    },
    {
      imageUrl: "/images/people.webp",
      content: "What you need to know about hosting families and pets"
    },
    {
      imageUrl: "/images/people.webp",
      content: "How to make your space comfortable for remote workers"
    },
    {
      imageUrl: "/images/people.webp",
      content: "The best amenities to offer right now"
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    const newIndex = currentIndex + numItemsToScroll;
    setCurrentIndex(Math.min(newIndex, slides.length - 1));
  };

  const prevSlide = () => {
    const newIndex = currentIndex - numItemsToScroll;
    setCurrentIndex(Math.max(newIndex, 0));
  };
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
            <div>
              <h1>
                {i18?.REFERAL?.YOUDIDNOTGET ||
                  "You didn’t get Superhost status this October"}
              </h1>
            </div>
            <div>
              <p>
                {i18?.REFERAL?.WEKNOWTHATTHIS ||
                  "We know that this can be disappointing, but you’ll have another chance to become a Superhost in January."}
              </p>
            </div>
            <div>
              <Link href="/">
                <h4>
                  {" "}
                  {i18?.REFERAL?.LEARNMOREABOUT ||
                    "Learn more about the programme"}
                </h4>
              </Link>
            </div>
          </div>
          <div className={`${styles.box}`}>
            <h3>{i18?.PRODUCT?.YOURSUPERHOST || "Your Superhost stats"}</h3>
            <div className={`${styles.grid}`}>
              <div>
                <SelectBox />
              </div>
              <div>
                <span>
                  {i18?.PRODUCT?.YOUDIDNOTGET ||
                    "You didn’t get Superhost status this time."}
                </span>
                <p>
                  {i18?.PRODUCT?.FORTHISASSESSMENT ||
                    "For this assessment period, you didn’t quite meet all the Superhost criteria."}
                </p>
              </div>
            </div>
            <div className={`${styles.stats_box}`}>
              <div className={`${styles.grid_box}`}>
                <h1>0</h1>
                <p>{i18?.PRODUCT?.OVERALLRATING || "Overall rating"}</p>
                <span>{i18?.PRODUCT?.CRITERIA || "Criteria "} : </span>
                <div className={`${styles.check}`}>
                  {i18?.PRODUCT?.DIDNOTMEET || "Didn't meet"}
                </div>
              </div>

              <div className={`${styles.grid_box}`}>
                <h1>0</h1>
                <p>{i18?.PRODUCT?.OVERALLRATING || "Overall rating"}</p>
                <span>{i18?.PRODUCT?.CRITERIA || "Criteria "} : </span>
                <div className={`${styles.check}`}>
                  {i18?.PRODUCT?.DIDNOTMEET || "Didn't meet"}
                </div>
              </div>

              <div className={`${styles.grid_box}`}>
                <h1>0</h1>
                <p>{i18?.PRODUCT?.OVERALLRATING || "Overall rating"}</p>
                <span>{i18?.PRODUCT?.CRITERIA || "Criteria "} : </span>
                <div className={`${styles.check}`}>
                  {i18?.PRODUCT?.DIDNOTMEET || "Didn't meet"}
                </div>
              </div>

              <div className={`${styles.grid_box}`}>
                <h1>0</h1>
                <p>{i18?.PRODUCT?.OVERALLRATING || "Overall rating"}</p>
                <span>{i18?.PRODUCT?.CRITERIA || "Criteria "} : </span>
                <div className={`${styles.check}`}>
                  {i18?.PRODUCT?.DIDNOTMEET || "Didn't meet"}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.rewards}`}>
            <h1>{i18?.PRODUCT?.SUPERHOSTREWARDS || "Superhost rewards"}</h1>
            <div className={`${styles.reward_flex}`}>
              <p>
                {currentIndex + 1}/{slides.length}
              </p>
              <button onClick={prevSlide}>
                <KeyboardArrowLeftIcon />
              </button>
              <button onClick={nextSlide}>
                <KeyboardArrowRightIcon />
              </button>
            </div>
          </div>
          <div className={`${styles.reward_grid}`}>
            {slides
              .slice(currentIndex, currentIndex + numItemsToScroll)
              .map((slide, index) => (
                <div className={`${styles.reward_box}`} key={index}>
                  <div className={`${styles.icon}`}>
                    <div className={`${styles.icon_align}`}>{slide.icon}</div>
                  </div>
                  <h1>{slide.heading}</h1>
                  <p>{slide.para}</p>
                </div>
              ))}
          </div>
          <div className={`${styles.rewards}`}>
            <h1>
              {i18?.PRODUCT?.RESOURCESTOELEVATE ||
                "Resources to elevate your hosting"}
            </h1>
          </div>
          <div className={`${styles.content_resources}`}>
            {HostingDetails.map((_hostData, h) => (
              <div className={`${styles.content_list}`} key={`_hostData${h}`}>
                <a href="#">
                  <div
                    className={`d-flex align-items-center ${styles.list_hst}`}
                  >
                    <span className={`${styles.list_image} me-3`}>
                      <ImageComponent
                        src={_hostData.imageUrl}
                        alt="people"
                        width={72}
                        height={72}
                      />
                    </span>
                    <p className={`${styles.list_desc}`}>{_hostData.content}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
          <div className={`${styles.main_content}`}>
            <Link href="/">
              <h3>{i18.SETUPPAYOUTS?.GIVEUSFEEDBACK || "Give us feedback"}</h3>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
