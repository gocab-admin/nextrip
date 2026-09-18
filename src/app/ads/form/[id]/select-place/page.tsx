"use client";

import React, { useEffect, useState } from 'react'
import ADSAPICONSTANT from '@/services/adsApiConstant';
import { Properties } from "./interface";
import { useDispatch } from "react-redux";
import {
  setData,
  adFormSelector
} from "@/redux/slice/ads/AdFormSlice";
import { useAppSelector } from "@/redux/hooks";
import { getApiMethod } from "@/services/global";
import { useFormContext } from "@/app/ads/form/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import SelectPlace from "@/app/formpage/select-place";

function PageComponent() {
    const dispatch = useDispatch();
    const [formChanged, setFormChanged] = useState(false);
    const [checkboxdata2, setCheckboxdata2] = useState<Properties[]>([]);
    const { ListInfo } = useAppSelector(adFormSelector);
    const { setNextDisable, actionRef, setLoading, listId, progressPercentage } = useFormContext();
    

    const {
        category,
        subCategory
      } = ListInfo;

      useEffect(()=>{
        const value = checkboxdata2.some((item)=>item._id===subCategory)
            setNextDisable(!value);
      },[subCategory, checkboxdata2])

      const getpropertyapi = async (url: any, obj?: any) => {
        const resp: any = await getApiMethod(url, obj);
        if (resp.statusCode === 200) {
          if (resp?.data?.subCategories && Array.isArray(resp?.data?.subCategories)) {
            setCheckboxdata2(resp.data.subCategories);
          }
        }
      };

      useEffect(()=>{
        if(category) {
          getpropertyapi(`${ADSAPICONSTANT.privacyType  }/${category}`);
        }
      },[category])

      // next button action
      const handleSave = async () => {
        if(subCategory) {
          if(formChanged) {
          setLoading(true)
          const basicDetails = { subCategory: subCategory, progressPercentage };
          const res = await postAPI(`${ADSAPICONSTANT.basicdetails}/${listId}`, basicDetails);
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
        dispatch(setData({ subCategory: value }));
      };

    return (<SelectPlace
          setFormChanged={setFormChanged}
          data={checkboxdata2}
          value={subCategory}
          onChange={onChange}
       />)
}

export default PageComponent
