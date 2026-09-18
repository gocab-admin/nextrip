import React, { useState } from "react";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

import CustomModal from "@/components/modal";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "../../app/rooms/page.module.scss";

const RoomsDescription = (props: any) => {
  const { i18 } = usePageContext();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="py-3">
        <p className={`${styles.para} line-clamp-3`}>{props.desc}</p>
        {props.desc && props.desc.length > 300 &&
          <button
            className={`mt-4 ps-0 btn ${styles.btn_showmore}`}
            onClick={handleClickOpen}
          >
            <span>{i18?.FILTER?.SHOWMORE || "Show More"}</span>
            <ArrowForwardIosSharpIcon fontSize="small" />
          </button>
        }
      </div>

      <CustomModal
        onClose={handleClose}
        open={open}
        title={i18?.PRODUCT?.ABOUTTHISPLACE || "About this place"}
      >
        <div className={`${styles.header} p-3`}>
          <p>
            {props.desc &&
              props.desc.split("\n").map((line: any, index: any) => (
                <div key={index}>
                  {line}
                  <br />
                </div>
              ))}
          </p>
        </div>
      </CustomModal>
    </>
  );
};

export default RoomsDescription;
