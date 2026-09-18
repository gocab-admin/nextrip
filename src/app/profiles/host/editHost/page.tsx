"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import Header from "@/components/header";
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
import { dispatch, RootState } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { updateHost } from "@/redux/slice/host/hostSlice";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";

const Footer = dynamic(() => import("@/components/footer"), { ssr: false });
const EditModal = dynamic(() => import("@/components/editModal"), {
  ssr: false
});
const ImageComponent = dynamic(
  () => import("@/components/ImageComponent"),
  { ssr: false }
);
const HostEditMode = dynamic(() => import("@/app/Modal/HostEditMode"), {
  ssr: false
});

const EditUser = () => {
  const { i18 } = usePageContext();
  const [show, setShow] = useState("");
  const activeModel = useSelector(
    (state: RootState) => state.modal.activeModel
  );
  const defalut = require("../../../images/defaultProfile.png");
  const [profileImage, setProfileImage] = useState<any>(defalut);

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      setProfileImage(reader.result);
      const formData = new FormData();
      formData.append("file", file);
      const userId: any = sessionStorage.getItem("UserId");
      const token: any = sessionStorage.getItem("appToken");
      let fcmId: any;
      const response = await dispatch(
        updateHost(userId, formData, fcmId, token)
      );
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const openSchool = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("school");
  };
  const openPets = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("pet");
  };
  const openmyWork = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("work");
  };
  const openSong = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("song");
  };
  const openFav = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("obsessed");
  };
  const openFunFact = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("funFact");
  };
  const openSkill = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("useLessSkill");
  };
  const openBio = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("bio");
  };
  const openLang = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("language");
  };
  const openSpendTime = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("hobby");
  };
  const openIntro = () => {
    dispatch(setModal("HostEditMode" as any));
    setShow("desc");
  };

  return (
    <>
      <div className={`${styles.host}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.hostdetails}`}>
          <div className={`${styles.image_container}`}>
            <div className={`${styles.container}`}>
              <ImageComponent
                className={`${styles.images}`}
                src={profileImage}
                alt=""
                width={213}
                height={213}
                onError={handleImageError}
              />
              <div>
                <label className={`${styles.edit_label}`} htmlFor="uploadInput">
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
          <div className={`${styles.edit_page}`}>
            <h1 className="">{i18?.PROFILE?.YOURPROFILE || "Your profile"}</h1>
            <p>
              {i18?.PROFILE?.THEINFORMATIONYOUSHARE ||
                "The information you share will be used across Airstar to help other guests and Hosts get to know you."}
            </p>

            <div className={`${styles.edit_profile} mt-4`}>
              <button className={styles.btn_border} onClick={openSchool}>
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
                    :{}
                  </p>
                </div>
              </button>
              <button
                className={`${styles.btn_border}`}
                onClick={openSpendTime}
              >
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
                  <p className="m-0">
                    {i18?.PROFILE?.ISPENDTOOMUCHTIME || "I spend too much time"}
                    :{}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`}>
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
                  <p className="m-0">
                    {i18?.PROFILE?.LANGUAGESISPEAK || "Languages I speak"}:{}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openPets}>
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
                    {i18?.FILTER?.PETS || "Pets"}: {}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openmyWork}>
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
                  <p className="m-0">
                    {i18?.PROFILE?.MYWORK || "My work"}:{}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openSong}>
                <div className="d-flex align-items-center">
                  {" "}
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
                    {i18?.FAVOURITESONG?.MYFAVOURITESONG ||
                      "My favourite song in secondary school"}
                    : {}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openFav}>
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
                  <p className="m-0">
                    {i18?.PROFILE?.IAMOBSESSEDWITH || "I'm obsessed with"}:{}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openFunFact}>
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
                  <p className="m-0">
                    {i18?.PROFILE?.MYFUNFACT || "My fun fact"}:{}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openSkill}>
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
                  <p className="m-0">
                    {i18?.PROFILE?.MYMOSTUSELESSSKILL ||
                      "My most useless skill"}
                    :{}
                  </p>
                </div>
              </button>
              <button className={`${styles.btn_border}`} onClick={openBio}>
                <div className="d-flex align-items-center">
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
                  <p className="m-0">
                    {i18?.PROFILE?.MYBIOGRAPHYTITLEWOULDBE ||
                      "My biography title would be"}
                    :{}
                  </p>
                </div>
              </button>
            </div>
            <div className={`${styles.intro} mt-3`} onClick={openIntro}>
              <h5 className="">{i18?.PROFILE?.ABOUTYOU || "About you"}</h5>
              <div className={`${styles.addintro}`}>
                <p className="m-0">
                  {i18?.PROFILE?.WRITESOMETHINGFUNANDPUNCHY ||
                    "Write something fun and punchy."}
                </p>
                <span className="">
                  {i18?.PROFILE?.ADDINTRO || "Add intro"}:
                </span>
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
              className={`${styles.edit_footerbtn} d-flex justify-content-end py-4`}
            >
              <button
                className={`${styles.done}`}
                // onClick={handleDoneClick}
              >
                {i18?.PROFILE?.DONE || "Done"}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <EditModal
        width="max-w-[36rem]"
        show={activeModel === "HostEditMode"}
        buttonText=""
        title=""
        message=""
      >
        <HostEditMode
          //   defaultValue={profileData}
          show={show}
        />
      </EditModal>
    </>
  );
};

export default EditUser;
