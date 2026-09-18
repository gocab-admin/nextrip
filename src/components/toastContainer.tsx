// ToastComponent.tsx
import React from "react";

import { APIURLS } from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import styles from "./table.module.scss";
import ImageComponent from "./ImageComponent";

interface ToastComponentProps {
  imageUrl?: string;
  onOpenModal?: () => void;
  name: string;
}

const ToastComponent: React.FC<ToastComponentProps> = ({
  imageUrl,
  onOpenModal,
  name
}) => {
  const { i18 } = usePageContext();
  console.log('imageUrl',imageUrl)
  return (
    <>
      {imageUrl ? (
        <div className={`${styles.toast}`}>
          <ImageComponent
            src={imageUrl}
            alt="API Image"
            onError={handleImageError}
            width={40}
            height={40}
          />
          <p>
            {i18?.TOAST?.SAVEDTO || "Saved to"} &nbsp;<b>{name}</b>
          </p>
          {/* <button onClick={onOpenModal} >
            Change
          </button> */}
        </div>
      ) : (
        <div className={`${styles.toast}`}>
          {/* <img src={`${APIURLS.baseUrl}${imageUrl}`} alt="API Image" width={40} height={40} /> */}
          <p>
            {i18?.TOAST?.SAVEDTO || "Saved to"} &nbsp;<b>{name}</b>
          </p>
          {/* <button onClick={onOpenModal}>
          Change
          </button> */}
        </div>
      )}
    </>
  );
};

const ToastComponent2: React.FC = () => {
  const { i18 } = usePageContext();
  return (
    <div className={`${styles.toast}`}>
      {/* <img src={`${APIURLS.baseUrl}${imageUrl}`} alt="API Image" width={40} height={40} /> */}
      <p>{i18?.WISHLIST?.WISHLISTREMOVED || "Wishlist removed"}</p>
    </div>
  );
};
export { ToastComponent, ToastComponent2 };
