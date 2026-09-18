"use client";

import React, { useEffect, useMemo, useState } from "react";
import APICONSTANT from "@/services/config";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useFormContext } from "@/app/propertyform/FormContext";
import { generateData } from "@/components/helper";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { postAPI } from "@/app/propertyform/formAPI";
import BedTypes from "@/app/formpage/bed-types";

function PageComponent() {
  const dispatch = useDispatch();
  const [formChanged, setFormChanged] = useState(false);
  const { ListInfo } = useAppSelector(propertySelector);
  const { setNextDisable, actionRef, listId, setLoading, progressPercentage } = useFormContext();

  const { bedRoomCount, bedRoomtype } = ListInfo;

  const bedCountData = useMemo(()=>{
    let data:any = generateData(bedRoomCount, []);
    if(bedRoomCount && ListInfo._id) {
      for(let i=0; i < bedRoomtype.length; ++i) {
        const sub = bedRoomtype[i];
        if(data && data['bedRoom'+sub.bedRoom])
        data['bedRoom'+sub.bedRoom][sub.bedType] = sub.bedCount;
      }
    }
    return data;
  },[bedRoomCount, ListInfo, bedRoomtype ])

  // check if generated data matches with api data 
  const isFormChanged =  useMemo(()=>{
    const subData:any = {};
    if(bedRoomCount && ListInfo._id) {
      for(let i=0; i < bedRoomtype.length; ++i) {
        const sub = bedRoomtype[i];
        subData['bedRoom'+sub.bedRoom] = subData['bedRoom'+sub.bedRoom] || {};
        subData['bedRoom'+sub.bedRoom][sub.bedType] = sub.bedCount;
      }
    }
    let lens = Object.keys(bedCountData);
  for(let i=0; i<lens.length;++i) {
    const udata = bedCountData[lens[i]];
    const sub = Object.keys(udata);
    for(let j=0; j<sub.length; ++j) {
        const value = udata[sub[j]];
        if(value>0) {
          if(!subData[lens[i]]) {
            return true;
          } else if(!subData[lens[i]][sub[j]]) {
            return true
          } else if(subData[lens[i]][sub[j]] !== value) {
          return true;
          }
      }
    }
}

    return false;
  },[bedCountData, bedRoomtype ])

  useEffect(() => {
    setNextDisable(false);
  }, []);

  const onChange = (tempObj:any) => {
    let bedArr: any = [];
    Object.entries(tempObj).forEach(([key, type]: any, index: any) => {
      const bedRoom = key.replace("bedRoom", "");
      function getType(modal: any, count: any) {
        return {
          bedRoom: bedRoom,
          bedType: modal,
          bedCount: count,
        };
      }

      if (type.double || typeof type.double==='number') {
        bedArr.push(getType("double", type.double));
      }
      if (type.queen || typeof type.queen==='number') {
        bedArr.push(getType("queen", type.queen));
      }
      if (type.king || typeof type.king==='number') {
        bedArr.push(getType("king", type.king));
      }
    });
    dispatch(setData({bedRoomtype: bedArr}));
    setFormChanged(true);
    return bedArr;
  }

  // next button action
  const handleSave = async () => {
    if (formChanged || isFormChanged) {
      setLoading(true);
      let data = {
        bedRoomtype,
        progressPercentage
      };
      // form not changed and api data and current data mismatches due to count change in prev step
      if(!formChanged) {
        const bedRoomtype = onChange(bedCountData);
        data = {
          bedRoomtype,
          progressPercentage
        };
      }
      const res = await postAPI(`${APICONSTANT.basicdetails}/${listId}`, data);
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

  return <BedTypes onChange={onChange} value={bedCountData} data={bedCountData} count={bedRoomCount}  />;
}

export default PageComponent;
