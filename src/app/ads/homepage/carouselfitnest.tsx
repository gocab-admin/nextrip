import React, { Fragment, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { ChevronLeft, ChevronRight } from "@/app/global/svg";

import styles from "./carousel.module.scss";
import { getApiMethod } from "@/services/global";
import Image from "next/image";
import { usePageContext } from "@/components/Providers/PageContext";

const ImageComponent = dynamic(() => import("@/components/ImageComfitnest"));

function ProductImageCarousel({ images }: any) {
  console.log("ProductImageCarousel",images)
  const [listData, setList] = useState([]);
  const { baseUrl } = usePageContext();
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<any>(0);
  const [touchMoveX, setTouchMoveX] = useState<any>(0);
  
  const fetchData = async () => {
    // debugger
      // const data = images?.listingAttachmentDatas.map((item: any) => {
            // debugger
            // item.images = [
            //   {
            //     src: '/images/errorImage.webp'
            //   }
            // ];
            if (images.image) {
              // debugger
              const attachments = images.image;
              if (attachments) {
                // debugger
                const myimages = attachments.groupImage.map(
                  (groupImage: any) => ({
                    src: baseUrl + groupImage.imagePath
                  })
                );
                myimages.unshift({
                  src: baseUrl + attachments.coverImage
                });
                images.images = myimages;
                console.log("dataaa", myimages)
                setList(myimages)
              }
            }


          
      // })

  }
  useEffect(() => {
    fetchData();
  }, [])

  const handleTouchStart = (event: any) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const nextSlide = () => {
    if (index < listData.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleTouchMove = (event: any) => {
    setTouchMoveX(event.touches[0].clientX);
    const deltaX = touchMoveX - touchStartX;

    // Adjust sensitivity as needed
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      setTouchStartX(touchMoveX);
    }
  };

  return (
    <div className={`${styles.upload_img_container} h-100`}>
      <div className="position-relative h-100">
        <div
          className={`${styles.upload_image_sec} h-100`}
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "0.8s"
          }}
        >
          {listData.map((item: any, id: any) => (
            <Fragment key={`image${  id}`}>
              {/* {item.src} */}
              <ImageComponent
                src={item.src}
                alt="Picture of the author"
                layout="fill"
                objectFit="cover"
                loading="lazy"
                className={`${styles.upload_img}`}
              />
            </Fragment>
          ))}
        </div>
        <div className={`${styles.productdots}`}>
          <div
            className="d-flex"
            style={{
              transform: `translateX(-${
                (index - 2 <= 0
                  ? 0
                  : index >= listData.length - 3
                  ? listData.length - 5
                  : index - 2) * 12
              }px)`,
              transition: "all 0.6s cubic-bezier(0.46, 0.03, 0.52, 0.96) 0s"
            }}
          >
            {listData.map((image: any, i: number) => (
              <span
                key={`dots${  i}`}
                className={`${styles.dot_c} ${
                  index == i ? styles.active_dot : ""
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`${styles.arrow} ${styles.arrow_left}  ${
          !(index > 0) ? styles.dot_disabed : ""
        }`}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            // if (index > 0) {
            //   setIndex(index - 1);
            // }
          }}
        >
          <ChevronLeft
            width="11px"
            height="11px"
            fill="var(--footer-text-color)"
            style={{ stroke: "currentColor" }}
          />
        </button>
      </div>
      <div
        className={`${styles.arrow} ${styles.arrow_right}  ${
          !(index < listData.length - 1) ? styles.dot_disabed : ""
        }`}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            // if (index < images.length - 1) {
            //   setIndex(index + 1);
            // }
          }}
        >
          <ChevronRight
            width="11px"
            height="11px"
            fill="var(--footer-text-color)"
            style={{ stroke: "currentColor" }}
          />
        </button>
      </div>
    </div>
  );
}

export default ProductImageCarousel;
