import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";

import { usePageContext } from "@/components/Providers/PageContext";
import { GenerateUrl } from "@/services/utils/helperURL";
import { StarIcon } from "@/app/global/svg";
import { useAppSelector } from "@/redux/hooks";
import { dispatch } from "@/redux/store";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { setFilterValues, searchSelector } from "@/redux/slice/searchValue";

import "./header.scss";
import styles from "./componentstyles.module.scss";
import WidhListHeart from "./wishlistheart";
import { currencyRate } from "@/Utils/currencyRate";

const ProductImageCarousel = dynamic(
  () => import("@/components/productImageCarousel")
);

export const Product = (props: any) => {
  const listData = useSelector(
    (state: any) => state.approvedlist.listData.approvedListing
  );

  const adsData = useSelector(
    (state: any) => state.approvedlist.listData.approvedAds
  );

  const loading = props.loading;
  const newLoading = props.newLoading;
  const { i18, currency, settings } = usePageContext();
  const searchParams = useSearchParams();
  const { CurrencyList } = useAppSelector(currencySelector);
  const isAuth =
    typeof window !== "undefined" && localStorage?.getItem("appToken")
      ? true
      : false;
  const { address, guests, searchdate } = useSelector(searchSelector);
  const startDate = searchdate.startDate;
  const endDate = searchdate.endDate;
  const Adultcount = guests.adult;
  const Childrencount = guests.children;
  const petscount = guests.pets;

  const fdate: any = startDate ? startDate : null;
  const edate: any = endDate ? endDate : null;
  const adult = Adultcount ? Adultcount : null;
  const children = Childrencount ? Childrencount : null;
  const pets = petscount ? petscount : null;

  useEffect(() => {
    // @ts-ignore
    const search = Object.fromEntries(searchParams);
    // const amenityArray = search.amenities.split(',')
    dispatch(
      setFilterValues({
        searchdate: {
          ...searchdate,
          startDate: search.from || "",
          endDate: search.to || "",
        },
        address: { ...address, lat: search.lat || "", lng: search.lng || "" },
        guests: {
          adult: search.adults || 0,
          children: search.children || 0,
          pets: search.pets || 0,
        },
      })
    );
  }, [searchParams]);

  const path = "/c/";
  console.log("listData", listData);
  console.log("currency", currency);
  return (
    <>
      {loading ? (
        Array.from(Array(10)).map((item: any, index: number) => (
          <div className={`${styles.homepage}`} key={`${index}`}>
            <div className={`${styles.place}`}>
              <div className={`${styles.image_container}`}>
                <div
                  className={`${styles.placeholder_img} card h-100`}
                  aria-hidden="true"
                >
                  <p className="card-text placeholder-glow h-100">
                    <span className="placeholder col-12 h-100"></span>
                  </p>
                </div>
                <h5 className="card-title placeholder-glow mt-2">
                  <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-glow">
                  <span className="placeholder col-8"></span>
                </p>
              </div>
            </div>
          </div>
        ))
      ) : listData && listData.length !== 0 ? (
        <>
          {listData?.map((list: any, i: any) => {
            const createdDate = new Date(
              list?.priceData?.createdAt
            ).toLocaleDateString();
            const todayDate = new Date().toLocaleDateString();
            const isNew = createdDate === todayDate;
            return (
              <div className={`${styles.homepage}`} key={i}>
                <Link
                  href={GenerateUrl(
                    path,
                    list.propertyCategoryName,
                    list.propertyName,
                    list._id,
                    fdate,
                    edate,
                    adult,
                    children,
                    pets
                  )}
                  target="_blank"
                >
                  <div className={`${styles.place}`}>
                    <div className={`${styles.image_container}`}>
                      <ProductImageCarousel images={list.images} />
                      <WidhListHeart list={list} type="" />
                      {list?.priceData?.pricing?.discountPercentage &&
                      list?.priceData?.pricing?.discountPercentage !== 0 ? (
                        <div
                          className="shining-badge"
                          style={{
                            padding: "5px 10px",
                            background: "var(--btn-bg-color)",
                            borderRadius: "8px",
                            position: "absolute",
                            top: 15,
                            left: 15,
                            overflow: "hidden",
                          }}
                        >
                          <p
                            className="m-0 shining-text"
                            style={{
                              color: "#fff",
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            {list?.priceData?.pricing?.discountPercentage}% off
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className={`${styles.detail} d-grid mt-3`}>
                      <h4 className="m-0 text-dark text-capitalize">
                        {list.propertyName}
                        {props.productkey}
                      </h4>
                      {/* <p className="text-dark text-capitalize m-0">
                          {list.address.city && list.address.city}{list.address.state && ','}{list.address.state && list.address.state}
                        </p> */}
                      <p className={`${styles.place_day} m-0`}>
                        {(settings?.hiddenSettings?.hourlyBooking === "Hour" ||
                          settings?.hiddenSettings?.hourlyBooking === "Both") &&
                          list?.priceData?.pricing?.perHour > 0 && (
                            <div className="d-flex gap-2">
                              <p className="fw-bold text-dark m-0">
                                {CurrencyList.currency}{" "}
                                {currencyRate(
                                  list?.priceData?.pricing?.perHour,
                                  currency?.exchange_rate
                                )}
                              </p>{" "}
                              {/* <p className="m-0"><s>{currencyRate(list?.priceData?.pricing?.perHour, currency?.exchange_rate)}</s></p>
                              <b>29% off</b> */}
                              <span>
                                {i18?.BOOKINGPAGE?.PERHOUR || "per hour"}{" "}
                              </span>
                            </div>
                          )}

                        {/* {settings?.hiddenSettings?.hourlyBooking === 'Both' && list?.priceData?.pricing?.perDay > 0 &&
                            list?.priceData?.pricing?.perHour > 0 &&
                            " | "} */}

                        {(settings?.hiddenSettings?.hourlyBooking === "Day" ||
                          settings?.hiddenSettings?.hourlyBooking === "Both") &&
                          list?.priceData?.pricing?.perDay > 0 && (
                            <div>
                              <div className="d-flex gap-2">
                                <p className="fw-bold text-dark m-0">
                                  {CurrencyList.currency}{" "}
                                  {!list?.priceData?.pricing?.discountPercentage
                                    ? currencyRate(
                                        list?.priceData?.pricing?.perDay,
                                        currency?.exchange_rate
                                      )
                                    : currencyRate(
                                        list?.priceData?.pricing
                                          ?.discountedPrice,
                                        currency?.exchange_rate
                                      )}
                                </p>
                                {!list?.priceData?.pricing
                                  ?.discountPercentage && (
                                  <span>
                                    {i18?.BOOKINGPAGE?.PERDAY || "per day"}
                                  </span>
                                )}{" "}
                                {list?.priceData?.pricing?.discountPercentage &&
                                list?.priceData?.pricing?.discountPercentage !==
                                  0 ? (
                                  <>
                                    <p className="m-0">
                                      <s>
                                        {currencyRate(
                                          list?.priceData?.pricing?.perDay,
                                          currency?.exchange_rate
                                        )}
                                      </s>
                                    </p>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                              {list?.priceData?.pricing?.discountPercentage &&
                              list?.priceData?.pricing?.discountPercentage !==
                                0 ? (
                                <div>
                                  <p>
                                    + taxes & fee &#183;{" "}
                                    {i18?.BOOKINGPAGE?.PERDAY || "per day"}
                                  </p>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          )}
                      </p>
                      <span
                        className={`${styles.rating} m-0 d-flex align-items-center`}
                      >
                        <span
                          className="me-1"
                          style={{
                            marginTop: "-4px",
                          }}
                        >
                          {(isNew || list?.totalRatingCount !== 0) && (
                            <StarIcon
                              width="10px"
                              height="10px"
                              color="var(--footer-text-color)"
                            />
                          )}
                        </span>
                        <span className="text-dark">
                          {isNew
                            ? i18?.PRODUCT?.NEW || "New"
                            : list.totalRatingCount !== 0
                            ? list.totalRatingCount
                            : ""}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {newLoading &&
            Array.from(Array(5)).map((item: any, index: number) => (
              <div className={`${styles.homepage}`} key={`${index}`}>
                <div className={`${styles.place}`}>
                  <div className={`${styles.image_container}`}>
                    <div
                      className={`${styles.placeholder_img} card h-100`}
                      aria-hidden="true"
                    >
                      <p className="card-text placeholder-glow h-100">
                        <span className="placeholder col-12 h-100"></span>
                      </p>
                    </div>
                    <h5 className="card-title placeholder-glow mt-2">
                      <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </>
      ) : (
        <div className="appcontainer">
          <h2>{i18?.FILTER?.NOEXACTMATCHES || "No exact matches"}</h2>{" "}
        </div>
      )}
    </>
  );
};
