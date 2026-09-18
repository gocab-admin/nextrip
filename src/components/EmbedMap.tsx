
import React, { useEffect, useState } from 'react';
import {GoogleMap,MarkerF,CircleF} from '@react-google-maps/api'
import { useSelector } from 'react-redux';

import useMapLoader from '@/hooks/useMapLoader';

import styles from './componentstyles.module.scss'

interface Props {
  onChangeAddress?: (arg: any) => void;
  onChange?: (arg: any) => void;
  icon?: string;
  value?: any;
  auto?: string;
  readOnly?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '50%',
  minHeight: '500px',
  borderRadius: '20px'
  // zIndex: -1
}

function Map({
  onChangeAddress: onChaneAddress, onChange, icon, value, auto, readOnly=false
}: Props) {
  
  const { isLoaded } = useMapLoader();
  const addLocation  = useSelector((state: any)=> state.detailsReducer.DetailsList );
  const listingLocation = useSelector((state: any) => state.detailsReducer.DetailsList.coordinate)
  // const listingLocation = useSelector((state: any) => state.latLngLocation)
  
  const [mapData, setMapData] = useState<any>({
    mapContainerStyle,
    center: {
      lat: listingLocation?.latitude || 9.933491,
      lng: listingLocation?.longitude || 78.127579
    }
  })
  
  useEffect(() => {
    if ((mapData.center &&
      mapData.center.lat !== value?.latitude && mapData.center.lng !== value?.longitude)
    ) {
      if (value?.latitude && value?.longitude) {
        setMapData({
          mapContainerStyle,
          center: {
            lat: value.latitude || listingLocation?.latitude,
            lng: value.longitude || listingLocation?.longitude 
          }
        })
      } else {
        alert('invalid latitude & longitude')
      }
    } else if (value.latitude && value.longitude) {
      setMapData({
        mapContainerStyle,
        center: {
          lat: value.latitude || listingLocation?.latitude,
          lng: value.longitude || listingLocation?.longitude 
        }
      })
    }

  }, [value])
  useEffect(() => {
    if (onChange && mapData.center) {
      onChange(mapData.center)
    }
  }, [mapData.center])


  const options = {
    strokeColor: '#686e7a',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#686e7a',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 550,
    zIndex: 1
  }
  
  const onLoadMarker = (markerpos: any) => {
    setMapData({
      mapContainerStyle,
      center: {
        lat: markerpos.latLng.lat(),
        lng: markerpos.latLng.lng()
      }
    })
  }


  return (
        <div className={`${styles.map_layouts}`}>
          { isLoaded && <GoogleMap
            mapContainerStyle={mapData.mapContainerStyle}
            center={{
              lat: value.latitude || mapData.center.lat,
              lng: value.longitude || mapData.center.lng
            }}
            zoom={15}
          > 
            <CircleF center={mapData.center} options={options} />
              <MarkerF
                draggable={!readOnly}
                onDragEnd={(e) => onLoadMarker(e)}
                // position={{ lat: userLat, lng: userLong }}
                position={mapData.center}
                icon={icon}
              />
          </GoogleMap>}
        </div>
  );
}

export default Map;
