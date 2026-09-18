"use client";

import React, { useEffect, useState } from "react";
import APICONSTANT from "@/services/config";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import { useForm } from "react-hook-form";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { postAPI } from "@/app/propertyform/formAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmAddress from "@/app/formpage/confirm-location";

const schema = yup.object().shape({
  country: yup.string().required(),
  Address: yup.string().required(),
  landmark: yup.string(),
  city: yup.string().required(),
  zipcode: yup.string().required().max(10),
  state: yup.string().required(),
});

function PageComponent() {
  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector(propertySelector);
  const { setNextDisable, actionRef, listId, setLoading, progressPercentage } = useFormContext();

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
    area: "",
  });

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
        area: "",
      };
      setLocation(data);
    }
  }, [ListInfo]);

  const {
    getValues,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      country: '',
      Address: '',
      landmark: '',
      city: '',
      zipcode: '',
      state: ''
    },
    resolver: yupResolver(schema)
  });

  useEffect(()=>{
    if(ListInfo._id) {
      const data = {
        country: ListInfo.country,
        Address: ListInfo.address,
        landmark: ListInfo.landmark,  
        city: ListInfo.city,  
        zipcode: ListInfo.zipcode,  
        state: ListInfo.state,
      };
      reset(data)
    }
  }, [ListInfo])

  useEffect(() => {
    if (isValid) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [isValid]);

  // next button action
  const handleSave = async () => {
    if (isValid) {
      if(isDirty) {
      setLoading(true);
      const data = getValues();
      const res = await postAPI(`${APICONSTANT.basicdetails}/${listId}`, data);
      // hanlde mismatched fields
      const clonedData:any = {...data, progressPercentage };
      dispatch(setData(clonedData))
      clonedData.address = data.Address;
      delete clonedData.Address;
      return res;
      } else {
        return {status: 'true'} //form no change
      }
    }
  };
  // immeidate action
  actionRef.current = handleSave;
  useEffect(() => {
    actionRef.current = handleSave;
    return () => {
      actionRef.current = null;
    };
  }, []);

  return <ConfirmAddress control={control} errors={errors} location={location} setLocation={setLocation} setValue={setValue} />;
}

export default PageComponent;
