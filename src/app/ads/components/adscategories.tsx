import { useAppSelector } from "@/redux/hooks";
import {
  updateCategoryList,
  categorySelector
} from "@/redux/slice/categoriesSlice";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { dispatch } from "@/redux/store";
import APICONSTANT from "@/services/apiConstant";
import { getApiMethod } from "@/services/global";
import { useEffect, useRef, useState } from "react";
import styles from "@/components/componentheaderstyles.module.scss";
import { Skeleton } from "@mui/material";
import Popover from "@mui/material/Popover";
import { CategoryName } from "@/services/utils/helperURL";
import { usePageContext } from "@/components/Providers/PageContext";
import AdsMegaMenu from "./adsMegaMenu";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import ImageComponent from "@/components/ImageComponent";
import { APIURLS } from "@/services/config";
import HomePageFilter from "@/app/ads/components/adshomepageFilter";

const Categories = ({ cateData }: any) => {
  const { responsiveView, baseUrl } = usePageContext();
  const categories = cateData?.categories;
  const modalContentRef = useRef<any>(null);
  const category_ref: any = useRef();
  const { propertycategory } = useAppSelector(categorySelector);
  const [isLoading, SetIsLoding] = useState(true);
  const [category, setCategory] = useState<any>("");
  const [scrollvalue, setScrollvalue]: any = useState<number>(0);
  const [totalScroll, setTotalScroll]: any = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // const { status } = useSelector(userSelector);
  // const isAuth = status?.loginStatus

  useEffect(() => {
    if (!cateData.page) {
      getapi(APICONSTANT.adsCategory);
    }
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
  }, []);

  const getapi = async (url: any) => {
    let initialCategory;
    const resp: any = await getApiMethod(url);
    if (resp.statusCode === 200) {
      initialCategory = resp.data.categories[0];
      dispatch(updateCategoryList({ propertycategory: resp.data.categories }));
    } else {
      dispatch(updateCategoryList({ propertycategory: [] }));
    }
    SetIsLoding(false);
    if (cateData.name) {
      const foundCategory = categories.find(
        (category: any) =>
          category.category.toLowerCase() === cateData.name.replace(/-/g, " ")
      );
      if (foundCategory) {
        initialCategory = foundCategory;
      }
    }
    setCategory(initialCategory?._id);
    dispatch(
      updateCategoryList({
        categoryId: initialCategory?._id,
        categoryName: initialCategory?.category
      })
    );
  };

  useEffect(() => {
    if (category_ref.current)
      setTotalScroll(
        category_ref.current.scrollWidth - category_ref.current.clientWidth
      );
  }, [category_ref.current, propertycategory]);

  useEffect(() => {
    if (category_ref.current) {
      const handleScroll = () => {
        // Your custom logic for handling scroll events
        setScrollvalue(category_ref.current.scrollLeft);
      };

      category_ref.current.addEventListener("scroll", handleScroll);
      return () => {
        category_ref.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [category_ref]);

  const category_scroll = (type: number): any => {
    let scrollLeft = category_ref.current.scrollLeft;
    let clientWidth = category_ref.current.clientWidth;
    let scrollWidth = category_ref.current.scrollWidth;
    if (type == -1 && scrollLeft > 0) {
      if (scrollLeft - clientWidth < 0) {
        setScrollvalue(0);
        category_ref.current.scrollLeft = 0;
      } else {
        setScrollvalue(scrollvalue - clientWidth / 2);
        category_ref.current.scrollLeft -= clientWidth / 2;
      }
    } else if (type == 1 && scrollLeft < scrollWidth) {
      if (scrollLeft + clientWidth > scrollWidth) {
        // add offset width
        const scrollableWidth = scrollWidth;
        setScrollvalue(scrollableWidth);
        category_ref.current.scrollLeft = scrollableWidth;
      } else {
        const scrollableWidth = scrollvalue + clientWidth / 2;
        setScrollvalue(scrollableWidth);
        category_ref.current.scrollLeft = scrollableWidth;
      }
    }
  };
  return (
    <>
      <div
        style={{ maxWidth: "1200px", margin: "auto" }}
        className={`${styles.filter} d-flex align-items-center justify-content-between flex-wrap`}
      >
        {isLoading ? (
          <div className={`${styles.category_top} d-flex gap-4`}>
            <div className={`${styles.categories} d-grid`}>
              {Array.from({ length: 12 }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.category} text-center`}
                >
                  {/* <Skeleton
                    variant="circular"
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }} // Adjust styling as needed
                  /> */}
                  <Skeleton
                    variant="text"
                    width={40}
                    height={20}
                    style={{ margin: "auto" }}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`${styles.category_top} d-flex align-items-center`}>
            <button
              className={`${styles.prev} ${
                scrollvalue - 10 <= 0 ? "d-none" : ""
              }`}
            >
              <TfiArrowCircleLeft
                onClick={() => {
                  category_scroll(-1);
                }}
              />
            </button>
            <div className={`${styles.categories} d-grid`} ref={category_ref}>
              <>
                {propertycategory ? (
                  propertycategory.map((cat: any, i: number) =>
                    cat.category.includes("ALL") ? (
                      <button
                        className={`${styles.category} ${
                          category === cat._id ? styles.active : ""
                        } text-center`}
                        key={`category${i}`}
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          setAnchorEl(event.currentTarget);
                        }}
                      >
                        <p className="m-0 py-2 d-flex gap-1 align-items-end">
                          {cat.category}{" "}
                          <KeyboardArrowDownOutlinedIcon
                            className="m-0"
                            style={{
                              transform: open
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s ease"
                            }}
                          />
                        </p>
                      </button>
                    ) : (
                      <button
                        className={`${styles.category} ${
                          category === cat._id ? styles.active : ""
                        } text-center`}
                        key={`category${i}`}
                        onClick={() => {
                          dispatch(
                            updateCategoryList({
                              categoryId: cat._id,
                              categoryName: cat?.category
                            })
                          );
                          setCategory(cat._id);
                          window.history.replaceState(
                            {},
                            "",
                            `/ads/${CategoryName(cat.category)}`
                          );
                        }}
                      >
                        {/* <ImageComponent
                            className="m-0"
                            src={ cat.icon}
                            // altSrc={'/images/dummycategory.jpg'}
                            width={35}
                            height={35}
                            alt={`category_${i}`}
                            style={
                              cat?.icon
                                ? {}
                                : {
                                    opacity: "0.65"
                                  }
                            }
                            priority
                          /> */}
                        <p className="m-0 py-2">{cat.category}</p>
                      </button>
                    )
                  )
                ) : (
                  <></>
                )}
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  sx={{
                    width: "70%",
                    "& .MuiPopover-paper": {
                      width: "100%"
                    }
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}
                  transformOrigin={{ vertical: -8, horizontal: 0 }}
                >
                  <AdsMegaMenu closePopover={handlePopoverClose} />
                </Popover>
              </>
            </div>
            <button
              className={`${styles.next} ${
                scrollvalue + 10 >= totalScroll ? "d-none" : ""
              }`}
            >
              <TfiArrowCircleRight
                onClick={() => {
                  category_scroll(1);
                }}
              />
            </button>
          </div>
        )}
        {/* {
              responsiveView === "sm" || responsiveView === "xs" ? <></> : <HomePageFilter/>
            } */}
      </div>
    </>
  );
};

export default Categories;
