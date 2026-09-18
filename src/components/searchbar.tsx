import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./componentheaderstyles.module.scss";

import { Calendar, DateObject } from "react-multi-date-picker";
import { usePageContext } from "@/components/Providers/PageContext";
import { formatDateTime, Time } from "@/services/utils/datetime";
import { BiSearch } from "react-icons/bi";
import { yellowTheme } from "@/components/colorVariable";
import { dispatch } from "@/redux/store";
import {
  // getMinMaxVal,
  setFilterValues,
  searchSelector,
  updatePricing,
  updateSearchDate,
  updateGuest,
  updateAddress
  // updateAdultCount,
  // updateChildrenCount,
  // updateEndDate,
  // updateLat,
  // updateLng,
  // updatePetsCount,
  // updateStartDate
} from "@/redux/slice/searchValue";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from "next/dynamic";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { SearchIcon } from "../app/global/svg";
import { useSelector } from "react-redux";
import { Autocomplete } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import { mergeQueryParams } from "@/components/helper";
import SearchBar from "./MobilesearchBar";

const DateHourBox = dynamic(() => import("@/components/HourPicker/index"), {
  ssr: false
});

const SearchBarComp = ({ props, isLoaded }: any) => {
  const router = useRouter();
  const header_ref: any = useRef();
  const searchParams: any = useSearchParams();
  const searchData = Object.fromEntries(searchParams);

  const { i18, currency, settings, responsiveView } = usePageContext();
  const { google, hiddenSettings, listings } = settings;

  const [showMe, setShowMe] = useState(false);
  const [guest, setGuest] = useState(false);
  const [isLoading, SetIsLoding] = useState(true);
  const [autocomplete, setautocomplete] = useState<any>(null);
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [dates, setDates] = useState<any>([]);
  const [time, setTime] = useState<any>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [checkinActive, setCheckinActive] = useState(false);
  const [changeStyle, setChangeStyle] = useState("");
  const [search, setSearch] = useState(false);
  const [checkin, setCheckin] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [fdate, setFdate] = useState("");
  const [edate, setEdate] = useState("");
  const stickyElementRef = useRef<HTMLDivElement>(null);
  const [navAnchorEl, setNavAnchorEl] = useState<null | HTMLElement>(null);
  const [count, setCount] = useState<any>({
    adult: 0,
    children: 0,
    pets: 0
  });
  const { address, searchdate } = useSelector(searchSelector);
  const navOpen = Boolean(navAnchorEl);

  const HourlyBooking =
    settings?.hiddenSettings?.hourlyBooking === "1" ? true : false;
  const params: any =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : {};

  const changeStyles = (data: any) => {
    setChangeStyle(data);
    setSearchActive(true);
    setCheckinActive(true);
  };

  const onLoad = (autocomplete: any) => {
    if (autocomplete !== null && autocomplete.getPlace) {
      setautocomplete(autocomplete);
    }
  };
  const onPlaceChanged = () => {
    if (autocomplete !== null && autocomplete.getPlace) {
      const placeDetail = autocomplete.getPlace();
      const lat = placeDetail.geometry?.location.lat();
      const lng = placeDetail.geometry?.location.lng();
      setLat(lat);
      setLng(lng);
      const pat1 = /^\d{6}$/;
      const selectedPlace = placeDetail.formatted_address;
      setLocationName(selectedPlace);
    }
  };

  const handleNavClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setNavAnchorEl(event.currentTarget);
    setSearch(!search);
    setCheckin(false);
    setGuest(false);
  };

  const togglecheckin = () => {
    setCheckout(false);
    setCheckin(true);
    setSearch(false);
    setGuest(false);
    setChangeStyle("CheckIN");
  };
  const togglecheckout = () => {
    setCheckin(false);
    setCheckout(true);
    setSearch(false);
    setGuest(false);
    setChangeStyle("CheckOUT");
  };

  const toggleguest = () => {
    setGuest(!guest);
    setCheckin(false);
    setSearch(false);
    setChangeStyle("Guest");
  };

  const toggle = () => {
    setShowMe(!showMe)
    setChangeStyle('')
    setGuest(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (showMe) {
      const target: any = event.target;
      // If the click is outside the div (i.e., not in the ref)
      if (
        stickyElementRef.current &&
        !stickyElementRef.current.contains(target)
      ) {
        // Ignore clicks on autocomplete suggestions
        if (target.closest(".pac-container")) {
          return;
        }
        toggle();
        // Perform actions when clicked outside
      }
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMe]);

  const handleSearch = () => {
    const newParams: any = {}; // Collect new query parameters
    if (locationName === '') {
      params.delete('lat')
      params.delete('lng')
      params.delete('locationName')
      setLat('')
      setLng('')
      setLocationName('')
      window.history.replaceState(
        { path: params.toString() },
        "",
        `?${params.toString()}`
      );
    }

    if ((lat && lng) && locationName !== '') {
      newParams.lat = lat;
      newParams.lng = lng;
    }

    if ((fdate && edate) || time[0]?.toDate()) {
      if (HourlyBooking) {
        let startDate = time[0]?.toDate();
        let endDate = time[1]?.toDate();
        if (endDate < startDate) {
          let temp = endDate;
          endDate = startDate;
          startDate = temp;
        }
        const sdate: any = formatDateTime(startDate);
        const eddate: any = formatDateTime(endDate);
        setDates([sdate, eddate]);
        setFdate(sdate);
        setEdate(eddate);
        newParams.from = sdate;
        newParams.to = eddate;
      } else {
        newParams.from = fdate;
        newParams.to = edate;
      }
    }
    if (locationName || locationName === '') {
      newParams.location = locationName;
    }
    if (count.adult || count.adult === 0) {
      newParams.adults = count.adult;
    }
    if (count.children || count.children === 0) {
      newParams.children = count.children;
    }
    if (count.pets || count.pets === 0) {
      newParams.pets = count.pets;
    }

    // Use mergeQueryParams to merge newParams with existing URL query params
    mergeQueryParams(newParams);

    // Additional logic for updating state
    setCheckin(false);
    setShowMe(false)
    setGuest(false);

    dispatch(
      setFilterValues({
        searchdate: {
          ...searchdate,
          startDate: fdate || "",
          endDate: edate || ""
        },
        address: { ...address, lat: lat || "", lng: lng || "" },
        guests: {
          adult: count.adults || 0,
          children: count.children || 0,
          pets: count.pets || 0
        }
      })
    );
  };

  // Assuming mergeQueryParams is defined as before

  const inc = (name: any) => {
    setCount({
      ...count,
      [name]: count[name] + 1
    });
  };

  const dec = (name: any) => {
    if (count[name] > 0)
      setCount({
        ...count,
        [name]: count[name] - 1
      });
  };

  const getMinDate = useMemo(() => {
    const afterSelect = new DateObject(dates[0]).add(1, "days");
    const minSelectableDate = new DateObject().add(1, "days");
    const condition = dates && dates.length > 0 && dates.length < 2;
    if (condition) {
      return afterSelect;
    } else {
      return minSelectableDate;
    }
  }, [dates]);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const fromDate = from
      ? new DateObject({
        date: new Date(from),
        format: "DD/MM/YYYY"
      })
      : null;
    const toDate = to
      ? new DateObject({
        date: new Date(to),
        format: "DD/MM/YYYY"
      })
      : null;
    if (from && to) {
      setDates([fromDate, toDate]);
      setTime([fromDate, toDate]);
      setFdate(from);
      setEdate(to);
    } else if (from) {
      setDates([fromDate]);
      setTime([fromDate]);
      setFdate(from);
    } else {
      setDates([]);
      setTime([]);
    }

    if (searchData.location) {
      setLocationName(searchData.location);
    }
    if (searchData.lat) {
      setLat(searchData.lat);
    }
    if (searchData.lng) {
      setLng(searchData.lng);
    }
    if (searchData.adults || searchData.children || searchData.pets) {
      setCount({
        adult: parseInt(searchData.adults) || 1,
        children: parseInt(searchData.children) || 0,
        pets: parseInt(searchData.pets) || 0
      });
    }
  }, [searchParams, HourlyBooking]);

  const dateValue = useMemo(() => {
    const val = HourlyBooking
      ? time[0].format("YYYY-MM-DD") ===
        time[1].format("YYYY-MM-DD")
        ? `${time[0] && time[0].day}${time[0]?.month?.shortName
        } ${time[0] && Time(time[0]?.toDate())}-${time[1] && Time(time[1]?.toDate())
        }`
        : `${time[0] && time[0].day}${time[0]?.month?.shortName
        } - ${time[1] && time[1].day}${time[1]?.month?.shortName
        } ${time[0] && Time(time[0]?.toDate())}-${time[1] && Time(time[1]?.toDate())
        }`
      : `${dates[0]?.day}--${dates[1]?.day} ${dates[0]?.month.shortName}`;
    return val;
  }, [time, dates, HourlyBooking])

  return (
    <>
      {" "}
      {!props.center && (
        <>
          {responsiveView === "sm" || responsiveView === "xs" ? (
            <>
              <SearchBar isLoaded={isLoaded} />
            </>
          ) : (
            <div ref={stickyElementRef}>
              <div>
                <div className={`${styles.search}`}>
                  <div
                    onClick={toggle}
                    className={`${styles.guest_tab} ${styles.category_tab} ${showMe ? styles.active : ""
                      } p-0`}
                  >
                    <div className={`${styles.tiles} tiles `}>
                      <button className="px-3 d-flex align-items-center">
                        {/* {!locationName && !searchData.adults && !searchData.children && !searchData.pets && <span className="text-black"></span>}
                            {locationName && <span>{locationName}&nbsp;</span>}
                            {(searchData.adults || searchData.children) && (
                              <span>
                                <span>
                                  &nbsp;
                                  {locationName && <span style={{ color: '#717171' }}>|</span>}
                                  &nbsp;{parseInt(searchData.adults || 0) + parseInt(searchData.children || 0)} Guests&nbsp;
                                </span>
                              </span>
                            )}

                            {searchData.pets && (
                              <>
                                {(searchData.adults || searchData.children) && <span style={{ color: '#717171' }}>|</span>}
                                <span>&nbsp;{searchData.pets} Pets</span>
                              </>
                            )} */}

                        <>
                          {locationName ? (
                            <span className={`${styles.span} text-muted`}>
                              {locationName}&nbsp;
                            </span>
                          ) : (
                            <span className={`${styles.span}`}>
                              {i18?.HEADER?.ANYWHERE || "Any Where"}
                            </span>
                          )}
                        </>

                        {dates.length !== 0 || time ? (
                          (dates[0] && dates[1]) || (time[0] && time[1]) ? (
                            <span className={`${styles.span} text-muted`}>
                              {dateValue}
                            </span>
                          ) : (
                            <span className={`${styles.span} text-muted`}>
                              {i18?.HEADER?.ANYDATES || "Any Dates"}
                            </span>
                          )
                        ) : (
                          <span className={`${styles.span} text-muted`}>
                            {i18?.HEADER?.ANYDATES || "Any Dates"}
                          </span>
                        )}
                        {listings?.specifications === "1" && (
                          <>
                            {count.adult > 1 || count.children ? (
                              <span
                                className={`${styles.span} px-3 text-muted`}
                              >
                                {parseInt(count.adult || 0) +
                                  parseInt(count.children || 0)}
                                {hiddenSettings.peopleCount === "1"
                                  ? i18?.HEADER?.PEOPLE || "People"
                                  : i18?.RESERVATIONS?.GUESTS || "Guests"}
                              </span>
                            ) : (
                              <span
                                className={`${styles.span} px-3 text-muted`}
                              >
                                {hiddenSettings.peopleCount === "1"
                                  ? i18?.HEADER?.PEOPLE || "People"
                                  : `${i18?.HEADER?.ADDGUESTS || "Any Guests"}`}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                      {/* <button className="px-3">
                            <span>Any week</span>
                          </button>
                          <button className="d-flex align-items-center">
                            <span className="px-3">Add guest</span>
                            
                          </button> */}
                      <button>
                        {" "}
                        <BiSearch
                          style={{
                            backgroundColor: yellowTheme.primaryColor,
                            color: yellowTheme.secondaryColor
                          }}
                        />
                        {/* style={{backgroundColor :CustomBgcolor}} */}
                      </button>
                      {/* <DynamicButtonComponent startIcon={<BiSearch/>} text="" width="35px" /> */}
                    </div>
                  </div>
                  <div
                    className={`${styles.stays_tab} ${styles.category_tab} ${showMe ? styles.active : ""
                      } w-100`}
                    style={{
                      height: "calc(100% - 25px)"
                    }}
                  >
                    <div
                      className={`${styles.stays_header} w-100`}
                      ref={header_ref}
                    >
                      <div
                        className={`d-flex align-items-center justify-content-center w-100`}
                      >
                        <button
                          onClick={toggle}
                          className={`${styles.btn_stays} ${styles.show_active}`}
                        >
                          <span>{i18?.HEADER?.STAYS || "Stays"}</span>
                        </button>
                        {hiddenSettings.ads === "1" && (
                          <button
                            onClick={() => router.push("/ads")}
                            className={`${styles.btn_stays}`}
                          >
                            <span>{i18?.HEADER?.STAYSs || "Ads"}</span>
                          </button>
                        )}
                      </div>
                      <div
                        className={`${styles.searchbox} ${searchActive ? styles.searchboxClick : ""
                          }`}
                      >
                        <div
                          className={`${styles.field_btn} ${styles.where_field}`}
                          onClick={() => changeStyles("searchWhere")}
                        >
                          <label
                            className={` w-100 ${changeStyle === "searchWhere"
                              ? `${styles.searchWhereHover}`
                              : styles.searchwhere
                              }`}
                            htmlFor="searchwhere-field"
                          >
                            <div
                              className="w-100"
                              aria-controls={
                                navOpen ? "basic-navmenu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={navOpen ? "true" : undefined}
                              onClick={handleNavClick}
                            >
                              <p
                                style={{
                                  fontSize: "13px",
                                  display: "flex",
                                  justifyContent: "start",
                                  paddingBottom: "0px",
                                  paddingTop: "10px"
                                  // fontSize: "var(--map-btn-text)",
                                  // color: "var(--text-color)",
                                  // fontWeight: 500,
                                }}
                              >
                                {i18?.HEADER?.WHERE || "Where"}
                              </p>
                              {isLoaded && (
                                <Autocomplete
                                  onLoad={onLoad}
                                  onPlaceChanged={onPlaceChanged}
                                  options={{}}
                                >
                                  <div className="d-flex">
                                    <input
                                      value={locationName}
                                      type="text"
                                      className={`${styles.searchinput}`}
                                      placeholder={
                                        i18?.HEADER?.SEARCHDESTINATIONS ||
                                        "Search Destination"
                                      }
                                      id="searchwhere-field"
                                      onChange={(e: any) =>
                                        setLocationName(e.target.value)
                                      }
                                    />
                                    {locationName && (
                                      <>
                                        <div
                                          onClick={() => {
                                            setLat("");
                                            setLng("");
                                            setLocationName("");
                                            dispatch(
                                              updateAddress({
                                                lat: "",
                                                lng: ""
                                              })
                                            );
                                            params.delete("lat");
                                            params.delete("lng");
                                            params.delete("location");
                                            window.history.replaceState(
                                              { path: params.toString() },
                                              "",
                                              `?${params.toString()}`
                                            );
                                          }}
                                        >
                                          {changeStyle === "searchWhere" && (
                                            <CloseIcon
                                              sx={{
                                                fontSize: 15,
                                                position: "absolute",
                                                top: "27px",
                                                right: "10px"
                                              }}
                                            />
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </Autocomplete>
                              )}
                            </div>
                          </label>
                        </div>
                        <div
                          className={`${styles.field_btn} ${styles.check_field}`}
                        >
                          <div className="d-flex h-100">
                            <div
                              className={
                                ` w-100 ${changeStyle === "CheckIN"
                                  ? `${styles.checkInHover}`
                                  : styles.btn_checkin
                                }` ||
                                `${checkinActive ? styles.searchboxClick : ""}`
                              }
                              onClick={togglecheckin}
                            >
                              <p style={{ fontSize: "13px" }}>
                                {i18?.ROOMPAGE?.CHECKINN || "Check In"}
                              </p>
                              {dates[0] || time[0] ? (
                                <div className="">
                                  {HourlyBooking ? (
                                    <p
                                      style={{
                                        whiteSpace: "nowrap",
                                        fontSize: "var(--filter-btn-text)",
                                        display: "flex",
                                        fontFamily: "var(--font-family-base)"
                                      }}
                                    >
                                      {" "}
                                      {time[0]
                                        ? time[0].format(
                                          settings.dateFormat || "YYYY/MM/DD"
                                        )
                                        : i18?.HEADER?.ADDTIME || "Add Time"}
                                    </p>
                                  ) : (
                                    <p
                                      style={{
                                        whiteSpace: "nowrap",
                                        fontSize: "var(--filter-btn-text)",
                                        display: "flex",
                                        fontFamily: "var(--font-family-base)"
                                      }}
                                    >
                                      {" "}
                                      {dates[0]
                                        ? dates[0].format(
                                          settings.dateFormat || "YYYY/MM/DD"
                                        )
                                        : i18?.HEADER?.ADDTIME || "Add Time"}
                                    </p>
                                  )}

                                  <div
                                    onClick={() => {
                                      setDates([]);
                                      setFdate("");
                                      setTime([]);
                                      dispatch(
                                        updateSearchDate({
                                          startDate: "",
                                          endDate: ""
                                        })
                                      );
                                      params.delete("from");
                                      params.delete("to");
                                      params.delete("adults");
                                      window.history.replaceState(
                                        { path: params.toString() },
                                        "",
                                        `?${params.toString()}`
                                      );
                                    }}
                                  >
                                    {changeStyle === "CheckIN" && (
                                      <CloseIcon
                                        sx={{
                                          fontSize: 15,
                                          position: "absolute",
                                          top: "27px",
                                          right: "10px"
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p
                                    style={{
                                      whiteSpace: "nowrap",
                                      fontSize: "var(--searchbox-header-size)",
                                      color: "var(--trips-subtitle-color)",
                                      fontFamily: "var(--font-family-base)"
                                    }}
                                  >
                                    {i18?.HEADER?.ADDDATES || "Add Dates"}
                                  </p>
                                </>
                              )}
                            </div>
                            <div
                              className={`${styles.btn_checkout} w-100 ${changeStyle === "CheckOUT"
                                ? `${styles.checkOutHover} ${styles.searchboxClick}`
                                : styles.btn_checkout
                                }`}
                              onClick={togglecheckout}
                            >
                              <p
                                style={{
                                  fontSize: "var(--notification-size)",
                                  fontFamily: "var(--font-family-base)",
                                  color: "var(--text-color)"
                                }}
                              >
                                {i18?.ROOMPAGE?.CHECK_OUT || "Check-out"}
                              </p>

                              {dates[1] || time[1] ? (
                                <div className="">
                                  {HourlyBooking ? (
                                    <p
                                      style={{
                                        whiteSpace: "nowrap",
                                        display: "flex",
                                        fontSize: "var(--filter-btn-text)",
                                        fontFamily: "var(--font-family-base)"
                                      }}
                                    >
                                      {time[1]
                                        ? time[1].format(
                                          settings.dateFormat || "YYYY/MM/DD"
                                        )
                                        : null}
                                    </p>
                                  ) : (
                                    <p
                                      style={{
                                        whiteSpace: "nowrap",
                                        display: "flex",
                                        fontSize: "var(--filter-btn-text)",
                                        fontFamily: "var(--font-family-base)"
                                      }}
                                    >
                                      {dates[1]
                                        ? dates[1].format(
                                          settings.dateFormat || "YYYY/MM/DD"
                                        )
                                        : null}
                                    </p>
                                  )}

                                  <div
                                    onClick={(e) => {
                                      setDates([]);
                                      setTime([]);
                                      setChangeStyle("CheckIN");
                                      e.stopPropagation();
                                      setEdate("");
                                      dispatch(
                                        updateSearchDate({
                                          startDate: searchData.from || "",
                                          endDate: ""
                                        })
                                      );
                                      params.delete("to");
                                      params.delete("from");
                                      params.delete("adults");
                                      window.history.replaceState(
                                        { path: params.toString() },
                                        "",
                                        `?${params.toString()}`
                                      );
                                    }}
                                  >
                                    {changeStyle === "CheckOUT" && (
                                      <CloseIcon
                                        sx={{
                                          fontSize: 15,
                                          position: "absolute",
                                          top: "27px",
                                          right: "10px"
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p
                                    style={{
                                      whiteSpace: "nowrap",
                                      fontSize: "var(--searchbox-header-size)",
                                      color: "var(--trips-subtitle-color)",
                                      fontFamily: "var(--font-family-base)"
                                    }}
                                  >
                                    {i18?.HEADER?.ADDDATES || "Add Dates"}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            className={`${styles.search_region}`}
                            style={{
                              display: changeStyle === 'CheckIN' || changeStyle === 'CheckOUT' ? "block" : "none"
                            }}
                          >
                            {HourlyBooking ? (
                              checkin ? (
                                <DateHourBox
                                  type="from"
                                  time={time}
                                  value={time[0]}
                                  onChange={(mydate: any) => {
                                    setTime([mydate, time[1]]);
                                  }}
                                />
                              ) : (
                                <DateHourBox
                                  type="to"
                                  time={time}
                                  value={time[1]}
                                  onChange={(mydate: any) => {
                                    setTime([time[0], mydate]);
                                    // setDates([date, dates[1]]);
                                    setCheckin(false);
                                  }}
                                />
                              )
                            ) : (
                              <Calendar
                                className="rmdpprime"
                                value={dates}
                                onChange={(date: any) => {
                                  const fromDate = date[0]
                                    ? date[0].format("YYYY-MM-DD")
                                    : null;
                                  const toDate = date[1]
                                    ? date[1].format("YYYY-MM-DD")
                                    : null;
                                  if (fromDate && toDate) {
                                    // setChangeStyle('searchWhere')
                                  } else if (fromDate) {
                                    setChangeStyle("CheckOUT");
                                  } else {
                                    setChangeStyle("CheckIN");
                                  }
                                  setFdate(fromDate);
                                  setEdate(toDate);
                                  {
                                    fromDate && setCheckin(true);
                                    setCheckout(true);
                                  }
                                  // const currentParams = new URLSearchParams(searchParams);
                                  // currentParams.set('from', fromDate)
                                  // if (toDate)
                                  //   currentParams.set('to', toDate)
                                  // router.replace(`?${currentParams}`, { scroll: false })

                                  setDates(date);
                                }}
                                minDate={getMinDate}
                                highlightToday={false}
                                numberOfMonths={2}
                                range
                                rangeHover
                                format="DD/MM/YYYY"
                              />
                            )}
                          </div>
                        </div>

                        <div
                          className={`${styles.field_btn} ${styles.guest_field}`}
                        >
                          <div
                            className={`d-flex  ${changeStyle === "Guest"
                              ? styles.guest_fieldHover
                              : styles.guest_field
                              }`}
                          >
                            {listings.specifications === "1" && (
                              <div
                                className={`${styles.add_guests}`}
                                onClick={toggleguest}
                              >
                                <p
                                  style={{
                                    fontSize: "var(--notification-size)",
                                    padding: "3px",
                                    fontFamily: "var(--font-family-base)",
                                    color: "var(--text-color)"
                                  }}
                                >
                                  {i18?.HEADER?.WHO || "Who"}
                                </p>
                                {count.adult > 1 ||
                                  count.children ||
                                  count.pets !== 0 ? (
                                  <div
                                    className={`d-flex ${changeStyle === "Guest" ? 'justify-content-start' : 'justify-content-end'}`}
                                    style={{ width: "100px" }}
                                  >
                                    <p
                                      style={{
                                        whiteSpace: "nowrap",
                                        fontSize: "var(--filter-btn-text)"
                                      }}
                                    >
                                      {
                                        hiddenSettings.peopleCount === "1"
                                          ? `${i18?.HEADER?.PEOPLE || "People"
                                          } ${count.adult || 0}`
                                          : `${i18?.TRIPS?.GUEST || "Guest"} ${(count.adult || 0) +
                                          (count.children || 0)
                                          }` /* {count.pets ? `, Pets ${count.pets}` : ''} */
                                      }
                                    </p>

                                    {/* <button
                                        style={{
                                          border: '1px solid transparent',
                                          backgroundColor: 'transparent',
                                          
                                        }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setCount({
                                            adult:0,
                                            children:0,
                                            pets:0
                                          })
                                          setGuest(!guest);
                                        }}
                                      >
                                       
                                      </button> */}
                                    <div
                                      onClick={() => {
                                        setCount({
                                          adult: 1,
                                          children: 0,
                                          pets: 0
                                        });
                                        setGuest(!guest);
                                        dispatch(
                                          updateGuest({
                                            adult: 1,
                                            children: 0,
                                            pets: 0
                                          })
                                        );
                                        params.delete("adults");
                                        params.delete("pets");
                                        params.delete("children");
                                        window.history.replaceState(
                                          { path: params.toString() },
                                          "",
                                          `?${params.toString()}`
                                        );
                                      }}
                                    >
                                      {changeStyle === "Guest" && (
                                        <CloseIcon
                                          sx={{
                                            fontSize: 15,
                                            position: "absolute",
                                            top: "27px",
                                            right: "200px"
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <p
                                    style={{
                                      whiteSpace: "nowrap",
                                      fontSize: "var(--searchbox-header-size)",
                                      color: "var(--trips-subtitle-color)",
                                      fontFamily: "var(--font-family-base)"
                                    }}
                                  >
                                    {hiddenSettings.peopleCount !== "1"
                                      ? `${i18?.HEADER?.ADDGUESTS || "Any Guests"
                                      }`
                                      : `${i18?.HEADER?.ADDPEOPLE || "Add people"
                                      }`}
                                  </p>
                                )}
                              </div>
                            )}
                            <div className={`${styles.add_guests}`}>
                              {/*  */}
                              <DynamicButtonComponent
                                variant="contained"
                                text={i18?.HEADER?.SEARCH || "Search"}
                                fontSize="var(--homepage-header-size)"
                                startIcon={
                                  <SearchIcon style={{
                                    marginRight: "0px",
                                    width: '24px',
                                    height: 'auto'
                                  }} />
                                }
                                onClick={handleSearch}
                              >
                                <span>
                                  <div></div>
                                </span>
                              </DynamicButtonComponent>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div
                        style={{ display: guest ? "block" : "none" }}
                        className={`${styles.stay_guest}`}
                      >
                        <div className={`${styles.guestContainer}`}>
                          <div className={`${styles.guests} border-bottom`}>
                            <div>
                              <p>Adults</p>
                            </div>
                            <div
                              className='d-flex align-items-center gap-4 '
                            >
                              <button onClick={() => dec("adult")} className={`${styles.add_btn}`}>
                                -
                              </button>


                              <div
                                className={`${styles.input_btn}`}
                              >{count.adult}</div>

                              <button onClick={() => inc("adult")} className={`${styles.del_btn}`}>
                                +
                              </button>
                            </div>
                          </div>
                          <div className={`${styles.guests} border-bottom`}>
                            <div>
                              <p>Children</p>
                            </div>
                            <div
                              className='d-flex align-items-center gap-4'
                            >
                              <button onClick={() => dec('children')} className={`${styles.add_btn}`}>
                                -
                              </button>


                              <div
                                className={`${styles.input_btn}`}
                              >{count.children}</div>

                              <button onClick={() => inc('children')} className={`${styles.del_btn}`}>
                                +
                              </button>
                            </div>
                          </div>

                          <div className={`${styles.guests} `}>
                            <div>
                              <p>Pets</p>
                            </div>
                            <div
                              className='d-flex align-items-center gap-4'
                            >
                              <button onClick={() => dec('pets')} className={`${styles.add_btn}`}>
                                -
                              </button>


                              <div
                                className={`${styles.input_btn}`}
                              >{count.pets}</div>

                              <button onClick={() => inc('pets')} className={`${styles.del_btn}`}>
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                      </div> */}
              </div>

              <div
                style={{ display: guest ? "block" : "none" }}
                className={`${styles.stay_guest}`}
              >
                <div className={`${styles.guestContainer}`}>
                  <div className={`${styles.guests}` /* border-bottom` */}>
                    <div>
                      <p>
                        {hiddenSettings.peopleCount === "1"
                          ? i18?.HEADER?.PEOPLE || "People"
                          : i18?.ROOMPAGE?.ADULTS || "Adults"}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-4 ">
                      
                        <button
                          onClick={() => dec("adult")}
                          className={`${count.adult <= 0 ? styles.disableBtn : styles.add_btn}`}
                          disabled={count.adult <= 0}
                        >
                          -
                        </button>

                      <div className={`${styles.input_btn}`}>
                        {hiddenSettings.peopleCount !== "1" ? (
                          count.adult
                        ) : (
                          <input
                            value={count.adult}
                            readOnly={
                              hiddenSettings.peopleCount !== "1" ? true : false
                            }
                          />
                        )}
                      </div>

                      <button
                        onClick={() => inc("adult")}
                        className={`${styles.del_btn}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {hiddenSettings.peopleCount !== "1" && (
                    <div
                      className={`${styles.guests} border-top border-bottom`}
                    >
                      <div>
                        <p>{i18?.SELECTBASICS?.CHILDREN || "Children"}</p>
                      </div>
                      <div className="d-flex align-items-center gap-4">
                        <button
                          onClick={() => dec("children")}
                          className={`${count.children <= 0 ? styles.disableBtn : styles.add_btn}`}
                          disabled={count.children <= 0}
                        >
                          -
                        </button>

                        <div className={`${styles.input_btn}`}>
                          {count.children}
                        </div>

                        <button
                          onClick={() => inc("children")}
                          className={`${styles.del_btn}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  {hiddenSettings.peopleCount !== "1" && (
                    <div className={`${styles.guests} `}>
                      <div>
                        <p>{i18?.FILTER?.PETS || "Pets"}</p>
                      </div>
                      <div className="d-flex align-items-center gap-4">
                        <button
                          onClick={() => dec("pets")}
                          className={`${count.pets <= 0 ? styles.disableBtn : styles.add_btn}`}
                          disabled={count.pets <= 0}
                        >
                          -
                        </button>

                        <div className={`${styles.input_btn}`}>
                          {count.pets}
                        </div>

                        <button
                          onClick={() => inc("pets")}
                          className={`${styles.del_btn}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SearchBarComp;

{/* <div className={styles.datePickerContainer}>
  <DateRangePicker
    startDate={dates.startDate}
    startDateId="start_date"
    endDate={dates.endDate}
    endDateId="end_date"
    onDatesChange={({ startDate, endDate }) => setDates({ startDate, endDate })}
    focusedInput={focusedInput}
    onFocusChange={(focused) => setFocusedInput(focused)}
    numberOfMonths={2}
    minimumNights={1}
    displayFormat="DD MMM"
    isOutsideRange={() => false}
    showClearDates={true}
    reopenPickerOnClearDates={true}
    customArrowIcon={<span className={styles.arrow}>→</span>}
  />
</div> */}
