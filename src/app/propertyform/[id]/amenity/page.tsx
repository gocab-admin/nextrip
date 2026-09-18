"use client";

import React, { useEffect, useState } from "react";
import APICONSTANT from "@/services/config";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import {
  setData,
  placeOffer,
  propertySelector,
} from "@/redux/slice/propertySlice";
import { getApiMethod } from "@/services/global";
import { useFormContext } from "@/app/propertyform/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import Amenity from "@/app/formpage/amenity";

function PageComponent() {
  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector(propertySelector);
  const {
    setNextDisable,
    mode,
    actionRef,
    listId,
    setLoading,
    progressPercentage,
  } = useFormContext();
  const [checkboxdatastep, setCheckboxdatastep] = useState<any>();
  const [formChanged, setFormChanged] = useState(false);

  const { amenities } = ListInfo;

  useEffect(() => {
    if (Array.isArray(amenities) && amenities?.length > 0) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [amenities]);

  const onChange = (e: any) => {
    const value = e.target.value;
    if (amenities.includes(value)) {
      const newArray = [...amenities];
      const findIndex = newArray.indexOf(value);
      newArray.splice(findIndex, 1);
      dispatch(setData({ amenities: newArray }));
    } else {
      dispatch(placeOffer(value));
    }
    setFormChanged(true);
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
    getamenityapi(APICONSTANT.placesOffer);
  }, [mode]);

  // next button action
  const handleSave = async () => {
    if (amenities.length > 0) {
      if (formChanged) {
        setLoading(true);
        const data = {
          amenityId: amenities,
          progressPercentage,
        };
        const res = await postAPI(`${APICONSTANT.placesOffer}/${listId}`, data);
        return res;
      } else {
        return { status: true, nochange: true }; // form no change
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

  return (
    <Amenity value={amenities} onChange={onChange} data={checkboxdatastep} />
  );
}

export default PageComponent;
