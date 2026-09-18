import { useSelector } from "react-redux";
import styles from './editModal.module.scss'
import { usePageContext } from "@/components/Providers/PageContext";

export default function GalleryComponent(){
    const selectedImage = useSelector((state: any) => state.hostAbout.selectedImage);
    const { baseUrl } = usePageContext();
    return(
        <div className={styles.upload_sec}>
        {
          Array.isArray(selectedImage) && selectedImage.map((item: any, ind: number) => {
            const containerClass = ind === 0 ? styles.GalleryimageContainer : styles.otherContainer;

            return (
              <div key={ind}>
                <div className={containerClass}>
                  <img
                    src={ item.img}
                    alt="img"
                    className={styles.images}
                  />
                </div>
              </div>
            );
          })
        }

      </div>
    )
}