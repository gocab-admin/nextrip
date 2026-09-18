"use client";

import React, { useEffect, useState } from "react";
import APICONSTANT from "@/services/config";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { postAPI } from "@/app/propertyform/formAPI";
import MaxGuestCount from "@/app/formpage/max-guest-count";

function PageComponent() {
  const { ListInfo } = useAppSelector(propertySelector);
  const { setNextDisable, actionRef, listId, setLoading, progressPercentage, pageData } =
    useFormContext();

  const { adult, children, pets, bedRoomCount, bathRoomCount } = ListInfo;
  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    // min 1 adult is required
    setNextDisable(adult > 0 ? false : true);
  }, [adult]);

  // next button action
  const handleSave = async () => {
    if (Number(adult) > 0) {
      if (formChanged) {
        let bedcount = 0;
        let bathcount = 0;
        if(pageData?.settings?.bedEnable) {
          bedcount = bedRoomCount;
        }
        if(pageData?.settings?.bathEnable) {
          bathcount = bathRoomCount;
        }
        setLoading(true);
        const data = {
          adult: Number(adult),
          children: 0,
          pets: 0,
          bedRoomCount: bedcount,
          bathRoomCount: bathcount,
          progressPercentage,
        };
        const res = await postAPI(
          `${APICONSTANT.basicdetails}/${listId}`,
          data
        );
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

  return (
    <MaxGuestCount
      setData={setData}
      setFormChanged={setFormChanged}
      adult={adult}
      children={children}
      pets={pets}
      bedRoomCount={bedRoomCount}
      bathRoomCount={bathRoomCount}
    />
  );
}

export default PageComponent;
