import { useEffect, useMemo, useState } from "react";
import styles from "./gallery.module.scss";
import { dispatch } from "@/redux/store";
import {
  fetchGalleryModule,
  selectedGalleryImg,
  SetImageGallery,
} from "@/redux/slice/host/hostAboutDataSlice";
import { useSelector } from "react-redux";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Pagination, Skeleton, Tab } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { setModal } from "@/redux/slice/modalSlice";
import { usePageContext } from "@/components/Providers/PageContext";
import { PhotosIcon } from "@/app/global/svg";
import DeleteIcon from "@mui/icons-material/Delete";
import { Loader } from "@/components/loader";
import { deleteApiMethod } from "@/services/global";
import APICONSTANT from "@/services/apiConstant";
import { addAlert } from "@/redux/slice/AlertSlice";
import ImageComponent from "@/components/ImageComponent";

export default function GalleryModal({ fnc, close, imageCount, selectedImages }: any) {
  const { i18, baseUrl } = usePageContext();
  const data = useSelector((state: any) => state.hostAbout.gallery);
  const isLoading = useSelector((state: any) => state.hostAbout.isLoading);
  const totalCount = useSelector((state: any) => state.hostAbout.totalCount);
  const [value, setValue] = useState("local");
  const [images, setImages] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const handleChangePagination = (event: any, value: any) => {
    setPage(value);
  };
  const Total = Math.ceil(totalCount / 12);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // useEffect(()=>{
  //   setImages(selectedImages)
  // },[selectedImages])

  const nonSelectable = useMemo(()=>{
    return selectedImages.reduce((acc:any, item:any) => {
      acc[item.ImageId] = true;
      return acc;
    }, {});
  },[selectedImages])

  const handleImage = (index: any, imagePath: any, id: any) => {
    if(nonSelectable[id]) {
      return;
    }
    setImages((prevImages: any) => {
      const existingImageIndex = prevImages.findIndex(
        (item: any) => item.ImageId === id
      );
      if (existingImageIndex !== -1) {
        return prevImages.filter((_: any, i: any) => i !== existingImageIndex);
      } else {
        const newImages = [...prevImages, { index, imagePath, ImageId: id }];
        const len = newImages.length + selectedImages.length;
        if(len <= imageCount) {
          return newImages;
        } else {
          const deleteCount = imageCount - selectedImages.length;
          debugger;
          return newImages.slice(-deleteCount);
        }
      }
    });
  };
  useEffect(() => {
    if (value === "gallery")
      dispatch(
        fetchGalleryModule({
          collection: "listings",
          _page: page,
          _limit: "12",
        })
      );
  }, [value, page]);
  const handleImageChange = (e: any) => {
    const files: FileList = e.target.files;
    const formData = new FormData();
    formData.append("collection", "listings");

    for (let i = 0; i < files.length; i++) {
      // imagesArray.push(files[i]);
      formData.append("images[]", files[i]);
    }
    uploadImages(formData);
  };

  const uploadImages = async (formData: FormData) => {
    try {
      const response: any = await dispatch(SetImageGallery(formData));

      if (response.statusCode === 201) {
        setValue("gallery");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const DeleteImages = async () => {
    const str = images.map((item: any) => item.ImageId).join(",");
    debugger;
    const response = await deleteApiMethod(
      `${APICONSTANT.Gallery}?imageIds=${str}`
    );
    if (response.statusCode === 200) {
      dispatch(
        fetchGalleryModule({
          collection: "listings",
          _page: page,
          _limit: "12",
        })
      );
      dispatch(
        addAlert({
          isOpen: true,
          message: response.message,
          type: "success",
          severity: "success",
        })
      );
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: response.message,
          type: "success",
          severity: "success",
        })
      );
    }
  };

  return (
    <div className={`${styles.gallerymodal}`}>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="lab API tabs example"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--search-button-color) !important",
            },
          }}
        >
          <Tab
            label="Local"
            value="local"
            sx={{
              "&.Mui-selected": {
                color: "black",
                fontWeight: "600",
              },
            }}
          />
          <Tab
            label="Gallery"
            value="gallery"
            sx={{
              "&.Mui-selected": {
                color: "black",
                fontWeight: "600",
              },
            }}
          />
        </TabList>
        <TabPanel value="local" sx={{ padding: "0px", marginTop: "30px" }}>
          <section className={`${styles.step8}`}>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Loader />
              </div>
            ) : (
              <label
                className={`d-block ${styles.custom_fileupload}`}
                htmlFor="imageUpload"
              >
                <div className={`${styles.upload_sec} h-100 checkbox`}>
                  <div className={`${styles.photos_upload} mt-5`}>
                    <div>
                      <PhotosIcon
                        width="64"
                        height="64"
                        style={{
                          display: "block",
                          fill: " currentcolor",
                        }}
                      />
                      <div className={`pt-2`}>
                        <label htmlFor="imageUpload">
                          <input
                            type="file"
                            id="imageUpload"
                            className={`${styles.imageUpload}`}
                            onChange={handleImageChange}
                            multiple
                            accept="image/*"
                          />
                          {i18?.ADDPHOTO?.UPLOAD || "Upload from your device"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            )}
          </section>
        </TabPanel>
        <TabPanel value="gallery" sx={{ padding: "0px", marginTop: "30px" }}>
          <>
            {value === "gallery" && (
              <div
                className={`
            ${styles.buttonGallery} 
            d-flex justify-content-end`}
              >
                <div className="d-flex gap-3 align-items-center">
                  <div>
                    <button
                      style={{
                        backgroundColor:
                          images.length > 0
                            ? "var(--search-button-color)"
                            : "#D8D2C2",
                        border:
                          images.length > 0
                            ? "1px solid var(--search-button-color)"
                            : "1px solid #D8D2C2",
                      }}
                      disabled={images.length === 0}
                      onClick={() => {
                        dispatch(selectedGalleryImg(images));
                        fnc(images);
                        close();
                        // { images.length > 0 && dispatch(addCoverImg(singleImg)) }
                        // { editimages.length > 0 && dispatch(addImage(editimages)) }
                        dispatch(setModal("" as any));
                      }}
                    >
                      Upload
                    </button>
                  </div>
                  <button
                    disabled={images.length === 0}
                    onClick={DeleteImages}
                    style={{
                      backgroundColor:
                        images.length > 0
                          ? "var(--search-button-color)"
                          : "#D8D2C2",
                      border:
                        images.length > 0
                          ? "1px solid var(--search-button-color)"
                          : "1px solid #D8D2C2",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <DeleteIcon style={{ color: "#fff" }} />
                  </button>
                </div>
              </div>
            )}
            {data.length > 0 ? (
              <div className={`${styles.section}`}>
                {isLoading ? (
                  <div className="d-flex gap-3">
                    <Skeleton
                      variant="rectangular"
                      width={210}
                      height={200}
                      sx={{ borderRadius: "8px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={210}
                      height={200}
                      sx={{ borderRadius: "8px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={210}
                      height={200}
                      sx={{ borderRadius: "8px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={210}
                      height={200}
                      sx={{ borderRadius: "8px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={210}
                      height={200}
                      sx={{ borderRadius: "8px" }}
                    />
                  </div>
                ) : (
                  Array.isArray(data) &&
                  data.map((item: any, index: any) => {
                    const isSelected = images.some(
                      (selectedItem: any) => selectedItem.ImageId === item._id
                    );
                    return (
                      <div
                        key={index}
                        role={nonSelectable[item._id] ?'':'button'}
                        onClick={() =>
                          handleImage(index, item?.path, item?._id)
                        }
                      >
                        <div className={styles.relative}>
                          <ImageComponent
                            src={item.path}
                            alt="img"
                            className={`${
                              nonSelectable[item._id] ? styles?.noSelect :
                              isSelected ? styles?.imgSelect : styles.img
                            }`}
                            width={100} 
                            height={100}
                          />
                          <div className={styles.absolute}>
                            {isSelected ? (
                              <img
                                src="/svg/circled-check.svg"
                                alt="img"
                                width={25}
                                height={25}
                              />
                            ) : !nonSelectable[item._id] ? (
                              <img
                                src="/svg/circle.svg"
                                alt="img"
                                width={25}
                                height={25}
                              />
                            ): ''}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <section className={`${styles.step8}`}>
                <div className={`${styles.upload_sec} h-100 checkbox`}>
                  <div className={`${styles.photos_upload} mt-5`}>
                    <div>
                      <PhotosIcon
                        width="64"
                        height="64"
                        style={{
                          display: "block",
                          fill: " currentcolor",
                        }}
                      />
                      <h4>Gallery is empty</h4>
                      <button
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid  var(--search-button-color)",
                          backgroundColor: " var(--search-button-color)",
                          color: "#fff",
                        }}
                        onClick={() => setValue("local")}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className={`${styles.footer}`}>
              <Pagination
                count={Total}
                page={page}
                onChange={handleChangePagination}
                sx={{
                  "& .Mui-selected": {
                    backgroundColor: "var(--search-button-color)!important",
                    color: "#fff",
                  },
                }}
              />
            </div>
          </>
        </TabPanel>
      </TabContext>
    </div>
  );
}
