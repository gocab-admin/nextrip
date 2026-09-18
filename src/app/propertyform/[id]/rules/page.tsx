'use client';
import Rules from '@/app/formpage/rules'
import { useAppSelector } from '@/redux/hooks';
import { setData, propertySelector } from '@/redux/slice/propertySlice';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useFormContext } from '../../FormContext';
import { postAPI } from "@/app/propertyform/formAPI";
import APICONSTANT from '@/services/apiConstant';

function PageComponent() {

  const dispatch = useDispatch();
  const { ListInfo } = useAppSelector<any>(propertySelector);
  const { setNextDisable, listId, actionRef, progressPercentage } = useFormContext();
  const [formChanged, setFormChanged] = useState(false);

  const {
    ruletitle, ruledesc
  } = ListInfo;

  const handleSave = async () => {
    if (formChanged) {
      const option = {
        desc:ruledesc,
        title:ruletitle
      }
      const res = await postAPI(`${APICONSTANT.rules}/${listId}`, option);
      return res
    } else {
      return { status: true, nochange: true }; 
    }
  }

  actionRef.current = handleSave;
  useEffect(() => {
    actionRef.current = handleSave;
    return () => {
      actionRef.current = null;
    };
  }, []);

  const onChange = (data: any) => {
    dispatch(setData(data));
    setFormChanged(true);
  }

  useEffect(() => {
    setNextDisable(false);
  }, []);


  return (
    <div>
      <Rules onChange={onChange} value={ListInfo} />
    </div>
  )
}

export default PageComponent