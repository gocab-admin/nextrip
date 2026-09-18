"use client";
import React, { useState } from "react";
import { Box, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ImageComponent from "@/components/ImageComponent";
import Header from "@/components/header";
import Sidenav from "@/app/hosting/inbox/sidenav";
import isAuth from "@/components/isAuth";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";
import Plus from "../../../../../../public/svg/plus.svg";
import Links from "../../../../../../public/svg/link.svg";
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

const QuickReply = () => {
  const [shownav, setShowNav] = useState(true);
  const [modalSubmit, setModalSubmit] = useState(false);

  const handleclick = () => {
    setModalSubmit(true);
  };

  const handleBack = () => {
    setModalSubmit(false);
  };

  return (
    <>
      <div className={`${styles.all_quickreplies}`}>
        <Header page="hide" center="inbox" type="provider" />
        <div className={`${styles.slidemain} d-flex`}>
          {shownav && (
            <div className={`${styles.slidebackground} basis-1/5 p-3`}>
              <Sidenav />
            </div>
          )}
          <div
            className={`${styles.quickreplies_input} flex-grow-1 d-flex flex-column ml-12 mt-12 gap-y-8`}
          >
            <div className="d-flex py-3 px-4">
              <button
                className="bg-white border-0"
                onClick={() => setShowNav(!shownav)}
              >
                &#9776;
              </button>
              <div>
                <h5 className="ms-3 mb-0">Manage quick replies</h5>
                <p className="ms-3 mb-0">
                  Create, edit or delete message templates.
                </p>
              </div>
              <div className="flex-grow-1 d-flex justify-content-end">
                <button
                  className="text-white bg-black py-2 px-3 rounded-3 border-2 border-black"
                  onClick={handleclick}
                >
                  <ImageComponent
                    className={`${styles.quickreplies_plus}`}
                    onError={handleImageError}
                    src={Plus}
                    alt="plus"
                  />
                  &nbsp; New reply
                </button>
              </div>
            </div>
            <div className="d-flex flex-column px-4 py-5 text-center">
              <div className="_qud8xy">
                <table className="_1j3ux6a w-100 border-bottom">
                  <thead>
                    <tr className="_10no7sl">
                      <th data-collapse="true" className="_hjxnd5">
                        Name
                      </th>
                      <th data-collapse="true" className="_8qq6ft">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="_3hmsj">
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8 ">
                        <h6 className="_4n554k text-black">Access</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        <span className="_ztsp0g">guest access</span>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">
                          Checkout instructions
                        </h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        Thanks for staying with us! Checkout time is{" "}
                        <span className="_ztsp0g">checkout time</span>. Here’s
                        how to check out.
                        <div className="_1erh5k5">
                          <div className=" d-inline-block">
                            <span
                              className={`${styles.checkout} d-flex align-items-center`}
                            >
                              <ImageComponent
                                className="me-2"
                                src={Links}
                                alt="link"
                                onError={handleImageError}
                              />
                              Checkout instructions
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">Directions</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        <span className="_ztsp0g">directions</span>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">House manual</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        <span className="_ztsp0g">house manual</span>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">House rules</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        <span className="_ztsp0g">house rules</span>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">Interaction</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        <span className="_ztsp0g">guest interaction</span>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">Neighbourhood</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        <span className="_ztsp0g">neighbourhood</span>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">Transport</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        <span className="_ztsp0g">getting around</span>
                      </td>
                    </tr>
                    <tr className="_zohj1kl">
                      <td className="_1pp7xj8">
                        <h6 className="_4n554k text-black">Wifi</h6>
                      </td>
                      <td className="_9bmlwn" data-collapse="true">
                        SSID:
                        <span className="_ztsp0g">wifi name</span>&nbsp;
                        Password: <span className="_ztsp0g">wifi password</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                  <h4 className={`${styles.feedback}`}>Create a quick reply</h4>
                </div>
                <div className={`${styles.select}`}>
                  <fieldset className={`${styles.fieldset}`}>
                    <div>
                      {/* <input className="w-100 py-2 px-1" placeholder='Quick reply name' /> */}
                      <TextField
                        className="w-100"
                        id="filled-text-input"
                        label="Quick reply name"
                        type="text"
                        variant="standard"
                      />
                    </div>
                    <p className="text-secondary">
                      This won’t be shown to guests.
                    </p>
                    <div className="mb-4">
                      <h6 className="m-0 pb-2">Message</h6>
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
                          <span>Insert</span>
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
                          <b>Shortcode tip:</b>&nbsp; Only use them for info
                          that’s already stored. Messages with empty shortcodes
                          won’t display correctly.
                        </div>
                        <div className="mt-2">
                          <a target="_blank" href="#" className="">
                            Learn more
                          </a>
                        </div>
                      </div>
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
                      Cancel
                    </button>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className={`${styles.create} d-flex py-2 px-4`}
                    >
                      Create
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
export default isAuth(QuickReply);
