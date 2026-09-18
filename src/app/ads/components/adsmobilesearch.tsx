import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import dynamic from "next/dynamic";
import { Autocomplete } from "@react-google-maps/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

import {
  searchSelector,
  setFilterValues,
  updateAddress,
  updateProductName
} from "@/redux/slice/searchValue";
import { dispatch } from "@/redux/store";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { yellowTheme } from "@/components/colorVariable";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "@/components/searchbar.module.scss";

const TabPanel: any = dynamic(() => import("@mui/lab/TabPanel"), {
  ssr: false
});
const TabList: any = dynamic(() => import("@mui/lab/TabList"), { ssr: false });
const Drawer: any = dynamic(() => import("@mui/material/Drawer"));

const SearchBar = ({ isLoaded }: any) => {
  const { i18, responsiveView } = usePageContext();
  const searchParams: any = useSearchParams();
  const searchData = Object.fromEntries(searchParams);
  const params: any =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : {};
  const router = useRouter();
  const [state, setState] = React.useState(false);
  const [value, setValue] = useState("1");
  const [autocomplete, setautocomplete] = useState<any>(null);
  const [locationName, setLocationName] = useState("");
  const [productName, setProductName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const { propertyType } = useSelector(searchSelector);

  const propertySearch = propertyType;

  const handleDrawerClose = () => {
    // Add any additional logic you need before closing the drawer
    setState(false);
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

    if (locationName) {
      currentParams.set("location", locationName);
    }

    if (propertySearch) {
      currentParams.set("propertyType", propertySearch);
    }

    if (productName) {
      currentParams.set("name", productName);
    }

    window.history.replaceState(
      { path: `/?${currentParams}` },
      "",
      `/?${currentParams}`
    );
    dispatch(
      setFilterValues({
        address: {
          lat: lat,
          lng: lng,
          location: locationName
        },
        productName: productName
      })
    );
    setState(false);
  };

  const handleClearSearch = () => {
    router.replace("/");
    setState(false);
    setLat("");
    setLng("");
    setLocationName("");
    setProductName("")
    dispatch(
      setFilterValues({
        address: {
          lat: "",
          lng: "",
          location: ""
        },
        productName: ""
      })
    );
  };

  useEffect(() => {
    if (searchData.location) {
      setLocationName(searchData.location);
    }
    if (searchData.lat) {
      setLat(searchData.lat);
    }
    if (searchData.lng) {
      setLng(searchData.lng);
    }
    if (searchData.name) {
      setProductName(searchData.name);
    }
  }, []);

  return (
    <>
      <div className={`${styles.searchbar}`}>
        <div className={`${styles.inputField}`}>
          <button onClick={drawerOpen}>
            <div className={`${styles.content}`}>
              {responsiveView === "sm" || responsiveView === "xs" ? (
                <span className={`${styles.Searchsvg}`}>
                  <SearchIcon />
                </span>
              ) : (
                <div
                  className={`${styles.svg}`}
                  style={{
                    backgroundColor: yellowTheme.primaryColor,
                    color: yellowTheme.secondaryColor
                  }}
                >
                  <SearchIcon />
                </div>
              )}
              <div className={`${styles.placeholder}`}>
                {locationName ? (
                  <p
                    style={{
                      maxWidth: "130px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      color: "black"
                    }}
                    className="px-2"
                  >
                    {locationName}
                  </p>
                ) : (
                  <p className="text-black px-2">
                    {i18?.HEADER?.ANYWHERE || "Anywhere"}
                    {/* {"Where to?"} */}
                  </p>
                )}
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
                    label={i18?.HEADER?.STAYSs || "Ads"}
                    value="1"
                    style={{
                      color: value === "1" ? "var(--text-color)" : "inherit",
                      fontWeight: value === "1" ? "bold" : "normal"
                    }}
                  />
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
                              left: "10px"
                            }}
                            onClick={() => {
                              setLat("");
                              setLng("");
                              setLocationName("");
                              dispatch(
                                updateAddress({
                                  lat: "",
                                  lng: "",
                                  location: ""
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
                <div className={`${styles.input}`}>
                  <h4>{i18?.HEADER?.PRODUCTS || "Products"}</h4>
                  <div className="d-flex">
                    <input
                      value={productName}
                      type="text"
                      className={`${styles.inputContainer}`}
                      placeholder={i18?.HEADER?.PRODUCTS || "Products"}
                      onChange={(e: any) => setProductName(e.target.value)}
                    />
                    {productName && (
                      <button
                        style={{
                          border: "1px solid transparent",
                          backgroundColor: "transparent",
                          position: "relative",
                          bottom: "10px",
                          left: "10px"
                        }}
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
                        <CloseIcon sx={{ fontSize: 18, color: "black" }} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </TabPanel>
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
