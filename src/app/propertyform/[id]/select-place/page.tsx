"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from 'react'
import APICONSTANT from "@/services/config";
import { Properties } from "./interface";
import { useDispatch } from "react-redux";
import {
  setData,
  propertySelector
} from "@/redux/slice/propertySlice";
import { useAppSelector } from "@/redux/hooks";
import { getApiMethod } from "@/services/global";
import { useFormContext } from "@/app/propertyform/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import SelectPlace from "@/app/formpage/select-place";

function PageComponent() {
    const dispatch = useDispatch();
    const [formChanged, setFormChanged] = useState(false);
    const [checkboxdata2, setCheckboxdata2] = useState<Properties[]>([]);
    const { ListInfo } = useAppSelector(propertySelector);
    const { setNextDisable, actionRef, setLoading, listId, progressPercentage } = useFormContext();
    
console.log('====================================');
console.log(ListInfo);
console.log('====================================');
    const {
        propertyCategory,
        propertyType
      } = ListInfo;

      useEffect(()=>{
        const value = checkboxdata2.some((item)=>item._id===propertyType)
            setNextDisable(!value);
      },[propertyType, checkboxdata2])

      const getpropertyapi = async (url: any, obj?: any) => {
        const resp: any = await getApiMethod(url, obj);
        if (resp.statusCode === 200) {
          if (resp?.data?.properties && Array.isArray(resp?.data?.properties)) {
            setCheckboxdata2(resp.data.properties);
          }
        }
      };

      useEffect(()=>{
        if(propertyCategory) {
          getpropertyapi(`${APICONSTANT.privacyType  }/${propertyCategory}`);
        }
      },[propertyCategory])

      // next button action
      const handleSave = async () => {
        if(propertyType) {
          if(formChanged) {
          setLoading(true)
          const basicDetails = { propertyType, progressPercentage };
          const res = await postAPI(`${APICONSTANT.basicdetails}/${listId}`, basicDetails);
          return res;
          } else {
            return { status: true, nochange: true}; //form no change
          }
        }
      }
      actionRef.current = handleSave;
      useEffect(()=>{
        actionRef.current = handleSave;
        return ()=>{
          actionRef.current = null
        }
      },[])

      const onChange = (value: string) => {
        dispatch(setData({ propertyType: value }));
      };

    return (<SelectPlace
          setFormChanged={setFormChanged}
          data={checkboxdata2}
          value={propertyType}
          onChange={onChange}
          icon={true}
       />)
}

export default PageComponent
