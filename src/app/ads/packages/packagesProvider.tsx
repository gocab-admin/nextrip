"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dispatch } from '@/redux/store';
import dynamic from "next/dynamic";
import Header from "@/app/ads/components/adsHeader";
import { usePageContext } from '@/components/Providers/PageContext';
import styles from './packagesProvider.module.scss';
import { adsPackageList } from '@/redux/slice/user/BookingSlice';
import { useSelector } from 'react-redux';
// import { currencyReverseRate } from '@/Utils/currencyRate';

// const Footer = dynamic(() => import("@/components/footer"));

const PackagesProvider = () => {
    const { i18, currency, responsiveView } = usePageContext();
    const { getPackageData } = useSelector((state: any) => state.bookingEstimation);
    const packageList = getPackageData?.data?.packages
    const navigate = useRouter();
    const userType = typeof window !== "undefined" && localStorage?.getItem("usersType");
    const [selectedPackages, setSelectedPackages] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        dispatch(adsPackageList())
    }, [])

    // Don't remove below comment
    // const handleCheckboxChange = (id: string, price: number) => {
    //     setSelectedPackages((prev) => ({
    //         ...prev,
    //         [id]: !prev[id]
    //     }))
    // }

    const handleCheckboxChange = (id: string, price: number) => {
        setSelectedPackages((prev) => {
            const newSelectedPackages = { ...prev };

            if (newSelectedPackages[id]) {
                delete newSelectedPackages[id]; // Uncheck
            } else {
                newSelectedPackages[id] = true; // Check
            }

            return newSelectedPackages;
        });
    };

    const totalItems = Object.keys(selectedPackages)
        .filter(id => selectedPackages[id]);

    const totalPackages = Object.keys(selectedPackages)
        .filter(id => selectedPackages[id])
        .reduce((sum, id) => {
            const packageItem = packageList?.find((packages: any) => packages?._id === id);
            return sum + (packageItem ? packageItem?.price : 0);
        }, 0)

    const handleAddCartPackages = () => {
        const selectedIds = Object.keys(selectedPackages).filter(id => selectedPackages[id]);
        const queryString = selectedIds.map(id => `packages=${id}`).join("&");
        navigate.push(`/ads/packages/cart?${queryString}`);
    };

    return (
        <>
            <div className={styles.stickyHeader}>
                <Header center="hide" type={userType === "user" ? "" : "host"} page="hide" />
            </div>

            <div className={styles.packageMainSection}>
                <div className={styles.packageSection}>
                    <div className={styles.packageBanner}>
                        <img src="/images/letgoPngs/image.jpeg" alt='packageBanner' width='100%' />
                    </div>
                    <div className={styles.packageList}>
                        {packageList?.map((packages: any, index: any) => {
                            return (
                                <div key={index} className={styles.packageItem}>
                                    <div className={styles.packageType}>
                                        <div className={styles.packageWithExample}>
                                            <div className={styles.packageTypeName}>{packages?.type} AD</div>
                                            {/* Don't remove below comment */}
                                            {/* <button className={styles.packageSeeExampleBtn}>See example</button> */}
                                        </div>
                                        <ul className={styles.packageTypeDetails}>
                                            <li>
                                                <span></span>
                                                <span>Get noticed with '{packages?.type.toUpperCase()}' tag in a top position</span>
                                            </li>
                                            <li>
                                                <span></span>
                                                <span>Package available for {packages?.validityDays} days</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={styles.packageValidityDays}>
                                        <p>{packages?.packageName}</p>
                                        <div>
                                            <span></span>
                                            <span>{packages?.description}</span>
                                        </div>
                                        <div className={styles.packagePriceList}>
                                            <ul>
                                                <li>
                                                    <div className={styles.packagePriceCheckboxdiv}>
                                                        <div className={styles.packagePriceCheckboxdiv1}>
                                                            <div className={styles.packagePriceCheckboxdiv2}>
                                                                <div className={styles.packagePriceCheckboxdiv3}>
                                                                    <label className={styles.packagePriceCheckbox}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={!!selectedPackages[packages?._id]}
                                                                            onChange={() => handleCheckboxChange(packages?._id, packages?.price)}
                                                                            disabled={!selectedPackages[packages?._id] && Object.keys(selectedPackages).length === 1}
                                                                        />
                                                                        {/* Don't remove below empty span */}
                                                                        <span></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <label className={styles.packagePriceLabel}>{packages?.adsLimit} Ads</label>
                                                    </div>
                                                    <div className={styles.packageDicountPrice}>
                                                        {/* Don't remove below comment */}
                                                        {/* <div className={styles.packageDiscountTag}>
                                                            <img src='/images/letgoPngs/discountPic.webp' />
                                                            <p>-25%</p>
                                                        </div> */}
                                                        <div className={styles.packageFinalPrice}>
                                                            <p>{packages?.currency} {packages?.price}</p>
                                                            {/* Don't remove below comment */}
                                                            {/* <span>{packages?.price}</span> */}
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {totalPackages > 0 &&
                        <div className={styles.packageCartBtn}>
                            <button className={styles.cartButton} onClick={handleAddCartPackages}>
                                <div className={styles.cartButtonDiv1}>
                                    <div className={styles.cartButtonDiv2}>
                                        <span>{totalItems?.length} item</span>
                                        <span className={styles.cartButtonVerticalLine}></span>
                                        <span>Total {packageList[0]?.currency} {totalPackages}</span>
                                    </div>
                                    <div>
                                        <span>View Cart</span>
                                        <span></span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default PackagesProvider;
