import { useEffect, useRef, useState } from "react";
import styles from "@/components/componentheaderstyles.module.scss";

import { SearchIcon } from "@/app/global/svg";
import { SearchIcons } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import { BiSearch } from "react-icons/bi";
import { yellowTheme } from "@/components/colorVariable";
import { dispatch } from "@/redux/store";
import {
  setFilterValues,
  searchSelector,
  updateAddress,
  updateProductName
} from "@/redux/slice/searchValue";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { Autocomplete } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import { mergeQueryParams } from "@/components/helper";
import SearchBar from "@/app/ads/components/adsmobilesearch";
import DynamicButtonComponent from "@/components/DynamicComponent/AdsDynamicButton";
import SearchDropDown from "./SearchDropDown";
import { getApiMethod } from "@/services/global";
import { fetchSubCategories, updateCategoryList } from "@/redux/slice/categoriesSlice";
import { CategoryName } from "@/services/utils/helperURL";

const SearchComponent = (props: any) => {
  const router = useRouter();
  const header_ref: any = useRef();
  const searchParams: any = useSearchParams();
  const searchData = Object.fromEntries(searchParams);

  const { i18, settings } = usePageContext();
  const { hiddenSettings } = settings;
  const [showMe, setShowMe] = useState(true);
  const [autocomplete, setautocomplete] = useState<any>(null);
  const [locationName, setLocationName] = useState("");
  const [productName, setProductName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [checkinActive, setCheckinActive] = useState(false);
  const [changeStyle, setChangeStyle] = useState("searchWhere");
  const [search, setSearch] = useState(false);
  const [navAnchorEl, setNavAnchorEl] = useState<null | HTMLElement>(null);
  const navOpen = Boolean(navAnchorEl);
  const [isLoading, setIsLoading] = useState(false)
  const [productFocused, setProductFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [suggestionList, setSuggestionList] = useState([]);

  const params: any =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : {};

  const toggle = () => {
    setShowMe(!showMe);
  };

  const toggleguest = () => {
    setSearch(false);
    setChangeStyle("Guest");
  };

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

  // const onPlaceChanged = () => {
  //   if (autocomplete !== null && autocomplete.getPlace) {
  //     const placeDetail = autocomplete.getPlace();
  //     const lat = placeDetail.geometry?.location.lat();
  //     const lng = placeDetail.geometry?.location.lng();
  //     setLat(lat);
  //     setLng(lng);
  //     const pat1 = /^\d{6}$/;
  //     const selectedPlace = placeDetail.formatted_address;
  //     setLocationName(selectedPlace);
  //   }
  // };

  const onPlaceChanged = () => {
    if (autocomplete !== null && autocomplete.getPlace) {
      const placeDetail = autocomplete.getPlace();
      const lat = placeDetail.geometry?.location.lat();
      const lng = placeDetail.geometry?.location.lng();
      const selectedPlace = placeDetail.formatted_address;

      setLat(lat);
      setLng(lng);
      setLocationName(selectedPlace);

      // Automatically trigger the search when a location is selected
      handleSearch({ lat, lng, location: selectedPlace });
    }
  };

  const handleNavClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setNavAnchorEl(event.currentTarget);
    setSearch(!search);
  };

  const { address, propertyType } = useSelector(searchSelector);
  const propertySearch = propertyType;

  // const handleSearch = () => {
  //   const newParams: any = {}; // Collect new query parameters

  //   if (lat && lng) {
  //     newParams.lat = lat;
  //     newParams.lng = lng;
  //   }

  //   if (locationName) {
  //     newParams.location = locationName;
  //   }

  //   if (productName) {
  //     newParams.name = productName;
  //   }

  //   // Use mergeQueryParams to merge newParams with existing URL query params
  //   mergeQueryParams(newParams);

  //   // Additional logic for updating state
  //   setShowMe(false);

  //   dispatch(
  //     setFilterValues({
  //       address: { ...address, lat: lat || "", lng: lng || "" },
  //       productName: productName
  //     })
  //   );
  // };

  const handleSearch = (searchParams?: { lat: number; lng: number; location: string }) => {
    const newParams: any = {};

    if (searchParams) {
      newParams.lat = searchParams.lat;
      newParams.lng = searchParams.lng;
      newParams.location = searchParams.location;
    } else {
      if (lat && lng) {
        newParams.lat = lat;
        newParams.lng = lng;
      }
      if (locationName) {
        newParams.location = locationName;
      }
      if (productName) {
        newParams.name = productName;
      }
    }

    mergeQueryParams(newParams);

    dispatch(
      setFilterValues({
        address: { ...address, lat: searchParams?.lat || "", lng: searchParams?.lng || "" },
        productName
      })
    );
  };

  useEffect(() => {
    if (searchData.location) {
      setLocationName(searchData.location);
    }
    if (searchData.name) {
      setProductName(searchData.name);
    }
  }, [searchParams]);

  const popularCategories = [
    {
      "key": "category",
      "value": "Cars",
      "id": "676cf0e656233ed79aefde36"
    },
    {
      "key": "category",
      "value": "Mobiles",
      "id": "676cef9a56233ed79aefddff"
    },
    {
      "key": "category",
      "value": "Fashions",
      "id": "676cf5a356233ed79aefdf1d"
    }
  ]


  const fetchData = async () => {
    if (productName) {
      setIsLoading(true)
      const suggestionUrl = `ads/suggestions?search=${productName}`
      try {
        const response = await getApiMethod(suggestionUrl);
        if (response?.statusCode === 200) {
          setSuggestionList(response?.data?.suggestions);
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }
  }

  useEffect(() => {
    if (productName) {
      fetchData();
    }
  }, [productName])

  const handleInputFocus = () => {
    setProductFocused(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      (dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)) ||
      (inputRef.current && inputRef.current.contains(event.target as Node))
    ) {
      // Ignore clicks inside the input or dropdown
      return;
    }
    setProductFocused(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionList = async (suggestion: any) => {
    debugger
    // const suggestionUrl = `ads/detail?${suggestion?.key}=${suggestion?.id}`;
    // const id = suggestion?.id;

    try {
      if (suggestion?.key === "category") {
        dispatch(
          updateCategoryList({
            categoryId: suggestion?.id,
            categoryName: suggestion?.value
          })
        );
        dispatch(
          setFilterValues({
            propertyCategory: suggestion.id
          })
        );
        window.history.replaceState(
          {},
          "",
          `/ads/${CategoryName(suggestion.value)}`
        );
      } else if (suggestion?.key === "subcategory" || suggestion?.key === "product") {
        dispatch(
          setFilterValues({
            productName: suggestion?.value,
            propertyType: suggestion?.id,
            propertyCategory: suggestion.catid
          })
        );
      }
      setProductFocused(false);
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
  };

  return (
    <div className="d-flex gap-3 align-items-center" style={{ flexGrow: 1 }} >
      <div style={{ position: "relative", flexGrow: 1 }}>
        <div className="d-flex" style={{ border: !productFocused ? '1px solid #f7f7f7' : '2px solid #000', background: !productFocused ? "#f7f7f7" : 'transparent', borderRadius: !productFocused ? "8px" : "8px 8px 0px 0px", paddingLeft: "10px", position: "relative" }}>
          <SearchIcon
            style={{
              marginRight: "0px",
              width: "18px",
              height: "auto",
            }}
          />
          <input
            ref={inputRef}
            style={{
              background: !productFocused ? "#f7f7f7" : "transparent",
              padding: "6px 12px",
              border: "2px solid transparent",
              borderRadius: "8px",
              outline: "none",
              width: "100%",
              fontSize: "14px"
            }}
            value={productName}
            type="text"
            placeholder="Car, phone, bike and more..."
            onFocus={handleInputFocus}
            onChange={(e: any) => setProductName(e.target.value)}
          />
        </div>

        {/* {productFocused && <SearchDropDown popularCategories={popularCategories} productName={productName} suggestionList={suggestionList}/>} */}
        {productFocused && (
          <SearchDropDown ref={dropdownRef} isLoading={isLoading} popularCategories={popularCategories} productName={productName} suggestionList={suggestionList} handleSuggestionList={handleSuggestionList} />
        )}
        {productName && (
          <div
            onClick={() => {
              setProductName("");
              dispatch(updateProductName(""));
              params.delete("name");
              window.history.replaceState(
                { path: params.toString() },
                "",
                `?${params.toString()}`
              );
            }}
          >
            <CloseIcon
              sx={{
                fontSize: 15,
                position: "absolute",
                top: "15px",
                right: "10px"
              }}
            />
          </div>
        )}
      </div>
      {props.isLoaded && (
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{}}
        >
          <div className="d-flex position-relative">
            <input
              style={{
                background: "transparent",
                padding: "8px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "30px",
                outline: "none",
                fontSize: "13px",
                boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, .1)",
              }}
              value={locationName}
              type="text"
              className={`${styles.searchinput}`}
              placeholder={
                i18?.HEADER?.SEARCHDESTINATIONS || "Search Destination"
              }
              id="searchwhere-field"
              onChange={(e: any) => setLocationName(e.target.value)}
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
                  <CloseIcon
                    sx={{
                      fontSize: 15,
                      position: "absolute",
                      top: "10px",
                      right: "5px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      borderRadius: "50%",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)"
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </Autocomplete>
      )}
      {/* <div className={`${styles.add_guests}`}>
        <DynamicButtonComponent
          variant="contained"
          text=""
          fontSize="var(--homepage-header-size)"
          startIcon={
            <SearchIcon
              style={{
                marginRight: "0px",
                width: "24px",
                height: "auto",
                marginLeft: "10px"
              }}
            />
          }
          hover="#FFD700"
          onClick={handleSearch}
        />
      </div> */}
    </div>
  );
};
export default SearchComponent;
