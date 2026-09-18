"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
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
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
const DefaultprofileImage = require("@/app/images/defaultProfile.png");
import { GenerateUrl } from "@/services/utils/helperURL";

interface Props {
  data: any;
}

function ReviewPropertyListing({ data }: Props) {
  const { i18 } = usePageContext();
  const { CurrencyList } = useAppSelector(currencySelector);
  const { userInfo } = useAppSelector(userSelector);
  const [openModal, setOpenModal] = React.useState(false);
  const {
    imgFiles,
    propertyName,
    perDay,
    perHour,
    adult,
    children,
    address,
    bedRoomCount,
    city,
    zipcode,
    country,
  } = data;

  const handleOpenModal = () => {
    if (data && data.propertyName && data._id) {
    setOpenModal(true);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  console.log("data", data);
  return (
    <>
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
                      <ImageComponent
                        key={f}
                        src={file.imagePath}
                        alt="Image Alt Text"
                        className={`${styles.image}`}
                        onClick={handleOpenModal}
                        onError={handleImageError}
                        width={100}
                        height={100}
                      />
                    ) : null
                  )}
                <div className={`${styles.bottom}`}>
                  <div className={`${styles.left}`}>
                    <p>{propertyName}</p>
                    <div className="d-flex align-items-center gap-1">
                      {perHour > 0 && (
                        <p style={{ whiteSpace: "nowrap" }}>
                          <b>
                            {CurrencyList.currency}
                            {perHour}
                          </b>
                          &nbsp; {i18?.BOOKINGPAGE?.PERHOUR || "per hour"}{" "}
                        </p>
                      )}
                      {perDay > 0 && perHour > 0 && " | "}
                      {perDay > 0 && (
                        <p style={{ whiteSpace: "nowrap" }}>
                          <b>
                            {CurrencyList.currency}
                            {perDay}
                          </b>
                          &nbsp; {i18?.BOOKINGPAGE?.PERDAY || "per day"}
                        </p>
                      )}
                    </div>
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
                {/* <div className="d-flex">
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
                  </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CustomModal
        open={openModal}
        maxWidth={"100%"}
        fullWidth={true}
        onClose={handleCloseModal}
        sx={{
          zIndex: "9999",
          "& .MuiDialog-paper": {
            height: "100%",
          },
        }}
        title={i18?.WISHLIAT?.FULLPREVIEW || "Full preview"}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {data && data.propertyName && data._id ? (
            <iframe
              src={
                GenerateUrl(
                  "/c/",
                  data.propertyCategoryName,
                  data.propertyName,
                  data._id
                ) + "?viewBy=admin"
              }
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                userSelect: "none",
                // pointerEvents: 'none',
              }}
              title="Preview"
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* <div className={`${styles.modal} p-3`}>
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
                    {adult + children !== 0 && (
                      <span>
                        {adult + children} {i18?.ROOMPAGE?.GUEST || "guest"}&#183;
                      </span>
                    )}{" "}
                    {bedRoomCount !== 0 && (
                      <span>
                        {bedRoomCount} {i18?.ROOMPAGE?.BEDROOM || "bedroom"}
                      </span>
                    )}
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
              <div className={`${styles.content4}`}>
                <div className={`${styles.title} checkbox`}>
                  <h6>{i18?.TRIPS?.LOCATION || "Location"}</h6>
                </div>
                <p>
                  {address !== "" && <span>{address},</span>}{" "}
                  {city !== "" && <span>{city},</span>} <span>{zipcode}</span> <span>{country}</span>
                </p>
                <span>
                  {i18?.ROOMPAGE?.WEWILLSHAREYOURADDRESS ||
                    "we'll share your address only with guest who are booked as outlined in our Privacy policy"}
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </CustomModal>
    </>
  );
}

export default ReviewPropertyListing;
