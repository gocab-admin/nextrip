"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumbs, Checkbox, Link, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Switch, { SwitchProps } from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Website } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import CustomModal from "@/components/modal";

import styles from "./page.module.scss";
import { IOSSwitch } from "@/components/switch";

const TabPanel: any = dynamic(() => import("@mui/lab/TabPanel"), {
  ssr: false,
});
const TabList: any = dynamic(() => import("@mui/lab/TabList"), {
  ssr: false,
});

const PaymentsMethods = () => {
  const { i18 } = usePageContext();
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [open, setOpen] = React.useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={`${styles.notification}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.tabpanel} mx-auto`}>
          <div className={`${styles.breadcrums}`}>
            <div className="mx-3">
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link color="inherit" href="/account-settings">
                  {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                </Link>
                <Typography color="text.primary">
                  {i18?.NOTIFICATIONS?.NOTIFICATIONSS || "Notifications"}
                </Typography>
              </Breadcrumbs>
            </div>
            <div>
              <h1 className={`m-3`}>
                {i18?.NOTIFICATIONS?.NOTIFICATIONSS || "Notifications"}
              </h1>
            </div>
          </div>
          <div className={`${styles.tab}`}>
            <div className={`${styles.tabwidth}`}>
              <TabContext value={value}>
                <div className={`${styles.tablist}`}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Offers and updates" value="1" />
                    <Tab label="Account" value="2" />
                  </TabList>
                </div>
                <TabPanel className={`${styles.panels}`} value="1">
                  <div className="">
                    <div className={`${styles.guestcontent} p-3`}>
                      <div className={`${styles.referal}`}>
                        <div className={`${styles.background}`}>
                          <div className={`pt-3 pb-2`}>
                            <h5>
                              {i18?.NOTIFICATIONS?.TRAVELTRIPSANDOFFERS ||
                                "Travel tips and offers"}
                            </h5>
                            <p className="m-0">
                              {i18?.NOTIFICATIONS?.INSPIREYOURNEXTTRIP ||
                                "Inspire your next trip with personalised recommendations and special offers."}
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.INSPIRATIONANDOFFERS ||
                                  "Inspiration and offers"}
                              </div>
                              <p className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}
                              </p>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.TRIPPLANNING ||
                                  "Trip planning"}
                              </div>
                              <p className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}
                              </p>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>

                          <div className="my-3">
                            <div className={`${styles.divider}`}></div>
                          </div>

                          <div className={`pt-3 pb-2`}>
                            <h5>
                              <Website />{" "}
                              {i18?.NOTIFICATIONS?.UPDATES || "updates"}
                            </h5>
                            <p className="m-0">
                              {i18?.NOTIFICATIONS?.STAYUPTODATEON ||
                                "Stay up to date on the latest news from "}
                              <Website />,{" "}
                              {i18?.NOTIFICATIONS?.ANDLETUSKNOW ||
                                "and let us know how we can improve."}
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.NEWSANDPROGRAMMES ||
                                  "News and programmes"}
                              </div>
                              <p className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}
                              </p>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.FEEDBACK || "Feedback"}
                              </div>
                              <p className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}
                              </p>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.TRAVELREGULATIONS ||
                                  "Travel regulations"}
                              </div>
                              <p className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}
                              </p>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>

                          <div className="my-3">
                            <div className={`${styles.divider}`}></div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <Checkbox />
                            </div>
                            <div>
                              {i18?.NOTIFICATIONS?.UNSUBSCRIBEFROMALL ||
                                "Unsubscribe from all marketing emails"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className={`${styles.panels}`} value="2">
                  <div className="">
                    <div className={`${styles.guestcontent} p-3`}>
                      <div className={`${styles.referal}`}>
                        <div className={`${styles.background}`}>
                          <div className={`pt-3 pb-2`}>
                            <h5>
                              {i18?.NOTIFICATIONS?.ACCOUNTACTIVITYAND ||
                                "Account activity and policies"}
                            </h5>
                            <p className="m-0">
                              {i18?.NOTIFICATIONS?.CONFIRMYOURBOOKING ||
                                "Confirm your booking and account activity, and learn about important "}{" "}
                              <Website />{" "}
                              {i18?.NOTIFICATIONS?.POLICIES || "policies"}.
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.ACCOUNTACTIVITY ||
                                  "Account activity"}
                              </div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}{" "}
                                {i18?.NOTIFICATIONS?.ANDSMS || " and SMS"}
                              </div>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.GUESTPOLICIES ||
                                  "Guest policies"}
                              </div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}{" "}
                                {i18?.NOTIFICATIONS?.ANDSMS || " and SMS"}
                              </div>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>

                          <div className="my-3">
                            <div className={`${styles.divider}`}></div>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <h5>
                              {i18?.NOTIFICATIONS?.REMINDERS || "Reminders"}
                            </h5>
                            <p className="m-0">
                              {i18?.NOTIFICATIONS?.GETIMPORTANTREMINDERS ||
                                "Get important reminders about your reservations, listings, and account activity."}
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.REMINDERS || "Reminders"}
                              </div>
                              <div className="">
                                {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}{" "}
                                {i18?.NOTIFICATIONS?.ANDSMS || " and SMS"}
                              </div>
                            </div>
                            <div className="">
                              <a
                                onClick={handleOpenModal}
                                type="button"
                                className=""
                              >
                                {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                              </a>
                            </div>
                          </div>

                          <div className="my-3">
                            <div className={`${styles.divider}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.referal}`}>
                      <div className={`${styles.background} p-3`}>
                        <div>
                          <h5>
                            {i18?.NOTIFICATIONS?.GUESTANDHOST ||
                              "Guest and Host messages"}
                          </h5>
                          <p>
                            {i18?.NOTIFICATIONS?.KEEPINTOUCHWITH ||
                              "Keep in touch with your Host or guests before and during your trip."}
                          </p>
                        </div>
                        <div className={`pt-3 pb-2`}>
                          <div>
                            <div className="">
                              {i18?.HEADER?.MESSAGES || "Messages"}
                            </div>
                            <div className="">
                              {i18?.NOTIFICATIONS?.ONEMAIL || "On: Email"}{" "}
                              {i18?.NOTIFICATIONS?.ANDSMS || " and SMS"}
                            </div>
                          </div>
                          <div className="">
                            <a
                              onClick={handleOpenModal}
                              type="button"
                              className=""
                            >
                              {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
      <CustomModal
        open={open}
        onClose={handleCloseModal}
        padding={4}
        radius={5}
        w={556}
      >
        <div className={`${styles.content}`}>
          <h5>
            {i18?.NOTIFICATIONS?.LOCALLAWSAND || "Local laws and regulations"}
          </h5>
          <p>
            {i18?.NOTIFICATIONS?.GETUPDATESONSHORT ||
              "Get updates on short-term rental laws in your area."}
          </p>
          <div className={`${styles.switch_content}`}>
            <span>{i18?.SETUPPAYOUTS?.EMAIL || "Email"}</span>
            <FormControlLabel label control={<IOSSwitch sx={{ m: 1 }} />} />
          </div>
          <div className={`${styles.switch_content}`}>
            <span>SMS</span>
            <FormControlLabel label control={<IOSSwitch sx={{ m: 1 }} />} />
          </div>
          <div className={`${styles.switch_content}`}>
            <span>{i18?.NOTIFICATIONS?.PHONECALLS || "Phone calls"}</span>
            <FormControlLabel label control={<IOSSwitch sx={{ m: 1 }} />} />
          </div>
          <div className={`${styles.switch_content}`}>
            <span>
              {i18?.NOTIFICATION?.BROWSERNOTIFICATION || "Browser notification"}
              <p>
                {i18?.NOTIFICATIONS?.PUSHNOTIFICATIONS ||
                  "Push notifications are off. To enable this feature, turn on notifications."}
              </p>
            </span>

            <FormControlLabel label control={<IOSSwitch sx={{ m: 1 }} />} />
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default PaymentsMethods;
