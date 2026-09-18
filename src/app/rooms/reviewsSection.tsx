"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import TablePagination from "@mui/material/TablePagination";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { getApiMethod } from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import ImageComponent from "@/components/ImageComponent";
import {
  RatingIcon,
  Chat,
  Cleaning,
  Tag,
  Key,
  Check,
  Location
} from "@/app/global/svg";
import { CustomSearchBar } from "@/components/helper";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import "../../components/header.scss";
import styles from "./components.module.scss";

const CustomModal = dynamic(() => import("@/components/modal"));

const ReviewSection = (ids: any) => {
  const { i18 } = usePageContext();
  const Id = ids ? ids.ids : null;
  const items = useSelector((state: any) => state?.listingData);
  const providerdata = items ? items.ListingData.providerData : null;
  const [reviewData, setReviewData] = useState([]);
  const [reviewDataSearch, setReviewDataSearch] = useState([]);
  const [openReview, setOpenReview] = useState(false);
  const [searchReview, setSearchReview] = useState<any>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<any>(0);
  const [showFullReviewIndex, setShowFullReviewIndex] = useState(null);

  const toggleReviewVisibility = (index: any) => {
    setShowFullReviewIndex(index === showFullReviewIndex ? null : index);
  };

  // const fetchSearchReview = async () => {
  //   try {
  //     const response = await getApiMethod(
  //       `${APICONSTANT.reviewRating 
  //         }/${Id}?_page=${page}&_limit=${rowsPerPage}&search=${searchReview}`
  //     );
  //     if (response.statusCode === 200) {
  //       setReviewDataSearch(response.data.reviewAndRating);
  //       setTotal(response.data.totalCount ? response.data.totalCount : 0);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchReview = async () => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.reviewRating 
          }/${Id}?_page=${page}&_limit=${rowsPerPage}&search=${searchReview}`
      );
      if (response.statusCode === 200) {
        if(!searchReview){
          setReviewData(response.data.reviewAndRating);
        }
        setReviewDataSearch(response.data.reviewAndRating);
        setTotal(response.data.totalCount ? response.data.totalCount : 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  
  useEffect(() => {
    fetchReview();
  }, [searchReview, page, rowsPerPage]);
  // useEffect(() => {
  //   fetchSearchReview();
  // }, [searchReview, page, rowsPerPage]);
  return (
    <>
      {reviewData.length > 0 && (
        <>
          <h3 className="mb-3">
            <b>{i18?.REVIEWS?.REVIEWS || "Reviews"}</b>
          </h3>
          <div className={`${styles.comments}`}>
            {reviewData &&
              reviewData
                .slice()
                ?.slice(0, 4)
                ?.map((item: any, index: any) => (
                  <div key={index}>
                    <div>
                      <div className="d-flex align-items-center">
                        <ImageComponent
                          src={
                            item.userProfileImage
                          }
                          className={`${styles.imgradius}`}
                          width={40}
                          height={40}
                          alt=""
                          onError={handleImageError}
                        />
                        <div className=" ms-2">
                          <h6 className="m-0">
                            <b
                              style={{
                                fontSize: "var(--trips-notes-size)",
                                fontFamily: "var(--font-family-base)",
                                color: "var(--text-color)"
                              }}
                            >
                              {item.userFirstname} {item.userLastname}
                            </b>
                          </h6>
                          <span
                            style={{
                              color: "var(--font-color-review)",
                              fontFamily: "var(--font-family-base)"
                            }}
                          >
                            {/* {dayjs(
                                                            item.reviewRating.dateOfReview.split("T")[0]
                                                        ).toNow(true)}{" "}
                                                        {i18?.REVIEWS?.AGO || "ago"} */}
                            {dayjs()
                              .to(dayjs(item.reviewRating.dateOfReview))
                              .replace(" ago", " ")}{" "}
                            {i18?.REVIEWS?.AGO || "ago"}
                          </span>
                        </div>
                      </div>
                      <div className="">
                        <div className="pt-3">
                          {showFullReviewIndex === index ? (
                            <p>
                              <b
                                style={{
                                  fontFamily: "var(--font-family-base)"
                                }}
                              >
                                {item.reviewRating.review}
                              </b>
                            </p>
                          ) : (
                            <p>
                              <b>
                                {item.reviewRating.review.split(". ")[0]}
                              </b>
                            </p>
                          )}

                          {item.reviewRating.review.split(". ").length > 1 && (
                            <p
                              onClick={() => toggleReviewVisibility(index)}
                              style={{
                                color: "#444444",
                                cursor: "pointer"
                              }}
                            >
                              {showFullReviewIndex === index
                                ? "--Show Less--"
                                : "--Show More--"}
                            </p>
                          )}
                        </div>
                        {item.reviewRating.reply.length > 0 &&
                          item.reviewRating.reply.map((data: any, id: any) => (
                            <div key={id}>
                              <div className="d-flex align-items-center ms-5 mt-4">
                                {providerdata.profileImage ? (
                                  <ImageComponent
                                    src={
                                          providerdata.profileImage
                                    }
                                    className={`${styles.imgradius}`}
                                    width={40}
                                    height={40}
                                    alt=""
                                    onError={handleImageError}
                                  />
                                ) : (
                                  <FaUserCircle
                                    style={{ width: "40px", height: "40px" }}
                                  />
                                )}

                                <div className=" ms-2">
                                  <h6 className="m-0">
                                    {i18?.REVIEWS?.RESPONSEFROM ||
                                      "Response from"}{" "}
                                    <b>{providerdata.firstname} {providerdata.lastname}</b>
                                  </h6>
                                  <span style={{ color: "#444444" }}>
                                    {dayjs(
                                      data.dateOfReview.split("T")[0]
                                    ).toNow(true)}{" "}
                                    {i18?.REVIEWS?.AGO || "ago"}
                                  </span>
                                </div>
                              </div>
                              <p className=" ms-5">
                                <b>{data.response}</b>{" "}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          {reviewData?.length >= 4 && (
            <button
              className={`${styles.buttn} mt-3`}
              onClick={() => setOpenReview(true)}
            >
              {i18?.ROOMPAGE?.SHOWALL || "Show all"}{" "}
              {items?.ListingData?.totalReviewCount}{" "}
              {i18?.REVIEWS?.REVIEWS || "Reviews"}
            </button>
          )}
        </>
      )}
      <CustomModal
        open={openReview}
        onClose={() => setOpenReview(false)}
        title={i18?.REVIEWS?.REVIEWS || "Reviews"}
      >
        <div className={`${styles.modal} p-3`}>
          <div className={`${styles.modalContent} `}>
            <div className={`${styles.modalLeft}`}>
              <div className={`${styles.modalLftCon}`}>
                <span className="mb-3 me-2">
                  <RatingIcon width="30" height="30" fill="currentColor" />
                </span>
                <h4>{items?.ListingData?.totalRatingCount}</h4>
              </div>
              {items?.ListingData?.reviewRating && (
                <div className={`${styles.flex}`}>
                  <div className={`${styles.row}`}>
                    <div>
                      <div>
                        <h6>{i18?.TRIPS?.CLEANIESS || "Cleaniness"}</h6>
                      </div>
                      <div className="d-flex gap-5">
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
                            items?.ListingData?.reviewRating[0]?.rating
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
                      <div className="d-flex gap-5">
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
                          {items?.ListingData?.reviewRating[0]?.rating.Accuracy}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.row}`}>
                    <div>
                      <div>
                        <h6>{i18?.ROOMPAGE?.CHECKINN || "Check-in"}</h6>
                      </div>
                      <div className="d-flex gap-5">
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
                          {items?.ListingData?.reviewRating[0]?.rating.Check_in}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.row}`}>
                    <div>
                      <div>
                        <h6>{i18?.TRIPS?.COMMUNICATION || "Communication"}</h6>
                      </div>
                      <div className="d-flex gap-5">
                        <Chat
                          width="34"
                          height="34"
                          style={{
                            display: "block",
                            height: "30px",
                            width: "30px",
                            color: "#272829",
                            position: "relative",
                            bottom: "10px"
                          }}
                        />

                        <h3>
                          {
                            items?.ListingData?.reviewRating[0]?.rating
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
                      <div className="d-flex gap-5">
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
                          {items?.ListingData?.reviewRating[0]?.rating.Location}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.row}`}>
                    <div>
                      <div>
                        <h6>{i18?.TRIPS?.VALUE || "Value"}</h6>
                      </div>
                      <div className="d-flex gap-5">
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
                          {items?.ListingData?.reviewRating[0]?.rating.Value}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={`${styles.modalRight}`}>
              <div className={`${styles.rightHeader}`}>
                <h5 className="mb-3">
                  {" "}
                  {items?.ListingData?.totalReviewCount}{" "}
                  {i18?.REVIEWS?.REVIEWS || "Reviews"}
                </h5>
                <CustomSearchBar
                  onchange={(e: any) => setSearchReview(e.target.value)}
                />
              </div>

              <>
                {reviewDataSearch &&
                  reviewDataSearch.map((item: any, index: any) => (
                    <div key={index} className="mt-4">
                      <div>
                        <div className="d-flex align-items-center">
                          <ImageComponent
                            src={
                             item.userProfileImage
                            }
                            className={`${styles.imgradius}`}
                            width={40}
                            height={40}
                            alt=""
                            onError={handleImageError}
                          />
                          <div className=" ms-2 post-review">
                            <h6 className="m-0">
                              <b>{item.userFirstname} {item.userLastname}</b>
                            </h6>
                            <span style={{ color: "#444" }}>
                              {dayjs(
                                item.reviewRating.dateOfReview.split("T")[0]
                              ).toNow(true)}{" "}
                              {i18?.REVIEWS?.AGO || "ago"}
                            </span>
                          </div>
                        </div>
                        <div className="">
                          <div className="pt-3">
                            <p style={{ color: "#6e6d6d" }}>
                              <b>{item.reviewRating.review}</b>
                            </p>
                          </div>
                          {item.reviewRating.reply.length > 0 &&
                            item.reviewRating.reply.map(
                              (data: any, review: any) => (
                                <div key={review}>
                                  <div className="d-flex align-items-center ms-5 mt-4">
                                    <ImageComponent
                                      src={
                                            providerdata.profileImage
                                      }
                                      className={`${styles.imgradius}`}
                                      width={40}
                                      height={40}
                                      alt=""
                                      onError={handleImageError}
                                    />
                                    <div className=" ms-2">
                                      <h6 className="m-0">
                                        {i18?.REVIEWS?.RESPONSEFROM ||
                                          "Response from"}{" "}
                                        <b>{providerdata.firstname} {providerdata.lastname}</b>
                                      </h6>
                                      <span style={{ color: "#444444" }}>
                                        {dayjs(
                                          data.dateOfReview.split("T")[0]
                                        ).toNow(true)}{" "}
                                        {i18?.REVIEWS?.AGO || "ago"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className=" ms-5">
                                    <p style={{ color: "#6e6d6d" }}>
                                      <b>{data.response}</b>
                                    </p>{" "}
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            </div>
          </div>
        </div>
        <div className={`${styles.pagination} border-top`}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </CustomModal>
    </>
  );
};

export default ReviewSection;
