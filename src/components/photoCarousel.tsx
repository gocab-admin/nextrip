"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";

import styles from "./carousel.module.scss";

const PhotoCarousel = (datas: any) => {
  const coverImage = datas?.data?.attachmentData?.[0]?.image.coverImage;
  const groupImages = datas?.data?.attachmentData[0]?.image.groupImage;
  const slideImages = [
    APIURLS.baseUrl + coverImage,
    ...groupImages.map((image: any) => APIURLS.baseUrl + image.imagePath)
  ];
  const maxSteps = slideImages.length;
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    // your carousel settings go here
    //   dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: any) => {
      setCurrentSlide(index);
    }
    //   customPaging: (i:any) => (
    //     <div
    //       style={{
    //         width: '20px',
    //         height: '8px',
    //         backgroundColor: i === currentSlide ? 'white' : 'gray',
    //         borderRadius: '4px',
    //       }}
    //     />
    //   ),
  };

  return (
    <div className={`${styles.carousel}`}>
      <h4 className="d-flex justify-content-center" style={{ color: "white" }}>
        {currentSlide + 1}/{maxSteps}
      </h4>
      <Slider {...settings}>
        {slideImages.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index}`}
              onError={handleImageError}
              className={`${styles.img}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PhotoCarousel;
