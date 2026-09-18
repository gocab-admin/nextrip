"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { dispatch, RootState } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { updateUser } from "@/redux/slice/user/userSlice";
import { fetchUserAboutData } from "@/redux/slice/user/userAboutDataSlice";
import { APIURLS } from "@/services/config";
import isAuth from "@/components/isAuth";
import { addAlert } from "@/redux/slice/AlertSlice";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";
import Header from "@/components/header";
import AdsHeader from "@/app/ads/components/adsHeader";
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
  Work
} from "@/app/global/svg";

import styles from "./page.module.scss";
import SwitchHeader from "@/components/SwitchHeader";

const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const Footer = dynamic(() => import("@/components/footer"));
const UserEditMode = dynamic(() => import("@/app/Modal/UserEditMode"));
const EditModal = dynamic(() => import("@/components/editModal"), {
  ssr: false
});
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));

const EditUser = () => {
  const { i18,responsiveView, settings } = usePageContext();
  const router = useRouter();
  const [show, setShow] = useState("");
  const activeModel = useSelector(
    (state: RootState) => state.modal.activeModel
  );
  const userData = useSelector(
    (state: any) => state.about.aboutData?.data?.userDetail
  );
  const defalut = require("../../../images/defaultProfile.png");
  const [profileImage, setProfileImage] = useState<any>(defalut);

  // const [userData, setUserData] = useState<any>(defalut)

  // const UserData = async () =>{
  //     const id = localStorage.getItem('appUserId')
  //     const response = await getApiMethod(`auth/user/${id}`)
  //     if(response.statusCode === 200){
  //         setProfileData(response.data.profileImage)
  //         setUserData(response.data)
  //     }
  // }

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      setProfileImage(reader.result);
      const formData = new FormData();
      formData.append("file", file);
      const userId: any = localStorage.getItem("appUserId");
      const response = await dispatch(updateUser(userId, formData));
      if (response.statusCode === 200) {
        dispatch(fetchUserAboutData());
        dispatch(
          addAlert({
            isOpen: true,
            message: response.message,
            type: "success",
            severity: "success"
          })
        );
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const openSchool = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("school");
  };
  const openPets = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("pet");
  };
  const openmyWork = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("work");
  };
  const openSong = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("song");
  };
  const openFav = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("obsessed");
  };
  const openFunFact = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("funFact");
  };
  const openSkill = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("useLessSkill");
  };
  const openBio = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("bio");
  };
  const openLang = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("language");
  };
  const openSpendTime = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("hobby");
  };
  const openIntro = () => {
    dispatch(setModal("UserEditMode" as any));
    setShow("desc");
  };

  const handleDoneClick = () => {
    router.push("/profiles/user");
  };
  useEffect(() => {
    dispatch(fetchUserAboutData());
  }, [dispatch]);
 
  const handleRoute = () => {
    router.push("/profiles/user/");
  };
  return (
    <>
      <div className={`${styles.user}`}>
        {responsiveView === "sm" || responsiveView === "xs" ? (
          <div className={`${styles.mobileHeader}`}>
            <div className="d-flex justify-content-between align-items-center">
              <div onClick={handleRoute}>
                <ArrowBackIosIcon sx={{ fontSize: "20px" }} />
              </div>
            </div>
          </div>
        ) : (
          <SwitchHeader center="hide" page="hide" />
        )}
        <div className={`${styles.userdetails}`}>
          <div className={`${styles.image_container}`}>
            <div className={`${styles.container}`}>
              <div className={`${styles.images}`}>
                {userData?.profileImage ? (
                  <ImageComponent
                    className={`${styles.images}`}
                    src={userData?.profileImage}
                    alt="profile"
                    width={213}
                    height={213}
                    onError={handleImageError}
                  />
                ) : (
                  <ImageComponent
                    className={`${styles.images}`}
                    src={profileImage?.default?.src}
                    alt="profile"
                    width={213}
                    height={213}
                    onError={handleImageError}
                  />
                )}
                <div className={`${styles.editLabel}`}>
                  <label
                    className={`${styles.edit_label}`}
                    htmlFor="uploadInput"
                  >
                    <CameraAltIcon />
                    <p className="edit-text">
                      {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                    </p>
                  </label>
                  <input
                    id="uploadInput"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
            <div>
              <input
                id="uploadInput"
                name="profileImage"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className={`${styles.edit_page} mb-3`}>
            <h1 className="">
              {`${i18?.PROFILE.YOUR || "Your" 
                } ${ 
                i18?.HEADER?.PROFILE || "profile"}`}
            </h1>
            <p className="">
              {i18?.PROFILE?.HELPOTHERGUESTS ||
                "The information you share will be used across our website to help other guests and Hosts get to know you."}
            </p>

            <div className={`${styles.edit_profile} mt-4`}>
              <button className={styles.btn_border} onClick={openSchool}>
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
                    <p className="m-0 text-black">
                      {" "}
                      {i18?.PROFILE?.WHEREIWENTTOSCHOOL ||
                        "Where I went to school"}
                      {}
                    </p>
                  </div>
                  <div>
                    <span> {userData?.school}</span>
                  </div>
                </div>
              </button>
              <button
                className={`${styles.btn_border}`}
                onClick={openSpendTime}
              >
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    {" "}
                    <Spend
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black">
                      {i18?.PROFILE?.ISPENDTOOMUCHTIME ||
                        "I spend too much time"}
                    </p>
                  </div>
                  <div>
                    <span> {userData?.hobby}</span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openLang}>
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    {" "}
                    <Languages
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black">
                      {i18?.PROFILE?.LANGUAGESISPEAK || "Languages I speak"}
                    </p>
                  </div>
                  <div>
                    <span> {userData?.language}</span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openPets}>
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
                    <p className="m-0 text-black">
                      {i18?.SELECTBASICS?.PETS || "Pets"}{" "}
                    </p>
                  </div>
                  <div>
                    <span>{userData?.pet}</span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openmyWork}>
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    {" "}
                    <Work
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black">
                      {i18?.PROFILE?.MYWORK || "My work"}
                    </p>
                  </div>
                  <div>
                    <span> {userData?.work}</span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openSong}>
                <div className={styles.container}>
                  <div
                    className="d-flex align-items-center"
                    style={{ maxWidth: "75%" }}
                  >
                    <Song
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black text-truncate">
                      {" "}
                      {i18?.PROFILE?.MYFAVOURITESONGINSCHOOL ||
                        "My favourite song in school"}
                      {}
                    </p>
                  </div>
                  <div>
                    <span>{userData?.song}</span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openFav}>
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    {" "}
                    <Heart
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black">
                      {i18?.PROFILE?.IAMOBSESSEDWITH || "I'm obsessed with"}
                    </p>
                  </div>
                  <div>
                    <span className={styles.truncateText}>
                      {userData?.obsessed}
                    </span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openFunFact}>
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    {" "}
                    <Facts
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black">
                      {i18?.PROFILE?.MYFUNFACT || "My fun fact"}
                    </p>
                  </div>
                  <div>
                    <span> {userData?.funFact}</span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openSkill}>
                <div className={styles.container}>
                  <div className="d-flex align-items-center">
                    {" "}
                    <Skills
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black">
                      {i18?.PROFILE?.MYMOSTUSELESSSKILL ||
                        "My most useless skill"}
                    </p>
                  </div>
                  <div>
                    <span> {userData?.useLessSkill}</span>
                  </div>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openBio}>
                <div className={styles.container}>
                  <div
                    className="d-flex align-items-center"
                    style={{ maxWidth: "75%" }}
                  >
                    {" "}
                    <Bio
                      className="me-3"
                      style={{
                        display: "block",
                        height: "24px",
                        width: "24px",
                        fill: "var(--footer-text-color)"
                      }}
                    />
                    <p className="m-0 text-black text-truncate">
                      {i18?.PROFILE?.MYBIOGRAPHYTITLEWOULDBE ||
                        "My biography title would be"}
                    </p>
                  </div>
                  <div style={{ maxWidth: "200px" }}>
                    <span className="text-truncate">{userData?.bio}</span>
                  </div>
                </div>
              </button>
            </div>
            <div className={`${styles.intro} mt-3`} onClick={openIntro}>
              <h5 className="">{i18?.PROFILE?.ABOUTYOU || "About you"}</h5>
              <div className={`${styles.addintro}`}>
                <p className="m-0 text-black">
                  {i18?.PROFILE?.WRITESOMETHINGFUNANDPUNCHY || ""}
                </p>
                <span className="">
                  {i18?.PROFILE?.ADDINTRO || "Add intro:"}
                </span>
                {userData?.desc}
                {/* <p className="">{ }</p> */}
              </div>
            </div>
            {/* <div className=''>
                                    <div className={`${styles.divider}`}></div>
                                </div> */}
            {/* <div className={`${styles.sports} mb-4`}>
                                    <h5 className=''>What you’re into</h5>
                                    <div className="">
                                        <p className="">Find common ground with other guests and Hosts by adding interests to your profile.</p>
                                        <div className='mb-2'>
                                            <Plus />
                                            <Plus />
                                            <Plus />
                                        </div>
                                        <span className="">
                                            Add interests and sports
                                        </span>
                                    </div>
                                </div> */}
            {/* <div className=''>
                                    <div className={`${styles.divider} mb-3`}></div>
                                </div> */}
            <div
              className={`${styles.edit_footerbtn} d-flex justify-content-end py-2`}
            >
              <DynamicButtonComponent
                variant="outlined"
                onClick={handleDoneClick}
                text={i18?.PROFILE?.DONE || "Done"}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <EditModal
        width="max-w-[36rem]"
        show={activeModel === "UserEditMode"}
        buttonText=""
        title=""
        message=""
      >
        <UserEditMode
          //   defaultValue={profileData}
          show={show}
        />
      </EditModal>
    </>
  );
};

export default isAuth(EditUser);
