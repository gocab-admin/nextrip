"use client";

import React, { useEffect, useState } from "react";
import APICONSTANT from "@/services/config";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import {
  setData,
  setPrivilegeIds,
  propertySelector,
} from "@/redux/slice/propertySlice";
import { getApiMethod } from "@/services/global";
import { useFormContext } from "@/app/propertyform/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import Privileges from "@/app/formpage/privileges";

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
  const [services, setServices] = useState<any>();
  const [formChanged, setFormChanged] = useState(false);

  const { privilegeIds } = ListInfo;

  useEffect(() => {
    if (Array.isArray(privilegeIds) && privilegeIds?.length > 0) {
      setNextDisable(false);
    } else {
      setNextDisable(true);
    }
  }, [privilegeIds]);

  const onChange = (e: any) => {
    const value = e.target.value;
    if (privilegeIds.includes(value)) {
      const newArray = [...privilegeIds];
      const findIndex = newArray.indexOf(value);
      newArray.splice(findIndex, 1);
      dispatch(setData({ privilegeIds: newArray }));
    } else {
      dispatch(setPrivilegeIds(value));
    }
    setFormChanged(true);
  };

  const getamenityapi = async (url: any) => {
    const resp: any = await getApiMethod(url);
    if (resp.statusCode === 200) {
      if (resp?.data?.privilegeList) {
        setServices(resp?.data?.privilegeList);
      }
    }
  };

  useEffect(() => {
    getamenityapi(APICONSTANT.privileges);
  }, [mode]);

  // next button action
  const handleSave = async () => {
    if (privilegeIds.length > 0) {
      if (formChanged) {
        setLoading(true);
        const data = {
          moduleType:"listings",
          privilegeItemId: privilegeIds,
          progressPercentage,
        };
        const res = await postAPI(`${APICONSTANT.privileges}/${listId}`, data);
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
    <Privileges value={privilegeIds} onChange={onChange} data={services} />
  );
}

export default PageComponent;
