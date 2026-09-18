"use client";
import React, { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
// import Switch, { SwitchProps } from "@mui/material/Switch";
// import { styled } from "@mui/material/styles";

import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { violetTheme } from "@/components/colorVariable";
import { StyledTextFieldBorder } from "@/components/styledComponent/styledcomp";
import HTMLButton from "@/components/DynamicComponent/HtmlButton";
import {
  resetFilter,
  searchSelector,
  setFilterValues,
  updateAccomodation,
  updatePrivileges,
  updateInstantbooking,
  updatePricing,
  updatePropertyCategory,
  updatePropertyType,
} from "@/redux/slice/searchValue";

import { dispatch } from "@/redux/store";
import { fetchApprovedListingData, setTotal } from "@/redux/approvedListSlice";
import { useAppSelector } from "@/redux/hooks";
import { usePageContext } from "@/components/Providers/PageContext";
import { currencySelector } from "@/redux/slice/CurrencySlice";

import styles from "./componentheaderstyles.module.scss";
import CustomModal from "./modal";
import { Badge } from "@mui/material";
import { Filter } from "../app/global/svg";
import APICONSTANT from "@/services/apiConstant";
import { getApiMethod } from "@/services/global";
import useResponsiveView from "@/Utils/responsivehook";
import { mergeQueryParams } from "@/components/helper";
import { categorySelector } from "@/redux/slice/categoriesSlice";
import { userSelector } from "@/redux/slice/user/userSlice";
import { ThreeDots } from "react-loader-spinner";
import { currencyRate, currencyReverseRate } from "@/Utils/currencyRate";

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
  const { categoryId } = useSelector(categorySelector);
  // const isAuth = status?.loginStatus;

  const propertyId =
    propertyType === null ? propertyType !== null : propertyType !== "";
  const minimumPrice = +minprice !== 0;
  const maximumPrice = +maxprice !== 0;
  const bedroomCount = +bedroom !== 0;
  const bathroomCount = +bathroom !== 0;
  // const amenitiesCount = amenities.length !== 0;
  const amenitiesCount =
    privileges === null ? privileges !== null : privileges?.length !== 0;
  const badgeCondition =
    propertyId ||
    minimumPrice ||
    maximumPrice ||
    bedroomCount ||
    bathroomCount ||
    amenitiesCount;
  console.log(
    "badgeCondition ",
    propertyId,
    minimumPrice,
    maximumPrice,
    bedroomCount,
    bathroomCount,
    amenitiesCount
  );
  console.log("propertyType", privileges?.length !== 0);
  const [loader, setLoader] = React.useState(false);
  const [modalopen, setmodalOpen] = React.useState(false);
  const [instantBooking, setInstantBooking] = useState<any>(false);
  const [approvelistdata, setApprovelistData] = useState(0);
  const [amenityData, setamenityData] = useState<any>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const { CurrencyList } = useAppSelector(currencySelector);
  const totalList = useSelector((state: any) => state?.approvedlist?.total);
  const [property, setProperty] = React.useState<any>([]);
  const [cabinsCount, setCabinsCount] = useState<any>({
    bedrooms: 0,
    bathrooms: 0,
  });
  const ArrayFilter = ["Any", "1", "2", "3", "4", "5", "6", "7", "8+"];
  const [activeButton, setActiveButton] = useState("");
  const [cabinactiveButton, setActiveCabinButton] = useState<any>({
    bedRoom: 0,
    bathRoom: 0,
  });
  const [slidervalue, setsliderValue] = React.useState<any>([1, 50000]);

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
        data.propertyCategory = categoryId;
      }
      if (UserID) {
        data.userId = UserID;
      }
      if (activeButton) {
        data.propertyType = activeButton;
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
      if (cabinactiveButton.bedRoom) {
        data.bedRoom = cabinactiveButton.bedRoom;
      }
      if (cabinactiveButton.bathRoom) {
        data.bathRoom = cabinactiveButton.bathRoom;
      }
      if (instantBooking) {
        data.instantBooking = instantBooking === "1";
      }
      if (checkedAmenities.length > 0) {
        // data.amenities = `[${checkedAmenities}]`;
        data.privileges = `[${checkedAmenities}]`;
      }
      if (latitude) {
        data.lat = latitude;
      }
      if (longitude) {
        data.lng = longitude;
      }
      if (startDate) {
        data.startDate = startDate;
      }
      if (endDate) {
        data.endDate = endDate;
      }
      if (Adultcount) {
        data.adult = Adultcount;
      }
      if (Childrencount) {
        data.children = Childrencount;
      }
      if (petscount) {
        data.pets = petscount;
      }
      const res = await dispatch(
        fetchApprovedListingData(data, page, limit, "filter")
      );
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (!props.page && categoryId && modalopen) {
      ApprovedListing();
    }
  }, [
    props.page,
    categoryId,
    modalopen,
    activeButton,
    slidervalue,
    cabinactiveButton,
    checkedAmenities,
    instantBooking,
  ]);
  const handleButtonClick = (buttonId: any) => {
    setActiveButton(buttonId);
  };
  const handleCabinButtonClick = (type: any, buttonId: any) => {
    if (type === "bedRoom") {
      setActiveCabinButton((prev: any) => ({
        ...prev,
        bedRoom: buttonId,
      }));
    }
    if (type === "bathRoom") {
      setActiveCabinButton((prev: any) => ({
        ...prev,
        bathRoom: buttonId,
      }));
    }
  };
  const handleChangeAmenityCheck = (categoryId: any, isChecked: boolean) => {
    if (isChecked) {
      setCheckedAmenities((prevChecked) => [...prevChecked, categoryId]);
    } else {
      setCheckedAmenities((prevChecked) =>
        prevChecked.filter((id) => id !== categoryId)
      );
    }
  };
  const params: any =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : {};

  const handleChangeInstantBooking = (event: any) => {
    setInstantBooking(event.target.checked ? "1" : "0");
  };

  const handleClear = async () => {
    const UserID = localStorage.getItem("appUserId");
    try {
      const data: any = {
        propertyCategory: categoryId,
        userId: UserID,
      };
      await dispatch(fetchApprovedListingData(data, page, limit, "filter"));
      // setmodalOpen(false)
      setActiveButton("");
      // fetchPropertyType()
      setsliderValue([1, 0]);
      setCabinsCount({
        bedrooms: 0,
        bathrooms: 0,
      });
      setActiveCabinButton({
        bedRoom: 0,
        bathRoom: 0,
      });
      setApprovelistData(0);
      // router.replace('/')
      params.delete("propertyCategory");
      params.delete("propertyType");
      params.delete("minPrice");
      params.delete("maxPrice");
      params.delete("bedRoom");
      params.delete("bathRoom");
      params.delete("instantBooking");
      // params.delete("amenities");
      params.delete("privileges");
      window.history.replaceState(
        { path: params.toString() },
        "",
        `?${params.toString()}`
      );
      setInstantBooking(false);
      setCheckedAmenities([]);
      // setActiveButton(property[0]._id)
      dispatch(updatePropertyCategory(""));
      dispatch(resetFilter());
    } catch (err) {
      console.error(err);
    }
  };

  const handleShow = () => {
    const data: any = {};
    if (categoryId) {
      data.propertyCategory = categoryId;
    }
    if (activeButton) {
      data.propertyType = activeButton;
    }
    if (slidervalue[0]) {
      data.minPrice = slidervalue[0];
    }
    if (slidervalue[1]) {
      data.maxPrice = slidervalue[1];
    }
    if (cabinactiveButton.bedRoom) {
      data.bedRoom = cabinactiveButton.bedRoom;
    }
    if (cabinactiveButton.bathRoom) {
      data.bathRoom = cabinactiveButton.bathRoom;
    }
    if (instantBooking) {
      data.instantBooking = instantBooking === "1" ? "1" : "0";
    }
    // if (checkedAmenities.length > 0) {
    //   data.amenities = `[${checkedAmenities}]`;
    // }

    if (checkedAmenities.length > 0) {
      data.privileges = checkedAmenities.join();
    }
    if (latitude) {
      data.lat = latitude;
    }
    if (longitude) {
      data.lng = longitude;
    }
    if (startDate) {
      data.from = startDate;
    }
    if (endDate) {
      data.to = endDate;
    }
    if (Adultcount) {
      data.adults = Adultcount;
    }
    if (Childrencount) {
      data.children = Childrencount;
    }
    if (petscount) {
      data.pets = petscount;
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
        // amenities: checkedAmenities,
        privileges: checkedAmenities,
        instantbooking: instantBooking,
        priceData: {
          ...priceData,
          minPrice: currencyReverseRate(slidervalue[0], currency.exchange_rate),
          maxPrice: currencyReverseRate(slidervalue[1], currency.exchange_rate),
        },
        accomendation: {
          bathRoom: cabinactiveButton.bathRoom,
          bedRoom: cabinactiveButton.bedRoom,
        },
      })
    );
  };

  const getamenityapi = async (url: any) => {
    const res: any = await getApiMethod(url);
    if (res.statusCode === 200) {
      setamenityData(res.data.amenities);
    }
  };

  const getPrivileges = async (url: any) => {
    const res: any = await getApiMethod(url);
    if (res.statusCode === 200) {
      setamenityData(res?.data?.privilegeItemList);
    }
  };

  const fetchPropertyType = async () => {
    try {
      setLoader(true);
      const res = await getApiMethod(
        `${APICONSTANT.getproperties}/${categoryId}`
      );
      if (res.statusCode === 200) {
        setLoader(false);
        // setActiveButton(searchData.propertyType ? searchData.propertyType :res.data[0]._id);
        setProperty(res.data.properties);
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };
  useEffect(() => {
    dispatch(updatePropertyCategory(params && params?.get("propertyCategory")));
    dispatch(updatePropertyType(params && params?.get("propertyType")));
    dispatch(
      updatePricing({
        maxPrice: params && params?.get("maxPrice"),
        minMaxVal: {
          min: params && params?.get("minPrice"),
          max: params && params?.get("maxPrice"),
        },
        minPrice: params && params?.get("minPrice"),
      })
    );
    dispatch(
      updateAccomodation({
        bathRoom: params && params?.get("bathRoom"),
        bedRoom: params && params?.get("bedRoom"),
      })
    );
    dispatch(updatePrivileges(params && params?.get("privileges")));
  }, []);

  console.log(
    "params",
    address,
    guests,
    searchdate,
    accomendation,
    priceData,
    propertyType,
    privileges
  );
  return (
    <>
      <div
        className={`${styles.filter} d-flex align-items-center justify-content-between`}
      >
        <div className={`${styles.more_filter} position-relative`}>
          <Badge
            badgeContent=" "
            variant="dot"
            invisible={!badgeCondition}
            sx={{
              "& .MuiBadge-badge": {
                // backgroundColor: "var(--btn-text-color)!important"
                backgroundColor: "var(--btn-bg-color)!important",
              },
            }}
          >
            <button
              className="d-flex align-items-center"
              onClick={() => {
                setmodalOpen(true);
                getPrivileges(APICONSTANT.privilegesItems);
                // getamenityapi(APICONSTANT.Amenity);
                fetchPropertyType();
              }}
            >
              <Filter />
              {responsiveView === "sm" || responsiveView === "xs"
                ? ""
                : i18?.HEADER?.FILTER || "Filter"}
            </button>
          </Badge>
        </div>
      </div>

      <CustomModal
        className="filter-title"
        open={modalopen}
        onClose={() => setmodalOpen(false)}
        title={i18?.HEADER?.FILTER || "Filter"}
      >
        {loader ? (
          <div className="d-flex justify-content-center">
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
        ) : (
          <div>
            {property.length !== 0 && (
              <div>
                <div className={`${styles.body}`}>
                  <h5>{i18?.FILTER?.TYPEOFPLACE || "Type Of Place"}</h5>
                  <p>
                    {i18?.FILTER?.SEARCHROOMS || "Search rooms"},{" "}
                    {i18?.FILTER?.ENTIREHOMES || "Entire homes"}{" "}
                    {i18?.FILTER?.OR || "or"}{" "}
                    {i18?.FILTER?.ANYTYPEOFPLACE || "Any type of place"}.
                  </p>
                  <div className={`${styles.btn}`}>
                    {property.map((data: any, index: any) => {
                      const isEven = index % 2 === 0;
                      const isFirst = index === 0;
                      const isLast = index === property.length - 1;
                      const borderRadius =
                        property.length === 1
                          ? "20px"
                          : isEven
                          ? isFirst
                            ? "20px 0 0 20px"
                            : isLast
                            ? "0 20px 20px 0"
                            : "0"
                          : isFirst
                          ? "20px 0 0 20px"
                          : isLast
                          ? "0 20px 20px 0"
                          : "0";

                      const buttonStyle = {
                        border: "1px solid #d4d2d2",
                        borderRadius: borderRadius,
                        backgroundColor:
                          activeButton === data._id
                            ? violetTheme.primaryColor
                            : "",
                        color:
                          activeButton === data._id
                            ? violetTheme.secondaryColor
                            : "",
                        backgroundImage: "var(--filter-select-gradient)",
                      };
                      return (
                        <HTMLButton
                          key={data._id}
                          onClick={() => handleButtonClick(data._id)}
                          styles={buttonStyle}
                          text={data.property}
                        />
                      );
                    })}
                  </div>
                </div>
                <hr />
              </div>
            )}

            <div className={`${styles.body}`}>
              <h5>{i18?.FILTER?.PRICERANGE || "Price Range"}</h5>
              <p>
                {i18?.FILTER?.NIGHTLYPRICESBEFORE ||
                  "Nightly prices before fees and taxes"}
              </p>
              <Box>
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={slidervalue}
                  min={1}
                  max={50000}
                  onChange={handlesliderChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                  sx={{ color: violetTheme.primaryColor }}
                />
              </Box>
              <div className="d-flex justify-content-between py-3">
                <StyledTextFieldBorder
                  label={i18?.FILTER?.MINIMUM || "Minimum"}
                  sx={{ m: 1, width: "25ch" }}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        {CurrencyList.currency}
                      </InputAdornment>
                    ),
                  }}
                  variant="filled"
                  className={`${styles.rangeinput}`}
                  value={slidervalue[0]}
                  onChange={(e) => {
                    setsliderValue([
                      parseInt(e.target.value) || 1,
                      slidervalue[1],
                    ]);
                  }}
                />
                <hr
                  style={{ minWidth: "20px", marginTop: "70px", color: "#222" }}
                />
                <StyledTextFieldBorder
                  label={i18?.FILTER?.MAXIMUM || "Maximum"}
                  id="filled-start-adornment"
                  sx={{ m: 1, width: "25ch" }}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        {CurrencyList.currency}
                      </InputAdornment>
                    ),
                  }}
                  variant="filled"
                  value={slidervalue[1]}
                  className={`${styles.rangeinput}`}
                  onChange={(e) => {
                    setsliderValue([
                      slidervalue[0],
                      parseInt(e.target.value) || 0,
                    ]);
                  }}
                />
              </div>
            </div>
            <hr />
            <div className={`${styles.body}`}>
              <h5>{i18?.FILTER?.ROOMS || "Rooms"}</h5>
              <span style={{ marginBottom: "20px", marginTop: "20px" }}>
                <b>{i18?.FILTER?.BEDROOMS || "Bed Rooms"}</b>
              </span>
              <div className={`${styles.bedFlex}`}>
                {ArrayFilter.map((data: any, index: any) => {
                  const bedRoomButtons = {
                    backgroundColor:
                      cabinactiveButton.bedRoom === index
                        ? violetTheme.primaryColor
                        : "",
                    color:
                      cabinactiveButton.bedRoom === index
                        ? violetTheme.secondaryColor
                        : "",
                  };
                  return (
                    <HTMLButton
                      key={data}
                      onClick={() => handleCabinButtonClick("bedRoom", index)}
                      styles={bedRoomButtons}
                      text={data}
                    />
                  );
                })}
              </div>
              <span style={{ marginBottom: "20px", marginTop: "20px" }}>
                <b>{i18?.FILTER?.BATHROOMS || "Bath Rooms"}</b>
              </span>
              <div className={`${styles.bedFlex}`}>
                {ArrayFilter.map((data: any, index: any) => {
                  const bathRoomButtons = {
                    backgroundColor:
                      cabinactiveButton.bathRoom === index
                        ? violetTheme.primaryColor
                        : "",
                    color:
                      cabinactiveButton.bathRoom === index
                        ? violetTheme.secondaryColor
                        : "",
                  };
                  return (
                    <HTMLButton
                      key={data}
                      onClick={() => handleCabinButtonClick("bathRoom", index)}
                      styles={bathRoomButtons}
                      text={data}
                    />
                  );
                })}
              </div>
            </div>
            <hr />
            <div className={`${styles.body}`}>
              <h5>{i18?.FILTER?.AMENITIES || "Amenities"}</h5>
              <div className={`${styles.amenity}`}>
                {amenityData.slice(0, displayCount).map((data: any) => (
                  <FormGroup key={data.categoryId}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: "#717171",
                            "&.Mui-checked": {
                              color: violetTheme.primaryColor,
                            },
                          }}
                          onChange={(event) =>
                            handleChangeAmenityCheck(
                              data._id,
                              event.target.checked
                            )
                          }
                          checked={checkedAmenities.includes(data._id)}
                        />
                      }
                      label={data.name}
                    />
                  </FormGroup>
                ))}

                {amenityData.length > 6 &&
                  (showAll ? (
                    <button onClick={() => showMore("less")}>
                      {i18?.FILTER?.SHOWLESS || "Show less"}
                    </button>
                  ) : (
                    <button onClick={() => showMore("more")}>
                      {i18?.FILTER?.SHOWMORE || "Show more"}
                    </button>
                  ))}
              </div>
            </div>
            {/* <hr />
          <div className={`${styles.body}`}>
              <h5>{i18?.FILTER?.BOOKINGOPTIONS || "Booking Options"}</h5>
              <div className={`${styles.toggle}`}>
                  <p style={{ color: '#222' }}>{i18?.FILTER?.INSTANTBOOKING || "Instant Booking"}</p>
                  <div>

                      <FormGroup>
                          <FormControlLabel
                              control={<IOSSwitch />}
                              label=""
                              onChange={(event: any) => handleChangeInstantBooking(event)}
                              checked={instantBooking === '1'}
                          />
                      </FormGroup>
                  </div>
              </div>
          </div> */}
            <div className={`${styles.footer} border-top`}>
              <div className={`${styles.footerFlex}`}>
                <button onClick={handleClear} className={`${styles.button1}`}>
                  {i18?.FILTER?.CLEARALL}
                </button>
                <DynamicButtonComponent
                  variant="outlined"
                  onClick={handleShow}
                  className={`${styles.button2}`}
                  text={
                    totalList === 0
                      ? i18?.FILTER?.NOEXACTMATCHES || "No exact matches"
                      : `${i18?.FILTER?.SHOW} ${totalList && totalList} ${
                          i18?.FILTER?.PLACES
                        }`
                  }
                />
              </div>
            </div>
          </div>
        )}
      </CustomModal>
    </>
  );
}
