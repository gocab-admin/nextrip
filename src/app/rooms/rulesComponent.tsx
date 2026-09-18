"use client";
import React, { useState, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { APIURLS } from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./components.module.scss";

const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
const CustomModal = dynamic(() => import("@/components/modal"));

const RulesSection = (ids: any) => {
  const { i18 } = usePageContext();
  const item = useSelector((state: any) => state?.listingData);
  const data = item ? item.ListingData.providerData : null;
  const rules = item ? item?.ListingData?.attachmentData?.[0]?.rules : [];
  // const Dates = dayjs(data?.verifiedDate?.split("T")[0]).toNow(true);
  let Dates = "";
  if (data?.verifiedDate) {
    Dates = dayjs(data?.verifiedDate).toNow(true);
    Dates = Dates?.startsWith('a ')?Dates.replace('a ', '1 '):Dates;
  } 
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params: any = new URLSearchParams(ids);
      params.set(name, value);
      return params.toString();
    },
    [ids]
  );

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="d-flex align-items-center ">
        {data && data?.profileImage ? (
          <ImageComponent
            src={
              data.profileImage
            }
            // altSrc={'/images/profil-pic-dummy.png'}
            className={`${styles.imgradius}`}
            width={48}
            height={48}
            alt="profileImage"
            priority
          />
        ) : (
          <FaUserCircle className={`${styles.user}`} />
        )}
        <div className="ms-3 hosted-by">
          <h5 className="m-0">
            {i18?.PRODUCT?.HOSTEDBY || "Hosted by"} {data?.firstname}
          </h5>
          <p>
            {Dates?.split(" ")[0]} {switchTranslation(Dates?.split(" ")[1])}{" "}
            {i18?.PRODUCT?.HOSTING || "hosting"}
          </p>
        </div>
      </div>
      {rules?.length !== 0 && (
        <div className="my-3">
          <div className={`${styles.divider}`}></div>
        </div>
      )}
      {rules && (
        <>
          <div className={`${styles.Rules}`}>
            {rules.slice(0, 4).map((item: any) => (
              <div key={item._id}>
                <div className="d-flex align-items-center py-3 gap-3">
                  <ImageComponent
                    src={item.image}
                    alt=""
                    width={30}
                    height={30}
                    onError={handleImageError}
                  />
                  <div className={`${styles.rulesGrid}`}>
                    <span className={`mb-0 text-truncate`}>{item.title}</span>
                    <span className={`mb-0 text-truncate text-muted`}>
                      <b>{item.desc}</b>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {rules.length > 5 && (
            <button
              onClick={() => setOpen(true)}
              style={{
                border: "1px solid var(--footer-text-color)",
                borderRadius: 5,
                padding: 10,
                background: "var(--footer-text-color)",
                color: "#fff",
                marginTop: "20px"
              }}
            >
              Show All{rules.length} rules
            </button>
          )}
        </>
      )}
      <CustomModal open={open} onClose={() => setOpen(false)} title="Rules">
        <div className="p-3 ">
          {rules?.map((item: any) => (
            <div key={item._id}>
              <div className="d-flex align-items-center py-3">
                <ImageComponent
                  src={item.image}
                  alt=""
                  width={30}
                  height={30}
                  onError={handleImageError}
                />
                <div className={`${styles.rulesGrid}`}>
                  <h5 className={`mb-0 text-truncate`}>{item.title}</h5>
                  <span className={`mb-0 text-truncate text-muted`}>
                    <b>{item.desc}</b>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CustomModal>
    </>
  );
};
export default RulesSection;
