"use client";

import React, { useEffect, useState } from "react";
import APICONSTANT from "@/services/config";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { postAPI } from "@/app/propertyform/formAPI";
import SelectLocation from "@/app/formpage/select-location";
function PageComponent() {
  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector(propertySelector);
  const [formChanged, setFormChanged] = useState(false);
  const { setNextDisable, actionRef, setLoading, listId, progressPercentage } =
    useFormContext();

  const [location, setLocation] = useState({
    _id: "",
    lat: "",
    lng: "",
    location: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    houseNo: "",
    address: "",
    nearlandmark: "",
    area: ""
  });
  
console.log('====================================');
console.log(ListInfo);
console.log('====================================');
  useEffect(() => {
    if (ListInfo._id) {
      const data = {
        _id: ListInfo._id,
        lat: ListInfo.lat,
        lng: ListInfo.lng,
        location: ListInfo.location,
        city: ListInfo.city,
        state: ListInfo.state,
        country: ListInfo.country,
        zipcode: ListInfo.zipcode,
        houseNo: ListInfo.houseNo,
        address: ListInfo.address,
        nearlandmark: "",
        area: ""
      };
      setLocation(data);
    }
  }, [ListInfo]);

  // next button action
  const handleSave = async () => {
    if (location.lat && location.lng) {
      if (formChanged) {
        setLoading(true);
        const data:any = {
          lat: location.lat,
          lng: location.lng,
          location: location.location,
          city: location.city,
          state: location.state,
          country: location.country,
          zipcode: location.zipcode,
          houseNo: location.houseNo,
          Address: location.address,
          nearlandmark: "",
          area: "",
          progressPercentage
        };
        const res = await postAPI(
          `${APICONSTANT.basicdetails}/${listId}`,
          data
        );
        data.address = data.Address;
        delete data.Address;
        dispatch(setData(data));
        return res;
      } else {
        return { status: true, nochange: true }; // no form change
      }
    }
  };
  actionRef.current = handleSave;
  useEffect(() => {
    actionRef.current = handleSave;
    return () => {
      actionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (location.lat && location.lng) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [location]);

  return (
    <SelectLocation
      setFormChanged={setFormChanged}
      value={location}
      onChange={setLocation}
    />
  );
}

export default PageComponent;
