import React from "react";
import { ImageList, ImageListItem } from "@mui/material";

import styles from "@/app/rooms/page.module.scss";

const RoomsPageloader = (props: any) => {
  const {galleryImage} = props
  
  return (
    <div className={`${styles.detailpage} container mt-4`}>
      <div className={`${styles.place}`}>
        <div className={`${styles.detail_header}`}>
          <h3 className="card-title placeholder-glow mt-4">
            <span className="placeholder col-6"></span>
          </h3>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-4"></span>
          </p>
        </div>
        <div
          className={`${styles.gridLayouts} border-0 card placeholder-glow mt-5`}
        >
          <ImageList
            key={galleryImage[0].img}
            sx={{
              width: "100%",
              height: 400,
              gridTemplateRows: "49% 50%"
            }}
            variant="quilted"
            cols={4}
            className={`${styles.imagesection} m-0`}
          >
            {galleryImage.map((item: any, i: any) => (
              <ImageListItem
                key={i}
                cols={item.cols || 1}
                rows={item.rows || 1}
              >
                <p className="card-img-top placeholder h-100 imagerender"></p>
              </ImageListItem>
            ))}
          </ImageList>
        </div>
        <div className={`${styles.skeleton} mt-5`}>
          <div className={`${styles.detail_header}`}>
            <p className="card-title placeholder-glow">
              <span className="placeholder col-8"></span>
            </p>
            <p className="card-text placeholder-glow">
              <span className="placeholder col-5"></span>
            </p>
          </div>
          <div className={`${styles.skeleton}`}>
            <div className="d-flex justify-content-end card-circle placeholder-glow me-4">
              <p
                className="placeholder col-1"
                style={{
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px"
                }}
              ></p>
            </div>
            <div>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-6"></span>
              </p>
              <h3 className="card-title placeholder-glow">
                <span className="placeholder col-12"></span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoomsPageloader;
