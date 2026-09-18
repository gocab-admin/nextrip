"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import { ActionsIcon, EmptyImgIcon, PhotosIcon } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import AddIcon from "@mui/icons-material/Add";
import { getImageUrl } from "@/components/ImageComponent";
import { APIURLS } from "@/services/config";
import { ArrayMove } from "@/components/helper";
import RightDrawer from "@/components/drawer";
import dynamic from "next/dynamic";

const DynamicGallertModal: any = dynamic(() => import("./GallerModel"));
interface Props {
  onChange: any;
  value: any[];
  handleImageDelete: any;
}
export default function ImageSelect({ onChange, value, handleImageDelete }: Props) {
  const { i18, settings } = usePageContext();
  const [openDrawer, setOpenDrawer] = useState({ open: false, drawer: "" });
  const imageCount = settings?.hiddenSettings?.listingImageCount;
  let localImageCount = imageCount === "Default" ? 20 : imageCount;
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const toggleDropdown = (index: any) => {
    if (dropdownVisible == null) {
      setDropdownVisible(index);
    } else {
      setDropdownVisible(null);
    }
  };

  const handleOptionSelect = (option: any, index: any) => {
    onChange(ArrayMove(value, index, index + option));
    setDropdownVisible(null);
  };

  const onSelectedImg = (img: any) => {
    // const images = [...img];
    const images = [...value, ...img];
    const seen = new Set();
    const uniqueImages = images.filter(image => {
      if (seen.has(image.ImageId)) {
        return false;
      }
      seen.add(image.ImageId);
      return true;
    });
    onChange(uniqueImages);
  };

  const handleOpenDrawer = () => {
    setOpenDrawer({ open: true, drawer: "" })
  }


  return (
    <div>
      <section className={`${styles.step8}`}>
        <div className="h-100 col-md-7 mx-auto mt-3">
          {value && value.length == 0 ? (
            <div
              className={`${styles.upload_sec} h-100 checkbox cursor-pointer`}
              onClick={handleOpenDrawer}
            >
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
                      fill: " currentcolor",
                    }}
                  />
                  {localImageCount < 20 && (
                    <h2 className="pt-1">
                      {`${i18?.ADDPHOTO?.CHOOSEPHOTO.replace(
                        "1",
                        imageCount
                      )}` || `Choose at least ${imageCount} photo`}
                    </h2>
                  )}
                  {localImageCount > 5 && (
                    <h2 className="pt-1">
                      {i18?.ADDPHOTO?.CHOOSEYOUR ||
                        "Choose your photos as you want to show"}
                    </h2>
                  )}
                  <div className={`${styles.custom_fileupload} pt-2`}>
                    {i18?.ADDPHOTO?.UPLOAD || "Upload Images"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.five_image} h-100 checkbox`}>
              <div className="d-flex justify-content-between">
                {localImageCount < 20 && (
                  <h3 className="pt-1 image">
                    {i18?.ADDPHOTO?.CHOOSEPHOTO || "Choose at least 1 photo"}
                  </h3>
                )}
                {localImageCount > 5 && (
                  <h3 className="pt-1">
                    {i18?.ADDPHOTO?.CHOOSEYOUR ||
                      "Choose your photos as you want to show"}
                  </h3>
                )}
                {imageCount >= 1 && value.length < imageCount && (
                  <div
                    className={`${styles.custom_fileupload}`}
                    onClick={handleOpenDrawer}
                  >
                    <label
                      htmlFor="placeholderUpload"
                      className={`${styles.morebtn}`}
                    >
                      {/* <input
                            type="file"
                            id="placeholderUpload"
                            className={`${styles.imageUpload}`}
                            onChange={imageSecondaryUpload}
                            multiple
                            accept="image/*"
                          /> */}
                      <AddIcon className={`${styles.addmore} me-2`} />
                      {i18?.ADDPHOTO?.ADDMORE || "Add more"}
                    </label>
                  </div>
                )}
              </div>
              <div className={`${styles.all_images} pb-4`}>
                {value &&
                  value?.map((file: any, f: number) =>
                    f === 0 ? (
                      <div
                        key={f}
                        className={`${styles.photos_upload} mt-2 position-relative`}
                        // style={{
                        //   backgroundImage: !file.data
                        //     ? `url(${APIURLS.baseUrl + file.imagePath})`
                        //     : `url('${file.data}')`,
                        // }}
                        style={{
                          backgroundImage: !file.data
                            ? `url(${getImageUrl(file.imagePath)})`
                            : `url('${file.data}')`,
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
                                fill: "var(--footer-text-color)",
                              }}
                            />
                          </span>
                        </button>
                        {dropdownVisible === f ? (
                          <div className={`${styles.dropdown}`}>
                            <ul>
                              {localImageCount > 1 && value.length > 1 && (
                                <li
                                  style={{ color: "var(--text-color)" }}
                                  onClick={() => handleOptionSelect(1, f)}
                                >
                                  {i18?.ADDPHOTO?.MOVEFORWARDS ||
                                    "Move forwards"}
                                </li>
                              )}
                              {
                                <li
                                  style={{ color: "var(--text-color)" }}
                                  onClick={() => {
                                    handleImageDelete(f)
                                    setDropdownVisible(null);
                                  }}
                                >
                                  {i18?.ADDPHOTO?.DELETE || "Delete"}
                                </li>
                              }
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div
                        key={f}
                        className={`${styles.photos_uploadGrid} mt-2 position-relative`}
                        // style={{
                        //   backgroundImage: !file.data
                        //     ? `url(${APIURLS.baseUrl + file.imagePath})`
                        //     : `url('${file.data}')`,
                        // }}
                        style={{
                          backgroundImage: !file.data
                            ? `url(${getImageUrl(file.imagePath)})`
                            : `url('${file.data}')`,
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
                                fill: "var(--footer-text-color)",
                              }}
                            />
                          </span>
                        </button>
                        {dropdownVisible == f ? (
                          <div className={`${styles.dropdown}`}>
                            <ul>
                              {localImageCount > 1 && (
                                <li
                                  style={{ color: "var(--text-color)" }}
                                  onClick={() => handleOptionSelect(-1, f)}
                                >
                                  {i18?.ADDPHOTO?.MOVEBACKWARDS ||
                                    "Move backwards"}
                                </li>
                              )}
                              {localImageCount > 1 &&
                                f !== value.length - 1 && (
                                  <li
                                    style={{ color: "var(--text-color)" }}
                                    onClick={() => handleOptionSelect(1, f)}
                                  >
                                    {i18?.ADDPHOTO?.MOVEFORWARDS ||
                                      "Move forwards"}
                                  </li>
                                )}
                              {localImageCount > 1 && (
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
                                onClick={() => {
                                  handleImageDelete(f);
                                  setDropdownVisible(null);
                                }}
                              >
                                {i18?.WISHLIST?.DELETE || "Delete"}
                              </li>
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    )
                  )}
                {value &&
                  value.length >= 1 &&
                  imageCount > 1 &&
                  // Array.from(
                  //   Array(imgFiles.length - imgFiles.length + 1)
                  // ).map((addImg, a) => (
                  Array.from({ length: imageCount }).map(
                    (_, index) =>
                      index === value.length && (
                        <div
                          key={index}
                          className={`${styles.placeholder_upload} mt-2`}
                        >
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <div
                              className={`${styles.custom_fileupload} w-100 h-100`}
                              onClick={handleOpenDrawer}
                            >
                              <label
                                htmlFor="placeholderUpload"
                                className="w-100 h-100"
                              >
                                <EmptyImgIcon
                                  className="h-100 m-auto"
                                  width="32"
                                  height="32"
                                  style={{
                                    display: "block",
                                    fill: " currentcolor",
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
                  Array.from(Array(value.length - value.length + 1)).map(
                    (addImg, a) => (
                      <div
                        key={a}
                        className={`${styles.placeholder_upload} mt-2`}
                      >
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <div
                            className={`${styles.custom_fileupload} w-100 h-100`}
                            onClick={handleOpenDrawer}
                          >
                            <label
                              htmlFor="placeholderUpload"
                              className="w-100 h-100"
                            >
                              {/* <input
                                  type="file"
                                  id="placeholderUpload"
                                  className={`${styles.imageUpload}`}
                                  onChange={imageSecondaryUpload}
                                  multiple
                                  accept="image/*"
                                /> */}
                              {/* {imgFiles.length -1 ? <AddIcon className="h-100 m-auto" width="32"
                                                                          height="32"/> :  */}
                              <EmptyImgIcon
                                className="h-100 m-auto"
                                width="32"
                                height="32"
                                style={{
                                  display: "block",
                                  fill: " currentcolor",
                                }}
                              />
                              {/* } */}
                            </label>
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          )}
        </div>
      </section>
      <RightDrawer
        open={openDrawer.open}
        onClose={() => setOpenDrawer({ open: false, drawer: "" })}
      >
        <DynamicGallertModal
          fnc={onSelectedImg}
          drawer={openDrawer.drawer}
          selectedImages={value}
          close={() => setOpenDrawer({ open: false, drawer: "" })}
          imageCount={imageCount}
        />
      </RightDrawer>
    </div>
  );
}
