import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  CircleF,
  Autocomplete
} from "@react-google-maps/api";

import {
  addLocation,
  setCoordinate,
  setShouldFetchLocation,
  detailSelector
} from "@/redux/slice/detailSlice";
import { useAppDispatch } from "@/redux/hooks";
import useMapLoader from "@/hooks/useMapLoader";
import { RootState } from "@/redux/store";
// import {
//   addCity,
//   addCountry,
//   addCounty,
//   addZipcode,
//   flatNo,
//   addsStreet,
//   resetStep4Data
// } from "@/redux/slice/listingSlice";
// import {
//   latLngLocationSelector /* , setCoordinates */
// } from "@/redux/slice/mapDataSlice";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./componentstyles.module.scss";

interface Props {
  onChangeAddress?: (arg: any) => void;
  onChange?: (arg: any) => void;
  icon?: string;
  value?: any;
  auto?: string;
  readOnly?: boolean;
  location?: string
  shouldFetchLocation?: boolean
}

const mapContainerStyle = {
  width: "100%",
  height: "50%",
  minHeight: "500px",
  borderRadius: "20px"
};

const libraries: any = ["places"];

function Map({
  onChangeAddress: onChaneAddress,
  onChange,
  icon,
  value,
  auto,
  location = '',
  shouldFetchLocation = false,
  readOnly = false
}: Props) {

  const { settings } = usePageContext();
  const { google } = settings;
  const APIKEY = google?.mapApiKey;
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [zoomLevel, setZoomLevel] = useState(15);
  // const { shouldFetchLocation } = useSelector(detailSelector);
  const [currentLat, setCurrentLat] = useState<any>();
  const [currentLong, setCurrentLong] = useState<any>();
  const [autocomplete, setautocomplete] = useState<any>(null);
  const [mapData, setMapData] = useState<any>({
    mapContainerStyle,
    center: position
  });
  // const [userLat, setUserLat] = useState();
  // const [userLong, setUserLong] = useState();
  // const [locationName, setLocationName] = useState(value?.locationName);

  const fetchAddress = async (latitude: any, longitude: any) => {
    try {
      const response = await fetch(
        // `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${APIKEY}`
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (
        (data.status === "OK" && data.results.length > 0) ||
        response?.status == 200
      ) {
        setCurrentLat(data?.lat);
        setCurrentLong(data?.lon);

        // dispatch(addLocation(data?.display_name));
        // dispatch(
        //   setCoordinate({
        //     latitude: parseFloat(data?.lat),
        //     longitude: parseFloat(data?.lon)
        //   })
        // );
        // dispatch(setCoordinates({
        //   latitude: data?.lat,
        //   longitude: data?.lon
        // }));
        const splitedData = data?.address;
        setZoomLevel(15);
        // dispatch(addLocation(splitedData));

        // setPosition({
        //   lat: data?.lat,
        //   lng: data?.lon
        // });
        // setMapData({
        //   mapContainerStyle,
        //   center: {
        //     lat: data?.lat,
        //     lng: data?.lon
        //   }
        // });

        // dispatch(addCity(splitedData?.city));
        // // dispatch(addArea(area))
        // dispatch(addZipcode(splitedData?.postcode));
        // dispatch(addCounty(splitedData?.state));
        // dispatch(addCountry(splitedData?.country));
        // dispatch(flatNo(splitedData ? splitedData.flatNumber : null));
        // dispatch(addsStreet(splitedData?.road));

        if (onChange) {
          onChange({
            location: data?.display_name,
            city: splitedData?.city,
            state: splitedData?.state,
            country: splitedData?.country,
            zipcode: splitedData?.postcode,
            houseNo: splitedData ? splitedData.flatNumber : null,
            address: splitedData?.road,
            lat: parseFloat(data?.lat),
            lng: parseFloat(data?.lon),
            nearlandmark: '',
            area: ''
          });
        }

      } else {
        console.error("Geocoding API error:", data.status);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          // shouldFetchLocation make true
          // dispatch(setShouldFetchLocation(true));
          const { latitude, longitude } = position.coords;
          setPosition({
            lat: latitude,
            lng: longitude
          });
          setMapData({
            mapContainerStyle,
            center: {
              lat: latitude || currentLat,
              lng: longitude || currentLong
            }
          });
          setZoomLevel(15);
          // onPlaceChanged();
          fetchAddress(latitude, longitude);
        });
      } else {
        console.log("Geolocation is not available in your browser.");
      }
    };
    // console.log('====================================');
    // console.log(value.latitude);
    // console.log('====================================');

    if (shouldFetchLocation) {
      getCurrentLocation();
    }
  }, [mapContainerStyle, APIKEY, shouldFetchLocation]);

  // useEffect(() => {
  //   if (value?.locationName) {
  //     setLocationName(value.locationName);
  //   }
  // }, [value]);

  useEffect(() => {
    if (
      mapData.center &&
      mapData.center.lat !== value?.latitude &&
      mapData.center.lng !== value?.longitude
    ) {
      if (value?.latitude && value?.longitude) {
        setPosition({
          lat: value.latitude,
          lng: value.longitude
        });
        setMapData({
          mapContainerStyle,
          center: {
            lat: value.latitude,
            lng: value.longitude
          }
        });
      } else {
        alert("invalid latitude & longitude");
      }
    } else if (value.latitude && value.longitude) {
      setPosition({
        lat: value.latitude,
        lng: value.longitude
      });
      setMapData({
        mapContainerStyle,
        center: {
          lat: value.latitude || currentLat,
          lng: value.longitude || currentLong
        }
      });
      // setUserLat(value.latitude);
      // setUserLong(value.longitude);
    }
  }, [value]);

  // useEffect(() => {
  //   if (onChange && mapData.center) {
  //     onChange(mapData.center)
  //   }
  // }, [mapData.center])

  const onLoad = (autocomplete: any) => {
    setautocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    // shouldFetchLocation false
    // dispatch(setShouldFetchLocation(false));
    // dispatch(resetStep4Data());
    if (autocomplete !== null && autocomplete.getPlace) {
      const placeDetail = autocomplete.getPlace();
      const lat = placeDetail.geometry?.location.lat();
      const lng = placeDetail.geometry?.location.lng();
      const pat1 = /^\d{6}$/;
      const selectedPlace = placeDetail.formatted_address;
      // setLocationName(selectedPlace);
      // setAddress(selectedPlace);
      // dispatch(addLocation(selectedPlace));
      const splitedData = selectedPlace.split(",");

      const datas: { [key: string]: string[] } = {};
      const addressComponents = placeDetail.address_components;
      for (let i = 0; i < addressComponents.length; ++i) {
        const item = addressComponents[i];
        for (let j = 0; j < item.types.length; ++j) {
          const type = item.types[j];
          //assign existing data or empty array initialize
          datas[type] = datas[type] || [];
          datas[type].push(item.long_name);
        }
      }
      let getAddress = placeDetail.formatted_address
        .split(",")
        .join("-")
        .split("-");

      const numbers = getAddress[3]?.match(/\d+/g);

      // Join the numbers to form a single string
      const combinedNumber = numbers?.slice(1).join("");

      // Check if the combined number's length is greater than or equal to 6 (pincode length)
      const getpincode = combinedNumber?.length >= 6 ? combinedNumber : null;

      // let area = datas.sublocality_level_1?.[0] || datas.locality?.[0]
      // let city = datas.administrative_area_level_2?.[0] || datas.administrative_area_level_3?.[0]  || getAddress[2] || getAddress[4]
      // let state = datas.administrative_area_level_1?.[0]
      // let pincode = datas.postal_code?.[0] || getpincode
      // let country = datas.country?.[0]
      // let flatNumber = datas.street_number?.[0] || datas.premise?.[0] || getAddress[0]
      // let streetAddress = datas.route?.[0] || datas.premise?.[1] || getAddress[1]
      // let nearbyLandmark = datas.sublocality_level_2?.[0]  || datas.locality?.

      // let area = datas.sublocality_level_1?.[0]  || datas.administrative_area_level_2?.[0]
      let city =
        /* datas.administrative_area_level_3?.[0]  || */ datas.locality?.[0];
      let state = datas.administrative_area_level_1?.[0];
      let pincode = datas.postal_code?.[0] || getpincode;
      let country = datas.country?.[0];
      let flatNumber = datas.street_number?.[0] || datas.premise?.[0];
      let streetAddress = datas.route?.[0] || datas.premise?.[1];
      // let nearbyLandmark = datas.sublocality_level_2?.[0]  || datas.locality?.[0]

      if (splitedData.length === 1) {
        state = placeDetail.formatted_address;
        city = placeDetail.formatted_address;
        state = placeDetail.formatted_address;
      }
      // dispatch(setAddress({ Area: area[0], City: city, State: state, Pincode: pincode, Country: country}))
      // dispatch(addCity(city));
      // dispatch(addZipcode(pincode));
      // dispatch(addCounty(state));
      // dispatch(addCountry(country));
      // dispatch(flatNo(flatNumber));
      // dispatch(addsStreet(streetAddress));
      // dispatch(nearlandmark(nearbyLandmark))

      // setUserLat(lat);
      // setUserLong(lng);
      // dispatch(setCoordinate({ latitude: lat, longitude: lng }));
      if (onChange) {
        onChange({
          location: selectedPlace,
          city: city,
          state: state,
          country: country,
          zipcode: pincode,
          houseNo: flatNumber,
          address: streetAddress,
          lat,
          lng,
          // reset remaining data
          nearlandmark: '',
          area: ''

        });
      }
      if (onChaneAddress) {
        onChaneAddress({
          city,
          state,
          country,
          selectedPlace,
          flatNumber,
          streetAddress,
          // nearbyLandmark,
          zipcode: pincode
        });
      }
      // dispatch(setShouldFetchLocation(false));
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const options = {
    strokeColor: "#686e7a",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#686e7a",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 550,
    zIndex: 1
  };

  const onLoadMarker = async (markerpos: any) => {
    // setUserLat(markerpos.latLng.lat());
    // setUserLong(markerpos.latLng.lng());
    // setUserLat(position.latitude)
    // setUserLong(position.longitude)
    const lat = markerpos.latLng.lat();
    const lng = markerpos.latLng.lng();

    setPosition({ lat, lng });
    setMapData({
      mapContainerStyle,
      center: { lat, lng }
    });
    await fetchAddress(lat, lng);
  };
  const { isLoaded } = useMapLoader();
  return (
    <div>
      {isLoaded && (
        <div className={`${styles.map_layouts}`}>
          {!auto && (
            // @ts-ignore
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              options={{}}
            >
              <div className={`${styles.map}`}>
                <div className="inputWrapper">
                  <input
                    id="funkystyling"
                    type="text"
                    disabled={autocomplete === null}
                    placeholder="Enter your location"
                    className="autocompleteInputStyle"
                    value={location}
                    // value={value.locationName? value.location : address}
                    onChange={(e) => {
                      if (onChaneAddress) onChaneAddress(e.target.value);
                      dispatch(addLocation(e.target.value));
                      // setAddress(e.target.value);
                    }}
                  />
                  {/* <CurrentLocation className="currentLocationIcon" 
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '27%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '20px',
                    zIndex: 2,
                  }} 
                  onClick={handleInputClick}
                   />
                   <MyLocation/> */}
                </div>
              </div>
            </Autocomplete>
          )}
          {
            settings?.hiddenSettings?.map === "1" && (
              <GoogleMap
                mapContainerStyle={mapData.mapContainerStyle}
                center={{
                  lat: value.latitude || mapData.center.lat,
                  lng: value.longitude || mapData.center.lng
                }}
                zoom={zoomLevel}
              >
                <CircleF center={{
                  lat: value.latitude || mapData.center.lat,
                  lng: value.longitude || mapData.center.lng
                }} options={options} />
                <MarkerF
                  draggable={!readOnly}
                  onDragEnd={(e) => onLoadMarker(e)}
                  position={{
                    lat: value.latitude || mapData.center.lat,
                    lng: value.longitude || mapData.center.lng
                  }}
                  icon={icon}
                />
              </GoogleMap>
            )
          }

          {/* </div> */}
        </div>
      )}
    </div>
  );
}

export default Map;
