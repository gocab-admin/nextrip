"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FaUserCircle } from "react-icons/fa";
import SendIcon from "@mui/icons-material/Send";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
dayjs.extend(relativeTime);

import ImageComponent from "@/components/ImageComponent";
import Header from "@/components/header";
import { MoroKingIcon } from "@/app/global/svg";
import { fetchProviderListingData } from "@/redux/slice/host/providerlistingsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import APICONSTANT, { APIURLS } from "@/services/config";
import { getApiMethod, postApiMethod } from "@/services/global";
import Textarea from "@/components/textArea";
import Footer from "@/components/footer";
import { userSelector } from "@/redux/slice/user/userSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import isAuth from "@/components/isAuth";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";

const Radio = dynamic(() => import("@mui/material/Radio"));
const RadioGroup = dynamic(() => import("@mui/material/RadioGroup"));
const FormControl = dynamic(() => import("@mui/material/FormControl"));
const FormControlLabel = dynamic(
  () => import("@mui/material/FormControlLabel")
);
const CustomModal = dynamic(() => import("@/components/modal"));

const Reviews = () => {
  const { i18,responsiveView } = usePageContext();
  const { userInfo } = useAppSelector(userSelector);
  const { profileImage, firstname , lastname} = userInfo;
  console.log('userInfo',userInfo)
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");
  const [reviewdata, setReviewData] = useState<any>({
    total: 0,
    Reviewdata: []
  });
  const [open, setOpen] = useState(false);
  const review = async () => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.reviewRating  }/${value}?_page=1&_limit=90`
      );
      if (response.statusCode === 200) {
        setOpen(false);
        setReviewData({
          Reviewdata: response.data.reviewAndRating,
          total: response.data.totalCount
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
    const [data, setData] = useState<any>({
        total: 0,
        listingdata: []
    })

    const switchTranslation = (data: any) => {
        switch (data) {
          case 'months':
            return i18?.DATES?.MONTHSON || 'months on';
          case 'days':
            return i18?.DATES?.DAYSON || 'days on';
          case 'years':
            return i18?.DATES?.YEARSON || 'years on';
          case 'hours':
            return i18?.DATES?.HOURSON || 'hours on';
          case 'minutes':
            return i18?.DATES?.MINUTESON || 'minutes on';
          default:
            return data;
        }
    }

  const providerlisting = async () => {
    try {
      const res = await dispatch(fetchProviderListingData({},'approve'));
      setValue(res.data.providerListings[0]._id);
      setData({
        listingdata: res.data.providerListings,
        total: res.data.total
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    providerlisting();
  }, []);
 
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const selectedItem = useMemo(() => data.listingdata.find((item: any) => item._id === value), [value]);
  useEffect(() => {
    if (value) {
      review();
    }
  }, [value]);

  const profile = data.listingdata.providerData?.profileImage;
  const Name = data.listingdata.providerData?.firstname;
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [modaldata, setModalData] = useState({
    name: "",
    date: "",
    review: "",
    img: "",
    id: ""
  });
  const handleOpenReplyModal = (
    name: any,
    date: any,
    review: any,
    img: any,
    id: any
  ) => {
    setOpenReplyModal(true);
    setModalData({
      name: name,
      date: date,
      review: review,
      img: img,
      id: id
    });
  };
  const handleCloseReplyModal = () => {
    setOpenReplyModal(false);
  };
  const [textareaValue, setTextareaValue] = useState("");
  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
  };
  const handleSendReply = async () => {
    try {
      const data = {
        type: "provider",
        response: textareaValue,
        reviewId: modaldata.id
      };
      const response = await postApiMethod(
        `${APICONSTANT.reviewRating  }/${value}`,
        data
      );
      if (response.statusCode === 200) {
        setOpenReplyModal(false);
        review();
        dispatch(
          addAlert({
            isOpen: true,
            message: response.message,
            type: "success",
            severity: "success"
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [viewreply, setveiwReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<any>("");
  const handleViewReply = (reviewId: any) => {
    setExpandedReplies((prev: string) => {
      if (prev === reviewId) return "";
      return reviewId;
    });
    // if (viewreply) {
    //     setveiwReply(false)
    // } else {
    //     setveiwReply(true)
    // }
  };
  const selectedReplyId = useMemo(() => reviewdata.Reviewdata?.find(
      (item: any) => item.reviewRating._id === expandedReplies
    ), [expandedReplies]);
    return ( 
        <>
            <div>
                <Header page='hide' center={responsiveView === 'sm' || responsiveView === 'xs' ? 'center' : 'inbox'} type='provider' />
            </div>
            <div className={`${styles.reviews}`}>
                <div className={`${styles.container}`}>
                    {/* <InsightTabs /> */}
                    <div className={`${styles.main_content}`}>
                        <h1>{i18?.REVIEWS?.REVIEWS || "Reviews"}</h1>
                        {data.total > 0 &&
                            <span onClick={handleOpen}>{selectedItem?.propertyName}
                                {open ? <ArrowDropUpIcon sx={{ marginBottom: '2px' }} /> : <ArrowDropDownIcon sx={{ marginBottom: '2px' }} />}
                            </span>
                        }
                        {reviewdata.total > 0 ? (
                            <div className={`${styles.comments}`}>
                                {reviewdata.Reviewdata && reviewdata.Reviewdata.map((item: any, index: any) => (
                                    <div className={`${styles.grid} pb-3`} key={index}>
                                        <div>
                                            <div className="d-flex align-items-center">
                                                <ImageComponent src={item.userProfileImage} className={`${styles.imgradius}`} width={40} height={40} alt='' onError={handleImageError}/>
                                                <div className=" ms-2">
                                                    <h5 className="m-0">{item?.userFirstname} {item?.userLastname}</h5>
                                                    {/* <span>{dayjs(item.reviewRating.dateOfReview.split('T')[0]).toNow(true)} {i18?.REVIEWS?.AGO || "ago"}</span> */}
                                                    <span>{switchTranslation(dayjs(item.reviewRating.dateOfReview)).toNow(true)}</span>
                                                </div>
                                            </div>
                                            <div className="pb-3">
                                                <b>{item.reviewRating.review}</b>
                                                {item.reviewRating.reply.length > 0 &&
                                                    <div className="pt-3" onClick={() => handleViewReply(item?.reviewRating?._id)}><h6 >{expandedReplies === item?.reviewRating?._id ? (i18?.REVIEWS?.HIDEREPLY || "--hide reply-- ") : (i18?.REVIEWS?.VIEWREPLY || "--view reply--")}  </h6></div>}
                                                {selectedReplyId && selectedReplyId?.reviewRating?._id === item?.reviewRating?._id &&
                                                    <>
                                                        {item.reviewRating.reply.map((data: any, id: any) => (
                                                            <div className="" key={id}>
                                                                <div className="d-flex align-items-center ms-5  ">
                                                                    {profileImage ?
                                                                        <ImageComponent src={profileImage} className={`${styles.imgradius}`} width={40} height={40} alt='' onError={handleImageError}/>
                                                                        : <FaUserCircle style={{ width: '40px', height: '40px' }} />
                                                                    }
                                                                    <div className=" ms-2">
                                                                        <h6 className="m-0 ">{i18?.REVIEWS?.RESPONSEFROM || "Response from"} <b>{firstname} {lastname}</b></h6>
                                                                        {/* <span>{dayjs(data.dateOfReview.split('T')[0]).toNow(true)} {i18?.REVIEWS?.AGO || "ago"}</span> */}
                                                                        <span>{switchTranslation(dayjs(data?.dateOfReview)).toNow(true)}</span>
                                                                    </div>

                                                                </div>
                                                                <div className=" ms-5 ">
                                                                    <b>{data.response}</b>
                                                                </div>

                                                            </div>
                                                        ))
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        {item.reviewRating.reply.length > 0 ? <></>
                                            :
                                            <div className={`${styles.replyIcon}`} onClick={() => handleOpenReplyModal(item.userFirstname, dayjs(item.reviewRating.dateOfReview.split('T')[0]).toNow(true), item.reviewRating.review, item.userProfileImage, item.reviewRating._id)}>
                                                <ReplyAllIcon />
                                            </div>
                                        }

                                    </div>
                                ))
                                }


                            </div>
                        ) : (
                            <div className={`${styles.reviews_sec} mt-4`}>
                                <div className="px-3 py-4 d-flex flex-column align-items-center">
                                    <MoroKingIcon width="48" height="48" color="var(--search-button-color)" />
                                    <p className={`${styles.reviews_title} mt-3 mb-0`}>{i18?.REVIEWS?.YOURFIRSTREVIEWWILLSHOWUPHERE || "Your first review will show up here"}</p>
                                    <span className={`${styles.reviews_smallcontent} mt-2 mb-0`}>{i18?.REVIEWS?.WEWILLLETYOUKNOW || "We’ll let you know when guests leave feedback"}</span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
            <Footer />
            <CustomModal open={open} onClose={handleClose} title={i18?.REVIEWS?.SELECTALISTING || 'Select a listing'}>
                <div>
                    {data.listingdata.map((option: any) => (
                        <>
                            <div className={`${styles.ContentFlex}`}>
                                <div className={`${styles.content}`} key={option._id}>
                                    {/* <img width={60} height={40} src={option.coverImage} alt="pro" className={`${styles.img}`} /> */}
                                    <ImageComponent width={60} height={40} src={option.coverImage} alt="pro" className={`${styles.img}`} onError={handleImageError}/>
                                    <p className="ps-3 mb-0">{option.propertyName}</p>
                                </div>
                                <div>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={value}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value={option._id}
                                                checked={value === option._id}
                                                onChange={(e: any) => {
                                                    setValue(e.target.value);
                                                }}
                                                control={<Radio sx={{
                                                    mt: 2,
                                                    color: "black",
                                                    marginRight: "8px",
                                                    '&.Mui-checked': {
                                                        color: "black"
                                                    }
                                                }} />} label="" className="mr-0" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>

                        </>

                    ))}
                </div>
            </CustomModal>
            <CustomModal open={openReplyModal} onClose={handleCloseReplyModal} title='Reply'>
                <div className={`${styles.header}`}>
                    <div className="p-3">
                        <div className="d-flex align-items-center ">
                            <ImageComponent src={modaldata.img} className={`${styles.imgradius}`} width={40} height={40} alt='' />
                            <div className=" ms-2">
                                <h5 className="m-0">{modaldata.name}</h5>
                                <span>{modaldata.date} {i18?.REVIEWS?.AGO || "ago"}</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <b>{modaldata.review}</b>
                        </div>
                    </div>
                    <div className="p-3">
                        <Textarea
                            className={`${styles.Textarea} `}
                            onChange={handleTextareaChange}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end p-2 border-top">
                    <button onClick={handleSendReply} className={`${styles.button}`} disabled={textareaValue.trim() === ""}>{i18?.REVIEWS?.SEND || "Send"} <SendIcon /></button>
                </div>

            </CustomModal>
        </>
    )
}

export default isAuth(Reviews)
