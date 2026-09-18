"use client";
import React, { useState, useEffect, useMemo } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar, DateObject } from "react-multi-date-picker";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import ImageComponent from "@/components/ImageComponent";
import { useAppSelector } from "@/redux/hooks";
import CustomModal from "@/components/modal";
import Textarea from "@/components/textArea";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { dispatch } from "@/redux/store";
import {
  BookingID,
  fetchBookingData,
  getBookingData,
  isLoadingPayment,
  isLoading,
  paymentStatus,
} from "@/redux/slice/user/BookingSlice";
import { getListingData } from "@/redux/slice/listdataSlice";
import { APIURLS } from "@/services/config";
import { setModal } from "@/redux/slice/modalSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import { getDatesBetween } from "@/services/utils/dateFunctions";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { Loader } from "@/components/loader";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";
import DateHourBox from "@/components/HourPicker/index";
import { formatDateTime } from "@/services/utils/datetime";
import { GenerateUrl } from "@/services/utils/helperURL";
import { searchSelector } from "@/redux/slice/searchValue";

import "../../../components/header.scss";
import styles from "./page.module.scss";
import { userSelector } from "@/redux/slice/user/userSlice";
import { currencyRate } from "@/Utils/currencyRate";

const formatDate = (date: any) => {
  const startDate = new Date(date);
  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, "0");
  const day = String(startDate.getDate()).padStart(2, "0");
  const formattedStartDate = `${year}-${month}-${day}`;
  return formattedStartDate;
};

