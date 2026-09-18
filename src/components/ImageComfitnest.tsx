import Image from "next/image";
import { handleImageError } from "@/services/utils/utils";

const imageLoader = ({ src, width, quality = 80 }:any) => {
  return `${src}?_w=${width}&_q=${quality}`;
};

const ImageComfitnest = ({
  src = "",
  altSrc = "/images/placeholder-sq.jpg",
  alt = "image",
  ...rest
}) => {
  console.log("Image src:", src);

  return (
   <>
    <Image
      alt={alt}
      src={src || altSrc}
      loader={imageLoader}
      onError={handleImageError}
      {...rest}
    />
   </>
  );
};

export default ImageComfitnest;
