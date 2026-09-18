"use client"
import React, { useEffect, useMemo, useState } from 'react'
import commonstyles from './page.module.scss';
import { getApiMethod } from '@/services/global';
import Link from 'next/link';
import styles from './carousel.module.scss';
import { StarIcon } from "@/app/global/svg";
import { GenerateUrl } from "@/services/utils/helperURL";
import WidhListHeart from "@/components/wishlistheart";
import { currencyRate } from "@/Utils/currencyRate";
import { useAppSelector } from '@/redux/hooks';
import { currencySelector } from '@/redux/slice/CurrencySlice';
import { usePageContext } from "@/components/Providers/PageContext";
import { APIURLS } from "@/services/config";
import ProductImageCarousel from '../../components/productImageCarousel';
import RecommHomeCard from './recomhomecard.module';
import recommhomecardstyles from './recommhomecard.module.scss';

function RecommHome({themeData}:any) {
  const { i18, currency } = usePageContext();
  const { CurrencyList } = useAppSelector(currencySelector);
  const [listData, setList] = useState([]);
  const [categoryData, setcategoryData] = useState<any[]>([]);
  const [categoryId, setcategoryid] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);


  useEffect(()=>{
    if(Array.isArray(themeData?.categories)) {
    setcategoryData(themeData?.categories)
    setcategoryid(themeData?.categories[0]._id)
    setCategoryLoading(false);
    }
  },[themeData])

  const categoryMap = useMemo(()=>{
    const obj:any = {};
    for(let i=0;i<categoryData.length;i+=1) {
      if(categoryData[i]?._id) {
        obj[categoryData[i]._id] = categoryData[i];
      }
    }
    return obj;
  },[categoryData])

  const fetchData = async () => {
      setLoading(true);
      const res = await getApiMethod(`listing/detail?_limit=8`);
      if (Array.isArray(res.data.approvedListing)) {
        const data = res.data.approvedListing.map((item: any) => {
          item.images = [
            {
              src: '/images/errorImage.webp'
            }
          ];
          if (item.attachmentData.length > 0) {
            const attachments = item.attachmentData[0].image;
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
          }

          return item;
        });
        setList(data)
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    console.log("Category clicked:", categoryId);
    setcategoryid(categoryId)
    // Add logic to handle the category click, e.g., navigate or update state
  };

  return (<>
    <div className="row">
      {/* <h5 className={`${commonstyles.title} text-center`}>{i18?.HOMEPAGE?.POPULARCATEGORIES || 'Popular Sports'}</h5>
      <div className='overflow-auto d-flex justify-content-center'>
      {categoryLoading?
      Array.from(Array(6)).map((item: any, index: number) => (
        <div className={`col ${recommhomecardstyles.cardContainer}`} key={`${index}`} style={{height: '200px'}}>
          <div
                className={`card ${recommhomecardstyles.card} ${styles.placeholder_img} card h-100`}
                aria-hidden="true"
              >
                <p className="card-text placeholder-glow h-100">
                  <span className="placeholder col-12 h-100"></span>
                </p>
              </div>
        </div>
      )): 
      categoryData?.map((item: any) => (
        <RecommHomeCard
          key={item._id}
          image={item.icon}
          label={item.category}
          handleCategoryClick={() => handleCategoryClick(item._id)}
        />
      ))}
      </div> */}
    </div>
    <div className="row mb-4">
      <h5 className={`${commonstyles.title}`}>Based on {categoryMap[categoryId] ? categoryMap[categoryId]?.category: ''}</h5>
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
          ):
        listData?.map((list: any, i: any) => (
          <div className={`${styles.homepage}`} key={i}>
            <Link
              // href="/"
              href={GenerateUrl(
                "/",
                list.propertyCategoryName,
                list.propertyName,
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
                    {list.propertyName}
                    {/* {props.productkey} */}
                  </h4>
                  <p className={`${styles.place_day} m-0`}>
                    {list?.priceData?.pricing?.perHour > 0 && <> <b>
                      {CurrencyList.currency}{" "}
                      {currencyRate(list?.priceData?.pricing?.perHour, currency?.exchange_rate)}
                    </b>{" "}
                      <span>{i18?.BOOKINGPAGE?.PERHOUR || "per hour"}{" "}</span>
                    </>}

                    {list?.priceData?.pricing?.perDay > 0 && list?.priceData?.pricing?.perHour > 0 && ' | '}

                    {list?.priceData?.pricing?.perDay > 0 && <>
                      <b>
                        {CurrencyList.currency}{" "}
                        {currencyRate(list?.priceData?.pricing?.perDay, currency?.exchange_rate)}
                      </b>{" "}
                      <span>{i18?.BOOKINGPAGE?.PERDAY || "per day"}{" "}</span>
                    </>}

                  </p>
                  <span
                    className={`${styles.rating} m-0 d-flex align-items-center`}
                  >
                    <span className="me-1">
                      <StarIcon
                        width="10px"
                        height="10px"
                        color="var(--footer-text-color)"
                      />
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

export default RecommHome;
