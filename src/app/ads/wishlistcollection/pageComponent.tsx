"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import APICONSTANT, { APIURLS } from "@/services/config";
import Header from "@/components/header";
import { getApiMethod } from "@/services/global";
import { HeartIcon } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";

const MobileFooternav = dynamic(
  () => import("@/components/MobileFooterNav")
);
const Link = dynamic(() => import("next/link"));
const Box = dynamic(() => import("@mui/material/Box"));

const WishListCollection = () => {
  const { i18 ,responsiveView} = usePageContext();
  const userInfo = useSelector((state: any) => state.userReducer);
  const navigate = useRouter();
  const [Loader, setLoader] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState<any>({
    collectionData: [],
    total: 0
  });
  const fetchWishList = async () => {
    setLoader(true);
    try {
      const res = await getApiMethod(APICONSTANT.wishlistCollection);
      if (res.statusCode === 200) {
        setLoader(false);
        setData({
          collectionData: res.data.wishLists,
          total: res.data.wishLists.length
        });
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
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


  return (
    <>
      {responsiveView === "sm" || responsiveView === "xs" ? null : (
        <Header center="hide" page="hide" />
      )}
      {responsiveView === "sm" || responsiveView === "xs" ? (
        <Link href="/">
          <div className="d-flex justify-content-start p-2">
            <ChevronLeftIcon sx={{ color: "black" }} />
          </div>
        </Link>
      ) : null}

            <div className={`${styles.body} wishlist-header`}>
                <div className={`${styles.header} `}>
                    <h2>{i18?.WISHLIST?.WISHLISTCOLLECTION || "Wishlist collection"}</h2>
                </div>
                {
                    Loader ?
                        <>
                            <div className={`${styles.wishlistcollection}`}>
                                <div className={`${styles.image}`}>
                                 
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className={`${styles.img}`}>
                                            <Skeleton
                                                variant="rectangular"
                                                width={300}
                                                height={280}
                                                style={{ margin: '0 5px' ,display:'flex' ,borderRadius:'10px'}} // Adjust styling as needed
                                            />
                                            <Skeleton variant="text" width={120} height={20} style={{marginLeft:'7px',marginTop:'15px'}}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            
                        </>
                        :

                        isAuth ?
                            data.total !== 0 ?
                                <div className={`${styles.wishlistcollection}`}>
                                    <div className={`${styles.image}`}>
                                        {data.collectionData.map((items: any, index: number) => (
                                            <div key={items._id} className={`${styles.imageContainer}`}>
                                                {items.collectionDataCount !==0 ?
                                                    <Link href={`/ads/wishlist?collectionId=${items._id}&Collectionname=${items.data.collectionName}`}>
                                                        <img src={`${APIURLS.baseUrl}${items.data.img}`} alt={`Image ${items._id}`} loading="lazy" className={`${styles.img}`} onError={handleImageError}/>
                                                        <div className={styles.flexContent}>
                                                            <h5>{items?.data?.collectionName}</h5>
                                                            <p >{items.collectionDataCount} {i18?.WISHLIST?.SAVED || "saved"}</p>
                                                        </div>
                                                    </Link>
                                                    :
                                                    <>
                                                        <Link href={`/ads/wishlist?collectionId=${items._id}&Collectionname=${items.data.collectionName}`}>
                                                            <div className={`${styles.nocontent}`}>
                                                                <div className={`${styles.innerborder}`}>
                                                                    <HeartIcon
                                                                        width="150px"
                                                                        height="150px"
                                                                        color="transparent"
                                                                        style={{
                                                                            stroke: '#fff',
                                                                            strokeWidth: 1

                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className={styles.flexContent}>
                                                                <h5>{items.data.collectionName}</h5>
                                                                <p >0 {i18?.WISHLIST?.SAVED || "saved"}</p>
                                                            </div>
                                                        </Link>
                                                    </>
                                                }
                                            </div>

                                        ))}
                                    </div>
                                </div>
                                :
                                <Box className={`${styles.Nocontent} `}>
                                    <>
                                        <h5>{i18?.WISHLIST?.CREATEYOURFIRSTWISHLIST || "Create your first wish list"}</h5>
                                        <p>{i18?.WISHLIST?.ASYOUSEARCH || "As you search,tap the heart icon to save your favourite places and Experiences to a wishlist"}</p>
                                    </>
                                </Box>


                            :
                            <Box className={`${styles.Nocontent}`}>
                                <>
                                    <p>{i18?.WISHLIST?.LOGINTOCREATEAWISHLIST || "Login to create wish list"}</p>
                                    <button onClick={() => navigate.push('/login')}>{i18?.HEADER?.LOGIN || "Login"}</button>

                                </>
                            </Box>
                }




            </div>
            {
                (responsiveView === 'sm' || responsiveView === 'xs') && (
                    <MobileFooternav />
                )
            }


        </>

    )
}

export default WishListCollection;
