"use client";
import React from "react";
import Link from "next/link";

import { Starlogo, Website } from "@/app/global/svg";
import ImageComponent from "@/components/ImageComponent";
import isAuth from "@/components/isAuth";
import { usePageContext } from "@/components/Providers/PageContext";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { handleImageError } from "@/services/utils/utils";
import { APIURLS } from "@/services/config";


import styles from "./page.module.scss";

const Hostform = () => {
    const {i18, settings} = usePageContext();
    const {hostForm} = settings 
    const image1 = hostForm?.step1
    const image2 = hostForm?.step2
    const image3 = hostForm?.step3
    const imageCount = settings?.hiddenSettings?.listingImageCount;

  return (
    <>
      <div className={`${styles.host}`}>
        <header className={`${styles.navigation} border-bottom`}>
          <div
            className={`${styles.header_nav} d-flex align-items-center h-100`}
          >
            <Link href="/">
              <Starlogo
                height="50"
                color="red"
                responsive="d-lg-block d-none"
              />
            </Link>
            {/* <div className="ms-auto">
                            <div className="d-flex align-items-center">
                                <Link href="/propertyform" className={`${styles.btn_setup} btn`}>
                                    <span
                                        className={`${styles.flexit} d-flex align-items-center`}
                                    >
                                        Save & exit
                                    </span>
                                </Link>
                            </div>
                        </div> */}
          </div>
        </header>
        <section className={`${styles.hostform_section}`}>
          <div className={`${styles.form} `}>
            <div className={`${styles.formleft}`}>
              <h1 className="">
                {i18?.HOSTHOMEPAGE?.HOSTHOMEPAGE ||
                  "It’s easy to get started on"}{" "}
                <span>
                  <Website />
                </span>
              </h1>
            </div>
            <div className="p-md-2">
              <div className={`${styles.formright} mb-5`}>
                <div className={`${styles.formrightcon}`}>
                  <div className="d-flex">
                    <h5 className="me-2 text-sm">1</h5>
                    <div>
                      <h5 className="text-sm">
                        {i18?.PLACEINTRO?.PLACEINTRO ||
                          "Tell us about your place"}{" "}
                      </h5>
                      <p>
                        {" "}
                        {i18?.PLACEPARA?.PLACEPARA ||
                          "Share some basic info, such as where it is and how many guests can stay."}
                      </p>
                    </div>
                  </div>
                </div>

                <ImageComponent
                  src={image1}
                  width={100} 
                  height={100}
                  className={`${styles.images}`}
                  onError={handleImageError}
                  alt=""
                />
              </div>
              <div className={`${styles.formright} mb-5`}>
                <div className={`${styles.formrightcon}`}>
                  <div className="d-flex">
                    <h5 className="me-2 text-sm">2</h5>
                    <div>
                      <h5 className="text-sm">
                        {i18?.DISCOVERTITLE?.DISCOVERTITLE ||
                          "Make it stand out"}
                      </h5>
                      <p>
                        {i18?.DISCOVERPARA?.DISCOVERPARA.replace(
                          "%d",
                          imageCount || 1
                        ) ||
                          "Add 1 or more photos plus a title and description – we’ll help you out."}
                      </p>
                    </div>
                  </div>
                </div>
                <ImageComponent
                  src={image2}
                  width={100} 
                  height={100}
                  className={`${styles.images}`}
                  onError={handleImageError}
                  alt=""
                />
              </div>
              <div className={`${styles.formright} border-0 mb-5`}>
                <div className={`${styles.formrightcon}`}>
                  <div className="d-flex">
                    <h5 className="me-2 text-sm">3</h5>
                    <div>
                      <h5 className="text-sm">
                        {i18?.PUBLISHTITLE?.PUBLISHTITLE ||
                          "Finish up and publish"}{" "}
                      </h5>
                      <p>
                        {i18?.PUBLISHPARA?.PUBLISHPARA ||
                          "Set a starting price and publish your listing."}
                      </p>
                    </div>
                  </div>
                </div>
                <ImageComponent
                  src={image3}
                  width={100} 
                  height={100}
                  className={`${styles.images}`}
                  onError={handleImageError}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.getstarbtn}`}>
          <div className={`${styles.btn} d-flex justify-content-end`}>
            <Link href="/propertyform">
              <DynamicButtonComponent
                variant="contained"
                text={i18?.BUTTONS?.GETSTARTED || "Get Started"}
                padding="12px"
                borderRadius="8px"
              />
              {/* <button className={`${styles.getstart}`}> {i18?.BUTTONS?.GETSTARTED || "Get Started"}</button> */}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default isAuth(Hostform);
