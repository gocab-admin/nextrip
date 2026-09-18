"use client";

import React, { useEffect, useState } from "react";
import APICONSTANT from "@/services/config";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { postAPI } from "@/app/propertyform/formAPI";
import Description from "@/app/formpage/description";

function PageComponent() {
  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector(propertySelector);
  const { setNextDisable, listId, actionRef, setLoading, progressPercentage } = useFormContext();
  const [formChanged, setFormChanged] = useState(false);

  const { propertyName, propertyDesc } = ListInfo;

  useEffect(() => {
    if (propertyDesc) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [propertyDesc]);

  const onChange = (event: any) => {
    const textnextValue = event.target.value;
      dispatch(setData({ propertyDesc: textnextValue }));
      setFormChanged(true);
  };

  const handleSave = async () => {
    if (propertyDesc) {
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
    <Description value={propertyDesc} onChange={onChange} />
  );
}

export default PageComponent;
