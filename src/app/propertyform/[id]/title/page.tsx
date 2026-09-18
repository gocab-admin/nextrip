"use client";

import React, { useEffect, useState } from "react";
import APICONSTANT from "@/services/config";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import Title from "@/app/formpage/title";
const characterLimit = 32; // Set your desired character limit

function PageComponent() {
  const dispatch = useDispatch();
  const [formChanged, setFormChanged] = useState(false);

  const { ListInfo } = useAppSelector(propertySelector);
  const { setNextDisable, actionRef, listId, setLoading, progressPercentage } = useFormContext();

  const { propertyName, propertyDesc } = ListInfo;

  useEffect(() => {
    if (propertyName && propertyName!=='untitled') {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [propertyName]);

  const onChange = (event: any) => {
    const inputText = event.target.value;
    if (inputText.length <= characterLimit) {
      dispatch(setData({propertyName: inputText}));
    }
    setFormChanged(true);
  };

  // next button action
  const handleSave = async () => {
    if (propertyName) {
      if (formChanged) {
        setLoading(true);
        const data = {
          name: propertyName,
          desc: propertyDesc,
          progressPercentage,
          userId:
            typeof window !== "undefined"
              ? localStorage.getItem("appUserId")
              : "",
        };
        const res = await postAPI(`${APICONSTANT.listinfo}/${listId}`, data);
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

  return (<Title onChange={onChange} value={propertyName} />);
}

export default PageComponent;
