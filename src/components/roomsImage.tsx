import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { AllImagesIcon } from "@/app/global/svg";
import { APIURLS } from "@/services/config";
import { getImageUrl } from "./ImageComponent";
import { usePageContext } from "@/components/Providers/PageContext";

import "./header.scss";
import styles from "@/app/rooms/page.module.scss";

interface RoomsImageProps {
  galleryImage: Array<{
    img: string;
    title: string;
    rows?: number;
    cols?: number;
  }>;
  imglist: any;
  handleClickOpen: () => void;
  handleImageError: (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
  srcset: (image: string, size: number, rows?: number, cols?: number) => object;
  src: (image: string, size: number, rows?: number, cols?: number) => object;
}

const RoomsImage: React.FC<RoomsImageProps> = ({
  imglist,
  galleryImage,
  handleClickOpen,
  handleImageError,
  srcset,
  src
}) => {
  const groupImageLength = imglist?.image?.groupImage;
  const getcoverImage = imglist?.image?.coverImage;
  const CoverImg = [];
  CoverImg.push(getcoverImage);
  let imgArr: { img: string; rows?: number; cols?: number }[] = [];
  if (Array.isArray(groupImageLength)) {
    imgArr = groupImageLength.map((image) => ({
      img: image.imagePath
    }));
  }

  if (getcoverImage) {
    imgArr.push({ img: getcoverImage });
  }
  const { i18 } = usePageContext();

  const swiperCustomStyles = `
  .swiper-button-prev,
  .swiper-button-next {
    color: grey; 
    background-color: #ffffff; 
    font-size: 15px;
    width: 30px; 
    height: 30px; 
    border-radius: 50%;
  }
  .swiper-button-prev {
    left: 10px; 
  }
  .swiper-button-next {
    right: 10px; 
  }
  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 20px; 
  }
`;

  return (
    <>
      {imgArr?.length >= 5 && (
        <ImageList
          key={galleryImage[0].img}
          sx={{
            width: "100%",
            height: 400,
            gridTemplateRows: "49% 50%"
          }}
          variant="quilted"
          cols={4}
          className={`${styles.imagesection} my-3`}
        >
          {galleryImage.map((item: any, index: any) => (
            <ImageListItem
              key={index}
              cols={item.cols || 1}
              rows={item.rows || 1}
              className={styles.imageContainer}
              sx={{ cursor: "pointer" }}
            >
              <img
                className={`${styles.imgEffect}`}
                {...srcset(getImageUrl(item.img), 121, item.rows, item.cols)}
                alt={item.title}
                loading="lazy"
                onClick={handleClickOpen}
                onError={handleImageError}
              />
              <div className={styles.overlay}></div>
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* condition based render show all btn */}
      {imgArr?.length >= 5 && (
        <button
          className={`btn ${styles.btn_allimg} d-flex align-items-center`}
          onClick={handleClickOpen}
        >
          <AllImagesIcon
            className="me-1"
            style={{
              display: "block",
              height: "16px",
              width: "16px",
              fill: "var(--text-color)"
            }}
          />
          <span>{i18?.ROOMPAGE?.SHOWALLPHOTOS || "Show all photos"}</span>
        </button>
      )}

      {imgArr?.length == 1 && (
        <ImageList
          key={galleryImage[0].img}
          sx={{
            width: "100%",
            height: "400px !important",
            gridTemplateRows: "100%"
          }}
          variant="quilted"
          cols={1}
          className={`${styles.imagesection} my-3`}
        >
          {CoverImg.map((item: any, index: any) => (
            <ImageListItem
              key={index}
              cols={item.cols || 1}
              rows={item.rows || 1}
              className={styles.imageContainer}
              sx={{ width: "100%", height: "400px !important" }}
            >
              <img
                className={`${styles.imgEffect}`}
                {...src(getImageUrl(item), 121)}
                alt={item.title}
                loading="lazy"
                onClick={handleClickOpen}
                onError={handleImageError}
                style={{ objectFit: "cover" }}
              />
              <div className={styles.overlay}></div>
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {(imgArr?.length == 2 || imgArr?.length == 3 || imgArr?.length == 4) && (
        <div>
          <style>{swiperCustomStyles}</style>
          <Swiper
            navigation={true}
            modules={[Navigation]}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            <ImageList
              key={galleryImage[0].img}
              sx={{
                width: "100%",
                height: "400px !important",
                gridTemplateRows: "100%"
              }}
              variant="quilted"
              cols={1}
              className={`${styles.imagesection} my-3`}
            >
              {imgArr.map((item: any, index: any) => (
                <ImageListItem
                  key={index}
                  cols={item.cols || 1}
                  rows={item.rows || 1}
                  className={styles.imageContainer}
                  sx={{ width: "100%", height: "400px !important" }}
                >
                  <SwiperSlide>
                    <img
                      className={`${styles.imgEffect} ${styles.imagesection}`}
                      {...srcset(
                        getImageUrl(item.img),
                        121,
                        item.rows,
                        item.cols
                      )}
                      alt={item.title}
                      loading="lazy"
                      onClick={handleClickOpen}
                      onError={handleImageError}
                      style={{
                        objectFit: "cover",
                        height: "400px",
                        width: "100%",
                        marginBottom: "15px",
                        marginTop: "10px",
                        backgroundColor: "rgba(0, 0, 0, 0.164)",
                        cursor: "pointer"
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.opacity = "0.9")
                      }
                      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                    />
                    <div className={styles.overlay}></div>
                  </SwiperSlide>
                </ImageListItem>
              ))}
            </ImageList>
          </Swiper>
        </div>
      )}
    </>
  );
};

export default RoomsImage;
