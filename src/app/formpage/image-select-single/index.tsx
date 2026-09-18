"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from 'react'
import styles from "./page.module.scss";
import { usePageContext } from '@/components/Providers/PageContext';
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
import APICONSTANT, { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";
import { useDispatch } from "react-redux";
import { ArrayMove } from "@/components/helper";
import { setData, addCoverImg, addImage, addImageDel, propertySelector } from "@/redux/slice/propertySlice";
import { useAppSelector } from "@/redux/hooks";
import { getApiMethod, postApiMethod, putApiMethod } from "@/services/global";
import { useFormContext } from "@/app/propertyform/FormContext";
import { useSearchParams } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { addAlert } from "@/redux/slice/AlertSlice";
import { detailSelector } from "@/redux/slice/detailSlice";
import { postAPI } from "@/app/propertyform/formAPI";
import {
  PhotosIcon,
  EmptyImgIcon,
  ActionsIcon,
} from "@/app/global/svg";
import { getImageUrl } from "@/components/ImageComponent";

function ImageSelect() {
    const { i18, settings } = usePageContext();
    const dispatch = useDispatch();
    const params = useSearchParams()
    const [imgFiles, setImgFiles] = useState<any>([]);
    const [dropdownVisible, setDropdownVisible] = useState(null);
    const { DetailsList } = useAppSelector(detailSelector);
    const { ListInfo } = useAppSelector(propertySelector);
    const { setNextDisable, mode, listId, actionRef, setLoading } = useFormContext();
    const imageCount = settings?.hiddenSettings?.listingImageCount;
    

    const {
        groupImage,
        coverImage
      } = ListInfo;

      let localImageCount = imageCount === "Default" ? 20 : imageCount;


      const convertBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result as string);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      const handleImageUpload = async (e: any) => {
        let tempArr: any = [];
    
        // Convert each selected file to base64
        const convertFilesToBase64 = async (files: FileList) => {
          for (let i: any = 0; i < files.length; i++) {
            const file = files[i];
            dispatch(addCoverImg(file));
            const base64 = await convertBase64(file);
    
            tempArr.unshift({
              data: base64,
              url: URL.createObjectURL(file)
            });
          }
          setImgFiles(tempArr);
        };
    
        const files = e.target.files;
    
        if (files && files.length > 0) {
          convertFilesToBase64(files);
        }
        setDropdownVisible(null);
      };

      useEffect(()=>{
        if(Array.isArray(groupImage) && groupImage.length>0) {
          setNextDisable(false);
        } else {
          setNextDisable(true);
        }
      },[groupImage])

      const toggleDropdown = (index: any) => {
        if (dropdownVisible == null) {
          setDropdownVisible(index);
        } else {
          setDropdownVisible(null);
        }
      };

      const imageSecondaryUpload = async (e: any) => {
        const file = e.target.files;
    
        // Convert each selected file to base64
        const convertFilesToBase64 = async (files: FileList) => {
          for (let i: any = 0; i < files.length; i++) {
            const file = files[i];
            dispatch(addImage(file));
            const base64 = await convertBase64(file);
            const imgUrl = URL.createObjectURL(file);
            setImgFiles((prevFiles: any) => [
              ...prevFiles,
              { data: base64, url: imgUrl }
            ]);
          }
        };
    
        //   if (file && file.length > 0) {
        //     convertFilesToBase64(file);
        //   } else {
        //     dispatch(addImage(file));
        //   }
        // };
    
        if (file && file.length > 0) {
          // Check the total number of files including the already uploaded ones
          setImgFiles((prevFiles: any) => {
            if (prevFiles.length + file.length > imageCount) {
              // alert(`You can only upload up to 3 images.`);
              return prevFiles;
            } else {
              convertFilesToBase64(file);
              return prevFiles;
            }
          });
        } else {
          dispatch(addImage(file));
        }
      };

      const deleteImage = async (url: any, data?: any) => {
        const res = await putApiMethod(url, data);
        if (res.statusCode === 200) {
          dispatch(
            addAlert({
              isOpen: true,
              message: "Image deleted",
              type: "success",
              severity: "success"
            })
          );
        } else {
          dispatch(
            addAlert({
              isOpen: true,
              message: res.response.data.message,
              type: "error",
              severity: "error"
            })
          );
        }
      };

      const handleImageDelete = (option: any, index: number, img?: string) => {
        if (mode) {
          if (img) {
            deleteImage(`${APICONSTANT.coverImage}/${listId}`);
          } else {
            deleteImage(`${APICONSTANT.groupImage}/${listId}`, { imageId: option });
          }
        }
        setImgFiles(imgFiles.filter((item: any, key: any) => key !== index));
        if (!img) {
          dispatch(
            addImageDel(groupImage.filter((item: any, key: any) => key !== index - 1))
          );
        }
        setDropdownVisible(null);
      };

      const handleOptionSelect = (option: any, index: any) => {
        ArrayMove(imgFiles, index, index + option);
        setDropdownVisible(null);
      };

      useEffect(() => {
            setImgFiles([coverImage, ...groupImage]);
      }, [coverImage, groupImage]);


      // next button action
      const handleSave = async () => {
        try {
        if (coverImage || groupImage.length > 0) {
          if (coverImage) {
            const formData: any = new FormData();
            if(coverImage instanceof File) {
              formData.append("coverImage", coverImage);
              await postAPI(`${APICONSTANT.coverImage}/${listId}`, formData);
            }
          } 
          if (groupImage.length > 0) {
            const formData: any = new FormData();
            let validPhoto = [];
            for (let i = 0; i < groupImage.length; i++) {
              if(groupImage[i] instanceof File) {
                formData.append("photos", groupImage[i]);
                validPhoto.push(groupImage[i]);
              }
            }
            if(validPhoto.length>0) {
              await postAPI(`${APICONSTANT.groupImage  }/${listId}`, formData);
            }
          }
          return { status: true }
        }
        return { status: false };
      } catch(err) {
          return { status: false };
        }
      };
      actionRef.current = handleSave;
      useEffect(() => {
        actionRef.current = handleSave;
        return () => {
          actionRef.current = null;
        }
      },[])

      const coverImg = async (url: any, data: any) => {
        const res: any = await postApiMethod(url, data);
        if (res.statusCode === 200) {
            if (groupImage.length > 0) {
              const formData: any = new FormData();
              for (let i = 0; i < groupImage.length; i++) {
                formData.append("photos", groupImage[i]);
              }
              formData.append("progressPercentage", 10);
              saveGroupImage(`${APICONSTANT.groupImage  }/${listId}`, formData);
            }
        } else {
          // res.response.data.message,
        }
      };
    
      const saveGroupImage = async (url: any, data: any) => {
        const res: any = await postApiMethod(url, data);
        if (res.statusCode === 200) {

        } else {
          // res.response.data.message
        }
      };

      

    return (
        <section className={`${styles.host}`}>
          <div className={`${styles.step8}`}>
            <div className="h-100 col-md-7 mx-auto mt-3">
              {imgFiles && imgFiles.length == 0 ? (
                <div className={`${styles.upload_sec} h-100 checkbox`}>
                  <h1 className="me-2">
                    {i18?.ADDPHOTO?.TITLE || "Add some photos of your house"}
                  </h1>
                  <p>
                    {i18?.ADDPHOTO?.SUBTITLE ||
                      "Browse your photos to get started. You can add more or make changes later."}
                  </p>
                  <div className={`${styles.photos_upload} mt-5`}>
                    <div>
                      <PhotosIcon
                        width="64"
                        height="64"
                        style={{
                          display: "block",
                          fill: " currentcolor"
                        }}
                      />
                      {localImageCount < 20 && (
                        <h2 className="pt-1">
                          {i18?.ADDPHOTO?.CHOOSEPHOTO ||
                            "Choose at least 1 photo"}
                        </h2>
                      )}
                      {localImageCount > 5 && (
                        <h2 className="pt-1">
                          {i18?.ADDPHOTO?.CHOOSEYOUR ||
                            "Choose your photos as you want to show"}
                        </h2>
                      )}
                      <div className={`${styles.custom_fileupload} pt-2`}>
                        <label htmlFor="imageUpload">
                          <input
                            type="file"
                            id="imageUpload"
                            className={`${styles.imageUpload}`}
                            onChange={handleImageUpload}
                            // multiple
                            accept="image/*"
                          />
                          {i18?.ADDPHOTO?.UPLOAD || "Upload from your device"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.five_image} h-100 checkbox`}>
                  <div className="d-flex justify-content-between mb-3">
                    {localImageCount < 20 && (
                      <h3 className="pt-1 image">
                        {i18?.ADDPHOTO?.CHOOSEPHOTO ||
                          "Choose at least 1 photo"}
                      </h3>
                    )}
                    {localImageCount > 5 && (
                      <h3 className="pt-1">
                        {i18?.ADDPHOTO?.CHOOSEYOUR ||
                          "Choose your photos as you want to show"}
                      </h3>
                    )}
                    {imageCount >= 1 && imgFiles.length < imageCount && (
                      <div className={`${styles.custom_fileupload}`}>
                        <label
                          htmlFor="placeholderUpload"
                          className={`${styles.morebtn}`}
                        >
                          <input
                            type="file"
                            id="placeholderUpload"
                            className={`${styles.imageUpload}`}
                            onChange={imageSecondaryUpload}
                            multiple
                            accept="image/*"
                          />
                          <AddIcon className={`${styles.addmore} me-2`} />
                          {i18?.ADDPHOTO?.ADDMORE || "Add more"}
                        </label>
                      </div>
                    )}
                  </div>
                  <div className={`${styles.all_images} pb-4`}>
                    {imgFiles &&
                      imgFiles?.map((file: any, f: number) =>
                        f === 0 ? (
                          <div
                            key={f}
                            className={`${styles.photos_upload} mt-2 position-relative`}
                            style={{
                              backgroundImage: !file.data
                                ? `url(${getImageUrl(file.imagePath)})`
                                : `url('${file.data}')`
                            }}
                          >
                            <button
                              className={`${styles.action_icon} btn ms-auto`}
                              onClick={() => toggleDropdown(f)}
                            >
                              <span>
                                <ActionsIcon
                                  width="16"
                                  height="16"
                                  style={{
                                    display: "block",
                                    fill: "var(--footer-text-color)"
                                  }}
                                />
                              </span>
                            </button>
                            {dropdownVisible === f ? (
                              <div className={`${styles.dropdown}`}>
                                <ul>
                                  {mode && (
                                    <li
                                      className={`${styles.custom_fileupload}`}
                                    >
                                      <label
                                        htmlFor="imageUpload"
                                        className={`${styles.editbtn}`}
                                      >
                                        <input
                                          type="file"
                                          id="imageUpload"
                                          className={`${styles.imageUpload}`}
                                          onChange={handleImageUpload}
                                          accept="image/*"
                                        />
                                        {i18?.WISHLIST?.DELETE || "Delete"}
                                      </label>
                                    </li>
                                  )}
                                  {!mode &&
                                    localImageCount > 1 &&
                                    imgFiles.length > 1 && (
                                      <li
                                        style={{ color: "var(--text-color)" }}
                                        onClick={() => handleOptionSelect(1, f)}
                                      >
                                        {i18?.ADDPHOTO?.MOVEFORWARDS ||
                                          "Move forwards"}
                                      </li>
                                    )}
                                  {!mode && (
                                    <li
                                      style={{ color: "var(--text-color)" }}
                                      onClick={() =>
                                        handleImageDelete(file._id, f, "cover")
                                      }
                                    >
                                      {i18?.ADDPHOTO?.DELETE || "Delete"}
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div
                            key={f}
                            className={`${styles.photos_uploadGrid} mt-2 position-relative`}
                            style={{
                              backgroundImage: !file.data
                                ? `url(${getImageUrl(file.imagePath)})`
                                : `url('${file.data}')`
                            }}
                          >
                            <button
                              className={`${styles.action_icon} btn ms-auto`}
                              onClick={() => toggleDropdown(f)}
                            >
                              <span>
                                <ActionsIcon
                                  width="16"
                                  height="16"
                                  style={{
                                    display: "block",
                                    fill: "var(--footer-text-color)"
                                  }}
                                />
                              </span>
                            </button>
                            {dropdownVisible == f ? (
                              <div className={`${styles.dropdown}`}>
                                <ul>
                                  {localImageCount > 1 && !mode && (
                                    <li
                                      style={{ color: "var(--text-color)" }}
                                      onClick={() => handleOptionSelect(-1, f)}
                                    >
                                      {i18?.ADDPHOTO?.MOVEBACKWARDS ||
                                        "Move backwards"}
                                    </li>
                                  )}
                                  {localImageCount > 1 &&
                                    !mode &&
                                    f !== imgFiles.length - 1 && (
                                      <li
                                        style={{ color: "var(--text-color)" }}
                                        onClick={() => handleOptionSelect(1, f)}
                                      >
                                        {i18?.ADDPHOTO?.MOVEFORWARDS ||
                                          "Move forwards"}
                                      </li>
                                    )}
                                  {localImageCount > 1 && !mode && (
                                    <li
                                      style={{ color: "var(--text-color)" }}
                                      onClick={() => handleOptionSelect(-f, f)}
                                    >
                                      {i18?.ADDPHOTO?.MAKECOVERPHOTO ||
                                        "Make Cover Photo"}
                                    </li>
                                  )}
                                  <li
                                    style={{ color: "var(--text-color)" }}
                                    onClick={() =>
                                      handleImageDelete(file._id, f)
                                    }
                                  >
                                    {i18?.WISHLIST?.DELETE || "Delete"}
                                  </li>
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        )
                      )}
                    {imgFiles &&
                      imgFiles.length >= 1 &&
                      imageCount > 1 &&
                      // Array.from(
                      //   Array(imgFiles.length - imgFiles.length + 1)
                      // ).map((addImg, a) => (
                      Array.from({ length: imageCount }).map(
                        (_, index) =>
                          index === imgFiles.length && (
                            <div
                              key={index}
                              className={`${styles.placeholder_upload} mt-2`}
                            >
                              <div className="d-flex align-items-center justify-content-center h-100">
                                <div
                                  className={`${styles.custom_fileupload} w-100 h-100`}
                                >
                                  <label
                                    htmlFor="placeholderUpload"
                                    className="w-100 h-100"
                                  >
                                    <input
                                      type="file"
                                      id="placeholderUpload"
                                      className={`${styles.imageUpload}`}
                                      onChange={imageSecondaryUpload}
                                      multiple
                                      accept="image/*"
                                    />
                                    {/* {imgFiles.length -1 ? <AddIcon className="h-100 m-auto" width="32"
                                                                            height="32"/> :  */}
                                    <EmptyImgIcon
                                      className="h-100 m-auto"
                                      width="32"
                                      height="32"
                                      style={{
                                        display: "block",
                                        fill: " currentcolor"
                                      }}
                                    />
                                    {/* } */}
                                  </label>
                                </div>
                              </div>
                            </div>
                          )
                      )}
                    {localImageCount > 5 &&
                      Array.from(
                        Array(imgFiles.length - imgFiles.length + 1)
                      ).map((addImg, a) => (
                        <div
                          key={a}
                          className={`${styles.placeholder_upload} mt-2`}
                        >
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <div
                              className={`${styles.custom_fileupload} w-100 h-100`}
                            >
                              <label
                                htmlFor="placeholderUpload"
                                className="w-100 h-100"
                              >
                                <input
                                  type="file"
                                  id="placeholderUpload"
                                  className={`${styles.imageUpload}`}
                                  onChange={imageSecondaryUpload}
                                  multiple
                                  accept="image/*"
                                />
                                {/* {imgFiles.length -1 ? <AddIcon className="h-100 m-auto" width="32"
                                                                          height="32"/> :  */}
                                <EmptyImgIcon
                                  className="h-100 m-auto"
                                  width="32"
                                  height="32"
                                  style={{
                                    display: "block",
                                    fill: " currentcolor"
                                  }}
                                />
                                {/* } */}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
  </section>)
}

export default ImageSelect