const Bookings = () => {
  const propertyData = useSelector(
    (state: any) => state.listingData.ListingData
  );
  console.log('propertyData', propertyData)
  const { CurrencyList } = useAppSelector(currencySelector);
  const { i18, currency, settings } = usePageContext();
  const { estimation } = useSelector((state: any) => state.bookingEstimation);
  // const HourlyBooking = settings?.hiddenSettings?.bookingType === 'Hour' ? true : false
  const HourlyBooking = estimation?.bookingType === "Hour" ? true : false;
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState("");
  console.log("activeButton", activeButton);
  const [methodButton, setMethodButton] = useState("");
  const [dates, setDates] = React.useState<any>([]);
  const loading = useSelector(
    (state: any) => state.bookingEstimation.loadingPayment
  );
  const LoaderPage = useSelector((state: any) => state.listingData.loading);
  const listData = useSelector((state: any) => state.listingData);
  const searchParams: any = useSearchParams();
  const [list, setlist] = useState<string[]>([]);
  const [maxNight, setMaxNight] = useState<any>();
  const [minNight, setMinNight] = useState<any>();
  const formatedDatefn = (date: any) => {
    if (typeof date === "string" && date.length > 0) {
      let newDate: any = new Date(date.split("/").reverse().join("-"));
      newDate = newDate.toISOString();
      return newDate;
    } else {
      return null;
    }
  };
  const handleButtonClick = (button: any) => {
    if(button ===  "cash"){
      setMethodButton("");
    }
    setActiveButton(button);
  };
  const handleMethodClick = (button: any) => {
    setMethodButton(button);
  };
  const [openDiscount, setOpenDiscount] = React.useState(false);

  const handleOpenDiscount = () => {
    setOpenDiscount(true);
  };
  const handleCloseDiscount = () => {
    setOpenDiscount(false);
  };

  const [openGuest, setOpenGuest] = React.useState(false);
  const [openDate, setOpenDate] = React.useState(false);
  const [checkinDate, setcheckinDate] = React.useState(false);
  const [checkoutDate, setcheckoutDate] = React.useState(false);

  // const handleOpenGuest = () => {
  //   setOpenGuest(true)
  // }
  const handleCloseGuest = () => {
    setOpenGuest(false);
    setCountAdult(parseInt(estimation.Adult));
    setCountChildren(parseInt(estimation.Children));
    setCountPet(parseInt(estimation.Pets));
  };
  const handleOpenDate = () => {
    setOpenDate(true);
  };
  const handleCloseDate = () => {
    setOpenDate(false);
  };
  // const handleOpenCheckin = () => {
  //   setcheckoutDate(false)
  //   setcheckinDate(true)
  // }
  // const handleOpenCheckout = () => {
  //   setcheckinDate(false)
  //   setcheckoutDate(true)
  // }
  const initialAdultCount = parseInt(estimation.Adult);
  const initialChildrenCount = parseInt(estimation.Children);
  const initialPetCount = parseInt(estimation.Pets);
  const [CountAdult, setCountAdult] = useState(initialAdultCount);
  const [CountChildren, setCountChildren] = useState(initialChildrenCount);
  const [CountPet, setCountPet] = useState(initialPetCount);
  const [time, setTime] = useState<any>([]);
  const [routeData, setRouteData] = useState<any>({});
  const queryString = window.location.search;
  const urlsearchparams = new URLSearchParams(queryString);
  const current = Object.fromEntries(searchParams);
  const id = urlsearchparams.get("id");
  const cate = urlsearchparams.get("cate");
  const propertyName = urlsearchparams.get("property");
  useEffect(() => {
    const userId = localStorage?.getItem("appUserId");
    setRouteData(current);
    setCountAdult(parseInt(current?.adults) || 0);
    setCountChildren(parseInt(current?.children) || 0);
    setCountPet(parseInt(current?.pets) || 0);
  }, [searchParams]);

  const estimate = async () => {
    if (cate) {
      const GeneUrl: any = GenerateUrl(cate, propertyName, id);
      dispatch(isLoading(true));
      const response = await dispatch(fetchBookingData(current.id, current));
      if (response?.statusCode === 200) {
        dispatch(isLoading(false));
      } else {
        router.push(GeneUrl);
      }
    }
  };

  useEffect(() => {
    estimate();
  }, []);

  const handleIncreaseAdult = () => {
    const maxGuests = parseInt(listData?.ListingData?.guest.adult) || 0;
    if (CountAdult < maxGuests) {
      setCountAdult(CountAdult + 1);
    }
  };
  const handleDecreaseAdult = () => {
    if (CountAdult > 1) {
      setCountAdult(CountAdult - 1);
    }
  };
  const handleIncreaseChildren = () => {
    const maxGuests = parseInt(listData?.ListingData?.guest.children) || 0;
    if (CountChildren < maxGuests) {
      setCountChildren(CountChildren + 1);
    }
  };
  const handleDecreaseChildren = () => {
    if (CountChildren > 0) {
      setCountChildren(CountChildren - 1);
    }
  };
  const handleIncreasePet = () => {
    const maxGuests = parseInt(listData?.ListingData?.guest.pets) || 0;
    if (CountPet < maxGuests) {
      setCountPet(CountPet + 1);
    }
  };
  const handleDecreasePet = () => {
    if (CountPet > 0) {
      setCountPet(CountPet - 1);
    }
  };
  // const startDate = formatDate(estimation.startDate)
  // const endDate = formatDate(estimation.endDate)
  const { status } = useAppSelector(userSelector);
  const auth = status.loginStatus;
  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };
  useEffect(() => {
    if (methodButton === 'razorpay')
      loadRazorpayScript();
  }, [methodButton])

  const handleBooking = async () => {
    if (auth) {
      try {
        const data = {
          currency: currency?.code,
          adults: String(estimation.Adult || routeData.adults),
          pets: String(estimation.Pets || routeData.pets),
          children: String(estimation.Children || routeData.children),
          startDate: String(estimation.startDate || routeData.startDate),
          endDate: String(estimation.endDate || routeData.endDate),
          bookingType: String(estimation.bookingType || routeData.bookingType),
          paymentMode: activeButton,
          paymentMethod: methodButton === "" ? "stripe" : methodButton,
        };

        if (activeButton === "") {
          dispatch(
            addAlert({
              isOpen: true,
              message: `${i18?.BOOKINGPAGE?.SELECTPAYMENTMODE || "Payment mode"}`,
              type: "error",
              severity: "error",
            })
          );
          return; // Add return to stop execution
        }
        else if ((settings?.hiddenSettings?.razorpay === '1') && methodButton === '' && activeButton !== 'cash') {
          dispatch(
            addAlert({
              isOpen: true,
              message: `${i18?.BOOKINGPAGE?.SELECTPAYMENTMODE || "Payment mode"}`,
              type: "error",
              severity: "error",
            })
          );
          return; // Add return to stop execution
        }
        else {
          try {
            dispatch(isLoadingPayment(true));
            const res = await dispatch(getBookingData(routeData.id, data));

            // Handle stripe payment method
            if (methodButton === 'stripe') {
              if (res.statusCode === 200) {
                localStorage.setItem("invoiceId", res.data.booking.invoiceId);
                dispatch(BookingID(res.data.booking.invoiceId));
                router.push("/rooms/booking/paymentStripe");
              } else {
                dispatch(isLoadingPayment(false));
                dispatch(
                  addAlert({
                    isOpen: true,
                    message: res.message,
                    type: "error",
                    severity: "error"
                  })
                );
              }
            }
            // Handle razorpay payment method
            else if (methodButton === 'razorpay') {
              dispatch(isLoadingPayment(false));
              const options = {
                key: settings?.razorPayGateway?.razorpayKeyId,
                amount: res?.data?.booking?.payment?.amount,
                currency: res?.data?.booking?.payment?.currency,
                order_id: res?.data?.booking?.payment?.id,
                handler: async function (response: any) {
                  const value = {
                    ...response,
                    paymentMethod: methodButton,
                    invoiceId: res?.data?.booking?.invoiceId,
                  };
                  const apiResponse = await dispatch(
                    paymentStatus(null, value)
                  );
                  if (apiResponse?.instantBooking) {
                    router.push("/user/trips/?trip=acceptedBooking");
                  } else {
                    router.push("/user/trips/?trip=pendingBooking");
                  }
                },
              };
              if (typeof window !== undefined) {
                // @ts-ignore
                var rzp1: any = new window.Razorpay(options);
                rzp1.open();
              }
            }
            // Handle cash payment method
            else if (activeButton === "cash") {
              if (res.statusCode === 200) {
                router.push("/rooms/booking/bookingSuccess?paymentMode=cash");
              } else {
                dispatch(
                  addAlert({
                    isOpen: true,
                    message: res.message,
                    type: "error",
                    severity: "error",
                  })
                );
              }
            }
            // Handle phonepe payment method
            else if (methodButton === 'phonepe') {
              localStorage.setItem("invoiceId", res.data.booking.invoiceId);
              if (res?.data?.booking?.payment?.redirectUrl) {
                window.location.href = res?.data?.booking?.payment?.redirectUrl;
              }
            }
            // Default case (shouldn't happen with proper validation)
            else {
              dispatch(isLoadingPayment(false));
              dispatch(
                addAlert({
                  isOpen: true,
                  message: "Invalid payment method selected",
                  type: "error",
                  severity: "error"
                })
              );
            }
          } catch (error: any) {
            dispatch(isLoadingPayment(false));
            dispatch(
              addAlert({
                isOpen: true,
                message: error.response?.data?.message || "User not verified",
                type: "error",
                severity: "error",
              })
            );
          }
        }
      } catch (error: any) {
        dispatch(isLoadingPayment(false));
        dispatch(
          addAlert({
            isOpen: true,
            message: "User not verified",
            type: "error",
            severity: "error",
          })
        );
      }
    } else {
      dispatch(setModal("SignupModal" as any));
    }
  };
  const handleDateChange = () => {
    // const current = Object.fromEntries(searchParams);

    const data: any = {
      currency: currency?.code,
      bookingType: HourlyBooking ? "Hour" : "Day",
      adults: estimation.Adult,
      children: estimation.Children,
      pets: estimation.Pets,
      startDate: HourlyBooking
        ? formatDateTime(time[0]?.toDate()) || formatDate(estimation.startDate)
        : formatDateTime(dates[0]?.toDate()) ||
        formatDate(estimation.startDate),
      endDate: HourlyBooking
        ? formatDateTime(time[1]?.toDate()) || formatDate(estimation.endDate)
        : formatDateTime(dates[1]?.toDate()) || formatDate(estimation.endDate),
      id: current.id,
    };
    dispatch(fetchBookingData(current.id, data));
    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");
    // router.replace(`/rooms/booking?${queryString}`)
    window.history.replaceState(
      { path: `?${queryString}` },
      "",
      `?${queryString}`
    );
    setOpenDate(false);
    setcheckinDate(false);
    setcheckoutDate(false);
    // dispatch(addAlert({
    //   isOpen: true,
    //   message: "Dates updated",
    //   type: "success",
    //   severity: "success",
    // }));
  };
  const handleGuestChange = () => {
    const data: any = {
      bookingType: HourlyBooking ? "Hour" : "Day",
      adults: CountAdult,
      children: CountChildren,
      pets: CountPet,
      startDate: formatedDatefn(estimation.startDate),
      endDate: formatedDatefn(estimation.endDate),
      id: current.id,
    };
    dispatch(fetchBookingData(current.id, data));
    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");
    // router.replace(`/rooms/booking?${queryString}`)
    window.history.replaceState(
      { path: `?${queryString}` },
      "",
      `?${queryString}`
    );
    setOpenGuest(false);
    // dispatch(addAlert({
    //   isOpen: true,
    //   message: "Guest count updated",
    //   type: "success",
    //   severity: "success",
    // }));
  };

  const [responsiveView, setResponsiveView] = useState<any>("");

  useEffect(() => { }, [responsiveView]);

  const handleResize = () => {
    const windowWidth = window.innerWidth;

    const breakpoints = [
      { name: "xs", width: 0, maxWidth: 575 },
      { name: "sm", width: 576, maxWidth: 767 },
      { name: "md", width: 768, maxWidth: 991 },
      { name: "lg", width: 992, maxWidth: 1199 },
      { name: "xl", width: 1200, maxWidth: 1399 },
      { name: "xxl", width: 1400 },
    ];

    let responsiveVw =
      breakpoints.find(
        (bp: any) => windowWidth >= bp?.width && windowWidth <= bp?.maxWidth
      )?.name || "xxl";

    if (responsiveVw !== responsiveView) {
      setResponsiveView(responsiveVw);
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const fetchData = async () => {
    const userId = localStorage?.getItem("appUserId");
    const res = await dispatch(getListingData(current.id, userId));
    if (res.statusCode === 200) {
      const list = res.data.listing[0];
      const blockedDate = list?.priceData[0]?.blockedDates;

      if (Array.isArray(blockedDate) && blockedDate.length > 0) {
        const lists: string[][] = [];
        blockedDate?.map((date: any) => {
          const startDate = new Date(date.start);
          const endDate = new Date(date.end);
          const dates = getDatesBetween(startDate, endDate);
          lists.push(dates);
        });
        setlist(lists.flat());
      }
      setMaxNight(list?.priceData[0]?.bookingType?.maximumNight);
      setMinNight(list?.priceData[0]?.bookingType?.minimumNight);
    }
  };
  useEffect(() => {
    fetchData();
    dispatch(isLoadingPayment(false));
  }, []);
  const img = listData?.ListingData?.attachmentData?.[0]?.image?.coverImage;

  useEffect(() => {
    const fromDate = current.startDate
      ? new DateObject({
        date: new Date(current.startDate),
        format: "DD/MM/YYYY",
      })
      : null;
    const toDate = current.endDate
      ? new DateObject({
        date: new Date(current.endDate),
        format: "DD/MM/YYYY",
      })
      : null;
    if (current.startDate && current.endDate) {
      setDates([fromDate, toDate]);
    } else if (current.startDate) {
      setDates([fromDate]);
    } else {
      setDates([]);
    }
  }, []);

  console.log("hiddenSettings", settings.hiddenSettings)
  console.log("hiddenSettingsDate&Time", settings.hiddenSettings.dateFormat, settings.hiddenSettings.timeFormat)
  console.log("time&Date", settings.dateFormat, settings.timeFormat)

  // const utcDates = useMemo(() => {
  //   const startDate = new DateObject({
  //     date: new Date(estimation.startDate)
  //   }).toUTC();
  //   let startDateStr = startDate.format(settings.dateFormat || "YYYY/MM/DD");
  //   let startDay = startDate.format("dddd"); // Get day name

  //   if (HourlyBooking) {
  //     startDateStr += ' ' + startDate.format(settings.timeFormat || "h A")
  //   }

  //   const endDate = new DateObject({
  //     date: new Date(estimation.endDate)
  //   }).toUTC();

  //   let endDateStr = endDate.format(settings.dateFormat || "YYYY/MM/DD");
  //   let endDay = endDate.format("dddd"); // Get day name

  //   if (HourlyBooking) {
  //     endDateStr += ' ' + endDate.format(settings.timeFormat || "h A")
  //   }
  //   console.log('utcDates', startDateStr, endDateStr,startDay, endDay)
  //   return {
  //     startDate: startDateStr,
  //     endDate: endDateStr,
  //     startDay: startDay,
  //     endDay: endDay
  //   }

  // }, [estimation, HourlyBooking]);

  // calculate min date from selected date
  // const getMinDate = useMemo(() => {
  //   const minSelectableDate = new DateObject().add(1, "days");
  //   // if from date is selected & to date is unselected
  //   if (dates && dates.length === 1) {
  //     // if maximum night from both sides are within the today date
  //     const maxBeforeSelectable = new DateObject(dates[0]).subtract(maxNight, "days");

  //     if (maxBeforeSelectable.valueOf() > minSelectableDate.valueOf()) {
  //       let currentDatePointer = new DateObject(dates[0]);
  //       // adjust min date based on blocked dates
  //       for (let i = 0; i < maxNight; ++i) {
  //         currentDatePointer.subtract(1, "days");

  //         if (list.includes(currentDatePointer.format('DD-MM-YYYY'))) {
  //           return currentDatePointer.add(1, "days");;
  //         }
  //       }

  //       return currentDatePointer.add(1, "days");
  //     }
  //   }
  //   return minSelectableDate;
  // }, [dates])

  // // calculate max date from selected date
  // const getMaxDate = useMemo(() => {

  //   const maxSelectableDate = new DateObject().add(180, "days");
  //   // if from date is selected & to date is unselected
  //   if (dates && dates.length === 1 && maxNight > 1) {
  //     const maxAfterSelectable = new DateObject(dates[0]).add(maxNight, "days");
  //     if (maxSelectableDate.valueOf() > maxAfterSelectable.valueOf()) {

  //       let currentDatePointer = new DateObject(dates[0]);
  //       // adjust min date based on blocked dates
  //       for (let i = 0; i < maxNight; ++i) {
  //         currentDatePointer.add(1, "days");
  //         if (list.includes(currentDatePointer.format('DD-MM-YYYY'))) {
  //           return currentDatePointer.subtract(1, "days");
  //         }
  //       }
  //       currentDatePointer.subtract(1, "days");
  //     }
  //   }

  //   // maximum 6 months from current Date
  //   return maxSelectableDate;
  // }, [dates])

  const utcDates = useMemo(() => {
    const startDateObj = new DateObject({
      date: new Date(estimation.startDate),
    }).toUTC();

    const endDateObj = new DateObject({
      date: new Date(estimation.endDate),
    }).toUTC();

    const startDay = startDateObj.format("dddd");
    const endDay = endDateObj.format("dddd");

    let startDateStr = startDateObj.format(settings.dateFormat || "YYYY/MM/DD");
    let endDateStr = endDateObj.format(settings.dateFormat || "YYYY/MM/DD");

    if (HourlyBooking) {
      startDateStr += " " + startDateObj.format(settings.timeFormat || "h A");
      endDateStr += " " + endDateObj.format(settings.timeFormat || "h A");
    }

    const startDayData = propertyData?.schedule?.find((d: any) => d.day === startDay);
    const endDayData = propertyData?.schedule?.find((d: any) => d.day === endDay);

    // Extract only openingTime from start day
    const openingTime = startDayData?.openingTime ?? "";
    // Extract only closingTime from end day
    const closingTime = endDayData?.closingTime ?? "";

    const finalStart = `${startDay}, ${startDateStr} (${openingTime})`;
    const finalEnd = `${endDay}, ${endDateStr} (${closingTime})`;
    console.log('utcDates', startDay, endDay, openingTime, closingTime)
    return {
      startDate: startDateStr,
      endDate: endDateStr,
      startDay,
      endDay,
      finalStart,
      finalEnd,
      openingTime,
      closingTime,
    };
  }, [estimation, HourlyBooking, propertyData, settings]);



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
  console.log("settings", settings);
  const redirectToPhonePe = (phonepeUrl: string) => {
    window.location.href = phonepeUrl;
  };
  return (
    <>
      {loading && <Loader />}

      <div className={`${styles.booking}`}>
        {responsiveView === "sm" || responsiveView === "xs" ? (
          LoaderPage ? (
            <div>
              <div className={`${styles.box1}`}>
                <div className={`${styles.image}`}>
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height={150}
                    className={`${styles.picture}`}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    height={25}
                    width={100}
                  />
                </div>
              </div>
              <div className={`${styles.box2}`}>
                <div className={`${styles.content2}`}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    height={30}
                  />
                  <div className={`${styles.content}`}>
                    <div className={`${styles.grid}`}>
                      <div>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={250}
                        />
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={15}
                          width={200}
                        />
                      </div>
                      <div>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={250}
                        />
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={15}
                          width={200}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.box4}`}>
                <div className={`${styles.content2}`}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    height={30}
                  />
                  <div className={`${styles.buttn}`}>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={40}
                      sx={{ borderRadius: "5px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={40}
                      sx={{ borderRadius: "5px" }}
                    />
                  </div>
                </div>
                <div className={`${styles.btn}`}>
                  <Skeleton
                    variant="rectangular"
                    width={200}
                    height={40}
                    sx={{ borderRadius: "5px" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={`${styles.headerMobile}`}>
                <div className={`${styles.content}`}>
                  <div
                    onClick={() => {
                      router.back();
                    }}
                    className={`${styles.backArrowMob}`}
                  >
                    <ChevronLeftIcon sx={{ color: "black" }} />
                  </div>
                  <div className={`${styles.paraMobile}`}>
                    <h3 className="req_To_Book">
                      {i18?.BOOKINGPAGE?.REQUESTTOBOOK || "Request to Book"}
                    </h3>
                  </div>
                </div>
              </div>
              <div className={`${styles.box1}`}>
                <div className={`${styles.image}`}>
                  {listData?.ListingData?.attachmentData?.[0].image
                    .coverImage && (
                      <ImageComponent
                        src={
                          listData?.ListingData?.attachmentData?.[0].image
                            .coverImage
                        }
                        alt="coverImage"
                        width={200}
                        height={150}
                        className={`${styles.picture}`}
                        onError={handleImageError}
                      />
                    )}
                  <div className="mobile-head_name">
                    <p className="mb-0">
                      <b>{listData.ListingData.propertyName}</b>
                    </p>
                    <span className="mb-2">
                      {listData.ListingData.propertyTypeName}
                    </span>
                    <p className="mb-2">
                      {listData.ListingData.accomodation.bathRoom
                        .bathRoomCount !== 0 && (
                          <span>
                            {
                              listData.ListingData.accomodation.bathRoom
                                .bathRoomCount
                            }{" "}
                            {i18?.FILTER?.BATHROOMS || "Bathrooms"} &#183;
                          </span>
                        )}{" "}
                      {listData.ListingData.accomodation.bedRoomCount !== 0 && (
                        <span>
                          {listData.ListingData.accomodation.bedRoomCount}{" "}
                          {i18?.FILTER?.BEDROOMS || "Bedrooms"}
                        </span>
                      )}{" "}
                    </p>
                    <p className="mb-0">
                      {listData.ListingData.address.city &&
                        listData.ListingData.address.city}{" "}
                      {listData.ListingData.address.city && ","}{" "}
                      {listData.ListingData.address.state &&
                        listData.ListingData.address.state}{" "}
                      {listData.ListingData.address.state && ","}{" "}
                      {listData.ListingData.address.country &&
                        listData.ListingData.address.country}{" "}
                    </p>
                  </div>
                </div>
              </div>
              <hr className={`${styles.divider}`} />
              {estimation && Number(estimation.Adult) !== 0 && (
                <div className={`${styles.box2}`}>
                  <div className={`${styles.content2}`}>
                    <h4>{i18?.BOOKINGPAGE?.PRICEDETAILS || "Price details"}</h4>
                    <div className={`${styles.content}`}>
                      {/* <div className={`${styles.grid}`}>
                          <span>{i18?.BOOKINGPAGE?.AMOUNT || "Amount"}</span>
                        </div> */}
                    </div>
                    {estimation.nights !== 0 && (
                      <div className={`${styles.content}`}>
                        <p>
                          {CurrencyList.currency}
                          {listData?.ListingData?.priceData[0]?.pricing
                            ?.discountedPrice
                            ? currencyRate(
                              listData?.ListingData?.priceData[0]?.pricing
                                ?.discountedPrice,
                              currency.exchange_rate,
                              true
                            )
                            : currencyRate(
                              estimation.perDay,
                              currency.exchange_rate,
                              true
                            )}{" "}
                          {i18?.BOOKINGPAGE?.PERDAY || "per day"} *{" "}
                          {estimation.nights} {i18?.HEADER?.NIGHTS || "Nights"}{" "}
                          {/* {i18?.ROOMPAGE?.SELECTEDDAYS || "selected days"} */}{" "}
                          {/* *
                            {' '}
                            {parseInt(estimation.Adult) + parseInt(estimation.Children)} */}
                        </p>
                        <p>
                          {CurrencyList.currency}{" "}
                          <b>
                            {currencyRate(
                              estimation.dayFare,
                              currency.exchange_rate,
                              true
                            )}
                          </b>
                        </p>
                      </div>
                    )}
                    {estimation.hours !== 0 && (
                      <div className={`${styles.content}`}>
                        <p>
                          {CurrencyList.currency}{" "}
                          {currencyRate(
                            estimation.perHour,
                            currency.exchange_rate,
                            true
                          )}{" "}
                          {i18?.BOOKINGPAGE?.PERHOUR || "per hour"} *{" "}
                          {estimation.hours} {i18?.ROOMPAGE?.HOURS || "hours"}{" "}
                          {/* *
                            {' '}
                            {parseInt(estimation.Adult) + parseInt(estimation.Children)} */}
                        </p>
                        <p>
                          <b>
                            {CurrencyList.currency}{" "}
                            {currencyRate(
                              estimation.hourFare,
                              currency.exchange_rate,
                              true
                            )}
                          </b>
                        </p>
                      </div>
                    )}
                    {estimation.taxAmount > 0 && (
                      <div className={`${styles.content} total`}>
                        <p className="text-capitalize">
                          {i18?.ROOMPAGE?.TAX || "Tax"}(
                          {estimation.taxPercentage}
                          %)
                        </p>
                        <p>
                          <b>
                            {CurrencyList.currency}
                            {currencyRate(
                              estimation.taxAmount,
                              currency.exchange_rate,
                              true
                            )}
                          </b>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`${styles.content3} total`}>
                    <h5>{i18?.ROOMPAGE?.TOTAL || "Total"}</h5>
                    <h5>
                      {CurrencyList.currency}{" "}
                      {currencyRate(
                        estimation.fareAmount,
                        currency.exchange_rate,
                        true
                      )}
                    </h5>
                  </div>
                </div>
              )}
              <hr className={`${styles.divider}`} />
              <div className={`${styles.box3}`}>
                <div className={`${styles.Left}`}>
                  <h4 className="text-capitalize">
                    {i18?.BOOKINGPAGE?.YOURTRIP || "Your trip"}
                  </h4>
                  <div className={`${styles.content}`}>
                    <h4>{i18?.BOOKINGPAGE?.DATES || "Dates"}</h4>
                    {/* {
                        !HourlyBooking &&
                        <p className='text-decoration-underline' onClick={handleOpenDate}>{i18?.BOOKINGPAGE?.EDIT || "Edit"}</p>                
                      } */}
                  </div>
                  <div className={`${styles.item}`}>
                    {HourlyBooking ? (
                      <>
                        <div className="d-grid">
                          <div className="d-flex justify-content-between">
                            <p>
                              <b>{i18?.ROOMPAGE?.CHECKINN || "Check-in"}</b> :{" "}
                              {utcDates.startDate}
                            </p>
                            {/* <p className='text-decoration-underline' onClick={handleOpenCheckin}>{i18?.BOOKINGPAGE?.EDIT || "Edit"}</p> */}
                          </div>
                          <div className="d-flex justify-content-between">
                            <p>
                              <b>{i18?.ROOMPAGE?.CHECK_OUT || "Check-out"}</b> :{" "}
                              {utcDates.endDate}
                            </p>
                            {/* <p className='text-decoration-underline' onClick={handleOpenCheckout}>{i18?.BOOKINGPAGE?.EDIT || "Edit"}</p> */}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>
                        {dayjs(estimation.startDate).format(
                          settings.dateFormat || "YYYY/MM/DD"
                        )}{" "}
                        --{" "}
                        {dayjs(estimation.endDate).format(
                          settings.dateFormat || "YYYY/MM/DD"
                        )}
                      </p>
                    )}
                    {estimation.nights !== 0 && estimation.hours !== 0 && (
                      <p style={{ color: "var(--text-color)" }}>
                        {estimation.nights}{" "}
                        {estimation.nights > 1
                          ? i18?.HEADER?.NIGHTS || "Nights"
                          : i18?.TRIPS?.NIGHT || "Night"}{" "}
                        {estimation.hours}{" "}
                        {estimation.hours > 1
                          ? i18?.TRIPS?.HOURS || "Hours"
                          : i18?.TRIPS?.HOUR || "Hour"}
                      </p>
                    )}
                    {estimation.nights !== 0 && estimation.hours === 0 && (
                      <p style={{ color: "var(--text-color)" }}>
                        {estimation.nights}{" "}
                        {estimation.nights > 1
                          ? i18?.HEADER?.NIGHTS || "Nights"
                          : i18?.TRIPS?.NIGHT || "Night"}
                      </p>
                    )}
                    {estimation.nights === 0 && estimation.hours !== 0 && (
                      <p style={{ color: "var(--text-color)" }}>
                        {estimation.hours}{" "}
                        {estimation.hours > 1
                          ? i18?.TRIPS?.HOURS || "Hours"
                          : i18?.TRIPS?.HOUR || "Hour"}
                      </p>
                    )}
                  </div>

                  {parseInt(estimation?.Adult) +
                    parseInt(estimation?.Children) !==
                    0 && (
                      <div>
                        <div className={`${styles.content}`}>

                          <h4>{i18?.ROOMPAGE?.GUESTS || "Guests"}</h4>
                          {/* <p className='text-decoration-underline' onClick={handleOpenGuest}>{i18?.BOOKINGPAGE?.EDIT || "Edit"}</p> */}
                        </div>
                        <div className={`${styles.item}`}>
                          <p>
                            {parseInt(estimation?.Adult) +
                              parseInt(estimation?.Children)}{" "}
                            {parseInt(estimation?.Adult) +
                              parseInt(estimation?.Children) >
                              1
                              ? i18?.ROOMPAGE?.GUESTS || "Guests"
                              : i18?.TRIPS?.GUEST || "Guest"}
                            {parseInt(estimation?.Pets)
                              ? `, ${parseInt(estimation?.Pets)} ${i18?.FILTER?.PETS || "Pets"
                              }`
                              : ""}
                          </p>
                        </div>
                      </div>
                    )}
                  {/* <div className={`${styles.content}`}>
             <h4>
               Discount code
             </h4>
             <p onClick={handleOpenDiscount}>
               Edit
             </p>
           </div> */}
                </div>
              </div>
              <hr className={`${styles.divider}`} />
              <div className={`${styles.box4}`}>
                <div className={`${styles.content2}`}>
                  <h4>{i18?.BOOKINGPAGE?.PAYMENTMODE || "Payment mode"}</h4>
                  <div className={`${styles.buttn}`}>
                    {(settings?.hiddenSettings?.stripe === "1" ||
                      settings?.hiddenSettings?.razorpay === "1") && (
                        <button
                          onClick={() => handleButtonClick("card")}
                          className={`${activeButton === "card"
                            ? styles.active
                            : styles.disabled
                            } text-capitalize`}
                        >
                          {i18?.BOOKINGPAGE?.CARD || "Card"}
                        </button>
                      )}
                    {settings?.hiddenSettings?.cash === "1" && (
                      <button
                        onClick={() => handleButtonClick("cash")}
                        className={`${activeButton === "cash" ? styles.active : ""
                          }`}
                      >
                        {/* {i18?.BOOKINGPAGE?.CASH || "Cash"} */}
                        Pay at hotel
                      </button>
                    )}
                  </div>
                  {activeButton === "card" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {
                        <button
                          onClick={() => handleMethodClick("phonepe")}
                          className={`${methodButton === "phonepe" ? styles.active : ""
                            } text-capitalize`}
                        >
                          {/* {i18?.BOOKINGPAGE?.CARD || "Card"} */}
                          {i18?.BOOKINGPAGE?.PHONEPE || "PhonePe"}
                        </button>
                      }
                      {settings?.hiddenSettings?.stripe === "1" && (
                        <button
                          onClick={() => handleMethodClick("stripe")}
                          className={`${methodButton === "stripe" ? styles.active : ""
                            } text-capitalize`}
                        >
                          {i18?.BOOKINGPAGE?.STRIPE || "Stripe"}
                        </button>
                      )}
                      {settings?.hiddenSettings?.razorpay === "1" && (
                        <>
                          <button
                            onClick={() => handleMethodClick("razorpay")}
                            className={`${methodButton === "razorpay" ? styles.active : ""
                              } text-capitalize`}
                          >
                            {/* {i18?.BOOKINGPAGE?.CARD || "Card"} */}
                            RazorPay
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className={`${styles.btn}`}>
                  <button
                    onClick={
                      auth
                        ? handleBooking
                        : () =>
                          router.push(
                            `/login?redirecturl=${window.encodeURIComponent(
                              pathname + window.location.search
                            )})`
                          )
                    }
                  // disabled={ activeButton !== "card" }
                  >
                    {i18?.BOOKINGPAGE?.BOOK || "Book"}
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            <Header center="hide" page="hide" />
            <div className={`${styles.body}`}>
              {LoaderPage ? (
                <div>
                  <div className={`${styles.header}`}>
                    <div className={`${styles.content}`}>
                      <div className={`${styles.backArrow}`}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={15}
                          width={20}
                        />
                      </div>
                      <div className={`${styles.para}`}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={15}
                          width={200}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.main}`}>
                    <div className={`${styles.Left}`}>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1rem" }}
                        height={25}
                        width={200}
                      />
                      <div className={`${styles.content}`}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={200}
                        />
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={100}
                        />
                      </div>
                      <div className={`${styles.item}`}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={200}
                        />
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={100}
                        />
                      </div>

                      <div className={`${styles.content}`}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={200}
                        />
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={100}
                        />
                      </div>
                      <div className={`${styles.item}`}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={200}
                        />
                      </div>
                      <div className={`${styles.content2}`}>
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          height={25}
                          width={200}
                        />
                        <div className={`${styles.buttn}`}>
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={40}
                            sx={{ borderRadius: "5px" }}
                          />
                          <Skeleton
                            variant="rectangular"
                            width={80}
                            height={40}
                            sx={{ borderRadius: "5px" }}
                          />
                        </div>
                      </div>
                      <div className={`${styles.btn}`}>
                        <Skeleton
                          variant="rectangular"
                          width={200}
                          height={40}
                          sx={{ borderRadius: "5px" }}
                        />
                      </div>
                    </div>
                    <div className={`${styles.Right}`}>
                      <div className={`${styles.box}`}>
                        <div className={`${styles.content1}`}>
                          <Skeleton
                            variant="rectangular"
                            width={200}
                            height={150}
                            className={`${styles.picture}`}
                          />
                          <div className={`${styles.content}`}>
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1rem" }}
                              height={25}
                              width={100}
                            />
                          </div>
                        </div>
                        <div className={`${styles.content2}`}>
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1rem" }}
                            height={15}
                            width={20}
                          />
                          <div className={`${styles.content}`}>
                            <div className={`${styles.grid}`}>
                              <Skeleton
                                variant="text"
                                sx={{ fontSize: "1rem" }}
                                height={25}
                                width={200}
                              />
                              <Skeleton
                                variant="text"
                                sx={{ fontSize: "1rem" }}
                                height={25}
                                width={100}
                              />
                            </div>
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1rem" }}
                              height={25}
                              width={50}
                            />
                          </div>
                          <div className={`${styles.content}`}>
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1rem" }}
                              height={25}
                              width={200}
                            />
                            <Skeleton
                              variant="text"
                              sx={{ fontSize: "1rem" }}
                              height={25}
                              width={50}
                            />
                          </div>
                        </div>
                        <div className={`${styles.content3}`}>
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1rem" }}
                            height={25}
                            width={100}
                          />
                          <Skeleton
                            variant="text"
                            sx={{ fontSize: "1rem" }}
                            height={25}
                            width={50}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="request-book">
                  <div className={`${styles.header}`}>
                    <div className={`${styles.content}`}>
                      <div
                        onClick={() => {
                          router.back();
                        }}
                        className={`${styles.backArrow}`}
                      >
                        <ChevronLeftIcon
                          sx={{ color: "black", cursor: "pointer" }}
                        />
                      </div>
                      <div className={`${styles.para}`}>
                        <h3>
                          {i18?.BOOKINGPAGE?.REQUESTTOBOOK || "Request to Book"}{" "}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.main}`}>
                    <div className={`${styles.Left}`}>
                      <h4
                        style={{
                          fontSize: "var(--host-index-title)",
                          color: "var(--footer-text-color)",
                          fontWeight: 700,
                        }}
                        className="text-capitalize"
                      >
                        {i18?.BOOKINGPAGE?.YOURTRIP || "Your trip"}
                      </h4>
                      {/* <div className={`${styles.content}`}>
                        <h4
                          style={{ fontWeight: "font-weight: 800 !important" }}
                        >
                          {i18?.BOOKINGPAGE?.DATES || "Dates"}
                        </h4>
                      </div> */}
                      {/* {
                            !HourlyBooking &&
                            <p className='text-decoration-underline' onClick={handleOpenDate}>
                              {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                            </p>
                          } */}
                      <div className={`${styles.item}`}>
                        <div className={styles.dateDisplay}>
                          <div className={styles.date}>
                            <span className={styles.label}>
                              <b>{i18?.ROOMPAGE?.CHECKINN || "Check-in"}</b>{" "}
                            </span>
                            <span className={styles.value}>
                              {utcDates.startDate}
                            </span>
                            <p>{utcDates.openingTime}</p>

                          </div>
                          <div className={`${styles.arrow} px-3`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24"
                              viewBox="0 0 24 24"
                              width="24"
                              fill="#888"
                            >
                              <path
                                d="M2 12h20m0 0-6-6m6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>

                          <div className={styles.date}>
                            <span className={styles.label}>
                              <b>{i18?.ROOMPAGE?.CHECK_OUT || "Check-out"}</b>
                            </span>
                            <span className={styles.value}>
                              {utcDates.endDate}
                            </span>
                            <p>{utcDates.closingTime}</p>
                          </div>

                          {/* <p className='text-decoration-underline' onClick={handleOpenCheckout}>{i18?.BOOKINGPAGE?.EDIT || "Edit"}</p> */}

                          {/* <p className='text-decoration-underline' onClick={handleOpenCheckin}>{i18?.BOOKINGPAGE?.EDIT || "Edit"}</p> */}
                        </div>

                        {estimation.nights !== 0 && estimation.hours !== 0 && (
                          <p style={{ color: "var(--text-color)" }}>
                            {estimation.nights}{" "}
                            {estimation.nights > 1
                              ? i18?.HEADER?.NIGHTS || "Nights"
                              : i18?.TRIPS?.NIGHT || "Night"}{" "}
                            {estimation.hours}{" "}
                            {estimation.hours > 1
                              ? i18?.TRIPS?.HOURS || "Hours"
                              : i18?.TRIPS?.HOUR || "Hour"}
                          </p>
                        )}
                        {estimation.nights !== 0 && estimation.hours === 0 && (
                          <p style={{ color: "var(--text-color)" }}>
                            {estimation.nights}{" "}
                            {estimation.nights > 1
                              ? i18?.HEADER?.NIGHTS || "Nights"
                              : i18?.TRIPS?.NIGHT || "Night"}
                          </p>
                        )}
                        {estimation.nights === 0 && estimation.hours !== 0 && (
                          <p style={{ color: "var(--text-color)" }}>
                            {estimation.hours}{" "}
                            {estimation.hours > 1
                              ? i18?.TRIPS?.HOURS || "Hours"
                              : i18?.TRIPS?.HOUR || "Hour"}
                          </p>
                        )}
                      </div>
                      {settings?.hiddenSettings?.peopleCount === "0" &&
                        settings?.listings?.specifications === "1" &&
                        parseInt(estimation?.Adult) +
                        parseInt(estimation?.Children) !==
                        0 && (
                          <div>
                            <div className={`${styles.content}`}>
                              <h4 style={{ fontWeight: 800 }}>
                                {i18?.RESERVATIONS?.GUESTS || "Guests"}
                              </h4>
                              {/* Uncomment the button if you need the edit functionality */}
                              {/* <p className='text-decoration-underline' onClick={handleOpenGuest}>
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </p> */}
                            </div>
                            <div className={`${styles.item}`}>
                              <p style={{ color: "var(--text-color)" }}>
                                {parseInt(estimation?.Adult) +
                                  parseInt(estimation?.Children)}{" "}
                                {parseInt(estimation?.Adult) +
                                  parseInt(estimation?.Children) >
                                  1
                                  ? i18?.RESERVATIONS?.GUESTS || "Guests"
                                  : i18?.TRIPS?.GUEST || "Guest"}
                                {parseInt(estimation?.Pets)
                                  ? `, ${parseInt(estimation?.Pets)} Pets`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        )}

                      {/* <div className={`${styles.content}`}>
             <h4>
               Discount code
             </h4>
             <p onClick={handleOpenDiscount}>
               Edit
             </p>
           </div> */}

                      <div className={`${styles.content2}`}>
                        <h4>
                          {i18?.BOOKINGPAGE?.PAYMENTMODE || "Payment mode"}
                        </h4>
                        <div className={`${styles.buttn} text-capitalize`}>
                          {(settings?.hiddenSettings?.stripe === "1" ||
                            settings?.hiddenSettings?.razorpay === "1") && (
                              <button
                                onClick={() => handleButtonClick("card")}
                                className={`${activeButton === "card" ? styles.active : ""
                                  } text-capitalize`}
                              >
                                {i18?.BOOKINGPAGE?.CARD || "card"}
                              </button>)
                          }
                          {
                            settings?.hiddenSettings?.cash === '1' &&
                            <button onClick={() => handleButtonClick('cash')} className={`${activeButton === 'cash' ? styles.active : ''}`}>
                              {/* {i18?.BOOKINGPAGE?.CASH || "Cash"} */}
                              Pay at hotel
                            </button>}
                          {/* <button onClick={() => handleButtonClick('other')} className={`${activeButton === 'other' ? styles.active : ''}`}>
                   Others
                 </button> */}
                        </div>
                      </div>
                      <div className={`${styles.content2}`}>
                        {activeButton === "card" && (
                          <div
                            style={{
                              width: "100% ",
                              display: "flex",
                              justifyContent: "center",
                              gap: "20px",
                            }}
                          >
                            {settings?.hiddenSettings?.phonepe === "1" && (
                              <button
                                onClick={() => handleMethodClick("phonepe")}
                                className={`${methodButton === "phonepe"
                                  ? styles.active
                                  : ""
                                  } text-capitalize`}
                              >
                                {i18?.BOOKINGPAGE?.PHONEPE || "PhonePe"}

                              </button>
                            )}
                            {settings?.hiddenSettings?.stripe === "1" && (
                              <button
                                onClick={() => handleMethodClick("stripe")}
                                className={`${methodButton === "stripe" ? styles.active : ""
                                  } text-capitalize`}
                              >
                                {i18?.BOOKINGPAGE?.STRIPE || "Stripe"}

                              </button>
                            )}
                            {settings?.hiddenSettings?.razorpay === "1" && (
                              <>
                                <button
                                  onClick={() => handleMethodClick("razorpay")}
                                  className={`${methodButton === "razorpay"
                                    ? styles.active
                                    : ""
                                    } text-capitalize`}
                                >
                                  {/* {i18?.BOOKINGPAGE?.CARD || "Card"} */}
                                  RazorPay
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={`${styles.btn} text-capitalize`}>
                        <button
                          onClick={
                            auth
                              ? handleBooking
                              : () =>
                                router.push(
                                  `/login?redirecturl=${window.encodeURIComponent(
                                    pathname + window.location.search
                                  )}`
                                )
                          }
                        // disabled={ activeButton !== "card" }
                        >
                          {i18?.BOOKINGPAGE?.BOOK || "Book"}
                        </button>
                      </div>
                    </div>
                    <div className={`${styles.Right}`}>
                      <div className={`${styles.box}`}>
                        <div className={`${styles.content1}`}>
                          {listData?.ListingData?.attachmentData?.[0].image
                            .coverImage && (
                              <ImageComponent
                                src={
                                  listData?.ListingData?.attachmentData?.[0].image
                                    .coverImage
                                }
                                alt="coverImage"
                                width={200}
                                height={150}
                                className={styles.picture}
                                onError={handleImageError}
                              />
                            )}
                          <div className={`${styles.content}`}>
                            <div>
                              <p className={` mb-0 ${styles.propDetails}`}>
                                <b>{listData?.ListingData?.propertyName}</b>
                              </p>
                              <p className={` mb-0 ${styles.propDetails}`}>
                                {listData?.ListingData?.propertyTypeName}
                              </p>
                              <p className={` mb-0 ${styles.propDetails}`}>
                                {listData.ListingData.accomodation.bathRoom
                                  .bathRoomCount !== 0 && (
                                    <span>
                                      {
                                        listData.ListingData.accomodation.bathRoom
                                          .bathRoomCount
                                      }{" "}
                                      {i18?.FILTER?.BATHROOMS || "Bathrooms"}{" "}
                                      &#183;
                                    </span>
                                  )}{" "}
                                {listData.ListingData.accomodation
                                  .bedRoomCount !== 0 && (
                                    <span>
                                      {
                                        listData.ListingData.accomodation
                                          .bedRoomCount
                                      }{" "}
                                      {i18?.FILTER?.BEDROOMS || "Bedrooms"}
                                    </span>
                                  )}{" "}
                              </p>
                              <p className={` mb-0 ${styles.propDetails}`}>
                                {listData?.ListingData?.address?.city &&
                                  listData?.ListingData?.address?.city}{" "}
                                {listData?.ListingData?.address?.city && ","}{" "}
                                {listData?.ListingData?.address?.state &&
                                  listData?.ListingData?.address?.state}{" "}
                                {listData?.ListingData?.address?.state && ","}{" "}
                                {listData?.ListingData?.address?.country &&
                                  listData?.ListingData?.address?.country}{" "}
                              </p>
                            </div>
                            {/* {listData.ListingData.address?.city} , {listData.ListingData.address?.state}
               {routeData.bookingType === 'Day'
               ? (
                  <p className="m-0 leading-5 text-sm font-normal text-[#343A40] pt-[6px]">
                    $
                    {estimation.perDay}
                    {' '}
                    per day
                  </p>
                )
                : (
                  <p className="m-0 leading-5 text-sm font-normal text-[#343A40] pt-[6px]">
                    {estimation.perHour}
                    {' '}
                    per hour
                  </p>
                )} */}
                          </div>
                        </div>
                        {estimation && Number(estimation.Adult) !== 0 && (
                          <div>
                            <div className={`${styles.content2}`}>
                              <h4>
                                {i18?.BOOKINGPAGE?.PRICEDETAILS ||
                                  "Price details"}
                              </h4>
                              <div className={`${styles.content}`}>
                                {/* <div className={`${styles.grid}`}>
                                    <p className={`${styles.propDetails} m-0`} >{i18?.BOOKINGPAGE?.AMOUNT || "Amount"}</p>
                                  </div> */}
                              </div>
                              {estimation.nights !== 0 && (
                                <div className={`${styles.content}`}>
                                  <p className={`mb-0 ${styles.propDetails}`}>
                                    {CurrencyList.currency}
                                    {listData?.ListingData?.priceData[0]
                                      ?.pricing?.discountedPrice
                                      ? currencyRate(
                                        listData?.ListingData?.priceData[0]
                                          ?.pricing?.discountedPrice,
                                        currency.exchange_rate,
                                        true
                                      )
                                      : currencyRate(
                                        estimation.perDay,
                                        currency.exchange_rate,
                                        true
                                      )}
                                    {i18?.BOOKINGPAGE?.PERDAY || "per day"} *{" "}
                                    {estimation.nights}{" "}
                                    {i18?.HEADER?.NIGHTS || "Nights"}{" "}
                                    {/* {i18?.ROOMPAGE?.SELECTEDDAYS || "selected days"} */}{" "}
                                    {/* *
                                      {' '}
                                      {parseInt(estimation.Adult) + parseInt(estimation.Children)} */}
                                  </p>
                                  <p className={` mb-0 ${styles.propDetails}`}>
                                    {CurrencyList.currency}{" "}
                                    {currencyRate(
                                      estimation.dayFare,
                                      currency.exchange_rate
                                    )}
                                  </p>
                                </div>
                              )}
                              {estimation.hours !== 0 && (
                                <div className={`${styles.content}`}>
                                  <p className={`mb-0 ${styles.propDetails}`}>
                                    {CurrencyList.currency}
                                    {currencyRate(
                                      estimation.perHour,
                                      currency.exchange_rate,
                                      true
                                    )}{" "}
                                    {i18?.BOOKINGPAGE?.PERHOUR || "per hour"} *{" "}
                                    {estimation.hours}{" "}
                                    {i18?.ROOMPAGE?.HOURS || "hours"}{" "}
                                    {/* *
                                      {' '}
                                      {parseInt(estimation.Adult) + parseInt(estimation.Children)} */}
                                  </p>
                                  <p className={` mb-0 ${styles.propDetails}`}>
                                    {CurrencyList.currency}{" "}
                                    {currencyRate(
                                      estimation.hourFare,
                                      currency.exchange_rate,
                                      true
                                    )}
                                  </p>
                                </div>
                              )}
                              {estimation.taxAmount > 0 && (
                                <div className={`${styles.content}`}>
                                  <p
                                    className={` mb-0 ${styles.propDetails} text-capitalize`}
                                  >
                                    {i18?.ROOMPAGE?.TAX || "Tax"}(
                                    {estimation.taxPercentage}%)
                                  </p>
                                  <p
                                    className={` mb-0 ${styles.propDetails}`}
                                    style={{ textDecoration: "None" }}
                                  >
                                    {CurrencyList.currency}{" "}
                                    {currencyRate(
                                      estimation.taxAmount,
                                      currency.exchange_rate,
                                      true
                                    )}
                                  </p>
                                </div>
                              )}
                              {/* <div className={`${styles.content}`}>
                                  <p>{i18?.BOOKINGPAGE?.COMMISSIONAMOUNT || "commission amount"}</p>
                                  <p>{CurrencyList.currency}{estimation.commissionAmount}</p>
                                </div> */}
                            </div>
                            <div className={`${styles.content3} total`}>
                              <h5 className={` mb-0 ${styles.propDetails}`}>
                                {i18?.ROOMPAGE?.TOTAL || "Total"}
                              </h5>
                              <h5
                                className={` mb-0 ${styles.propDetails}`}
                                style={{ textDecoration: "None" }}
                              >
                                {CurrencyList.currency}{" "}
                                {currencyRate(
                                  estimation.fareAmount,
                                  currency.exchange_rate,
                                  true
                                )}
                              </h5>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />

      <CustomModal
        open={openDiscount}
        onClose={handleCloseDiscount}
        title="Discount"
      >
        <div className="p-3">
          <div className={`${styles.ModalHeader}`}>
            <h4>{i18?.BOOKINGPAGE?.DISCOUNTCODE || "Discount code"}</h4>
            <p>
              {i18?.ROOMPAGE?.ENTERYOURDISCOUNTCODE ||
                "Enter your discount code"}{" "}
              :
            </p>
          </div>
          <div className={`${styles.input_container}`}>
            <Textarea className="input-field" placeholder="Code:"></Textarea>
          </div>
        </div>
        <div
          className={`${styles.modal_button} border-top d-flex justify-content-end`}
        >
          <button className={`${styles.btn}`}>
            {i18?.ROOMPAGE?.SAVE || "Save"}
          </button>
        </div>
      </CustomModal>

      <CustomModal
        open={openGuest}
        onClose={handleCloseGuest}
        title={i18?.ROOMPAGE?.EDITGUESTS || "Edit guests"}
      >
        <div className={`${styles.modalGuest} p-3`}>
          <div className={`${styles.ModalHeaderGuest}`}>
            <div>
              <h4>{i18?.BOOKINGPAGE?.ADULT || "Adult"}</h4>
              <p>
                {i18?.BOOKINGPAGE?.MAX || "Max"}{" "}
                {listData?.ListingData?.guest?.adult}{" "}
                {i18?.ROOMPAGE?.ADULT || "adult"}
              </p>
            </div>

            <button
              disabled={listData?.ListingData?.guest?.adult === 1}
              onClick={handleDecreaseAdult}
              className={`${styles.add_btn}`}
            >
              -
            </button>
            <div>{CountAdult}</div>
            <button
              disabled={CountAdult >= listData?.ListingData?.guest?.adult}
              onClick={handleIncreaseAdult}
              className={`${styles.add_btn}`}
            >
              +
            </button>
            <div></div>
          </div>

          <div className={`${styles.ModalHeaderGuest}`}>
            <div>
              <h4>{i18?.BOOKINGPAGE?.CAMELCASECHILD || "Child"}</h4>
              <p>
                {i18?.BOOKINGPAGE?.MAX || "Max"}{" "}
                {listData?.ListingData?.guest?.children}{" "}
                {i18?.BOOKINGPAGE?.CHILD || "Child"}
              </p>
            </div>

            <button
              disabled={listData?.ListingData?.guest?.children === 1}
              onClick={handleDecreaseChildren}
              className={`${styles.add_btn}`}
            >
              -
            </button>
            <div>{CountChildren}</div>

            <button
              disabled={CountChildren >= listData?.ListingData?.guest?.children}
              onClick={handleIncreaseChildren}
              className={`${styles.add_btn}`}
            >
              +
            </button>
            <div></div>
          </div>

          <div className={`${styles.ModalHeaderGuest}`}>
            <div>
              <h4>{i18?.BOOKINGPAGE?.CAMELCASEPET || "pet"}</h4>
              <p>
                {i18?.BOOKINGPAGE?.MAX || "Max"}{" "}
                {listData?.ListingData?.guest?.pets}{" "}
                {i18?.BOOKINGPAGE?.PET || "pet"}
              </p>
            </div>

            <button
              disabled={listData?.ListingData?.guest?.pets === 1}
              onClick={handleDecreasePet}
              className={`${styles.add_btn}`}
            >
              -
            </button>
            <div>{CountPet}</div>

            <button
              disabled={CountPet >= listData?.ListingData?.guest?.pets}
              onClick={handleIncreasePet}
              className={`${styles.add_btn}`}
            >
              +
            </button>
            <div></div>
          </div>
        </div>
        <div className={`${styles.modal_button} border-top`}>
          <button onClick={handleCloseGuest} className={`${styles.button2}`}>
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          <button onClick={handleGuestChange} className={`${styles.btn}`}>
            {i18?.ROOMPAGE?.SAVE || "Save"}
          </button>
        </div>
      </CustomModal>
      <CustomModal
        className="edit-date"
        open={openDate}
        onClose={handleCloseDate}
        title={i18?.PROFILE?.EDITDATES || "Edit Dates"}
      >
        <div className={`${styles.calendar} p-3`}>
          <Calendar
            value={dates}
            onChange={setDates}
            minDate={getMinDate}
            maxDate={getMaxDate}
            mapDays={({ date }) => {
              const formattedDate = date.format("DD-MM-YYYY");
              const isblocked = list.includes(formattedDate);
              if (isblocked) {
                return {
                  disabled: true,
                  style: { backgroundColor: "#ccc", color: "#fff" },
                };
              }
            }}
            numberOfMonths={1}
            className="rmdpprime"
            range
            rangeHover
            format="DD/MM/YYYY"
          />
        </div>
        <div className={`${styles.modal_button} border-top`}>
          <button onClick={handleCloseDate} className={`${styles.button2}`}>
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          <button className={`${styles.btn}`} onClick={handleDateChange}>
            {i18?.ROOMPAGE?.SAVE || "Save"}
          </button>
        </div>
      </CustomModal>
      <CustomModal
        open={checkinDate}
        onClose={() => setcheckinDate(false)}
        title={i18?.PROFILE?.EDITDATES || "Edit Dates"}
      >
        <div className={`${styles.calendar} p-3`}>
          <DateHourBox
            type="from"
            time={dates}
            value={dates[0]}
            onChange={(mydate: any) => {
              setDates([mydate, dates[1]]);
            }}
          />
        </div>
        <div className={`${styles.modal_button} border-top`}>
          <button
            onClick={() => setcheckinDate(false)}
            className={`${styles.button2}`}
          >
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          <button className={`${styles.btn}`} onClick={handleDateChange}>
            {i18?.ROOMPAGE?.SAVE || "Save"}
          </button>
        </div>
      </CustomModal>
      <CustomModal
        open={checkoutDate}
        onClose={() => setcheckoutDate(false)}
        title={i18?.PROFILE?.EDITDATES || "Edit Dates"}
      >
        <div className={`${styles.calendar} p-3`}>
          <DateHourBox
            type="to"
            time={dates}
            value={dates[1]}
            onChange={(mydate: any) => {
              setDates([dates[0], mydate]);
            }}
          />
        </div>
        <div className={`${styles.modal_button} border-top`}>
          <button
            onClick={() => setcheckoutDate(false)}
            className={`${styles.button2}`}
          >
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          <button className={`${styles.btn}`} onClick={handleDateChange}>
            {i18?.ROOMPAGE?.SAVE || "Save"}
          </button>
        </div>
      </CustomModal>
    </>
  );
};
export default Bookings;
