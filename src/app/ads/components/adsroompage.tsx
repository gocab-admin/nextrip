"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useSearchParams, useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { DateObject } from "react-multi-date-picker";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Drawer from "@mui/material/Drawer";
import { currencyRate } from "@/Utils/currencyRate";
import { getApiMethod } from "@/services/global";
import { setConfirmModaData, setModal } from "@/redux/slice/modalSlice";
import { getDatesBetween } from "@/services/utils/dateFunctions";
import {
  fetchBookingData,
  getBookingEstimationSuccess,
  isLoadingPayment
} from "@/redux/slice/user/BookingSlice";
import { RatingIcon, ShareIcon } from "@/app/global/svg";
import RoomsDescription from "@/components/roomDescription";
import APICONSTANT, { APIURLS } from "@/services/config";
import AdsMobileDetailHeader from "./adsMobileDetailHeader";
// import RoomHeader from "@/app/rooms/header";
import { usePageContext } from "@/components/Providers/PageContext";
import {
  addArrImage,
  detailSelector,
  addListPrice,
  setCoordinate,
  addListHourPrice
} from "@/redux/slice/detailSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getListData } from "@/redux/slice/ads/adslistdataSlice";
import { parseId } from "@/services/utils/helperURL";
import { addAlert } from "@/redux/slice/AlertSlice";
import { bedsCount, listingSelector } from "@/redux/slice/listingSlice";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { generateData } from "@/components/helper";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { handleImageError } from "@/services/utils/utils";
import { Time, formatDateTime } from "@/services/utils/datetime";

import "@/components/header.scss";
import styles from "@/app/rooms/page.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { Loader } from "@/components/loader";
import CustomModal from "@/components/modal";
import SocialModal from "@/components/SocialModal";
import PhotoCarousel from "@/components/photoCarousel";
import Header from "@/app/ads/components/adsHeader";
import MobilereserveBox from "@/components/MobilereserveBox";
import WishListHeart from "@/components/wishlistheart";
import RoomsPageloader from "@/components/roomspageloader";
import RoomspageImageLayout from "@/components/roomspageImageLayout";
import Carousel from "../homepage/carouselfit.module";
import { Breadcrumbs, Link, Typography } from "@mui/material";

dayjs.extend(relativeTime);

function checkIfDate(dateString: any) {
  // Regular expression for YYYY-MM-DD
  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyPattern.test(dateString)) {
    return true;
  }
  return false;
}

