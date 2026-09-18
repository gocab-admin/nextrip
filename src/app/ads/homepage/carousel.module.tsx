import React, { useEffect, useState } from 'react'
import commonstyles from './page.module.scss';
import { getApiMethod } from '@/services/global';
import Link from "next/link";
import styles from './carousel.module.scss';
import { StarIcon } from "@/app/global/svg";
import { GenerateUrl } from "@/services/utils/helperURL";
import WidhListHeart from "@/components/wishlistheart";
import { currencyRate } from "@/Utils/currencyRate";
import { useAppSelector } from '@/redux/hooks';
import { currencySelector } from '@/redux/slice/CurrencySlice';
import { usePageContext } from "@/components/Providers/PageContext";
import APICONSTANT, { APIURLS } from "@/services/config";
import ProductImageCarousel from './productItem.module';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './carousel.slick.scss';

const Arrow = ({className, onClick, prev }:any) => (<button className={`${styles.carouselArrow} ${className}`} onClick={onClick}><svg
  width={13}
  height={22}
  viewBox="0 0 13 22"
  fill="none"
  style={{transform: prev?'rotate(180deg)': 'none'}}
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M0.000278473 19.754L1.90743 21.6504L12.5039 11.0432L1.89672 0.436007L0.000278473 2.33245L8.71103 11.0432L0.000278473 19.754Z"
    fill="white"
  />
</svg></button>)

function SampleNextArrow(props:any) {
  const { className, style, onClick } = props;
  return (<Arrow className={className} onClick={onClick} />)
  // return (
  //   <div
  //     className={className}
  //     style={{ ...style, display: "block", background: "red" }}
  //     onClick={onClick}
  //   />
  // );
}

function SamplePrevArrow(props:any) {
  const { className, style, onClick } = props;
  return (
    <Arrow prev={true} className={className} onClick={onClick} />
  );
}

function Carousel() {
  const { i18, currency } = usePageContext();
  const { CurrencyList } = useAppSelector(currencySelector);
  const [listData, setList] = useState([]);
  const fetchData = async () => {
    const res = await getApiMethod('listing/detail?_page=1&_limit=10');
    if(Array.isArray(res.data.approvedListing)) {
      const data = res.data.approvedListing.map((item:any)=>{
        item.images = [
          {
            src: '/images/errorImage.webp'
          }
        ];
          if (item.attachmentData.length > 0) {
            const attachments = item.attachmentData[0].image;
            if (attachments) {
              const myimages = attachments.groupImage.map(
                (groupImage: any) => ({
                  src: APIURLS.baseUrl + groupImage.imagePath
                })
              );
              myimages.unshift({
                src: APIURLS.baseUrl + attachments.coverImage
              });
              item.images = myimages;
            }
          }

        return item;
      });
      setList(data)
    }
  }
  useEffect(()=>{
    fetchData();
  },[])
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };
  return (
    <div className="row slick4">
        <h5 className={`${commonstyles.title} text-center`}>Recent Ads</h5>
        <Link href="/" className={`${styles.seeall} flex flex-end w-100`}>See all ads <svg
  width={8}
  height={14}
  viewBox="0 0 8 14"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M1.00008 1L6.64652 6.64645C6.84178 6.84171 6.84178 7.15829 6.64652 7.35355L1.00008 13"
    stroke="#22B463"
    strokeWidth={2}
  />
</svg>
</Link>
        {/* <div className={styles.imageGrid}> */}
        <Slider {...settings}>
        {listData?.map((list: any, i: any) => (
              <div className={`${styles.homepage} ${styles.carouselPadding}`} key={i}>
                <Link
                  href={GenerateUrl(
                    '/',
                    list.propertyCategoryName,
                    list.propertyName,
                    list._id
                  )}
                  target="_blank"
                >
                  <div className={`${styles.place}`}>
                    <div className={`${styles.image_container}`}>
                      <ProductImageCarousel images={Array.isArray(list.images)?list.images:[]} />
                      <WidhListHeart list={list} type="" />
                    </div>
                    <div className={`${styles.detail} d-grid mt-3`}>
                      <h4 className="m-0 text-dark text-capitalize">
                        {list.propertyName}
                        {/* {props.productkey} */}
                      </h4>
                      <p className={`${styles.place_day} m-0`}>
                        {list?.priceData?.pricing?.perHour >0 && <> <b>
                          {CurrencyList.currency}{" "}
                          {currencyRate(list?.priceData?.pricing?.perHour, currency?.exchange_rate)}
                        </b>{" "}
                        <span>{i18?.BOOKINGPAGE?.PERHOUR || "per hour"}{" "}</span>
                        </>}
                     
                        {list?.priceData?.pricing?.perDay>0 && list?.priceData?.pricing?.perHour>0 && ' | '}

                        {list?.priceData?.pricing?.perDay >0 && <>
                        <b>
                          {CurrencyList.currency}{" "}
                          {currencyRate(list?.priceData?.pricing?.perDay, currency?.exchange_rate)}
                        </b>{" "}
                        <span>{i18?.BOOKINGPAGE?.PERDAY || "per day"}{" "}</span>
                        </>}
                        
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
  )
}

export default Carousel
