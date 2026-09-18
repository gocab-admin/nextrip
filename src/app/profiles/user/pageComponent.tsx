"use client";
import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
  Work,
} from "@/app/global/svg";
import SwitchHeader from "@/components/SwitchHeader";
import { fetchUserAboutData } from "@/redux/slice/user/userAboutDataSlice";
import { dispatch } from "@/redux/store";
import { APIURLS } from "@/services/config";
import isAuth from "@/components/isAuth";
import { replaceStarsInEmailAddress } from "@/services/utils/sentitive";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";

dayjs.extend(relativeTime);

const Link = dynamic(() => import("next/link"));
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
const Footer = dynamic(() => import("@/components/footer"));

const User = () => {
  const { i18, settings, responsiveView } = usePageContext();
  const { hiddenSettings } = settings;
  const router = useRouter();
  const DefaultprofileImage = require("../../images/defaultProfile.png");
  const [userStatus, setUserStatus] = useState<any>({});
  const [profile, setProfile] = useState("public/");
  const [isLoading, setIsLoading] = useState(true);
  const Email = replaceStarsInEmailAddress(
    userStatus?.email ? userStatus?.email : "",
    hiddenSettings?.sensitive === "1"
  );

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(fetchUserAboutData());
      if (res.statusCode === 200) {
        setIsLoading(false);
        setUserStatus(res.data.userDetail);
        setProfile(res.data.userDetail.profileImage);
      } else {
        console.error("Error: Something went wrong");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error: Network request failed");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const Name =
    userStatus?.firstname?.charAt(0).toUpperCase() +
    userStatus?.firstname?.slice(1);
  let Date = "";
  if (userStatus?.verifiedDate)
    Date = dayjs(userStatus?.verifiedDate).toNow(true);

  const handleRoute = () => {
    router.push("/account-settings/");
  };
  return (
    <div className={`${styles.user} `}>
      {responsiveView === "sm" || responsiveView === "xs" ? (
        <div className={`${styles.mobileHeader}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div onClick={handleRoute}>
              <ArrowBackIosIcon sx={{ fontSize: "20px" }} />
            </div>
            <Link href={"/profiles/user/editUser"}>
              <button className={`${styles.edit_btn}`}>{`${
                i18?.BOOKINGPAGE?.EDIT || "Edit"
              } ${i18?.HEADER?.PROFILE || "Profile"}`}</button>
            </Link>
          </div>
        </div>
      ) : (
        <SwitchHeader center="hide" page="hide" />
      )}
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
                <div className={`${styles.label_contentleft} text-center`}>
                  {profile ? (
                    <ImageComponent
                      className={`${styles.images}`}
                      src={profile}
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
                  <h3 className="text-truncate mw-50">{Name}</h3>
                </div>
                <div className={`${styles.label_right}`}>
                  <h5 className="mb-0">{Date?.split(" ")[0]}</h5>
                  <p>
                    {Date?.split(" ")[1]} {i18?.PROFILE?.ON || "on"} <Website />
                  </p>
                </div>
              </div>
            </div>
            <div className={`${styles.custom_box} mb-3 account-page`}>
              <h4 className="text-truncate">
                {Name}{" "}
                {i18?.PROFILE?.CONFIRMEDINFORMATION || "Confirmed Information"}
              </h4>
              <div className={`${styles.content}`}>
                <CheckIcon />
                <h5 className="text-truncate">{Email}</h5>
              </div>
              {/* <div className={`${styles.verification}`}>
                            <h4>Identity Verification</h4>
                            <p>Show others you’re really you with the identity verification badge.</p>
                        </div> */}
            </div>
          </div>
          <div className={`${styles.content_right} account-page`}>
            <h1 className="text-truncate w-50">
              {i18?.PROFILE?.ABOUT || "About"} {Name}
            </h1>
            {responsiveView === "sm" ||
            responsiveView === "xs" ? null : userStatus.school === "" &&
              userStatus.hobby === "" &&
              userStatus.pet === "" &&
              userStatus.work === "" &&
              userStatus.song === "" &&
              userStatus.obsessed === "" &&
              userStatus.funFact === "" &&
              userStatus.useLessSkill === "" &&
              userStatus.bio === "" &&
              userStatus.language === "" ? (
              <div className="">
                <Link href={"/profiles/user/editUser"}>
                  <button className={`${styles.buttn}`}>
                    {i18?.TRIPS?.CREATEPROFILE || "Create Profile"}
                  </button>
                </Link>
              </div>
            ) : (
              <Link href={"/profiles/user/editUser"}>
                <button className={`${styles.buttn}`}>{`${
                  i18?.BOOKINGPAGE?.EDIT || "Edit"
                } ${i18?.HEADER?.PROFILE || "Profile"}`}</button>
              </Link>
            )}

            <div className={`${styles.data}`}>
              {userStatus.school && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <School
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
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
                    <span> {userStatus?.school}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.hobby && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Spend
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
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
                    <span> {userStatus?.hobby}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.pet && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Animal
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
                      }}
                    />
                    <p className="m-0">
                      {" "}
                      {i18?.ROOMPAGE?.PETS || "Pets"}
                      {}
                    </p>
                  </div>
                  <div>
                    <span> {userStatus?.pet}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.work && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Work
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "#222222",
                      }}
                    />
                    <p className="m-0">
                      {" "}
                      {i18?.PROFILE?.MYWORK || "My work"}
                      {}
                    </p>
                  </div>
                  <div>
                    <span> {userStatus?.work}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.song && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Song
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
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
                    <span> {userStatus?.song}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.obsessed && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Heart
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
                      }}
                    />
                    <p className="m-0">
                      {" "}
                      {i18?.PROFILE?.IAMOBSESSEDWITH || "I'm obsessed with"}
                      {}
                    </p>
                  </div>
                  <div>
                    <span> {userStatus?.obsessed}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.funFact && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Facts
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
                      }}
                    />
                    <p className="m-0">
                      {" "}
                      {i18?.PROFILE?.MYFUNFACT || "My fun fact"}
                      {}
                    </p>
                  </div>
                  <div>
                    <span> {userStatus?.funFact}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.useLessSkill && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Skills
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
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
                    <span> {userStatus?.useLessSkill}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.bio && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Bio
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
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
                    <span> {userStatus?.bio}</span>
                  </div>
                  <hr />
                </div>
              )}
              {userStatus.language && (
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    <Languages
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)",
                      }}
                    />
                    <p className="m-0">
                      {" "}
                      {i18?.PROFILE?.LANGUAGESISPEAK || "Languages I speak"}
                      {}
                    </p>
                  </div>
                  <div>
                    <span> {userStatus?.language}</span>
                  </div>
                  <hr />
                </div>
              )}
            </div>
            {responsiveView === "sm" ||
            responsiveView === "xs" ||
            responsiveView === "md" ? (
              <div className="mb-3 mt-2  border-bottom">
                <div className={`${styles.custom_box} mb-3 mt-3 account-page`}>
                  <h4>
                    {userStatus.firstname}’s{" "}
                    {i18?.PROFILE?.CONFIRMEDINFORMATION ||
                      "Confirmed Information"}
                  </h4>
                  <div className="d-flex gap-3 m-0">
                    <CheckIcon />
                    <p className="mb-0">{Email}</p>
                  </div>
                  {/* <div className={`${styles.verification}`}>
                            <h4>Identity Verification</h4>
                            <p>Show others you’re really you with the identity verification badge.</p>
                        </div> */}
                </div>
              </div>
            ) : null}
            {userStatus.desc && (
              <div className={styles.container1}>
                <div className="d-flex align-items-center">
                  <p className="m-0">
                    {" "}
                    {i18?.PROFILE?.DESCRIPTION || "Description"}
                    {}
                  </p>
                </div>
                <div>
                  <span> {userStatus?.desc}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default isAuth(User);
