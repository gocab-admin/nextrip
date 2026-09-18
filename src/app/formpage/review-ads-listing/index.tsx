"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from 'react'
import styles from "./page.module.scss";
import { usePageContext } from '@/components/Providers/PageContext';
import { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";
import { useAppSelector } from "@/redux/hooks";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import StarIcon from "@mui/icons-material/Star";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { userSelector } from "@/redux/slice/user/userSlice";
import CustomModal from "@/components/modal";
import { getImageUrl } from "@/components/ImageComponent";
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
const DefaultprofileImage = require("@/app/images/defaultProfile.png");

interface Props {
  data: any
}

function ReviewAdsListing({data}:Props) {
    const { i18 } = usePageContext();
    const { CurrencyList } = useAppSelector(currencySelector);
    const { userInfo } = useAppSelector(userSelector);
    const [openModal, setOpenModal] = React.useState(false);
    const {
        imgFiles,
        name,
        price,
        adult,
        children,
        address,
        bedRoomCount,
        city,
        zipcode,
        country
      } = data;

      const handleOpenModal = () => {
        setOpenModal(true);
      };
      const handleCloseModal = () => {
        setOpenModal(false);
      };

    return (<>
        <section className={`${styles.host}`}>
          <div className={`${styles.step16}`}>
            <div className={`${styles.checkbox} h-100 col-md-7 mt-3 checkbox`}>
              <h1>{i18?.REVIEWLIST?.TITLE || "Review your listing"}</h1>
              <p>
                {i18?.REVIEWLIST?.SUBTITLE ||
                  "Here's what we'll show to guests. Make sure everything looks good."}
              </p>
              <div className={`${styles.review_section} mb-3`}>
                <div className={`${styles.imageContainer}`}>
                  {imgFiles &&
                    imgFiles?.map((file: any, f: number) =>
                      f == 0 ? (
                        <img
                          key={f}
                          src={getImageUrl(file.imagePath)}
                          alt="Image Alt Text"
                          className={`${styles.image}`}
                          onClick={handleOpenModal}
                          onError={handleImageError}
                        />
                      ) : null
                    )}
                  <div className={`${styles.bottom}`}>
                    <div className={`${styles.left}`}>
                      <p>{name}</p>
                      <p>
                        <b>
                          {CurrencyList.currency}
                          {price}
                        </b>
                      </p>
                    </div>
                    <div className={`${styles.right}`}>
                      <p>
                        {" "}
                        {i18?.REVIEWLIST?.NEW || "New"}{" "}
                        <StarIcon sx={{ wdith: "30px", height: "30px" }} />{" "}
                      </p>
                    </div>
                  </div>
                  <div onClick={handleOpenModal} className={`${styles.btn}`}>
                    <button style={{ color: "var(--text-color)" }}>
                      {i18?.REVIEWLIST?.SHOWPREVIEW || "Show Preview"}
                    </button>
                  </div>
                </div>
                <div className="mt-5 what-next">
                  <h4 className="mb-4">
                    {i18?.REVIEWLIST?.WHATNEXT || "What's next?"}
                  </h4>
                  <div className="d-flex">
                    <EventAvailableIcon className="me-3" />
                    <div className="">
                      <h6>
                        {i18?.REVIEWLIST?.CONFIRMDETAILS ||
                          "Confirm a few details and publish"}
                      </h6>
                      <p>
                        {i18?.REVIEWLIST?.PARA ||
                          "We’ll let you know if you need to verify your identity or register with the local government."}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <StickyNote2OutlinedIcon className="me-3" />
                    <div className="">
                      <h6>
                        {i18?.REVIEWLIST?.CONFIRMDETAILS ||
                          "Confirm a few details and publish"}
                      </h6>
                      <p>
                        {i18?.REVIEWLIST?.PARA ||
                          "We’ll let you know if you need to verify your identity or register with the local government."}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <EditOutlinedIcon className="me-3" />
                    <div className="">
                      <h6>
                        {i18?.REVIEWLIST?.CONFIRMDETAILS ||
                          "Confirm a few details and publish"}
                      </h6>
                      <p>
                        {i18?.REVIEWLIST?.PARA ||
                          "We’ll let you know if you need to verify your identity or register with the local government."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  </section>
  <CustomModal
        open={openModal}
        onClose={handleCloseModal}
        title={i18?.WISHLIAT?.FULLPREVIEW || "Full preview"}
      >
        <div className={`${styles.modal} p-3`}>
          <div className={`${styles.body}`}>
            <div className={`${styles.left}`}>
              {imgFiles &&
                imgFiles?.map((file: any, f: number) =>
                  f == 0 ? (
                    <img
                      key={f}
                      src={getImageUrl(file.imagePath)}
                      alt="Image Alt Text"
                      className={`${styles.image}`}
                      onError={handleImageError}
                    />
                  ) : null
                )}
            </div>
            <div className={`${styles.right}`}>
              <div className={`${styles.content1}`}>
                <div className={`${styles.content}`}>
                  <h4>{userInfo?.firstname || ""}</h4>
                  <p>
                    {name}
                  </p>
                </div>
                <div className={`${styles.contentProfile}`}>
                  {userInfo?.profileImage && userInfo?.profileImage ? (
                    <ImageComponent
                      className={`${styles.Image}`}
                      width={50}
                      height={50}
                     src={ userInfo?.profileImage
                      }
                      alt="profile"
                      onError={handleImageError}
                    />
                  ) : (
                    <ImageComponent
                      className={`${styles.Image}`}
                      width={50}
                      height={50}
                      src={DefaultprofileImage}
                      alt="profile"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
              <div className={`${styles.content2}`}>
                <p>
                  {i18?.ROOMPAGE?.YOUWILLHAVEAGREAT ||
                    "You'll have a greate time at this comfortable palce to stay"}
                </p>
              </div>
              {/* <div>
                                <p>amenities</p>
                                {
                                    ListInfo.host_offer.slice(0 , displayCount).map((item: any) => {
                                        return (
                                            <p key={item._id} className="">
                                                {item.name}
                                            </p>
                                        )
                                    })
                                }
                                {ListInfo.host_offer > 5 && (
                                    showAll ? (
                                        <button onClick={() => showMore('less')}>Show less</button>
                                    ) : (
                                        <button onClick={() => showMore('more')}>Show more</button>
                                    )
                                )}
                            </div> */}
              <div className={`${styles.content4}`}>
                <div className={`${styles.title} checkbox`}>
                  <h6>{i18?.TRIPS?.LOCATION || "Location"}</h6>
                </div>
                <p>
                  {/* {houseNo !== "" && <span>{houseNo},</span>}{" "} */}
                  {address !== "" && <span>{address},</span>}{" "}
                  {/* {area !== "" && <span>{area},</span>}{" "} */}
                  {city !== "" && <span>{city},</span>} <span>{zipcode}</span> <span>{country}</span>
                </p>
                <span>
                  {i18?.ROOMPAGE?.WEWILLSHAREYOURADDRESS ||
                    "we'll share your address only with guest who are booked as outlined in our Privacy policy"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
  </>)
}

export default ReviewAdsListing
