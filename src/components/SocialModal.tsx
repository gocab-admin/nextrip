import React from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  XIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";
import { ListItemText } from "@mui/material";

import { handleImageError } from "@/services/utils/utils";

import styles from "./searchbar.module.scss";
import { getImageUrl } from "./ImageComponent";

export default function SocialModal(props: any) {
  console.log("imgProps", props.image);
  let currentURL = "";
  if (typeof window !== "undefined") {
    currentURL = window.location.href;
  }
  // const message = `Check out this link: ${currentURL}`
  // const facebooksUrl = 'https://www.facebook.com'
  // const whatsappUrl = 'https://www.whatsapp.com'
  // const handleEmailShare = () => {
  //     const subject = encodeURIComponent('http://www.google.com')
  //     const body = encodeURIComponent('Here is the link to the website: https://email.com')
  //     const mailtoLink = `mailto:?subject=${subject}&body=${body}`
  //     window.open(mailtoLink)
  // }
  return (
    <div
      className={`p-3 `}
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="d-flex justify-content-start gap-3 mb-3  p-3">
        <img
          src={props.image}
          onError={handleImageError}
          alt="image"
          style={{ width: "70px", height: "70px", borderRadius: "10px" }}
        />
        <p
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0",
            fontWeight: "bold",
            color: "var(--text-color)"
          }}
        >
          {props.name}
        </p>
      </div>
      <div className={`${styles.social}`}>
        <FacebookShareButton url={currentURL} hashtag="#muo">
          <div
            style={{
              padding: "15px",
              border: "1px solid rgb(221, 221, 221)",
              borderRadius: "5px",
              display: "flex",
              gap: "10px"
            }}
          >
            <FacebookIcon size={32} round />
            <ListItemText
              primary="Facebook"
              sx={{
                display: "flex",
                justifyContent: "start",
                color: "var(--text-color)"
              }}
            />
          </div>
        </FacebookShareButton>
        <WhatsappShareButton url={currentURL}>
          <div
            style={{
              padding: "15px",
              border: "1px solid rgb(221, 221, 221)",
              borderRadius: "5px",
              display: "flex",
              gap: "10px"
            }}
          >
            <WhatsappIcon size={32} round />
            <ListItemText
              primary="Whatsapp"
              sx={{
                display: "flex",
                justifyContent: "start",
                color: "var(--text-color)"
              }}
            />
          </div>
        </WhatsappShareButton>
        <EmailShareButton url={currentURL}>
          <div
            style={{
              padding: "15px",
              border: "1px solid rgb(221, 221, 221)",
              borderRadius: "5px",
              display: "flex",
              gap: "10px"
            }}
          >
            <EmailIcon size={32} round />
            <ListItemText
              primary="Mail"
              sx={{
                display: "flex",
                justifyContent: "start",
                color: "var(--text-color)"
              }}
            />
          </div>
        </EmailShareButton>
        <TwitterShareButton url={currentURL}>
          <div
            style={{
              padding: "15px",
              border: "1px solid rgb(221, 221, 221)",
              borderRadius: "5px",
              display: "flex",
              gap: "10px"
            }}
          >
            <XIcon size={32} round />
            <ListItemText
              primary="Twitter"
              sx={{
                display: "flex",
                justifyContent: "start",
                color: "var(--text-color)"
              }}
            />
          </div>
        </TwitterShareButton>
      </div>
    </div>
  );
}
