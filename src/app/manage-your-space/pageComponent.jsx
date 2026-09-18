/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState, useMemo, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FaRegTrashAlt } from "react-icons/fa";
import Checkbox from "@mui/material/Checkbox";
import { getListingData } from "@/redux/slice/propertySlice";
import { propertySelector } from "@/redux/slice/propertySlice";
import {
  deleteApiMethod,
  getApiMethod,
  postApiMethod,
  putApiMethod,
} from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import ImageComponent from "@/components/ImageComponent";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import CustomModal from "@/components/modal";
import { IOSSwitch } from "@/components/switch";
import { addUser, userSelector } from "@/redux/slice/user/userSlice";
import isAuth from "@/components/isAuth";
import { addAlert } from "@/redux/slice/AlertSlice";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { StyledTextFieldBorder } from "@/components/styledComponent/styledcomp";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";
import FontIconPicker from "@/components/font-icon-picker/js/FontIconPicker";
import styles from "./page.module.scss";
import "@/components/font-icon-picker/fonticonpicker.base-theme.react.css";
import "@/components/font-icon-picker/fonticonpicker.material-theme.react.css";

import Notify from "../../../public/svg/Vectornoti.svg";
import { currencyRate } from "@/Utils/currencyRate";
import { FormControl, FormGroup } from "@mui/material";

const schema = yup.object().shape({
  title: yup.string(),
  desc: yup.string(),
});

function IconPicker({ value, onChange, icons }) {
  const renderIcon = (iconObj) => {
    if (typeof iconObj === "string") {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <img src={iconObj} alt="selected icon" />
        </div>
      );
    }
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img src={iconObj.icon} alt={`Icon for ${iconObj.name}`} />
      </div>
    );
  };
  return (
    <div>
      <FontIconPicker
        closeOnSelect
        value={value}
        isMulti={false}
        icons={icons}
        renderFunc={renderIcon}
        onChange={(selectedIcons) => {
          onChange(selectedIcons);
        }}
        style={{
          margin: 0,
        }}
      />
    </div>
  );
}

