"use client";
import React from "react";
import { useSelector } from "react-redux";

import {
  RatingIcon,
  Chat,
  Cleaning,
  Tag,
  Key,
  Check,
  Location
} from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";

import "../../components/header.scss";
import styles from "./components.module.scss";

const RatingsSection = () => {
  const { i18 } = usePageContext();
  const item = useSelector((state: any) => state?.listingData);
  
  return (
    <>
      {item?.ListingData?.totalRatingCount !== 0 && (
        <div className={`${styles.review} review py-4`}>
          <div className="my-3">
            <div className={`${styles.divider}`}></div>
          </div>
          <h2 className="d-flex align-items-center">
            <span className="mb-3 me-2">
              <RatingIcon width="30" height="30" fill="currentColor" />
            </span>
            {item?.ListingData?.totalRatingCount} ·{" "}
            {item?.ListingData?.totalReviewCount}{" "}
            {i18?.TRIPS?.REVIEW || "review"}
          </h2>
          <div className={`${styles.reviewFlex}`}>
            {item?.ListingData?.reviewRating && (
              <div className={`${styles.modalLeft}`}>
                {item?.ListingData?.reviewRating && (
                  <div className={`${styles.flex}`}>
                    <div className={`${styles.row}`}>
                      <div>
                        <div className="review-headings">
                          <h6>{i18?.TRIPS?.CLEANIESS || "Cleaniness"}</h6>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Cleaning
                            width="34"
                            height="34"
                            style={{
                              display: "block",
                              height: "10px",
                              width: "10px",
                              color: "#272829",
                              marginBottom: "25px"
                            }}
                          />

                          <h3>
                            {
                              item?.ListingData?.reviewRating[0]?.rating
                                .Cleanliness
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.row}`}>
                      <div>
                        <div>
                          <h6>{i18?.TRIPS?.ACCURACY || "Accuracy"}</h6>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Check
                            width="34"
                            height="34"
                            style={{
                              display: "block",
                              height: "30px",
                              width: "30px",
                              color: "#272829"
                            }}
                          />

                          <h3>
                            {
                              item?.ListingData?.reviewRating[0]?.rating
                                .Accuracy
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.row}`}>
                      <div>
                        <div>
                          <h6>{i18?.ROOMPAGE?.SECURITY || "Security"}</h6>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Key
                            width="34"
                            height="34"
                            style={{
                              display: "block",
                              height: "30px",
                              width: "30px",
                              color: "#272829"
                            }}
                          />

                          <h3>
                            {
                              item?.ListingData?.reviewRating[0]?.rating
                                .Check_in
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.row}`}>
                      <div>
                        <div>
                          <h6>
                            {i18?.TRIPS?.COMMUNICATION || "Communication"}
                          </h6>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Chat
                            width="34"
                            height="34"
                            style={{
                              display: "block",
                              height: "30px",
                              width: "30px",
                              color: "#272829",
                              position: "relative",
                              bottom: "10px",
                              zIndex: -10,
                              left: "-13px"
                            }}
                          />

                          <h3>
                            {
                              item?.ListingData?.reviewRating[0]?.rating
                                .Communication
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.row}`}>
                      <div>
                        <div>
                          <h6>{i18?.TRIPS?.LOCATION || "Location"}</h6>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Location
                            width="34"
                            height="34"
                            style={{
                              display: "block",
                              height: "30px",
                              width: "30px",
                              color: "#272829"
                            }}
                          />

                          <h3>
                            {
                              item?.ListingData?.reviewRating[0]?.rating
                                .Location
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.row}`}>
                      <div>
                        <div>
                          <h6>{i18?.TRIPS?.AMENITIES || "Amenities"}</h6>
                        </div>
                        <div className="d-flex justify-content-between">
                          <Tag
                            width="34"
                            height="34"
                            style={{
                              display: "block",
                              height: "30px",
                              width: "30px",
                              color: "#272829"
                            }}
                          />

                          <h3>
                            {item?.ListingData?.reviewRating[0]?.rating.Value}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="my-3">
            <div className={`${styles.divider}`}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingsSection;
