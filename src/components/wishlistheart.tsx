import { useState } from "react";
import { HeartIcon } from "../app/global/svg";
import AddIcon from "@mui/icons-material/Add";
import style from "./wishlistheart.module.scss"
import styles from "./componentstyles.module.scss";
import { userSelector } from "@/redux/slice/user/userSlice";
import { useSelector } from "react-redux";
import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { getApiMethod, postApiMethod } from "@/services/global";
import { ToastComponent, ToastComponent2 } from "./toastContainer";
import { toast, ToastContainer } from "react-toastify";
import APICONSTANT from "@/services/apiConstant";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import CustomModal from "./modal";
import { usePageContext } from "@/components/Providers/PageContext";
import ImageComponent from "./ImageComponent";
import { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";
import { WishListUpdate } from "@/components/helper";
import { ThreeDots } from "react-loader-spinner";

export default function WidhListHeart(props: any) {
    const { status } = useSelector(userSelector);
    const { list, type } = props
    const isAuth = status?.loginStatus
    const { i18 } = usePageContext();
    const [wishModal, setWishModal] = useState(false);
    const [wishCollectionModal, setWishCollectionModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [CollectionName, setCollectionName] = useState("");
    const [collectionId, setcollectionId] = useState(null);
    const [collectionDataName, setCollectionDataName] = useState("");
    const [collectionDataImg, setCollectionDataImg] = useState("");
    const [data, setData] = useState({
        collectionData: [],
        total: 0
        // images: ''
    });
    const handleHeart = async (collectionId: any) => {
        try {
            let postData: Record<string, any> = {
                listingId: list?._id,
                collectionId: collectionId
            };
            const res = await postApiMethod(APICONSTANT.wishList, postData);
            if (res.statusCode === 200) {
                // fetchData({});
                WishListUpdate(list?._id, type)
                if (list?._id && collectionId) {
                    toast(
                        <ToastComponent
                            imageUrl={list?.attachmentData[0]?.image?.coverImage && list?.attachmentData[0]?.image?.coverImage}
                            onOpenModal={() => setWishModal(true)}
                            name={collectionDataName}
                        />,
                        {}
                    );
                } else {
                    toast(<ToastComponent2 />, {});
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleWishList =
        (id?: any, image?: any, collectname?: any) => async () => {
            setCollectionDataName(collectname);
            setCollectionDataImg(image);
            try {
                const data: any = {
                    collectionName: CollectionName,
                    listingId: list?._id
                };
                if (id) {
                    setcollectionId(id);
                    data.collectionId = id;
                }
                const res = await postApiMethod(APICONSTANT.wishList, data);
                if (res.statusCode === 200) {
                    setWishModal(false);
                    setWishCollectionModal(false);
                    fetchWishList();
                    // fetchData({});
                    WishListUpdate(list?._id, type)
                    if (image) {
                        toast(
                            <ToastComponent
                                imageUrl={list?.attachmentData[0]?.image?.coverImage && list?.attachmentData[0]?.image?.coverImage}
                                onOpenModal={() => setWishModal(true)}
                                name={collectname}
                            />,
                            {}
                        );
                    }
                    if (!list?.attachmentData[0]?.image?.coverImage) {
                        toast(
                            <ToastComponent
                                onOpenModal={() => setWishModal(true)}
                                name={collectname ? collectname : CollectionName}
                            />,
                            {}
                        );
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
    const fetchWishList = async () => {
        setLoader(true)
        try {
            const res = await getApiMethod(APICONSTANT.wishlistCollection);
            if (res.statusCode === 200) {
                setLoader(false)
                setData({
                    collectionData: res.data.wishLists,
                    total: res.data.wishLists.length
                    // images: res.data.collections[0].data.img
                });
            }
        } catch (err) {
            setLoader(false)
            console.error(err);
        }
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
    return (
        <>
            <div
                onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // if (data.total === 0) {
                    //   setWishModal(true);
                    // } if(data.total > 0 && collectionId === '') {
                    //   setWishCollectionModal(true);
                    // }
                    if (!isAuth) {
                        dispatch(setModal("SignupModal" as any));
                    } else {
                        if (collectionId && !list.wishlist) {
                            //api call
                            handleHeart(collectionId);
                        } else if (list.wishlist) {
                            // api call
                            handleHeart(0);
                        } else {
                            setWishModal(true);
                            fetchWishList();
                        }
                    }
                }}
                className={`${type === 'details' ? null : styles.heart_icon} btn`}
            >
                {
                    type === 'details' ?
                        <div
                            className={` d-flex align-items-center`}
                        >
                            <HeartIcon
                                className="me-2"
                                width="16px"
                                height="16px"
                                color={
                                    list?.wishlist
                                        ? "var(--search-button-color)"
                                        : "none"
                                }
                                style={{
                                    display: "block",
                                    color: "var(--svg-color)",
                                    stroke: !list.wishlist
                                        ? "currentcolor"
                                        : "var(--search-button-color)",
                                    strokeWidth: 2,
                                    overflow: "visible"
                                }}
                            />
                            <span className={`${styles.propDetails}`}>
                                {i18?.ROOMPAGE?.SAVE || "Save"}
                            </span>
                        </div>
                        :
                        list.wishlist ? (
                            <HeartIcon
                                width="24px"
                                height="24px"
                                color="var(--search-button-color)"
                                style={{
                                    display: "block",
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                    overflow: "visible"
                                }}
                            />
                        ) : (
                            <HeartIcon
                                width="24px"
                                height="24px"
                                color="rgba(0, 0, 0, 0.5)"
                                style={{
                                    display: "block",
                                    stroke: "#fff",
                                    strokeWidth: 2,
                                    overflow: "visible"
                                }}
                            />
                        )
                }

            </div>

            <CustomModal
                open={wishModal}
                onClose={handleCloseModal}
                title={i18?.WISHLIST?.YOURWISHLIST || "Your Wishlist"}
            >
                {loader ? (
                    <div className="d-flex justify-content-center">
                        <ThreeDots
                            visible={true}
                            height="80"
                            width="80"
                            color="var(--search-button-color)"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />
                    </div>
                ) : (
                    <div className={style.wishlistModalContent}>
                        {data?.total > 0 ? <div className={style.wishlistMainContainer}>
                            <div className={style.wishlistContainer}>
                                <div className={style.wishlistGridContainer}>
                                    {data.collectionData.map((items: any, index: number) => (
                                        <div key={index} className={style.wishlistWrapper}>
                                            <div
                                                className={style.wishlistCardContainer}
                                                onClick={handleWishList(
                                                    items?._id,
                                                    items?.data?.img,
                                                    items?.data?.collectionName
                                                )}
                                            >
                                                <div className={style.wishlistImageContainer}>
                                                    <ImageComponent
                                                        className={style.wishlistImage}
                                                        src={`${APIURLS.baseUrl}${items?.data?.img}`}
                                                        onError={handleImageError}
                                                        width={100}
                                                        height={100}
                                                        alt={`Image ${index}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className={style.wishlistDetailsContainer}>
                                                <div className={style.wishlistCollectionName}>
                                                    <span>{items?.data?.collectionName}</span>
                                                </div>
                                                <div className={style.wishlistCollectionCount}>
                                                    <span>
                                                        {items?.collectionDataCount}{" "}
                                                        {i18?.WISHLIST?.SAVED || "saved"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                            :
                            <div className={style.wishlistNewField}>
                                <input
                                    placeholder={i18?.WISHLIST?.COLLECTIONNAME || "Collection Name"}
                                    onChange={handleInputChange}
                                />
                                <p>
                                    {i18?.ROOMPAGE?.MAXIMUM50CHARACTERS || "maximum 50 characters"}
                                </p>
                            </div>
                        }
                        <footer className={style.wishlistFooterContainer}>
                            <DynamicButtonComponent
                                variant="contained"
                                text={i18?.WISHLIST?.CREATECOLLECTION || "Create Collection"}
                                onClick={data?.total > 0 ? handleOpenModal : handleWishList()}
                                className={styles.btn}
                                width="100%"
                            />
                        </footer>
                    </div>
                )}
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
                            {i18?.ROOMPAGE?.MAXIMUM50CHARACTERS || "maximum 50 characters"}
                        </p>
                        <DynamicButtonComponent
                            variant="contained"
                            text={i18?.WISHLIST?.CREATECOLLECTION || "Create Collection"}
                            onClick={handleWishList()}
                            className={`${styles.btn}`}
                        />
                    </div>
                </div>
            </CustomModal>
        </>

    )
}