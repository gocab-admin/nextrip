"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs, Typography } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CheckIcon from "@mui/icons-material/Check";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { BsShieldLockFill } from "react-icons/bs";
import dynamic from "next/dynamic";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { dispatch } from "@/redux/store";
import APICONSTANT from "@/services/config";
import { putApiMethod } from "@/services/global";
import { addAlert } from "@/redux/slice/AlertSlice";
import { usePageContext } from "@/components/Providers/PageContext";
import Header from "@/components/header";

import styles from "./page.module.scss";

const TabPanel = dynamic(() => import("@mui/lab/TabPanel"), { ssr: false });
const TabList = dynamic(() => import("@mui/lab/TabList"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });
const CustomModal = dynamic(() => import("@/components/modal"), {
  ssr: false
});
const TextField = dynamic(() => import("@mui/material/TextField"), {
  ssr: false
});

interface IFormInputs {
  currentPassword: string;
  newPassword: string;
}

export default function Logininfo() {
  const { i18, settings } = usePageContext();
  const { hiddenSettings } = settings;
  const [open, setOpen] = React.useState(false);
  const [emailBoxopen, setEmailBoxOpen] = React.useState(false);
  const [phoneBoxopen, setPhoneBoxOpen] = React.useState(false);
  const [phoneverifyBoxopen, setPhoneVerifyBoxOpen] = React.useState(false);
  const [verifiedBoxopen, setVerifieBoxOpen] = React.useState(false);
  const [active, setActive] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch
  } = useForm<IFormInputs>();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleEmailOpenModal = () => {
    setOpen(false);
    setEmailBoxOpen(true);
  };
  const handleEmailCloseModal = () => setEmailBoxOpen(false);

  const handlePhoneOpenModal = () => {
    setOpen(false);
    setPhoneBoxOpen(true);
  };
  const handlePhoneCloseModal = () => {
    setPhoneBoxOpen(false);
  };

  const handleVerifiedOpenModal = () => {
    setEmailBoxOpen(false);
    setVerifieBoxOpen(true);
  };
  const handleVerifiedCloseModal = () => {
    setPhoneBoxOpen(false);
    setPhoneVerifyBoxOpen(false);
    setEmailBoxOpen(false);
    setVerifieBoxOpen(false);
  };

  const handlePhoneVerifiedOpenModal = () => {
    setPhoneBoxOpen(false);
    setPhoneVerifyBoxOpen(true);
  };
  const handlePhoneVerifiedCloseModal = () => {
    setPhoneBoxOpen(false);
    setEmailBoxOpen(false);
    setPhoneVerifyBoxOpen(false);
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // const handleConfirmPasswordChange = (e: any) => {
  //   setConfirmPassword(e.target.value);
  // };

  // const handleEditClick = () => {
  //   setIsEditing(true);
  // };

  // const handleSaveClick = () => {
  //   setIsEditing(false);
  //   // Here, you can implement the logic to save the data, e.g., send it to an API or update state
  // };

  // const handleClose = () => {
  //   setIsEditing(false);
  // };
  const handleChangePass: SubmitHandler<IFormInputs> = async (datas, e) => {
    debugger
    const id = localStorage.getItem("appUserId");
    const data = {
      currentPassword: datas.currentPassword,
      newPassword: datas.newPassword
    };

    try {
      const res = await putApiMethod(APICONSTANT.changepassword + id, data);
      if (res.statusCode === 200) {
        reset();

        setActive(false);
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
      console.log(err);
      dispatch(
        addAlert({
          isOpen: true,
          message: 'Select dates',
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const updatePassword = () => {
    if (hiddenSettings.mode === "1") {
      dispatch(
        addAlert({
          isOpen: true,
          message:
            "Sorry, you are not allowed to change password in demo mode.",
          type: "warning",
          severity: "warning"
        })
      );
    } else {
      setActive(true);
    }
  };

  return (
    <>
      <div className={`${styles.host}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.tabpanel} mx-auto`}>
          <div className={`${styles.breadcrums}`}>
            <div className="mx-3">
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link className={`${styles.link}`} href="/account-settings">
                  {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                </Link>
                <Typography color="text.primary">
                  {i18?.PROFILE?.LOGINSECURITY || "Login & security"}
                </Typography>
              </Breadcrumbs>
            </div>
            <div>
              <h1 className={`m-3`}>
                {i18?.PROFILE?.LOGINSECURITY || "Login & security"}
              </h1>
            </div>
          </div>
          <div className={`${styles.tab}`}>
            <TabContext value={value}>
              <div className={`${styles.tablist}`}>
                <TabList
                  className={`${styles.myTabList}`}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label={i18?.HEADER?.LOGIN || "Login"}
                    value="1"
                    sx={{
                      "& .MuiTabs-indicator": {
                        color: "var(--search-button-color)"
                      }
                    }}
                  />
                  {/* <Tab label="Login Request" value="2" />
                                    <Tab label="Shared Access" value="3" /> */}
                </TabList>
              </div>
              <TabPanel className={`${styles.panels}`} value="1">
                <div className="d-flex flex-wrap mb-3 m-3">
                  <div className={`${styles.tabwidth}`}>
                    <h5 className="m-0">{i18?.HEADER?.LOGIN || "Login"}</h5>
                    <div
                      className={`d-flex align-items-center justify-content-between `}
                    >
                      <h6>{i18?.HEADER?.PASSWORD || "Password"}</h6>
                      {active ? (
                        <button
                          className={`${styles.button}`}
                          onClick={() => setActive(false)}
                        >
                          {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                        </button>
                      ) : (
                        <button
                          className={`${styles.button}`}
                          onClick={updatePassword}
                        >
                          {i18?.HEADER?.UPDATE || "Update"}
                        </button>
                      )}
                    </div>
                    {active && (
                      <form onSubmit={handleSubmit(handleChangePass)}>
                      <div className={styles.activetab}>
                        <p className="m-0">
                          {i18?.ACCOUNTINFO?.CURRENTPASSWORD || "Current password"}
                        </p>
                        <Controller
                          name="currentPassword"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <TextField
                              className="w-100 m-0"
                              {...field}
                              error={!!errors.currentPassword}
                              helperText={errors.currentPassword?.message || ""}
                              type="text"
                            />
                          )}
                        />
                
                        <p className="m-0">{i18?.ACCOUNTINFO?.NEWPASSWORD || "New password"}</p>
                        <Controller
                          name="newPassword"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <TextField
                              className="w-100 m-0"
                              {...field}
                              error={!!errors.newPassword}
                              helperText={errors.newPassword?.message || ""}
                              type="text"
                            />
                          )}
                        />
                      </div>
                
                      <button className={styles.button1} type="submit">
                        {i18?.ACCOUNTINFO?.UPDATEPASSWORD || "Update password"}
                      </button>
                    </form>
                    )}
                  </div>
                </div>
              </TabPanel>
            </TabContext>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
      <CustomModal
        open={open}
        onClose={handleCloseModal}
        padding={8}
        w={556}
        radius={0}
      >
        {/* <BsShieldLockFill
                  style={{
                      display: 'block',
                      height: '70px',
                      width: '70px',
                      fill: 'rgb(227, 28, 95)',
                      stroke: 'currentcolor'
                  }} /> */}
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mt: 4 }}
        >
          {i18?.AUTH?.LETSMAKEYOURACCOUNT ||
            "Let’s make your account more secure"}
        </Typography>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bold", fontSize: "16px", mt: 4 }}
        >
          {i18?.AUTH?.YOURACCOUNTSECURITY || "Your account security"}:
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 4 }}>
          {i18?.AUTH?.WEAREALWAYSWORKING ||
            "We’re always working on ways to increase safety in our community. That’s why we look at every account to make sure it’s as secure as possible."}
        </Typography>
        <div onClick={handlePhoneOpenModal} className={`${styles.ModalH1}`}>
          <div className={`${styles.box}`}></div>
          {i18?.AUTH?.PHONENUMBERVERIFIED || "Phone number verified"}
        </div>
        <hr style={{ margin: "16px 0" }} />
        <div onClick={handleEmailOpenModal} className={`${styles.ModalH1}`}>
          <div className={`${styles.box2}`}>
            <CheckIcon className={`${styles.CheckIcon}`} />
          </div>
          {i18?.AUTH?.VERIFYEMAILADDRESS || "Verify email address"}
        </div>
      </CustomModal>
      <CustomModal
        open={emailBoxopen}
        onClose={handleEmailCloseModal}
        w={556}
        padding={4}
        radius={0}
      >
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mt: 4 }}
        >
          {i18?.AUTH?.VERIFYYOUREMAIL || "Verify your email"}
        </Typography>
        <div className={`${styles.emailmodal}`}>
          <input></input>
        </div>
        <div className={`${styles.button}`}>
          <button onClick={handleOpenModal} className={`${styles.back}`}>
            <NavigateBeforeIcon /> {i18?.BUTTONS?.BACK || "back"}
          </button>
          <button onClick={handleVerifiedOpenModal}>
            {i18?.BUTTONS?.NEXT || "Next"}
          </button>
        </div>
      </CustomModal>
      <CustomModal
        open={phoneverifyBoxopen}
        onClose={handlePhoneVerifiedCloseModal}
        padding={4}
        w={556}
        radius={0}
      >
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mt: 4 }}
        >
          {i18?.AUTH?.VERIFYYOURPHONENUMBER || "Verify your Phone Number"}
        </Typography>
        <div className={`${styles.emailmodal}`}>
          <input></input>
        </div>
        <div className={`${styles.button}`}>
          <button onClick={handlePhoneOpenModal} className={`${styles.back}`}>
            <NavigateBeforeIcon /> {i18?.BUTTONS?.BACK || "back"}
          </button>
          <button onClick={handleVerifiedOpenModal}>
            {i18?.BUTTONS?.NEXT || "Next"}
          </button>
        </div>
      </CustomModal>
      <CustomModal
        open={verifiedBoxopen}
        onClose={handleVerifiedCloseModal}
        padding={8}
        w={556}
        radius={0}
      >
        <BsShieldLockFill
          style={{
            display: "block",
            height: "70px",
            width: "70px",
            fill: "rgb(227, 28, 95)",
            stroke: "currentcolor"
          }}
        />
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mt: 4 }}
        >
          {i18?.AUTH?.GREATYOUHAVE ||
            "Great! You've just made your account more secure"}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 4 }}>
          {i18?.AUTH?.THANKSFORTAKINGTHESE ||
            "Thanks for taking these extra steps to make your account and even our comminuty safer"}
        </Typography>
        <div className={`${styles.ModalH1}`}>
          <div className={`${styles.box}`}></div>
          {i18?.AUTH?.PHONENUMBERVERIFIED || "Phone number verified"}
        </div>
        <hr style={{ margin: "16px 0" }} />
        <div className={`${styles.ModalH1}`}>
          <div className={`${styles.box2}`}>
            <CheckIcon className={`${styles.CheckIcon}`} />
          </div>
          {i18?.AUTH?.VERIFYEMAILADDRESS || "Verify email address"}
        </div>
      </CustomModal>
      <CustomModal
        open={phoneBoxopen}
        onClose={handlePhoneCloseModal}
        w={556}
        padding={4}
        radius={0}
      >
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mt: 4, mb: 4 }}
        >
          {i18?.AUTH?.VERIFYYOURPHONENUMBER || "Verify your Phone Number"}
        </Typography>
        <div>
          <TextField
            id="outlined-required"
            label="Enter Country Code"
            variant="outlined"
            fullWidth
            sx={{
              mb: 4
            }}
          />
        </div>
        <div>
          <TextField
            id="outlined-required"
            label="Enter Number"
            variant="outlined"
            fullWidth
            sx={{
              mb: 4
            }}
          />
        </div>
        <div className={`${styles.button}`}>
          <button onClick={handleOpenModal} className={`${styles.back}`}>
            <NavigateBeforeIcon /> {i18?.BUTTONS?.BACK || "back"}
          </button>
          <button onClick={handlePhoneVerifiedOpenModal}>
            {i18?.BUTTONS?.NEXT || "Next"}
          </button>
        </div>
      </CustomModal>
    </>
  );
}
