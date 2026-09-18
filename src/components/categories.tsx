import { useAppSelector } from "@/redux/hooks";
import {
  updateCategoryList,
  categorySelector,
} from "@/redux/slice/categoriesSlice";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { dispatch } from "@/redux/store";
import APICONSTANT from "@/services/apiConstant";
import { getApiMethod } from "@/services/global";
import { useEffect, useRef, useState } from "react";
import styles from "./componentheaderstyles.module.scss";
import { Skeleton } from "@mui/material";
import { CategoryName } from "@/services/utils/helperURL";
import ImageComponent from "./ImageComponent";
import { APIURLS } from "@/services/config";
import HomePageFilter from "./homepageFilter";
import { usePageContext } from "@/components/Providers/PageContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setFilterValues } from "@/redux/slice/searchValue";
import { currencyReverseRate } from "@/Utils/currencyRate";

const Categories = ({ cateData }: any) => {
  const { responsiveView, currency } = usePageContext();
  const categories = cateData?.categories;
  const modalContentRef = useRef<any>(null);
  const category_ref: any = useRef();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { propertycategory } = useAppSelector(categorySelector);
  const [isLoading, SetIsLoding] = useState(true);
  const [category, setCategory] = useState<any>("");
  const [scrollvalue, setScrollvalue]: any = useState<number>(0);
  const [totalScroll, setTotalScroll]: any = useState<number>(0);
  // const { status } = useSelector(userSelector);
  // const isAuth = status?.loginStatus
  useEffect(() => {
    // after selecting category and navigate backto home page should update property
    if (propertycategory.length > 0 && pathname === "/") {
      console.log("categories", propertycategory);
      setCategory(propertycategory[0]?._id);
      dispatch(updateCategoryList({ categoryId: propertycategory[0]?._id }));
    }
  }, [pathname]);

  useEffect(() => {
    const min: any = typeof searchParams.get("minPrice");
    const max: any = searchParams.get("maxPrice");
    const bathRoom: any = searchParams.get("bathRoom");
    const bedRoom: any = searchParams.get("bedRoom");

    setFilterValues({
      address: {
        lat: searchParams.get("lat") || "",
        lng: searchParams.get("lng") || "",
        location: searchParams.get("location") || "",
      },
      guests: {
        adult: searchParams.get("adult") || 0,
        children: searchParams.get("children") || 0,
        pets: searchParams.get("pets") || 0,
      },
      // amenities: checkedAmenities,
      privileges: searchParams.get("privileges")
        ? searchParams.get("privileges")?.split(",")
        : [],
      priceData: {
        minMaxVal: { min: 10, max: 100 },
        minPrice: min ? currencyReverseRate(min, currency.exchange_rate) : 0,
        maxPrice: max ? currencyReverseRate(max, currency.exchange_rate) : 0,
      },
      accomendation: {
        bathRoom: bathRoom ? parseInt(bathRoom) : 0,
        bedRoom: bedRoom ? parseInt(bedRoom) : 0,
      },
    });
    if (!cateData.page) {
      getapi(APICONSTANT.propertyCategory);
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
    dispatch(updateCategoryList({ categoryId: initialCategory?._id }));
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

  const handleChange = (cat: any) => {
    dispatch(updateCategoryList({ categoryId: cat._id }));
    setCategory(cat._id);
    let params = searchParams.toString();
    window.history.replaceState(
      {},
      "",
      `/c/${CategoryName(cat.category)}${params ? "?" + params : ""}`
    );
  };
  return (
    <>
      <div
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
                  <Skeleton
                    variant="circular"
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }} // Adjust styling as needed
                  />
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
                // fill="var(--new-text-color-purplerooms )"
                onClick={() => {
                  category_scroll(-1);
                }}
              />
            </button>
            <div className={`${styles.categories} d-grid`} ref={category_ref}>
              <>
                {propertycategory ? (
                  propertycategory.map((cat: any, i: number) => (
                    <button
                      className={`${styles.category} ${
                        category === cat._id ? styles.active : ""
                      } text-center`}
                      key={`category${i}`}
                      onClick={() => handleChange(cat)}
                    >
                      <ImageComponent
                        className="m-0"
                        src={cat.icon}
                        // altSrc={'/images/dummycategory.jpg'}
                        width={35}
                        height={35}
                        alt={`category_${i}`}
                        style={
                          cat?.icon
                            ? {}
                            : {
                                opacity: "0.65",
                              }
                        }
                        priority
                      />
                      <p className="m-0 py-2">{cat.category}</p>
                    </button>
                  ))
                ) : (
                  <></>
                )}
              </>
            </div>
            <button
              className={`${styles.next} ${
                scrollvalue + 10 >= totalScroll ? "d-none" : ""
              }`}
            >
              <TfiArrowCircleRight
                // fill="var(--new-text-color-purplerooms )"
                onClick={() => {
                  category_scroll(1);
                }}
              />
            </button>
          </div>
        )}
        {responsiveView === "sm" || responsiveView === "xs" ? (
          <></>
        ) : (
          <HomePageFilter />
        )}
      </div>
    </>
  );
};

export default Categories;
