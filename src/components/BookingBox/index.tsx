import React, { useMemo, useRef, useState } from "react";
import styles from "./booking.module.scss";
// import styles from "@/app/rooms/page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import { useAppSelector } from "@/redux/hooks";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { currencyRate } from "@/Utils/currencyRate";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Calendar, DateObject } from "react-multi-date-picker";
import { toast } from "react-toastify";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import MobileDialog from "./MobileDialog";
import Popover from "./popover";

const DateHourBox = dynamic(() => import("./../HourPicker_design3/index"));

function BookingBox({
  activeButton,
  setActiveButton,
  hourprice,
  price,
  discountprice,
  discountpercentage,
  dates,
  setDates,
  maxNight,
  minNight,
  list,
  pplCount,
  setPplCount,
  handleReserve,
  schedule,
  bookedhours
}: any) {
  const { i18, currency, settings, responsiveView } = usePageContext();
  const { listings } = settings;
  const HourlyBooking = settings?.hiddenSettings?.hourlyBooking;
  const { CurrencyList } = useAppSelector(currencySelector);
  const { estimation } = useSelector((state: any) => state.bookingEstimation);
  const [checkin, setCheckin] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [expanded, setExpanded] = useState<any>(false);
  const propertyData = useSelector(
    (state: any) => state.listingData.ListingData
  );
  const cacheDates = useRef<any>(null);

  const handleButtonClick = (button: any) => {
    setActiveButton(button);
  };

  const togglecheckin = () => {
    setCheckout(false);
    setCheckin(true);
  };

  const togglecheckout = () => {
    setCheckin(false);
    setCheckout(true);
  };

  const getMinDate = useMemo(() => {
    const afterSelect = new DateObject(dates[0]).add(minNight, "days");
    const minSelectableDate = new DateObject();
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

  const handleChange = (panel: any) => (event?: any, isExpanded?: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleIncrement = (value: any) => {
    const currentParams = new URLSearchParams(window.location.search);
    if (value === "adult") {
      currentParams.set("adult", pplCount.adult + 1);
    }
    if (value === "children") {
      currentParams.set("children", pplCount.children + 1);
    }
    if (value === "pet") {
      currentParams.set("pet", pplCount.pet + 1);
    }
    setPplCount({
      ...pplCount,
      [value]: pplCount[value] + 1,
    });
    window.history.replaceState(
      { path: `?${currentParams.toString()}` },
      "",
      `?${currentParams.toString()}`
    );
  };

  const handleDecrement = (value: any) => {
    const currentParams: any = new URLSearchParams(window.location.search);
    if (value === "adult") {
      currentParams.set("adult", pplCount.adult - 1);
    }
    if (value === "children") {
      currentParams.set("children", pplCount.children - 1);
    }
    if (value === "pet") {
      currentParams.set("pet", pplCount.pet - 1);
    }
    setPplCount({
      ...pplCount,
      [value]: pplCount[value] - 1,
    });
    window.history.replaceState(
      { path: `?${currentParams.toString()}` },
      "",
      `?${currentParams.toString()}`
    );
  };

  const mobileView = responsiveView === "sm" || responsiveView === "xs";
  const CommonBox = mobileView ? MobileDialog : Popover;
  // console.log('discountprice',discountprice.toFixed(2))
  return (
    <div className={`${styles.stickysidebar}`}>
      {HourlyBooking == "Both" ? (
        <div className={`${styles.dayPicker}`}>
          <button
            // disabled={HourlyBooking == "Day" ? true : false}
            onClick={() => {
              handleButtonClick("Hour");
            }}
            className={`${styles.buttonhours} ${HourlyBooking == "Both" || HourlyBooking == "Hour"
              ? activeButton === "Hour"
                ? styles.active
                : ""
              : ""
              }`}
          >
            {i18?.TRIPS?.HOUR || "Hour"}
          </button>
          <button
            // disabled={HourlyBooking == "Hour" ? true : false}
            onClick={() => {
              handleButtonClick("Day");
            }}
            className={`${styles.buttonday} ${HourlyBooking == "Both" || HourlyBooking == "Day"
              ? activeButton === "Day"
                ? styles.active
                : ""
              : ""
              }`}
          >
            {i18?.DATES?.DAY || "Day"}
          </button>
        </div>
      ) : (
        <></>
      )}
      {/* Currency inside Calendar */}
      {/* class: rate-text */}
      <div className="d-flex align-items-baseline">
        <div className="me-2">
          {HourlyBooking === "Hour" || (HourlyBooking === "Both" && activeButton === "Hour") ? (
            <div className="d-flex gap-2 align-items-center">
              <h2 className="m-0">
                {CurrencyList.currency}
                {currencyRate(estimation?.perHour || hourprice, currency.exchange_rate)}
              </h2>
              <h5 className="m-0">
                {i18?.BOOKINGPAGE?.PERHOUR || "per hour"}
              </h5>
            </div>
          ) : (
            discountprice ?
              <>
                <div className="d-flex align-items-end gap-2">
                  <h2 className="m-0">
                    {CurrencyList.currency}
                    {currencyRate(
                      (discountprice && discountprice.toFixed(2)),
                      currency.exchange_rate
                    )}
                  </h2>
                  <p style={{
                    fontSize: '18px',
                  }}>
                    <s>
                      {currencyRate(
                        estimation?.perDay ||
                        price,
                        currency.exchange_rate
                      )}
                    </s>
                  </p>
                  <p style={{
                    fontSize: '16px',
                    color: "var(--btn-bg-color)",
                    fontWeight: 700
                  }}>
                    {discountpercentage}% off
                  </p>
                </div>
                <p>
                  <p>+ taxes & fee &#183; {i18?.BOOKINGPAGE?.PERDAY || "per day"}</p>
                </p>
              </>
              :
              <div className="d-flex gap-2 align-items-center">
                <h2 className="m-0">
                  {CurrencyList.currency}
                  {currencyRate(
                    estimation?.perDay ||
                    price,
                    currency.exchange_rate
                  )}
                </h2>
                <h5 className="m-0">
                  {i18?.BOOKINGPAGE?.PERDAY || "per day"}
                </h5>
              </div>

          )}
        </div>

        {/* <h5 className="m-0">
          {HourlyBooking == "Both" && activeButton == "Hour"
            ? i18?.BOOKINGPAGE?.PERHOUR || "per hour"
            : i18?.BOOKINGPAGE?.PERDAY || "per day"}
        </h5> */}
        {/* <p>4.79 ·
                      68 reviews</p> */}
      </div>
      {/* Currency inside Calendar */}
      <div className="my-3">
        <div className="position-relative">
          <div
            className="d-flex mt-2"
            style={{
              border: "1px solid grey",
              // borderBottom: "none",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <div
              className={`${styles.btn_checkin} w-100`}
              style={{
                borderRight: "1px solid grey",
                fontFamily: "var(--font-family-base)",
                color: "var(--text-color)",
              }}
              onClick={togglecheckin}
            >
              {HourlyBooking == "Hour" ||
                (HourlyBooking == "Both" && activeButton == "Hour") ? (
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "var(--font-size-rooms-checkin)",
                      color: "var(--footer-text-color)",
                    }}
                  >
                    {i18?.ROOMPAGE?.CHECKIN || "Check In"}
                  </p>
                  <>
                    <p
                      style={{
                        color: "var(--font-color-adddates)",
                        fontSize: "var(--searchbox-header-size)",
                      }}
                    >
                      {(dates[0] &&
                        dates[0].format(settings.dateFormat || "YYYY/MM/DD")) ||
                        i18?.HEADER?.ADDDATES ||
                        "Add Dates"}
                    </p>
                  </>
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "var(--font-size-rooms-checkin)",
                      color: "var(--footer-text-color)",
                    }}
                  >
                    {i18?.ROOMPAGE?.CHECKIN || "Check In"}
                  </p>
                  <>
                    {dates.length !== 0 ? (
                      <p>
                        {dates[0].format(settings.dateFormat || "YYYY/MM/DD")}
                      </p>
                    ) : (
                      <p
                        style={{
                          color: "var(--font-color-adddates)",
                          fontSize: "var(--searchbox-header-size)",
                        }}
                      >
                        {i18?.HEADER?.ADDDATES || "Add Dates"}
                      </p>
                    )}
                  </>
                </div>
              )}
            </div>

            <div
              className={`${styles.btn_checkout} w-100`}
              style={{
                borderRight: "none",
              }}
              onClick={togglecheckin}
            >
              {HourlyBooking == "Hour" ||
                (HourlyBooking == "Both" && activeButton == "Hour") ? (
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "var(--font-size-rooms-checkin)",
                      color: "var(--footer-text-color)",
                    }}
                  >
                    {i18?.ROOMPAGE?.TIME || "Time"}
                  </p>
                  <>
                    <p
                      style={{
                        color: "var(--font-color-adddates)",
                        fontSize: "var(--searchbox-header-size)",
                      }}
                    >
                      {dates[0]
                        ? dates[0].format("hh:00 A")
                        : i18?.HEADER?.ADDTIME || "Add Time"}
                    </p>
                  </>
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "var(--font-size-rooms-checkin)",
                      color: "var(--footer-text-color)",
                    }}
                  >
                    {i18?.ROOMPAGE?.CHECKOUT || "Check Out"}
                  </p>
                  <>
                    {dates.length !== 0 ? (
                      <p>
                        {dates[1]?.format(settings.dateFormat || "YYYY/MM/DD")}
                      </p>
                    ) : (
                      <p
                        style={{
                          color: "var(--font-color-adddates)",
                          fontSize: "var(--searchbox-header-size)",
                        }}
                      >
                        {i18?.HEADER?.ADDDATES || "Add Dates"}
                      </p>
                    )}
                  </>
                </div>
              )}
            </div>
          </div>

          {(activeButton === "Hour" && (HourlyBooking === "Both" || HourlyBooking === "Hour")) ? (
            <div
              className="d-flex "
              style={{
                border: "1px solid grey",
                borderTop: "none",
              }}
            >
              <div
                className={`${styles.btn_checkin} w-100`}
                style={{
                  borderRight: "1px solid grey",
                }}
                onClick={togglecheckout}
              >
                {HourlyBooking == "Hour" ||
                  (HourlyBooking == "Both" && activeButton == "Hour") ? (
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "var(--font-size-rooms-checkin)",
                        color: "var(--footer-text-color)",
                      }}
                    >
                      {i18?.ROOMPAGE?.CHECKOUT || "Check Out"}
                    </p>
                    <>
                      <p
                        style={{
                          color: "var(--font-color-adddates)",
                          fontSize: "var(--searchbox-header-size)",
                        }}
                      >
                        {(dates[1] &&
                          dates[1].format(
                            settings.dateFormat || "YYYY/MM/DD"
                          )) ||
                          i18?.HEADER?.ADDDATES ||
                          "Add Dates"}
                      </p>
                    </>
                  </div>
                ) : (
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "var(--font-size-rooms-checkin)",
                        color: "var(--footer-text-color)",
                      }}
                    >
                      {i18?.ROOMPAGE?.CHECKIN || "Check In"}3
                    </p>
                    <>
                      {dates.length !== 0 ? (
                        <p>
                          {dates[0].format(settings.dateFormat || "YYYY/MM/DD")}
                        </p>
                      ) : (
                        <p
                          style={{
                            color: "var(--font-color-adddates)",
                            fontSize: "var(--searchbox-header-size)",
                          }}
                        >
                          {i18?.HEADER?.ADDDATES || "Add Dates"}
                        </p>
                      )}
                    </>
                  </div>
                )}
              </div>
              <div
                className={`${styles.btn_checkout} w-100`}
                style={{
                  borderRight: "none",
                  borderTop: "none",
                  fontFamily: "var(--font-family-base)",
                  color: "var(--text-color)",
                }}
                onClick={togglecheckout}
              >
                {HourlyBooking == "Hour" ||
                  (HourlyBooking == "Both" && activeButton == "Hour") ? (
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "var(--font-size-rooms-checkin)",
                        color: "var(--footer-text-color)",
                      }}
                    >
                      {i18?.ROOMPAGE?.TIME || "Time"}
                    </p>
                    <>
                      <p
                        style={{
                          color: "var(--font-color-adddates)",
                          fontSize: "var(--searchbox-header-size)",
                        }}
                      >
                        {dates[1]
                          ? dates[1].format("hh:00 A")
                          : i18?.HEADER?.ADDTIME || "Add Time"}
                      </p>
                    </>
                  </div>
                ) : (
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "var(--font-size-rooms-checkin)",
                        color: "var(--footer-text-color)",
                      }}
                    >
                      {i18?.ROOMPAGE?.CHECKIN || "Check Out"}
                    </p>
                    <>
                      {dates.length !== 0 ? (
                        <p>
                          {dates[1]?.format(settings.dateFormat || "YYYY/MM/DD")}
                        </p>
                      ) : (
                        <p
                          style={{
                            color: "var(--font-color-adddates)",
                            fontSize: "var(--searchbox-header-size)",
                          }}
                        >
                          {i18?.HEADER?.ADDDATES || "Add Dates"}
                        </p>
                      )}
                    </>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}

          {checkin && (
            <CommonBox
              onClose={() => {
                setCheckin(false);
              }}
              title={i18?.ROOMPAGE?.CHECKIN || "Check In"}
            >
              {HourlyBooking === "Hour" ||
                (HourlyBooking == "Both" && activeButton == "Hour") ? (
                <div>
                  <DateHourBox
                    type="from"
                    time={dates}
                    value={dates[0]}
                    bookedhours={bookedhours}
                    list={list}
                    schedule={schedule}
                    mobileView={mobileView}
                    onChange={(mydate: any) => {
                      setDates([mydate, dates[1]]);
                    }}

                  />
                  <div>
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
                          currentParams.delete("fromHour");
                          currentParams.delete("toHour");
                          window.history.replaceState(
                            {
                              path: `?${currentParams.toString()}`,
                            },
                            "",
                            `?${currentParams.toString()}`
                          );
                          setDates([]);
                          //   setDatesHour([]);
                          //   setTimeIn(dayIn);
                          //   setTimeOut(dayOut);
                          //   setCheckInHour(undefined);
                          //   setCheckOutHour(undefined);
                          //   setStep("default");
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
                          padding: "4px",
                        }}
                        onClick={() => {
                          setCheckin(false);
                        }}
                      >
                        {" "}
                        {i18?.BUTTONS?.SAVE || "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Calendar
                    value={dates}
                    onChange={(date: any) => {
                      // const fromDate = date[0]
                      // ? date[0].format("YYYY-MM-DD")
                      // : null;
                      // on load set cache
                      if (dates.length === 2) {
                        cacheDates.current = dates;
                      }
                      // set time from cached dates
                      if (cacheDates.current) {
                        if (date[0])
                          date[0].setHour(cacheDates.current[0].format('h')).setMinute(0).setSecond(0);
                        if (date[1])
                          date[1].setHour(cacheDates.current[1].format('h')).setMinute(0).setSecond(0);
                      } else { //if empty, then set 10 and 11 as default from & to time
                        if (date[0] && (!dates[0] || !dates[1])) {
                          date[0].setHour(10).setMinute(0).setSecond(0);
                        }
                        if (!dates[1] && date[1]) {
                          date[1].setHour(11).setMinute(0).setSecond(0);
                        }
                      }

                      if (date[1]) {
                        setCheckin(false);
                      }
                      setDates(date);
                      // on change cache
                      if (date.length === 2) {
                        cacheDates.current = date;
                      }
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
                            color: "#fff",
                          },
                          onClick: () => toast.info("This date is unavailable"),
                        };
                      }
                    }}
                    highlightToday={false}
                    numberOfMonths={mobileView ? 1 : 2}
                    className="rmdpprime"
                    range
                    rangeHover
                    format="DD/MM/YYYY"
                  />

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
                          {
                            path: `?${currentParams.toString()}`,
                          },
                          "",
                          `?${currentParams.toString()}`
                        );
                        setDates([]);
                        // setDatesHour([]);
                        // // setTimeIn(undefined)
                        // // setTimeOut(undefined)
                        // setTimeIn(dayIn);
                        // setTimeOut(dayOut);
                        // setCheckInHour(undefined);
                        // setCheckOutHour(undefined);
                        // setStep("default");
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
                        padding: "4px",
                      }}
                      onClick={() => {
                        setCheckin(false);
                      }}
                    >
                      {" "}
                      {i18?.BUTTONS?.SAVE || "Save"}
                    </button>
                  </div>
                </div>
              )}
            </CommonBox>
          )}

          {checkout && (
            <>
              <CommonBox
                onClose={() => {
                  setCheckin(false);
                  setCheckout(false);
                }}
                title={i18?.ROOMPAGE?.CHECKOUT || "Check Out"}
              >
                {HourlyBooking == "Hour" ||
                  (HourlyBooking == "Both" && activeButton == "Hour") ? (
                  <DateHourBox
                    type="to"
                    time={dates}
                    value={dates[1]}
                    list={list}
                    bookedhours={bookedhours}
                    mobileView={mobileView}
                    schedule={schedule}
                    onChange={(mydate: any) => {
                      setDates([dates[0], mydate]);
                    }}
                  />
                ) : (
                  <></>
                )}

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
                      // setTime([]);
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
                      padding: "4px",
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
              </CommonBox>
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
              borderTop: "none",
              boxShadow: "none",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              style={{
                paddingLeft: 12,
                paddingRight: 12,
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <div className="d-flex flex-column m-0">
                <span
                  style={{
                    fontFamily: "var(--font-family-base)",
                    color: "var(--text-color)",
                  }}
                >
                  {i18?.ROOMPAGE?.GUESTS}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-family-base)",
                    color: "var(--text-color)",
                  }}
                >
                  {pplCount.adult + pplCount.children}{" "}
                  {i18?.ROOMPAGE?.GUEST || "Guest"}
                  {pplCount.adult !== 1 ? "s" : ""}
                  {pplCount.pet !== 0
                    ? `, ${pplCount.pet} ${i18?.RESERVATIONS?.PET || "Pet"} ${pplCount.pet > 1 ? "s" : ""
                    }`
                    : ""}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails
              style={{
                padding: 0,
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
                      className={`d-flex justify-content-between align-items-center m-0`}
                    >
                      {/* {pplCount.adult >= 2 && ( */}
                      <button
                        disabled={pplCount.adult === 1}
                        title={pplCount.adult === 1 ? "Minimum 1 adult required" : ""}
                        onClick={() => {
                          handleDecrement("adult");
                        }}
                        className={`${styles.add_btn}`}
                      >
                        -
                      </button>
                      {/* )} */}
                      <div className="px-3">{pplCount.adult}</div>
                      <button
                        onClick={() => {
                          handleIncrement("adult");
                        }}
                        className={`${styles.del_btn}`}
                        disabled={
                          pplCount.adult >= parseInt(propertyData.guest.adult)
                        }
                        title={
                          pplCount.adult >= parseInt(propertyData.guest.adult)
                            ? `Maximum ${propertyData.guest.adult} adults allowed`
                            : ""
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={`d-flex justify-content-between py-2`}>
                    <div className={`${styles.ppl_detail}`}>
                      <p>{i18?.ROOMPAGE?.CHILDREN || "Children"}</p>
                      <span>{i18?.ROOMPAGE?.AGES2TO12 || "Ages 2 - 12"}</span>
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      {/* {pplCount.children >= 1 && ( */}
                      <button
                        disabled={pplCount.children === 0}
                        onClick={() => {
                          handleDecrement("children");
                        }}
                        className={`${styles.add_btn}`}
                      >
                        -
                      </button>
                      {/* )} */}
                      <div className="px-3">{pplCount.children}</div>
                      <button
                        onClick={() => {
                          handleIncrement("children");
                        }}
                        className={`${styles.del_btn}`}
                        disabled={
                          pplCount.children >=
                          parseInt(propertyData.guest.children)
                        }
                        title={
                          pplCount.children >= parseInt(propertyData.guest.children)
                            ? `Maximum ${propertyData.guest.children} children allowed`
                            : ""
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={`d-flex justify-content-between py-2`}>
                    <div className={`${styles.ppl_detail}`}>
                      <p>{i18?.FILTER?.PETS || "Pets"}</p>
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      {/* {pplCount.pet >= 1 && ( */}
                      <button
                        disabled={pplCount.pet === 0}
                        onClick={() => {
                          handleDecrement("pet");
                        }}
                        className={`${styles.add_btn}`}
                      >
                        -
                      </button>
                      {/* )} */}
                      <div className="px-3">{pplCount.pet}</div>
                      <button
                        onClick={() => {
                          handleIncrement("pet");
                        }}
                        className={`${styles.del_btn}`}
                        disabled={
                          pplCount.pet >= parseInt(propertyData.guest.pets)
                        }
                        title={
                          pplCount.pets >= parseInt(propertyData.guest.pets)
                            ? `Maximum ${propertyData.guest.pets} pets allowed`
                            : ""
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
                        textTransform: "capitalize",
                      }}
                      onClick={() => setExpanded(false)}
                    >
                      {" "}
                      {i18?.ROOMPAGE?.CLOSE || "close"}
                    </button>
                  </div>
                </div>
              </>
            </AccordionDetails>
          </Accordion>
        )}
      </div>
      <DynamicButtonComponent
        variant="contained"
        className={`${propertyData.isBooking ? styles.reservebtnDisable : styles.reservebtn
          }`}
        onClick={handleReserve}
        disabled={propertyData.isBooking}
        text={
          propertyData.isBooking
            ? "Can't reserve your own listings"
            : dates.length > 1
              ? `${i18?.ROOMPAGE?.RESERVE || "Reserve"}`
              : `${i18?.ROOMPAGE?.CHECKAVAILABILITY || "Check availability"}`
        }
      />

      {estimation &&
        estimation.fareAmount > 0 &&
        Number(estimation.Adult) !== 0 &&
        ((dates.length > 1 && activeButton == "Day") ||
          (dates.length > 1 && activeButton == "Hour")) && (
          <div className="pt-4">
            {estimation.nights !== 0 && (
              <div
                className={`${styles.textdec} d-flex justify-content-between py-2`}
              >
                <p className={`${styles.text}`}>
                  {CurrencyList.currency}{" "}
                  {discountprice ? currencyRate(discountprice, currency.exchange_rate) : currencyRate(estimation.perDay, currency.exchange_rate)} x{" "}
                  {estimation.nights} {i18?.PRODUCT?.NIGHT || "Night"}
                </p>

                <p>
                  {CurrencyList.currency}{" "}
                  {currencyRate(estimation.dayFare, currency.exchange_rate)}
                </p>
              </div>
            )}
            {estimation.hours !== 0 && (
              <div
                className={`${styles.textdec} d-flex justify-content-between py-2`}
              >
                <p className={`${styles.text}`}>
                  {CurrencyList.currency}{" "}
                  {currencyRate(estimation.perHour, currency.exchange_rate)} x{" "}
                  {estimation.hours} {i18?.ROOMPAGE?.HOUR || "hour"}
                </p>

                <p>
                  {CurrencyList.currency}{" "}
                  {currencyRate(estimation.hourFare, currency.exchange_rate)}
                </p>
              </div>
            )}
            {estimation.taxAmount !== 0 && (
              <div
                className={`${styles.textdec} d-flex justify-content-between py-2`}
              >
                <p className={`${styles.text} text-capitalize`}>
                  {i18?.ROOMPAGE?.TAX || "Tax"}({estimation.taxPercentage}%)
                </p>
                <p>
                  {CurrencyList.currency}{" "}
                  {currencyRate(estimation.taxAmount, currency.exchange_rate)}
                </p>
              </div>
            )}
            <div className="my-3">
              <div className={`${styles.divider}`}></div>
            </div>
            <div className={`d-flex justify-content-between`}>
              <h5 className="text-capitalize">
                {i18?.ROOMPAGE?.TOTAL || "Total"}
              </h5>
              <h5>
                {CurrencyList.currency}{" "}
                {currencyRate(estimation.fareAmount, currency.exchange_rate)}
              </h5>
            </div>
          </div>
        )}
    </div>
  );
}

export default BookingBox;
