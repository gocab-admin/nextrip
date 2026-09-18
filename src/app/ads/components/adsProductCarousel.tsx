import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePageContext } from "@/components/Providers/PageContext";
import { GenerateUrl } from "@/services/utils/helperURL";
// import {
//   StarIcon
// } from "@/app/global/svg";
import { useAppSelector } from "@/redux/hooks";
import { dispatch } from "@/redux/store";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import {
  setFilterValues,
  searchSelector
} from "@/redux/slice/searchValue";

import "@/components/header.scss";
import styles from "./adscomponentstyles.module.scss";
import WidhListHeart from "@/components/wishlistheart";
import { currencyRate } from "@/Utils/currencyRate";


dayjs.extend(relativeTime);

function getRandomDate(startDate=new Date('2024-10-01'), endDate=new Date('2025-01-04')) {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;
  return new Date(randomTimestamp);
}

const ProductImageCarousel = dynamic(
  () => import("./productImageCarousel")
);

export const Product = (props: any) => {
  const adsData = useSelector(
    (state: any) => state.approvedlist.listData.approvedAds
  );
  const loading = props.loading;
  const newLoading = props.newLoading;
  const { i18, currency } = usePageContext();
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
    console.log('====================================');
    console.log(search);
    console.log('====================================');
    // const amenityArray = search.amenities.split(',')
    dispatch(
      setFilterValues({
        searchdate: {
          ...searchdate,
          startDate: search.from || "",
          endDate: search.to || ""
        },
        address: { ...address, lat: search.lat || "", lng: search.lng || "" },
        guests: {
          adult: search.adults || 0,
          children: search.children || 0,
          pets: search.pets || 0
        }
      })
    );
  }, [searchParams]);

  const path = '/ads/'

  return (
    <>
      {
        loading ? (
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
        ) : adsData && adsData.length !== 0 ? (
          <>
            {adsData?.map((list: any, i: any) => (
              <div className={`${styles.homepage}`} key={i}>
                <Link
                  href={GenerateUrl(
                    path,
                    list.categoryName,
                    list.name,
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
                    <div className={`${styles.image_container}`}
                      style={{
                        border: "1px solid lightgray",
                        borderBottom: "none",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        padding: "5px"
                      }}>
                      <ProductImageCarousel images={list.images} />
                      <WidhListHeart list={list} type="" />
                    </div>
                    <div className={`${styles.detail} d-grid`}
                      style={{
                        border: "1px solid lightgray",
                        borderTop: "none",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                        padding: "5px",
                        borderLeft: "4px solid #ffd200"
                      }}
                    >
                      <div>
                       <p className={`${styles.place_day} m-0`}>
                        <b>
                          {CurrencyList.currency}{" "}
                          {currencyRate(list?.price, currency?.exchange_rate)}
                        </b>{" "}
                      </p>
                      <h4 className="m-0 text-dark text-capitalize">
                        {list.name}
                        {props.productkey}
                      </h4>
                     
                      <span
                        className={`${styles.rating} m-0 d-flex align-items-center`}
                      >
                      </span>
                      <div className="d-flex justify-content-between">
                        <div className="text-secondary">{list?.address?.city}</div>
                        {/* <div className="text-secondary">{dayjs(getRandomDate()).fromNow()}</div> */}
                        <div className="text-secondary">{dayjs(list?.createdAt).fromNow()}</div>
                      </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
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
        )
      }
    </>
  );
};
