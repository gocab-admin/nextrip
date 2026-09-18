import React from 'react'

import { Skeleton } from '@mui/material'
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from '@/services/utils/utils';

import styles from "@/app/rooms/page.module.scss";
import RoomsImage from './roomsImage'

const RoomspageImageLayout = (props: any) => {
    const { galleryImage, handleClickOpen, imglist, srcset } = props
    const { responsiveView } = usePageContext();
    return (
    
    <div className={`${styles.gridLayouts} position-relative`}>
    {responsiveView === "sm" || responsiveView === "xs" ? (
      <div className={`${styles.singleImage}`}>
        {galleryImage ? (
          <img
            {...srcset(galleryImage[0].img, 1, 1)}
            alt=""
            loading="lazy"
            onClick={handleClickOpen}
            onError={handleImageError}
            style={{ width: "100%", height: "250px" }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ width: "100%", height: "400px" }}
          />
        )}
      </div>
    ) : (
      <RoomsImage
        imglist={imglist}
        galleryImage={galleryImage}
        handleClickOpen={handleClickOpen}
        handleImageError={handleImageError}
        srcset={srcset}
        src={srcset}
      />
    )}
  </div>
  )
}
export default RoomspageImageLayout
