"use client";
import React, { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import Slider from "@mui/material/Slider";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
// import Switch, { SwitchProps } from "@mui/material/Switch";
// import { styled } from "@mui/material/styles";

import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { violetTheme } from "@/components/colorVariable";
import { StyledButton, StyledTextFieldPrice } from "@/components/styledComponent/styledcomp";
// import HTMLButton from "@/components/DynamicComponent/HtmlButton";
import HtmlListComponent from "@/components/DynamicComponent/HtmlListComponent";
import { currencyReverseRate } from "@/Utils/currencyRate";
import {
  resetFilter,
  searchSelector,
  setFilterValues,
  // updateBathroom,
  // updateBedRoom,
  updateInstantbooking,
  // updateMaxPrice,
  // updateMinPrice,
  updatePropertyCategory,
  updatePropertyType
} from "@/redux/slice/searchValue";

import { dispatch } from "@/redux/store";
import { fetchApprovedAdsData } from "@/redux/approvedListSlice";
import { useAppSelector } from "@/redux/hooks";
import { usePageContext } from "@/components/Providers/PageContext";
import { currencySelector } from "@/redux/slice/CurrencySlice";

import styles from "@/components/componentheaderstyles.module.scss";
import style from "./adshomepageFilter.module.scss"
import CustomModal from "@/components/modal";
import { Badge, Link, List, Typography } from "@mui/material";
import { Filter, SearchIcon } from "@/app/global/svg";
import APICONSTANT from "@/services/apiConstant";
import { getApiMethod } from "@/services/global";
import useResponsiveView from "@/Utils/responsivehook";
import { mergeQueryParams } from "@/components/helper";
import { categorySelector } from "@/redux/slice/categoriesSlice";
import { userSelector } from "@/redux/slice/user/userSlice";
import { ThreeDots } from "react-loader-spinner";
import { Padding } from "@mui/icons-material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BreadCrumb from "./breadcrumbs";

function valuetext(value: any) {
  return `${value}°C`;
}

export default function HomePageFilter(props: any) {
  const { i18, currency, responsiveView } = usePageContext();
  const [checkedAmenities, setCheckedAmenities] = useState<string[]>([]);

  const {
    address,
    guests,
    searchdate,
    accomendation,
    priceData,
    propertyType,
    // amenities,
    privileges,
    instantbooking,
    datesFilter
  } = useSelector(searchSelector);
  const limit = 25;
  const page = 1;
  const latitude = address.lat;
  const longitude = address.lng;
  const location = address.location;
  const startDate = searchdate.startDate;
  const endDate = searchdate.endDate;
  const Adultcount = guests.adult;
  const Childrencount = guests.children;
  const petscount = guests.pets;
  const maxprice = priceData.maxPrice;
  const minprice = priceData.minPrice;
  const maxVal = priceData.minMaxVal.max;
  const minVal = priceData.minMaxVal.min;
  const bedroom = accomendation.bedRoom;
  const bathroom = accomendation.bathRoom;
  // const { status } = useSelector(userSelector);
  const { categoryId, categoryName } = useSelector(categorySelector);
  // const isAuth = status?.loginStatus;

  const propertyId = propertyType !== "";
  const minimumPrice = +minprice !== 0;
  const maximumPrice = +maxprice !== 0;
  const bedroomCount = +bedroom !== 0;
  const bathroomCount = +bathroom !== 0;
  // const amenitiesCount = amenities.length !== 0;
  const amenitiesCount = privileges.length !== 0;
  const announcementDate = datesFilter !== "";
  const badgeCondition =
    propertyId ||
    minimumPrice ||
    maximumPrice ||
    bedroomCount ||
    bathroomCount ||
    amenitiesCount;

  const [loader, setLoader] = React.useState(false);
  const [modalopen, setmodalOpen] = React.useState(true);
  const [instantBooking, setInstantBooking] = useState<any>(false);
  const [approvelistdata, setApprovelistData] = useState(0);
  const [amenityData, setamenityData] = useState<any>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const { CurrencyList } = useAppSelector(currencySelector);
  const totalList = useSelector((state: any) => state?.approvedlist?.total);
  const [property, setProperty] = React.useState<any>([]);
  const [cabinsCount, setCabinsCount] = useState<any>({
    bedrooms: 0,
    bathrooms: 0
  });
  const ArrayFilter = ["Any", "1", "2", "3", "4", "5", "6", "7", "8+"];
  const [activeButton, setActiveButton] = useState("");
  const [activeSubCat, setActiveSubCat] = useState("");
  const [cabinactiveButton, setActiveCabinButton] = useState<any>({
    bedRoom: 0,
    bathRoom: 0
  });
  const [slidervalue, setsliderValue] = React.useState<any>([0, 0]);
  const [selectedDate, setSelectedDate] = React.useState<any>("");

  const handlesliderChange = (event: any, newValueslide: any) => {
    setsliderValue(newValueslide);
  };
  const [showAll, setShowAll] = useState(false);
  const showMore = (type: any) => {
    if (type === "more") {
      setDisplayCount(amenityData.length);
      setShowAll(true);
    }
    if (type === "less") {
      setDisplayCount(6);
      setShowAll(false);
    }
  };

  const ApprovedListing = async () => {
    const UserID = localStorage.getItem("appUserId")
      ? localStorage.getItem("appUserId")
      : null;

    try {
      const data: any = {};
      if (categoryId) {
        data.category = categoryId;
      }
      if (UserID) {
        data.userId = UserID;
      }
      if (activeButton) {
        data.subCategory = activeButton;
      }
      if (slidervalue[0]) {
        data.minPrice = currencyReverseRate(
          slidervalue[0],
          currency.exchange_rate
        );
      }
      if (slidervalue[1]) {
        data.maxPrice = currencyReverseRate(
          slidervalue[1],
          currency.exchange_rate
        );
      }
      if (latitude) {
        data.lat = latitude;
      }
      if (longitude) {
        data.lng = longitude;
      }
      const res = await dispatch(
        fetchApprovedAdsData(data, page, limit, "filter")
      );
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (!props.page && categoryId) {
      ApprovedListing();
    }
  }, [activeButton, slidervalue]);

  useEffect(() => {
    if (categoryId) {
      fetchPropertyType();
    }
  }, [categoryId]);

  const params: any =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null; // Avoid setting an empty object

  useEffect(() => {
    if (!params) return;

    const subCategory = params.get("subCategory");

    const filterCat =
      property?.filter((item: any) => item._id === subCategory) || [];

    setActiveSubCat(filterCat.length > 0 ? filterCat[0]?.subCategory : "");
    setActiveButton(filterCat.length > 0 ? filterCat[0]?._id : "");
  }, [property, params?.toString()]);


  const handleButtonClick = (buttonId: any, text: string) => {
    setActiveButton(buttonId);
    setActiveSubCat(text);
    // const data: any = {
    //   propertyCategory: buttonId,
    //   propertyType: buttonId,
    // };
    try {
      // mergeQueryParams(data);
      dispatch(
        setFilterValues({
          propertyCategory: buttonId,
          propertyType: buttonId
        })
      );
    } catch (err) {
      console.error(err);
    }
  };


  const handleClear = async () => {
    const UserID = localStorage.getItem("appUserId");
    try {
      const data: any = {
        propertyCategory: categoryId,
        userId: UserID
      };
      await dispatch(fetchApprovedAdsData(data, page, limit, "filter"));
      setActiveButton("");
      setsliderValue([0, 0]);
      setApprovelistData(0);
      setSelectedDate("");
      // router.replace('/')
      params.delete("category");
      params.delete("subCategory");
      window.history.replaceState(
        { path: params.toString() },
        "",
        `/ads?${params.toString()}`
      );
      dispatch(updatePropertyCategory(""));
      dispatch(resetFilter());
    } catch (err) {
      console.error(err);
    }
  };

  const handleShow = () => {
    const data: any = {};
    if (categoryId) {
      data.category = categoryId;
    }
    if (activeButton) {
      data.subCategory = activeButton;
    }
    if (slidervalue[0]) {
      data.minPrice = slidervalue[0];
    }
    if (slidervalue[1]) {
      data.maxPrice = slidervalue[1];
    }
    if (latitude) {
      data.lat = latitude;
    }
    if (longitude) {
      data.lng = longitude;
    }
    if (location) {
      data.location = location;
    }
    mergeQueryParams(data);
    setmodalOpen(false);
    dispatch(
      setFilterValues({
        propertyCategory: categoryId,
        propertyType: activeButton,
        priceData: {
          ...priceData,
          minPrice: currencyReverseRate(slidervalue[0], currency.exchange_rate),
          maxPrice: currencyReverseRate(slidervalue[1], currency.exchange_rate)
        }
      })
    );
  };

  useEffect(() => {
    handleShow();
    ApprovedListing();
  }, [activeSubCat]);

  const handleAnnouncementDate = (value: any) => {
    setSelectedDate(value)
    dispatch(setFilterValues({ datesFilter: value }));
  }

  const fetchPropertyType = async () => {
    try {
      setLoader(true);
      const res = await getApiMethod(
        `${APICONSTANT.getadsproperties}/${categoryId}`
      );
      if (res.statusCode === 200) {
        setLoader(false);
        // setActiveButton(searchData.propertyType ? searchData.propertyType :res.data[0]._id);
        setProperty(res.data.subCategories);
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };

  const [expanded, setExpanded] = React.useState<any>({});
  const [isExpanded, setIsExpanded] = useState<any>(true);
  const handleChange = (event: any, isExpanded: any) => {
    setIsExpanded(isExpanded);
  };

  const handleAccordionToggle = (filter: any) => {
    setExpanded((prev: any) => ({
      ...prev,
      [filter]: !prev[filter] // Toggle the expansion state for the clicked filter
    }));
  };

  function removeLastLetterS(categoryName: any) {
    if (categoryName?.endsWith("s")) {
      return categoryName?.slice(0, -1);
    }
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase(); // If it doesn't end with "s", return as is.
  }

  const filtersArray = ["Categories", "Price", "Announcement Date"];
  const announcementDateOptions = [
    // {
    //   label: "All",
    //   value: "all",
    // },
    {
      label: "Last 24 hours",
      value: "last24Hours"
    },
    {
      label: "In the last 3 days",
      value: "last3Days"
    },
    {
      label: "In the last 7 days",
      value: "last7Days"
    },
    {
      label: "In the last 15 days",
      value: "last15Days"
    }
  ]

  return (
    <>
      {/* <div
        className={`${styles.filter} d-flex align-items-center justify-content-between`}
      >
        <div className={`${styles.more_filter} position-relative`}>
          <Badge badgeContent=" " variant="dot" invisible={!badgeCondition}
            sx={{
              "& .MuiBadge-badge": {
                // position: "absolute",
                backgroundColor: "var(--btn-bg-color)!important"
                //  color: "var(--search-button-color)!important"
              }
            }}>
            <button
              className="d-flex align-items-center"
              onClick={() => {
                setmodalOpen(true)
                fetchPropertyType();
              }}
            >
              <Filter />
              {responsiveView === "sm" || responsiveView === "xs" ? '' : i18?.HEADER?.FILTER || 'Filter'}
            </button>
          </Badge>
        </div>
      </div> */}

      {/* <CustomModal
        className="filter-title"
        open={modalopen}
        onClose={() => setmodalOpen(false)}
        title={i18?.HEADER?.FILTER || "Filter"}
      > */}
      {/* {
          loader ?
            <div className='d-flex justify-content-center'>
              <ThreeDots
                visible={true}
                height="40"
                width="60"
                color="var(--search-button-color)"
                radius="5"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
            : */}
      {/* <div
        style={{
          position: "sticky",
          top: categoryName?.toLowerCase() != "all categories" ? "123px" : "173px",
          overflowY: "scroll",
          height: "calc(100vh - 200px)",
          scrollbarWidth: "none",
          padding: "0px 20px",
          // boxShadow: 'rgba(0, 0, 0, 0.12) 0px 6px 16px'
          // background: '#f4f4f4'
        }}
      > */}
      <div
        className={`${style.stickyContainer} ${categoryName?.toLowerCase() != "all categories"
          ? style.withoutAllCategories
          : style.withAllCategories
          }`}
      >
        {/* <div className="d-flex align-items-center border-bottom p-2">
          <h5
            style={{ color: "var(--text-color)" }}
            className="flex-fill text-center m-0"
          >
            Filters
          </h5>
        </div> */}
        <Box sx={{ fontWeight: "bold", fontSize: "h6.fontSize", mb: "3px" }}>
          {removeLastLetterS(categoryName)} {property.length !== 0 && "Ads"}
        </Box>
        {categoryName?.toLowerCase() != "all categories" && (
          <BreadCrumb activeSubCat={activeSubCat} />
        )}
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none"
            },
            scrollbarWidth: "none"
          }}
        >
          {/* Your content goes here */}

          {filtersArray.map(
            (filter) =>
              property.length !== 0 && (
                <Accordion
                  key={filter}
                  expanded={expanded[filter] || false} // Dynamically expand based on filter
                  onChange={() => handleAccordionToggle(filter)} // Toggle expansion when clicked
                  sx={{
                    mb: "6px",
                    borderRadius: "5px",
                    border: "1px solid lightgray",
                    overflow: "hidden",
                    padding: "5px",
                    "&.MuiAccordion-root.Mui-expanded": {
                      margin: "0px",
                      marginBottom: "6px"
                    },
                    "&.MuiAccordion-root": {
                      boxShadow: "none"
                    },
                    "&.MuiAccordionDetails-root": {
                      padding: "none"
                    }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ fontWeight: "bold" }}>{filter}</Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {filter === "Categories" && property.length !== 0 && (
                      <div>
                        <div className={`${styles.body}`}>
                          <Box sx={{ fontWeight: "bold", mb: "3px" }}>
                            {removeLastLetterS(categoryName)}
                          </Box>
                          <List
                            sx={{
                              display: "flex",
                              justifyContent: "start",
                              flexDirection: "column",
                              gap: "2px",
                              padding: 0,
                              maxHeight: "300px", // Adjust the height as needed
                              overflowY: "auto" // Enable vertical scrolling
                            }}
                          >
                            {property.map((data: any, index: number) => {
                              const listContent = `${data?.subCategory} - [${data?.count}]`;
                              const buttonStyle = {
                                backgroundColor:
                                  activeButton === data._id
                                    ? "#f4f4f4"
                                    : "#fff",
                                color:
                                  activeButton === data._id
                                    ? violetTheme.primaryColor
                                    : "#000"
                              };

                              return (
                                <HtmlListComponent
                                  key={data._id}
                                  onClick={() =>
                                    handleButtonClick(
                                      data._id,
                                      data.subCategory
                                    )
                                  }
                                  styles={buttonStyle}
                                  text={listContent}
                                />
                              );
                            })}
                          </List>

                          {/* </div> */}
                        </div>
                      </div>
                    )}
                    {filter === "Price" && (
                      <div>
                        {/* <Box>
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={slidervalue}
                  min={0}
                  max={50000}
                  onChange={handlesliderChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                  sx={{ color: violetTheme.primaryColor }}
                />
              </Box> */}
                        <div className="d-flex justify-content-between align-items-center">
                          <StyledTextFieldPrice
                            label={i18?.FILTER?.MINIMUM || "Minimum"}
                            sx={{ m: 1, width: "25ch" }}
                            InputProps={{
                              disableUnderline: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  {CurrencyList.currency}
                                </InputAdornment>
                              )
                            }}
                            variant="filled"
                            value={slidervalue[0]}
                            onChange={(e) => {
                              setsliderValue([
                                parseInt(e.target.value) || 0,
                                slidervalue[1]
                              ]);
                            }}
                          />
                          <hr
                            style={{
                              minWidth: "5px",
                              color: "#222"
                            }}
                          />
                          <StyledTextFieldPrice
                            label={i18?.FILTER?.MAXIMUM || "Maximum"}
                            id="filled-start-adornment"
                            sx={{ m: 1, width: "25ch" }}
                            InputProps={{
                              disableUnderline: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  {CurrencyList.currency}
                                </InputAdornment>
                              )
                            }}
                            variant="filled"
                            value={slidervalue[1]}
                            onChange={(e) => {
                              setsliderValue([
                                slidervalue[0],
                                parseInt(e.target.value) || 0
                              ]);
                            }}
                          />
                          {slidervalue[1] !== 0 && (<StyledButton onClick={handleShow}>
                            <SearchIcon
                              style={{
                                width: "20px",
                                height: "20px"
                              }}
                            />
                          </StyledButton>
                          )}
                        </div>
                      </div>
                    )}
                    {filter === "Announcement Date" && (
                      <div className={style.dateOptions}>
                        {announcementDateOptions?.map((dates, index) => (
                          <label key={index} className={style.dateRadioOption}>
                            <input
                              className={style.dateRadioBtn}
                              type="radio"
                              name="datesorting"
                              value={dates?.value}
                              checked={selectedDate === dates?.value}
                              onChange={() => handleAnnouncementDate(dates?.value)}
                            />
                            {dates?.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              )
          )}
          {property.length === 0 && (
            <Accordion
              sx={{
                mb: "6px",
                borderRadius: "5px",
                border: "1px solid lightgray",
                overflow: "hidden",
                padding: "5px"
              }}
              expanded={isExpanded}
              onChange={handleChange}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ fontWeight: "bold" }}
              >
                {"Price"}
              </AccordionSummary>
              <AccordionDetails>
                {/* <div className={`${styles.body}`}> */}
                {/* <Box>
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={slidervalue}
                  min={0}
                  max={50000}
                  onChange={handlesliderChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                  sx={{ color: violetTheme.primaryColor }}
                />
              </Box> */}
                <div className="d-flex justify-content-between align-items-center">
                  <StyledTextFieldPrice
                    label={i18?.FILTER?.MINIMUM || "Minimum"}
                    sx={{ m: 1, width: "25ch" }}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start" className={style.customAdornment}>
                          {CurrencyList.currency}
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    className={`${styles.rangeinput}`}
                    value={slidervalue[0]}
                    onChange={(e) => {
                      setsliderValue([
                        parseInt(e.target.value) || 0,
                        slidervalue[1]
                      ]);
                    }}
                  />
                  <hr
                    style={{
                      minWidth: "5px",
                      color: "#222"
                    }}
                  />
                  <StyledTextFieldPrice
                    label={i18?.FILTER?.MAXIMUM || "Maximum"}
                    id="filled-start-adornment"
                    sx={{ m: 1, width: "25ch" }}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start" >
                          {CurrencyList.currency}
                        </InputAdornment>
                      )
                    }}
                    variant="filled"
                    value={slidervalue[1]}
                    className={`${styles.rangeinput}`}
                    onChange={(e) => {
                      setsliderValue([
                        slidervalue[0],
                        parseInt(e.target.value) || 0
                      ]);
                    }}
                  />
                  {slidervalue[1] !== 0 && (<StyledButton onClick={handleShow}>
                    <SearchIcon
                      style={{
                        width: "20px",
                        height: "20px"
                      }}
                    />
                  </StyledButton>
                  )}

                </div>
                {/* </div> */}
              </AccordionDetails>
            </Accordion>
          )}
          <div className={`${styles.footer} border rounded-bottom-3`}>
            {/* <div className={`${styles.footerFlex}`}> */}
            <div className={style.clearAllFilter}>
              <button onClick={handleClear} className={`${style.clearAllBtn}`}>
                {i18?.FILTER?.CLEARALL}
              </button>
              {/* <DynamicButtonComponent
                variant="outlined"
                onClick={handleShow}
                className={`${styles.button2}`}
                text={
                  totalList === 0
                    ? i18?.FILTER?.NOEXACTMATCHES || "No exact matches"
                    : `${i18?.FILTER?.SHOW} ${totalList && totalList} ${i18?.FILTER?.PLACES
                    }`
                }
              /> */}
            </div>
          </div>
        </Box>
      </div>
      {/* } */}

      {/* </CustomModal> */}
    </>
  );
}
