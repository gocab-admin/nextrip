"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

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
import MapComponent from "../../components/map/wishlistMapView";
import "../../components/header.scss";
import styles from "./page.module.scss";
import SwitchHeader from "../../components/SwitchHeader";
import { getWishlistCollection } from "@/redux/slice/footerSlice";
import { useSelector } from "react-redux";
import useMapLoader from "@/hooks/useMapLoader";

const WishList = () => {
  const { isLoaded } = useMapLoader(); // important one if you refresh the page without this getting error like google.maps.map is not a constructor
  const { CurrencyList } = useAppSelector(currencySelector);
  const { i18, currency, responsiveView, settings } = usePageContext();
  const { getWishlistData } = useSelector((state: any) => state.cmsSlice)
  const { google } = settings;
  const APIKEY = google?.mapApiKey;
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
  const [setting, setSetting] = useState(true);
  const [deleteollection, setDeleteCollection] = useState(false);
  const [renameData, setRenameData] = useState("");
  const [count, setCount] = useState(name?.length || 0);
  const [index, setIndex] = useState(0);
  const [Loader, setLoader] = useState(false);

  const fetchWishlist = async () => {
    setLoader(true);
    if (id) {
      try {
        await dispatch(getWishlistCollection(id)); // Wait for API call to complete
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [id, dispatch]);

  useEffect(() => {
    const data = new URLSearchParams(window.location.search);
    const id = data.get("collectionId");
    const name = data.get("Collectionname");
    setName(name);
    setId(id);
    setCount(name?.length);
    dispatch(getWishlistCollection(id));
  }, [searchparams]);

  const handleOpen = () => {
    setOpen(true);
    setSetting(true);
    setRename(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSetting(false);
    setRename(false);
    setDeleteCollection(false);
  };

  const handleOpenRename = () => {
    setSetting(false);
    setRename(true);
  };

  const handleCloseRename = () => {
    setSetting(true);
    setRename(false);
  };

  const handleOpenDeleteCollection = () => {
    setSetting(false);
    setRename(false);
    setDeleteCollection(true);
  };

  const handleCloseDeleteCollection = () => {
    setSetting(true);
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
      const res = await patchApiMethod(`${APICONSTANT.wishList}/${id}`, data);
      if (res.statusCode === 200) {
        setRename(false);
        setOpen(false);
        setDeleteCollection(false);
        dispatch(getWishlistCollection(id));
        // router.push(`/wishlist?collectionId=${id}&Collectionname=${encodeURIComponent(renameData)}`)
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCollection = async () => {
    try {
      const res = await deleteApiMethod(`${APICONSTANT.wishList}/${id}`);
      if (res.statusCode === 200) {
        setRename(false);
        setOpen(false);
        dispatch(getWishlistCollection(id));
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
        dispatch(getWishlistCollection(id));
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
      <SwitchHeader center="hide" page="hide" />
      <div className={styles.wishlistMainContainer}>
        <div className={styles.wishlistContainer}>

          {/* Header */}
          <div className={styles.wishlistHeadingMainContainer}>
            <div className={styles.wishlistHeadingContainer}>
              <div className={styles.wishlistBackIcon}>
                <Link href="/wishlistcollection">
                  <ChevronLeftIcon sx={{ color: "black" }} />
                </Link>
              </div>
              <h4>{getWishlistData[0]?.collectionName}</h4>
            </div>
            <MoreHorizIcon sx={{ cursor: "pointer" }} onClick={handleOpen} />
          </div>

          {/* Wishlist Images */}
          <div className={styles.wishlistImageMainContainer}>
            {Loader ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={styles.wishlistImageContainer}>
                  <Skeleton variant="rectangular" width="100%" height={220} />
                  <Skeleton variant="text" width={120} height={20} style={{ marginTop: "10px" }} />
                </div>
              ))
            ) : getWishlistData[0]?.image?.coverImage ? (
              getWishlistData?.map((items: any, index: number) => (
                <Link
                  key={index}
                  href={GenerateUrl("/", items.categoryName, items.listingName, items.listingId)}
                  target="_blank"
                >
                  <div className={styles.wishlistImageContainer}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handledelete(items.listingId);
                      }}
                      className={`${styles.wishlistHeartBtn} btn`}
                    >
                      <HeartIcon
                        width="24px"
                        height="24px"
                        color="var(--search-button-color)"
                        stroke="var(--btn-color)"
                        strokeWidth={2}
                      />
                    </button>
                    <img
                      src={APIURLS.baseUrl + items.image?.coverImage}
                      alt={`Image ${items._id}`}
                      className={styles.wishlistImage}
                      onError={handleImageError}
                    />
                    <div className={styles.wishlistCollectionDetails}>
                      <p>{items.listingName}</p>
                      <p>
                        <b>
                          {CurrencyList.currency}
                          {Math.round(parseFloat(items.price?.perDay) * parseFloat(currency?.exchange_rate)).toLocaleString("en-IN")}
                        </b>{" "}
                        {i18?.PRODUCT?.NIGHT || "night"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div>
                <p>{i18?.WISHLIST?.NOSAVESYET || "No saves yet"}</p>
                <p>{i18?.WISHLIST?.CLICKHEARTICONTOADD ||
                  "As you search, click the heart icon to save your favourite places and Experiences to a wishlist."}
                </p>
                <DynamicButtonComponent
                  variant="outlined"
                  className={`${styles.buttn}`}
                  text={i18?.WISHLIST?.STARTEXPLORING || "Start exploring"}
                  onClick={() => router.push("/")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        {APIKEY && isLoaded && (
          <div className={styles.wishlistMapContainer}>
            <MapComponent />
          </div>
        )}
      </div>

      <CustomModal
        open={open}
        onClose={handleClose}
        sx={{ fontSize: "var(--notes-text)" }}
        title={
          setting
            ? i18?.WISHLIST?.SETTINGS || "Settings"
            : rename
              ? i18?.WISHLIST?.COLLECTIONNAME || "Collection Rename"
              : i18?.WISHLIST?.DELETETHISWISHLIST || "Delete this wishlist"
        }
      >
        <div className={`${styles.modal}`}>
          {setting && (
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
                    defaultValue={getWishlistData[0]?.collectionName}
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
    </>
  );
};

export default isAuth(WishList);