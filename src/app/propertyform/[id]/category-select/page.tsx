"use client";

import React, {
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useState,
} from "react";
import APICONSTANT, { APIURLS } from "@/services/config";
import { Category } from "./interface";
import { useDispatch } from "react-redux";
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { useAppSelector } from "@/redux/hooks";
import { getApiMethod } from "@/services/global";
import { useFormContext } from "@/app/propertyform/FormContext";
import { postAPI } from "@/app/propertyform/formAPI";
import CategorySelect from "@/app/formpage/category-select";
import { usePageContext } from "@/components/Providers/PageContext";

function PageComponent() {
  const { i18 } = usePageContext();
  const [formChanged, setFormChanged] = useState(false);
  const dispatch = useDispatch();
  const [checkboxdata, setCheckboxdata] = useState<Category[]>([]);
  const { ListInfo } = useAppSelector(propertySelector);
  const { setNextDisable, setLoading, actionRef, listId, progressPercentage } =
    useFormContext();

  const { propertyCategory } = ListInfo;

  useEffect(() => {
    setNextDisable(propertyCategory ? false : true);
  }, [propertyCategory]);

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
    if (propertyCategory) {
      if (formChanged) {
        setLoading(true);
        const basicDetails = {
          propertyCategory,
          progressPercentage,
        };
        const res = await postAPI(
          `${APICONSTANT.basicdetails}/${listId}`,
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
    getcategoryapi(APICONSTANT.propertyCategory);
  }, []);

  const onChange = (category: string) => {
    dispatch(setData({ propertyCategory: category }));
  };

  return (
    <CategorySelect
      data={checkboxdata}
      setFormChanged={setFormChanged}
      value={propertyCategory}
      onChange={onChange}
      title={i18?.SELECTPLACE?.SELECTPLACE ||
        "Which of these best describes your place?"}
    />
  );
}

export default PageComponent;
