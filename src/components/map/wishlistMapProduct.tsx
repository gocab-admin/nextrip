import React, { useState, useRef } from "react";

import { useSelector } from "react-redux";
import Link from "next/link";

import { usePageContext } from "@/components/Providers/PageContext";
import { GenerateUrl } from "@/services/utils/helperURL";
import {
    ChevronLeft,
    ChevronRight,
    StarIcon
} from "@/app/global/svg";
import { useAppSelector } from "@/redux/hooks";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import {
    searchSelector
} from "@/redux/slice/searchValue";
import { handleImageError } from "@/services/utils/utils";

import "../header.scss";
import styles from "../componentstyles.module.scss";
import ImageComponent from "../ImageComponent";
import { userSelector } from "@/redux/slice/user/userSlice";
import WidhListHeart from "../wishlistheart";
import { HeartIcon } from "@/app/global/svg";
import { detailSelector } from "@/redux/slice/detailSlice";
import { currencyRate } from "@/Utils/currencyRate";
import { postApiMethod } from "@/services/global";
import APICONSTANT from "@/services/apiConstant";
import { dispatch } from "@/redux/store";
import { getWishlistCollection } from "@/redux/slice/footerSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import { APIURLS } from "@/services/config";


export const MapProduct = (props: any) => {
    const { i18, currency } = usePageContext();
    const { setSelectedMarker } = props;
    const { CurrencyList } = useAppSelector(currencySelector);
    const { selectedMarkerRedux } = useAppSelector(detailSelector);
    const selectedData = selectedMarkerRedux.data;
    const listData = selectedData?.images
    const {
        guests,
        searchdate
    } = useSelector(searchSelector);

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
    const [index, setIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<any>(0);
    const [touchMoveX, setTouchMoveX] = useState<any>(0);
    const sliderRef = useRef(null);
    console.log('selectedData', selectedData)

    const handleTouchStart = (event: any) => {
        setTouchStartX(event.touches[0].clientX);
    };

    const nextSlide = () => {
        if (index < listData?.length - 1) {
            setIndex(index + 1);
        }
    };

    const prevSlide = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    const handleTouchMove = (event: any) => {
        setTouchMoveX(event.touches[0].clientX);
        const deltaX = touchMoveX - touchStartX;

        // Adjust sensitivity as needed
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            setTouchStartX(touchMoveX);
        }
    };

    const handledelete = async (listingID: any) => {
        try {
            let postData: Record<string, any> = {
                listingId: listingID
            };
            const res = await postApiMethod(APICONSTANT.wishList, postData);
            if (res.statusCode === 200) {
                setSelectedMarker(null);
                dispatch(getWishlistCollection(selectedData?._id));
                dispatch(
                    addAlert({
                        isOpen: true,
                        message: res.message,
                        type: "success",
                        severity: "success"
                    })
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const createdDate = new Date(selectedData?.createdAt).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();
    const isNew = createdDate === todayDate;

    return (
        <>
            <>
                <div className={`${styles.map}`}>
                    <Link
                        href={GenerateUrl("/",
                            selectedData?.categoryName,
                            selectedData?.listingName,
                            selectedData?.listingId,
                            fdate,
                            edate,
                            adult,
                            children,
                            pets
                        )}
                        target="_blank"
                    >
                        <div className={`${styles.place}`} key={selectedData?._id}>
                            <div className={`${styles.image_container}`}>
                                <div className={`${styles.upload_img_container}`}>
                                    <div className={`${styles.boxsize} position-relative`}>
                                        <div
                                            className={`${styles.upload_image_sec} h-100`}
                                            ref={sliderRef}
                                            onTouchStart={handleTouchStart}
                                            onTouchMove={handleTouchMove}
                                            style={{
                                                transform: `translateX(-${index * 100}%)`,
                                                transition: "0.6s"
                                            }}
                                        >
                                            {/* {listData?.map((image: any, i: any) => ( */}
                                            {/* <div key={`${i}image${i}`}> */}
                                            <ImageComponent
                                                src={APIURLS.baseUrl + selectedData?.image?.coverImage}
                                                width={300}
                                                height={200}
                                                alt="Picture of the author"
                                                onError={handleImageError}
                                                className={`${styles.upload_img} h-auto`}
                                            />
                                            {/* </div> */}
                                            {/* ))} */}
                                        </div>
                                        <div className={`${styles.productdots}`}>
                                            <div
                                                className="d-flex"
                                                style={{
                                                    transform: `translateX(-${(index - 2 <= 0
                                                        ? 0
                                                        : index >= listData?.length - 3
                                                            ? listData.length - 5
                                                            : index - 2) * 12
                                                        }px)`,
                                                    transition:
                                                        "all 0.6s cubic-bezier(0.46, 0.03, 0.52, 0.96) 0s"
                                                }}
                                            >
                                                {listData?.map((image: any, i: any) => (
                                                    <span
                                                        key={`${i}dots${i}`}
                                                        className={`${styles.dot_c} ${index == i ? styles.active_dot : ""
                                                            }`}
                                                    ></span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.arrow} ${styles.arrow_left}  ${!(index > 0) ? styles.dot_disabed : ""
                                            }`}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                prevSlide();
                                                // if (index > 0) {
                                                //   setIndex(index - 1);
                                                // }
                                            }}
                                        >
                                            <ChevronLeft
                                                width="11px"
                                                height="11px"
                                                fill="var(--footer-text-color)"
                                                style={{ stroke: "var(--search-button-color)" }}
                                            />
                                        </button>
                                    </div>
                                    <div
                                        className={`${styles.arrow} ${styles.arrow_right}  ${!(index < listData?.length - 1) ? styles.dot_disabed : ""
                                            }`}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                nextSlide();
                                                // if (index < listData.length - 1) {
                                                //   setIndex(index + 1);
                                                // }
                                            }}
                                        >
                                            <ChevronRight
                                                width="11px"
                                                height="11px"
                                                fill="var(--footer-text-color)"
                                                style={{ stroke: "currentColor" }}
                                            />
                                        </button>
                                    </div>
                                </div>
                                {/* <WidhListHeart list={selectedData} type='map'/> */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handledelete(selectedData?.listingId);
                                    }}
                                    className={`${styles.wishlistHeartBtn}`}
                                >
                                    <HeartIcon
                                        width="18px"
                                        height="18px"
                                        color="var(--search-button-color)"
                                        stroke="var(--btn-color)"
                                        strokeWidth={2}
                                    />
                                </button>
                            </div>
                            <div className={`${styles.detail} d-grid my-2 p-2`}>
                                <h4 className="m-0 text-capitalize text-body">
                                    {selectedData?.listingName}
                                </h4>
                                {/* <p className={`m-0 ${styles.distance_address}`}>
                    {selectedData.propertyDesc}
                  </p> */}
                                <p className={`${styles.place_day} m-0`}>
                                    <b>
                                        {CurrencyList?.currency}{" "}{currencyRate(selectedData?.price?.perDay, currency?.exchange_rate)}
                                    </b>{" "}
                                    {i18?.PRODUCT?.NIGHT || "Night"}
                                </p>
                                <span
                                    className={`${styles.rating} m-0 d-flex align-items-center`}
                                >
                                    <span className="me-1">
                                        {(isNew || selectedData?.rating !== 0) && <StarIcon width="10px" height="10px" color="var(--footer-text-color)" />}
                                    </span>
                                    <span className="text-dark">
                                        {isNew ? i18?.PRODUCT?.NEW || "New" : selectedData?.rating !== 0
                                            ? selectedData?.rating
                                            : ''}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            </>
        </>
    );
};
