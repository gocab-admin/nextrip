"use client";
import Link from "next/link";

import { usePageContext } from "@/components/Providers/PageContext";
// import { Starlogo } from '../global/svg';

import styles from "./notfound.module.css";

const handleLinkClick = () => {
  localStorage.setItem("usersType", "user");
};

const Page504 = () => {
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
          <h1 className={styles.head1}>{i18?.PAGES?.OOPS || "Oops!"}</h1>
          <h2 className={styles.head2}>An error occurred</h2>
          <h6 className={styles.head6}>
            {`${i18?.PAGES?.ERRORCODE || "Error code:"  } 504`}
          </h6>

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
            alt="504 Error Image"
            className={styles.image}
          />
        </div>
      </div>
    </>
  );
};

export default Page504;
