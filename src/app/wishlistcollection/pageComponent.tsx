"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import CustomModal from "@/components/modal";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import APICONSTANT, { APIURLS } from "@/services/config";
import SwitchHeader from "@/components/SwitchHeader";
import { deleteApiMethod, getApiMethod } from "@/services/global";
import { HeartIcon } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";
import styles from "./page.module.scss";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";

const MobileFooternav = dynamic(() => import("@/components/MobileFooterNav"));
const Link = dynamic(() => import("next/link"));
const Box = dynamic(() => import("@mui/material/Box"));

const WishListCollection = () => {
  const { i18, responsiveView } = usePageContext();
  const userInfo = useSelector((state: any) => state.userReducer);
  const navigate = useRouter();
  const [Loader, setLoader] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState<any>({
    collectionData: [],
    total: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<any>({});

  const fetchWishList = async () => {
    setLoader(true);
    try {
      const res = await getApiMethod(APICONSTANT.wishlistCollection);
      if (res.statusCode === 200) {
        setData({
          collectionData: res.data.wishLists,
          total: res.data.wishLists.length,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setIsAuth(
      typeof window !== "undefined" && localStorage?.getItem("appToken")
        ? true
        : false
    );
  }, []);

  useEffect(() => {
    if (localStorage.getItem("appUserId")) {
      fetchWishList();
    }
  }, []);

  const handleDeleteModal = (item: any) => {
    console.log("Delete Collection:", item);
    setOpen(true);
    setSelectedWishlist(item);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleDeleteCollection = async () => {
    const wishlistID = selectedWishlist?._id
    try {
      const response = await deleteApiMethod(`${APICONSTANT.wishList}/${wishlistID}`);
      if (response.statusCode === 200) {
        fetchWishList();
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {responsiveView !== "sm" && responsiveView !== "xs" && (
        <SwitchHeader center="hide" page="hide" />
      )}
      {responsiveView === "sm" || responsiveView === "xs" ? (
        <Link href="/">
          <div className="d-flex justify-content-start p-2">
            <ChevronLeftIcon sx={{ color: "black" }} />
          </div>
        </Link>
      ) : null}

      <div className={`${styles.body} wishlist-header`}>


        {Loader ? (
          <div className={styles.wishlistcollection}>
            <div className={styles.image}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.img}>
                  <Skeleton
                    variant="rectangular"
                    width={300}
                    height={280}
                    style={{ margin: "0 5px", display: "flex", borderRadius: "10px" }}
                  />
                  <Skeleton variant="text" width={120} height={20} style={{ marginLeft: "7px", marginTop: "15px" }} />
                </div>
              ))}
            </div>
          </div>
        ) : isAuth ? (
          data.total !== 0 ? (
            <div className={styles.wishlistcollection}>
              <div className={styles.header}>
                <h4>{i18?.WISHLIST?.WISHLISTCOLLECTION || "Wishlist Collection"}</h4>
                {/* Don't remove below comment */}
                {/* <button className={styles.editBtn} onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? "Done" : <EditIcon />}{isEditMode ? "" : "Edit"}
                </button> */}
              </div>
              <div className={styles.image}>
                {data.collectionData.map((items: any) => (
                  <div key={items._id} className={styles.imageContainer}>
                    {/* Delete Icon: Show if Edit Mode is ON or On Hover */}
                    <div
                      className={`${styles.deleteIcon} ${isEditMode ? styles.visible : ""}`}
                      onClick={() => handleDeleteModal(items)}
                    >
                      <CloseIcon />
                    </div>

                    {items.collectionDataCount !== 0 ? (
                      <Link href={`/wishlist?collectionId=${items._id}&Collectionname=${items.data.collectionName}`}>
                        <img
                          src={`${APIURLS.baseUrl}${items.data.img}`}
                          alt={`Image ${items._id}`}
                          loading="lazy"
                          className={styles.img}
                          onError={handleImageError}
                        />
                        <div className={styles.flexContent}>
                          <h5>{items.data.collectionName}</h5>
                          <p>{items.collectionDataCount} {i18?.WISHLIST?.SAVED || "saved"}</p>
                        </div>
                      </Link>
                    ) : (
                      <Link href={`/wishlist?collectionId=${items._id}&Collectionname=${items.data.collectionName}`}>
                        <div className={styles.nocontent}>
                          <div className={styles.innerborder}>
                            <HeartIcon
                              width="150px"
                              height="150px"
                              color="transparent"
                              style={{ stroke: "#fff", strokeWidth: 1 }}
                            />
                          </div>
                        </div>
                        <div className={styles.flexContent}>
                          <h5>{items.data.collectionName}</h5>
                          <p>0 {i18?.WISHLIST?.SAVED || "saved"}</p>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Box className={styles.Nocontent}>
              <h5>{i18?.WISHLIST?.CREATEYOURFIRSTWISHLIST || "Create your first wish list"}</h5>
              <p>{i18?.WISHLIST?.ASYOUSEARCH || "As you search, tap the heart icon to save your favorite places and experiences to a wishlist."}</p>
            </Box>
          )
        ) : (
          <Box className={styles.Nocontent}>
            <p>{i18?.WISHLIST?.LOGINTOCREATEAWISHLIST || "Login to create a wish list"}</p>
            <button onClick={() => navigate.push("/login")}>{i18?.HEADER?.LOGIN || "Login"}</button>
          </Box>
        )}

        <CustomModal
          open={open}
          onClose={handleClose}
          sx={{ fontSize: "var(--notes-text)" }}
          title={i18?.WISHLIST?.DELETETHISWISHLIST || "Delete this wishlist"}
        >
          <div className={`${styles.modal}`}>
            <>
              <div className="p-3">
                <div className={`${styles.body}`}>
                  <p>
                    {i18?.WISHLIST?.AREYOUSUREWANTTODELETE ||
                      "Are you sure want to delete"}{" "}<b>({selectedWishlist?.data?.collectionName})</b><span> collection ?</span>
                  </p>
                </div>
              </div>
              <div className={`${styles.footer} border-top`}>
                <button
                  onClick={handleClose}
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

          </div>
        </CustomModal>
      </div>

      {(responsiveView === "sm" || responsiveView === "xs") && <MobileFooternav />}
    </>
  );
};

export default WishListCollection;
