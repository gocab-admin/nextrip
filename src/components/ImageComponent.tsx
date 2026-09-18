import Image from "next/image";
import { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";

export const getImageUrl = (imagePath: any) => {
  if (!imagePath) return "";

  // If it's an object from require/import, use its .src
  if (typeof imagePath === "object" && imagePath.src) {
    return imagePath.src;
  }

  const pathStr = String(imagePath);

  if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
    if (pathStr.startsWith(`${APIURLS.imageUrl}`)) {
      return pathStr;
    }
    return pathStr;
  }

  return `${APIURLS.imageUrl}${pathStr}`;
};


const imageLoader = ({ src, width, quality = 80 }: any) => `${src}?_w=${width}&&_q=${quality}`;

const ImageComponent = ({
  src = "",
  altSrc = "",
  alt = "image",
  img,
  // width = "",
  // height = "",
  // quality = "",
  // layout = "fill",
  // objectFit = "cover",
  // loading = "lazy",
  // className,
  ...rest
}: any) => {
  const finalSrc = getImageUrl(src);
  console.log('imagepath', src, finalSrc)

  const isAbsolute = finalSrc.startsWith("http://") || finalSrc.startsWith("https://");
  return (
    <>
      {/* {APIURLS.imageUrl + src} */}
      <Image
        alt={alt}
        // src={src ? src : altSrc ? altSrc : '/images/placeholder-sq.jpg'}
        src={finalSrc}
        // src={img !== 'static' ? (src ? ((String(src).startsWith('https') || String(src).startsWith('http')) ? src : APIURLS.imageUrl + src) : '/images/placeholder-sq.jpg') : src}
        loader={isAbsolute ? undefined : imageLoader}
        onError={handleImageError}
        {...rest}
      />
    </>
  );
};

export default ImageComponent;
