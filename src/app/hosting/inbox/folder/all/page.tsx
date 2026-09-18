"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import ImageComponent from "@/components/ImageComponent";
import Sidenav from "@/app/hosting/inbox/sidenav";
import Header from "@/components/header";
import isAuth from "@/components/isAuth";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";
import Tick from "../../../../../../public/svg/ticks.svg";
import Filter from "../../../../../../public/svg/Filter.svg";
import Search from "../../../../../../public/svg/Search.svg";

const Allmessage = () => {
  const [shownav, setShowNav] = useState(false);
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
  return (
    <div className={`${styles.all_message}`}>
      <Header
        page="hide"
        center={
          responsiveView === "sm" || responsiveView === "xs"
            ? "center"
            : "inbox"
        }
        type="provider"
      />
      <div className={`${styles.slidemain} d-flex`}>
        {shownav && (
          <div className={`${styles.slidebackground} basis-1/5 p-3`}>
            <Sidenav />
          </div>
        )}
        <div
          className={`${styles.input} flex-grow-1 d-flex flex-column ml-12 mt-12 gap-y-8`}
        >
          <div className="d-flex align-items-center py-3 ps-5">
            <button
              className="bg-white border-0"
              onClick={() => setShowNav(!shownav)}
            >
              &#9776;
            </button>
            <h5 className="text-2xl font-normal ms-3 mb-0">All Messages</h5>
          </div>
          <div className="d-flex align-items-center justify-content-center pt-2">
            <div className="flex-grow-1 position-relative ps-5">
              <ImageComponent
                className={`${styles.absolute} position-absolute`}
                src={Search}
                alt="Search"
                onError={handleImageError}
              />
              <input
                className={`${styles.relative_input} w-100 rounded-pill py-2 px-5`}
                type="text"
                placeholder="Search inbox"
              />
            </div>
            <div className="py-3 px-5">
              <ImageComponent
                src={Filter}
                alt="filter"
                onError={handleImageError}
              />
            </div>
          </div>
          <div className="d-flex flex-column py-5 text-center">
            <ImageComponent
              className="align-self-center"
              src={Tick}
              alt="tick"
              onError={handleImageError}
            />
            <h6 className="py-2">No new messages</h6>
            <p className="">
              if you’re looking for a message, check the archive
            </p>
            <div>
              <Link href={"/hosting/inbox/folder/archive"}>
                <button className="text-white bg-black font-medium py-3 px-4 rounded-3 border-2 border-dark">
                  Go to archive
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default isAuth(Allmessage);
