import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { styled } from "@mui/material";
import {
  InfoWindow,
  OverlayView,
  OverlayViewF
} from "@react-google-maps/api";

import { usePageContext } from "@/components/Providers/PageContext";
import { searchSelector } from "@/redux/slice/searchValue";
import { categorySelector } from "@/redux/slice/categoriesSlice";
import { MapProduct } from "../mapProduct";
import { dispatch } from "@/redux/store";
import { setSelectedMarkerRedux } from "@/redux/slice/detailSlice";
import { HeartIcon } from "../../app/global/svg";
import { fetchApprovedListingData } from "@/redux/approvedListSlice";

export const StyledDiv = styled("div")(({ }) => ({
  background: "#FFFFFF",
  display: "inline-block",
  color: "#222222",
  border: "none",
  height: "28px",
  fontSize: "14px",
  paddingLeft: "8px",
  paddingRight: "8px",
  borderRadius: "28px",
  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    scale: "1.05"
  }
}));

const DynamicMapComponent: any = dynamic(() =>
  import("@react-google-maps/api").then((mod) => mod.GoogleMap)
);

const options = {
  restriction: {
    latLngBounds: {
      north: 85.0,
      south: -85.0,
      east: 180.0,
      west: -180.0
    },
    strictBounds: true // If true, the map will not allow panning outside of the defined bounds.
  },
  zoomControl: true
};

const MapComponent = () => {
  const { currency, settings } = usePageContext();
  const [selectedList, setSelectedList] = useState(false);
  const listData = useSelector(
    (state: any) => state.approvedlist.listData.approvedListing
  );
  const { getApprovedData } = useSelector((state: any) => state.approvedlist)
  const { site } = settings;
  const [map, setMap] = useState();
  const [mapData, setMapData] = useState({
    mapContainerStyle: {
      width: "100%",
      height: "100%",
      minHeight: "550px"
    },
    center: {
      lat: Number(site.mapCoordinates.lat) /* 9.9252 */,
      lng: Number(site.mapCoordinates.lng) /* 78.1198 */
    },
    markers: []
  });
  const handleLoad = (obj: any) => {
    setMap(obj);
  };
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const {
    accomendation,
    priceData,
    propertyType,
    amenities,
    instantbooking
  } = useSelector(searchSelector);

  const property = propertyType;
  const maxprice = priceData.maxPrice;
  const minprice = priceData.minPrice;
  const bedroom = accomendation.bedRoom;
  const bathroom = accomendation.bathRoom;
  const { categoryId } = useSelector(categorySelector);

  const markers = useMemo(() => {
    // debugger;
    return listData?.map((item: any) => ({
      _id: item._id,
      lat: item?.address?.coordinates[0],
      lng: item?.address?.coordinates[1],
      propertyName: item?.propertyName,
      price:
        Math.round(
          item?.priceData?.pricing?.perDay * currency.exchange_rate
        ).toLocaleString("en-IN") || "0",
      data: item
    }));
  }, [listData])

  // const getapi = async () => {
  //   const responseData = listData;
  //   if (responseData) {
  //     setMapData((prevState) => ({
  //       ...prevState,
  //       markers: responseData?.map((item: any) => ({
  //         _id: item._id,
  //         lat: item?.address?.coordinates[0],
  //         lng: item?.address?.coordinates[1],
  //         propertyName: item?.propertyName,
  //         price:
  //           Math.round(
  //             item?.priceData?.pricing?.perDay * currency.exchange_rate
  //           ).toLocaleString("en-IN") || "0",
  //         data: item
  //       }))
  //     }));
  //   }
  // };

  // useEffect(() => {
  //   getapi();
  // }, [
  //   categoryId,
  //   property,
  //   minprice,
  //   maxprice,
  //   bathroom,
  //   bedroom,
  //   instantbooking,
  //   amenities
  // ]);

  useEffect(() => {
    dispatch(fetchApprovedListingData(getApprovedData, 1, 25, ""))
  }, [selectedList])

  return (
    <>
      <DynamicMapComponent
        mapContainerStyle={mapData.mapContainerStyle}
        center={mapData.center}
        zoom={2.8}
        options={options}
        onLoad={handleLoad}
      >
        {Array.isArray(markers) && markers.map((land: any, i: any) => {
          return (
            // @ts-ignore
            <OverlayViewF
              key={`marker${i}`}
              position={{
                lat: land.lat,
                lng: land.lng
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -height / 2
              })}
            >
              <StyledDiv
                onClick={() => {
                  setSelectedMarker(land);
                  dispatch(setSelectedMarkerRedux(land))
                }}
              >
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    margin: 0,
                    height: "100%",
                    fontWeight: "bold",
                  }}
                >
                  {currency.symbol}
                  {land.price}
                  {land?.data?.wishlist && 
                    <HeartIcon fill="red"
                      width="15px"
                      height="15px"
                      style={{
                        fontSize: "20px",
                        margin: "1px",
                        marginBottom: "2px",
                        marginRight: "2px",
                        fill: land?.data?.wishlist
                          ? "var(--search-button-color)"
                          : "none",
                        strokeWidth: 2
                      }}
                    />
                  }
                </p>
              </StyledDiv>
            </OverlayViewF>
          )
        })}
        {selectedMarker && (
          <>
            {/* @ts-ignore */}
            <InfoWindow
              position={{
                lat: selectedMarker?.lat,
                lng: selectedMarker?.lng
              }}
              // to place inco window top position
              options={{ pixelOffset: new window.google.maps.Size(0, -15) }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="mapView">
                <MapProduct setSelectedList={setSelectedList}/>
              </div>
            </InfoWindow>
          </>
        )}
      </DynamicMapComponent>
    </>
  );
};

export default MapComponent;
