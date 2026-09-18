"use client";

import React, { useEffect, useState } from "react";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/ads/form/FormContext";
import { setData, adFormSelector } from "@/redux/slice/ads/AdFormSlice";
import { postAPI } from "@/app/propertyform/formAPI";
import Description from "@/app/formpage/description";

function PageComponent() {
  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector(adFormSelector);
  const { setNextDisable, listId, actionRef, setLoading, progressPercentage } = useFormContext();
  const [formChanged, setFormChanged] = useState(false);

  const { name, desc } = ListInfo;

  useEffect(() => {
    if (desc) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [desc]);

  const onChange = (event: any) => {
    const textnextValue = event.target.value;
      dispatch(setData({ desc: textnextValue }));
      setFormChanged(true);
  };

  const handleSave = async () => {
    if (desc) {
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
    <Description value={desc} onChange={onChange} />
  );
}

export default PageComponent;
