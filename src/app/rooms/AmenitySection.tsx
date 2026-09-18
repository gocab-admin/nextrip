"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

import { APIURLS } from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleSVGError } from "@/services/utils/utils";

import styles from "./components.module.scss";

const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const CustomModal = dynamic(() => import("@/components/modal"));
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));

const AmenitiesSection = () => {
  const { i18 } = usePageContext();
  const item = useSelector((state: any) => state?.listingData);
  const amenities = item ? item.ListingData.amenities : null;
  console.log(amenities, 'amenities')
  const AmenitiesCategory = item ? item.ListingData?.amenityCategories : [];
  const [openAmenity, setAmenityModal] = useState(false);
  const handleAmenityOpen = () => {
    setAmenityModal(true);
  };
  const handleAmenityClose = () => {
    setAmenityModal(false);
  };
  return (
    <>
      {amenities?.length > 0 && (
        <>
          <div className="add-amenities">
            <h5>
              {i18?.ROOMPAGE?.WHATTHISPLACEOFFERS || "What this place offers"}
            </h5>
            <ul className={`${styles.offersection}`}>
              {amenities
                .slice()
                ?.slice(0, 6)
                ?.map((item: any, index: any) => (
                  <li key={index} className={`d-flex align-items-center`}>
                    <ImageComponent
                      src={item.icon}
                      width={35}
                      height={35}
                      alt=""
                      onError={handleSVGError}
                    />
                    <span className="ms-2">{item.name}</span>
                  </li>
                ))}
            </ul>
            {amenities.length > 6 && (
              <DynamicButtonComponent
                variant="outlined"
                onClick={handleAmenityOpen}
                style={{
                  border: "1px solid var(--footer-text-color)",
                  borderRadius: 5,
                  padding: 10,
                  background: "var(--footer-text-color)",
                  color: "var( --btn-color)",
                  fontFamily: "var(--font-family-inherit)"
                }}
                text={`${i18?.ROOMPAGE?.SHOWALL || "show all"} ${
                  amenities.length
                } ${i18?.FILTER?.AMENITIES || "amenities"}`}
              />
            )}
          </div>
        </>
      )}
      <CustomModal
        open={openAmenity}
        onClose={handleAmenityClose}
        title={i18?.ROOMPAGE?.WHATTHISPLACEOFFERS || "What this place offers"}
      >
        <div className={`${styles.body} p-3`}>
          {AmenitiesCategory &&
            AmenitiesCategory.map((category: any) => (
              <>
                <div key={category._id}>
                  <h5>{category.category}</h5>

                  {amenities &&
                    amenities.map(
                      (amenity: any) =>
                        amenity.categoryId === category._id && (
                          <div key={amenity} className={`${styles.amenity}`}>
                            <ImageComponent
                              src={amenity.icon}
                              alt=""
                              className="me-2"
                              style={{
                                display: "block",
                                fill: "currentcolor"
                              }}
                              width={35}
                              height={35}
                            />
                            <p key={amenity.id}>{amenity.name}</p>
                          </div>
                        )
                    )}
                </div>
                <div className="my-3">
                  <div className={`${styles.divider}`}></div>
                </div>
              </>
            ))}
        </div>
      </CustomModal>
    </>
  );
};

export default AmenitiesSection;
