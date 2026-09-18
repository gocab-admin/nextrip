import React, { useEffect, useState } from "react";
import commonstyles from "./page.module.scss";
import { getApiMethod } from "@/services/global";
import Link from "next/link";
import styles from "./carousel.module.scss";
import { StarIcon } from "@/app/global/svg";
import { GenerateUrl } from "@/services/utils/helperURL";
import WidhListHeart from "@/components/wishlistheart";
import { currencyRate } from "@/Utils/currencyRate";
import { useAppSelector } from "@/redux/hooks";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { usePageContext } from "@/components/Providers/PageContext";
import APICONSTANT, { APIURLS } from "@/services/config";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.slick.scss";
import ProductImageCarousel from "./carouselfitnest";

const Arrow = ({ className, onClick, prev }: any) => (
    <button
      className={`${styles.carouselArrow} ${className}`}
      onClick={onClick}
    >
      <svg
        width={13}
        height={22}
        viewBox="0 0 13 22"
        fill="none"
        style={{ transform: prev ? "rotate(180deg)" : "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.000278473 19.754L1.90743 21.6504L12.5039 11.0432L1.89672 0.436007L0.000278473 2.33245L8.71103 11.0432L0.000278473 19.754Z"
          fill="white"
        />
      </svg>
    </button>
  );

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return <Arrow className={className} onClick={onClick} />;
}

function SamplePrevArrow(props: any) {
  const { className, onClick } = props;
  return <Arrow prev={true} className={className} onClick={onClick} />;
}

function Carousel() {
  const { i18, currency } = usePageContext();
  const { CurrencyList } = useAppSelector(currencySelector);
  const [listData, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await getApiMethod("theme/recentBookings");
    console.log("fetchData", res?.data?.listingDetails);
    if (Array.isArray(res?.data?.listingDetails)) {
      setList(res?.data?.listingDetails);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className="row slick4">
      <h5 className={`${commonstyles.title} text-center`}>Book Venues</h5>
      {/* <Link href="/" className={`${styles.seeall} flex flex-end w-100`}>See all venues <svg
        width={8}
        height={14}
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.00008 1L6.64652 6.64645C6.84178 6.84171 6.84178 7.15829 6.64652 7.35355L1.00008 13"
          stroke="currentColor"
          strokeWidth={2}
        />
      </svg>
      </Link> */}
      {/* <div className={styles.imageGrid}> */}
      <Slider {...settings}>
        {loading
          ? Array.from(Array(10)).map((item: any, index: number) => (
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
          : listData?.map((list: any, i: any) => (
              <div
                className={`${styles.homepage} ${styles.carouselPadding}`}
                key={i}
              >
                <Link
                  // href="/"
                  href={GenerateUrl(
                    "/",
                    list.categoryName.category,
                    list.propertyName,
                    list._id
                  )}
                  target="_blank"
                >
                  <div className={`${styles.place}`}>
                    <div className={`${styles.image_container}`}>
                      {/* <ProductImageCarousel images={Array.isArray(list.images)?list.images:[]} /> */}
                      <ProductImageCarousel images={list} />
                      <WidhListHeart list={list} type="" />
                    </div>
                    <div className={`${styles.detail} d-grid mt-3`}>
                      <h4 className="m-0 text-dark text-capitalize">
                        {list.propertyName}
                        {/* {props.productkey} */}
                      </h4>
                      <p className={`${styles.place_day} m-0`}>
                        {list?.listingPricingDatas?.pricing?.perHour > 0 && (
                          <>
                            {" "}
                            <b>
                              {CurrencyList.currency}{" "}
                              {currencyRate(
                                list?.listingPricingDatas?.pricing?.perHour,
                                currency?.exchange_rate
                              )}
                            </b>{" "}
                            <span>
                              {i18?.BOOKINGPAGE?.PERHOUR || "per hour"}{" "}
                            </span>
                          </>
                        )}

                        {list?.listingPricingDatas?.pricing?.perDay > 0 &&
                          list?.listingPricingDatas?.pricing?.perHour > 0 &&
                          " | "}

                        {list?.listingPricingDatas?.pricing?.perDay > 0 && (
                          <>
                            <b>
                              {CurrencyList.currency}{" "}
                              {currencyRate(
                                list?.listingPricingDatas?.pricing?.perDay,
                                currency?.exchange_rate
                              )}
                            </b>{" "}
                            <span>
                              {i18?.BOOKINGPAGE?.PERDAY || "per day"}{" "}
                            </span>
                          </>
                        )}
                      </p>
                      <span
                        className={`${styles.rating} m-0 d-flex align-items-center`}
                      >
                        <span className="me-1">
                          <StarIcon
                            width="10px"
                            height="10px"
                            color="var(--footer-text-color)"
                          />
                        </span>
                        <span className="text-dark">
                          {list.totalRatingCount !== 0
                            ? list.totalRatingCount
                            : i18?.PRODUCT?.NEW || "New"}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
      </Slider>
      {/* </div> */}
    </div>
  );
}

export default Carousel;
