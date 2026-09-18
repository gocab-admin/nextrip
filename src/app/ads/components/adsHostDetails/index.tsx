"use client";
import React, { useState, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";
dayjs.extend(relativeTime);
import { RatingIcon } from "@/app/global/svg";

import APICONSTANT, { APIURLS } from "@/services/config";
import { getApiMethod } from "@/services/global";
import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";

import "@/components/header.scss";
import styles from "./adsHostDetails.module.scss";

const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
const ReportHost = dynamic(() => import("./reportHost"));

const HostDetails = ({ ids, cateId, price, i18, responsiveView }: any) => {
  const Id = ids || null;
  const catid = cateId || null;
  const router = useRouter();
  //   const searchParams: any = useSearchParams();

  // const ids = searchParams.get("id");
  const item = useSelector((state: any) => state.adsData);

  const data = item ? item.AdsData
    .providerData : null;
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params: any = new URLSearchParams(ids);
      params.set(name, value);
      return params.toString();
    },
    [ids]
  );
  const [contacthost, setContacthost] = useState<any>({});
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  const Contacthostapi = async () => {
    try {
      localStorage.setItem("usersType", "user");
      const auth =
        typeof window !== "undefined" && localStorage?.getItem("appToken")
          ? true
          : false;
      const UserID =
        typeof window !== "undefined" ? localStorage.getItem("appUserId") : "";
      if (auth && UserID) {
        const url: any =
          `${APICONSTANT.adschatinfo
          }?senderId=${UserID}&receiverId=${item.AdsData.providerData._id}&adsId=${Id}&catId=${catid}`;
        const res = await getApiMethod(url);
        setContacthost(res?.data);
        if (res.code === 200) {
          const chatid = res?.data._id;
          router.push(`/ads/guest/inbox` + `?${createQueryString("id", chatid)}`);
          // router.push({
          //   pathname: "/guest/inbox",
          //   query: { id:chatid },
          // } as any);
          // router.push("/guest/inbox")
        } else {
          console.log("Failed to contact host. Please try again.");
        }
      } else {
        dispatch(setModal("SignupModal" as any));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>

      {(responsiveView === "sm" || responsiveView === "xs") ? (
        <div className={`${styles.responsive_nav}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="review-title">
              <h5 className={`mb-0 me-1`}>
                {price}
              </h5>
              {/* <div className="d-flex">
                    <p className="me-1 d-flex">
                      <span className="me-2 mb-1">
                        <RatingIcon
                          width="15"
                          height="15"
                          fill="var(--footer-text-color)"
                        />
                      </span>
                      <p className="d-flex">
                        {propertyData.totalRatingCount !== 0
                          ? propertyData.totalRatingCount
                          : `${
                              i18?.ROOMPAGE?.NOREVIEWSYET || "no reviews yet"
                            }`}
                      </p>
                      <span className="ms-1">.</span>
                    </p>
                    {propertyData.totalReviewCount !== 0 && (
                      <div
                        className="me-1"
                        style={{ color: "var(--text-color)" }}
                      >
                        {propertyData.totalReviewCount}{" "}
                        {i18?.ROOMPAGE?.REVIEWS || "Reviews"}
                      </div>
                    )}
                  </div> */}

            </div>
            <div className="d-flex justify-between">
              <DynamicButtonComponent
                variant="outlined"
                // className={`${styles.button}`}
                onClick={Contacthostapi}
                text={i18?.ROOMPAGE?.CONTACTHOSTs || "Contact here"}
              />
              <DynamicButtonComponent
                variant="contained"
                onClick={handleClickOpen}
                className={styles?.REPORTHOSTBTN}
                text={i18?.ROOMPAGE?.REPORTHOST || "Report Host"}
              />
            </div>
          </div>
        </div>
      ) : <div className={`py-3 meet-host`}>
        <h5>{i18?.ROOMPAGE?.MEETYOURHOST || "Meet your host"}</h5>
        <div className={`${styles.meet_host}`}>
          <div className="">
            <div className={`${styles.host_info} p-3`}>
              <Link
                href={`/profiles/host?id=${item?.AdsData?.providerData?._id}&listId=${Id}`}
              >
                <div className={`${styles.info_section}`}>
                  <div className={`me-3`}>
                    {data?.profileImage ? (
                      <ImageComponent
                        src={data.profileImage}
                        altSrc={"/images/profil-pic-dummy.png"}
                        className={`${styles.imgradius}`}
                        width={110}
                        height={110}
                        alt="profileImage"
                      />
                    ) : (
                      <FaUserCircle className={`${styles.user}`} />
                    )}
                    <h2 className="mb-0 text-black text-center">
                      {data?.firstname}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className={`${styles.profile} text-center pt-3`}>
              {/* <p>Identity verified</p> */}

              {/* {useridlocal === listData._id ? ( */}
              <>
                {item.AdsData.isBooking ? (
                  <></>
                ) : (
                  <div className='py-2'>
                    <DynamicButtonComponent
                      variant="outlined"
                      onClick={() => Contacthostapi()}
                      // className={`${styles.btnstyle}`}
                      text={i18?.ROOMPAGE?.CONTACTHOSTs || "Contact here"}
                    />
                    <DynamicButtonComponent
                      variant="contained"
                      onClick={handleClickOpen}
                      className={styles?.REPORTHOSTBTN}
                      text={i18?.ROOMPAGE?.REPORTHOST || "Report Host"}
                    />
                  </div>
                )}
              </>

              {/* <div className='my-3'>
                                <div className={`${styles.divider}`}></div>
                            </div> */}
              {/* <p>
                                To protect your payment, never transfer money or
                                communicate outside of the <Website/> website or app.
                            </p> */}
            </div>
          </div>
        </div>
      </div>}
      <ReportHost open={open} onClose={handleClose} hostData={data} />
    </>
  );
};

export default HostDetails;
