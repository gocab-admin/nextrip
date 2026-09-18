"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IosShareIcon from "@mui/icons-material/IosShare";

import APICONSTANT, { APIURLS } from "@/services/config";
import CustomModal from "@/components/modal";
import SocialModal from "@/components/SocialModal";
import { getApiMethod, postApiMethod } from "@/services/global";
import { dispatch } from "@/redux/store";
import { addAlert } from "@/redux/slice/AlertSlice";
import { setModal } from "@/redux/slice/modalSlice";
import { getListingData } from "@/redux/slice/listdataSlice";
import { HeartIcon } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./header.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getImageUrl } from "@/components/ImageComponent";

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
};

const RoomHeader = ({ listData, productId }: any) => {
  const { i18 } = usePageContext();
  const item = useSelector((state: any) => state?.listingData);
  const router = useRouter();
  const isAuth =
    typeof window !== "undefined" && localStorage?.getItem("appToken")
      ? true
      : false;
  const searchParams: any = useSearchParams();
  const ids = productId;
  const userId =
    typeof window !== "undefined" ? localStorage?.getItem("appUserId") : null;
  const coverImage = listData?.attachmentData
    ? listData?.attachmentData?.[0]?.image.coverImage
    : "";
  const groupImages =
    listData?.attachmentData &&
      Array.isArray(listData?.attachmentData[0]?.image.groupImage)
      ? listData?.attachmentData[0]?.image.groupImage
      : [];
  const slideImages = [
    APIURLS.baseUrl + coverImage,
    ...groupImages?.map((image: any) => APIURLS.baseUrl + image.imagePath)
  ];
  const [wishModal, setWishModal] = useState(false);
  const [wishCollectionModal, setWishCollectionModal] = useState(false);
  const [CollectionName, setCollectionName] = useState("");
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const handleButtonClickShare = () => {
    setSocialModalOpen(true);
  };
  const handleCloseModal = () => {
    setWishModal(false);
  };
  const handleOpenModal = () => {
    setWishModal(false);
    setWishCollectionModal(true);
  };
  const handleCloseModalCollection = () => {
    setWishCollectionModal(false);
  };
  const handleInputChange = (event: any) => {
    setCollectionName(event.target.value);
  };
  const [data, setData] = useState({
    collectionData: [],
    total: 0
  });
  const fetchWishList = async () => {
    try {
      const res = await getApiMethod(APICONSTANT.wishlistCollection);
      if (res.statusCode === 200) {
        setData({
          collectionData: res.data.wishLists,
          total: res.data.wishLists.length
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleWishList = (collectionId?: any) => async () => {
    try {
      let postData: any = {
        collectionName: CollectionName,
        listingId: ids,
        collectionId: collectionId
      };
      const res = await postApiMethod(APICONSTANT.wishList, postData);
      if (res.statusCode === 200) {
        setWishModal(false);
        setWishCollectionModal(false);
        dispatch(getListingData(ids, userId));
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
  const handleButtonHeart = async () => {
    if (!isAuth) {
      dispatch(setModal("SignupModal" as any));
    } else {
      if (item.ListingData.wishlist) {
        try {
          const res = await postApiMethod(APICONSTANT.wishList, {
            listingId: listData._id
          });
          if (res.statusCode === 200) {
            dispatch(getListingData(ids, userId));
            dispatch(
              addAlert({
                isOpen: true,
                message: res.message,
                type: "success",
                severity: "success"
              })
            );
          } else {
            // Handle other status codes or conditions if needed
            console.error(res.message);
          }
        } catch (err) {
          // Handle API call errors
          console.error(err);
        }
      } else {
        setWishModal(true);
      }
    }
  };
  useEffect(() => {
    if (isAuth) {
      fetchWishList();
    }
  }, []);
  return (
    <div className={`${styles.main}`}>
      <div className="position-relative ">
        <Slider {...settings}>
          {slideImages.map((image, index) => (
            <div key={index}>
              {image ? (
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className={`${styles.image}`}
                  onError={handleImageError}
                />
              ) : (
                <Skeleton variant="rectangular" sx={{ width: "100" }} />
              )}
            </div>
          ))}
        </Slider>
        <div
          className={`${styles.header}  position-absolute top-0 start-0 end-0`}
        >
          <div
            className={`${styles.backArrow}`}
            onClick={() => router.push("/")}
          >
            <div>
              <ChevronLeftIcon
                sx={{
                  marginRight: "3px",
                  marginBottom: "2px",
                  color: "rgb(0,0,0)"
                }}
              />
            </div>
          </div>
          <div className="d-flex gap-3">
            <div
              className={`${styles.backArrow}`}
              onClick={handleButtonClickShare}
            >
              <div>
                <IosShareIcon
                  sx={{
                    fontSize: "20px",
                    marginBottom: "4px",
                    marginRight: "1px",
                    color: "rgb(0,0,0)"
                  }}
                />
              </div>
            </div>
            <div className={`${styles.backArrow}`} onClick={handleButtonHeart}>
              <div>
                <HeartIcon
                  width="20px"
                  height="20px"
                  style={{
                    fontSize: "20px",
                    margin: "1px",
                    marginBottom: "2px",
                    marginRight: "2px",
                    fill: item.ListingData.wishlist
                      ? "var(--search-button-color)"
                      : "none",
                    stroke: !item.ListingData.wishlist
                      ? "rgb(0,0,0)"
                      : "var(--search-button-color)",
                    strokeWidth: 2
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomModal
        open={wishModal}
        onClose={handleCloseModal}
        title={i18?.WISHLIST?.YOURWISHLIST || "Your Wishlist"}
      >
        <div className="p-3">
          {data.total > 0 ? (
            <div className={`${styles.modal}`}>
              <div onClick={handleOpenModal} className={`${styles.flexBox}`}>
                <div className={`${styles.box}`}>
                  <AddIcon sx={{ fontSize: "50px", color: "#767676" }} />
                </div>
                <div className={`${styles.flexcontent}`}>
                  <h5>
                    {i18?.ROOMPAGE?.CREATENEWWISHLIST || "create new wishlist"}
                  </h5>
                </div>
              </div>
              <div className={`${styles.image}`}>
                {data.collectionData.map((items: any, index: number) => (
                  <div
                    key={index}
                    className={`${styles.imageContainer}`}
                    onClick={handleWishList(items._id)}
                  >
                    <div className={styles.flexImage}>
                      {items.data.img ? (
                        <img
                          className={`${styles.img}`}
                          src={`${APIURLS.baseUrl}${items.data.img}`}
                          width={64}
                          height={64}
                          alt={`Image ${index}`}
                          onError={handleImageError}
                        />
                      ) : (
                        <div className={`${styles.noImage}`}>
                          <HeartIcon
                            width="44px"
                            height="44px"
                            color="var(--search-button-color)"
                            style={{
                              stroke: "#fff",
                              strokeWidth: 1
                            }}
                          />
                        </div>
                      )}
                      <div className={styles.flexContent}>
                        <h5>{items.data.collectionName}</h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`${styles.modal}`}>
              <input
                placeholder={i18?.WISHLIST?.COLLECTIONNAME || "Collection Name"}
                onChange={handleInputChange}
              />
              <p>
                {i18?.ROOMPAGE?.MAXIMUM50CHARACTERS || "Maximun 50 Characters"}
              </p>
              <button onClick={handleWishList()} className={`${styles.btn}`}>
                {i18?.WISHLIST?.CREATECOLLECTION || "Create Collection"}
              </button>
            </div>
          )}
        </div>
      </CustomModal>

      <CustomModal
        open={wishCollectionModal}
        onClose={handleCloseModalCollection}
        title={i18?.WISHLIST?.YOURWISHLIST || "Your Wishlist"}
      >
        <div className="p-3">
          <div className={`${styles.modal}`}>
            <input
              placeholder={i18?.WISHLIST?.COLLECTIONNAME || "Collection Name"}
              onChange={handleInputChange}
            />
            <p>
              {i18?.ROOMPAGE?.MAXIMUM50CHARACTERS || "Maximun 50 Characters"}
            </p>
            <button onClick={handleWishList()} className={`${styles.btn}`}>
              {i18?.WISHLIST?.CREATECOLLECTION || "Create Collection"}
            </button>
          </div>
        </div>
      </CustomModal>
      <CustomModal
        open={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
      >
        <SocialModal
          image={getImageUrl(coverImage)}
          name={item.ListingData.propertyName}
        />
      </CustomModal>
    </div>
  );
};

export default RoomHeader;
