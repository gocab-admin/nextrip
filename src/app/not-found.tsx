"use client";
import React from "react";
import Link from "next/link";

import { usePageContext } from "@/components/Providers/PageContext";
import styles from "@/components/notfound/notfound.module.css";

import { Starlogo } from "./global/svg";

const handleLinkClick = () => {
  localStorage.setItem("usersType", "user");
};

const RedirectPage = () => {
  const { i18 } = usePageContext();
  return (
    <>
      <div className={`${styles.logosec}`}>
        <div className="d-flex justify-content-start">
          <div>
            <Link href="/" onClick={handleLinkClick}>
              <Starlogo />
            </Link>
          </div>
        </div>
      </div>
      <div className={`${styles.body}`}>
        <div className={`${styles.grid1}`}>
          <h1>{i18?.PAGES?.OOPS || "Oops!"}</h1>
          <h2>
            {i18?.PAGES?.WECANNOTSEEM ||
              "We can't seem to find the page you're looking for."}
          </h2>
          <h6>{`${i18?.PAGES?.ERRORCODE || "Error code:"  } ` + `404`}</h6>

          <ul className="list-unstyled">
            <li>
              <a href="/" onClick={handleLinkClick}>
                {i18?.PAGES?.HOME || "Home"}
              </a>
            </li>
            <li>
              <a href="/" onClick={handleLinkClick}>
                {i18?.HEADER?.SEARCH || "Search"}
              </a>
            </li>
            {/* <li>
              <a href="helpCenter/">{i18?.PAGES?.HELP || "Help"}</a>
            </li> */}
            {/* <li><a href="#">Traveling on AirStar - Vacation Rental Script</a></li>
                        <li><a href="#">Hosting on AirStar - Vacation Rental Script</a></li>
                        <li><a href="#">Trust &amp; Safety</a></li> */}
          </ul>
        </div>
        <div className={`${styles.grid2}`}>
          <img
            src={`/images/404_image.gif`}
            alt="Girl has dropped her ice cream."
          />
        </div>
      </div>
    </>
  );
};

export default RedirectPage;
