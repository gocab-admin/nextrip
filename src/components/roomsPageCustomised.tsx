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
import { Calendar, DateObject } from "react-multi-date-picker";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";
import Drawer from "@mui/material/Drawer";
import { getApiMethod } from "@/services/global";
import { setConfirmModaData, setModal } from "@/redux/slice/modalSlice";
import { getDatesBetween } from "@/services/utils/dateFunctions";
import {
  resetEstimation,
  getBookingEstimationSuccess,
  isLoadingPayment,
} from "@/redux/slice/user/BookingSlice";
import { RatingIcon, ShareIcon, HeartIcon, Report } from "@/app/global/svg";
import RoomsDescription from "@/components/roomDescription";
import APICONSTANT, { APIURLS } from "@/services/config";
import RoomHeader from "@/app/rooms/header";
import { usePageContext } from "@/components/Providers/PageContext";
import {
  addArrImage,
  detailSelector,
  addListPrice,
  addListDiscountPrice,
  addListDiscountPercentage,
  setCoordinate,
  addListHourPrice,
} from "@/redux/slice/detailSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getListData, setAmenities } from "@/redux/slice/listdataSlice";
import { parseId } from "@/services/utils/helperURL";
import { addAlert } from "@/redux/slice/AlertSlice";
import { bedsCount, listingSelector } from "@/redux/slice/listingSlice";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { generateData } from "@/components/helper";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { handleImageError } from "@/services/utils/utils";

import "./header.scss";
import styles from "@/app/rooms/page.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { Loader } from "./loader";
import CustomModal from "./modal";
import SocialModal from "./SocialModal";
import PhotoCarousel from "./photoCarousel";
import Header from "./header";
import MobilereserveBox from "./MobilereserveBox";
import WishListHeart from "./wishlistheart";
import { Tooltip } from "@mui/material";
import RoomsPageloader from "./roomspageloader";
import RoomspageImageLayout from "./roomspageImageLayout";
import { currencyRate } from "@/Utils/currencyRate";
import BookingBox from "./BookingBox";
import Bookitcalndar from "./bookitcalndar";
import { getImageUrl } from "./ImageComponent";

dayjs.extend(relativeTime);

function checkIfDate(dateString: any) {
  // Regular expression for YYYY-MM-DD
  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyPattern.test(dateString)) {
    return true;
  }
  return false;
}

