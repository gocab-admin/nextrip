"use client";
import React, { useRef, useState, useEffect, Fragment } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

import { List, Map } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import { violetTheme } from "@/components/colorVariable";
import { categorySelector } from "@/redux/slice/categoriesSlice";
import { fetchApprovedAdsData } from "@/redux/approvedListSlice";
import { dispatch } from "@/redux/store";
import { searchSelector, updatePricing } from "@/redux/slice/searchValue";
import styles from "@/components/homepage.module.scss";
import Header from "@/app/ads/components/adsHeader";
import MapComponent from "@/components/map";
import HomePageFilter from "./adshomepageFilter";
import { AdsSmartSorting } from "./adsSmartSorting";

const MobileFooternav = dynamic(() => import("@/components/MobileFooterNav"));
const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const DynamicProduct = dynamic(() =>
  import("./adsProductCarousel").then((mod) => mod.Product)
);
const DynamicSorting = dynamic(() =>
  import("./adsSmartSorting").then((mod) => mod.AdsSmartSorting)
)
const Footer = dynamic(() => import("@/components/footer"));

const AdsHome = ({
  categories,
  name
}: {
  categories?: any[];
  name?: string;
}) => {
  const { i18, settings, responsiveView } = usePageContext();
  const { google } = settings;

  const [showmap, setshowmap]: any = useState(false);
  const list_ref: any = useRef();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newLoading, setNewLoading] = useState(true);
  const pageRef = useRef(1);
  const limit = 25;
  const endofPageReached = useRef(false);
  const loadingRef = useRef(true);
  const currentFilterRef = useRef();
  const { address, priceData, propertyType, productName, datesFilter, smartSorting } =
    useSelector(searchSelector);
  const { categoryId } = useSelector(categorySelector);

  const latitude = address.lat;
  const longitude = address.lng;
  const property = propertyType;
  const maxprice = priceData.maxPrice;
  const minprice = priceData.minPrice;
  const UserID =
    typeof window !== "undefined" ? localStorage.getItem("appUserId") : null;

  currentFilterRef.current = {
    ...(categoryId && { category: categoryId }),
    ...(UserID && { userId: UserID }),
    ...(property && { subCategory: property }),
    ...(minprice && { minPrice: minprice }),
    ...(maxprice && { maxPrice: maxprice }),
    ...(latitude && { lat: latitude }),
    ...(longitude && { lng: longitude }),
    ...(productName && { name: productName }),
    ...(datesFilter && { dateFilter: datesFilter }),
    ...(smartSorting && { sort: smartSorting }),
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  const showmapfn = () => {
    setshowmap(!showmap);
  };
  // use ref states as pagescroll only takes ref values correcty
  const fetchData = async (data?: any, type?: string) => {
    try {
      localStorage.setItem("usersType", "user");
      // setLoading(true)
      if (type === "append") {
        setNewLoading(true);
      } else {
        setLoading(true);
      }
      const pageno =
        type === "append" ? pageRef.current : (pageRef.current = 1);
      const res = await dispatch(
        fetchApprovedAdsData(data, pageno, limit, type)
      );
      if (res) {
        dispatch(
          updatePricing({
            minMaxVal: { min: res.minPrice, max: res.maxPrice }
          })
        );
        const list = res;
        if (type === "append") {
          pageRef.current += 1;
        } else {
          pageRef.current = 2;
        }

        endofPageReached.current =
          list?.approvedAds?.length < limit ? true : false;
      } else {
        console.error(`API request failed with status: ${res.status}`);
      }
      setLoading(false);
      setNewLoading(false);
      loadingRef.current = false;
    } catch (error) {
      console.error(error);
      setLoading(false);
      setNewLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Distance scrolled from the top
      const scrollHeight = document.documentElement.scrollHeight; // Total height of the page
      const clientHeight = window.innerHeight; // Height of the visible part of the page
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;
      if (
        scrollPercentage > 75 &&
        !endofPageReached.current &&
        !loadingRef.current
      ) {
        loadingRef.current = true;
        fetchData(currentFilterRef.current, "append");
      }
    };
    setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 300);

    // Remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // const appToken = localStorage.getItem("appToken");
    if (categoryId) {
      fetchData(currentFilterRef.current);
    } else {
      setLoading(false);
    }
  }, [
    categoryId,
    latitude,
    longitude,
    productName,
    property,
    minprice,
    maxprice,
    datesFilter,
    smartSorting,
  ]);

  // const hasAllCategories = categories?.some((cat) => cat.category === "ALL CATEGORIES");

  return (
    <>
      <div className={`${styles.home_header}`}>
        {google?.mapApiKey && (
          <Header categories={categories} path="ads" name={name} i18={i18} />
        )}
      </div>
      <div className={`${styles.adsFilter}`}>
        <div className={`${styles.filter_section}`}>
          <HomePageFilter />
        </div>
        <div className={`${styles.listing_section}`}>
          {!showmap ? (
            <>
              <div className={`${styles.home}`}>
                <div className={`${styles.places_top}`}>
                  {/* <AdsSmartSorting /> */}
                  <DynamicSorting
                    page={"homepage"}
                    path="ads"
                    keys={"place"}
                    i18={i18}
                    loading={loading}
                    newLoading={newLoading}
                  />
                  <div className={`${styles.places} d-grid`}>
                    <Fragment key={"place"}>
                      {/* <Product page={"homepage"} keys={"place"} /> */}
                      {loaded && (
                        <DynamicProduct
                          page={"homepage"}
                          path="ads"
                          keys={"place"}
                          i18={i18}
                          loading={loading}
                          newLoading={newLoading}
                        />
                      )}
                    </Fragment>
                  </div>
                  <div
                    ref={list_ref}
                    className="p-2 position-relative"
                    style={{ top: -500 }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            <MapComponent />
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <DynamicButtonComponent
          variant="outlined"
          onClick={showmapfn}
          className={`${styles.showmapbtn} d-flex align-items-center`}
          borderRadius="50px"
          padding="12px 24px"
          fontSize="var(--map-btn-text)"
          fontFamily="var(--font-family-mapButton)"
          text={
            !showmap
              ? `${i18?.HOMEPAGE?.SHOWMAP || "Show map"}`
              : `${i18?.HOMEPAGE?.SHOWLIST || "Show list"}`
          }
          endIcon={
            !showmap ? (
              <Map
                className="mx-2"
                style={{
                  display: "block",
                  height: "16px",
                  width: "16px",
                  fill: violetTheme.secondaryColor
                }}
              />
            ) : (
              <List
                className="mx-2"
                style={{
                  display: "block",
                  height: "16px",
                  width: "16px",
                  fill: violetTheme.secondaryColor
                }}
              />
            )
          }
        />
      </div>
      <Footer />
      {(responsiveView === "sm" || responsiveView === "xs") && (
        <MobileFooternav />
      )}
    </>
  );
};

export default AdsHome;
