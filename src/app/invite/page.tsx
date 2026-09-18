"use client";
import React from "react";
import {
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Website } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

const Invite = () => {
  const { i18 } = usePageContext();

  return (
    <>
      <div className={`${styles.invite}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.guestcontent} pb-5`}>
          <div>
            <h3 className={`${styles.guest}`}>
              {i18?.REFERAL?.GUESTREFERALS || "Guest referrals"}
            </h3>
          </div>
          <div className={`${styles.referal} d-flex justify-content-center`}>
            <div className={`${styles.background}`}>
              <h5>
                {i18?.REFERAL?.TRACKYOURREFERALS || "Track your referals"}
              </h5>
              <div className={`d-flex justify-content-between pt-3 pb-2`}>
                <p className="m-0">
                  {i18?.REFERAL?.COMPLETEDREFERALS || "Completed referrals"}
                </p>
                <h6 className="m-0">0</h6>
              </div>
              <div className={`d-flex justify-content-between pt-2 pb-3 mb-3`}>
                <p className="m-0">{i18?.REFERAL?.SIGNUPS || "Signups"}</p>
                <h6 className="m-0">0</h6>
              </div>
              <div>
                <Button className={`${styles.button} w-100`}>
                  {i18?.REFERAL?.SHOWMOREDETAILS || "Show more details"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="my-3">
          <div className={`${styles.divider}`}></div>
        </div>
        <div className={`${styles.common}`}>
          <div className={`row d-flex flex-wrap`}>
            <div className={`${styles.review} col`}>
              <h3>{i18?.REFERAL?.COMMONQUESTIONS || "Common questions"}</h3>
              <p>
                {i18?.REFERAL?.CHECKOUTTHESE ||
                  "Check out these answers to common questions and review other programme information in the "}{" "}
                &nbsp;
                <a className="text-secondary" href="#">
                  {i18?.LISTING?.HELPCENTRE || "Help Centre"}
                </a>
              </p>
            </div>
            <div className={`${styles.review} col`}>
              <div className={`${styles.divider}`}>
                <Accordion className={`${styles.accordion}`}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={`${styles.typography}`}>
                      {i18?.REFERAL?.ISTHEREFERRAL ||
                        "Is the referral programme still open?"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {i18?.REFERAL?.THEREFERALSPROGRAMME ||
                        "The referrals programme is no longer open and no new invites can be sent."}
                      <br />
                      <br />
                      {i18?.REFERAL?.IFYOUWERESENT ||
                        "If you were sent a coupon prior to the shutdown of the programme, you will be able to use the coupon on any booking made prior to the expiration of the coupon."}
                      <br />
                      <br />
                      {i18?.REFERAL?.SENDERCREDITSWILLBE ||
                        "Sender credits will be honoured till they expire. For prior referrals, you will receive credit upon completion of successful stay if the coupon is used prior to expiry (credit amount based on offer at the time)"}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
              <div className={`${styles.divider} pt-3`}>
                <Accordion className={`${styles.accordion}`}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={`${styles.typography}`}>
                      {i18?.REFERAL?.IHAVEREFERRED ||
                        "I've referred a friend but haven't received travel credit"}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {i18?.REFERAL?.FORREFERALSMADE ||
                        "For referrals made after 1 Oct 2020,"}{" "}
                      <Website />{" "}
                      {i18?.REFERAL?.DOESNOTOFFER ||
                        " doesn't offer travel credit for referrals."}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
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
export default Invite;
