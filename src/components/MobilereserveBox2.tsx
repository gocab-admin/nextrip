"use client";
import React, { useMemo, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import { AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
dayjs.extend(toObject);

import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { addAlert } from "@/redux/slice/AlertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchBookingData,
  isLoadingPayment
} from "@/redux/slice/user/BookingSlice";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { usePageContext } from "@/components/Providers/PageContext";
import { Time, formatDateTime } from "@/services/utils/datetime";
import { formatNumber } from "@/Utils/formatNumberWithCommas";

import "./header.scss";
import styles from "./searchbar.module.scss";
import { Loader } from "./loader";
import { currencyRate } from "@/Utils/currencyRate";

const Accordion = dynamic(() => import("@mui/material/Accordion"));
const AccordionDetails = dynamic(
  () => import("@mui/material/AccordionDetails")
);
const DateHourBox = dynamic(() => import("./HourPicker_Mob_design3/index"));

const MobilereserveBox = ({
  open,
  onClose,
  price,
  hourPrice,
  listData,
  ids,
  maxNight,
  minNight,
  list
}: {
  open: boolean;
  onClose: () => void;
  price: any;
  hourPrice: any;
  listData: any;
  ids: any;
  maxNight: any;
  minNight: any;
  list: any;
}) => {
  const { i18, settings, currency } = usePageContext();
  const dayIn: any = new DateObject()
    .setHour(new DateObject().hour + 2)
    .setMinute(0);
  const dayOut: any = new DateObject().setHour(dayIn.hour + 4).setMinute(0);
  const { listings } = settings;
  const [activeButton, setActiveButton] = useState("Hour");
  // const HourlyBooking =
  //   settings?.hiddenSettings?.hourlyBooking === "Both"
  //     ? activeButton
  //     : settings?.hiddenSettings?.hourlyBooking;
  const HourlyBooking = settings?.hiddenSettings?.hourlyBooking;
  const { estimation } = useSelector((state: any) => state.bookingEstimation);
  const loader = useSelector(
    (state: any) => state.bookingEstimation.loadingPayment
  );
  const { CurrencyList } = useAppSelector(currencySelector);
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const dispatch = useAppDispatch();
  const handleDrawerClose = () => {
    onClose();
  };
  const [checkin, setCheckin] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [time, setTime] = useState<any>([]);
  const [guest, setGuest] = useState(false);
  const [search, setSearch] = useState(false);
  const [dates, setDates] = useState<any>([]);
  const [datesHour, setDatesHour] = useState<any>([]);
  const [pplCount, setPplCount] = useState<any>({
    adult: 1,
    infant: 0,
    pet: 0
  });
  const handleButtonClick = (button: any) => {
    setActiveButton(button);
  };
  const hourlyBooking = settings?.hiddenSettings?.hourlyBooking;
  const [expanded, setExpanded] = React.useState<any>(false);
  const [dateChangeKey, setDateChangeKey] = useState(Date.now());
  const [timeIn, setTimeIn] = useState<any>(dayIn);
  const [timeOut, setTimeOut] = useState<any>(dayOut);
  const [checkInHour, setCheckInHour] = useState(
    Time(timeIn?.toDate()) || Time(dayIn?.toDate())
  );
  const [checkOutHour, setCheckOutHour] = useState(
    Time(timeOut?.toDate()) || Time(dayOut?.toDate())
  );

  const handleChange = (panel: any) => (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleIncrement = (value: any) => {
    setPplCount({
      ...pplCount,
      [value]: pplCount[value] + 1
    });
  };

  const handleDecrement = (value: any) => {
    setPplCount({
      ...pplCount,
      [value]: pplCount[value] - 1
    });
  };
  const formatedDatefn = (date: any) => {
    if (typeof date === "string" && date.length > 0) {
      let newDate: any = new Date(date.split("/").reverse().join("-"));
      // newDate = newDate.toISOString();
      return newDate;
    } else {
      return null;
    }
  };
  const date1 = dayjs(formatedDatefn(dates[dates.length - 1]?.format()));
  const night = date1.diff(formatedDatefn(dates[0]?.format()), "day") || 1;
  let startDate = timeIn?.toDate();
  let endDate = timeOut?.toDate();
  if (endDate < startDate) {
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
        ? formatDateTime(dates[0]?.toDate())
        : formatedDatefn(dates[0]?.format()),
    endDate:
      HourlyBooking == "Hour" ||
      (HourlyBooking == "Both" && activeButton == "Hour")
        ? formatDateTime(dates[1]?.toDate())
        : formatedDatefn(dates[dates.length - 1]?.format()),
    adults: pplCount.adult,
    children: pplCount.infant,
    pets: pplCount.pet,
    id: ids
    // discountCode:discountCode
  };
  const queryString = Object.keys(bodyData)
    .map((key) => `${key}=${encodeURIComponent(bodyData[key])}`)
    .join("&");

  // const estimations = async (url: string) => {
  //     dispatch(isLoadingPayment(true))
  //     const res = await getApiMethod(url);
  //     if (res.statusCode === 200) {
  //         dispatch(addAlert({
  //             isOpen: true,
  //             message: res.message,
  //             type: "success",
  //             severity: "success",
  //         }));
  //         router.push(`booking?${queryString}`)
  //     } else {
  //         dispatch(isLoadingPayment(false))
  //         dispatch(addAlert({
  //             isOpen: true,
  //             message: res.response.data.message,
  //             type: "error",
  //             severity: "error",
  //         }));
  //     }
  // }

  const handleReserve = async () => {
    if (
      (dates.length > 1 && activeButton === "Day") ||
      (dates.length > 1 && timeOut && activeButton === "Hour")
    ) {
      dispatch(isLoadingPayment(true));
      const res = await getApiMethod(
        `${APICONSTANT.estimation  }/${ids}?${queryString}`
      );
      if (res.statusCode === 200) {
        dispatch(
          addAlert({
            isOpen: true,
            message: res.message,
            type: "success",
            severity: "success"
          })
        );
        router.push(`/rooms/booking?${queryString}`);
      } else {
        dispatch(isLoadingPayment(false));
        dispatch(
          addAlert({
            isOpen: true,
            message: res.response.data.message,
            type: "error",
            severity: "error"
          })
        );
      }
    } else {
      setCheckin(!checkin);
    }
  };
  // const getMinDate = useMemo(() => {
  //     const minSelectableDate = new DateObject().add(1, "days");
  //     // if from date is selected & to date is unselected
  //     if (dates && dates.length === 1) {
  //         // if maximum night from both sides are within the today date
  //         const maxBeforeSelectable = new DateObject(dates[0]).subtract(maxNight, "days");

  //         if (maxBeforeSelectable.valueOf() > minSelectableDate.valueOf()) {
  //             let currentDatePointer = new DateObject(dates[0]);
  //             // adjust min date based on blocked dates
  //             for (let i = 0; i < maxNight; ++i) {
  //                 currentDatePointer.subtract(1, "days");

  //                 if (list.includes(currentDatePointer.format('DD-MM-YYYY'))) {
  //                     return currentDatePointer.add(1, "days");;
  //                 }
  //             }

  //             return currentDatePointer.add(1, "days");
  //         }
  //     }
  //     return minSelectableDate;
  // }, [dates])
  // const getMaxDate = useMemo(() => {

  //     const maxSelectableDate = new DateObject().add(180, "days");
  //     // if from date is selected & to date is unselected
  //     if (dates && dates.length === 1 && maxNight > 1) {
  //         const maxAfterSelectable = new DateObject(dates[0]).add(maxNight, "days");
  //         if (maxSelectableDate.valueOf() > maxAfterSelectable.valueOf()) {

  //             let currentDatePointer = new DateObject(dates[0]);
  //             // adjust min date based on blocked dates
  //             for (let i = 0; i < maxNight; ++i) {
  //                 currentDatePointer.add(1, "days");
  //                 if (list.includes(currentDatePointer.format('DD-MM-YYYY'))) {
  //                     return currentDatePointer.subtract(1, "days");
  //                 }
  //             }
  //             currentDatePointer.subtract(1, "days");
  //         }
  //     }

  //     // maximum 6 months from current Date
  //     return maxSelectableDate;
  // }, [dates])

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

  const togglecheckin = () => {
    setCheckout(false);
    setCheckin(true);
    setSearch(false);
    setGuest(false);
  };
  const togglecheckout = () => {
    setCheckout(true);
    setCheckin(false);
    setSearch(false);
    setGuest(false);
  };
  useEffect(() => {
    if (
      (dates.length === 2 && activeButton === "Day") ||
      (datesHour.length > 1 && timeOut && activeButton === "Hour")
    ) {
      const bodyData: any = {
        currency: currency?.code,
        bookingType: HourlyBooking == "Both" ? activeButton : HourlyBooking,
        startDate:
          HourlyBooking == "Hour" ||
          (HourlyBooking == "Both" && activeButton == "Hour")
            ? formatDateTime(dates[0]?.toDate())
            : formatedDatefn(dates[0]?.format()),
        endDate:
          HourlyBooking == "Hour" ||
          (HourlyBooking == "Both" && activeButton == "Hour")
            ? formatDateTime(dates[1]?.toDate())
            : formatedDatefn(dates[dates.length - 1]?.format()),
        adults: pplCount.adult,
        children: pplCount.infant,
        pets: pplCount.pet,
        id: ids
        // discountCode:discountCode
      };
      dispatch(fetchBookingData(ids, bodyData));
    }
  }, [dates, pplCount, datesHour, timeIn, timeOut, activeButton]);
  // useEffect(() => {
  //   const from = searchParams.get("startDate");
  //   const to = searchParams.get("endDate");
  //   const fromDate = from
  //     ? new DateObject({
  //         date: new Date(from),
  //         format: "DD/MM/YYYY",
  //       })
  //     : null;
  //   const toDate = to
  //     ? new DateObject({
  //         date: new Date(to),
  //         format: "DD/MM/YYYY",
  //       })
  //     : null;
  //   if (from && to) {
  //     setDates([fromDate, toDate]);
  //   } else if (from) {
  //     setDates([fromDate]);
  //   } else {
  //     setDates([]);
  //   }
  // }, []);
  useEffect(() => {
    dispatch(isLoadingPayment(false));
  }, []);

  const onChange = (value: any) => {
    setTime(value);
  };

  const handleHourinChange = (value: DateObject) => {
    const dateObj = new DateObject();
    dateObj
      .setYear(datesHour[0].year)
      .setMonth(datesHour[0].monthIndex + 1)
      .setDay(datesHour[0].day)
      .setHour(value.hour)
      .setMinute(0)
      .setSecond(0);

    setTimeIn(dateObj);
    setCheckInHour(Time(dateObj?.toDate()));
  };

  const handleHouroutChange = (value: DateObject) => {
    const dateObj = new DateObject();
    dateObj
      .setYear(datesHour[1].year)
      .setMonth(datesHour[1].monthIndex + 1)
      .setDay(datesHour[1].day)
      .setHour(value.hour)
      .setMinute(0)
      .setSecond(0);

    setTimeOut(dateObj);
    setCheckOutHour(Time(dateObj?.toDate()));
  };

  useEffect(() => {
    setDateChangeKey(Date.now());
  }, [timeIn]);

  const hourPickerInState = useMemo(() => ({
      date: datesHour[0],
      selectedDate: timeIn?.hour || new DateObject().hour + 2,
      range: true,
      className: "rmdp-prime",
      value: timeIn?.hour
    }), [timeIn, datesHour]);

  const hourPickerOutState = useMemo(() => ({
      date: datesHour[1],
      selectedDate: timeOut?.hour || new DateObject().hour + 6,
      range: true,
      className: "rmdp-prime",
      value: timeOut?.hour
    }), [timeOut, datesHour]);

  // useEffect(() => {
  //     const handleScroll = () => {
  //       if (window.scrollY > 100) {
  //         if (checkin) setCheckin(false);
  //         if (checkout) setCheckout(false);
  //       }
  //     };

  //     window.addEventListener('scrollend', handleScroll);

  //     return () => {
  //       window.removeEventListener('scrollend', handleScroll);
  //     };
  //   }, [checkin, checkout]);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleDrawerClose}
      PaperProps={{ style: { height: "100%" } }}
      transitionDuration={500}
      sx={{ overflowY: "hidden" }}
    >
      {loader && <Loader />}
      <div onClick={handleDrawerClose}>
        <CloseIcon
          sx={{ margin: "auto", marginleft: "2px", marginTop: "2px" }}
        />
      </div>
      <div className={`${styles.drawer} p-4`}>
        <div className={`${styles.stickysidebar}`}>
          <div className={`${styles.dayPicker}`}>
          <button
              onClick={() => handleButtonClick("Hour")}
              className={`${styles.buttonhours} ${
                activeButton === "Hour" ? styles.active : ""
              }`}
            >
              {i18?.TRIPS?.HOUR || "Hour"}
            </button>
            <button
              onClick={() => handleButtonClick("Day")}
              className={`${styles.buttonday} ${
                activeButton === "Day" ? styles.active : ""
              }`}
            >
              {i18?.DATES?.DAY || "Day"}
            </button>
          </div>
          <div className="d-flex align-items-baseline">
            {/* <h2 className={`me-2`}>{CurrencyList.currency} {formatNumber(
                            (estimation && estimation?.perDay || 1) * price, currency) }</h2> */}
            <h2>
              {CurrencyList.currency}
              {HourlyBooking == "Hour" ||
              (HourlyBooking == "Both" && activeButton == "Hour")
                ? currencyRate(estimation?.perHour || hourPrice, currency.exchange_rate) 
                : currencyRate(estimation?.perDay || price, currency.exchange_rate)}
            </h2>
            &nbsp;
            <h5>
              {hourlyBooking == "Both" && activeButton == "Hour"
                ? i18?.PRODUCT?.HOUR || "hour"
                : i18?.PRODUCT?.NIGHT || "night"}
            </h5>
            {/* <p>4.79 ·
										68 reviews</p> */}
          </div>
          <div className="my-3">
            <div className="position-relative">
              {(activeButton === "Day" || HourlyBooking === "Day") && (
                <div
                  className="d-flex mt-2"
                  style={{
                    border: "1px solid grey",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}
                >
                  <div
                    className={`${styles.btn_checkin} w-100`}
                    style={{
                      borderRight: "1px solid grey"
                    }}
                    onClick={togglecheckin}
                  >
                    {HourlyBooking === "Hour" ||
                    (HourlyBooking === "Both" && activeButton === "Hour") ? (
                      <>
                        <p className={`${styles.uppercase}`}>
                          {i18?.ROOMPAGE?.CHECKIN || "check-in"}
                        </p>
                        <>
                          <p>
                            {dates[0] ? (
                              dates[0].format(
                                settings.dateFormat || "YYYY/MM/DD"
                              )
                            ) : (
                              <span
                                style={{
                                  color: "var(--font-color-adddates)",
                                  fontSize: "var(--searchbox-header-size)"
                                }}
                              >
                                {i18?.HEADER?.ADDDATES || "Add Dates"}
                              </span>
                            )}
                          </p>
                        </>
                      </>
                    ) : (
                      <>
                        <p
                          // style={{
                          //   fontWeight: 700,
                          //   fontSize: 'var(--font-size-rooms-checkin)',
                          //   color: 'var(--footer-text-color)',
                          // }}
                          className={`${styles.uppercase}`}
                        >
                          {i18?.ROOMPAGE?.CHECKIN || "Check In"}
                        </p>
                        {dates.length !== 0 ? (
                          <p>
                            {dates[0].format(
                              settings.dateFormat || "YYYY/MM/DD"
                            )}
                          </p>
                        ) : (
                          <p>
                            {dates[0] ? (
                              dates[0].format(
                                settings.dateFormat || "YYYY/MM/DD"
                              )
                            ) : (
                              <span
                                style={{
                                  color: "var(--font-color-adddates)",
                                  fontSize: "var(--searchbox-header-size)"
                                }}
                              >
                                {i18?.HEADER?.ADDDATES || "Add Dates"}
                              </span>
                            )}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div
                    className={`${styles.btn_checkout} w-100`}
                    style={{
                      borderRight: "none"
                    }}
                    onClick={togglecheckin}
                  >
                    {HourlyBooking === "Hour" ||
                    (HourlyBooking === "Both" && activeButton === "Hour") ? (
                      <>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "var(--font-size-rooms-checkin)",
                            color: "var(--footer-text-color)"
                          }}
                        >
                          {i18?.ROOMPAGE?.TIME || "Time"}
                        </p>
                        <p
                          style={{
                            color: "var(--font-color-adddates)",
                            fontSize: "var(--searchbox-header-size)"
                          }}
                        >
                          {dates[0]
                            ? dates[0].format("hh:00 A")
                            : i18?.HEADER?.ADDTIME || "Add Time"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className={`${styles.uppercase}`}>
                          {i18?.ROOMPAGE?.CHECKOUT || "checkout"}
                        </p>
                        {dates.length !== 0 ? (
                          <p>
                            {dates[1]?.format(
                              settings.dateFormat || "YYYY/MM/DD"
                            )}
                          </p>
                        ) : (
                          <p
                            style={{
                              color: "var(--font-color-adddates)",
                              fontSize: "var(--searchbox-header-size)"
                            }}
                          >
                            {i18?.BOOKINGPAGE?.ADDDATES || "Add dates"}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeButton === "Hour" ? (
                <>
                  <div
                    className="d-flex mt-2"
                    style={{
                      border: "1px solid grey",
                      borderBottom: "none",
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10
                    }}
                  >
                    <div
                      className={`${styles.btn_checkin} w-100`}
                      style={{ borderRight: "1px solid grey" }}
                      onClick={togglecheckin}
                    >
                      {HourlyBooking === "Hour" ||
                      (HourlyBooking === "Both" && activeButton === "Hour") ? (
                        <div>
                          <p className={styles.uppercase}>
                            {i18?.ROOMPAGE?.CHECKIN || "check-in"}
                          </p>
                          <p>
                            {dates[0] ? (
                              dates[0]?.format(
                                settings.dateFormat || "YYYY/MM/DD"
                              )
                            ) : (
                              <span
                                style={{
                                  color: "var(--font-color-adddates)",
                                  fontSize: "var(--searchbox-header-size)"
                                }}
                              >
                                {i18?.HEADER?.ADDDATES || "Add Dates"}
                              </span>
                            )}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p
                            style={{
                              fontWeight: 700,
                              fontSize: "var(--font-size-rooms-checkin)",
                              color: "var(--footer-text-color)"
                            }}
                          >
                            {i18?.ROOMPAGE?.CHECKIN || "Check In"}
                          </p>
                          {dates.length !== 0 ? (
                            <p>
                              {dates[0]?.format(
                                settings.dateFormat || "YYYY/MM/DD"
                              )}
                            </p>
                          ) : (
                            <p
                              style={{
                                color: "var(--font-color-adddates)",
                                fontSize: "var(--searchbox-header-size)"
                              }}
                            >
                              {i18?.HEADER?.ADDDATES || "Add Dates"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div
                      className={`${styles.btn_checkout} w-100`}
                      style={{ borderRight: "none" }}
                      onClick={togglecheckout}
                    >
                      <p className={styles.uppercase}>
                        {i18?.ROOMPAGE?.TIME || "Time"}
                      </p>
                      <p>
                        {dates[0] ? (
                          Time(dates[0]?.toDate())
                        ) : (
                          <span
                            style={{
                              color: "var(--font-color-adddates)",
                              fontSize: "var(--searchbox-header-size)"
                            }}
                          >
                            {i18?.HEADER?.ADDTIME || "Add Time"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex" style={{ border: "1px solid grey" }}>
                    <div
                      className={`${styles.btn_checkin} w-100`}
                      style={{ borderRight: "1px solid grey" }}
                      onClick={togglecheckout}
                    >
                      <p className={styles.uppercase}>
                        {i18?.ROOMPAGE?.CHECKOUT || "check-out"}
                      </p>
                      {/* <>{datesHour[1]?.format(settings.dateFormat || "YYYY/MM/DD") || i18?.HEADER?.ADDDATES || "Add Dates"}</> */}
                      {/* {(dates[1] &&
                                      dates[1].format(
                                        settings.dateFormat || "YYYY/MM/DD"
                                      )) ||
                                      i18?.HEADER?.ADDDATES ||
                                      "Add Dates"} */}
                      {dates.length !== 0 ? (
                        <p>
                          {dates[1]?.format(
                            settings.dateFormat || "YYYY/MM/DD"
                          )}
                        </p>
                      ) : (
                        <p
                          style={{
                            color: "var(--font-color-adddates)",
                            fontSize: "var(--searchbox-header-size)"
                          }}
                        >
                          {i18?.HEADER?.ADDDATES || "Add Dates"}
                        </p>
                      )}
                    </div>
                    <div
                      className={`${styles.btn_checkout} w-100`}
                      style={{ borderRight: "none" }}
                      onClick={togglecheckout}
                    >
                      <p className={styles.uppercase}>
                        {i18?.ROOMPAGE?.TIME || "Time"}
                      </p>
                      <p>
                        {dates[1] ? (
                          Time(dates[1]?.toDate())
                        ) : (
                          <span
                            style={{
                              color: "var(--font-color-adddates)",
                              fontSize: "var(--searchbox-header-size)"
                            }}
                          >
                            {i18?.HEADER?.ADDTIME || "Add Time"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              ) : null}

              {checkin && (
                <>
                  <div className={`${styles.search_region}`}>
                    {HourlyBooking === "Hour" ||
                    (HourlyBooking == "Both" && activeButton == "Hour") ? (
                      <div>
                        {/* <DateHourBox 
                                                    type="from"
                                                    time={time}
                                                    value={time[0]}
                                                    onChange={(mydate: any) => {
                                                        setTime([mydate, time[1]])
                                                    }} /> */}
                        {/* <Calendar
                          value={datesHour}
                          onChange={(date: any) => {
                            const fromDate = date[0]
                              ? date[0].format("YYYY-MM-DD")
                              : null;
                            const toDate = date[1]
                              ? date[1].format("YYYY-MM-DD")
                              : null;

                            const currentParams = new URLSearchParams(
                              window.location.search
                            );
                            currentParams.set("fromHour", fromDate);
                            if(fromDate) {
                              setTimeIn(timeIn.setDay(date[0].day)
                              .setYear(date[0].year)
                              .setMonth(date[0].monthIndex + 1)
                            .setMinute(0)
                            .setSecond(0))
                            }
                            if (toDate) {
                              currentParams.set("toHour", toDate);
                              setTimeOut(timeOut.setDay(date[1].day)
                              .setYear(date[1].year)
                            .setMonth(date[1].monthIndex + 1)
                            .setMinute(0)
                            .setSecond(0))
                              // setCheckin(!checkin);
                            }
                            // router.replace(`?${currentParams}`, {
                            //   scroll: false,
                            // })
                            window.history.replaceState(
                              { path: "?" + currentParams.toString() },
                              "",
                              "?" + currentParams.toString()
                            );

                            setDatesHour(date);
                          }}
                          minDate={new DateObject()}
                          maxDate={getMaxDate}
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
                          highlightToday={false}
                          numberOfMonths={1}
                          className="rmdpprime"
                          range
                          rangeHover
                          format="DD/MM/YYYY"
                        /> */}
                        <div style={{ display: "flex", gap: "16px" }}>
                          {/* <HourPicker
                            name={i18?.ROOMPAGE?.CHECKIN || "check-in"}
                            minDate={new DateObject()}
                            dateChangeKey={dateChangeKey}
                            state={hourPickerInState}
                            onChange={handleHourinChange}
                            disable={datesHour.length === 0}
                          />
                          <HourPicker
                            name={i18?.ROOMPAGE?.CHECKOUT || "check-out"}
                            minDate={new DateObject(timeIn)}
                            dateChangeKey={dateChangeKey}
                            state={hourPickerOutState}
                            onChange={handleHouroutChange}
                            disable={datesHour.length <= 1}
                          /> */}

                          {/* <DateHourBox
                                  type="from"
                                  time={dates}
                                  value={dates[0]}
                                  onChange={(mydate: any) => {
                                    setDates([mydate, dates[1]])
                                  }}
                                /> */}

                          <DateHourBox
                            type="from"
                            time={dates}
                            value={dates[0]}
                            onChange={(mydate: any) => {
                              setDates([mydate, dates[1]]);
                            }}
                          />

                          {/* <HourPicker
                        state={hourPickerStat}
                        minDate={minDate}
                        maxDate={maxDate}
                        
                        dateChangeKey={dateChangeKey}
                        onChange={handleHourChange}
                    />
                                 */}
                        </div>
                      </div>
                    ) : (
                      <Calendar
                        value={dates}
                        onChange={(date: any) => {
                          const fromDate = date[0]
                            ? date[0].format("YYYY-MM-DD")
                            : null;
                          const toDate = date[1]
                            ? date[1].format("YYYY-MM-DD")
                            : null;

                          const currentParams = new URLSearchParams(
                            window.location.search
                          );

                          const apiFromDate = currentParams.get("startDate");
                          const apiToDate = currentParams.get("endDate");

                          // Ensure fromDate is higher than toDate, if so, swap them
                          if (fromDate && !toDate && apiToDate) {
                            //   toDate = fromDate;
                            // fromDate= null;
                            // datehour[1] = datehour[0];
                            currentParams.delete("endDate");
                          }

                          currentParams.set("startDate", fromDate);
                          if (toDate) {
                            currentParams.set("endDate", toDate);
                            setCheckin(false);
                          }

                          currentParams.set("startDate", fromDate);
                          if (toDate) {
                            currentParams.set("endDate", toDate);
                            setCheckin(!checkin);
                          }
                          // router.replace(`?${currentParams}`, {
                          //   scroll: false,
                          // })
                          window.history.replaceState(
                            { path: `?${  currentParams.toString()}` },
                            "",
                            `?${  currentParams.toString()}`
                          );

                          setDates(date);
                        }}
                        minDate={getMinDate}
                        maxDate={getMaxDate}
                        mapDays={({ date }) => {
                          const formattedDate = date.format("DD-MM-YYYY");
                          const isblocked = list.includes(formattedDate);
                          if (isblocked) {
                            return {
                              disabled: true,
                              style: {
                                backgroundColor: "#ccc",
                                color: "#fff"
                              },
                              onClick: () =>
                                toast.info("This date is unavailable")
                            };
                          }
                        }}
                        highlightToday={false}
                        numberOfMonths={1}
                        className="rmdpprime"
                        range
                        rangeHover
                        format="DD/MM/YYYY"
                      />
                    )}

                    <div className="text-end mb-2">
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid transparent",
                          textDecoration: "underline",
                          textTransform: "capitalize"
                        }}
                        onClick={() => {
                          const currentParams = new URLSearchParams(
                            window.location.search
                          );
                          currentParams.delete("startDate");
                          currentParams.delete("endDate");
                          currentParams.delete("fromHour");
                          currentParams.delete("toHour");
                          window.history.replaceState(
                            { path: `?${  currentParams.toString()}` },
                            "",
                            `?${  currentParams.toString()}`
                          );
                          setDates([]);
                          setDatesHour([]);
                          setTimeIn(dayIn);
                          setTimeOut(dayOut);
                          setCheckInHour(undefined);
                          setCheckOutHour(undefined);
                        }}
                      >
                        {i18?.ROOMPAGE?.CLEARDATES || "clear dates"}
                      </button>
                      <button
                        className="ms-3"
                        style={{
                          backgroundColor: "#222",
                          border: "1px solid #222",
                          borderRadius: "4px",
                          textDecoration: "none",
                          textTransform: "capitalize",
                          color: "#fff",
                          padding: "4px"
                        }}
                        onClick={() => {
                          setCheckin(false);
                          //   setCheckout(false);
                        }}
                      >
                        {" "}
                        {i18?.BUTTONS?.SAVE || "Save"}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${styles.backdrop}`}
                    onClick={() => {
                      setCheckin(false);
                      setCheckout(false);
                    }}
                  />
                </>
              )}

              {checkout && (
                <>
                  <div className={`${styles.search_region}`}>
                    {HourlyBooking == "Hour" ||
                    (HourlyBooking == "Both" && activeButton == "Hour") ? (
                      <DateHourBox
                        type="to"
                        time={dates}
                        value={dates[1]}
                        onChange={(mydate: any) => {
                          // setTime([mydate, datesHour[1]])
                          setDates([dates[0], mydate]);
                        }}
                      />
                    ) : (
                      // <Calendar
                      //   value={dates}
                      //   onChange={(date: any) => {
                      //     const fromDate = date[0]
                      //       ? date[0].format("YYYY-MM-DD")
                      //       : null;
                      //     const toDate = date[1]
                      //       ? date[1].format("YYYY-MM-DD")
                      //       : null;

                      //     const currentParams = new URLSearchParams(
                      //       window.location.search
                      //     );
                      //     currentParams.set("from", fromDate);
                      //     if (toDate) {
                      //       currentParams.set("to", toDate);
                      //       // setCheckin(!checkin);
                      //     }
                      //     // router.replace(`?${currentParams}`, {
                      //     //   scroll: false,
                      //     // })
                      //     window.history.replaceState(
                      //       { path: "?" + currentParams.toString() },
                      //       "",
                      //       "?" + currentParams.toString()
                      //     );

                      //     setDates(date);
                      //   }}
                      //   minDate={getMinDate}
                      //   maxDate={getMaxDate}
                      //   mapDays={({ date }) => {
                      //     const formattedDate =
                      //       date.format("DD-MM-YYYY");
                      //     const isblocked =
                      //       list.includes(formattedDate);
                      //     if (isblocked) {
                      //       return {
                      //         disabled: true,
                      //         style: {
                      //           backgroundColor: "#ccc",
                      //           color: "#fff",
                      //         },
                      //         onClick: () =>
                      //           toast.info("This date is unavailable"),
                      //       };
                      //     }
                      //   }}
                      //   highlightToday={false}
                      //   numberOfMonths={2}
                      //   className="rmdpprime"
                      //   range
                      //   rangeHover
                      //   format="DD/MM/YYYY"
                      // />
                      <></>
                    )}

                    <div className="text-end mb-2">
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid transparent",
                          textDecoration: "underline",
                          textTransform: "capitalize"
                        }}
                        onClick={() => {
                          const currentParams = new URLSearchParams(
                            window.location.search
                          );
                          currentParams.delete("startDate");
                          currentParams.delete("endDate");
                          window.history.replaceState(
                            { path: `?${  currentParams.toString()}` },
                            "",
                            `?${  currentParams.toString()}`
                          );
                          setDates([]);
                          setTime([]);
                        }}
                      >
                        {i18?.ROOMPAGE?.CLEARDATES || "clear dates"}
                      </button>
                      <button
                        className="ms-3"
                        style={{
                          backgroundColor: "var(--footer-text-color)",
                          border: "1px solid var(--footer-text-color)",
                          borderRadius: "4px",
                          textDecoration: "none",
                          textTransform: "capitalize",
                          color: "#fff",
                          padding: "4px"
                        }}
                        onClick={() => {
                          setCheckin(false);
                          setCheckout(false);
                        }}
                      >
                        {" "}
                        {i18?.BUTTONS?.SAVE || "Save"}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${styles.backdrop}`}
                    onClick={() => {
                      setCheckin(false);
                      setCheckout(false);
                    }}
                  />
                </>
              )}
            </div>
            {/* <DatePickerValue /> */}
            {listings.specifications === "1" && (
              <Accordion
                disableGutters
                elevation={0}
                square
                style={{
                  margin: 0,
                  border: "1px solid grey",
                  boxShadow: "none",
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10
                }}
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  style={{
                    paddingLeft: 12,
                    paddingRight: 12
                  }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <div className="d-flex flex-column m-0">
                    <span className={`${styles.uppercase}`}>
                      {i18?.RESERVATIONS?.GUESTS || "Guests"}
                    </span>
                    <span>
                      {pplCount.adult} guest{pplCount.adult !== 1 ? "s" : ""}
                      {pplCount.infant !== 0
                        ? `, ${pplCount.infant} Infant${
                            pplCount.infant > 1 ? "s" : ""
                          }`
                        : ""}
                      {pplCount.pet !== 0
                        ? `, ${pplCount.pet} Pet${pplCount.pet > 1 ? "s" : ""}`
                        : ""}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    padding: 0
                  }}
                >
                  <>
                    <div className={`${styles.guests}`}>
                      <div className={`d-flex justify-content-between py-2`}>
                        <div className={`${styles.ppl_detail}`}>
                          <p>{i18?.ROOMPAGE?.ADULTS || "Adults"}</p>
                          <span>
                            {i18?.ROOMPAGE?.AGESABOVE13 || "Ages above 13"}
                          </span>
                        </div>
                        <div
                          className={`d-flex justify-content-between align-items-center mb-3`}
                        >
                          {pplCount.adult >= 1 && (
                            <button
                              onClick={() => {
                                handleDecrement("adult");
                              }}
                              className={`${styles.add_btn}`}
                            >
                              -
                            </button>
                          )}
                          <div className="px-3">{pplCount.adult}</div>
                          <button
                            onClick={() => {
                              handleIncrement("adult");
                            }}
                            className={`${styles.del_btn}`}
                            disabled={
                              pplCount.adult >= parseInt(listData?.guest?.adult)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className={`d-flex justify-content-between py-2`}>
                        <div className={`${styles.ppl_detail}`}>
                          <p>{i18?.BOOKINGPAGE?.INFANTS || "Infants"}</p>
                          <span>{i18?.BOOKINGPAGE?.UNDER || "Under 2"}</span>
                        </div>
                        <div
                          className={`d-flex justify-content-between align-items-center`}
                        >
                          {pplCount.infant >= 1 && (
                            <button
                              onClick={() => {
                                handleDecrement("infant");
                              }}
                              className={`${styles.add_btn}`}
                            >
                              -
                            </button>
                          )}
                          <div className="px-3">{pplCount.infant}</div>
                          <button
                            onClick={() => {
                              handleIncrement("infant");
                            }}
                            className={`${styles.del_btn}`}
                            disabled={
                              pplCount.infant >=
                              parseInt(listData?.guest?.children)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className={`d-flex justify-content-between py-2`}>
                        <div className={`${styles.ppl_detail}`}>
                          <p>{i18?.SELECTBASICS?.PETS || "Pets"}</p>
                        </div>
                        <div
                          className={`d-flex justify-content-between align-items-center`}
                        >
                          {pplCount.pet >= 1 && (
                            <button
                              onClick={() => {
                                handleDecrement("pet");
                              }}
                              className={`${styles.add_btn}`}
                            >
                              -
                            </button>
                          )}
                          <div className="px-3">{pplCount.pet}</div>
                          <button
                            onClick={() => {
                              handleIncrement("pet");
                            }}
                            className={`${styles.del_btn}`}
                            disabled={
                              pplCount.pet >= parseInt(listData?.guest?.pets)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-end">
                        <button
                          className="ms-3"
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid transparent",
                            textDecoration: "underline",
                            textTransform: "capitalize"
                          }}
                          onClick={() => setExpanded(false)}
                        >
                          {" "}
                          {i18?.ROOMPAGE?.CLOSE || "Close"}
                        </button>
                      </div>
                    </div>
                  </>
                </AccordionDetails>
              </Accordion>
            )}
          </div>
          {/* <div className={`${styles.discount}`}>
									<input 
									   type="text"
									   name="discount"
									   id="discount"
									   placeholder="Enter Discount Code "
									   onChange={handleDiscountCodeChange}
									/>
								</div> */}
          <button
            className={`${
              listData.isBooking ? styles.reservebtnDisable : styles.reservebtn
            }`}
            onClick={handleReserve}
            disabled={listData.isBooking}
          >
            {listData.isBooking
              ? "Can't reserve your own listings"
              : (dates.length > 1 && activeButton === "Day") ||
                (datesHour.length > 1 && timeOut && activeButton === "Hour")
              ? "Reserve"
              : "Check availability"}
          </button>
          {estimation &&
          estimation.fareAmount > 0 &&
            Number(estimation.Adult) !== 0 &&
            ((dates.length > 1 && activeButton == "Day") ||
              (datesHour.length > 1 &&
                timeIn?.toDate() &&
                timeOut?.toDate() &&
                activeButton == "Hour")) && (
              <div className="pt-4">
                {estimation.nights !== 0 && (
                  <div
                    className={`${styles.textdec} d-flex justify-content-between pb-2`}
                  >
                    <p className={`${styles.text}`}>
                      {CurrencyList.currency}{" "}
                      {formatNumber(estimation.perDay, currency)} x{" "}
                      {estimation.nights} {i18?.PRODUCT?.NIGHT || "night"}
                    </p>
                    <p>
                      {" "}
                      {CurrencyList.currency}
                      {formatNumber(estimation.dayFare, currency)}
                    </p>
                  </div>
                )}
                {estimation.hours !== 0 && (
                  <div
                    className={`${styles.textdec} d-flex justify-content-between pb-2`}
                  >
                    <p className={`${styles.text}`}>
                      {CurrencyList.currency}
                      {formatNumber(estimation.perHour, currency)} x{" "}
                      {estimation.hours} {i18?.ROOMPAGE?.HOUR || "hour"}
                    </p>
                    <p>
                      {" "}
                      {CurrencyList.currency}
                      {formatNumber(estimation.hourFare, currency)}
                    </p>
                  </div>
                )}
                {estimation.taxAmount !== 0 && (
                  <div
                    className={`${styles.textdec} d-flex justify-content-between pb-2`}
                  >
                    <p className={`${styles.text}`}>
                      {i18?.ROOMPAGE?.TAX || "Tax"}({estimation.taxPercentage}%)
                    </p>
                    <p>
                      {CurrencyList.currency}
                      {formatNumber(estimation.taxAmount, currency)}
                    </p>
                  </div>
                )}
                <div className="my-3">
                  <div className={`${styles.divider} total`}></div>
                </div>
                <div className={`d-flex justify-content-between`}>
                  <h5>{i18?.BOOKINGPAGE?.TOTAL || "Total"}</h5>
                  <h5>
                    {" "}
                    {CurrencyList.currency}
                    {formatNumber(estimation.fareAmount, currency)}
                  </h5>
                </div>
              </div>
            )}
        </div>
      </div>
    </Drawer>
  );
};

export default MobilereserveBox;
