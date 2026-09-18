"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import APICONSTANT from "@/services/config";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { postAPI } from "@/app/propertyform/formAPI";
import GuestPrice from "@/app/formpage/guest-price";

function PageComponent() {
  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector<any>(propertySelector);
  const { setNextDisable, listId, actionRef, progressPercentage } =
    useFormContext();
  const [formChanged, setFormChanged] = useState(false);

  const {
    perDay,
    extraGuestFee,
    discountPercentage,
    extraGuest,
    availableCount,
    minimumNight,
    maximumNight,
    maxNightSelect,
    perHour,
    priceExists,
  } = ListInfo;

  // useEffect(() => {
  //   setNextDisable(false);
  // }, []);

    useEffect(() => {
    const isValidPerHourOrDay = perHour > 0 && perDay > 0;
    const isValidExtraGuest = extraGuest == 0 || extraGuestFee > 0;


        setNextDisable((isValidPerHourOrDay && isValidExtraGuest) ? false: true);
    }, [perHour,perDay,extraGuestFee,extraGuest]);

  const enable = useMemo(() => {
    if (maximumNight === 1 && maximumNight === 1) {
      return false;
    }
    return true;
  }, [minimumNight, maximumNight]);

  const handleSave = async () => {
    if (formChanged || !priceExists) {
      const option = {
        perHour: Number(perHour) || 0,
        perDay: Number(perDay),
        availableCount: availableCount,
        minimumNight: minimumNight,
        maximumNight: maximumNight,
        maxNightSelect: maxNightSelect,
        extraGuest: extraGuest,
        discountPercentage: discountPercentage,
        extraGuestFee: Number(extraGuestFee),
        progressPercentage,
      };

      const option2 = {
        perHour: Number(perHour) || 0,
        perDay: Number(perDay),
        availableCount: availableCount,
        extraGuest: extraGuest,
        maxNightSelect: maxNightSelect,
        extraGuestFee: Number(extraGuestFee),
        discountPercentage: discountPercentage,
        progressPercentage,
      };

      const listPrice = enable ? option : option2;

      const res = await postAPI(`${APICONSTANT.addPrice}/${listId}`, listPrice);
      return res;
    } else {
      return { status: true, nochange: true }; // no form change
    }
  };
  actionRef.current = handleSave;
  useEffect(() => {
    actionRef.current = handleSave;
    return () => {
      actionRef.current = null;
    };
  }, []);

  const onChange = (data: any) => {
    dispatch(setData(data));
    setFormChanged(true);
  };

  return <GuestPrice onChange={onChange} value={ListInfo} />;
}

export default PageComponent;
