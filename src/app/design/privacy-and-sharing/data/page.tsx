"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Switch, { SwitchProps } from "@mui/material/Switch";
import {
  Breadcrumbs,
  FormControlLabel,
  Link,
  styled,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ArrowForwardIos } from "@mui/icons-material";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Website } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";

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

  return (
    <>
      <div className={`${styles.privacy}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.tabpanel} mx-auto`}>
          <div className={`${styles.breadcrums}`}>
            <div className="mx-3">
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link color="inherit" href="/account-settings">
                  {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                </Link>
                <Typography color="text.primary">
                  {i18?.ROOMPAGE?.PRIVACYSHARING || "Privacy & sharing"}
                </Typography>
              </Breadcrumbs>
            </div>
            <div>
              <h1 className={`m-3`}>
                {i18?.ROOMPAGE?.PRIVACYANDSHARING || "Privacy and sharing"}
              </h1>
            </div>
          </div>
          <div className={`${styles.tab} `}>
            <div className={`${styles.tabwidth}`}>
              <TabContext value={value}>
                <div className={`${styles.tablist}`}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Data" value="1" />
                    <Tab label="Sharing" value="2" />
                    <Tab label="Services" value="3" />
                  </TabList>
                </div>
                <TabPanel className={`${styles.panels}`} value="1">
                  <div className="">
                    <div className={`${styles.guestcontent} p-3`}>
                      <div className={`${styles.referal}`}>
                        <div className={`${styles.background}`}>
                          <div className={`pt-3 pb-2`}>
                            <h5>
                              {i18?.ROOMPAGE?.MANAGEYOURACCOUNT ||
                                "Manage your account data"}
                            </h5>
                            <p className="m-0">
                              {i18?.ROOMPAGE?.YOUCANMAKEAREQUEST ||
                                "You can make a request to download or delete your personal data from "}
                              <Website />.
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="d-flex align-items-center">
                                <span className="me-1">
                                  {i18?.ROOMPAGE?.REQUESTYOUR ||
                                    "Request your personal data"}
                                </span>
                                <ArrowForwardIos sx={{ fontSize: 16 }} />
                              </div>
                              <p className="">
                                {i18?.ROOMPAGE?.WEWILLCREATEAFILE ||
                                  "We’ll create a file for you to download your personal data"}
                                .
                              </p>
                            </div>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.ROOMPAGE?.DELETEACCOUNT ||
                                  "Delete your account"}
                                <ArrowForwardIos sx={{ fontSize: 16 }} />
                              </div>
                              <p className="">
                                {i18?.ROOMPAGE?.THISWILLPERMANENTLY ||
                                  "This will permanently delete your account and your data, in accordance with applicable law."}
                              </p>
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
                              {i18?.ROOMPAGE?.ACTIVITYSHARING ||
                                "Activity sharing"}
                            </h5>
                            <p className="m-0">
                              {i18?.ROOMPAGE?.DECIDEHOWYOUR ||
                                "Decide how your profile and activity are shown to others."}
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.ROOMPAGE?.INCLUDEMYPROFILE ||
                                  "Include my profile and listing in search engines"}
                              </div>
                              <p className="">
                                {i18?.ROOMPAGE?.TURNINGTHISONMEANS ||
                                  "Turning this on means search engines, like Google, will display your profile and listing pages in search results."}
                              </p>
                            </div>
                            <div>
                              <FormControlLabel
                                control={
                                  <IOSSwitch sx={{ m: 1 }} defaultChecked />
                                }
                                label=""
                              />
                            </div>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div>
                              <div className="">
                                {i18?.ROOMPAGE?.READRECEIPTS || "Read receipts"}
                              </div>
                              <p className="">
                                {i18?.ROOMPAGE?.WHENTHISISON ||
                                  "When this is on, we’ll show people that you’ve read their messages."}{" "}
                                <a href="">
                                  {i18?.ACCOUNTINFO?.LEARNMORE || "Learn more"}
                                </a>
                              </p>
                            </div>
                            <div>
                              <FormControlLabel
                                control={
                                  <IOSSwitch sx={{ m: 1 }} defaultChecked />
                                }
                                label=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className={`${styles.panels}`} value="3">
                  <div className="">
                    <div className={`${styles.guestcontent} p-3`}>
                      <div className={`${styles.referal}`}>
                        <div className={`${styles.background}`}>
                          <div className={`pt-3 pb-2`}>
                            <h5>
                              {i18?.ROOMPAGE?.CONNECTEDSERVICES ||
                                "Connected services"}
                            </h5>
                            <p className="m-0">
                              {i18?.ROOMPAGE?.SHOWSERVICESTHAT ||
                                "Show services that you’ve connected to your "}
                              <Website /> {i18?.ROOMPAGE?.ACCOUNT || "account"}
                            </p>
                          </div>
                          <div className={`pt-3 pb-2`}>
                            <div className="">
                              {i18?.ROOMPAGE?.NOSERVICES ||
                                "No services connected at the moment"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </div>
            <div className={`${styles.makeall}`}>
              <div className="p-4">
                <div>
                  <h5>
                    {i18?.ROOMPAGE?.COMMITEDTOPRIVACY || "Committed to privacy"}
                  </h5>
                </div>
                <div>
                  <div>
                    <p>
                      <Website />{" "}
                      {i18?.ROOMPAGE?.ISCOMMITEDTOKEEPING ||
                        "is committed to keeping your data protected. Read details in our "}
                      <a href="">
                        {i18?.ROOMPAGE?.PRIVACYPOLICY || "Privacy Policy"}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default PaymentsMethods;
