"use client";

import React, { useEffect } from 'react'
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/ads/form/FormContext";
import { adFormSelector } from "@/redux/slice/ads/AdFormSlice";
import ReviewAdsListing from "@/app/formpage/review-ads-listing";
// import { putApiMethod } from "@/services/global";
// import ADSAPICONSTANT from "@/services/adsApiConstant";

function PageComponent() {
    const { ListInfo }:any = useAppSelector(adFormSelector);
    const { setNextDisable, setLoading, actionRef, listId } = useFormContext();

      useEffect(()=>{
        setNextDisable(false);
      },[])

        // next button action
  const handleSave = async () => {
    try {
      setLoading(true);
      // no api for changing status for ads
      // await putApiMethod(`${ADSAPICONSTANT.completeSetup}/${listId}`);
      return { status: true, currentStatus: ListInfo.status };
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

    return (<ReviewAdsListing data={ListInfo} />)
}

export default PageComponent
