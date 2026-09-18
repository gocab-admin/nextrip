"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { MdModeEditOutline } from "react-icons/md";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import {
  PhotosIcon,
  EmptyImgIcon,
  ActionsIcon,
  House,
  Starlogo
} from "@/app/global/svg";
import CustomModal from "@/components/modal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCoordinates, setLocation } from "@/redux/slice/mapDataSlice";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import {
  placeStructure,
  nextDisable,
  sharePlace,
  placeTitle,
  describeTitle,
  placeOffer,
  guestCount,
  bedroomCount,
  bathroomCount,
  listingSelector,
  flatNo,
  addsStreet,
  addCity,
  addCounty,
  addZipcode,
  addPrice,
  addCoverImg,
  addImage,
  createdListId,
  setPlaceOffer,
  childCount,
  petsCount,
  bedsType,
  extraGuestCount,
  addExtraPrice,
  addExtraPricePerHour,
  capacity,
  miniCount,
  maxiCount,
  addImageDel,
  HourlyChecking,
  resetData,
  nearLandmark,
  resetStep4Data
} from "@/redux/slice/listingSlice";
import { getApiMethod, postApiMethod, putApiMethod } from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import { ArrayMove, generateData } from "@/components/helper";
import isAuth from "@/components/isAuth";
import { RootState } from "@/redux/store";
import { detailSelector } from "@/redux/slice/detailSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import { userSelector } from "@/redux/slice/user/userSlice";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { Loader } from "@/components/loader";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";
import { FormControlLabel } from "@mui/material";
import { IOSSwitch } from "@/components/switch";

import styles from "./page.module.scss";
import { Category, Properties } from "./interface";

const Link = dynamic(() => import("next/link"));
const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const Map = dynamic(() => import("@/components/locationmap"));
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));

const label = { inputProps: { "aria-label": "Switch demo" } };

const countryData = [
  { label: "Afghanistan - AF", value: "AF" },
  { label: "Åland Islands - AX", value: "AX" },
  { label: "Albania - AL", value: "AL" },
  { label: "India - IN", value: "IN" }
];