const ReviewSection = dynamic(() => import("../app/rooms/reviewsSection"));
const RatingsSection = dynamic(() => import("../app/rooms/ratingSection"));
// const AmenitiesSection = dynamic(() => import("../app/rooms/AmenitySection"));
const PrivilegeSection = dynamic(() => import("../app/rooms/PrivilegeSection"));
const HostDetails = dynamic(() => import("../app/rooms/hostDetailsComponent"));
const RulesSection = dynamic(() => import("../app/rooms/rulesComponent"));
const BedCarousel = dynamic(() => import("../app/rooms/bedCarousel"));
const StudioCarousel = dynamic(() => import("../app/rooms/studioCarousel"));
const WeeklyFullCalendar = dynamic(() => import("@/app/rooms/WeeklyFullCalendar"));
const Footer = dynamic(() => import("./footer"));
const MapComponent = dynamic(() => import("./EmbedMap"), {
  loading: () => <p>Loading...</p>,
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
    srcSet: `${image}?w=${size * cols}&h=${size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const weekdayMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function Home({ props, pages }: any) {
  const searchParams: any = useSearchParams();
  // const slugid = searchParams.get("id");

  const sectionIds = [
    "section1",
    "section2",
    "section3",
    "section4",
    "section5",
  ];

  const userId =
    typeof window !== "undefined" ? localStorage?.getItem("appUserId") : null;

  const dispatch = useAppDispatch();
  const { estimation } = useSelector((state: any) => state.bookingEstimation);
  const propertyData = useSelector(
    (state: any) => state.listingData.ListingData
  );
  const amenityData = useSelector(
    (state: any) => state.listingData.amenities
  );

  console.log('amenityData', amenityData)
  // const TimeDate = useSelector(
  //   (state: any) => state?.SearchValue?.value?.timeanddate
  // );
  const loader = useSelector(
    (state: any) => state.bookingEstimation.loadingPayment
  );

  const { CurrencyList } = useAppSelector(currencySelector);
  const { DetailsList } = useAppSelector(detailSelector);
  const { ListInfo } = useAppSelector(listingSelector);

  const { i18, currency, settings, responsiveView } = usePageContext();
  const { google, listings, app } = settings;
  const HourlyBooking = settings?.hiddenSettings?.hourlyBooking;
  const APIKEY = google?.mapApiKey;
  const isAuth =
    typeof window !== "undefined" && localStorage?.getItem("appToken")
      ? true
      : false;

  const { price, hourprice, image, coordinate, discountprice, discountpercentage } = DetailsList;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [maxNight, setMaxNight] = useState<any>();
  const [minNight, setMinNight] = useState<any>();
  const [dates, setDates] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [imageopen, setImageOpen] = useState(false);
  const [imglist, setImglist] = useState<any[]>([]);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("Hour");

  const [pplCount, setPplCount] = useState<any>({
    adult: 1,
    children: 0,
    pet: 0,
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("section1");
  const [isSticky, setIsSticky] = useState(false);
  const [stickyBtn, setstickyBtn] = useState(false);
  const [bedCountData, setBedCountData] = useState<any>(null);
  const [list, setlist] = useState<string[]>([]);
  const [bookedhours, setBookedHours] = useState<[number, number][]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [galleryImage, setGalleryImage] = useState([
    {
      img: "https://a0.muscache.com/im/pictures/b7c9264d-73c9-45c3-882e-6e9577d63d68.jpg",
      title: "CoverImage",
      rows: 2,
      cols: 2,
    },
    {
      img: "https://a0.muscache.com/im/pictures/4588d88f-0224-42f4-94cb-594f4d362fba.jpg",
      title: "gallery1",
    },
    {
      img: "https://a0.muscache.com/im/pictures/150e47d8-76b8-4233-8724-cbbd12880848.jpg",
      title: "gallery2",
    },
    {
      img: "https://a0.muscache.com/im/pictures/4588d88f-0224-42f4-94cb-594f4d362fba.jpg",
      title: "gallery3",
    },
    {
      img: "https://a0.muscache.com/im/pictures/150e47d8-76b8-4233-8724-cbbd12880848.jpg",
      title: "gallery4",
    },
  ]);

  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
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

  const getMinDate = useMemo(() => {
    const afterSelect = new DateObject(dates[0]).add(minNight, "days");
    const minSelectableDate = new DateObject().add(2, "days");
    const condition = dates && dates.length > 0 && dates.length < 2;
    if (condition) {
      return afterSelect;
    } else {
      return minSelectableDate;
    }
  }, [dates]);

  const getMaxDate = useMemo(() => {
    const maxDate = new DateObject(dates[0]).add(maxNight, "days");
    const afterSelect = "";
    const condition = dates && dates.length > 0 && dates.length < 2;
    if (condition) {
      return maxDate;
    } else {
      return afterSelect;
    }
  }, [dates]);

  const dateRangeMobile = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      timeZone: "UTC"
    };
    let startDate = '';
    let endDate = '';
    if (dates[0]) {
      startDate = dates[0].toDate().toLocaleDateString(
        "en-GB",
        options
      );
    }
    if (dates[1]) {
      endDate = dates[1].toDate().toLocaleDateString(
        "en-GB",
        options
      );
    }
    return {
      startDate,
      endDate
    }
  }, [dates]);

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

  const scrollToSection = (refName: any) => {
    const sectionRef = sectionRefs[refName];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderTitle = () => {
    switch (dates.length) {
      case 1:
        return i18?.PAGES?.SELECTCHECK_OUTDATE || "Select check-out date";
      case 2:
        return ` ${estimation.nights || ""} ${i18?.PAGES?.NIGHTSIN || "nights in"
          } ${propertyData.address.city}, ${propertyData.address.state}`;
      default:
        return i18?.PAGES?.SELECTDATE || "Select check-in date";
    }
  };

  const fetchData = async () => {
    const view = searchParams.get("viewBy") || "";

    try {
      setLoading(true);

      const res = await getApiMethod(
        `${APICONSTANT.approvedListings}/${productId}`,
        { userId: userId, viewBy: view }
      );

      // Check if the API response is successful
      if (res.statusCode === 200) {
        const list = res.data.listing[0];
        setImglist(res.data.listing[0]?.attachmentData[0]);
        // Dispatch data to Redux store
        dispatch(getListData(list));
        dispatch(setAmenities({
          privilegeCategories: res?.data?.privilegeCategories,
          privilegeItems: res?.data?.privilegeItems,
          privileges: res?.data?.privileges
        }));

        // Generate bed count data
        if (list.accomodation?.bedRoomBedtype) {
          const bedCountData = generateData(
            list.accomodation?.bedRoomCount,
            list.accomodation?.bedRoomBedtype
          );
          setBedCountData(bedCountData);
          // Calculate total bed count and dispatch
          const bedCountArry =
            list.accomodation?.bedRoomBedtype.map(
              (item: any) => item.bedCount
            ) || [];
          const totalBedCount = bedCountArry.reduce(
            (bedSum: any, a: any) => bedSum + a,
            0
          );
          dispatch(bedsCount(totalBedCount));
        } else {
          setBedCountData([]);
          dispatch(bedsCount(0));
        }

        // Dispatch list price
        if (list.priceData && list.priceData[0] && list.priceData[0].pricing) {
          dispatch(addListPrice(list.priceData[0].pricing.perDay));
          dispatch(addListDiscountPrice(list.priceData[0].pricing.discountedPrice));
          dispatch(addListDiscountPercentage(list.priceData[0].pricing.discountPercentage));
          dispatch(addListHourPrice(list.priceData[0].pricing.perHour));
        }

        // Dispatch coordinates
        if (list.address && list.address.coordinates) {
          dispatch(
            setCoordinate({
              latitude: list.address.coordinates[0],
              longitude: list.address.coordinates[1],
            })
          );
        }

        // Handle gallery images
        if (
          list.attachmentData &&
          list.attachmentData.length > 0 &&
          list.attachmentData[0].image
        ) {
          const images = list.attachmentData[0].image;
          setGalleryImage((item) => {
            // item[0].img = APIURLS.baseUrl + images.coverImage;
            item[0].img = getImageUrl(images.coverImage);
            images.groupImage.forEach((group: any, index: any) => {
              if (item[index + 1]) {
                item[index + 1].img = getImageUrl(group.imagePath);
              }
            });
            return [...item]; // Return a new array to trigger state update
          });

          const coverImage = {
            imagePath: images.coverImage,
            _id: "coverimage001",
          };
          const groupImage = images.groupImage || [];
          dispatch(addArrImage([coverImage, ...groupImage]));
        }

        // Set max and min night values
        if (
          list.priceData &&
          list.priceData[0] &&
          list.priceData[0].bookingType
        ) {
          setMaxNight(list.priceData[0].bookingType.maximumNight);

          setMinNight(list.priceData[0].bookingType.minimumNight);
        }

        // Handle blocked dates
        const blockedDate =
          (list.priceData && list.priceData[0].blockedDates) || [];
        if (blockedDate.length > 0) {
          const bookedArr: [number, number][] = [];
          const blockedDatesArray = blockedDate.flatMap((date: any) => {
            const startDate = new DateObject({
              date: new Date(date.start),
            }).toUTC();
            const endDate = new DateObject({
              date: new Date(date.end),
            }).toUTC();
            bookedArr.push([startDate.unix, endDate.unix]);
            return getDatesBetween(startDate.toDate(), endDate.toDate());
          });
          setBookedHours(bookedArr)
          setlist(blockedDatesArray);
          if (Array.isArray(list.schedule)) {
            const weekScheduleMap: any = {};
            list.schedule.forEach((item: any) => {
              weekScheduleMap[weekdayMap[item.day]] = item;
            })
            setSchedule(weekScheduleMap)
          }
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

  const handleReserve = async (estimate = true, getapi = false) => {


    if (dates.length === 2 && dates[0] && dates[1]) {
      let startDate = dates[0];
      let endDate = dates[1] || dates[0];
      if (endDate.toUnix() < startDate.toUnix()) {
        let temp = endDate;
        endDate = startDate;
        startDate = temp;
      }

      const bodyData: any = {
        currency: currency?.code,
        bookingType: HourlyBooking == "Both" ? activeButton : HourlyBooking,
        startDate:
          HourlyBooking == "Hour" ||
            (HourlyBooking == "Both" && activeButton == "Hour")
            ? startDate.format("YYYY-MM-DDTHH:mm:ss.00Z")
            : startDate.format("YYYY-MM-DDT00:00:00.00Z"),
        endDate:
          HourlyBooking == "Hour" ||
            (HourlyBooking == "Both" && activeButton == "Hour")
            ? endDate.format("YYYY-MM-DDTHH:mm:ss.00Z")
            : endDate.format("YYYY-MM-DDT00:00:00.00Z"),
        adults: pplCount.adult,
        children: pplCount.children,
        pets: pplCount.pet,
        id: productId,
        cate: propertyData.propertyCategoryName,
        property: propertyData.propertyName,
        // discountCode:discountCode
      };
      const isBooking = estimate !== true;
      const queryString = Object.keys(bodyData)
        .map((key) => `${key}=${encodeURIComponent(bodyData[key])}`)
        .join("&");
      const url: any = `${APICONSTANT.estimation}/${productId}?${queryString}`;
      try {
        if (isBooking) {
          dispatch(isLoadingPayment(true));
        }
        const res = await getApiMethod(url);
        if (res.statusCode === 200) {
          if (
            (res.data?.estimation?.bookingType === "Day" &&
              res.data?.estimation?.dayFare > 0) ||
            (res.data.estimation.bookingType === "Hour" &&
              res.data.estimation.hourFare > 0)
          ) {
            dispatch(getBookingEstimationSuccess(res.data.estimation));
            if (isBooking) {
              router.push(`/rooms/booking?${queryString}`);
            } else {
              scrollToSection(`section5`);
            }
          } else {
            if (isBooking) dispatch(isLoadingPayment(false));
            dispatch(
              addAlert({
                isOpen: true,
                message: "Invalid booking",
                type: "error",
                severity: "error",
              })
            );
          }
        } else {
          if (isBooking) dispatch(isLoadingPayment(false));
          dispatch(resetEstimation());
          if (res.response) {
            dispatch(
              addAlert({
                isOpen: true,
                message: res.response.data.message,
                type: "error",
                severity: "error",
              })
            );
          }
        }
      } catch (error) {
        dispatch(isLoadingPayment(false));
        dispatch(resetEstimation());
        console.log(error);
      }
    } else {
      if (!getapi)
        dispatch(
          addAlert({
            isOpen: true,
            message: "Choose Dates",
            type: "error",
            severity: "error"
          })
        )
      dispatch(resetEstimation());
    }
  };

  const openDrawer = async () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const capitalizeFirstLetter = (title: string) => {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const openReportListings = () => {
    if (isAuth) {
      dispatch(setModal("ReportListing" as any));
    } else {
      dispatch(setModal("SignupModal" as any));
    }
  };

  useEffect(() => {
    dispatch(isLoadingPayment(false));
    fetchData();
  }, []);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const timeFormat = "YYYY-MM-DDTHH:mm:ss.00Z";
    const dayFormat = "YYYY-MM-DD";
    const format = activeButton == "Hour" ? timeFormat : dayFormat;
    if (dates[0]) {
      const dateHour: any = dates[0].format(format);
      currentParams.set("startDate", dateHour);
    }
    if (dates[1]) {
      const dateHour: any = dates[1].format(format);
      currentParams.set("endDate", dateHour);
    }
    window.history.replaceState(
      { path: `?${currentParams.toString()}` },
      "",
      `?${currentParams.toString()}`
    );
  }, [dates, activeButton]);

  // useEffect(() => {
  //   const queryString = window.location.search;
  //   const urlsearchparams = new URLSearchParams(queryString);
  //   const from = searchParams.get("startDate");
  //   const to = searchParams.get("endDate");
  //   const fromHour = searchParams.get("fromHour");
  //   const toHour = searchParams.get("toHour");
  //   const startDate = urlsearchparams.get("startDate");
  //   const endDate = urlsearchparams.get("endDate");
  //   let fromDate, toDate, startFormattedDate, endFormattedDate;
  //   if (checkIfDate(from)) {
  //     const changeFromDate = new Date(from).setUTCHours(10, 0, 0, 0); // Sets the time to 10:00:00.000 UTC;
  //     fromDate = from
  //       ? new DateObject({
  //           date: new Date(changeFromDate),
  //           format: "DD/MM/YYYY"
  //         }).toUTC()
  //       : null;
  //   } else {
  //     const changeFromDate = new Date(from);
  //     fromDate = from
  //       ? new DateObject({
  //           date: new Date(changeFromDate),
  //           format: "DD/MM/YYYY"
  //         }).toUTC()
  //       : null;
  //   }
  //   if (checkIfDate(from)) {
  //     toDate = to
  //       ? new DateObject({
  //           date: new Date(to),
  //           format: "DD/MM/YYYY"
  //         }).toUTC().setHour(11)
  //       : null;
  //   } else {
  //     const changeToDate = new Date(to);
  //     toDate = to
  //       ? new DateObject({
  //           date: changeToDate,
  //           format: "DD/MM/YYYY"
  //         }).toUTC()
  //       : null;
  //   }

  //   if (startDate) {
  //     const changeStartDate = new Date(startDate).setUTCHours(10, 0, 0, 0);
  //     startFormattedDate = new DateObject({
  //       date: new Date(changeStartDate),
  //       format: "DD/MM/YYYY"
  //     }).toUTC();
  //   } else {
  //     startFormattedDate = null;
  //   }
  //   if (endDate) {
  //     endFormattedDate = new DateObject({
  //       date: new Date(endDate),
  //       format: "DD/MM/YYYY"
  //     }).toUTC().setHour(10);
  //   } else {
  //     endFormattedDate = null;
  //   }

  //   const fromDateHr = from
  //     ? new DateObject({
  //         date: new Date(fromHour),
  //         format: "DD/MM/YYYY"
  //       }).toUTC()
  //     : null;

  //   const toDateHr = to
  //     ? new DateObject({
  //         date: new Date(toHour),
  //         format: "DD/MM/YYYY"
  //       }).toUTC()
  //     : null;
  //   if (from && to) {
  //     setDates([fromDate, toDate]);
  //   } else if (from) {
  //     setDates([fromDate]);
  //   } else {
  //     setDates([]);
  //   }
  //   if (
  //     HourlyBooking == "Hour" ||
  //     (HourlyBooking == "Both" && activeButton == "Hour")
  //   ) {
  //     if (fromHour && toHour) {
  //       setDatesHour([fromDateHr, toDateHr]);
  //     } else if (fromHour) {
  //       setDatesHour([fromDateHr]);
  //     } else {
  //       setDatesHour([]);
  //     }
  //   }
  // }, [HourlyBooking]);

  useEffect(() => {
    handleReserve(true, true);
  }, [dates, pplCount, HourlyBooking, activeButton]);

  useEffect(() => {
    const from = searchParams.get("startDate");
    const to = searchParams.get("endDate");
    let fromDate, toDate;

    const changeFromDate = new Date(from);
    if (checkIfDate(from)) {
      changeFromDate.setUTCHours(10, 0, 0, 0);
    }
    fromDate = from
      ? new DateObject({
        date: new Date(changeFromDate),
        format: "DD/MM/YYYY",
      }).toUTC()
      : null;

    const changeToDate = new Date(to);
    if (checkIfDate(to)) {
      changeToDate.setUTCHours(11, 0, 0, 0);
    }
    toDate = from
      ? new DateObject({
        date: new Date(changeToDate),
        format: "DD/MM/YYYY",
      }).toUTC()
      : null;

    if (from && to) {
      setDates([fromDate, toDate]);
    } else if (from) {
      setDates([fromDate]);
    } else {
      setDates([]);
    }

    const adultParam = searchParams.get("adult");
    const childrenParam = searchParams.get("children");
    const petParam = searchParams.get("pet");
    setPplCount({
      adult: adultParam ? parseInt(adultParam) : 1,
      children: childrenParam ? parseInt(childrenParam) : 0,
      pet: petParam ? parseInt(petParam) : 0,
    });
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
  console.log(' ', propertyData)
  return (
    <>
      {loader && <Loader />}
      <div>
        {responsiveView === "sm" || responsiveView === "xs" ? (
          <RoomHeader listData={propertyData} productId={productId} />
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
                      i18?.ROOMPAGE?.AMENITIES || "Amenities",
                      ...(propertyData?.reviewRating?.length > 0 ? [i18?.ROOMPAGE?.REVIEWS || "Reviews"] : []),
                      i18?.TRIPS?.LOCATION || "Location",
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
                          {CurrencyList.currency}{" "}
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
                      <DynamicButtonComponent
                        variant="contained"
                        // className={`${
                        //   propertyData.isBooking
                        //     ? styles.reservebtnDisable
                        //     : styles.reservebtn
                        // }`}s
                        onClick={handleReserve}
                        disabled={propertyData.isBooking}
                        text={
                          propertyData.isBooking
                            ? "Can't reserve your own listings"
                            : dates.length > 1
                              ? `${i18?.ROOMPAGE?.RESERVE || "Reserve"}`
                              : `${i18?.ROOMPAGE?.CHECKAVAILABILITY ||
                              "Check availability"
                              }`
                        }
                      />
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
          <div className={`${styles.detailpage} container mt-4`}>
            <div
              ref={sectionRefs.section1}
              id="section1"
              className={`${styles.detail_header} d-flex justify-content-between align-items-center`}
            >
              {responsiveView === "sm" || responsiveView === "xs" ? (
                <></>
              ) : (
                <h3 className=" mt-4 mb-0">
                  {capitalizeFirstLetter(propertyData?.propertyName || "")}
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
                          color: "var(--svg-color)",
                        }}
                      />
                      <span className={`${styles.propDetails}`}>
                        {i18?.ROOMPAGE?.SHARE}
                      </span>
                    </button>
                  </div>
                  <div>
                    <div className={` d-flex align-items-center`}>
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
                      propertyData.propertyName && (
                        <h1 className="mobile-header">
                          {propertyData.propertyName}
                        </h1>
                      )
                    ) : (
                      <></>
                    )}
                    {propertyData.propertyTypeName && (
                      <h5 className=" text-xs sub-title-text">
                        {propertyData.propertyTypeName} in{" "}
                        {propertyData.address.city},{" "}
                        {propertyData.address.state}
                      </h5>
                    )}
                    {settings?.hiddenSettings?.peopleCount === "0" &&
                      propertyData.guest && (
                        <div className=" rooms-amenities text-capitalize">
                          {(Number(propertyData.guest.adult) !== 0 ||
                            Number(propertyData.guest.children) !== 0) && (
                              <div className="mr-2 col-xs-12 col-sm-auto">
                                <p className="m-0">
                                  &nbsp;
                                  {(
                                    i18?.PRODUCT?.GUESTS ||
                                    // "Max %d guest per studio"

                                    "Max %d guest"
                                  ).replace(
                                    "%d",
                                    Number(propertyData.guest.adult) +
                                    Number(propertyData.guest.children)
                                  )}{" "}
                                  <span className={`${styles.middot}`}>
                                    &#183;
                                  </span>
                                </p>
                              </div>
                            )}
                          {Number(propertyData.accomodation.bedRoomCount) !==
                            0 && (
                              <div className="mr-2 col-xs-12 col-sm-auto">
                                <p className="m-0">
                                  {propertyData.accomodation.bedRoomCount} &nbsp;
                                  {i18?.ROOMPAGE?.BEDROOMS || "bedrooms"}{" "}
                                  <span className={`${styles.middot}`}>
                                    &#183;
                                  </span>
                                </p>
                              </div>
                            )}
                          {pages?.includes("/bed-types/") &&
                            propertyData.accomodation.bedRoomBedtype &&
                            propertyData.accomodation.bedRoomBedtype.length !==
                            0 && (
                              <div className="mr-2 col-xs-12 col-sm-auto">
                                <p className="m-0">
                                  {ListInfo.beds} {i18?.FILTER?.BEDS || "beds"}{" "}
                                  <span className={`${styles.middot}`}>
                                    &#183;
                                  </span>
                                </p>
                              </div>
                            )}
                          {(pages?.includes("/people-bed-count/") || pages?.includes("/max-guest-count/")) && (
                            <div className="col-xs-12 col-sm-auto">
                              <p className="m-0">
                                {
                                  propertyData.accomodation.bathRoom
                                    .bathRoomCount
                                }{" "}
                                {i18?.ROOMPAGE?.BATHROOM || "bathroom"}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    <div className="review-title">
                      <div className="d-flex align-items-center">
                        <p className="me-1 d-flex align-items-center">
                          <span className="me-2 mb-1">
                            <RatingIcon
                              width="15"
                              height="15"
                              fill="var(--footer-text-color)"
                            />
                          </span>
                          {propertyData.totalRatingCount !== 0
                            ? propertyData.totalRatingCount
                            : `${i18?.ROOMPAGE?.NOREVIEWSYET || "no reviews yet"
                            }`}
                          <span className="ms-1">.</span>
                        </p>
                        {propertyData.totalReviewCount !== 0 && (
                          <div
                            className="me-1"
                            style={{ color: "var(--text-color)" }}
                          >
                            {propertyData.totalReviewCount}{" "}
                            {i18?.ROOMPAGE?.REVIEWS || "Reviews"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-3">
                  <div className={`${styles.divider}`}></div>
                </div>
                <div>
                  <RulesSection />
                </div>
                <div className="my-3">
                  <div className={`${styles.divider}`}></div>
                </div>
                <div>
                  <HostDetails
                    ids={productId}
                    cateId={propertyData.propertyCategoryId}
                    i18={i18}
                  />
                </div>
                {propertyData.propertyDesc && (
                  <div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                    <div>
                      <RoomsDescription
                        desc={propertyData.propertyDesc}
                        data={propertyData.amenityCategories}
                      />
                    </div>
                  </div>
                )}
                {pages?.includes("/bed-types/") ?
                  propertyData.accomodation.bedRoomBedtype &&
                  propertyData.accomodation.bedRoomBedtype.length !== 0 && (
                    <div>
                      <div className="my-3">
                        <div className={`${styles.divider}`}></div>
                      </div>
                      <div>
                        <BedCarousel bedData={bedCountData} i18={i18} />
                      </div>
                    </div>
                  ) : (!propertyData.accomodation.bedRoomBedtype ||
                    propertyData.accomodation.bedRoomBedtype.length === 0) && <div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                    <div>
                      <StudioCarousel count={propertyData.accomodation.bedRoomCount} i18={i18} />
                    </div>
                  </div>}
                <div className={`${styles.divider}`}></div>

                {/* {propertyData.amenities && (
                  <div
                    className="my-3"
                    ref={sectionRefs.section2}
                    id="section2"
                  >
                    <AmenitiesSection />
                  </div>
                )} */}

                {Array.isArray(amenityData.privilegeItems) && amenityData.privilegeItems.length > 0 && (
                  <div className="my-3"
                    ref={sectionRefs.section2}
                    id="section2">
                    <PrivilegeSection />
                  </div>
                )}

                {activeButton == "Day" && HourlyBooking != "Hour" && (
                  <div>
                    <div
                      className={
                        responsiveView === "sm" || responsiveView === "xs"
                          ? "d-none"
                          : "col-md-12 d-md-block"
                      }
                    >
                      <div className="add-amenities">
                        <h5>{renderTitle()}</h5>
                        <p>
                          {i18?.PAGES?.ADDYOURTRAVEL ||
                            "Add your travel dates for exact pricing"}
                        </p>
                        <Calendar
                          range
                          minDate={getMinDate}
                          maxDate={getMaxDate}
                          highlightToday={false}
                          className="rmdpprime"
                          numberOfMonths={2}
                          onChange={(date: any) => {
                            if (date[0] && (!dates[0] || !dates[1])) {
                              date[0].setHour(10).setMinute(0).setSecond(0);
                            }
                            if (!dates[1] && date[1]) {
                              date[1].setHour(11).setMinute(0).setSecond(0);
                            }
                            setDates(date);
                          }}
                          mapDays={({ date }) => {
                            const formattedDate = date.format("DD-MM-YYYY");
                            const isblocked = list.includes(formattedDate);
                            if (isblocked) {
                              return {
                                disabled: true,
                                style: {
                                  backgroundColor: "#ccc",
                                  color: "#fff",
                                },
                                onClick: () =>
                                  toast.info("This date is unavailable"),
                              };
                            }
                          }}
                          value={dates}
                          rangeHover
                          format="DD/MM/YYYY"
                        />
                      </div>
                      {/* //// */}
                      <div className="text-end">
                        <button
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid transparent",
                            textDecoration: "underline",
                            textTransform: "capitalize",
                          }}
                          onClick={() => {
                            const currentParams = new URLSearchParams(
                              window.location.search
                            );
                            currentParams.delete("startDate");
                            currentParams.delete("endDate");
                            window.history.replaceState(
                              { path: `?${currentParams.toString()}` },
                              "",
                              `?${currentParams.toString()}`
                            );
                            setDates([]);
                          }}
                        >
                          {i18?.ROOMPAGE?.CLEARDATES || "clear dates"}
                        </button>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                  </div>
                )}

                {activeButton == "Hour" && (HourlyBooking === "Hour" || HourlyBooking === "Both") && false && (
                  <div>
                    <div
                      className={
                        responsiveView === "sm" || responsiveView === "xs"
                          ? "d-none"
                          : "col-md-12 d-md-block"
                      }
                    >
                      <div className="add-amenities">
                        <h5>{renderTitle()}</h5>
                        <p>
                          {i18?.PAGES?.ADDYOURTRAVEL ||
                            "Add your travel dates for exact pricing"}
                        </p>
                        <WeeklyFullCalendar dates={dates} setDates={setDates} />
                      </div>
                      {/* //// */}
                      <div className="text-end">
                        <button
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid transparent",
                            textDecoration: "underline",
                            textTransform: "capitalize",
                          }}
                          onClick={() => {
                            const currentParams = new URLSearchParams(
                              window.location.search
                            );
                            currentParams.delete("startDate");
                            currentParams.delete("endDate");
                            window.history.replaceState(
                              { path: `?${currentParams.toString()}` },
                              "",
                              `?${currentParams.toString()}`
                            );
                            setDates([]);
                          }}
                        >
                          {i18?.ROOMPAGE?.CLEARDATES || "clear dates"}
                        </button>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                  </div>
                )}

                {/* {responsiveView === 'sm' || responsiveView === "xs" ? null :   <CalendarSection/>} */}
              </div>
              <div
                className={
                  responsiveView === "sm" || responsiveView === "xs"
                    ? "d-none"
                    : "col-md-4 d-md-block"
                }
              >
                <div
                  className={`${styles.stickysidebarcontainer}`}
                  ref={sectionRefs.section5}
                  id="section5"
                >
                  <BookingBox
                    activeButton={activeButton}
                    setActiveButton={setActiveButton}
                    dates={dates}
                    setDates={setDates}
                    pplCount={pplCount}
                    setPplCount={setPplCount}
                    handleReserve={handleReserve}
                    hourprice={hourprice}
                    price={price}
                    discountprice={discountprice}
                    discountpercentage={discountpercentage}
                    maxNight={maxNight}
                    minNight={minNight}
                    list={list}
                    bookedhours={bookedhours}
                    schedule={schedule}
                  />

                  <div className="d-flex justify-content-center mt-4">
                    <Tooltip
                      title={`You don't have permission to report`}
                      arrow
                      disableHoverListener={!propertyData.isBooking}
                    >
                      <button
                        className={`${styles.report}`}
                        onClick={openReportListings}
                        disabled={propertyData.isBooking}
                      >
                        <Report
                          className="me-2"
                          style={{
                            display: "block",
                            height: "16px",
                            width: "16px",
                            fill: "#6A6A6A",
                          }}
                        />
                        Report this listing
                      </button>
                    </Tooltip>
                  </div>
                  {/* <Bookitcalndar props={productId}/> */}
                </div>
              </div>
            </div>

            <div ref={sectionRefs.section3} id="section3">
              <div>
                <RatingsSection />
              </div>
              <div>
                <ReviewSection ids={productId} />
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
        {(responsiveView !== "xs" || responsiveView !== "xs") && <Footer />}
        {(responsiveView === "sm" || responsiveView === "xs") && (
          <div className={`${styles.responsive_nav}`}>
            <div className="d-flex justify-content-between align-items-center">
              {estimation?.startDate && estimation?.endDate ? (
                <button
                  className="d-grid p-2"
                  style={{ cursor: "pointer", border: "none" }}
                >
                  <p
                    className="d-flex mb-0 align-items-center"
                    style={{
                      marginBottom: "0",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {CurrencyList.currency}&nbsp;
                    {HourlyBooking == "Hour" ||
                      (HourlyBooking == "Both" && activeButton == "Hour")
                      ? currencyRate(
                        estimation.perHour || hourprice,
                        currency.exchange_rate
                      )
                      : currencyRate(
                        estimation?.perDay || price,
                        currency.exchange_rate
                      )}
                    &nbsp;
                    <span>
                      {HourlyBooking == "Both" && activeButton == "Hour"
                        ? i18?.PRODUCT?.HOUR || "hour"
                        : i18?.PRODUCT?.NIGHT || "night"}
                    </span>
                  </p>
                  <div
                    className="d-grid"
                    style={{
                      fontSize: "var(--homepage-footer-size)",
                      color: "var(--footer-text-color)",
                      textDecoration: "underline",
                    }}
                    onClick={openDrawer}
                  // onClick={() => {
                  //   dispatch(
                  //     setConfirmModaData({
                  //       name: "EditDateModal",
                  //       modal: { getMinDate, getMaxDate, list, dates },
                  //     })
                  //   );
                  // }}
                  >
                    {`${dateRangeMobile.startDate} - ${dateRangeMobile.endDate}`}
                  </div>
                </button>
              ) : (
                <div className="review-title">
                  <div className="d-flex">
                    <p className="me-1 d-flex">
                      <span className="me-2 mb-1">
                        <RatingIcon
                          width="15"
                          height="15"
                          fill="var(--footer-text-color)"
                        />
                      </span>
                      <p className="d-flex">
                        {propertyData.totalRatingCount !== 0
                          ? propertyData.totalRatingCount
                          : `${i18?.ROOMPAGE?.NOREVIEWSYET || "no reviews yet"
                          }`}
                      </p>
                      <span className="ms-1">.</span>
                    </p>
                    {propertyData.totalReviewCount !== 0 && (
                      <div
                        className="me-1"
                        style={{ color: "var(--text-color)" }}
                      >
                        {propertyData.totalReviewCount}{" "}
                        {i18?.ROOMPAGE?.REVIEWS || "Reviews"}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <DynamicButtonComponent
                  variant="contained"
                  onClick={openDrawer}
                  className={`${styles.button}`}
                  text={
                    dates.length > 1
                      ? `${i18?.ROOMPAGE?.RESERVE || "Reserve"}`
                      : `${i18?.ROOMPAGE?.CHECKAVAILABILITY ||
                      "Check availability"
                      }`
                  }
                />

                <MobilereserveBox
                  open={isDrawerOpen}
                  onClose={closeDrawer}
                  activeButton={activeButton}
                  setActiveButton={setActiveButton}
                  hourprice={hourprice}
                  price={price}
                  dates={dates}
                  setDates={setDates}
                  maxNight={maxNight}
                  minNight={minNight}
                  list={list}
                  pplCount={pplCount}
                  setPplCount={setPplCount}
                  handleReserve={handleReserve}
                  schedule={schedule}
                  bookedhours={bookedhours}
                />

                {/* <MobilereserveBox2
                  open={true}
                  onClose={closeDrawer}
                  price={estimation?.perDay || price}
                  hourPrice={estimation.perHour || hourprice}
                  listData={propertyData}
                  ids={productId}
                  maxNight={maxNight}
                  minNight={minNight}
                  list={list}
                /> */}
              </div>
            </div>
          </div>
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
                backgroundColor: "var(--footer-text-color)",
              },
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