const EditView = ({ pages }) => {
  const { i18, currency, responsiveView, settings } = usePageContext();
  const { ListInfo } = useAppSelector(propertySelector);
  console.log("pages", pages);
  const {
    imgFiles,
    propertyName,
    propertyDesc,
    availability,
    amenityLst,
    privileges,
    privilegeCategories,
    privilegeItems,
    city,
    state,
    country,
    zipcode,
    propertyCategoryName,
    propertyTypeName,
    adult,
    children,
    pets,
    bedRoomCount,
    bathRoomCount,
    bedRoomtype,
    perDay,
    perHour,
    rules,
  } = ListInfo;

  const { CurrencyList } = useAppSelector(currencySelector);
  const { userInfo } = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const editListId = useSearchParams();
  const ids = editListId.get("id");
  const [policy, setPolicy] = useState();
  const [icon, setIcon] = useState();
  const [listValue, setListValue] = useState(0);
  const [activeSection, setActiveSection] = useState("section1");
  const sectionIds = [
    "section1",
    "section2",
    "section3",
    "section4",
    "section5",
  ];

  const [openDelete, setOpenDelete] = useState(false);
  const [rowId, setRowId] = useState("");
  const [openPolicy, setOpenPolicy] = useState(false);
  const [selectedRule, setSelectedRules] = useState([]);
  const [mode, setMode] = useState("");
  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  let iref = 0;
  const sectionRefs = sectionIds.reduce((acc, sectionId) => {
    acc[sectionId] = refs[iref];
    ++iref;
    return acc;
  }, {});
  const [open, setOpen] = useState(false);
  const [fieldValue, setFieldValue] = useState(null);

  const servicesSorted = useMemo(() => {
    if (Array.isArray(privileges)) {
      return [...privileges].sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
  }, [privileges]);

  const mappedItems = useMemo(() => {
    const categoryMap = {};
    const serviceMap = {};
    if (privilegeItems) {
      for (let i = 0; i < privilegeItems.length; i++) {
        const data = privilegeItems[i];
        if (!categoryMap[data.privilegeCategoryId]) {
          categoryMap[data.privilegeCategoryId] = [];
        }
        categoryMap[data.privilegeCategoryId].push(data);

        if (!serviceMap[data.privilegeId]) {
          serviceMap[data.privilegeId] = [];
        }
        serviceMap[data.privilegeId].push(data);
      }
      // sort items
      for (const key in categoryMap) {
        categoryMap[key].sort((a, b) => a.name.localeCompare(b.name));
      }
      for (const key in serviceMap) {
        serviceMap[key].sort((a, b) => a.name.localeCompare(b.name));
      }
    }
    return {
      categoryMap,
      serviceMap,
    };
  }, [privilegeItems]);

  const bedCount = useMemo(() => {
    const bedCountArry = bedRoomtype.map((item) => item.bedCount);
    return bedCountArry.reduce((bedSum, a) => bedSum + a, 0);
  }, [bedRoomtype]);

  useEffect(() => {
    getpolicy(APICONSTANT.cancellationPolicy);
  }, []);

  useEffect(() => {
    if (listValue !== null) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setActiveSection("section1");
    }
  }, [listValue]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(sectionRefs).map(
        (key) => sectionRefs[key].current
      );
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        if (
          section &&
          scrollPosition >= section.offsetTop - 100 &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionRefs]);

  const {
    control,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({});
    }
  }, [formState, reset]);

  useEffect(() => {
    fetchData();
  }, [ids]);

  const fetchData = () => {
    if (ids) {
      dispatch(getListingData(ids));
    }
  };

  const handleOpenModal = (modes, id) => {
    if (modes === "edit") {
      setRowId(id);
      setMode("edit");
      getRules(`${APICONSTANT.rules}/${ids}?ruleId=${id}`);
      setOpen(true);
    } else {
      setOpen(true);
      setMode("add");
      setSelectedRules([]);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const getIcon = async (url) => {
    const resp = await getApiMethod(url);
    if (resp.statusCode === 200) {
      setIcon(resp.data.icons);
    }
  };

  const getRules = async (url) => {
    const res = await getApiMethod(url);
    if (res.statusCode === 200) {
      setSelectedRules(res.data);
      setFieldValue(res.data.image);
    }
  };

  const getpolicy = async (url) => {
    const res = await getApiMethod(url);
    if (res.statusCode === 200) {
      getIcon(`${APICONSTANT.icon}?_page=1&_limit=20`);
      setPolicy(res.data.policies);
    }
  };

  const handleChangeCheck = (event) => {
    const val = event.target.value;
    const newValue = { ...userInfo, cancellationPolicyId: val };
    dispatch(addUser(newValue));
  };

  const handleRuledelete = async (id) => {
    setOpenDelete(true);
    setRowId(id);
  };

  const handleDeleteAPI = async () => {
    const data = { ruleId: rowId };
    try {
      const response = await deleteApiMethod(`${APICONSTANT.rules}/${ids}`, {
        data: data,
      });
      if (response.statusCode === 200) {
        setOpenDelete(false);
        fetchData();
        dispatch(
          addAlert({
            isOpen: true,
            message: "Rules deleted",
            type: "success",
            severity: "success",
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePolicySave = async () => {
    const url = `${APICONSTANT.cancellationPolicy}/?listingId=${ids}`;
    const data = {
      cancellationPolicyId: Number(userInfo.cancellationPolicyId),
    };

    try {
      const res = await postApiMethod(url, data);
      if (res.statusCode === 200) {
        setOpenPolicy(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleListing = (value) => {
    setListValue(value);
  };

  const scrollToSection = (refName) => {
    const sectionRef = sectionRefs[refName];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleIconChange = (selectedIcons) => {
    setFieldValue(selectedIcons.icon);
  };

  const rulesApi = async (url, data) => {
    const res = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: "Rules added",
          type: "success",
          severity: "success",
        })
      );
      setOpen(false);
      fetchData();
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error",
        })
      );
    }
  };

  const rulesUpdate = async (url, data) => {
    const res = await putApiMethod(url, data);
    if (res.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: "Rules updated",
          type: "success",
          severity: "success",
        })
      );
      setOpen(false);
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error",
        })
      );
    }
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      rules: fieldValue,
      progressPercentage: 15,
    };
    if (mode === "edit") {
      const formData = {
        ...data,
        rules: fieldValue,
        progressPercentage: 15,
        ruleId: rowId,
      };
      const res = rulesUpdate(`${APICONSTANT.rules}/${ids}`, formData);
    }
    const res = rulesApi(`${APICONSTANT.rules}/${ids}`, formData);
  };

  const handleChange = async (checked) => {
    const data = checked;
    const response = await postApiMethod(
      `${APICONSTANT.availability}/${ids}`,
      new URLSearchParams({ availability: data })
    );
    fetchData();
  };

  return (
    <div>
      <Header
        page="hide"
        center={
          responsiveView === "sm" || responsiveView === "xs"
            ? "center"
            : "inbox"
        }
        type="provider"
      />

      {ListInfo?._id && (
        <div className={`${styles.edit_list} mb-5`}>
          <div className="pt-5 px-2 pb-3">
            <h5 className="">{propertyName}</h5>
          </div>
          <main className="row m-0">
            <nav className="col-12 col-lg-4 p-0">
              <ul className={`${styles.edit_list_button}`}>
                <li>
                  <h6
                    onClick={() => {
                      handleListing(0);
                    }}
                  >
                    {i18?.LISTING?.LISTINGDETAILS || "Listing Details"}
                  </h6>
                  {listValue === 0 && (
                    <ul className={`${styles.list_menu} mb-2`}>
                      {[
                        "Photos",
                        "Listing Basics",
                        "Amenities",
                        "Location",
                        i18?.TRIPS?.PROPERTYANDROOMS || "Property and Rooms",
                      ].map((data, d) => (
                        <li
                          key={d}
                          onClick={() => scrollToSection(`section${d + 1}`)}
                          className={
                            activeSection === `section${d + 1}`
                              ? styles.active
                              : ""
                          }
                        >
                          {data}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li>
                  <h6
                    onClick={() => {
                      handleListing(1);
                    }}
                  >
                    {i18?.LISTING?.PRICEANDAVAILABILITY ||
                      "Price and Availability"}
                  </h6>
                </li>
                <li>
                  <h6
                    onClick={() => {
                      handleListing(2);
                    }}
                  >
                    {i18?.LISTING?.POLICIESANDRULES || "Policies and rules"}
                  </h6>
                </li>
              </ul>
            </nav>
            <div className={`${styles.edit_details} col-12 col-lg-8`}>
              {listValue === 0 ? (
                <div>
                  <section ref={sectionRefs.section1} id="section1">
                    <div className="py-3">
                      <div className="d-flex justify-content-between mb-3">
                        <h5>{i18?.LISTING?.PHOTOS || "Photos"}</h5>
                        <Link
                          href={`/propertyform/${ids}/image-select/`}
                          className={`text-dark text-decoration-underline`}
                        >
                          {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                        </Link>
                      </div>
                      <div className={`${styles.photo} d-flex text-truncate`}>
                        {imgFiles.map((img) => (
                          <div className="ms-3" key={img._id}>
                            <ImageComponent
                              src={img.imagePath}
                              width={160}
                              height={150}
                              alt=""
                              onError={handleImageError}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                  </section>
                  <section ref={sectionRefs.section2} id="section2">
                    <div className={`${styles.listing_basics} py-3`}>
                      <h5 className="mb-3">
                        {i18?.LISTING?.LISTINGBASICS || "Listing Basics"}
                      </h5>
                      <div className="">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>
                              {i18?.LISTING?.LISTINGTITLE || "Listing title"}
                            </h6>
                            <p className="m-0 text-capitalize">
                              {propertyName}
                            </p>
                          </div>
                          <Link
                            href={`/propertyform/${ids}/title/`}
                            className={`text-dark text-decoration-underline`}
                          >
                            {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                          </Link>
                        </div>
                        <div className="my-3">
                          <div className={`${styles.divider}`}></div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>
                              {i18?.LISTING?.LISTINGDESCRIPTION ||
                                "Listing description"}
                            </h6>
                            <p className={`${styles.desc} m-0`}>
                              {propertyDesc}
                            </p>
                          </div>
                          <Link
                            href={`/propertyform/${ids}/description/`}
                            className={`text-dark text-decoration-underline`}
                          >
                            {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                          </Link>
                        </div>
                        <div className="my-3">
                          <div className={`${styles.divider}`}></div>
                        </div>
                        {/* <div className='d-flex justify-content-between'>
                                                            <div>
                                                                <h6>Number of guests</h6>
                                                            </div>
                                                            <div className='d-flex align-items-center'>
                                                                <span className={`${styles.Box} me-4`} onClick={() => dispatch(guestCount(Number(ListInfo.guests - 1)))}>
                                                                    <RemoveIcon />
                                                                </span>
                                                                <p className='m-0 mx-2'>{ListInfo.guests}</p>
                                                                <span className={`${styles.Box} ms-4`} onClick={() => dispatch(guestCount(Number(ListInfo.guests + 1)))}>
                                                                    <AddIcon />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='my-3'>
                                                            <div className={`${styles.divider}`}></div>
                                                        </div> */}
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>
                              {i18?.LISTING?.AVAILABILITYSTATUS ||
                                "Availability status"}
                            </h6>
                            <p className="m-0">
                              {availability ? "True" : "False"}
                            </p>
                          </div>
                          {/* <Link href='hosting/listings?mode=edit'>Edit</Link> */}
                          <FormControlLabel
                            className="m-0"
                            control={<IOSSwitch />}
                            // label={data.availability ? 'On' : 'Off'}
                            checked={availability}
                            onChange={(event) =>
                              handleChange(event.target.checked)
                            }
                          />
                        </div>
                        <div className="my-3">
                          <div className={`${styles.divider}`}></div>
                        </div>
                      </div>
                    </div>
                  </section>
                  {/* <section ref={sectionRefs.section3} id="section3">
                    <div className="py-3">
                      <h5 className="mb-3">
                        {i18?.ROOMPAGE?.AMENITIES || "Amenities"}
                      </h5>
                      <div className="d-flex justify-content-between">
                        <div className={`${styles.amenities} flex-fill`}>
                          {amenityLst.map((item) => (
                            <p className="m-0" key={item._id}>
                              {item.name}
                            </p>
                          ))}
                        </div>
                        <Link
                          href={`/propertyform/${ids}/amenity/`}
                          className={`text-dark text-decoration-underline`}
                        >
                          {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                        </Link>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                  </section> */}
                  {/* // Previlege code */}
                  <section ref={sectionRefs.section3} id="section3">
                    <div className="py-3">
                      <h5 className="mb-3">
                        {i18?.ROOMPAGE?.AMENITIES || "Amenities"}
                      </h5>
                      <div className="d-flex justify-content-between">
                        <div>
                          {servicesSorted.map(
                            (service, index) =>
                              Array.isArray(
                                mappedItems.serviceMap[service._id]
                              ) && (
                                <Fragment key={index}>
                                  <h6 className="my-2">{service.name}</h6>
                                  <div
                                    className={`${styles.amenities} flex-fill`}
                                  >
                                    {mappedItems.serviceMap[service._id].map(
                                      (item) => (
                                        <p className="m-0" key={item._id}>
                                          {item.name}
                                        </p>
                                      )
                                    )}
                                  </div>
                                </Fragment>
                              )
                          )}
                        </div>

                        <Link
                          href={`/propertyform/${ids}/privileges/`}
                          className={`text-dark text-decoration-underline`}
                        >
                          {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                        </Link>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                  </section>
                  <section ref={sectionRefs.section4} id="section4">
                    <div className="py-3">
                      <h5 className="mb-3">
                        {i18?.TRIPS?.LOCATION || "Location"}
                      </h5>
                      <div className="">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>{i18?.PROFILE?.ADDRESS || "Address"}</h6>
                            <p className="m-0">
                              {city}, {state} {country}, {zipcode}{" "}
                            </p>
                          </div>
                          <Link
                            href={`/propertyform/${ids}/select-location/`}
                            className={`text-dark text-decoration-underline`}
                          >
                            {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="my-3">
                      <div className={`${styles.divider}`}></div>
                    </div>
                  </section>
                  <section ref={sectionRefs.section5} id="section5">
                    <div className="py-3">
                      <h5 className="mb-3">
                        {i18?.TRIPS?.PROPERTYANDROOMS || "Property and Rooms"}
                      </h5>
                      <div className="">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="m-0">
                              {i18?.LISTING?.PROPERTYTYPE || "Property type"}
                            </h6>
                            <p className="m-0">{propertyCategoryName}</p>
                            {pages?.includes("/select-place/") && (
                              <p className="m-0">
                                {`${
                                  i18?.LISTING?.LISTINGTYPE || "Listing type"
                                }:`}{" "}
                                {propertyTypeName}
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/propertyform/${ids}/category-select/`}
                            className={`text-dark text-decoration-underline`}
                          >
                            {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                          </Link>
                        </div>

                        {pages?.includes("/people-bed-count/") && (
                          <>
                            <div className="my-3">
                              <div className={`${styles.divider}`}></div>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                              <div>
                                <h6>
                                  {i18?.TRIPS?.GUESTSROOMANDSPACES ||
                                    "Guests, Rooms and spaces"}
                                </h6>
                                <p className="m-0 text-capitalize">
                                  {`${i18?.TRIPS?.GUEST || "Guest"}:`} {adult}
                                </p>
                                <p className="m-0 text-capitalize">
                                  {`${i18?.ROOMPAGE?.CHILDREN || "Children"}:`}{" "}
                                  {children}
                                </p>
                                <p className="m-0 text-capitalize">
                                  {`${i18?.ROOMPAGE?.PETS || "Pets"}:`} {pets}
                                </p>
                                <p className="m-0 text-capitalize">
                                  {`${i18?.FILTER?.BEDROOMS || "Bedrooms"}:`}{" "}
                                  {bedRoomCount}
                                </p>

                                {pages?.includes("/bed-types/") && (
                                  <p className="m-0 text-capitalize">
                                    {`${i18?.ROOMPAGE?.BEDS || "Beds"}:`}{" "}
                                    {bedCount}
                                  </p>
                                )}
                                <p className="m-0 text-capitalize">
                                  {`${
                                    i18?.SELECTBASICS?.BATHROOMS || "Bathrooms"
                                  }:`}{" "}
                                  {bathRoomCount}
                                </p>
                              </div>
                              <div className={`${styles.grid}`}>
                                <Link
                                  href={`/propertyform/${ids}/people-bed-count/`}
                                  className={`text-dark text-decoration-underline d-flex justify-content-end`}
                                >
                                  {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                                </Link>
                                {/* <p className='text-dark text-decoration-underline '
                                                                        role="button" onClick={openBedModal}>Sleeping Arrangement
                                                                    </p> */}
                              </div>
                            </div>
                          </>
                        )}
                        {pages?.includes("/max-guest-count/") && (
                          <>
                            <div className="my-3">
                              <div className={`${styles.divider}`}></div>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                              <div>
                                <h6>
                                  {i18?.TRIPS?.GUESTSROOMANDSPACES ||
                                    "Guests, Rooms and spaces"}
                                </h6>
                                <p className="m-0 text-capitalize">
                                  {`${
                                    i18?.SELECTBASICS?.MAXGUESTS ||
                                    "Maximum Guests"
                                  }:`}{" "}
                                  {adult}
                                </p>
                                {/* <p className="m-0 text-capitalize">
                                  {`${i18?.ROOMPAGE?.CHILDREN || "Children" 
                                    }:`}{" "}
                                  {children}
                                </p>
                                <p className="m-0 text-capitalize">
                                  {`${i18?.ROOMPAGE?.PETS || "Pets"  }:`}{" "}
                                  {pets}
                                </p> */}
                                <p className="m-0 text-capitalize">
                                  {`${i18?.FILTER?.BEDROOMS || "Bedrooms"}:`}{" "}
                                  {bedRoomCount}
                                </p>

                                {pages?.includes("/bed-types/") && (
                                  <p className="m-0 text-capitalize">
                                    {`${i18?.ROOMPAGE?.BEDS || "Beds"}:`}{" "}
                                    {bedCount}
                                  </p>
                                )}
                                <p className="m-0 text-capitalize">
                                  {`${
                                    i18?.SELECTBASICS?.BATHROOMS || "Bathrooms"
                                  }:`}{" "}
                                  {bathRoomCount}
                                </p>
                              </div>
                              <div className={`${styles.grid}`}>
                                <Link
                                  href={`/propertyform/${ids}/max-guest-count/`}
                                  className={`text-dark text-decoration-underline d-flex justify-content-end`}
                                >
                                  {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                                </Link>
                                {/* <p className='text-dark text-decoration-underline '
                                                                        role="button" onClick={openBedModal}>Sleeping Arrangement
                                                                    </p> */}
                              </div>
                            </div>
                          </>
                        )}
                        {/* <div className='my-3'>
                                                            <div className={`${styles.divider}`}></div>
                                                        </div> */}
                      </div>
                    </div>
                  </section>
                </div>
              ) : listValue === 1 ? (
                <div>
                  <div className={`${styles.pricing} d-flex`}>
                    <div className={`${styles.notify} me-3`}>
                      <ImageComponent
                        src={Notify}
                        width={20}
                        height={20}
                        alt="noti"
                        onError={handleImageError}
                      />
                    </div>
                    <div className=" flex-fill">
                      <h6 className="m-0">
                        {i18?.LISTING?.BLOCKDATESSETTINGS ||
                          "Block dates settings are in your calendar"}
                      </h6>
                      <p>
                        {i18?.LISTING?.NOWYOUCANUSE ||
                          "Now you can use your calendar to manage dates"}
                      </p>
                      <Link
                        href={`/hosting/calendar?mode=edit&id=${ids}`}
                        className={`text-dark text-decoration-underline`}
                      >
                        {i18?.LISTING?.GOTOCALENDAR || "Go to calendar"}
                      </Link>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <h6 className="m-0">
                        {i18?.LISTING?.PRICING || "Pricing"}
                      </h6>
                      {/* <p className="m-0">
                          {`${i18?.LISTING?.PERNIGHT || "Per night"  }:`}{" "}
                          {CurrencyList.currency}
                          {Math.round(
                            parseFloat(perDay) *
                              parseFloat(currency?.exchange_rate)
                          )}
                        </p> */}
                      <p className={`m-0`}>
                        {(settings?.hiddenSettings?.hourlyBooking === "Hour" ||
                          settings?.hiddenSettings?.hourlyBooking === "Both") &&
                          perHour > 0 && (
                            <>
                              {" "}
                              <b>
                                {CurrencyList.currency}{" "}
                                {currencyRate(perHour, currency?.exchange_rate)}
                              </b>{" "}
                              <span>
                                {i18?.BOOKINGPAGE?.PERHOUR || "per hour"}{" "}
                              </span>
                            </>
                          )}

                        {settings?.hiddenSettings?.hourlyBooking === "Both" &&
                          perDay > 0 &&
                          perHour > 0 &&
                          " | "}

                        {(settings?.hiddenSettings?.hourlyBooking === "Day" ||
                          settings?.hiddenSettings?.hourlyBooking === "Both") &&
                          perDay > 0 && (
                            <>
                              <b>
                                {CurrencyList.currency}{" "}
                                {currencyRate(perDay, currency?.exchange_rate)}
                              </b>{" "}
                              <span>
                                {i18?.BOOKINGPAGE?.PERDAY || "per day"}{" "}
                              </span>
                            </>
                          )}
                      </p>
                    </div>
                    <Link
                      href={`/propertyform/${ids}/guest-price/`}
                      className={`text-dark text-decoration-underline`}
                    >
                      {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mt-3">
                    <h5 className="mb-3">
                      {i18?.LISTING?.POLICIES || "Policies"}
                    </h5>
                    <div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="m-0">
                            {i18?.TRIPS?.CANCELLATIONPOLICY ||
                              "Cancellation policy"}
                          </h6>
                          {Number(ListInfo.cancellationPolicyId) === 0 ? (
                            <p className="m-0">
                              {i18?.BOOKINGPAGE?.NONREFUNDABLE ||
                                "Non-Refundable"}
                            </p>
                          ) : (
                            <>
                              {policy &&
                                policy.map((item) =>
                                  Number(ListInfo.cancellationPolicyId) ===
                                  item.id ? (
                                    <div key={item.id}>
                                      <p className="m-0">{item.title}</p>
                                    </div>
                                  ) : null
                                )}
                            </>
                          )}
                        </div>
                        <p
                          className="text-dark text-decoration-underline"
                          role="button"
                          onClick={() => setOpenPolicy(true)}
                        >
                          {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                        </p>
                      </div>
                      <div className="my-3">
                        <div className={`${styles.divider}`}></div>
                      </div>
                    </div>
                    {/* <div>
                                                        <div className='d-flex justify-content-between'>
                                                            <div>
                                                                <h6 className='m-0'>{i18?.LISTING?.INSTANTBOOK || "Instant Book"}</h6>
                                                                <p className='m-0'>{data.userData?.instantBooking ? 'True' : 'False'}</p>
                                                            </div>
                                                            <Link href='/personalinfo' className={`text-dark text-decoration-underline`}>{i18?.BOOKINGPAGE?.EDIT || "Edit"}</Link>
                                                        </div>
                                                        <div className='my-3'>
                                                            <div className={`${styles.divider}`}></div>
                                                        </div>
                                                    </div> */}
                    <div>
                      <div className="">
                        <div>
                          <div className="d-flex justify-content-between">
                            <h6 className="">
                              {i18?.LISTING?.HOUSERULES || "House rules"}
                            </h6>
                            <p
                              className="text-dark text-decoration-underline"
                              role="button"
                              onClick={handleOpenModal}
                            >
                              {i18?.PROFILE?.ADD || "Add"}
                            </p>
                          </div>
                          <div>
                            <div className={`${styles.amenities} flex-fill`}>
                              {rules.map((rule) => (
                                <div
                                  className="d-flex align-items-center pb-2"
                                  key={rule._id}
                                >
                                  <ImageComponent
                                    src={rule.image}
                                    width={35}
                                    height={35}
                                    alt=""
                                    onError={handleImageError}
                                  />
                                  <p className="flex-fill m-0 ps-2">
                                    {rule.title}
                                  </p>
                                  {/* <MdModeEditOutline onClick={() => handleOpenModal("edit", rule._id)} className='me-3' /> */}
                                  <FaRegTrashAlt
                                    onClick={() => handleRuledelete(rule._id)}
                                    className="me-4 cursor-pointer"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="my-3">
                        <div className={`${styles.divider}`}></div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
      <Footer />

      <CustomModal
        open={open}
        onClose={handleCloseModal}
        title={
          mode === "edit"
            ? "Edit rules to your place"
            : "Add rules to your place"
        }
      >
        <div className={`${styles.modal}`}>
          <div className={`${styles.details}`}>
            <div className={`${styles.icon}`}></div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-2">
              <div className="d-flex align-items-center mb-2">
                <IconPicker
                  value={fieldValue}
                  onChange={(value) => handleIconChange(value)}
                  icons={icon}
                  defaultValue={selectedRule.image}
                />
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <StyledTextFieldBorder
                      className="m-0"
                      {...field}
                      label="Rule title"
                      variant="filled"
                      type="text"
                      // defaultValue={rules.title}
                      // InputLabelProps={{
                      //     shrink: true,
                      // }}
                    />
                  )}
                />
              </div>
              <Controller
                name="desc"
                control={control}
                render={({ field }) => (
                  <StyledTextFieldBorder
                    {...field}
                    label="Rule description"
                    variant="filled"
                    type="text"
                    multiline
                    rows={4}
                    // defaultValue={rules.desc}
                    // InputLabelProps={{
                    //     shrink: true,
                    // }}
                  />
                )}
              />
            </div>
            <div
              className={`${styles.modal_bottom} justify-content-end border-top`}
            >
              <button type="submit">{i18?.BUTTONS?.SAVE || "Save"}</button>
            </div>
          </form>
        </div>
      </CustomModal>

      <CustomModal
        open={openPolicy}
        onClose={() => setOpenPolicy(false)}
        title={i18?.TRIPS?.CANCELLATIONPOLICY || "Cancellation policy"}
      >
        <div className="p-3">
          {policy &&
            policy.map((item) => (
              <div key={item.id} className="d-flex justify-content-between">
                <p className="m-0">{item.title}</p>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Radio
                        sx={{
                          color: "#717171",
                          "&.Mui-checked": {
                            color: "black",
                          },
                        }}
                      />
                    }
                    value={item.id}
                    // checked={parseInt(Value) === item.id}
                    checked={Number(userInfo.cancellationPolicyId) === item.id}
                    onChange={handleChangeCheck}
                  />
                </FormGroup>
              </div>
            ))}
        </div>
        <div className={`${styles.modal_bottom} border-top`}>
          <button
            onClick={() => setOpenPolicy(false)}
            className={`${styles.button2}`}
          >
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          <button className={`${styles.btn}`} onClick={handlePolicySave}>
            {i18?.BUTTONS?.SAVE || "Save"}
          </button>
        </div>
      </CustomModal>

      <CustomModal open={openDelete} onClose={() => setOpenDelete(false)}>
        <span className="p-3">
          {`${
            i18?.LISTING?.DOYOUWANTTODELETE ||
            "Do you want to delete this listings"
          }?`}
        </span>
        <div className={`${styles.footer} border-top`}>
          <button
            onClick={() => setOpenDelete(false)}
            className={`${styles.btn1}`}
          >
            {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
          </button>
          <button onClick={handleDeleteAPI} className={`${styles.btn2}`}>
            {i18?.LISTING?.YES || "Yes"}
          </button>
        </div>
      </CustomModal>
    </div>
  );
};

export default isAuth(EditView);
