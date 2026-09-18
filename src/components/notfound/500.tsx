"use client";
import Link from "next/link";

import { usePageContext } from "@/components/Providers/PageContext";
// import { Starlogo } from '../global/svg';

import styles from "./notfound.module.css";

const handleLinkClick = () => {
  localStorage.setItem("usersType", "user");
};

const Page500 = () => {
  const { i18 } = usePageContext();
  return (
    <>
      <div className={`${styles.logosec}`}>
        <div className="d-flex justify-content-start">
          <div>
            {/* <Link href='/'>
              <Starlogo />
            </Link> */}
          </div>
        </div>
      </div>
      <div className={`${styles.body}`}>
        <div className={`${styles.grid1}`}>
          <h2 className={styles.head2}>500 - Internal Server Error</h2>
          <h3 className={styles.head3}>
            {i18?.PAGES?.SERVERERROR || "Something went wrong on our end."}
          </h3>
          <h3 className={styles.head3}> Please try again later.</h3>
          <h6>{`${i18?.PAGES?.ERRORCODE || "Error code:"} 500`}</h6>

          <ul className="list-unstyled">
            <li className={styles.list}>
              <Link href="/" onClick={handleLinkClick}>
                {i18?.PAGES?.HOME || "Home"}
              </Link>
            </li>
            <li className={styles.list}>
              <Link href="/" onClick={handleLinkClick}>
                {i18?.HEADER?.SEARCH || "Search"}
              </Link>
            </li>
            {/* <li className={styles.list}>
              <Link href="/helpCenter/">{i18?.PAGES?.HELP || "Help"}</Link>
            </li> */}
          </ul>
        </div>
        <div className={`${styles.grid2}`}>
          <img
            src={`/images/404_image.gif`}
            alt="500 Error Image"
            className={styles.image}
          />
        </div>
      </div>
    </>
  );
};

export default Page500;
