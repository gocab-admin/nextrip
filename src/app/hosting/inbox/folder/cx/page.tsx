"use client";
import React, { useState } from "react";
import Link from "next/link";

import ImageComponent from "@/components/ImageComponent";
import Header from "@/components/header";
import Sidenav from "@/app/hosting/inbox/sidenav";
import isAuth from "@/components/isAuth";
import { Website } from "@/app/global/svg";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";
import Tick from "../../../../../../public/svg/ticks.svg";
import Filter from "../../../../../../public/svg/Filter.svg";
import Search from "../../../../../../public/svg/Search.svg";

const Support = () => {
  const [shownav, setShowNav] = useState(true);

  return (
    <div className={`${styles.all_support}`}>
      <Header page="hide" center="inbox" type="provider" />
      <div className={`${styles.slidemain} d-flex`}>
        {shownav && (
          <div className={`${styles.slidebackground} basis-1/5 p-3`}>
            <Sidenav />
          </div>
        )}
        <div
          className={`${styles.support_input} flex-grow-1 d-flex flex-column ml-12 mt-12 gap-y-8`}
        >
          <div className="d-flex align-items-center py-3 px-4">
            <button
              className="bg-white border-0"
              onClick={() => setShowNav(!shownav)}
            >
              &#9776;
            </button>
            <h5 className="text-2xl font-normal ms-3 mb-0">
              <Website /> Support
            </h5>
          </div>
          <div className="d-flex align-items-center justify-content-center pt-2 me-5">
            <div className="flex-grow-1 position-relative ps-5">
              <ImageComponent
                className={`${styles.support_absolute} position-absolute`}
                src={Search}
                alt="Search"
                onError={handleImageError}
              />
              <input
                className={`${styles.support_relative_input} w-100 rounded-pill py-2 px-5`}
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
            <h6 className="py-2">No messages</h6>
            <p className="">
              You don’t have any messages in the <Website /> Support folder.
            </p>
            <div>
              <Link href={"/hosting/inbox/folder/all"}>
                <button className="text-white bg-black font-medium py-3 px-4 rounded-3 border-2 border-black">
                  Go to all messages
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default isAuth(Support);
