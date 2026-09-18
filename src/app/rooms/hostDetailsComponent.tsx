"use client";
import React, { useState, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";
dayjs.extend(relativeTime);

import { RatingIcon, Website } from "@/app/global/svg";
import APICONSTANT, { APIURLS } from "@/services/config";
import { getApiMethod } from "@/services/global";
import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";

import "../../components/header.scss";
import styles from "./components.module.scss";

const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));

const HostDetails = ({ ids, cateId, i18 }: any) => {
  const Id = ids || null;
  const catid = cateId || null;
  const router = useRouter();

  const switchTranslation = (data: any) => {
    switch (data) {
      case "months":
        return i18?.DATES?.MONTHSON || "months on";
      case "days":
        return i18?.DATES?.DAYSON || "days on";
      case "years":
        return i18?.DATES?.YEARSON || "years on";
      case "hours":
        return i18?.DATES?.HOURSON || "hours on";
      case "minutes":
        return i18?.DATES?.MINUTESON || "minutes on";
      default:
        return data;
    }
  };
  // const ids = searchParams.get("id");
  const item = useSelector((state: any) => state?.listingData);
  const data = item ? item.ListingData.providerData : null;
  let Date = "";
  if (data?.verifiedDate){
    Date = dayjs(data?.verifiedDate).toNow(true);
    Date = Date?.startsWith('a ')?Date.replace('a ', '1 '):Date;
  } 
    
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params: any = new URLSearchParams(ids);
      params.set(name, value);
      return params.toString();
    },
    [ids]
  );
  const [contacthost, setContacthost] = useState<any>({});
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
          `${APICONSTANT.chatinfo 
          }?senderId=${UserID}&receiverId=${item.ListingData.providerData._id}&adsId=${Id}&catId=${catid}`;
        const res = await getApiMethod(url);
        setContacthost(res?.data);
        if (res.code === 200) {
          const chatid = res?.data._id;
          console.log("chatid",chatid)
          router.push(`/guest/inbox?id=${chatid}`);
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
      <div className={`py-3 meet-host`}>
        <h5>{i18?.ROOMPAGE?.MEETYOURHOST || "Meet your host"}</h5>
        <div className={`${styles.meet_host}`}>
          <div className="">
            <div className={`${styles.host_info} p-3`}>
              <Link
                href={`/profiles/host?id=${item?.ListingData?.providerData?._id}&listId=${Id}`}
              >
                <div className={`${styles.info_section}`}>
                  <div className={`me-3`}>
                    {data?.profileImage ? (
                      <ImageComponent
                        src={
                          data.profileImage
                        }
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
                  <div>
                    <div>
                      <h5 className="mb-0 text-black">
                        {item.ListingData.totalReviewCount}
                      </h5>
                      <p className="text-black">
                        {i18?.ROOMPAGE?.REVIEWS || "Reviews"}
                      </p>
                    </div>
                    <div>
                      <h5 className="mb-0 d-flex align-items-center text-black">
                        {item.ListingData.totalRatingCount}
                        <span className="ms-2 mb-2">
                          <RatingIcon
                            width="15"
                            height="15"
                            fill="currentColor"
                          />
                        </span>
                      </h5>
                      <p className="text-black">
                        {i18?.ROOMPAGE?.RATING || "rating"}
                      </p>
                    </div>
                    <div>
                      <h5 className="mb-0 text-black">{Date?.split(" ")[0]}</h5>
                      <p className="text-black">
                        {switchTranslation(Date?.split(" ")[1])} {i18?.PRODUCT?.HOSTING || 'hosting'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className={`${styles.profile} text-center pt-3`}>
              {/* <p>Identity verified</p> */}

              {/* {useridlocal === listData._id ? ( */}
              <>
                {item.ListingData.isBooking ? (
                  <></>
                ) : (
                  <div className={`py-2`}>
                    <DynamicButtonComponent
                      variant="outlined"
                      onClick={() => Contacthostapi()}
                      // className={`${styles.btnstyle}`}
                      text={i18?.ROOMPAGE?.CONTACTHOST || "contact host"}
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
      </div>
    </>
  );
};

export default HostDetails;
