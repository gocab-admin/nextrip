"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/ads/form/FormContext";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import { setData, adFormSelector } from "@/redux/slice/ads/AdFormSlice";
import { postAPI } from "@/app/propertyform/formAPI";
import Pricing from "@/app/formpage/pricing";

function PageComponent() {
  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector<any>(adFormSelector);
  const { setNextDisable, listId, actionRef, progressPercentage } = useFormContext();
  const [formChanged, setFormChanged] = useState(false);

  const {
    price
  } = ListInfo;

  useEffect(() => {
      setNextDisable(price>0? false: true);
  }, [price]);




  const handleSave = async () => {
    if (formChanged) {
      const listPrice = {
        price,
        progressPercentage
      };

      const res = await postAPI(`${ADSAPICONSTANT.basicdetails}/${listId}`, listPrice);
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

  const onChange = (data:any) => {
    dispatch(setData(data));
    setFormChanged(true);
  }

  return (
    <Pricing onChange={onChange} value={ListInfo} />
  );
}

export default PageComponent;
