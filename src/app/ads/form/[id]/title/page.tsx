"use client";

import React, { useEffect, useState } from "react";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/ads/form/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import { setData, adFormSelector } from "@/redux/slice/ads/AdFormSlice";
import Title from "@/app/formpage/title";
const characterLimit = 32; // Set your desired character limit

function PageComponent() {
  const dispatch = useDispatch();
  const [formChanged, setFormChanged] = useState(false);

  const { ListInfo } = useAppSelector(adFormSelector);
  const { setNextDisable, actionRef, listId, setLoading, progressPercentage } = useFormContext();

  const { name, desc } = ListInfo;

  useEffect(() => {
    if (name && name!=='untitled') {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [name]);

  const onChange = (event: any) => {
    const inputText = event.target.value;
    if (inputText.length <= characterLimit) {
      dispatch(setData({name: inputText}));
    }
    setFormChanged(true);
  };

  // next button action
  const handleSave = async () => {
    if (name) {
      if (formChanged) {
        setLoading(true);
        const data = {
          name: name,
          desc: desc,
          progressPercentage,
          userId:
            typeof window !== "undefined"
              ? localStorage.getItem("appUserId")
              : "",
        };
        const res = await postAPI(`${ADSAPICONSTANT.listinfo}/${listId}`, data);
        return res;
      } else {
        return { status: true, nochange: true };
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

  return (<Title onChange={onChange} value={name} />);
}

export default PageComponent;
