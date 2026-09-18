"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import CheckIcon from "@mui/icons-material/Check";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "@mui/material";
import dayjs from "dayjs";
// import Link from "next/link";

import { fetchHostAboutData } from "@/redux/slice/host/hostAboutDataSlice";
import { dispatch } from "@/redux/store";
import {
  Animal,
  Bio,
  Facts,
  Heart,
  Languages,
  School,
  Skills,
  Song,
  Spend,
  Website,
  Work
} from "@/app/global/svg";
import { APIURLS } from "@/services/config";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { GenerateUrl } from "@/services/utils/helperURL";
import { replaceStarsInEmailAddress } from "@/services/utils/sentitive";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";
// import Header from '@/components/header';
// import CustomModal from '@/components/modal';

import styles from "./page.module.scss";

const Link = dynamic(() => import("next/link"), { ssr: false });
const Header = dynamic(() => import("@/components/header"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });
const ImageComponent = dynamic(
  () => import("@/components/ImageComponent"),
  { ssr: false }
);
const CustomModal = dynamic(() => import("@/components/modal"), {
  ssr: false
});
dayjs.extend(relativeTime);

const Host = () => {
  const { i18, settings,responsiveView } = usePageContext();
	const { hiddenSettings } = settings
  const searchParams: any = useSearchParams();
  const [listdata, setData] = useState([]);
  const [attachmentData, setAttachmentData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSwiper, setOpenSwiper] = React.useState(false);
  const data = useSelector((state: any) => state.hostAbout.aboutData);
  const searchData = Object.fromEntries(searchParams);
  const DefaultprofileImage = require("../../images/defaultProfile.png");
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenSwiper(newOpen);
  };
  const { isLoading } = useSelector((state: any) => state.hostAbout);
  const fetchList = async () => {
    const response = await getApiMethod(
      `${APICONSTANT.HostListings 
        }/${searchData.id}?listingId=${searchData.listId}`
    );
    if (response.statusCode === 200) {
      // setIsLoading(false)
      setData(response.data.userListings);
      setAttachmentData(response.data.userListings.listingattachmentsData);
    } else {
      // setIsLoading(false)
    }
  };
  useEffect(() => {
    dispatch(fetchHostAboutData(searchData.id));
    fetchList();
  }, []);
  const Date = dayjs(data.verifiedDate?.split("T")[0]).toNow(true);

  const Email = replaceStarsInEmailAddress(data.email ? data.email : "", hiddenSettings?.sensitive === '1');

  return (
    <div className={`${styles.host}`}>
      <Header center="hide" page="hide" />
      {isLoading ? (
        <div className={`${styles.content}`}>
          <div className={`${styles.content_left}`}>
            <div className={`${styles.label_box}`}>
              <div className={`${styles.label_left}`}>
                <div className={`${styles.label_contentleft} text-center`}>
                  <Skeleton variant="circular" width={110} height={110} />
                  <div>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      height={30}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      height={20}
                    />
                  </div>
                </div>
                <div className={`${styles.label_right}`}>
                  <div>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      height={25}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      height={15}
                    />
                  </div>
                  {/* <hr/>
                <div>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} height={25} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} height={15} />
                </div>
                <hr/>
                <div>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} height={25} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} height={15} />
                </div> */}
                </div>
              </div>
            </div>
            <div className={`${styles.custom_box} mt-4 mb-5`}>
              <Skeleton variant="rectangular" height={20} />
              <div className={``}>
                <div className="d-flex align-items-center mt-4">
                  <div className="me-2">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </div>
                  <div>
                    <Skeleton
                      className="ms-0"
                      variant="rectangular"
                      width={200}
                      height={20}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <div className="me-2">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </div>
                  <div>
                    <Skeleton
                      className="ms-0"
                      variant="rectangular"
                      width={200}
                      height={20}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <div className="me-2">
                    <Skeleton variant="rectangular" width={20} height={20} />
                  </div>
                  <div>
                    <Skeleton
                      className="ms-0"
                      variant="rectangular"
                      width={200}
                      height={20}
                    />
                  </div>
                </div>
              </div>
              <Skeleton
                className="my-2"
                variant="rectangular"
                width={200}
                height={10}
              />
              <Skeleton
                className="ms-0"
                variant="rectangular"
                width={150}
                height={10}
              />
            </div>
          </div>
          <div className={`${styles.content_right}`}>
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem" }}
              width={150}
              height={30}
            />
            {responsiveView === "sm" || responsiveView === "xs" ? null : (
              <div className="d-flex">
                <Skeleton
                  className="me-3"
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={40}
                />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={40} />
              </div>
            )}
            <div className="mt-4">
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={580} />
            </div>
            <div className={`${styles.data}`}>
              {Array.from(Array(10)).map((item: any, index: any) => (
                <div className={styles.container} key={index}>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <Skeleton variant="rectangular" width={20} height={20} />
                    </div>
                    <div>
                      <Skeleton
                        className="ms-0"
                        variant="rectangular"
                        width={200}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div>
              <Skeleton variant="rectangular" width={200} height={40} />
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles.content}`}>
          <div className={`${styles.content_left}`}>
            <div className={`${styles.label_box}`}>
              <div className={`${styles.label_left}`}>
                <div className={`${styles.label_contentleft}`}>
                  {data.profileImage ? (
                    <ImageComponent
                      className={`${styles.images}`}
                      src={data.profileImage}
                      alt="profile"
                      width={110}
                      height={110}
                      onError={handleImageError}
                    />
                  ) : (
                    <ImageComponent
                      className={`${styles.images}`}
                      src={DefaultprofileImage}
                      alt="profile"
                      width={110}
                      height={110}
                      onError={handleImageError}
                    />
                  )}
                  <h3 className="text-center">{data.firstname}</h3>
                </div>
                <div className={`${styles.label_right}`}>
                  <p>{Date?.split(" ")[0]}</p>
                  <p>
                    {Date?.split(" ")[1]} {i18?.PROFILE?.ON || "on"} <Website />
                  </p>
                </div>
              </div>
            </div>
            <div className={`${styles.custom_box}`}>
              <h4>
                {data.firstname}’s{" "}
                {i18?.PROFILE?.CONFIRMEDINFORMATION || "Confirmed Information"}
              </h4>
              <div className={`${styles.content}`}>
                <CheckIcon />
                <p>{Email}</p>
              </div>
              {/* <div className={`${styles.verification}`}>
                            <h4>Identity Verification</h4>
                            <p>Show others you’re really you with the identity verification badge.</p>
                        </div> */}
            </div>
          </div>
          <div className={`${styles.content_right}`}>
            <h1 style={{ textTransform: "capitalize", fontWeight: "bold" }}>
              {i18?.PROFILE?.ABOUT || "About"} {data.firstname}
            </h1>
            {data.school === "" &&
            data.hobby === "" &&
            data.pet === "" &&
            data.work === "" &&
            data.song === "" &&
            data.obsessed === "" &&
            data.funFact === "" &&
            data.useLessSkill === "" &&
            data.bio === "" &&
            data.language === "" &&
            data.desc === "" ? (
              <div>
                <p className="mb-0">
                  {i18?.PROFILE?.NOTHINGABOUT || "Nothing about"}{" "}
                  {data.firstname}
                </p>
              </div>
            ) : (
              <div className={`${styles.data}`}>
                {data.school && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <School
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.WHEREIWENTTOSCHOOL ||
                          "Where I went to school"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.school}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.hobby && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Spend
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.ISPENDTOOMUCHTIME ||
                          "I spend too much time"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.hobby}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.pet && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Animal
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.ROOMPAGE?.PETS || "Pets"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.pet}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.work && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Work
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.MYWORK || "My work"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.work}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.song && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Song
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.MYFAVOURITESONGINSCHOOL ||
                          "My favourite song in school"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.song}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.obsessed && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Heart
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "#222222"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.IAMOBSESSEDWITH || "I'm obsessed with"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.obsessed}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.funFact && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Facts
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.MYFUNFACT || "My fun fact"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.funFact}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.useLessSkill && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Skills
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.MYMOSTUSELESSSKILL ||
                          "My most useless skill"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.useLessSkill}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.bio && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Bio
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.MYBIOGRAPHYTITLEWOULDBE ||
                          "My biography title would be"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.bio}</span>
                    </div>
                    <hr />
                  </div>
                )}
                {data.language && (
                  <div className={styles.container}>
                    <div className="d-flex align-items-center">
                      <Languages
                        className="me-3"
                        style={{
                          display: "block",
                          height: "24px",
                          width: "24px",
                          fill: "var(--footer-text-color)"
                        }}
                      />
                      <p className="m-0">
                        {" "}
                        {i18?.PROFILE?.LANGUAGESISPEAK || "Languages I speak"}
                        {}
                      </p>
                    </div>
                    <div>
                      <span> {data?.language}</span>
                    </div>
                    <hr />
                  </div>
                )}
              </div>
            )}

            {data.desc && (
              <div className={`${styles.container1}`}>
                <div className="d-flex align-items-center">
                  <p className="m-0">
                    {" "}
                    {i18?.PROFILE?.DESCRIPTION || "Description"}
                    {}
                  </p>
                </div>
                <div>
                  <span> {data?.desc}</span>
                </div>
              </div>
            )}
            {responsiveView === "sm" ||
            responsiveView === "xs" ||
            responsiveView === "md" ? (
              <div className="mb-5 mt-5 border-top border-bottom">
                <div className={`${styles.custom_box} mb-3 mt-3 `}>
                  <h4>
                    {data.firstname}’s{" "}
                    {i18?.PROFILE?.CONFIRMEDINFORMATION ||
                      "Confirmed Information"}
                  </h4>
                  <div className="d-flex gap-3 m-0">
                    <CheckIcon />
                    <p className="mb-0">{data.email}</p>
                  </div>
                  {/* <div className={`${styles.verification}`}>
                            <h4>Identity Verification</h4>
                            <p>Show others you’re really you with the identity verification badge.</p>
                        </div> */}
                </div>
              </div>
            ) : null}
            {listdata.length > 0 && (
              <div className="mt-3">
                <h3 style={{ fontWeight: "bold" }}>
                  <span style={{ textTransform: "capitalize" }}>
                    {data.firstname}
                  </span>
                  ’s Listings
                </h3>
                {/* <Slider {...settings}> */}
                <div className={`${styles.flex} d-flex`}>
                  {listdata &&
                    listdata.slice(0, 3).map((data: any) => (
                        <div
                          key={data}
                          style={{ width: "250px", height: "250px" }}
                        >
                          <Link
                            key={data}
                            target="blank"
                            href={GenerateUrl("/", 
                              data?.data[0]?.categoryNameData?.category,
                              data?.data[0]?.propertyName,
                              data._id.listing
                            )}
                          >
                            <ImageComponent
                              src={data.data[0].listingattachmentsData.image.coverImage}
                              alt="coverImage"
                              className={`${styles.picture}`}
                              width={250}
                              height={250}
                              onError={handleImageError}
                            />
                            <div>
                              <p className="mt-3 text-black">
                                <b>{data.data[0].propertyName}</b>
                              </p>
                              {/* <span><StarIcon /> {data.data[0].totalRatingCount}</span> */}
                            </div>
                          </Link>
                        </div>
                      ))}
                </div>
                {/* </Slider> */}
                {listdata.length > 3 && (
                  <button
                    className={`${styles.buttn}`}
                    onClick={
                      responsiveView === "sm" || responsiveView === "xs"
                        ? toggleDrawer(true)
                        : () => setOpen(true)
                    }
                  >
                    Show all {listdata.length} listings
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <CustomModal open={open} title="" onClose={() => setOpen(false)}>
        <div className="p-3">
          <h3 style={{ fontWeight: "bold" }}>
            <span style={{ textTransform: "capitalize" }}>
              {data.firstname}
            </span>
            ’s Listings
          </h3>
          <div className={`${styles.grid}`}>
            {listdata &&
              listdata.map((data: any) => (
                  <div key={data}>
                    <Link
                      key={data}
                      target="blank"
                      href={GenerateUrl("/", 
                        data?.data[0]?.categoryNameData?.category,
                        data?.data[0]?.propertyName,
                        data._id.listing
                      )}
                    >
                      <ImageComponent
                        src={data.data[0].listingattachmentsData.image.coverImage}
                        alt="coverImage"
                        className={`${styles.picture}`}
                        width={250}
                        height={250}
                        onError={handleImageError}
                      />
                      <div>
                        <p className="mt-3 text-black">
                          <b>{data.data[0].propertyName}</b>
                        </p>
                        {/* <span><StarIcon /> {data.data[0].totalRatingCount}</span> */}
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </CustomModal>
      <SwipeableDrawer
        anchor="bottom"
        open={openSwiper}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          sx: {
            maxHeight: "80%",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }
        }}
      >
        <h3
          style={{
            fontWeight: "bold",
            position: "sticky",
            top: "0",
            backgroundColor: "white",
            padding: "10px"
          }}
        >
          <span style={{ textTransform: "capitalize" }}>{data.firstname}</span>
          ’s Listings
        </h3>
        <div className="p-3">
          <div className={`${styles.grid2}`}>
            {listdata &&
              listdata.map((data: any) => (
                  <div
                    key={data}
                    style={{ width: "100%", height: "50%", margin: "auto" }}
                  >
                    <Link
                      key={data}
                      target="blank"
                      href={GenerateUrl("/", 
                        data?.data[0]?.categoryNameData?.category,
                        data?.data[0]?.propertyName,
                        data._id.listing
                      )}
                    >
                      <ImageComponent
                        src={data.data[0].listingattachmentsData.image.coverImage}
                        alt="coverImage"
                        className={`${styles.picture}`}
                        width={250}
                        height={250}
                        onError={handleImageError}
                      />
                      <div>
                        <p className="mt-3 text-black">
                          <b>{data.data[0].propertyName}</b>
                        </p>
                        {/* <span><StarIcon /> {data.data[0].totalRatingCount}</span> */}
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </SwipeableDrawer>
      <Footer />
    </div>
  );
};

export default Host;