const HostDetails = dynamic(() => import("./adsHostDetails"));
const RulesSection = dynamic(() => import("./adsrulesComponent"));
const Footer = dynamic(() => import("@/components/footer"));
const MapComponent = dynamic(() => import("@/components/EmbedMap"), {
  loading: () => <p>Loading...</p>
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`
  };
}

export default function AdsRoomPage({ props }: any) {
  const searchParams: any = useSearchParams();
  // const slugid = searchParams.get("id");

  const sectionIds = [
    "section1",
    "section2",
    "section3",
    "section4",
    "section5"
  ];

  const userId =
    typeof window !== "undefined" ? localStorage?.getItem("appUserId") : null;

  const dayIn: any = new DateObject()
    .setHour(new DateObject().hour + 2)
    .setMinute(0);
  const dayOut: any = new DateObject().setHour(dayIn.hour + 4).setMinute(0);

  const dispatch = useAppDispatch();
  const { estimation } = useSelector((state: any) => state.bookingEstimation);
  const propertyData = useSelector((state: any) => state.adsData.AdsData);
  const TimeDate = useSelector(
    (state: any) => state?.SearchValue?.value?.timeanddate
  );
  const loader = useSelector(
    (state: any) => state.bookingEstimation.loadingPayment
  );

  const { CurrencyList } = useAppSelector(currencySelector);
  const { DetailsList } = useAppSelector(detailSelector);

  const { i18, currency, settings, responsiveView } = usePageContext();
  const { google } = settings;
  const HourlyBooking = settings?.hiddenSettings?.hourlyBooking;
  const APIKEY = google?.mapApiKey;
  const isAuth =
    typeof window !== "undefined" && localStorage?.getItem("appToken")
      ? true
      : false;

  const { price, hourprice, image, coordinate } = DetailsList;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [imageopen, setImageOpen] = useState(false);
  const [imglist, setImglist] = useState<any[]>([]);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("section1");
  const [isSticky, setIsSticky] = useState(false);
  const [stickyBtn, setstickyBtn] = useState(false);
  const [list, setlist] = useState<string[]>([]);
  const [galleryImage, setGalleryImage] = useState([
    {
      img: "https://a0.muscache.com/im/pictures/b7c9264d-73c9-45c3-882e-6e9577d63d68.jpg",
      title: "CoverImage",
      rows: 2,
      cols: 2
    },
    {
      img: "https://a0.muscache.com/im/pictures/4588d88f-0224-42f4-94cb-594f4d362fba.jpg",
      title: "gallery1"
    },
    {
      img: "https://a0.muscache.com/im/pictures/150e47d8-76b8-4233-8724-cbbd12880848.jpg",
      title: "gallery2"
    },
    {
      img: "https://a0.muscache.com/im/pictures/4588d88f-0224-42f4-94cb-594f4d362fba.jpg",
      title: "gallery3"
    },
    {
      img: "https://a0.muscache.com/im/pictures/150e47d8-76b8-4233-8724-cbbd12880848.jpg",
      title: "gallery4"
    }
  ]);

  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  let iref = 0;

  const sectionRefs = sectionIds.reduce((acc: any, sectionId: any) => {
    acc[sectionId] = refs[iref];
    ++iref;
    return acc;
  }, {});

  const productId = useMemo(
    () => parseId(props?.params?.property || props?.params?.adsproperty),
    [props]
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickImageOpen = () => {
    setImageOpen(true);
    setOpen(false);
  };

  const handleButtonClickShare = () => {
    setSocialModalOpen(true);
  };

  const handlemodalImageClose = () => {
    setOpen(true);
    setImageOpen(false);
  };

  const formatedDatefn = (date: any) => {
    if (typeof date === "string" && date.length > 0) {
      let newDate: any = new Date(date.split("/").reverse().join("-"));
      newDate = newDate?.toISOString();
      return newDate;
    } else {
      return null;
    }
  };

  const scrollToSection = (refName: any) => {
    const sectionRef = sectionRefs[refName];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchData = async () => {
    const view = searchParams.get("viewBy") || "";

    try {
      setLoading(true);
      const data = {
        ...(userId && { userId: userId }),
        ...(view && { viewBy: view })
      };

      const res = await getApiMethod(
        `${APICONSTANT.approvedadsListings}/${productId}`,
        data
      );

      // Check if the API response is successful
      if (res.statusCode === 200) {
        const list = res.data.ads;
        list.attachmentData = [
          {
            image: list.image
          }
        ];
        setImglist(list.attachmentData[0]);
        // Dispatch data to Redux store
        dispatch(getListData(list));
        // dispatch(setAmenities({privilegeCategories: res?.data?.privilegeCategories,
        //   privilegeItems: res?.data?.privilegeItems,
        //   privileges: res?.data?.privileges
        // }));

        // Dispatch list price
        if (list.priceData && list.priceData[0] && list.priceData[0].pricing) {
          dispatch(addListPrice(list.priceData[0].pricing.perDay));
          dispatch(addListHourPrice(list.priceData[0].pricing.perHour));
        }

        // Dispatch coordinates
        if (list.address && list.address.coordinates) {
          dispatch(
            setCoordinate({
              latitude: list.address.coordinates[0],
              longitude: list.address.coordinates[1]
            })
          );
        }

        // Handle gallery images
        if (list.image) {
          const images = list.image;
          setGalleryImage((item) => {
            item[0].img = APIURLS.baseUrl + images.coverImage;
            images.groupImage.forEach((group: any, index: any) => {
              if (item[index + 1]) {
                item[index + 1].img = APIURLS.baseUrl + group.imagePath;
              }
            });
            return [...item]; // Return a new array to trigger state update
          });

          const coverImage = {
            imagePath: images.coverImage,
            _id: images.coverImageId
          };
          const groupImage = images.groupImage || [];
          dispatch(addArrImage([coverImage, ...groupImage]));
        }

        setLoading(false);
      } else {
        console.error(`API request failed with status: ${res.status}`);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (title: string) => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  useEffect(() => {
    dispatch(isLoadingPayment(false));
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 650;
      const threshold2 = 2550;
      const scrolled = window.scrollY;
      setIsSticky(scrolled > threshold);
      setstickyBtn(scrolled > threshold2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionRefs]);

  return (
    <>
      {loader && <Loader />}
      <div>
        {responsiveView === "sm" || responsiveView === "xs" ? (
          <AdsMobileDetailHeader
            listData={propertyData}
            productId={productId}
          />
        ) : (
          <>
            {APIKEY && <Header page={true} center="hide" />}
            {isSticky && (
              <div className={`${styles.scroll_section} border-bottom`}>
                <div
                  className={`${styles.scroll_header} container d-flex justify-content-between`}
                >
                  <div className={`${styles.scroll_menu} scroll-tabs`}>
                    {[
                      i18?.LISTING?.PHOTOS || "Photos",
                      //   i18?.ROOMPAGE?.AMENITIES || "Amenities",
                      //   i18?.ROOMPAGE?.REVIEWS || "Reviews",
                      i18?.TRIPS?.LOCATION || "Location"
                    ].map((data: string, d: number) => (
                      <h6
                        key={d}
                        onClick={() => scrollToSection(`section${d + 1}`)}
                        className={
                          activeSection === `section${d + 1}`
                            ? styles.active
                            : ""
                        }
                      >
                        {data}
                      </h6>
                    ))}
                  </div>
                  {stickyBtn && (
                    <div className="d-flex justify-content-end align-items-center">
                      <div className="d-flex align-items-baseline">
                        <h5 className={`mb-0 me-1`}>
                          {CurrencyList.currency}
                          {currencyRate(
                            estimation?.perDay || price,
                            currency.exchange_rate
                          )}
                        </h5>
                        <p className={`mb-0 me-3`}>
                          {" "}
                          {i18?.PRODUCT?.NIGHT || "Night"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {loading ? (
          <RoomsPageloader galleryImage={galleryImage} />
        ) : propertyData ? (
          <div className={`${styles.detailpage} container mt-4`} style={{marginBottom: 0}}>
            <Breadcrumbs separator={"›"} aria-label="breadcrumb" sx={{ my: 1 }}>
              <Link key="1" color="inherit" href="/ads">
                Home Page
              </Link>
              <Link key="2" color="inherit" href={`/ads/${propertyData?.categoryName}`}>
                {propertyData?.categoryName}
              </Link>
              <Link key="2" color="inherit" href={`/ads/${propertyData?.categoryName}`}>
                {propertyData?.subCategoryName}
              </Link>
              {propertyData.name && (
                <Typography key="3" sx={{ color: "text.primary" }}>
                  {propertyData?.name}
                </Typography>
              )}
            </Breadcrumbs>
            <div
              ref={sectionRefs.section1}
              id="section1"
              className={`${styles.detail_header} d-flex justify-content-between align-items-center`}
            >
              {responsiveView === "sm" || responsiveView === "xs" ? (
                <></>
              ) : (
                <h3 className=" mt-4 mb-0">
                  {capitalizeFirstLetter(propertyData?.name || "")}
                </h3>
              )}
              {responsiveView === "sm" || responsiveView === "xs" ? null : (
                <div className="d-flex">
                  <div className=" d-flex align-items-center">
                    <button
                      onClick={handleButtonClickShare}
                      className={`btn d-flex align-items-center ${styles.btn_ratings}`}
                    >
                      <ShareIcon
                        className="me-2"
                        style={{
                          display: "block",
                          fill: "none",
                          height: "16px",
                          width: "16px",
                          stroke: "currentcolor",
                          strokeWidth: "2",
                          overflow: "visible",
                          color: "var(--svg-color)"
                        }}
                      />
                      <span className={`${styles.propDetails}`}>
                        {i18?.ROOMPAGE?.SHARE}
                      </span>
                    </button>
                  </div>
                  <div>
                    <div className={`btn d-flex align-items-center`}>
                      <WishListHeart list={propertyData} type="details" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              {responsiveView === "sm" || responsiveView === "xs" ? null : (
                <RoomspageImageLayout
                  galleryImage={galleryImage}
                  handleClickOpen={handleClickOpen}
                  imglist={imglist}
                  srcset={srcset}
                />
              )}
            </div>
            <div
              className={`${styles.bottomsec} pb-5 d-flex justify-content-between flex-wrap position-relative `}
            >
              <div
                className={
                  responsiveView === "sm" || responsiveView === "xs"
                    ? "col-md-7 w-100"
                    : "col-md-7"
                }
              >
                <div className="d-flex justify-content-between align-items-center col-md-12">
                  <div className="">
                    {responsiveView === "sm" || responsiveView === "xs" ? (
                      propertyData.name && (
                        <h1 className="mobile-header">{propertyData.name}</h1>
                      )
                    ) : (
                      <></>
                    )}
                    {propertyData.price && (
                      <h5 className=" text-xs sub-title-text">
                        {CurrencyList.currency}{" "}
                        {currencyRate(
                          propertyData.price,
                          currency.exchange_rate
                        )}
                      </h5>
                    )}
                    {propertyData.subCategoryName && (
                      <h5 className=" text-xs sub-title-text">
                        {propertyData.subCategoryName},{" "}
                        {propertyData.categoryName} in{" "}
                        {propertyData.address.city},{" "}
                        {propertyData.address.state}
                      </h5>
                    )}
                  </div>
                </div>
                <div className="my-3">
                  <div className={`${styles.divider}`}></div>
                </div>
                <div>
                  <RulesSection />
                </div>
                <div></div>
                {propertyData.desc && (
                  <div>
                    <div>
                      <RoomsDescription desc={propertyData.desc} />
                    </div>
                  </div>
                )}

                <div className="my-3">
                  <div className={`${styles.divider}`}></div>
                </div>
              </div>
              <div
                className={
                  responsiveView === "sm" || responsiveView === "xs"
                    ? "d-none"
                    : "col-md-4 d-md-block"
                }
              >
                <div className={`${styles.stickysidebarcontainer}`}>
                  <div
                    className={`${styles.stickysidebar}`}
                    ref={sectionRefs.section5}
                    id="section5"
                  >
                    <HostDetails
                      price={`${CurrencyList?.currency} ${currencyRate(
                        propertyData.price,
                        currency.exchange_rate
                      )}`}
                      responsiveView={responsiveView}
                      ids={productId}
                      cateId={propertyData.categoryId}
                      i18={i18}
                    />
                  </div>
                </div>
              </div>
            </div>
            {propertyData.address.coordinates.length !== 0 && (
              <div
                className={`py-4 where-in-map`}
                ref={sectionRefs.section4}
                id="section4"
              >
                <h5 className="py-2">
                  {i18?.ROOMPAGE?.WHEREYOUWILLBE || "where you'll be"}
                </h5>
                {APIKEY && (
                  <MapComponent
                    readOnly={true}
                    value={coordinate}
                    auto="hide"
                  />
                )}
                {propertyData.address?.city && (
                  <div className="mt-2 me-1">
                    <button
                      className={`btn ${styles.btn_rating}`}
                      style={{ color: "var(--text-color)" }}
                    >
                      {propertyData?.address?.city} ,{" "}
                      {propertyData?.address?.state}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          "No listing found"
        )}
        <div style={{background: '#f7f7f7'}}>
          <div className={`${styles.detailpage} container py-4`}>
        <Carousel />
        </div>
        </div>
        {(responsiveView !== "xs" || responsiveView !== "xs") && <Footer />}

        {(responsiveView === "xs" || responsiveView === "sm") && (
          <HostDetails
            price={`${CurrencyList?.currency} ${currencyRate(
              propertyData.price,
              currency.exchange_rate
            )}`}
            responsiveView={responsiveView}
            ids={productId}
            cateId={propertyData.categoryId}
            i18={i18}
          />
        )}
      </div>
      {open ? (
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <div className="d-flex justify-content-between align-items-center container my-4">
            <div className="d-flex justify-content-between">
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="container">
            <div className="col-md-8 m-auto">
              <ImageList
                sx={{ width: "100%", height: "100%" }}
                variant="masonry"
                cols={3}
                gap={8}
                className={`${styles.imagesection}`}
                // rowHeight={121}
              >
                {image.map((item: any) => (
                  <ImageListItem key={item._id} cols={2} rows={2}>
                    <img
                      {...srcset(APIURLS.baseUrl + item.imagePath, 121, 2, 2)}
                      alt="ddd"
                      onError={handleImageError}
                      loading="lazy"
                      onClick={handleClickImageOpen}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
          </div>
        </Dialog>
      ) : null}

      {imageopen ? (
        <>
          <Drawer
            open={imageopen}
            anchor="bottom"
            PaperProps={{
              style: {
                width: "100%",
                height: "100%",
                backgroundColor: "var(--footer-text-color)"
              }
            }}
          >
            <div className="d-flex m-3 ">
              <IconButton
                edge="start"
                color="inherit"
                onClick={handlemodalImageClose}
                aria-label="close"
                style={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <PhotoCarousel data={propertyData} />
          </Drawer>
        </>
      ) : null}

      <CustomModal
        open={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        title={i18?.ROOMPAGE?.SHARETHISPLACE || "Share this place"}
      >
        <SocialModal
          image={galleryImage[0].img}
          name={propertyData && propertyData.propertyName}
        />
      </CustomModal>
    </>
  );
}
