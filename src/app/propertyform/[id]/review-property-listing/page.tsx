"use client";

import React, { useEffect } from 'react'
import APICONSTANT from "@/services/config";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import { propertySelector } from "@/redux/slice/propertySlice";
import { putApiMethod } from "@/services/global";
import ReviewPropertyListing from "@/app/formpage/review-property-listing";

function PageComponent() {
    const { ListInfo }:any = useAppSelector(propertySelector);
    const { setNextDisable, setLoading, actionRef, listId } = useFormContext();

      useEffect(()=>{
        setNextDisable(false);
      },[])

        // next button action
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await putApiMethod(`${APICONSTANT.completeSetup}/${listId}`);
      return { status: true, currentStatus: res?.data?.status };
    } catch(err) {
      return { status: false, error: 'save Failed' };
    }
  };
  
  actionRef.current = handleSave;
  useEffect(() => {
    actionRef.current = handleSave;
    return () => {
      actionRef.current = null;
    };
  }, []);

    return (<ReviewPropertyListing data={ListInfo} />)
}

export default PageComponent
