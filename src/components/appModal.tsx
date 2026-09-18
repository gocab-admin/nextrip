import React from "react";
import ImageComponent from "./ImageComponent";
import { handleImageError } from "@/services/utils/utils";
import QRCode from "react-qr-code";
import { usePageContext } from "./Providers/PageContext";

const AppModal = () => {
  const { settings }: any = usePageContext();
  const links = settings?.appLinks;
  return (
    <>
      <div className="p-3">
        <h6 className="text-center">Scan the QR Code to download the app</h6>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 150,
              width: "100%"
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={links?.playstore}
              viewBox={`0 0 256 256`}
            />
          </div>
          {/* <div
        style={{
          height: "auto",
          margin: "0 auto",
          maxWidth: 150,
          width: "100%"
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={links?.appstore}
          viewBox={`0 0 256 256`}
        />
      </div> */}
        </div>
        <h6 className="text-center mt-3">or Click below links</h6>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          background: "#F7F7F7"
        }}
        className="mt-2 py-3"
      >
        <button
          style={{ border: "none" }}
          onClick={() =>
            window.open(links.playstore)
          }
          // className={`${styles.socialbtn} mb-3`}
        >
          <ImageComponent
            src={"/png/playstore.png"}
            layout="intrinsic"
            width={120}
            height={0}
            alt="play store"
            onError={handleImageError}
          />
        </button>
        <button
          style={{ border: "none" }}
          onClick={() =>
            window.open(links?.appstore)
          }
          // className={`${styles.socialbtn} mb-3`}
        >
          <ImageComponent
            src={"/png/appstore.png"}
            layout="intrinsic"
            width={120}
            height={0}
            alt="Apple store"
            onError={handleImageError}
          />
        </button>
      </div>
    </>
  );
};
export default AppModal;
