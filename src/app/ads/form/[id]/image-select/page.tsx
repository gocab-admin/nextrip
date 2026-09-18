"use client";
import { useEffect, useMemo, useState } from "react";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import { dispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { postApiMethod } from "@/services/global";
import { useFormContext } from "@/app/ads/form/FormContext";
import { setData, adFormSelector } from "@/redux/slice/ads/AdFormSlice";
import ImageSelect from "@/app/formpage/image-select";

export default function PageComponent() {
  const { setNextDisable, setLoading, actionRef, listId, progressPercentage } =
    useFormContext();
  const { ListInfo } = useAppSelector(adFormSelector);
  const { imgFiles } = ListInfo;
  const [formChanged, setFormChanged] = useState(false);

  // const deleteImage = async (url: any, data?: any) => {
  //   const res = await putApiMethod(url, data);
  //   if (res.statusCode === 200) {
  //     dispatch(
  //       addAlert({
  //         isOpen: true,
  //         message: "Image deleted",
  //         type: "success",
  //         severity: "success",
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       addAlert({
  //         isOpen: true,
  //         message: res.response.data.message,
  //         type: "error",
  //         severity: "error",
  //       })
  //     );
  //   }
  // };

  const handleImageDelete = (index: number) => {
    dispatch(
      setData({
        imgFiles: imgFiles.filter((item: any, key: any) => key !== index),
      })
    );
    setFormChanged(true);
  };

  useEffect(() => {
    setNextDisable(imgFiles.length > 0 ? false : true);
  }, [imgFiles]);

  const coverImg = async (url: any, data: any) => {
    const formData: any = new FormData();
    formData.append("selectedImage", data?.ImageId);
    formData.append("progressPercentage", progressPercentage);
    const res: any = await postApiMethod(url, formData);
    if (res.statusCode === 200) {
      return { status: true };
    } else {
      throw new Error("something wrong");
    }
  };

  const saveGroupImage = async (url: any, data: any) => {
    const formData: any = new FormData();
    for (let i = 0; i < data.length; i++) {
      formData.append("selectedImages[]", data[i]?.ImageId);
    }
    formData.append("progressPercentage", progressPercentage);
    const res: any = await postApiMethod(url, formData);

    if (res.statusCode === 200) {
      return { status: true };
    } else {
      throw new Error("something wrong");
    }
  };

  const handleSave = async () => {
    try {
      if (imgFiles.length > 0) {
        if (formChanged) {
          setLoading(true);
          await coverImg(`${ADSAPICONSTANT.coverImage}/${listId}`, imgFiles[0]);
          const groupImages = imgFiles.slice(1)
            await saveGroupImage(
              `${ADSAPICONSTANT.groupImage}/${listId}`,
              groupImages
            );
          return { status: true };
        } else {
          return { status: true, nochange: true }; // no form change
        }
      }
    } catch (err) {
      return { status: false, error: err || "failed" };
    }
  };

  actionRef.current = handleSave;
  useEffect(() => {
    actionRef.current = handleSave;
    return () => {
      actionRef.current = null;
    };
  }, []);

  const onChange = (value: any) => {
    dispatch(setData({ imgFiles: value }));
    setFormChanged(true);
  };

  return (
    <ImageSelect
      onChange={onChange}
      value={imgFiles}
      handleImageDelete={handleImageDelete}
    />
  );
}
