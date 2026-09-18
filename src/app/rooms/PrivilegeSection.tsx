"use client";
import React, { useState, useMemo, Fragment } from "react";
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

const PrevilegeSection = ({ filterName = "" }: { filterName?: string }) => {
  const { i18 } = usePageContext();
  const item = useSelector((state: any) => state?.listingData.amenities);
  const [openAmenity, setAmenityModal] = useState<boolean | string>(false);
  const privilegeItems = item ? item.privilegeItems : null;
  const privileges = item ? item.privileges : null;

  const servicesSorted = useMemo(() => {
    if (Array.isArray(privileges)) {
      let list = [...privileges].sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
      if (filterName) {
        list = list.filter(
          (service: any) =>
            service.name?.toLowerCase() === filterName.toLowerCase()
        );
      } else {
        list = list.filter(
          (service: any) => service.name?.toLowerCase() !== "features"
        );
      }

      return list;
    }
    return [];
  }, [privileges, filterName]);

  const mappedItems = useMemo(() => {
    const categoryMap: any = {};
    const serviceMap: any = {};
    if (item.privilegeItems) {
      for (let i = 0; i < item.privilegeItems.length; i++) {
        const data = item.privilegeItems[i];
        if (!categoryMap[data.privilegeCategoryId]) {
          categoryMap[data.privilegeCategoryId] = [];
        }
        categoryMap[data.privilegeCategoryId].push(data);

        if (!serviceMap[data.privilegeId]) {
          serviceMap[data.privilegeId] = [];
        }
        serviceMap[data.privilegeId].push(data);
      }
      // sort items
      for (const key in categoryMap) {
        categoryMap[key].sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
      for (const key in serviceMap) {
        serviceMap[key].sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
    }
    return {
      categoryMap,
      serviceMap,
    };
  }, [item]);

  const mapCategories = useMemo(() => {
    const arr = item.privilegeCategories.filter(
      (item: any, index: any) => item.privilegeId === openAmenity
    );
    return arr;
  }, [openAmenity]);

  const servicetitle = useMemo(() => {
    let title = "";
    // const obj:any = {};
    if (openAmenity) {
      for (let i = 0; i < privileges.length; ++i) {
        const service = privileges[i];
        if (openAmenity === service._id) {
          title = service.name;
          break;
        }
        // obj[service._id] = service;
      }
    }

    return title;
  }, [privileges, openAmenity]);

  const handleAmenityOpen = (id: string) => () => {
    setAmenityModal(id);
  };
  const handleAmenityClose = () => {
    setAmenityModal(false);
  };
  return (
    <>
      {privilegeItems?.length > 0 && (
        <>
          {servicesSorted.map(
            (service: any, index: number) =>
              Array.isArray(mappedItems.serviceMap[service._id]) && (
                <Fragment key={index}>
                  <div  className={`${
    service.name?.toLowerCase() === "features" ? "features-class" : "add-amenities"
  }`}>
                   {service.name?.toLowerCase() !== "features" && (
  <h5>
    {/* {i18?.ROOMPAGE?.WHATTHISPLACEOFFERS || "What this place offers"} */}
    {service.name}
  </h5>
)}
                    <ul className={`${styles.offersection}`}>
                      {Array.isArray(mappedItems.serviceMap[service._id]) &&
                        (service.name.toLowerCase() === "features"
                          ? mappedItems.serviceMap[service._id] 
                          : mappedItems.serviceMap[service._id].length > 6
                          ? mappedItems.serviceMap[service._id].slice(0, 6) 
                          : mappedItems.serviceMap[service._id]
                        ) // count <= 6 → full
                          .map((item: any, index: number) => (
                            <li
                              key={index}
                              className="d-flex align-items-center"
                            >
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
                    {mappedItems.serviceMap[service._id].length > 6 &&
                      service.name?.toLowerCase() !== "features" && (
                        <DynamicButtonComponent
                          variant="outlined"
                          onClick={handleAmenityOpen(service._id)}
                          style={{
                            border: "1px solid var(--footer-text-color)",
                            borderRadius: 5,
                            padding: 10,
                            marginBottom: "10px !important",
                            background: "var(--footer-text-color)",
                            color: "var( --btn-color)",
                            fontFamily: "var(--font-family-inherit)",
                          }}
                          text={`${i18?.ROOMPAGE?.SHOWALL || "show all"} ${
                            mappedItems.serviceMap[service._id].length
                          } ${i18?.FILTER?.AMENITIES || "amenities"}`}
                        />
                      )}
                  </div>
                 {service.name?.toLowerCase() !== "features" && (
  <div className={`${styles.divider} my-3`}></div>
)}
                </Fragment>
              )
          )}
        </>
      )}
      <CustomModal
        open={Boolean(openAmenity)}
        onClose={handleAmenityClose}
        title={servicetitle}
        // title={i18?.ROOMPAGE?.WHATTHISPLACEOFFERS || "What this place offers"}
      >
        <div className={`${styles.body} p-3`}>
          {mapCategories.map((category: any) => (
            <>
              <div key={category._id}>
                <h5>{category.name}</h5>

                {Array.isArray(mappedItems.categoryMap[category._id]) &&
                  mappedItems.categoryMap[category._id].map((amenity: any) => (
                    <div key={amenity} className={`${styles.amenity}`}>
                      <ImageComponent
                        src={amenity.icon}
                        alt=""
                        className="me-2"
                        style={{
                          display: "block",
                          fill: "currentcolor",
                        }}
                        width={35}
                        height={35}
                      />
                      <p key={amenity.id}>{amenity.name}</p>
                    </div>
                  ))}
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

export default PrevilegeSection;
