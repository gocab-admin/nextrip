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
import { dispatch } from "@/redux/store";
import { setSelectedMarkerRedux } from "@/redux/slice/detailSlice";
import { MapProduct } from "./wishlistMapProduct";
import { HeartIcon } from "../../app/global/svg";

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
        strictBounds: true
    },
    zoomControl: true
};

const MapComponent = () => {
    const { currency, settings } = usePageContext();
    const { getWishlistData } = useSelector((state: any) => state.cmsSlice)
    const { site } = settings;
    const [selectedList, setSelectedList] = useState(false);
    const [map, setMap] = useState();
    const [mapData, setMapData] = useState({
        mapContainerStyle: {
            width: "100%",
            height: "100%",
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

    const markers = useMemo(() => {
        // debugger;
        return getWishlistData?.map((item: any) => ({
            _id: item._id,
            lat: item?.address?.coordinates[0],
            lng: item?.address?.coordinates[1],
            propertyName: item?.propertyName,
            price:
                Math.round(
                    item?.price?.perDay * currency.exchange_rate
                ).toLocaleString("en-IN") || "0",
            data: item
        }));
    }, [getWishlistData])

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
                                    <HeartIcon fill="red"
                                        width="15px"
                                        height="15px"
                                        // style={{
                                        //     fontSize: "20px",
                                        //     margin: "1px",
                                        //     marginBottom: "2px",
                                        //     marginRight: "2px",
                                        //     strokeWidth: 2
                                        // }}
                                        color="var(--search-button-color)"
                                        stroke="var(--btn-color)"
                                        strokeWidth={2}
                                    />
                                </p>

                            </StyledDiv>
                        </OverlayViewF>
                    )
                })}
                {selectedMarker && window.google && (
                    <InfoWindow
                        position={{
                            lat: selectedMarker?.lat,
                            lng: selectedMarker?.lng
                        }}
                        options={{ pixelOffset: new window.google.maps.Size(0, -15) }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="mapView">
                            <MapProduct setSelectedMarker={setSelectedMarker} />
                        </div>
                    </InfoWindow>
                )}

            </DynamicMapComponent>
        </>
    );
};

export default MapComponent;
