"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
  FacebookIcon,
  GlobeIcon,
  InstaIcon,
  AppName,
  TwitterIcon,
} from "@/app/global/svg";
import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import Twitter from "../../public/svg/twitter.svg";
import styles from "./componentstyles.module.scss";
import ImageComponent from "./ImageComponent";
// import { fetchCmsListingData } from "@/redux/approvedListSlice";
import { fetchCmsListingData } from "@/redux/slice/footerSlice";
import { useSelector } from "react-redux";

function getCookie(cname: any) {
  let name = `${cname}=`;
  if (typeof window !== "undefined") {
    let ca = window?.document?.cookie?.split(";");
    for (let i = 0; i < ca?.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  }
  return "";
}

export default function Footer() {
  const { i18, currency, languages, settings }: any = usePageContext();
  const { getCmsList } = useSelector((state: any) => state.cmsSlice);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lang = getCookie("NEXT_LANG")
    ? getCookie("NEXT_LANG")
    : languages?.name;
  let currentURL = settings ? settings?.socialLinks : {};
  // if (typeof window !== 'undefined') {
  //     currentURL = window.location.href
  // }

  const handleLangModel = () => {
    dispatch(setModal("LanguageModal" as any));
  };

  const handleCurrenModel = () => {
    dispatch(setModal("CurrencyModal" as any));
  };

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    dispatch(fetchCmsListingData());
  }, []);

  const formatTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  console.log("getCmsList", getCmsList);
  return (
    <footer className={`${styles.footer} mt-5`}>
      {isClient && (
        <div className={`${styles.footer_container}`}>
          <div className={`${styles.footer_terms}`}>
            <section className="d-flex flex-column-reverse flex-xl-row flex-wrap justify-content-between">
              <div className={`${styles.footer_details}`}>
                <div className="copy-right">
                  © {currentYear} <AppName />, Inc.
                </div>
                <ul>
                  {getCmsList?.map((cmsList: any, index: number) => (
                    <li key={index}>
                      <span className="me-2">·</span>
                      <Link
                        href={`/${cmsList?.type}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="privacy-Terms"
                      >
                        {formatTitle(cmsList?.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${styles.footer_social}`}>
                <div className="d-flex align-items-center">
                  <div className={`${styles.social_item}`}>
                    <button onClick={handleLangModel}>
                      <span className="me-2">
                        <GlobeIcon
                          width="16px"
                          height="16px"
                          // stroke="var(--new-text-color-purplerooms)"
                          // style={{ display: "inline-block" , fill:'var(--new-text-color-purplerooms)' }}
                          fill="var(--footer-text-color)"
                          style={{ display: "inline-block" }}
                        />
                      </span>
                      <span className="privacy-Terms">{lang}</span>
                    </button>
                  </div>
                  <div className={`${styles.social_item}`}>
                    <button onClick={handleCurrenModel}>
                      <span className="me-2">{currency?.symbol}</span>
                      <span className="privacy-Terms">{currency?.code}</span>
                    </button>
                  </div>
                  <div className={`${styles.social_item}`}>
                    <ul
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "0px",
                      }}
                    >
                      <li
                        onClick={() =>
                          window.open(currentURL?.facebook, "_blank")
                        }
                        role="button"
                        className="cursor-pointer"
                      >
                        <FacebookIcon
                          width="18px"
                          height="18px"
                          // fill="var(--new-text-color-purplerooms)"
                          // style={{ display: "inline-block",fill:'var(--btn-bg-color)' }}
                          fill="var(--footer-text-color)"
                          style={{ display: "inline-block" }}
                        />
                      </li>

                      <li
                        onClick={() =>
                          window.open(currentURL?.twitter, "_blank")
                        }
                        role="button"
                        className="cursor-pointer"
                      >
                        <TwitterIcon
                          width="18px"
                          height="18px"
                          fill="var(--footer-text-color)"
                          style={{ display: "inline-block" }}
                          onError={handleImageError}
                        />
                        {/* <TwitterIcon
                          width="16px"
                          height="16px"
                          //  fill="var(--new-text-color-purplerooms)"
                          //  style={{ display: "inline-block",fill:'var(--btn-bg-color)' }}
                          fill="var(--footer-text-color)"
                          style={{ display: "inline-block" }}
                        /> */}
                      </li>

                      <li
                        onClick={() =>
                          window.open(currentURL.instagram, "_blank")
                        }
                        role="button"
                        className="cursor-pointer"
                      >
                        <InstaIcon
                          width="18px"
                          height="18px"
                          fill="var(--footer-text-color)"
                          style={{ display: "inline-block" }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </footer>
  );
}
