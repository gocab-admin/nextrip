import React, { useEffect, useMemo, useState } from 'react'
import commonstyles from './page.module.scss';
import { getApiMethod } from '@/services/global';
import Link from "next/link";
import styles from './carousel.module.scss';
import { StarIcon } from "@/app/global/svg";
import { GenerateUrl } from "@/services/utils/helperURL";
import WidhListHeart from "@/components/wishlistheart";
import { currencyRate } from "@/Utils/currencyRate";
import { useAppSelector } from '@/redux/hooks';
import { currencySelector } from '@/redux/slice/CurrencySlice';
import { usePageContext } from "@/components/Providers/PageContext";
import { APIURLS } from "@/services/config";
import ProductImageCarousel from './productItem.module';
import CategoryCard from './categorycard.module';
import categoryStyles from './categorycard.module.scss';

function Category({ themeData, setCategoryName }: any) {
  const { i18, currency, settings } = usePageContext();
  const { CurrencyList } = useAppSelector(currencySelector);
  const [listData, setList] = useState([]);
  const [catogoryData, setCatogoryData] = useState<any[]>([]);
  const [catogoryId, setCatogoryid] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const areAdsHidden = settings?.hiddenSettings?.ads === "1";


  useEffect(() => {
    if (Array.isArray(themeData?.categories) && themeData.categories[0]) {
      setCatogoryData(themeData?.categories)
      setCatogoryid(themeData?.categories[0]._id)
      setCategoryName(themeData?.categories[0].category)
      setCategoryLoading(false);
    } else if (Array.isArray(themeData?.categories) && themeData.categories.length === 0) {
      // category empty handle
      setCategoryLoading(false)
    }
  }, [themeData])

  const categoryMap = useMemo(() => {
    const obj: any = {};
    for (let i = 0; i < catogoryData.length; i += 1) {
      if (catogoryData[i]?._id) {
        obj[catogoryData[i]._id] = catogoryData[i];
      }
    }
    return obj;
  }, [catogoryData])

  const fetchData = async () => {
    if (catogoryId) {
      setLoading(true);
      let adsUrl = `ads/detail?category=${catogoryId}&_limit=8`
      const res = await getApiMethod(adsUrl);
      if (Array.isArray(res.data.approvedAds)) {
        const data = res.data.approvedAds.map((item: any) => {
          item.images = [
            {
              src: '/images/errorImage.webp'
            }
          ];
          const attachments = item?.image;
          if (attachments) {
            const myimages = attachments.groupImage.map(
              (groupImage: any) => ({
                src: APIURLS.baseUrl + groupImage.imagePath
              })
            );
            myimages.unshift({
              src: APIURLS.baseUrl + attachments.coverImage
            });
            item.images = myimages;
          }

          return item;
        });
        setList(data)
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [catogoryId])

  const handleCategoryClick = (item: any) => {
    console.log("Category clicked:", item);
    setCatogoryid(item?._id)
    setCategoryName(item?.category)
    // Add logic to handle the category click, e.g., navigate or update state
  };

  return (<>
    <div className="row">
      <h5 className={`${commonstyles.title} text-center`}>{i18?.HOMEPAGE?.POPULARCATEGORIES || 'Popular Categories'}</h5>
      <div className={`${styles.cardcontainer} d-flex gap-4`}>
        {categoryLoading ?
          Array.from(Array(6)).map((item: any, index: number) => (
            <div className={`col ${categoryStyles.cardContainer}`} key={`${index}`} style={{ height: '200px' }}>
              <div
                className={`card ${categoryStyles.card} ${styles.placeholder_img} card h-100`}
                aria-hidden="true"
              >
                <p className="card-text placeholder-glow h-100">
                  <span className="placeholder col-12 h-100"></span>
                </p>
              </div>
            </div>
          )) :
          catogoryData?.map((item: any) => (
            <CategoryCard
              key={item._id}
              image={item.image || item.icon}
              label={item.category}
              handleCategoryClick={() => handleCategoryClick(item)}
              active={item._id === catogoryId}
            />
          ))}
      </div>
    </div>
    <div className="row mb-4">
      <h5 className={`${commonstyles.title}`}>Based on {categoryMap[catogoryId] ? categoryMap[catogoryId]?.category : ''}</h5>
      <div className={`${styles.imageGrid} mb-4`}>
        {
          loading ? (
            Array.from(Array(8)).map((item: any, index: number) => (
              <div className={`${styles.homepage}`} key={`${index}`}>
                <div className={`${styles.place}`}>
                  <div className={`${styles.image_container}`}>
                    <div
                      className={`${styles.placeholder_img} card h-100`}
                      aria-hidden="true"
                    >
                      <p className="card-text placeholder-glow h-100">
                        <span className="placeholder col-12 h-100"></span>
                      </p>
                    </div>
                    <h5 className="card-title placeholder-glow mt-2">
                      <span className="placeholder col-6"></span>
                    </h5>
                    <p className="card-text placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) :
            listData?.map((list: any, i: any) => (
              <div className={`${styles.homepage}`} key={i}>
                <Link
                  // href="/"
                  href={GenerateUrl(
                    "/ads/",
                    list.categoryName,
                    list.name,
                    list._id
                  )}
                  target="_blank"
                >
                  <div className={`${styles.place}`}>
                    <div className={`${styles.image_container}`}>
                      <ProductImageCarousel images={Array.isArray(list.images) ? list.images : []} />
                      <WidhListHeart list={list} type="" />
                    </div>
                    <div className={`${styles.detail} d-grid mt-3`}>
                      <h4 className="m-0 text-dark text-capitalize">
                        {list.name}
                        {/* {props.productkey} */}
                      </h4>
                      <p className={`${styles.place_day} m-0`}>
                        {list?.price > 0 && <> <b>
                          {CurrencyList.currency}{" "}
                          {currencyRate(list?.price, currency?.exchange_rate)}
                        </b>{" "}
                          {/* <span>{i18?.BOOKINGPAGE?.PERHOUR || "per hour"}{" "}</span> */}
                        </>}

                        {/* {list?.price > 0 && list?.price > 0 && ' | '} */}

                        {/* {list?.price > 0 && <>
                      <b>
                        {CurrencyList.currency}{" "}
                        {currencyRate(list?.price, currency?.exchange_rate)}
                      </b>{" "}
                      <span>{i18?.BOOKINGPAGE?.PERDAY || "per day"}{" "}</span>
                    </>} */}

                      </p>
                      <span
                        className={`${styles.rating} m-0 d-flex align-items-center`}
                      >
                        <span className="me-1">
                          {/* {settings?.hiddenSettings?.ads === '1' ? <StarIcon
                        width="10px"
                        height="10px"
                        color="var(--footer-text-color)"
                      /> : ''} */}
                        </span>
                        <span className="text-dark">
                          {list.totalRatingCount !== 0
                            ? list.totalRatingCount
                            : i18?.PRODUCT?.NEW || "New"}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
      </div>
    </div></>
  )
}

export default Category
