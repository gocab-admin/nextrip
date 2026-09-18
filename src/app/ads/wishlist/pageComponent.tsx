"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import Header from "@/components/header";
import {
  getApiMethod,
  patchApiMethod,
  deleteApiMethod,
  postApiMethod
} from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import { HeartIcon } from "@/app/global/svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CustomModal from "@/components/modal";
import isAuth from "@/components/isAuth";
import { addAlert } from "@/redux/slice/AlertSlice";
import { dispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { GenerateUrl } from "@/services/utils/helperURL";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import "../../../components/header.scss";
import styles from "./page.module.scss";
import { currencyRate } from "@/Utils/currencyRate";

const WishList = () => {
  const { CurrencyList } = useAppSelector(currencySelector);
  const { i18, currency,responsiveView } = usePageContext();
  const router = useRouter();
  const searchparams = useSearchParams();
  const [data, setData] = useState<any>({
    collectionData: [],
    total: 0,
    images: ""
  });
  const [id, setId] = useState<any>("");
  const [name, setName] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [rename, setRename] = useState(false);
  const [settings, setSettings] = useState(true);
  const [deleteollection, setDeleteCollection] = useState(false);
  const [renameData, setRenameData] = useState("");
  const [count, setCount] = useState(name?.length || 0);
  const [index, setIndex] = useState(0);
  const [Loader, setLoader] = useState(false);
  const fetchWishList = async (id: string | null) => {
    setLoader(true);
    try {
      const res = await getApiMethod(`${APICONSTANT.wishList  }/${id}`);
      if (res.statusCode === 200) {
        setLoader(false);
        setData({
          collectionData: res.data.wishLists,
          total: res.data.wishLists.length,
          images: res.data.wishLists[0].image?.coverImage
        });
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };
  useEffect(() => {
    const data = new URLSearchParams(window.location.search);
    const id = data.get("collectionId");
    const name = data.get("Collectionname");
    setName(name);
    setId(id);
    setCount(name?.length);
    fetchWishList(id);
  }, [searchparams]);

  const handleOpen = () => {
    setOpen(true);
    setSettings(true);
    setRename(false);
  };
  const handleClose = () => {
    setOpen(false);
    setSettings(false);
    setRename(false);
    setDeleteCollection(false);
  };
  const handleOpenRename = () => {
    setSettings(false);
    setRename(true);
  };
  const handleCloseRename = () => {
    setSettings(true);
    setRename(false);
  };
  const handleOpenDeleteCollection = () => {
    setSettings(false);
    setRename(false);
    setDeleteCollection(true);
  };
  const handleCloseDeleteCollection = () => {
    setSettings(true);
    setRename(false);
    setDeleteCollection(false);
  };
  const handleNameChange = (event: any) => {
    const newName = event.target.value;
    setRenameData(newName);

    const letterCount = newName.replace(/[^a-zA-Z]/g, "").length;
    setCount(letterCount);
  };

  const handleRename = async () => {
    try {
      const data = {
        collectionName: renameData
      };
      const res = await patchApiMethod(`${APICONSTANT.wishList  }/${id}`, data);
      if (res.statusCode === 200) {
        setRename(false);
        setOpen(false);
        setDeleteCollection(false);
        fetchWishList(id);
        // router.push(`/wishlist?collectionId=${id}&Collectionname=${encodeURIComponent(renameData)}`)
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteCollection = async () => {
    try {
      const res = await deleteApiMethod(`${APICONSTANT.wishList  }/${id}`);
      if (res.statusCode === 200) {
        setRename(false);
        setOpen(false);
        fetchWishList(id);
        router.push("/wishlistcollection");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handledelete = async (listId: any) => {
    try {
      let postData: Record<string, any> = {
        listingId: listId
      };
      const res = await postApiMethod(APICONSTANT.wishList, postData);
      if (res.statusCode === 200) {
        fetchWishList(id);
        dispatch(
          addAlert({
            isOpen: true,
            message: res.message,
            type: "success",
            severity: "success"
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header center="hide" page="hide" />
      <div className={`${styles.wishlist}`}>
        {responsiveView === "sm" || responsiveView === "xs" ? (
          <div className="d-flex justify-content-between align-items-center pt-2">
            <div className="d-flex align-item-center">
              <Link href="/wishlistcollection">
                <div className="d-flex justify-content-start ps-0 p-2">
                  <ChevronLeftIcon sx={{ color: "black" }} />
                </div>
              </Link>
              <div className={`${styles.header1} nosaves-header`}>
                <h2 className="mb-0 ">
                  {" "}
                  {data.collectionData[0]?.collectionName}
                </h2>
              </div>
            </div>
            <div onClick={handleOpen}>
              <MoreHorizIcon sx={{ cursor: "pointer" }} />
            </div>
          </div>
        ) : (
          <div className={`${styles.flexHeader}`}>
            <div className={`${styles.header} nosaves-header`}>
              <h2> {data.collectionData[0]?.collectionName}</h2>
            </div>
            <div onClick={handleOpen}>
              <MoreHorizIcon sx={{ cursor: "pointer" }} />
            </div>
          </div>
        )}
        {Loader ? (
          <>
            <div className={`${styles.image} `}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`${styles.img}`}>
                  <Skeleton
                    variant="rectangular"
                    width={300}
                    height={280}
                    style={{
                      margin: "0 5px",
                      display: "flex",
                      borderRadius: "10px"
                    }} // Adjust styling as needed
                  />
                  <Skeleton
                    variant="text"
                    width={120}
                    height={20}
                    style={{ marginLeft: "7px", marginTop: "15px" }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : data.images ? (
          <div className={`${styles.image}`}>
            {data.collectionData.map((items: any, index: number) => (
              <Link
                key={index}
                href={GenerateUrl("/ads/", 
                  items.categoryName,
                  items.listingName,
                  items.listingId
                )}
                target="_blank"
              >
                <div className={`${styles.imageContainer}`}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handledelete(items.listingId);
                    }}
                    className={`${styles.heart_icon} btn`}
                  >
                    <HeartIcon
                      width="24px"
                      height="24px"
                      color="var(--search-button-color)"
                      style={{
                        display: "block",
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        zIndex: 2,
                        stroke: "var(--btn-color)",
                        strokeWidth: 2,
                        overflow: "visible"
                      }}
                    />
                  </button>
                  <img
                    src={items.image?.coverImage}
                    alt={`Image ${items._id}`}
                    className={`${styles.img}`}
                    onError={handleImageError}
                  />
                  <div className={styles.flexContent}>
                    <p>{items.listingName} </p>
                    <p>
                      <b>
                        {CurrencyList.currency}
                        {currencyRate(items.price?.perDay, currency?.exchange_rate)}
                      </b>{" "}
                      {i18?.PRODUCT?.NIGHT || "night"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-4 nosaves-wishlist">
              <h4 className={styles.txtColor}>
                {i18?.WISHLIST?.NOSAVESYET || "No saves yet"}
              </h4>
              <p className={styles.txtColor}>
                {i18?.WISHLIST?.CLICKHEARTICONTOADD ||
                  "As you search, click the heart icon to save your favourite places and Experiences to a wishlist."}
              </p>
              <DynamicButtonComponent
                variant="outlined"
                className={`${styles.buttn}`}
                text={i18?.WISHLIST?.STARTEXPLORING || "Start exploring"}
                onClick={() => router.push("/")}
              />
            </div>
          </>
        )}

        <CustomModal
          open={open}
          onClose={handleClose}
          sx={{ fontSize: "var(--notes-text)" }}
          title={
            settings
              ? i18?.WISHLIST?.SETTINGS || "Settings"
              : rename
              ? i18?.WISHLIST?.COLLECTIONNAME || "Collection Rename"
              : i18?.WISHLIST?.DELETETHISWISHLIST || "Delete this wishlist"
          }
        >
          <div className={`${styles.modal}`}>
            {settings && (
              <div className="p-3">
                <div className={`${styles.body}`}>
                  <div
                    style={{ cursor: "pointer" }}
                    className={`${styles.bodyContent}`}
                    onClick={handleOpenRename}
                  >
                    <div className={`${styles.bodyContent1}`}>
                      <div>
                        <ModeEditOutlineIcon />
                      </div>
                      <div>
                        <p>{i18?.WISHLIST?.RENAME || "Rename"}</p>
                      </div>
                    </div>
                    <div>
                      <NavigateNextIcon />
                    </div>
                  </div>
                  <hr />
                  <div
                    style={{ cursor: "pointer" }}
                    className={`${styles.bodyContent}`}
                    onClick={handleOpenDeleteCollection}
                  >
                    <div className={`${styles.bodyContent1}`}>
                      <div>
                        <DeleteIcon />
                      </div>
                      <div>
                        <p>{i18?.WISHLIST?.DELETE || "Delete"}</p>
                      </div>
                    </div>
                    <div>
                      <NavigateNextIcon />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`${styles.modal}`}>
            {rename && (
              <>
                <div className="p-3">
                  <div className={`${styles.rename}`}>
                    <input
                      placeholder="Name"
                      onChange={handleNameChange}
                      defaultValue={data.collectionData[0].collectionName}
                    />
                    <p>{count}/50</p>
                  </div>
                </div>
                <div className={`${styles.footer} border-top`}>
                  <button
                    onClick={handleCloseRename}
                    className={`${styles.btn1}`}
                  >
                    {i18?.BOOKINGPAGE.CANCEL || "Cancel"}
                  </button>
                  <DynamicButtonComponent
                    variant="outlined"
                    onClick={handleRename}
                    text={i18?.ROOMPAGE.SAVE || "Save"}
                  />
                </div>
              </>
            )}
          </div>
          <div className={`${styles.modal}`}>
            {deleteollection && (
              <>
                <div className="p-3">
                  <div className={`${styles.body}`}>
                    <p>
                      {i18?.WISHLIST?.AREYOUSUREWANTTODELETE ||
                        "Are you sure want to delete"}{" "}
                      <b>{name}</b>
                    </p>
                  </div>
                </div>
                <div className={`${styles.footer} border-top`}>
                  <button
                    onClick={handleCloseDeleteCollection}
                    className={`${styles.btn1}`}
                  >
                    {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                  </button>
                  <DynamicButtonComponent
                    variant="outlined"
                    onClick={handleDeleteCollection}
                    text={i18?.WISHLIST?.DELETE || "Delete"}
                  />
                </div>
              </>
            )}
          </div>
        </CustomModal>
      </div>
    </>
  );
};

export default isAuth(WishList);
