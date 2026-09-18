import React, { useEffect, useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import dynamic from "next/dynamic";
import { Calendar, DateObject } from "react-multi-date-picker";
import { Autocomplete } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

import {
  // updateLat,
  // updateLng,
  // updateAdultCount,
  // updateChildrenCount,
  // updateLocation,
  // updateEndDate,
  // updatePetsCount,
  // updateStartDate,
  searchSelector,
  setFilterValues,
  updateAddress,
  updateSearchDate,
  updateGuest,
} from "@/redux/slice/searchValue";
import { dispatch } from "@/redux/store";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { yellowTheme } from "@/components/colorVariable";
import { usePageContext } from "@/components/Providers/PageContext";
import { Time } from "@/services/utils/datetime";

import styles from "./searchbar.module.scss";

const TabPanel: any = dynamic(() => import("@mui/lab/TabPanel"), {
  ssr: false,
});
const TabList: any = dynamic(() => import("@mui/lab/TabList"), { ssr: false });
const Drawer: any = dynamic(() => import("@mui/material/Drawer"));
const DateHourBox: any = dynamic(() => import("./HourPicker/index"));

const SearchBar = ({ isLoaded }: any) => {
  const { i18, settings, responsiveView } = usePageContext();
  const { listings } = settings;
  const searchParams: any = useSearchParams();
  const HourlyBooking =
    settings?.hiddenSettings?.hourlyBooking === "1" ? true : false;
  const searchData = Object.fromEntries(searchParams);
  const params: any =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : {};
  const router = useRouter();
  const [state, setState] = React.useState(false);
  const [time, setTime] = useState<any>([]);
  const [value, setValue] = useState("1");
  const [dates, setDates] = useState<any>([]);
  const [autocomplete, setautocomplete] = useState<any>(null);
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [fdate, setFdate] = useState("");
  const [edate, setEdate] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [opencheckinDate, setOpencheckinDate] = useState(false);
  const [opencheckoutDate, setOpencheckoutDate] = useState(false);
  const [openGuest, setOpenGuest] = useState(false);

  const {
    accomendation,
    priceData,
    searchdate,
    propertyType,
    amenities,
    instantbooking,
  } = useSelector(searchSelector);

  const propertySearch = propertyType;
  const maxprice = priceData.maxPrice;
  const minprice = priceData.minPrice;
  const bedroom = accomendation.bedRoom;
  const bathroom = accomendation.bathRoom;

  const handleDrawerClose = () => {
    // Add any additional logic you need before closing the drawer
    setState(false);
    setOpenDate(false);
  };
  const drawerOpen = () => {
    setState(true);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const onLoad = (autocomplete: any) => {
    setautocomplete(autocomplete);
  };
  // const { isLoaded } = useJsApiLoader({
  //     id: 'google-map-script',
  //     googleMapsApiKey: APIKEY,
  //     libraries: ['places'],
  // })
  const [count, setCount] = useState<any>({
    adult: 1,
    children: 0,
    pets: 0,
  });

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

  const handleSearch = () => {
    const currentParams = new URLSearchParams();
    if (lat && lng) {
      currentParams.set("lat", lat);
      currentParams.set("lng", lng);
    }

    if (fdate && edate) {
      currentParams.set("from", fdate);
      currentParams.set("to", edate);
    }

    if (locationName) {
      currentParams.set("location", locationName);
    }
    if (count.adult) {
      currentParams.set("adults", count.adult);
    }
    if (count.children) {
      currentParams.set("children", count.children);
    }
    if (count.pets) {
      currentParams.set("pets", count.pets);
    }
    if (propertySearch) {
      currentParams.set("propertyType", propertySearch);
    }
    if (minprice) {
      currentParams.set("minPrice", minprice);
    }
    if (maxprice) {
      currentParams.set("maxPrice", maxprice);
    }
    if (bedroom) {
      currentParams.set("bedRoom", bedroom);
    }
    if (bathroom) {
      currentParams.set("bathRoom", bathroom);
    }
    if (instantbooking) {
      currentParams.set("instantBooking", instantbooking === "1" ? "1" : "0");
    }
    if (amenities && amenities.length > 0) {
      currentParams.set("amenities", amenities.join());
    }
    // router.replace(`?${currentParams}`, { scroll: false });
    window.history.replaceState(
      { path: `/?${currentParams}` },
      "",
      `/?${currentParams}`
    );
    dispatch(
      setFilterValues({
        guests: {
          adult: count.adult,
          children: count.children,
          pets: count.pets,
        },
        address: {
          lat: lat,
          lng: lng,
          location: locationName,
        },
        searchdate: {
          ...searchdate,
          startDate: fdate,
          endDate: edate,
        },
      })
    );
    // dispatch(updateLat(lat));
    // dispatch(updateLng(lng));
    // dispatch(updateStartDate(fdate));
    // dispatch(updateEndDate(edate));
    // dispatch(updateAdultCount(count.adult));
    // dispatch(updateChildrenCount(count.children));
    // dispatch(updatePetsCount(count.pets));
    // dispatch(updateLocation(locationName));
    setState(false);
  };

  const handleClearSearch = () => {
    setDates([]);
    setTime([]);
    router.replace("/");
    setState(false);
    setOpenDate(false);
    setLat("");
    setLng("");
    setLocationName("");
    setFdate("");
    setEdate("");
    setCount({
      adult: 0,
      children: 0,
      pets: 0,
    });
    dispatch(
      setFilterValues({
        guests: {
          adult: 0,
          children: 0,
          pets: 0,
        },
        address: {
          lat: "",
          lng: "",
          location: "",
        },
        searchdate: {
          ...searchdate,
          startDate: "",
          endDate: "",
        },
      })
    );
    // dispatch(updateLat(""));
    // dispatch(updateLng(""));
    // dispatch(updateStartDate(""));
    // dispatch(updateEndDate(""));
    // dispatch(updateAdultCount(0));
    // dispatch(updateChildrenCount(0));
    // dispatch(updatePetsCount(0));
    // dispatch(updateLocation(""));
  };

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const fromDate = from
      ? new DateObject({
          date: new Date(from),
          format: "DD/MM/YYYY",
        })
      : null;
    const toDate = to
      ? new DateObject({
          date: new Date(to),
          format: "DD/MM/YYYY",
        })
      : null;
    if (from && to) {
      setDates([fromDate, toDate]);
      {
        HourlyBooking && setTime([fromDate, toDate]);
      }
    } else if (from) {
      setDates([fromDate]);
      {
        HourlyBooking && setTime([fromDate]);
      }
    } else {
      setDates([]);
      {
        HourlyBooking && setTime([]);
      }
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
    if (searchData.adult || searchData.children || searchData.pets) {
      setCount({
        adult: parseInt(searchData.adults) || 0,
        children: parseInt(searchData.children) || 0,
        pets: parseInt(searchData.pets) || 0,
      });
    }
  }, []);
  const inc = (name: any) => {
    setCount({
      ...count,
      [name]: count[name] + 1,
    });
  };

  const dec = (name: any) => {
    if (name === "adult" ? count[name] > 1 : count[name] > 0)
      setCount({
        ...count,
        [name]: count[name] - 1,
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

  return (
    <>
      <div className={`${styles.searchbar}`}>
        <div className={`${styles.inputField}`}>
          <button onClick={drawerOpen}>
            <div className={`${styles.content}`}>
              {responsiveView === "sm" || responsiveView === "xs" ? (
                <span className={`${styles.Searchsvg}`}>
                  <SearchIcon
                    sx={{
                      fill: "var(--new-text-color-purplerooms)",
                    }}
                  />
                </span>
              ) : (
                <div
                  className={`${styles.svg}`}
                  style={{
                    backgroundColor: yellowTheme.primaryColor,
                    color: yellowTheme.secondaryColor,
                  }}
                >
                  <SearchIcon />
                </div>
              )}
              <div className={`${styles.placeholder}`}>
                {locationName ? (
                  <p
                    style={{
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      // color: "var(--new-text-color-purplerooms)"
                    }}
                    className="px-2"
                  >
                    {locationName}
                  </p>
                ) : (
                  <p className="px-2">
                    {i18?.HEADER?.WHERETO || "Where to?"}
                    {/* {"Where to?"} */}
                  </p>
                )}
                {/* {searchData.adults || searchData.children || searchData.pets ? 
                                <div className='d-flex'>
                                {(searchData.adults || searchData.children) && (
                                    <span>
                                        <span style={{fontSize:'14px',fontWeight:'bold'}}>
                                            &nbsp;{parseInt(searchData.adults || 0) + parseInt(searchData.children || 0)} Guests&nbsp;
                                        </span>
                                    </span>
                                )}

                                {searchData.pets && (
                                    <>
                                        {(searchData.adults || searchData.children) && <span style={{ color: '#717171' }}>|</span>}
                                        <span style={{fontSize:'14px',fontWeight:'bold'}}>&nbsp;{searchData.pets} Pets</span>
                                    </>
                                )} 
                                </div> : <span style={{fontSize:'12px',fontWeight:'bold'}}>Add guests</span> } */}
                {/* {locationName ? <span>{locationName}&nbsp;</span> : <span>Anywhere</span>} */}
                <div className="d-flex">
                  {dates.length !== 0 ? (
                    dates[0] && dates[1] ? (
                      <>
                        <span className="text-muted px-2">
                          {dates[0].day}-{dates[1].day}&nbsp;
                          {dates[0].month.shortName}
                        </span>
                        <span style={{ color: "#717171" }}>|</span>
                      </>
                    ) : (
                      <>
                        <span className="text-muted px-2">
                          {i18?.HEADER?.ANYDATES || "Any dates"}
                        </span>
                        <span style={{ color: "#717171" }}>|</span>
                      </>
                    )
                  ) : (
                    <>
                      <span className={`text-muted px-2 ${styles.ellipsis}`}>
                        {i18?.HEADER?.ANYWHERE || "Anywhere"}
                      </span>{" "}
                      <span className={`${styles.middot}`}>&#183;</span>
                      {/* <span style={{ color: '#717171' }}>|</span> */}
                      <span className={`text-muted px-2 ${styles.ellipsis}`}>
                        {i18?.HEADER?.ANYWEEK || "Any week"}
                      </span>{" "}
                      <span className={`${styles.middot}`}>&#183;</span>
                      {listings?.specifications === "1" && (
                        <span className={`text-muted px-2 ${styles.ellipsis}`}>
                          {i18?.HEADER?.ADDGUESTS || "Add guests"}
                        </span>
                      )}
                    </>
                  )}

                  {/* {count.adult || count.children ?
                                        <><span className="px-2 text-muted">{parseInt(count.adult || 0) + parseInt(count.children || 0)} {i18?.RESERVATIONS?.GUESTS || "Guests"}</span></> :
                                        <span className="px-2 text-muted">{i18?.HEADER?.ANYGUESTS || "Any guests"}</span>
                                    } */}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
      <Drawer
        anchor="top"
        open={state}
        onClose={handleDrawerClose}
        PaperProps={{ style: { height: "100%" } }}
        transitionDuration={500}
      >
        <div className={`${styles.header}`}>
          <TabContext value={value}>
            <div className={`${styles.sticky}`}>
              <div className={`${styles.close}`} onClick={handleDrawerClose}>
                <CloseIcon
                  sx={{ margin: "auto", marginLeft: "2px", marginTop: "2px" }}
                />
              </div>
              <div className={`${styles.tablist}`}>
                <TabList
                  onChange={handleChange}
                  sx={{ indicator: { color: "var(--text-color)" } }}
                >
                  <Tab
                    label={i18?.HEADER?.STAYS || "Stays"}
                    value="1"
                    style={{
                      color: value === "1" ? "var(--text-color)" : "inherit",
                      fontWeight: value === "1" ? "bold" : "normal",
                    }}
                  />
                  {/* <Tab label="Experiences"
                                        value="2"
                                        style={{
                                            color: value === "2" ? 'black' : 'inherit',
                                            fontWeight: value === "2" ? 'bold' : 'normal',
                                        }} /> */}
                </TabList>
              </div>
            </div>

            <TabPanel className={`${styles.panels}`} value="1">
              <div className={`${styles.card}`}>
                <h4>{i18?.HEADER?.WHERETO || "Where to?"}</h4>
                <div className={`${styles.input}`}>
                  {isLoaded && (
                    // @ts-ignore
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                      options={{}}
                    >
                      <div className="d-flex">
                        <input
                          value={locationName}
                          className={`${styles.inputContainer}`}
                          type="text"
                          placeholder={
                            i18?.HEADER?.SEARCHDESTINATIONS ||
                            "Search destinations"
                          }
                          style={{ paddingLeft: "50px" }}
                          onChange={(e: any) => setLocationName(e.target.value)}
                        />
                        {locationName && (
                          <button
                            style={{
                              border: "1px solid transparent",
                              backgroundColor: "transparent",
                              position: "relative",
                              bottom: "10px",
                              left: "10px",
                            }}
                            onClick={() => {
                              setLat("");
                              setLng("");
                              setLocationName("");
                              dispatch(
                                updateAddress({
                                  lat: "",
                                  lng: "",
                                  location: "",
                                })
                              );
                              // dispatch(updateLat(""));
                              // dispatch(updateLng(""));
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
                            <CloseIcon sx={{ fontSize: 18, color: "black" }} />
                          </button>
                        )}
                      </div>
                    </Autocomplete>
                  )}
                  <div className={`${styles.icon}`}>
                    <SearchIcon />
                  </div>
                </div>

                {/* 
                                <div className={`${styles.regional_images}`}>
                                    {regionData.map((region: any, r: number) => (
                                        <div
                                            className="d-flex flex-column p-2"
                                            key={"region" + r}
                                        >
                                            <label htmlFor={"region_" + r}>
                                                <input
                                                    type="radio"
                                                    name="regionradio"
                                                    id={"region_" + r}
                                                    defaultChecked={r === 0}
                                                />
                                                <Image
                                                    width="100"
                                                    height="100"
                                                    src={region.source}
                                                    alt={region.alt}
                                                // className="w-100 h-100 region"
                                                />
                                            </label>
                                            <span className="text-capitalize mt-2">
                                                {region.alt}
                                            </span>
                                        </div>
                                    ))}
                                </div> */}
              </div>
              {!HourlyBooking && (
                <div
                  className={`${styles.card}`}
                  onClick={() => setOpenDate(true)}
                >
                  <div className={`${styles.card2}`}>
                    {(searchData.from && searchData.to) ||
                    (dates[0] && dates[1]) ? (
                      <>
                        <p className="">
                          {dates[0] &&
                            dates[1] &&
                            `${dates[0].format(
                              "YYYY-MM-DD"
                            )} -- ${dates[1].format("YYYY-MM-DD")}`}
                        </p>
                        {(dates[0] || dates[1]) && (
                          <div
                            className=""
                            onClick={() => {
                              setDates([]);
                              setEdate("");
                              setFdate("");
                              dispatch(
                                updateSearchDate({
                                  ...searchdate,
                                  startDate: "",
                                  endDate: "",
                                })
                              );
                              // dispatch(updateStartDate(""));
                              // dispatch(updateEndDate(""));
                              setOpenDate(false);
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
                            <CloseIcon
                              sx={{
                                fontSize: 18,
                                color: "black",
                                marginTop: "0px",
                              }}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <p>{i18?.HEADER?.WHEN || "When"}</p>
                    )}

                    {!dates[0] || !dates[1] ? (
                      openDate ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpenDate(false);
                          }}
                        >
                          {i18?.ROOMPAGE?.CLOSE || "close"}
                        </span>
                      ) : (
                        <span style={{ whiteSpace: "nowrap" }}>
                          {i18?.HEADER?.ADDDATES || "Add dates"}
                        </span>
                      )
                    ) : null}
                  </div>
                </div>
              )}
              {HourlyBooking && (
                <div
                  className={`${styles.card}`}
                  onClick={() => setOpencheckinDate(true)}
                >
                  <div className={`${styles.card2}`}>
                    {(searchData.from && searchData.to) ||
                    (dates[0] && dates[1]) ||
                    time[0]?.toDate ? (
                      <>
                        <p className="">
                          {time[0].toDate() &&
                            `${time[0]?.format("YYYY-MM-DD")}`}
                          -{time[0].toDate() && Time(time[0].toDate())}
                        </p>
                        {time[0].toDate() && (
                          <div
                            className=""
                            onClick={() => {
                              setDates([]);
                              setTime([]);
                              setEdate("");
                              setFdate("");
                              dispatch(
                                updateSearchDate({
                                  ...searchdate,
                                  startDate: "",
                                  endDate: "",
                                })
                              );
                              // dispatch(updateStartDate(""));
                              // dispatch(updateEndDate(""));
                              setOpencheckinDate(false);
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
                            <CloseIcon
                              sx={{
                                fontSize: 18,
                                color: "black",
                                marginTop: "0px",
                              }}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <p>{i18?.HEADER?.CHECKIN || "Check-In"}</p>
                    )}

                    {!time[0]?.toDate() ? (
                      opencheckinDate ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpencheckinDate(false);
                          }}
                        >
                          {i18?.ROOMPAGE?.CLOSE || "close"}
                        </span>
                      ) : (
                        <span style={{ whiteSpace: "nowrap" }}>
                          {i18?.HEADER?.ADDDATES || "Add dates"}
                        </span>
                      )
                    ) : null}
                  </div>
                </div>
              )}
              {opencheckinDate && HourlyBooking && (
                <>
                  <div className={`${styles.card}`}>
                    <DateHourBox
                      type="from"
                      time={time}
                      value={time[0]}
                      onChange={(mydate: any) => {
                        setTime([mydate, time[1]]);
                      }}
                    />
                  </div>
                </>
              )}
              {HourlyBooking && (
                <div
                  className={`${styles.card}`}
                  onClick={() => setOpencheckoutDate(true)}
                >
                  <div className={`${styles.card2}`}>
                    {(searchData.from && searchData.to) ||
                    (dates[0] && dates[1]) ||
                    time[1]?.toDate() ? (
                      <>
                        <p className="">
                          {time[1].toDate() &&
                            `${time[1]?.format("YYYY-MM-DD")}`}
                          -{time[1].toDate() && Time(time[1].toDate())}
                        </p>
                        {time[1].toDate() && (
                          <div
                            className=""
                            onClick={() => {
                              setDates([]);
                              setTime([]);
                              setEdate("");
                              setFdate("");
                              dispatch(
                                updateSearchDate({
                                  ...searchdate,
                                  startDate: "",
                                  endDate: "",
                                })
                              );
                              // dispatch(updateStartDate(""));
                              // dispatch(updateEndDate(""));
                              setOpencheckoutDate(false);
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
                            <CloseIcon
                              sx={{
                                fontSize: 18,
                                color: "black",
                                marginTop: "0px",
                              }}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <p>{i18?.HEADER?.CHECKOUT || "Check-out"}</p>
                    )}

                    {!time[1]?.toDate() ? (
                      opencheckoutDate ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpencheckoutDate(false);
                          }}
                        >
                          {i18?.ROOMPAGE?.CLOSE || "close"}
                        </span>
                      ) : (
                        <span style={{ whiteSpace: "nowrap" }}>
                          {i18?.HEADER?.ADDDATES || "Add dates"}
                        </span>
                      )
                    ) : null}
                  </div>
                </div>
              )}

              {openDate && !HourlyBooking && (
                <>
                  <div className={`${styles.card}`}>
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
                        setFdate(fromDate);
                        setEdate(toDate);

                        // const currentParams = new URLSearchParams(searchParams);
                        // currentParams.set('from', fromDate)
                        // if (toDate)
                        //   currentParams.set('to', toDate)
                        // router.replace(`?${currentParams}`, { scroll: false })

                        setDates(date);
                      }}
                      minDate={getMinDate}
                      highlightToday={false}
                      numberOfMonths={1}
                      range
                      rangeHover
                      format="DD/MM/YYYY"
                    />
                  </div>
                </>
              )}

              {opencheckoutDate && HourlyBooking && (
                <>
                  <div className={`${styles.card}`}>
                    <DateHourBox
                      type="to"
                      time={time}
                      value={time[1]}
                      onChange={(mydate: any) => {
                        setTime([time[0], mydate]);
                      }}
                    />
                  </div>
                </>
              )}
              {listings.specifications === "1" && (
                <div
                  className={`${styles.card}`}
                  onClick={() => setOpenGuest(true)}
                >
                  <div className={`${styles.card2}`}>
                    {count.adult > 1 || count.children > 0 || count.pets > 0 ? (
                      <>
                        <p>
                          Add Guest
                          {/* {(count.adult || 0) + (count.children || 0)}
                          {count.pets ? `, Pets ${count.pets}` : ""} */}
                        </p>
                        <div
                          onClick={() => {
                            setCount({ adult: 0, children: 0, pets: 0 });
                            setOpenGuest(false);
                            dispatch(
                              updateGuest({
                                adult: 0,
                                children: 0,
                                pets: 0,
                              })
                            );
                            // dispatch(updateAdultCount(0));
                            // dispatch(updateChildrenCount(0));
                            // dispatch(updatePetsCount(0));
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
                          <CloseIcon
                            sx={{
                              fontSize: 18,
                              color: "black",
                              marginTop: "0px",
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <p>{i18?.HEADER?.WHO || "Who"}</p>
                    )}
                    {count.adult === 1 &&
                    count.children === 0 &&
                    count.pets === 0 ? (
                      openGuest ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpenGuest(false);
                          }}
                        >
                          {i18?.ROOMPAGE?.CLOSE || "close"}
                        </span>
                      ) : (
                        <span>{i18?.HEADER?.ADDGUESTS || "Add Guests"}</span>
                      )
                    ) : null}
                  </div>
                </div>
              )}

              {openGuest && (
                <div className={`${styles.card}`}>
                  <div className="d-flex justify-content-between border-bottom pb-3 pt-3">
                    <p>{i18?.ROOMPAGE?.ADULTS || "Adults"}</p>
                    <div className="d-flex align-items-center gap-4 ">
                      {count.adult > 1 && (
                        <button
                          onClick={() => dec("adult")}
                          className={`${styles.add_btn}`}
                        >
                          -
                        </button>
                      )}

                      <div className={`${styles.input_btn}`}>{count.adult}</div>

                      <button
                        onClick={() => inc("adult")}
                        className={`${styles.del_btn}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-3 pt-3">
                    <p>{i18?.ROOMPAGE?.CHILDREN || "Children"}</p>
                    <div className="d-flex align-items-center gap-4 ">
                      {count.children > 0 && (
                        <button
                          onClick={() => dec("children")}
                          className={`${styles.add_btn}`}
                        >
                          -
                        </button>
                      )}

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
                  <div className="d-flex justify-content-between pb-3 pt-3">
                    <p>{i18?.ROOMPAGE?.PETS || "Pets"}</p>
                    <div className="d-flex align-items-center gap-4 ">
                      {count.pets > 0 && (
                        <button
                          onClick={() => dec("pets")}
                          className={`${styles.add_btn}`}
                        >
                          -
                        </button>
                      )}

                      <div className={`${styles.input_btn}`}>{count.pets}</div>

                      <button
                        onClick={() => inc("pets")}
                        className={`${styles.del_btn}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TabPanel>
            {/* <TabPanel className={`${styles.panels}`} value="2">
                            <div className={`${styles.card}`}>
                                <h4>Where to?</h4>
                                <div className={`${styles.input}`}>
                                    <input
                                        className={`${styles.inputContainer}`}
                                        type="text"
                                        placeholder="Search destinations"
                                        style={{ paddingLeft: '50px' }} // Adjust padding to accommodate the icon
                                    />
                                    <div className={`${styles.icon}`}><SearchIcon /></div>
                                </div>

                                <div className={`${styles.regional_images}`}>
                                    {regionData.map((region: any, r: number) => (
                                        <div
                                            className="d-flex flex-column p-2"
                                            key={"region" + r}
                                        >
                                            <label htmlFor={"region_" + r}>
                                                <input
                                                    type="radio"
                                                    name="regionradio"
                                                    id={"region_" + r}
                                                    defaultChecked={r === 0}
                                                />
                                                <Image
                                                    width="100"
                                                    height="100"
                                                    src={region.source}
                                                    alt={region.alt}
                                                // className="w-100 h-100 region"
                                                />
                                            </label>
                                            <span className="text-capitalize mt-2">
                                                {region.alt}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`${styles.card}`}>
                                <div className={`${styles.card2}`}>
                                    <p>When</p>
                                    <span>Add dates</span>
                                </div>
                            </div>
                            <div className={`${styles.card}`}>
                                <div className={`${styles.card2}`}>
                                    <p>Who</p>
                                    <span>Add guests</span>
                                </div>
                            </div>

                        </TabPanel> */}
          </TabContext>
          <div className={`${styles.footer}`}>
            <button className={`${styles.btn}`} onClick={handleClearSearch}>
              {i18?.FILTER?.CLEARALL || "Clear all"}
            </button>
            <DynamicButtonComponent
              variant="contained"
              className={`${styles.btn2}`}
              text={i18?.HEADER?.SEARCH || "Search"}
              onClick={handleSearch}
              startIcon={<SearchIcon style={{ color: "white" }} />}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default SearchBar;
