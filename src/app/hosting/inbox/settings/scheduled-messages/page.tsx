"use client";
import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ImageComponent from "@/components/ImageComponent";
import Header from "@/components/header";
import Sidenav from "@/app/hosting/inbox/sidenav";
import isAuth from "@/components/isAuth";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";
import Plus from "../../../../../../public/svg/plus.svg";
import Time from "../../../../../../public/svg/time.svg";
import Bulb from "../../../../../../public/svg/bulb.svg";
import Question from "../../../../../../public/svg/question.svg";
import World from "../../../../../../public/svg/close.svg";
import Arrow from "../../../../../../public/svg/arrow.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3
};

const Scheduled = () => {
  const { i18 } = usePageContext();
  const [shownav, setShowNav] = useState(true);
  const [selectValue, setSelectValue] = useState<string>();
  const [modalSubmit, setModalSubmit] = useState(false);

  const handleclick = () => {
    setModalSubmit(true);
  };

  const handleBack = () => {
    setModalSubmit(false);
  };

  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectValue(value);
  };

  return (
    <>
      <div className={`${styles.all_scheduled}`}>
        <Header page="hide" center="inbox" type="provider" />
        <div className={`${styles.slidemain} d-flex`}>
          {shownav && (
            <div className={`${styles.slidebackground} basis-1/5 p-3`}>
              <Sidenav />
            </div>
          )}
          <div
            className={`${styles.scheduled_input} flex-grow-1 d-flex flex-column`}
          >
            <div className="d-flex align-items-center py-3 px-4">
              <button
                className="bg-white border-0"
                onClick={() => setShowNav(!shownav)}
              >
                &#9776;
              </button>
              <div>
                <h5 className="text-2xl font-normal ms-3 mb-0">
                  {i18?.ROOMPAGE?.SCHEDULEDMESSAGE || "Scheduled messages"}
                </h5>
              </div>
              <div className="flex-grow-1 d-flex justify-content-end">
                <button
                  className="text-white bg-black font-medium py-2 px-3 rounded-3 border-2 border-black"
                  onClick={handleclick}
                >
                  <ImageComponent
                    className={`${styles.scheduled_plus}`}
                    src={Plus}
                    alt="plus"
                    onError={handleImageError}
                  />
                  &nbsp;
                  {i18?.ROOMPAGE?.NEWMESSAGE || "New Message"}
                </button>
              </div>
            </div>
            <div className="d-flex my-auto justify-content-center">
              <div
                className={`${styles.scheduled_relative_input} d-flex flex-column rounded-4 py-5 px-3 `}
              >
                <ImageComponent
                  className="align-self-start"
                  src={Time}
                  alt="tick"
                  onError={handleImageError}
                />
                <h4 className="m-0">
                  {i18?.ROOMPAGE?.NOSCHEDULEDMESSAGES ||
                    "No scheduled messages yet"}
                </h4>
                <p className="m-0 w-75">
                  {i18?.ROOMPAGE?.AUTOMATICALLYSENDGUESTS ||
                    "Automatically send guests check-in instructions, wifi details, and more."}
                </p>
                <div>
                  <button
                    className="text-white bg-black py-2 px-4 rounded-3 border-1"
                    onClick={handleclick}
                  >
                    {i18?.ROOMPAGE?.CREATEAMESSAGE ||
                      "Create a message template"}
                  </button>
                </div>
                <div>
                  <button className="text-black bg-white py-2 px-4 rounded-3">
                    {i18?.ROOMPAGE?.LEARNBEST || "Learn best practices"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalSubmit}
        onClose={() => {
          setModalSubmit(false);
        }}
      >
        <Box sx={style}>
          <>
            <div className={`${styles.modal_group}`}>
              <div className="d-flex px-4 py-3 border-bottom bg-white rounded-top-3">
                <button
                  aria-label="Close"
                  onClick={() => {
                    setModalSubmit(false);
                  }}
                  type="button"
                  className={`${styles.close} border-0 ps-0 p-2`}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className={`${styles.scroll} px-4 pb-4`}>
                <div className={`${styles.modal_header} py-2`}>
                  <h4 className={`${styles.feedback}`}>
                    {i18?.ROOMPAGE?.CREATEAMESSAGE ||
                      "Create a message template"}
                  </h4>
                </div>
                <div>
                  <fieldset className={`${styles.fieldset}`}>
                    <div className="position-relative">
                      <div className="text-secondary position-absolute ps-2 pt-2">
                        {i18?.ROOMPAGE?.TEMPLATENAME || "Template name"}
                      </div>
                      <div>
                        <input
                          className="w-100 pt-4 pb-1 px-3"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <p className="text-secondary">
                      {i18?.ROOMPAGE?.THISWONTBESHOWN ||
                        "This won’t be shown to guests."}
                    </p>
                    <div className="mb-4">
                      <h6 className="m-0 pb-2">
                        {i18?.PROFILE?.MESSAGE || "Message"}
                      </h6>
                      <div
                        className={`${styles.messagebox} d-flex justify-content-between align-items-center`}
                      >
                        <div
                          className={`${styles.world} d-flex justify-content-between align-items-center`}
                        >
                          <ImageComponent
                            className={`${styles.svg}`}
                            src={World}
                            alt="world"
                            onError={handleImageError}
                          />
                          <span>English (India)</span>
                        </div>
                        <div
                          className={`${styles.insert} d-flex align-items-center`}
                        >
                          <span>{i18?.TRIPS?.INSERT || "Insert"}</span>
                          <ImageComponent
                            className={`${styles.svg}`}
                            src={Arrow}
                            alt="arrow"
                            onError={handleImageError}
                          />
                          <div className="ps-2">
                            <ImageComponent
                              className={`${styles.svg}`}
                              src={Question}
                              alt="question"
                              onError={handleImageError}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles.textbox}`}
                        role="textbox"
                        aria-multiline="true"
                      ></div>
                    </div>
                    <div className={`${styles.shortcode} d-flex p-3`}>
                      <div className={`${styles.primary}`}>
                        <ImageComponent
                          src={Bulb}
                          alt="bulb"
                          onError={handleImageError}
                        />
                      </div>
                      <div>
                        <div>
                          <b>{i18?.TRIPS?.SHORTCODETRIP || "Shortcode tip"}:</b>
                          &nbsp;
                          {i18?.TRIPS?.ONLYUSETHEMFORINFO ||
                            "Only use them for info that’s already stored. Messages with empty shortcodes won't display correctly."}
                        </div>
                        <div className="mt-2">
                          <a target="_blank" href="#" className="">
                            {i18?.ACCOUNTINFO?.LEARNMORE || "Learn more"}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="pb-4 my-4 border-bottom">
                      <div
                        className={`d-flex justify-content-between align-items-center`}
                      >
                        <h6 className="m-0">
                          {i18?.LISTING?.LISTING || "Listing"}
                        </h6>
                        <div className={`${styles.listing}`}>
                          <span>{i18?.ROOMPAGE?.SELECT || "Select"}</span>
                          <ImageComponent
                            className={`${styles.svg}`}
                            src={Arrow}
                            alt="arrow"
                            onError={handleImageError}
                          />
                        </div>
                      </div>
                      <p className="text-secondary m-0">
                        {i18?.TRIPS?.SELECTTHELISTINGS ||
                          "Select the listings that will use this template."}
                      </p>
                    </div>
                    <div className={`${styles.select}`}>
                      <h6 className="m-0 pb-2">
                        {i18?.TRIPS?.SCHEDULING || "Scheduling"}
                      </h6>
                      <p className="text-secondary mb-4">
                        {i18?.TRIPS?.CHOOSEANACTION ||
                          "Choose an action that’ll trigger your message and how long before or after the action to send."}
                      </p>
                      <div className="position-relative">
                        <div className="text-secondary position-absolute ps-2 pt-2">
                          {i18?.TRIPS?.ACTION || "Action"}
                        </div>
                        <select
                          className="w-100 pt-4 pb-1 px-3"
                          onChange={selectChange}
                        >
                          <option></option>
                          <option value="Booking_confirmed">
                            {i18?.TRIPS?.BOOKINGCONFIRMED ||
                              "Booking confirmed"}
                          </option>
                          <option value="Check-in">
                            {i18?.ROOMPAGE?.CHECKINN || "Check-in"}
                          </option>
                          <option value="Checkout">
                            {i18?.ROOMPAGE?.CHECKOUT || "Check-out"}
                          </option>
                        </select>
                      </div>
                      {selectValue === "Booking_confirmed" && (
                        <div className="position-relative">
                          <div className="text-secondary position-absolute ps-2 pt-2">
                            {i18?.TRIPS?.WHENTOSEND || "When to send"}
                          </div>
                          <select
                            name="scheduling-offset-picker"
                            className="w-100 pt-4 pb-1 px-3 border border-top-0"
                            id="scheduling-offset-picker"
                          >
                            <option></option>
                            <option value="immediately_after">
                              {i18?.TRIPS?.IMMEDIATELYAFTER ||
                                "Immediately after"}
                            </option>
                            <option value="5_minutes_after">
                              5 {i18?.ROOMPAGE?.MINUTESAFTER || "minutes after"}
                            </option>
                            <option value="10_minutes_after">
                              10{" "}
                              {i18?.ROOMPAGE?.MINUTESAFTER || "minutes after"}
                            </option>
                            <option value="15_minutes_after">
                              15{" "}
                              {i18?.ROOMPAGE?.MINUTESAFTER || "minutes after"}
                            </option>
                            <option value="30_minutes_after">
                              30{" "}
                              {i18?.ROOMPAGE?.MINUTESAFTER || "minutes after"}
                            </option>
                            <option value="1_hours_after">
                              1 {i18?.ROOMPAGE?.HOURAFTER || "hour after"}
                            </option>
                            <option value="2_hours_after">
                              2 {i18?.ROOMPAGE?.HOURSAFTER || "hour after"}
                            </option>
                            <option value="4_hours_after">
                              4 {i18?.ROOMPAGE?.HOURSAFTER || "hour after"}
                            </option>
                            <option value="8_hours_after">
                              8 {i18?.ROOMPAGE?.HOURASFTER || "hour after"}
                            </option>
                            <option value="16_hours_after">
                              16 {i18?.ROOMPAGE?.HOURSAFTER || "hour after"}
                            </option>
                            <option value="24_hours_after">
                              24 {i18?.ROOMPAGE?.HOURSAFTER || "hour after"}
                            </option>
                          </select>
                        </div>
                      )}
                      {selectValue &&
                        selectValue.length !== 0 &&
                        selectValue !== "Booking_confirmed" && (
                          <div className="d-flex ">
                            <div className="w-100 position-relative">
                              <div className="text-secondary position-absolute ps-2 pt-2">
                                {i18?.DATES?.DAY || "Day"}
                              </div>
                              <select
                                name="scheduling-offset-picker"
                                className="w-100 pt-4 pb-1 px-3"
                                id="scheduling-offset-picker"
                              >
                                <option></option>
                                <option value="immediately_after">
                                  14{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="5_minutes_after">
                                  13{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="10_minutes_after">
                                  12{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="15_minutes_after">
                                  11{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="30_minutes_after">
                                  10{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="1_hours_after">
                                  9 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="2_hours_after">
                                  8 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="4_hours_after">
                                  7 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="8_hours_after">
                                  6 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="16_hours_after">
                                  5 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="24_hours_after">
                                  4 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="4_hours_after">
                                  3 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="8_hours_after">
                                  2 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="16_hours_after">
                                  1 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="24_hours_after">Day of</option>
                                <option value="16_hours_after">
                                  1 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="8_hours_after">
                                  2 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="4_hours_after">
                                  3 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="24_hours_after">
                                  4 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="16_hours_after">
                                  5 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="8_hours_after">
                                  6 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="4_hours_after">
                                  7 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="2_hours_after">
                                  8 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="1_hours_after">
                                  9 {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="30_minutes_after">
                                  10{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="15_minutes_after">
                                  11{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="10_minutes_after">
                                  12{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="5_minutes_after">
                                  13{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                                <option value="immediately_after">
                                  14{" "}
                                  {i18?.ROOMPAGE?.DAYSBEFORE || "days before"}
                                </option>
                              </select>
                            </div>
                            <div className="w-100 position-relative">
                              <div className="text-secondary position-absolute ps-2 pt-2">
                                Time
                              </div>
                              <select
                                name="scheduling-offset-picker"
                                className="w-100 pt-4 pb-1 px-3"
                                id="scheduling-offset-picker"
                              >
                                <option></option>
                                <option value="immediately_after">
                                  12:00 AM
                                </option>
                                <option value="5_minutes_after">1:00 AM</option>
                                <option value="10_minutes_after">
                                  2:00 AM
                                </option>
                                <option value="15_minutes_after">
                                  3:00 AM
                                </option>
                                <option value="30_minutes_after">
                                  4:00 AM
                                </option>
                                <option value="1_hours_after">5:00 AM</option>
                                <option value="2_hours_after">6:00 AM</option>
                                <option value="4_hours_after">7:00 AM</option>
                                <option value="8_hours_after">8:00 AM</option>
                                <option value="16_hours_after">9:00 AM</option>
                                <option value="24_hours_after">10:00 AM</option>
                                <option value="16_hours_after">11:00 AM</option>
                                <option value="24_hours_after">12:00 PM</option>
                                <option value="5_minutes_after">1:00 PM</option>
                                <option value="10_minutes_after">
                                  2:00 PM
                                </option>
                                <option value="15_minutes_after">
                                  3:00 PM
                                </option>
                                <option value="30_minutes_after">
                                  4:00 PM
                                </option>
                                <option value="1_hours_after">5:00 PM</option>
                                <option value="2_hours_after">6:00 PM</option>
                                <option value="4_hours_after">7:00 PM</option>
                                <option value="8_hours_after">8:00 PM</option>
                                <option value="16_hours_after">9:00 PM</option>
                                <option value="24_hours_after">10:00 PM</option>
                                <option value="16_hours_after">11:00 PM</option>
                              </select>
                            </div>
                          </div>
                        )}
                      {selectValue && selectValue.length !== 0 && (
                        <div className="text-secondary pt-1">
                          {i18?.ROOMPAGE?.MESSAGEWILLBESENT ||
                            "Message will be sent in the listing’s time zone"}
                        </div>
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className={`${styles.modal_footer} border-top`}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex justify-content-end align-items-center">
                    <button
                      type="button"
                      className={`${styles.cancel}`}
                      onClick={handleBack}
                    >
                      {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                    </button>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className={`${styles.create} d-flex py-2 px-4`}
                    >
                      {i18?.TRIPS?.CREATE || "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Box>
      </Modal>
    </>
  );
};
export default isAuth(Scheduled);
