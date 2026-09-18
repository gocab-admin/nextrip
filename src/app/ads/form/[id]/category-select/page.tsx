"use client";

import React, {
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useState,
} from "react";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import { Category } from "./interface";
import { useDispatch } from "react-redux";
import { setData, adFormSelector } from "@/redux/slice/ads/AdFormSlice";
import { useAppSelector } from "@/redux/hooks";
import { getApiMethod } from "@/services/global";
import { useFormContext } from "@/app/ads/form/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import CategorySelect from "@/app/formpage/category-select";
import { usePageContext } from "@/components/Providers/PageContext";

function PageComponent() {
  const [formChanged, setFormChanged] = useState(false);
  const dispatch = useDispatch();
  const { i18 } = usePageContext();
  const [checkboxdata, setCheckboxdata] = useState<Category[]>([]);
  const { ListInfo } = useAppSelector(adFormSelector);
  const { setNextDisable, setLoading, actionRef, listId, progressPercentage } =
    useFormContext();

  const { category } = ListInfo;

  useEffect(() => {
    setNextDisable(category ? false : true);
  }, [category]);

  const getcategoryapi = async (url: any) => {
    try {
      const resp: any = await getApiMethod(url);
      if (resp.statusCode === 200) {
        if (resp?.data?.categories) {
          setCheckboxdata(resp.data.categories);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  // next button action
  const handleSave = async () => {
    if (category) {
      if (formChanged) {
        setLoading(true);
        const basicDetails = {
          category: category,
          progressPercentage,
        };
        const res = await postAPI(
          `${ADSAPICONSTANT.basicdetails}/${listId}`,
          basicDetails
        );
        return res;
      } else {
        return { status: true, nochange: true }; // form no-change
      }
    }
  };
  
  actionRef.current = handleSave;
  useEffect(() => {
    actionRef.current = handleSave;
    return () => {
      // on page unmount, delete that action
      actionRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    getcategoryapi(ADSAPICONSTANT.propertyCategory);
  }, []);

  const onChange = (category: string) => {
    dispatch(setData({ category: category }));
  };

  return (
    <CategorySelect
      data={checkboxdata}
      setFormChanged={setFormChanged}
      value={category}
      onChange={onChange}
      title={i18?.SELECTPLACE?.SELECTPLACE ||
        "Which of these best describes your place?"}
    />
  );
}

export default PageComponent;
