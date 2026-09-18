import React, { useState } from 'react';
import { LuArrowDownUp } from "react-icons/lu";
import { RiArrowDownSLine } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { usePageContext } from '@/components/Providers/PageContext';
import styles from "./adsSmartSorting.module.scss"
import { useSearchParams } from 'next/navigation';
import { searchSelector, setFilterValues } from '@/redux/slice/searchValue';
import { dispatch } from '@/redux/store';
export const AdsSmartSorting = (props: any) => {
  const adsData = useSelector(
    (state: any) => state.approvedlist.listData.approvedAds
  )
  const loading = props.loading
  const { i18 } = usePageContext();
  const searchParams = useSearchParams();
  const search = Object.fromEntries(searchParams);
  // console.log('====================================');
  // console.log(search);
  // console.log('====================================');
  const { smartSorting } = useSelector(searchSelector)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Smart Sorting");

  const sortingOptions = [
    {label: "Publication Date", value: "date"},
    {label: "Price: Low to High", value: "priceLowToHigh"},
    {label: "Price: High to Low", value: "priceHighToLow"},
  ];

  const handleSmartSorting = (value: any) => {
    setSelectedOption(value);
    dispatch(setFilterValues({ smartSorting: value}));
    setIsModalOpen(false);
    setSelectedOption("");
  }

  return (
    <div className={styles.filterListContainer}>
      <div className={styles.filterListSorting}>
        <div className={styles.categoryListingTitle}>
          {/* {loading ? (
            <div className={styles.skeletonLoader}></div>
          ) : (
            <span className={styles.categoryListingCount}>
              {adsData?.length} {i18?.FILTER?.LISTINGS || "listings"}
            </span>
          )} */}
          {loading ? (
            <div className={styles.verticalLineLoader}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <span className={styles.categoryListingCount}>
              {adsData?.length} {i18?.FILTER?.LISTINGS || "listings"}
            </span>
          )}
        </div>
        <div
          className={styles.categoryListingDropown}
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <div>
            <LuArrowDownUp />
          </div>
          <div>Smart Sorting</div>
          <div className={styles.arrowContainer}>
            <RiArrowDownSLine />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.sortingModal}>
          <span>Sort by</span>
          <div className={styles.sortingOptions}>
            {sortingOptions.map((option, index) => (
              <label key={index} className={styles.radioOption}>
                <input
                  className={styles.categoryRadioBtn}
                  type="radio"
                  name="sorting"
                  value={option?.value}
                  checked={selectedOption === option?.value}
                  onChange={() => handleSmartSorting(option?.value)}
                />
                {option?.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