const Multiform = () => {
  const { CurrencyList } = useAppSelector(currencySelector);
  const { ListInfo } = useAppSelector(listingSelector);
  const { DetailsList } = useAppSelector(detailSelector);
  const { userInfo } = useAppSelector(userSelector);
  const { i18, settings } = usePageContext();
  const {createForm} = settings

  const { listings } = settings;
  const {
    disable,
    title,
    describes,
    structure,
    privacy_type,
    host_offer,
    guests,
    child,
    pets,
    bedroom,
    bedType,
    bathroom,
    houseNo,
    area,
    city,
    state,
    country,
    street,
    zipcode,
    nearlandmark,
    price,
    coverImage,
    image,
    listId,
    extraprice,
    extraguest,
    availableCount,
    mini,
    maxi,
    extraPricePerHour,
    hourlyChecking
  } = ListInfo;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const map = useSelector((state: RootState) => state.latLngLocation);
  const combinedAddress = houseNo ? `${houseNo}${street}` : street;

  const changeGeo = (geo: any) => {
    dispatch(setCoordinates({ latitude: geo.lat, longitude: geo.lng }));
    // dispatch(setCoordinate({ latitude: geo.lat, longitude: geo.lng }));
  };
  const changeAddress = (address: any) => {
    if (typeof address === "string") {
      dispatch(setLocation(address));
    } else {
      dispatch(setLocation(address.selectedPlace));
      // dispatch(addLocation(address.locationName))
    }
  };

  const editData: any = useSearchParams();
  const editId = editData.get("id");
  const mode = editData.get("mode");
  const editStep = Number(editData.get("activeStep"));
  // const Amenity = useSelector((state:any)=>state.listingSlice.setPlaceOffer)
  const image2 = APIURLS.baseUrl + createForm?.step1
  const image3 = APIURLS.baseUrl + createForm?.step2 
  const image4 = APIURLS.baseUrl + createForm?.step3 

  const DefaultprofileImage = require("../images/defaultProfile.png");
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  // const [activeStep, setActiveStep] = useState<ActiveTab>({ activeStep: 0 });
  const [imgFiles, setImgFiles] = useState<any>([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [checkboxdata, setCheckboxdata] = useState<Category[]>([]);
  const [checkboxdata2, setCheckboxdata2] = useState<Properties[]>([]);
  const [checkboxdatastep, setCheckboxdatastep] = useState<any>();
  const characterLimit = 32; // Set your desired character limit
  const characterNextLimit = 500;
  const defaultText = describes;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);
  const [openIndex, setOpenIndex] = useState<any>(0);
  const [openExtra, setOpenExtra] = useState<any>(0);
  const [bedCountData, setBedCountData] = useState<any>(null);
  const [displayCount, setDisplayCount] = useState(6);

  const [openModal, setOpenModal] = React.useState(false);
  const [stepHide, setStepHide] = useState("");
  const [switchEdit, setSwitchEdit] = useState(false);
  const [enable, setEnable] = useState(false);
  const imageCount = settings?.hiddenSettings?.listingImageCount;

  let localImageCount = imageCount === "Default" ? 20 : imageCount;
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleInputChange = (event: any) => {
    dispatch(addPrice(event.target.value));
  };

  const handleExtraInputChange = (event: any) => {
    const inputValue = parseInt(event.target.value, 10);
    // if (!isNaN(inputValue) && inputValue >= 0) {
    dispatch(addExtraPrice(event.target.value));
    // }
  };

  const [hourPrice, setHourPrice] = useState("45");
  const handleExtraPerHourInputChange = (event: any) => {
    const inputValue = parseFloat(event.target.value);
    if ((inputValue > 0 && inputValue != 0) || !inputValue) {
      dispatch(addExtraPricePerHour(inputValue));
      setHourPrice(event.target.value);
    } else {
      setHourPrice(""); // Clear hourPrice if input is not valid
    }
  };

  const handleAvailableCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    // if (!isNaN(inputValue) && inputValue >= 1) {
    dispatch(capacity(inputValue));
  };

  const handleMiniCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    dispatch(miniCount(inputValue));
  }

  const handleMaxiCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    dispatch(maxiCount(inputValue));
  } 
  
  const handleExtraGuestCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    dispatch(extraGuestCount(inputValue));
  }

  const handleSaveClick = () => {
    setIsEditing(false);
    // Perform any additional save logic here
  };
  const [textNextValue, setTextNextValue] = useState(defaultText);
  const handleTextChange = (event: any) => {
    const inputText = event.target.value;
    if (inputText.length <= characterLimit) {
      dispatch(placeTitle(inputText));
    }
  };
  const handleTextNextChange = (event: any) => {
    const textnextValue = event.target.value;
    setTextNextValue(textnextValue);
    if (textnextValue.length <= characterNextLimit) {
      dispatch(describeTitle(textnextValue));
    }
  };

  const toggleDropdown = (index: any) => {
    if (dropdownVisible == null) {
      setDropdownVisible(index);
    } else {
      setDropdownVisible(null);
    }
  };

  const handleOptionSelect = (option: any, index: any) => {
    ArrayMove(imgFiles, index, index + option);
    setDropdownVisible(null);
  };

  const [showAll, setShowAll] = useState(false);
  const showMore = (type: any) => {
    if (type === "more") {
      setDisplayCount(ListInfo.host_offer.length);
      setShowAll(true);
    }
    if (type === "less") {
      setDisplayCount(5);
      setShowAll(false);
    }
  };
  const infoData = {
    name: title,
    desc: describes,
    userId: typeof window !== "undefined" ? localStorage.getItem("appUserId") : "",
    progressPercentage: 25
  };

  const basicDetails = {
    propertyCategory: structure,
    propertyType: privacy_type,
    adult: Number(guests),
    children: Number(child),
    pets: Number(pets),
    bedRoomCount: Number(bedroom),
    bathRoomCount: Number(bathroom),
    shared: false,
    bedRoomtype: bedType,
    city: city,
    state: state,
    country: country,
    zipcode: zipcode,
    Address: "",
    landmark: "",
    lat: DetailsList.coordinate.latitude,
    lng: DetailsList.coordinate.longitude,
    locationName: DetailsList.locationName,
    progressPercentage: 20
  };

  const placesOffer = {
    amenityId: host_offer,
    progressPercentage: 10
  };

  const option = {
    perHour: Number(extraPricePerHour) || 0,
    perDay: Number(price),
    availableCount: availableCount,
    minimumNight: mini,
    maximumNight: maxi,
    extraGuest: extraguest,
    extraGuestFee: Number(extraprice),
    progressPercentage: 22
  };

  const option2 = {
    perHour: Number(extraPricePerHour) || 0,
    perDay: Number(price),
    availableCount: availableCount,
    extraGuest: extraguest,
    extraGuestFee: Number(extraprice),
    progressPercentage: 22
  };

  const listPrice = enable ? option : option2;

  const formData: any = new FormData();
  formData.append("coverImage", coverImage);
  formData.append("progressPercentage", 10);

  const handleNext = async () => {    
    try {
      if (mode === "edit") {
        if (activeStep === 1) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          if (structure) {
            await getpropertyapi(`${APICONSTANT.privacyType  }/${structure}`);
          }
        }
        if (activeStep === 3 || activeStep === 5) {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        if (activeStep === 10 || activeStep === 11) {
          await listInfo(`${APICONSTANT.listinfo  }/${editId}`, infoData);
        }
        if (activeStep === 9) {
          if (coverImage || image.length > 0) {
            if (coverImage) {
              const formData: any = new FormData();
              formData.append("coverImage", coverImage);
              formData.append("progressPercentage", 10);
              await coverImg(`${APICONSTANT.coverImage  }/${editId}`, formData);
            } else if (image.length > 0) {
              const formData: any = new FormData();
              for (let i = 0; i < image.length; i++) {
                formData.append("photos", image[i]);
              }
              formData.append("progressPercentage", 10);
              await groupImage(`${APICONSTANT.groupImage  }/${editId}`, formData);
            }
          } else {
            router.push(`/manage-your-space?id=${editId}`);
          }
        }
        if (activeStep === 8) {
          await placesoffer(`${APICONSTANT.placesOffer  }/${editId}`, placesOffer);
        }
        if (activeStep === 2 || activeStep === 4 || activeStep === 6) {
          await basics(`${APICONSTANT.basicdetails  }/${editId}`, basicDetails);
        }
        if (activeStep === 13) {
          await addprice(`${APICONSTANT.addPrice  }/${editId}`, listPrice);
        }
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === 11) {
          setActiveStep(activeStep);
          if (switchEdit) {
            await listInfo(`${APICONSTANT.listinfo  }/${listId}`, infoData);
          } else {
            await listInfo(APICONSTANT.listinfo, infoData);
          }
        }
        if (activeStep === 13) {
          setActiveStep(activeStep);
          await addprice(`${APICONSTANT.addPrice  }/${listId}`, listPrice);
          await fetchData();
        }
        if (activeStep === 14) {
          dispatch(resetData());
          setSwitchEdit(false);
          setLoading(true);
          router.push("/hosting");
        }
        if (activeStep === 4 && stepHide.toLocaleLowerCase().includes("parking")) {
          setActiveStep((prevActiveStep) => prevActiveStep + 2);
        }
        if (activeStep === 5) {
          setBedCountData(generateData(bedroom, []));
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  const handleBack = () => {
    dispatch(nextDisable(false));

    if (activeStep === 4) {
      dispatch(resetStep4Data());
    }
    if (mode) {
      if (activeStep === 2 || activeStep === 4 || activeStep === 6) {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      } else {
        router.push(`/manage-your-space?id=${editId}`);
      }
    } else {
      if (activeStep === 0) {
        router.push(`/propertyform`);
      }
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      if (
        activeStep === 7 &&
        stepHide.toLocaleLowerCase().includes("parking")
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep - 2);
      }
    }
  };

  const getcategoryapi = async (url: any) => {
    try {
      const resp: any = await getApiMethod(url);
      if (resp.statusCode === 200) {
        if (resp?.data?.categories) {
          setCheckboxdata(resp.data.categories);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const getpropertyapi = async (url: any, obj?: any) => {
    const resp: any = await getApiMethod(url, obj);
    if (resp.statusCode === 200) {
      if (resp?.data?.properties) {
        setCheckboxdata2(resp.data.properties);
      }
    }
  };

  const getamenityapi = async (url: any) => {
    const resp: any = await getApiMethod(url);
    if (resp.statusCode === 200) {
      if (resp?.data?.amenityData) {
        setCheckboxdatastep(resp.data.amenityData);
      }
    }
  };

  useEffect(() => {
    HourlyBooking();
  }, [hourlyChecking]);

  const HourlyBooking = async () => {
    try {
      const response = await axios.get(APIURLS.liveUrl + APICONSTANT.settings);
      if (response.data.statusCode == 200) {
        const product = response?.data?.data;
        if (product) {
          dispatch(HourlyChecking(product.hiddenSettings.hourlyBooking));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (mode === "edit") {
      setActiveStep(editStep);
      getcategoryapi(APICONSTANT.propertyCategory);
      getamenityapi(APICONSTANT.placesOffer);
      if (DetailsList?.image) {
        setImgFiles(DetailsList.image);
      }
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "edit") {
      // setActiveStep(editStep)
      if (activeStep === 5) {
        setBedCountData(generateData(bedroom, bedType));
      }

      if (activeStep === 10) {
        if (!title) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (activeStep === 11) {
        if (!describes) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      // if (activeStep === 3) {
      //   if (!locationName) {
      //     dispatch(nextDisable(true));
      //   } else {
      //     dispatch(nextDisable(false));
      //   }
      // }
    } else {
      if (activeStep <= 1) {
        getcategoryapi(APICONSTANT.propertyCategory);
        if (structure) {
          getpropertyapi(`${APICONSTANT.privacyType  }/${structure}`);
        }
      }

      if (activeStep === 1) {
        if (structure.length === 0) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (activeStep === 2) {
        if (!privacy_type) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (checkboxdata2.length == 0) {
        dispatch(sharePlace(""));
      }

      if (activeStep === 4) {
        getamenityapi(APICONSTANT.placesOffer);
      }

      // if (activeStep === 5) {
      //   getamenityapi(APICONSTANT.placesOffer);
      // }

      if (activeStep === 8) {
        if (host_offer.length == 0) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (activeStep === 9) {
        let localImageCount = imageCount === "Default" ? 1 : 1;

        if (imgFiles.length < localImageCount) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (activeStep === 3) {
        if (DetailsList?.location?.length === 0) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (activeStep === 10) {
        if (title.length === 0) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (activeStep === 11) {
        if (textNextValue.trim().length === 0) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }

      if (activeStep === 13) {
        if (
          hourPrice?.toString().length === 0 ||
          hourPrice.toString().trim() === ""
        ) {
          dispatch(nextDisable(true));
        } else {
          dispatch(nextDisable(false));
        }
      }
    }
  }, [
    activeStep,
    structure,
    title,
    imgFiles,
    DetailsList.location,
    privacy_type,
    disable,
    host_offer,
    describes,
    textNextValue,
    hourPrice
  ]);

  const listInfo = async (url: any, data: any) => {
    setNextLoad(true);
    dispatch(nextDisable(true));
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      if (mode) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "List Updated",
            type: "success",
            severity: "success"
          })
        );
        router.push(`/manage-your-space?id=${editId}`);
      } else {
        setSwitchEdit(true);
        dispatch(createdListId(res.data.listing._id));
        if (res.data.listing._id) {
          basics(
            `${APICONSTANT.basicdetails  }/${res.data.listing._id}`,
            basicDetails
          );
        }
        // dispatch(
        //   addAlert({
        //     isOpen: true,
        //     message: "List Created",
        //     type: "success",
        //     severity: "success",
        //   })
        // );
      }
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const coverImg = async (url: any, data: any) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      if (mode) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "Cover image Updated",
            type: "success",
            severity: "success"
          })
        );
        if (image.length > 0) {
          const formData: any = new FormData();
          for (let i = 0; i < image.length; i++) {
            formData.append("photos", image[i]);
          }
          formData.append("progressPercentage", 10);
          groupImage(`${APICONSTANT.groupImage  }/${editId}`, formData);
        } else {
          router.push(`/manage-your-space?id=${editId}`);
        }
      } else {
        const formData: any = new FormData();
        for (let i = 0; i < image.length; i++) {
          formData.append("photos", image[i]);
        }
        formData.append("progressPercentage", 10);
        groupImage(
          `${APICONSTANT.groupImage  }/${res.data.listImg.listingId}`,
          formData
        );
        // dispatch(
        //   addAlert({
        //     isOpen: true,
        //     message: "Cover image Updated",
        //     type: "success",
        //     severity: "success",
        //   })
        // );
      }
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const groupImage = async (url: any, data: any) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      if (mode) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "Group image updated",
            type: "success",
            severity: "success"
          })
        );
        router.push(`/manage-your-space?id=${editId}`);
      } else {
        placesoffer(
          `${APICONSTANT.placesOffer  }/${res.data.listImg.listingId}`,
          placesOffer
        );
        // dispatch(
        //   addAlert({
        //     isOpen: true,
        //     message: "Group image Added",
        //     type: "success",
        //     severity: "success",
        //   })
        // );
      }
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const placesoffer = async (url: any, data: any) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      if (mode) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "Amenities updated",
            type: "success",
            severity: "success"
          })
        );
        router.push(`/manage-your-space?id=${editId}`);
      } else {
        setNextLoad(false)
        dispatch(nextDisable(false));
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        dispatch(
          addAlert({
            isOpen: true,
            message: "List Created",
            type: "success",
            severity: "success"
          })
        );
      }
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const basics = async (url: any, data: any) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      if (mode) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "Basic details Updated",
            type: "success",
            severity: "success"
          })
        );
        router.push(`/manage-your-space?id=${editId}`);
      } else {
        coverImg(`${APICONSTANT.coverImage  }/${res.data.listing._id}`, formData);
        // dispatch(
        //   addAlert({
        //     isOpen: true,
        //     message: "Basic details added",
        //     type: "success",
        //     severity: "success",
        //   })
        // );
      }
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const addprice = async (url: any, data: any) => {
    dispatch(nextDisable(true));
    setNextLoad(true)
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      if (mode) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "Price Updated",
            type: "success",
            severity: "success"
          })
        );
        dispatch(nextDisable(false));
        router.push(`/manage-your-space?id=${editId}`);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        dispatch(nextDisable(false));
        setNextLoad(false)
        // dispatch(
        //   addAlert({
        //     isOpen: true,
        //     message: "Price added",
        //     type: "success",
        //     severity: "success",
        //   })
        // );
      }
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  // const checkboxdata3 = [
  //     {
  //         alt: "Get reservations faster when you welcome anyone from the {app.appName} community.",
  //         title: "Any {app.appName} guest"
  //     },
  //     {
  //         alt: "For your first guest, welcome someone with a good track record on {app.appName} who can offer tips for how to be a great Host.",
  //         title: "An experienced guest"
  //     }
  // ]

  const handleAmenitiesCheck = (e: any) => {
    const value = e.target.value;
    if (host_offer.includes(value)) {
      const newArray = [...host_offer];
      const findIndex = newArray.indexOf(value);
      newArray.splice(findIndex, 1);
      dispatch(setPlaceOffer(newArray));
    } else {
      dispatch(placeOffer(value));
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = (data: any) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }; // your form submit function which will invoke after successful validation

  const inc = () => {
    dispatch(guestCount(guests + 1));
  };

  const dec = () => {
    if (guests > 1) {
      dispatch(guestCount(guests - 1));
    }
  };

  const childInc = () => {
    dispatch(childCount(child + 1));
  };

  const childDec = () => {
    if (child > 0) {
      dispatch(childCount(child - 1));
    }
  };

  const petsInc = () => {
    if (pets < 5) {
      dispatch(petsCount(pets + 1));
    }
  };

  const petsDec = () => {
    if (pets > 0) {
      dispatch(petsCount(pets - 1));
    }
  };

  const roomsInc = () => {
    dispatch(bedroomCount(bedroom + 1));
  };

  const roomsDec = () => {
    if (bedroom !== 1) {
      dispatch(bedroomCount(bedroom - 1));
    }
  };

  const bathInc = () => {
    dispatch(bathroomCount(bathroom + 1));
  };

  const bathDec = () => {
    if (bathroom !== 1) {
      dispatch(bathroomCount(bathroom - 1));
    }
  };

  const capacityInc = () => {
    dispatch(capacity(parseInt(availableCount + 1)));
  };

  const capacityDec = () => {
    if (availableCount > 1) {
      dispatch(capacity(availableCount - 1));
    }
  };

  const miniInc = () => {
    dispatch(miniCount(mini + 1));
  };

  const miniDec = () => {
    if (mini > 1) {
      dispatch(miniCount(mini - 1));
    }
  };
  const maxiInc = () => {
    dispatch(maxiCount(maxi + 1));
  };

  const maxiDec = () => {
    if (maxi > 2) {
      dispatch(maxiCount(maxi - 1));
    }
  };
  const extraInc = () => {
    dispatch(extraGuestCount(extraguest + 1));
  };

  const extraDec = () => {
    if (extraguest > 1) {
      dispatch(extraGuestCount(extraguest - 1));
    }
  };

  const handleImageUpload = async (e: any) => {
    let tempArr: any = [];

    // Convert each selected file to base64
    const convertFilesToBase64 = async (files: FileList) => {
      for (let i: any = 0; i < files.length; i++) {
        const file = files[i];
        dispatch(addCoverImg(file));
        const base64 = await convertBase64(file);

        tempArr.unshift({
          data: base64,
          url: URL.createObjectURL(file)
        });
      }
      setImgFiles(tempArr);
    };

    const files = e.target.files;

    if (files && files.length > 0) {
      convertFilesToBase64(files);
    }
    setDropdownVisible(null);
  };

  const imageSecondaryUpload = async (e: any) => {
    const file = e.target.files;

    // Convert each selected file to base64
    const convertFilesToBase64 = async (files: FileList) => {
      for (let i: any = 0; i < files.length; i++) {
        const file = files[i];
        dispatch(addImage(file));
        const base64 = await convertBase64(file);
        const imgUrl = URL.createObjectURL(file);
        setImgFiles((prevFiles: any) => [
          ...prevFiles,
          { data: base64, url: imgUrl }
        ]);
      }
    };

    //   if (file && file.length > 0) {
    //     convertFilesToBase64(file);
    //   } else {
    //     dispatch(addImage(file));
    //   }
    // };

    if (file && file.length > 0) {
      // Check the total number of files including the already uploaded ones
      setImgFiles((prevFiles: any) => {
        if (prevFiles.length + file.length > imageCount) {
          // alert(`You can only upload up to 3 images.`);
          return prevFiles;
        } else {
          convertFilesToBase64(file);
          return prevFiles;
        }
      });
    } else {
      dispatch(addImage(file));
    }
  };

  const convertBase64 = (file: File) => new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

  const deleteImage = async (url: any, data?: any) => {
    const res = await putApiMethod(url, data);
    if (res.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: "Image deleted",
          type: "success",
          severity: "success"
        })
      );
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };
  const fetchData = async () => {
    try {
      const res = await getApiMethod(
        `${APICONSTANT.getListing  }/${ListInfo.listId}`
      );
      if (res.statusCode === 200) {
        const amenity = res.data.listing[0].amenities;
        dispatch(setPlaceOffer(amenity));
      } else {
        console.error(`API request failed with status: ${res.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageDelete = (option: any, index: number, img?: string) => {
    if (mode) {
      if (img) {
        deleteImage(`${APICONSTANT.coverImage  }/${editId}`);
      } else {
        deleteImage(`${APICONSTANT.groupImage  }/${editId}`, { imageId: option });
      }
    }
    setImgFiles(imgFiles.filter((item: any, key: any) => key !== index));
    if (!img) {
      dispatch(
        addImageDel(image.filter((item: any, key: any) => key !== index - 1))
      );
    }
    setDropdownVisible(null);
  };

  const openCounter = (method: any, index: any) => {
    if (method.type === "Close") {
      setOpenIndex(null);
    }
    if (method.type === "Open") {
      setOpenIndex(index);
    }
  };

  const openExtraCounter = (method: any, index: any) => {
    if (method.type === "Close") {
      setOpenExtra(null);
    }
    if (method.type === "Open") {
      setOpenExtra(index);
    }
  };

  const increaseCount = (room: number, type: string, val: number) => {
    const tempObj = JSON.parse(JSON.stringify(bedCountData));
    tempObj[`bedRoom${  room}`][type] = val;
    setBedCountData(tempObj);
    let bedArr: any = [];
    Object.entries(tempObj).forEach(([key, type]: any, index: any) => {
      const bedRoom = key.replace("bedRoom", "");
      function getType(modal: any, count: any) {
        return {
          bedRoom: bedRoom,
          bedType: modal,
          bedCount: count
        };
      }

      if (type.double) {
        bedArr.push(getType("double", type.double));
      }
      if (type.queen) {
        bedArr.push(getType("queen", type.queen));
      }
      if (type.king) {
        bedArr.push(getType("king", type.king));
      }
    });
    dispatch(bedsType(bedArr));
  };
  const decreaseCount = (room: number, type: string, val: number) => {
    const tempObj = JSON.parse(JSON.stringify(bedCountData));
    tempObj[`bedRoom${  room}`][type] = val;
    setBedCountData(tempObj);
    let bedArr: any = [];
    Object.entries(tempObj).forEach(([key, type]: any, index: any) => {
      const bedRoom = key.replace("bedRoom", "");
      function getType(modal: any, count: any) {
        return {
          bedRoom: bedRoom,
          bedType: modal,
          bedCount: count
        };
      }

      if (type.double) {
        bedArr.push(getType("double", type.double));
      }
      if (type.queen) {
        bedArr.push(getType("queen", type.queen));
      }
      if (type.king) {
        bedArr.push(getType("king", type.king));
      }
    });
    dispatch(bedsType(bedArr));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={`${styles.host}`}>
        <header className={`${styles.navigation} border-bottom`}>
          <div
            className={`${styles.header_nav} d-flex align-items-center h-100`}
          >
            <Link href="/">
              <Starlogo
                height="50"
                color="red"
                responsive="d-lg-block d-none"
              />
            </Link>
            {/* <div className="ms-auto">
                            <div className="d-flex align-items-center justify-content-center">
                                <Link href="/propertyform" style={{ color: "white", textDecoration: "none" }} className={`${styles.btn_setup} btn`}>
                                    <span
                                        className={`${styles.flexit} d-flex align-items-center`}
                                    >
                                        Save & exit
                                    </span>
                                </Link>
                            </div>
                        </div> */}
          </div>
        </header>

        {activeStep === 0 ? (
          <section className={`${styles.form}`}>
            <div className={`${styles.formright}`}>
              <div className={`${styles.formrightcon}`}>
                <div>
                  <h5 className="me-2">{i18?.HEADER?.STEP || "Step"} 1</h5>
                  <h1 className={`${styles.h1tag}`}>
                    {i18?.PLACEINTRO?.PLACEINTRO || "Tell us about your place"}
                  </h1>
                  <p>
                    {i18?.PLACEBREIF?.PLACEBREIF ||
                      "In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay."}
                  </p>
                </div>
              </div>
              <ImageComponent
                src={image2}
                width={600}
                height={526}
                className={`${styles.images}`}
                alt=""
                onError={handleImageError}
              />
            </div>
          </section>
        ) : null}

        {activeStep === 1 ? (
          <section className={`${styles.form}`}>
            <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.SELECTPLACE?.SELECTPLACE ||
                  "Which of these best describes your place?"}
              </h1>
              <div className={`${styles.regional_images} pb-4`}>
                {checkboxdata.length !== 0 ? (
                  checkboxdata?.map((region: any, r: number) => (
                    <div
                      className="d-flex flex-column p-2"
                      key={`region${  region._id}`}
                    >
                      <label htmlFor={`check${  region._id}`}>
                        <input
                          type="radio"
                          name="checkplace"
                          id={`check${  region._id}`}
                          value={region._id}
                          onClick={(e: any) => {
                            dispatch(placeStructure(region._id));
                            setStepHide(region.category);
                          }}
                          checked={structure === region._id}
                        />

                        <div className={`${styles.labelcheck}`}>
                          <div className={`${styles.icon}`}>
                            <ImageComponent
                              src={region.icon}
                              width={45}
                              height={45}
                              alt={region.category}
                              onError={handleImageError}
                            />
                          </div>

                          <p className={`${styles.para} m-0`}>
                            {region.category}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div>{i18?.HEADER?.NODATAFOUND || "No Data Found"}</div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 2 ? (
          <section className={`${styles.step2} mb-4`}>
            <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.SELECTPLACE?.SELECTPLACE ||
                  "Which of these best describes your place?"}
              </h1>
              <div className={`${styles.regional_images2} pb-4`}>
                {checkboxdata2 && checkboxdata2.length > 0 ? (
                  checkboxdata2?.map((type: any, rp: number) => (
                    <div
                      className="d-flex flex-column p-2"
                      key={`region${  type._id}`}
                    >
                      <label htmlFor={`check${  type._id}`}>
                        <input
                          type="radio"
                          name="checkroom"
                          id={`check${  type._id}`}
                          value={privacy_type}
                          onClick={(e: any) => dispatch(sharePlace(type._id))}
                          checked={privacy_type === type._id}
                        />

                        <div className={`${styles.labelcheck}`}>
                          <div className="">
                            <h5>{type.property}</h5>
                            <p className="m-0">{type.desc}</p>
                          </div>
                          {type.icon ? (
                            <ImageComponent
                              src={type.icon}
                              width={45}
                              height={45}
                              alt={type.property}
                              onError={handleImageError}
                            />
                          ) : (
                            <House
                              style={{
                                display: "block",
                                height: "45px",
                                width: "45px",
                                fill: "none",
                                stroke: "currentcolor",
                                strokeWidth: 2
                              }}
                            />
                          )}
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div>
                    <p>
                      {i18?.SELECTPLACE?.NOTSELECT ||
                        "Currently there are no option is availabe for selected type"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 3 ? (
          <section className={`${styles.step3} mb-4`}>
            <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.SELECTLOCATION?.TITLE || "Where's your place located?"}
              </h1>
              <p>
                {i18?.SELECTLOCATION?.TEXT ||
                  "Your address is only shared with guests after they’ve made a reservation."}
              </p>
              <div className={`${styles.regional_images3}`}>
                <Map
                  onChangeAddress={changeAddress}
                  onChange={changeGeo}
                  value={map}
                />
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 4 ? (
          <section className={`${styles.step4}`}>
            <div className={`${styles.checkbox} col-md-7 h-100 mt-5 checkbox`}>
              <h1 className="me-2">
                {i18?.CONFIRMADDRESS?.TITLE || "Confirm your address"}
              </h1>
              <p style={{ color: "var(--text-color)" }}>
                {i18?.CONFIRMADDRESS?.TEXT ||
                  "Your address is only shared with guests after they’ve made a reservation."}
              </p>
              <div className={`${styles.regional_images4} pb-4`}>
                <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
                  {/* register your input into the hook by invoking the "register" function */}
                  <div className="mb-3 w-100">
                    <FormControl className="w-[100%]">
                      <InputLabel id="country-label">
                        {i18?.PROFILE?.COUNTRY || "Country"}/
                        {i18?.PROFILE?.REGION || "region"}
                      </InputLabel>
                      <Select
                        labelId="country-label"
                        id="country-select"
                        label="Country/region"
                        defaultValue={country}
                        // onChange={(e) => {
                        //   dispatch(addCounty(e.target.value));
                        // }}
                        // {...field}
                      >
                        <MenuItem value={country}>{country}</MenuItem>
                        {countryData?.map((country) => (
                          <MenuItem key={country.value} value={country.label}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* include validation with required or other standard HTML validation rules */}
                  {/* <TextField
                    label={i18?.PROFILE?.HOUSEFLATNO || "House, flat No etc.."}
                    value={houseNo}
                    onChange={(e) => {
                      dispatch(flatNo(e.target.value));
                    }}
                  /> */}
                  <TextField
                    value={combinedAddress || ""}
                    label={i18?.PROFILE?.STREETADDRESS || "Street address"}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Split the value into number and alphabet parts
                      const parts: RegExpMatchArray | null =
                        value.match(/^(\d*)\s*(.*)$/);
                      const newHouseNo = parts ? parts[1] : "";
                      const newStreet = parts ? parts[2].trimStart() : ""; // Remove leading spaces from the street part

                      // Automatically add a space after the number if it's followed by any text
                      const formattedStreet =
                        newHouseNo && newStreet ? ` ${newStreet}` : newStreet;

                      // Update the combined address in the TextField
                      const combinedAddress = newHouseNo + formattedStreet;

                      // Update state and dispatch actions
                      dispatch(flatNo(newHouseNo));
                      dispatch(addsStreet(formattedStreet));
                    }}
                  />
                  {/* <TextField
                    value={area}
                    label={
                      (i18?.PROFILE?.AREA || "Area") +
                      "/" +
                      (i18?.PROFILE?.VILLAGE || "Village")
                    }
                    onChange={(e) => {
                      dispatch(addArea(e.target.value));
                    }}
                  /> */}
                  <TextField
                    value={nearlandmark}
                    label={i18?.PROFILE?.LANDMARK || "Near by landmark"}
                    // onChange={(e) => {dispatch(flatNo(e.target.value))}}
                    onChange={(e) => {
                      dispatch(nearLandmark(e.target.value));
                    }}
                  />

                  <TextField
                    value={city}
                    label={
                      `${i18?.PROFILE?.CITY || "City" 
                      }/${ 
                      i18?.PROFILE?.TOWN || "town"}`
                    }
                    onChange={(e) => {
                      dispatch(addCity(e.target.value));
                    }}
                  />
                  {/* errors will return when field validation fails  */}
                  {/* {errors.exampleRequired && <span>This field is required</span>} */}

                  <TextField
                    value={zipcode || ""}
                    label={i18?.PROFILE?.POSTCODE || "Postcode"}
                    onChange={(e) => {
                      dispatch(addZipcode(e.target.value));
                    }}
                  />
                  <TextField
                    value={state}
                    label={
                      `${i18?.PROFILE?.STATE || "State" 
                      }/${ 
                      i18?.PROFILE?.TERRITORY || "territory"}`
                    }
                    className=""
                    onChange={(e) => {
                      dispatch(addCounty(e.target.value));
                    }}
                  />

                  {/* <button type="submit"
                                            className={`${styles.submitbtn}`}
                                        >Next<KeyboardArrowRight />
                                        </button> */}
                </form>

                <hr />
                {/* <div className="d-flex justify-content-between">
                                        <div className="">
                                            <h3>Show your specific location</h3>
                                            <p>Make it clear to guests where your place is located. We'll only share your address after they've made a reservation. <a href="">Learn more</a></p>
                                        </div>
                                        <Switch {...label} />
                                    </div>
                                    <hr /> */}
                <Map
                  onChangeAddress={changeAddress}
                  onChange={changeGeo}
                  value={map}
                  auto="hide"
                />
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 5 ? (
          <section className={`${styles.step5}`}>
            <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.SELECTBASICS?.TITLE ||
                  "Share some basics about your place"}
              </h1>
              <p>
                {i18?.SELECTBASICS?.SUBTITLE ||
                  "You'll add more details later, such as bed types."}
              </p>
              <div className={`${styles.regional_images5} mt-5 pb-4`}>
                <div className={`${styles.guests}`}>
                  <div
                    className={`d-flex justify-content-between align-items-center py-3`}
                  >
                    <div>
                      <h5 className="m-0 share-basics">
                        {i18?.SELECTBASICS?.ADULTS || "Adults"}
                      </h5>
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      <button onClick={dec} className={`${styles.add_btn}`}>
                        -
                      </button>
                      <p className="px-5">{guests}</p>
                      <button onClick={inc} className={`${styles.del_btn}`}>
                        +
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div
                    className={`d-flex justify-content-between align-items-center py-3`}
                  >
                    <div>
                      <h5 className="m-0 share-basics">
                        {i18?.SELECTBASICS?.CHILDREN || "Children"}
                      </h5>
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      <button
                        onClick={childDec}
                        className={`${styles.add_btn}`}
                      >
                        -
                      </button>
                      <p className="px-5">{child}</p>
                      <button
                        onClick={childInc}
                        className={`${styles.del_btn}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div
                    className={`d-flex justify-content-between align-items-center py-3`}
                  >
                    <div>
                      <h5 className="m-0 share-basics">
                        {i18?.SELECTBASICS?.PETS || "Pets"}
                      </h5>
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      <button onClick={petsDec} className={`${styles.add_btn}`}>
                        -
                      </button>
                      <p className="px-5">{pets}</p>
                      <button onClick={petsInc} className={`${styles.del_btn}`}>
                        +
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div
                    className={`d-flex justify-content-between align-items-center py-3`}
                  >
                    <div>
                      <h5 className="m-0 share-basics">
                        {i18?.SELECTBASICS?.BEDROOMS || "Bedrooms"}
                      </h5>
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      <button
                        onClick={roomsDec}
                        className={`${styles.add_btn}`}
                      >
                        -
                      </button>
                      <p className="px-5">{bedroom}</p>
                      <button
                        onClick={roomsInc}
                        className={`${styles.del_btn}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <hr />
                  {/* <div className={`d-flex justify-content-between align-items-center py-3`}>
                                            <div>
                                                <h5 className='m-0'>Beds</h5>
                                            </div>
                                            <div className={`d-flex justify-content-between align-items-center`}>
                                                <button onClick={bedsDec} className={`${styles.add_btn}`}>-</button>
                                                <p className='px-5'>{beds}</p>
                                                <button onClick={bedsInc} className={`${styles.del_btn}`}>+</button>
                                            </div>
                                        </div>
                                        <hr /> */}
                  <div
                    className={`d-flex justify-content-between align-items-center py-3`}
                  >
                    <div>
                      <h5 className="m-0 share-basics">
                        {i18?.SELECTBASICS?.BATHROOMS || "Bathrooms"}
                      </h5>
                    </div>
                    <div
                      className={`d-flex justify-content-between align-items-center`}
                    >
                      <button onClick={bathDec} className={`${styles.add_btn}`}>
                        -
                      </button>
                      <p className="px-5">{bathroom}</p>
                      <button onClick={bathInc} className={`${styles.del_btn}`}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        
        {activeStep === 6 ? (
          <section className={`${styles.steptype}`}>
            <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
              <h1 className="my-3" style={{ marginLeft: "1rem" }}>
                {i18?.ADDARRANGEMENT?.TITLE || "Add some arrangement for stay"}
              </h1>
              <p style={{ marginLeft: "1rem" }}>
                {i18?.ADDARRANGEMENT?.SUBTITLE || "You can change it later."}
              </p>
              {bedCountData &&
                Array.from(Array(bedroom)).map((item: any, index: number) => {
                  const bedtype = bedCountData[`bedRoom${  index + 1}`];
                  return (
                    <div className={`${styles.body}`} key={index}>
                      <div className={`${styles.bodyContent}`}>
                        <div>
                          <p>
                            {i18?.ADDARRANGEMENT?.BEDROOM || "Bedroom"}{" "}
                            {index + 1}{" "}
                          </p>
                        </div>
                        <div>
                          {openIndex == index ? (
                            <KeyboardArrowUpIcon
                              onClick={() =>
                                openCounter({ type: "Close" }, index)
                              }
                            />
                          ) : (
                            <KeyboardArrowDownIcon
                              onClick={() =>
                                openCounter({ type: "Open" }, index)
                              }
                            />
                          )}
                        </div>
                      </div>
                      {openIndex == index && (
                        <>
                          <div className={`${styles.dropDown}`}>
                            <div className={`${styles.Label}`}>
                              <p className="m-0">
                                {i18?.ADDARRANGEMENT?.KING || "King"}
                              </p>
                            </div>
                            <div className={`${styles.flexContainer}`}>
                              <button
                                className={`${styles.Box}`}
                                disabled={bedtype.king === 0}
                                onClick={() =>
                                  decreaseCount(
                                    index + 1,
                                    "king",
                                    bedtype.king - 1
                                  )
                                }
                              >
                                <RemoveIcon />
                              </button>
                              <p>{bedtype.king}</p>
                              <button
                                className={`${styles.Box}`}
                                onClick={() =>
                                  increaseCount(
                                    index + 1,
                                    "king",
                                    bedtype.king + 1
                                  )
                                }
                              >
                                <AddIcon />
                              </button>
                            </div>
                          </div>
                          <hr />
                          <div className={`${styles.dropDown}`}>
                            <div className={`${styles.Label}`}>
                              <p className="m-0">
                                {i18?.ADDARRANGEMENT?.QUEEN || "Queen"}
                              </p>
                            </div>
                            <div className={`${styles.flexContainer}`}>
                              <button
                                className={`${styles.Box}`}
                                disabled={bedtype.queen === 0}
                                onClick={() =>
                                  decreaseCount(
                                    index + 1,
                                    "queen",
                                    bedtype.queen - 1
                                  )
                                }
                              >
                                <RemoveIcon />
                              </button>
                              <p>{bedtype.queen}</p>
                              <button
                                className={`${styles.Box}`}
                                onClick={() =>
                                  increaseCount(
                                    index + 1,
                                    "queen",
                                    bedtype.queen + 1
                                  )
                                }
                              >
                                <AddIcon />
                              </button>
                            </div>
                          </div>
                          <hr />
                          <div className={`${styles.dropDown}`}>
                            <div className={`${styles.Label}`}>
                              <p className="m-0">
                                {i18?.ADDARRANGEMENT?.DOUBLE || "Double"}
                              </p>
                            </div>
                            <div className={`${styles.flexContainer}`}>
                              <button
                                className={`${styles.Box}`}
                                disabled={bedtype.double === 0}
                                onClick={() =>
                                  decreaseCount(
                                    index + 1,
                                    "double",
                                    bedtype.double - 1
                                  )
                                }
                              >
                                <RemoveIcon />
                              </button>
                              <p>{bedtype.double}</p>
                              <button
                                className={`${styles.Box}`}
                                onClick={() =>
                                  increaseCount(
                                    index + 1,
                                    "double",
                                    bedtype.double + 1
                                  )
                                }
                              >
                                <AddIcon />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        ) : null}

        {activeStep === 7 ? (
          <section className={`${styles.form}`}>
            <div className={`${styles.formright}`}>
              <div className={`${styles.formrightcon}`}>
                <div>
                  <h5 className="me-2">{i18?.HEADER?.STEP || "Step"} 2</h5>
                  <h1 className={`${styles.h1tag}`}>
                    {i18?.MAKEPLACE?.TITLE || "Make your place stand out"}
                  </h1>
                  <p>
                    {i18?.MAKEPLACE?.SUBTITLE ||
                      "In this step, you’ll add some of the amenities your place offers, plus 5 or more photos. Then you’ll create a title and description."}
                  </p>
                </div>
              </div>
              <ImageComponent
                src={image3}
                width={600}
                height={526}
                className={`${styles.images}`}
                alt=""
                onError={handleImageError}
              />
            </div>
          </section>
        ) : null}

        {activeStep === 8 ? (
          <section className={`${styles.form} ${styles.step7}`}>
            <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.MAKEPLACE?.SELECTAMENITIES ||
                  "Tell guests what your place has to offer"}
              </h1>
              <div className={`${styles.regional_images}`}>
                {checkboxdatastep?.map((region: any, r: number) => (
                  <>
                    {region?.amenities?.map((item: any, ra: any) => (
                      <div
                        className="d-flex flex-column"
                        key={`region${  item._id}`}
                      >
                        <label htmlFor={`check${  item._id}`}>
                          <input
                            hidden
                            type="checkbox"
                            name="checkoffer"
                            id={`check${  item._id}`}
                            value={item._id}
                            onClick={handleAmenitiesCheck}
                            checked={ListInfo.host_offer.includes(item._id)}
                          />

                          <div className={`${styles.labelcheck}`}>
                            <div className={`${styles.icon}`}>
                              <ImageComponent
                                src={item.icon}
                                width={45}
                                height={45}
                                alt=""
                                onError={handleImageError}
                              />
                            </div>

                            <p className={`${styles.para} m-0`}>{item.name}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 9 ? (
          <section className={`${styles.step8}`}>
            <div className="h-100 col-md-7 mx-auto mt-3">
              {imgFiles && imgFiles.length == 0 ? (
                <div className={`${styles.upload_sec} h-100 checkbox`}>
                  <h1 className="me-2">
                    {i18?.ADDPHOTO?.TITLE || "Add some photos of your house"}
                  </h1>
                  <p>
                    {i18?.ADDPHOTO?.SUBTITLE ||
                      "Browse your photos to get started. You can add more or make changes later."}
                  </p>
                  <div className={`${styles.photos_upload} mt-5`}>
                    <div>
                      <PhotosIcon
                        width="64"
                        height="64"
                        style={{
                          display: "block",
                          fill: " currentcolor"
                        }}
                      />
                      {localImageCount < 20 && (
                        <h2 className="pt-1">
                          {i18?.ADDPHOTO?.CHOOSEPHOTO ||
                            "Choose at least 1 photo"}
                        </h2>
                      )}
                      {localImageCount > 5 && (
                        <h2 className="pt-1">
                          {i18?.ADDPHOTO?.CHOOSEYOUR ||
                            "Choose your photos as you want to show"}
                        </h2>
                      )}
                      <div className={`${styles.custom_fileupload} pt-2`}>
                        <label htmlFor="imageUpload">
                          <input
                            type="file"
                            id="imageUpload"
                            className={`${styles.imageUpload}`}
                            onChange={handleImageUpload}
                            // multiple
                            accept="image/*"
                          />
                          {i18?.ADDPHOTO?.UPLOAD || "Upload from your device"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.five_image} h-100 checkbox`}>
                  <div className="d-flex justify-content-between mb-3">
                    {localImageCount < 20 && (
                      <h3 className="pt-1 image">
                        {i18?.ADDPHOTO?.CHOOSEPHOTO ||
                          "Choose at least 1 photo"}
                      </h3>
                    )}
                    {localImageCount > 5 && (
                      <h3 className="pt-1">
                        {i18?.ADDPHOTO?.CHOOSEYOUR ||
                          "Choose your photos as you want to show"}
                      </h3>
                    )}
                    {imageCount >= 1 && imgFiles.length < imageCount && (
                      <div className={`${styles.custom_fileupload}`}>
                        <label
                          htmlFor="placeholderUpload"
                          className={`${styles.morebtn}`}
                        >
                          <input
                            type="file"
                            id="placeholderUpload"
                            className={`${styles.imageUpload}`}
                            onChange={imageSecondaryUpload}
                            multiple
                            accept="image/*"
                          />
                          <AddIcon className={`${styles.addmore} me-2`} />
                          {i18?.ADDPHOTO?.ADDMORE || "Add more"}
                        </label>
                      </div>
                    )}
                  </div>
                  <div className={`${styles.all_images} pb-4`}>
                    {imgFiles &&
                      imgFiles?.map((file: any, f: number) =>
                        f === 0 ? (
                          <div
                            key={f}
                            className={`${styles.photos_upload} mt-2 position-relative`}
                            style={{
                              backgroundImage: !file.data
                                ? `url(${APIURLS.baseUrl + file.imagePath})`
                                : `url('${file.data}')`
                            }}
                          >
                            <button
                              className={`${styles.action_icon} btn ms-auto`}
                              onClick={() => toggleDropdown(f)}
                            >
                              <span>
                                <ActionsIcon
                                  width="16"
                                  height="16"
                                  style={{
                                    display: "block",
                                    fill: "var(--footer-text-color)"
                                  }}
                                />
                              </span>
                            </button>
                            {dropdownVisible === f ? (
                              <div className={`${styles.dropdown}`}>
                                <ul>
                                  {mode && (
                                    <li
                                      className={`${styles.custom_fileupload}`}
                                    >
                                      <label
                                        htmlFor="imageUpload"
                                        className={`${styles.editbtn}`}
                                      >
                                        <input
                                          type="file"
                                          id="imageUpload"
                                          className={`${styles.imageUpload}`}
                                          onChange={handleImageUpload}
                                          accept="image/*"
                                        />
                                        {i18?.WISHLIST?.DELETE || "Delete"}
                                      </label>
                                    </li>
                                  )}
                                  {!mode &&
                                    localImageCount > 1 &&
                                    imgFiles.length > 1 && (
                                      <li
                                        style={{ color: "var(--text-color)" }}
                                        onClick={() => handleOptionSelect(1, f)}
                                      >
                                        {i18?.ADDPHOTO?.MOVEFORWARDS ||
                                          "Move forwards"}
                                      </li>
                                    )}
                                  {!mode && (
                                    <li
                                      style={{ color: "var(--text-color)" }}
                                      onClick={() =>
                                        handleImageDelete(file._id, f, "cover")
                                      }
                                    >
                                      {i18?.ADDPHOTO?.DELETE || "Delete"}
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div
                            key={f}
                            className={`${styles.photos_uploadGrid} mt-2 position-relative`}
                            style={{
                              backgroundImage: !file.data
                                ? `url(${APIURLS.baseUrl + file.imagePath})`
                                : `url('${file.data}')`
                            }}
                          >
                            <button
                              className={`${styles.action_icon} btn ms-auto`}
                              onClick={() => toggleDropdown(f)}
                            >
                              <span>
                                <ActionsIcon
                                  width="16"
                                  height="16"
                                  style={{
                                    display: "block",
                                    fill: "var(--footer-text-color)"
                                  }}
                                />
                              </span>
                            </button>
                            {dropdownVisible == f ? (
                              <div className={`${styles.dropdown}`}>
                                <ul>
                                  {localImageCount > 1 && !mode && (
                                    <li
                                      style={{ color: "var(--text-color)" }}
                                      onClick={() => handleOptionSelect(-1, f)}
                                    >
                                      {i18?.ADDPHOTO?.MOVEBACKWARDS ||
                                        "Move backwards"}
                                    </li>
                                  )}
                                  {localImageCount > 1 &&
                                    !mode &&
                                    f !== imgFiles.length - 1 && (
                                      <li
                                        style={{ color: "var(--text-color)" }}
                                        onClick={() => handleOptionSelect(1, f)}
                                      >
                                        {i18?.ADDPHOTO?.MOVEFORWARDS ||
                                          "Move forwards"}
                                      </li>
                                    )}
                                  {localImageCount > 1 && !mode && (
                                    <li
                                      style={{ color: "var(--text-color)" }}
                                      onClick={() => handleOptionSelect(-f, f)}
                                    >
                                      {i18?.ADDPHOTO?.MAKECOVERPHOTO ||
                                        "Make Cover Photo"}
                                    </li>
                                  )}
                                  <li
                                    style={{ color: "var(--text-color)" }}
                                    onClick={() =>
                                      handleImageDelete(file._id, f)
                                    }
                                  >
                                    {i18?.WISHLIST?.DELETE || "Delete"}
                                  </li>
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        )
                      )}
                    {imgFiles &&
                      imgFiles.length >= 1 &&
                      imageCount > 1 &&
                      // Array.from(
                      //   Array(imgFiles.length - imgFiles.length + 1)
                      // ).map((addImg, a) => (
                      Array.from({ length: imageCount }).map(
                        (_, index) =>
                          index === imgFiles.length && (
                            <div
                              key={index}
                              className={`${styles.placeholder_upload} mt-2`}
                            >
                              <div className="d-flex align-items-center justify-content-center h-100">
                                <div
                                  className={`${styles.custom_fileupload} w-100 h-100`}
                                >
                                  <label
                                    htmlFor="placeholderUpload"
                                    className="w-100 h-100"
                                  >
                                    <input
                                      type="file"
                                      id="placeholderUpload"
                                      className={`${styles.imageUpload}`}
                                      onChange={imageSecondaryUpload}
                                      multiple
                                      accept="image/*"
                                    />
                                    {/* {imgFiles.length -1 ? <AddIcon className="h-100 m-auto" width="32"
                                                                            height="32"/> :  */}
                                    <EmptyImgIcon
                                      className="h-100 m-auto"
                                      width="32"
                                      height="32"
                                      style={{
                                        display: "block",
                                        fill: " currentcolor"
                                      }}
                                    />
                                    {/* } */}
                                  </label>
                                </div>
                              </div>
                            </div>
                          )
                      )}
                    {localImageCount > 5 &&
                      Array.from(
                        Array(imgFiles.length - imgFiles.length + 1)
                      ).map((addImg, a) => (
                        <div
                          key={a}
                          className={`${styles.placeholder_upload} mt-2`}
                        >
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <div
                              className={`${styles.custom_fileupload} w-100 h-100`}
                            >
                              <label
                                htmlFor="placeholderUpload"
                                className="w-100 h-100"
                              >
                                <input
                                  type="file"
                                  id="placeholderUpload"
                                  className={`${styles.imageUpload}`}
                                  onChange={imageSecondaryUpload}
                                  multiple
                                  accept="image/*"
                                />
                                {/* {imgFiles.length -1 ? <AddIcon className="h-100 m-auto" width="32"
                                                                          height="32"/> :  */}
                                <EmptyImgIcon
                                  className="h-100 m-auto"
                                  width="32"
                                  height="32"
                                  style={{
                                    display: "block",
                                    fill: " currentcolor"
                                  }}
                                />
                                {/* } */}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : null}

        {activeStep === 10 ? (
          <section className={`${styles.form} ${styles.step9}`}>
            <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.HOMENAME?.TITLE || "Now, let's give your house a title"}
              </h1>
              <p>
                {i18?.HOMENAME?.SUBTITLE ||
                  "Short titles work best. Have fun with it – you can always change it later."}
              </p>
              <div className={`${styles}`}>
                <textarea
                  rows={5}
                  className={`${styles.textarea} w-100 p-2 p-md-3 p-lg-4`}
                  value={title}
                  onChange={handleTextChange}
                  placeholder={i18?.HOMENAME?.ENTERTEXT || "Enter text here..."}
                />
                <p>
                  {title.length}/{characterLimit}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 11 ? (
          <section className={`${styles.form} ${styles.step10}`}>
            <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.CREATEDESCRIPTION?.TITLE || "Create your description"}
              </h1>
              <p>
                {i18?.CREATEDESCRIPTION?.SUBTITLE ||
                  "Share what makes your place special."}
              </p>
              <div className={`${styles}`}>
                <textarea
                  rows={5}
                  className={`${styles.textarea} w-100 p-2 p-md-3 p-lg-4`}
                  value={describes}
                  onChange={handleTextNextChange}
                  placeholder="Enter text here..."
                />
                <p>
                  {textNextValue.length}/{characterNextLimit}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 12 ? (
          <section className={`${styles.form}`}>
            <div className={`${styles.formright}`}>
              <div className={`${styles.formrightcon}`}>
                <div>
                  <h5 className="me-2">{i18?.HEADER?.STEP || "Step"} 3</h5>
                  <h1 className={`${styles.h1tag}`}>
                    {i18?.FINISHUP?.TITLE || "Finish up and publish"}
                  </h1>
                  <p>
                    {i18?.FINISHUP?.PARA ||
                      "Finally, you’ll choose if you'd like to start with an experienced guest, then you'll set your nightly price. Answer a few quick questions and publish when you're ready."}
                  </p>
                </div>
              </div>
              <ImageComponent
                src={image4}
                width={600}
                height={526}
                className={`${styles.images}`}
                alt=""
                onError={handleImageError}
              />
            </div>
          </section>
        ) : null}

        {activeStep === 13 ? (
          <section className={`${styles.form} ${styles.step13}`}>
            <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.SETPRICE?.TITLE || "Now, set your price"}
              </h1>
              <p>{i18?.SETPRICE?.SUBTITLE || "You can change it anytime."}</p>
              <div>
                {isEditing ? (
                  <div className={`${styles.amounttext}`}>
                    <input
                      type="number"
                      value={price}
                      onChange={handleInputChange}
                    />
                    <DynamicButtonComponent
                      variant="outlined"
                      onClick={handleSaveClick}
                      text={i18?.SETPRICE?.SAVE || "Save"}
                    />
                  </div>
                ) : (
                  <div className={`${styles.amounttext}`}>
                    <input type="text" value={price} readOnly={true} />
                    <MdModeEditOutline
                      onClick={handleEditClick}
                      className={`${styles.editicon}`}
                    />
                  </div>
                )}
              </div>
              <p className="text-center">
                {i18?.SETPRICE?.PRETAXPRICE || "Guest price before taxes"}{" "}
                {CurrencyList.currency} {price} {/* {i18?.BOOKINGPAGE?.PERDAY || "per day"} */}
              </p>
              <div className=" mt-4">
                <div className={`${styles.body}`}>
                  <div
                    className={`${styles.bodyContent} d-flex justify-content-between`}
                  >
                    <div>
                      <h5>{i18?.SETPRICE?.MOREDETAILS || "More details"}</h5>
                    </div>
                    <div>
                      {openExtra == 0 ? (
                        <KeyboardArrowUpIcon
                          onClick={() => openExtraCounter({ type: "Close" }, 0)}
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          onClick={() => openExtraCounter({ type: "Open" }, 0)}
                        />
                      )}
                    </div>
                  </div>
                  <>
                    {openExtra == 0 && (
                      <div className={`${styles.guests}`}>
                        <div
                          className={`d-flex justify-content-between align-items-center py-3`}
                        >
                          <div>
                            <p className="m-0">
                              {i18?.SETPRICE?.AVAILABLECOUNT || "AvailableCount"}
                            </p>
                          </div>
                          <div
                            className={`d-flex justify-content-between align-items-center`}
                          >
                            <button
                              onClick={capacityDec}
                              className={`${styles.add_btn}`}
                            >
                              -
                            </button>

                            {/* <p className="px-5 m-0">{availableCount}</p>  */}
                            <div className={`${styles.availableCounttext} m-0`}>
                              <input
                                type="number"
                                value={availableCount}
                                onChange={handleAvailableCount}
                              />
                            </div>

                            <button
                              onClick={capacityInc}
                              className={`${styles.del_btn}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <hr />
                        {listings.pricings.additions === "1" && (
                          <div>
                            <div className="d-flex justify-content-between align-items-center py-3">
                              <div>
                                <p className="m-0">
                                  {i18?.SETPRICE?.MAXSELECTNIGHT ||
                                    "Maximum night select"}
                                </p>
                              </div>
                              <FormControlLabel
                                className="me-2"
                                control={<IOSSwitch />}
                                // label={enable ? 'Enable' : 'Disable'}
                                label={undefined}
                                checked={enable}
                                onChange={(event: any) =>
                                  setEnable(event.target.checked)
                                }
                              />
                            </div>
                            <hr />
                            {enable && (
                              <div>
                                <div
                                  className={`d-flex justify-content-between align-items-center py-3`}
                                >
                                  <div>
                                    <p className="m-0">
                                      {i18?.SETPRICE?.MINNIGHT ||
                                        "Minimum Night"}
                                    </p>
                                  </div>
                                  <div
                                    className={`d-flex justify-content-between align-items-center`}
                                  >
                                    <button
                                      onClick={miniDec}
                                      className={`${styles.add_btn}`}
                                    >
                                      -
                                    </button>
                                    {/* <p className="px-5 m-0">{mini}</p> */}
                                    <div className={`${styles.availableCounttext} m-0`}>
                                      <input
                                        type="number"
                                        value={mini}
                                        onChange={handleMiniCount}
                                      />
                                    </div>

                                    <button
                                      onClick={miniInc}
                                      className={`${styles.del_btn}`}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <hr />
                                <div
                                  className={`d-flex justify-content-between align-items-center py-3`}
                                >
                                  <div>
                                    <p className="m-0">
                                      {i18?.SETPRICE?.MAXNIGHT ||
                                        "Maximum Night"}
                                    </p>
                                  </div>
                                  <div
                                    className={`d-flex justify-content-between align-items-center`}
                                  >
                                    <button
                                      onClick={maxiDec}
                                      className={`${styles.add_btn}`}
                                    >
                                      -
                                    </button>
                                    {/* <p className="px-5 m-0">{maxi}</p> */}
                                    <div className={`${styles.availableCounttext} m-0`}>
                                      <input
                                        type="number"
                                        value={maxi}
                                        onChange={handleMaxiCount}
                                      />
                                    </div>
                                    <button
                                      onClick={maxiInc}
                                      className={`${styles.del_btn}`}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <hr />
                              </div>
                            )}
                          </div>
                        )}
                        {/* {hourlyChecking && hourlyChecking == "1" ? ( */}
                        <div
                          className={`d-flex justify-content-between align-items-center py-3`}
                        >
                          <div>
                            {" "}
                            <p>
                              {i18?.SETPRICE?.SETYOUHOURLYRATE ||
                                "Set you hourly rate"}{" "}
                              ({CurrencyList.currency})
                            </p>
                          </div>
                          <div className={`${styles.extrapricetext}`}>
                            <input
                              type="number"
                              value={extraPricePerHour}
                              onChange={handleExtraPerHourInputChange}
                            />
                          </div>
                        </div>
                        {/* ) : (
                          <></>
                        )} */}

                        {listings.pricings.additions === "1" && (
                          <div>
                            <div
                              className={`d-flex justify-content-between align-items-center py-3`}
                            >
                              <div>
                                <p className="m-0">
                                  {i18?.SETPRICE?.ADDEXTRAGUEST ||
                                    "Extra Guest after"}
                                </p>
                              </div>
                              <div
                                className={`d-flex justify-content-between align-items-center`}
                              >
                                <button
                                  onClick={extraDec}
                                  className={`${styles.add_btn}`}
                                >
                                  -
                                </button>
                                {/* <p className="px-5 m-0">{extraguest}</p> */}
                                <div className={`${styles.availableCounttext} m-0`}>
                                      <input
                                        type="number"
                                        value={extraguest}
                                        onChange={handleExtraGuestCount}
                                      />
                                    </div>
                                <button
                                  onClick={extraInc}
                                  className={`${styles.del_btn}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <hr />

                            <div
                              className={`d-flex justify-content-between align-items-center py-3`}
                            >
                              <div>
                                {" "}
                                <p>
                                  {i18?.SETPRICE?.EXTRAGUESTPRICE ||
                                    "Extra price per guest"}
                                </p>
                              </div>

                              <div className={`${styles.extrapricetext}`}>
                                <input
                                  type="number"
                                  value={extraprice}
                                  onChange={handleExtraInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* {hourlyChecking && hourlyChecking == "1" ? (
                          <div
                            className={`d-flex justify-content-between align-items-center py-3`}
                          >
                            <div>
                              {" "}
                              <p>
                                {i18?.SETPRICE?.EXTRAHOURPRICE ||
                                  "Extra price per hour"}
                              </p>
                            </div>
                            <div className={`${styles.extrapricetext}`}>
                              <input
                                type="number"
                                value={extraPricePerHour}
                                onChange={handleExtraPerHourInputChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <></>
                        )} */}
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeStep === 14 ? (
          <section className={`${styles.step16}`}>
            <div className={`${styles.checkbox} h-100 col-md-7 mt-3 checkbox`}>
              <h1>{i18?.REVIEWLIST?.TITLE || "Review your listing"}</h1>
              <p>
                {i18?.REVIEWLIST?.SUBTITLE ||
                  "Here's what we'll show to guests. Make sure everything looks good."}
              </p>
              <div className={`${styles.review_section} mb-3`}>
                <div className={`${styles.imageContainer}`}>
                  {imgFiles &&
                    imgFiles?.map((file: any, f: number) =>
                      f == 0 ? (
                        <img
                          key={f}
                          src={file.data}
                          alt="Image Alt Text"
                          className={`${styles.image}`}
                          onClick={handleOpenModal}
                          onError={handleImageError}
                        />
                      ) : null
                    )}
                  <div className={`${styles.bottom}`}>
                    <div className={`${styles.left}`}>
                      <p>{title}</p>
                      <p>
                        <b>
                          {CurrencyList.currency}
                          {price}
                        </b>
                        &nbsp; {i18?.REVIEWLIST?.NIGHT || "night"}
                      </p>
                    </div>
                    <div className={`${styles.right}`}>
                      <p>
                        {" "}
                        {i18?.REVIEWLIST?.NEW || "New"}{" "}
                        <StarIcon sx={{ wdith: "30px", height: "30px" }} />{" "}
                      </p>
                    </div>
                  </div>
                  <div onClick={handleOpenModal} className={`${styles.btn}`}>
                    <button style={{ color: "var(--text-color)" }}>
                      {i18?.REVIEWLIST?.SHOWPREVIEW || "Show Preview"}
                    </button>
                  </div>
                </div>
                <div className="mt-5 what-next">
                  <h4 className="mb-4">
                    {i18?.REVIEWLIST?.WHATNEXT || "What's next?"}
                  </h4>
                  <div className="d-flex">
                    <EventAvailableIcon className="me-3" />
                    <div className="">
                      <h6>
                        {i18?.REVIEWLIST?.CONFIRMDETAILS ||
                          "Confirm a few details and publish"}
                      </h6>
                      <p>
                        {i18?.REVIEWLIST?.PARA ||
                          "We’ll let you know if you need to verify your identity or register with the local government."}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <StickyNote2OutlinedIcon className="me-3" />
                    <div className="">
                      <h6>
                        {i18?.REVIEWLIST?.CONFIRMDETAILS ||
                          "Confirm a few details and publish"}
                      </h6>
                      <p>
                        {i18?.REVIEWLIST?.PARA ||
                          "We’ll let you know if you need to verify your identity or register with the local government."}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <EditOutlinedIcon className="me-3" />
                    <div className="">
                      <h6>
                        {i18?.REVIEWLIST?.CONFIRMDETAILS ||
                          "Confirm a few details and publish"}
                      </h6>
                      <p>
                        {i18?.REVIEWLIST?.PARA ||
                          "We’ll let you know if you need to verify your identity or register with the local government."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <div className={`${styles.getstarbtn}`}>
          <ThemeProvider theme={theme}>
            <div className="d-flex">
              <MobileStepper
                className="px-0"
                variant="progress"
                steps={8}
                position="static"
                activeStep={activeStep < 8 ? activeStep : 7}
                sx={{ flexGrow: 1 }}
                nextButton={
                  <Button hidden>{i18?.BUTTONS?.NEXT || "Next"}</Button>
                }
                backButton={
                  <Button hidden>{i18?.BUTTONS?.BACK || "Back"}</Button>
                }
              />

              <MobileStepper
                className="pe-0"
                variant="progress"
                steps={6}
                position="static"
                activeStep={activeStep < 12 ? activeStep - 7 : 5}
                sx={{ flexGrow: 1 }}
                nextButton={
                  <Button hidden>{i18?.BUTTONS?.NEXT || "Next"}</Button>
                }
                backButton={
                  <Button hidden>{i18?.BUTTONS?.BACK || "Back"} </Button>
                }
              />

              <MobileStepper
                className="pe-0"
                variant="progress"
                steps={3}
                position="static"
                activeStep={activeStep < 15 ? activeStep - 12 : 2}
                sx={{ flexGrow: 1 }}
                nextButton={
                  <Button hidden>{i18?.BUTTONS?.NEXT || "Next"}</Button>
                }
                backButton={
                  <Button hidden>{i18?.BUTTONS?.BACK || "Back"} </Button>
                }
              />
            </div>
            <div
              className={`${styles.barbtn} d-flex justify-content-between px-2 px-md-4 pb-2`}
            >
                <Button
                  disableRipple
                  className={`${styles.backbtn}`}
                  onClick={handleBack}
                  disabled={nextLoad} 
                >
                  {i18?.BUTTONS?.BACK || "Back"}
                </Button>

              <DynamicButtonComponent
                variant="outlined"
                className={`${!disable ? styles.nextbtn : styles.nextdisable}`}
                onClick={handleNext}
                disabled={disable || nextLoad}
                text={
                  mode === "edit"
                    ? i18?.ROOMPAGE?.SAVE || "Save"
                    : i18?.BUTTONS?.LOWERNEXT || "Next"
                }
                isSubmitting={nextLoad}
              />
            </div>
          </ThemeProvider>
        </div>
      </div>

      <CustomModal
        open={openModal}
        onClose={handleCloseModal}
        title={i18?.WISHLIAT?.FULLPREVIEW || "Full preview"}
      >
        <div className={`${styles.modal} p-3`}>
          <div className={`${styles.body}`}>
            <div className={`${styles.left}`}>
              {imgFiles &&
                imgFiles?.map((file: any, f: number) =>
                  f == 0 ? (
                    <img
                      key={f}
                      src={file.data}
                      alt="Image Alt Text"
                      className={`${styles.image}`}
                      onError={handleImageError}
                    />
                  ) : null
                )}
            </div>
            <div className={`${styles.right}`}>
              <div className={`${styles.content1}`}>
                <div className={`${styles.content}`}>
                  <h4>{userInfo?.firstname || ""}</h4>
                  <p>
                    {guests + child !== 0 && (
                      <span>
                        {guests + child} {i18?.ROOMPAGE?.GUEST || "guest"}&#183;
                      </span>
                    )}{" "}
                    {bedroom !== 0 && (
                      <span>
                        {bedroom} {i18?.ROOMPAGE?.BEDROOM || "bedroom"}
                      </span>
                    )}
                  </p>
                </div>
                <div className={`${styles.contentProfile}`}>
                  {userInfo?.profileImage && userInfo?.profileImage ? (
                    <ImageComponent
                      className={`${styles.Image}`}
                      width={50}
                      height={50}
                     src={ userInfo?.profileImage
                      }
                      alt="profile"
                      onError={handleImageError}
                    />
                  ) : (
                    <ImageComponent
                      className={`${styles.Image}`}
                      width={50}
                      height={50}
                      src={DefaultprofileImage}
                      alt="profile"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
              <div className={`${styles.content2}`}>
                <p>
                  {i18?.ROOMPAGE?.YOUWILLHAVEAGREAT ||
                    "You'll have a greate time at this comfortable palce to stay"}
                </p>
              </div>
              {/* <div>
                                <p>amenities</p>
                                {
                                    ListInfo.host_offer.slice(0 , displayCount).map((item: any) => {
                                        return (
                                            <p key={item._id} className="">
                                                {item.name}
                                            </p>
                                        )
                                    })
                                }
                                {ListInfo.host_offer > 5 && (
                                    showAll ? (
                                        <button onClick={() => showMore('less')}>Show less</button>
                                    ) : (
                                        <button onClick={() => showMore('more')}>Show more</button>
                                    )
                                )}
                            </div> */}
              <div className={`${styles.content4}`}>
                <div className={`${styles.title} checkbox`}>
                  <h6>{i18?.TRIPS?.LOCATION || "Location"}</h6>
                </div>
                <p>
                  {houseNo !== "" && <span>{houseNo},</span>}{" "}
                  {street !== "" && <span>{street},</span>}{" "}
                  {area !== "" && <span>{area},</span>}{" "}
                  {city !== "" && <span>{city},</span>} <span>{zipcode}</span>
                </p>
                <span>
                  {i18?.ROOMPAGE?.WEWILLSHAREYOURADDRESS ||
                    "we'll share your address only with guest who are booked as outlined in our Privacy policy"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
};
export default isAuth(Multiform);