import Link from "next/link";
import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import ImageComponent from "@/components/ImageComponent";
import { Website } from "@/app/global/svg";
import { handleImageError } from "@/services/utils/utils";

import styles from "./sidenav.module.scss";
import AllMessage from "../../../../public/svg/Vectorall.svg";
import Airstar from "../../../../public/svg/Adstar.svg";
import Archive from "../../../../public/svg/Vectorarch.svg";
import Quick from "../../../../public/svg/Vectorquick.svg";
import Schedule from "../../../../public/images/VectorSchedule.png";
import Feed from "../../../../public/svg/Vectorfeed.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4
};

const Sidenav = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmit, setModalSubmit] = useState(false);
  const [continueButton, setContinueButton] = useState(true);

  const handleClickFeed = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setModalSubmit(true);
  };

  const handleBack = () => {
    setModalOpen(true);
    setModalSubmit(false);
  };

  return (
    <>
      <div className={`d-flex flex-column py-4 px-3`}>
        <div>
          <h4 className="">Inbox</h4>
        </div>
        <div className={`${styles.folder} d-flex flex-column pt-4 pb-5`}>
          <Link href={"/hosting/inbox/folder/all"}>
            <button className="w-100 d-flex align-items-center py-2 border-0 px-4 rounded-pill">
              <ImageComponent
                className="me-2"
                width={24}
                src={AllMessage}
                alt="noti"
                onError={handleImageError}
              />
              All Messages
            </button>
          </Link>
          <Link href={"/hosting/inbox/folder/cx"}>
            <button className="w-100 d-flex align-items-center py-2 border-0 px-4 rounded-pill">
              <ImageComponent
                className="me-2"
                width={24}
                src={Airstar}
                alt="noti"
                onError={handleImageError}
              />
              <Website /> Support
            </button>
          </Link>
          <Link href={"/hosting/inbox/folder/archive"}>
            <button className="w-100 d-flex align-items-center py-2 border-0 px-4 rounded-pill">
              <ImageComponent
                className="me-2"
                width={24}
                src={Archive}
                alt="noti"
                onError={handleImageError}
              />
              Archive
            </button>
          </Link>
        </div>
        <div className={`${styles.space} flex-grow-1 d-flex flex-column`}>
          <div className={`${styles.setting} d-flex flex-column pt-4 pb-5`}>
            <h6 className="">SETTINGS</h6>
            <Link href={"/hosting/inbox/settings/quick-replies"}>
              <button className="w-100 d-flex align-items-center border-0 py-2 px-3 rounded-pill">
                <ImageComponent
                  className="me-2"
                  width={24}
                  src={Quick}
                  alt="noti"
                  onError={handleImageError}
                />
                Quick replies
              </button>
            </Link>
            <Link href={"/hosting/inbox/settings/scheduled-messages"}>
              <button className="w-100 d-flex align-items-center border-0 py-2 px-3 rounded-pill">
                <ImageComponent
                  className="text-[#717171] me-2"
                  width={24}
                  src={Schedule}
                  alt="noti"
                  onError={handleImageError}
                />
                Scheduled Messages
              </button>
            </Link>
          </div>
          <div
            className={`${styles.feed} flex-grow-1 justify-content-end align-content-stretch d-flex flex-column`}
          >
            <button
              className="w-100 d-flex justify-content-center align-items-center py-2 px-3 rounded"
              onClick={handleClickFeed}
            >
              <ImageComponent
                className="me-2"
                width={24}
                src={Feed}
                alt="noti"
                onError={handleImageError}
              />
              Give feedback
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Box sx={style}>
          <>
            <div className={`${styles.modal_group}`}>
              <div className="">
                <button
                  aria-label="Close"
                  onClick={() => {
                    setModalOpen(false);
                  }}
                  type="button"
                  className={`${styles.close} border-0 ps-0 p-2`}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className={`${styles.modal_header} py-2`}>
                <h4 className={`${styles.feedback}`}>Give feedback</h4>
              </div>
              <section>
                <fieldset className={`${styles.fieldset}`}>
                  <p className="">
                    Please let us know what your feedback is about. We review
                    all feedback but are unable to respond individually.
                  </p>
                  <div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_0"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="general feedback about the inbox"
                                onChange={(e) => {
                                  setContinueButton(false);
                                }}
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">
                              General feedback about the inbox
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_1"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="quickReplies"
                                onChange={(e) => {
                                  setContinueButton(false);
                                }}
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">Quick Replies</div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_2"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="radio"
                                value="scheduledMessages"
                                onChange={(e) => {
                                  setContinueButton(false);
                                }}
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">Scheduled Messages</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </section>
              <div className={`${styles.modal_footer}`}>
                <div className="_1hbsadf py-2">
                  <div className="_1hfa947x">
                    <div className="_10ejfg4u"></div>
                    <div className="_ni9axhe d-flex justify-content-end">
                      <button
                        type="button"
                        disabled={continueButton}
                        className={`${
                          continueButton ? styles.disable : styles.continue
                        } d-flex align-items-center`}
                        onClick={handleClose}
                      >
                        Continue
                        <ArrowForwardIosIcon />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-black">
                    Need to connect with our support team? Visit the &nbsp;
                    <a
                      href="/help"
                      className="l1ovpqvx b1uxatsa c1qih7tm dir dir-ltr"
                    >
                      Help Centre
                    </a>{" "}
                    &nbsp; or &nbsp;
                    <a
                      href="/help/contact_us"
                      className="l1ovpqvx b1uxatsa c1qih7tm dir dir-ltr"
                    >
                      contact us
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </>
        </Box>
      </Modal>

      <Modal
        open={modalSubmit}
        onClose={() => {
          setModalSubmit(false);
        }}
      >
        <Box sx={style}>
          <>
            <div className={`${styles.modal_group}`}>
              <div className="">
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
              <div className={`${styles.modal_header} py-2`}>
                <h4 className={`${styles.feedback}`}>Tell us about it</h4>
              </div>
              <section>
                <fieldset className={`${styles.fieldset}`}>
                  <p className="">
                    Share your experience with us. What’s working well? What
                    could’ve gone better?
                  </p>
                  <div>
                    <div>
                      <textarea className="w-100" rows={4}></textarea>
                    </div>
                    <div>
                      <label className="_4m7syz">
                        <div className="_gyif22 d-flex align-items-center py-2">
                          <div className="_zkrkb6">
                            <div className="d-flex">
                              <input
                                id="feedback[category]_2"
                                className={`${styles.radio} me-2`}
                                aria-invalid="false"
                                name="feedback[category]"
                                type="checkbox"
                                value="scheduledMessages"
                              />
                            </div>
                          </div>
                          <div className="_1jdtnhle">
                            <div className="_fs9exd">I’m reporting a bug</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </section>
              <div className={`${styles.modal_footer}`}>
                <div className="_1hbsadf py-2">
                  <div className="d-flex justify-content-between">
                    <div className="_ni9axhe d-flex justify-content-end align-items-center">
                      <button
                        type="button"
                        className={`${styles.back} d-flex`}
                        onClick={handleBack}
                      >
                        <ArrowBackIosIcon className={`${styles.back_icon}`} />
                        Back
                      </button>
                    </div>
                    <div className="_ni9axhe d-flex justify-content-end">
                      <button
                        type="button"
                        className={`${styles.continue} d-flex py-3 px-3`}
                      >
                        Submit1
                        <ArrowForwardIosIcon />
                      </button>
                    </div>
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

export default Sidenav;
