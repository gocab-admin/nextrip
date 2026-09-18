"use client";
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from "next/dynamic";
import Header from "@/app/ads/components/adsHeader";
import { usePageContext } from '@/components/Providers/PageContext';
import styles from './packagesCart.module.scss'
import { toast } from "react-toastify";
import { adsCheckoutData, adsPaymentStatus, isLoadingPayment } from '@/redux/slice/user/BookingSlice';
import { dispatch } from '@/redux/store';
import { useSelector } from 'react-redux';

const Footer = dynamic(() => import("@/components/footer"));

const PackagesCart = () => {
  const { i18, responsiveView, settings } = usePageContext();
  const { getAdsCheckoutDetails, getPackageData } = useSelector((state: any) => state.bookingEstimation)
  const packageList = getPackageData?.data?.packages
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const userType = typeof window !== "undefined" && localStorage?.getItem("usersType");
  const selectedPackageIds = searchParams.getAll('packages');

  const selectedPackages = packageList?.filter((pkg: any) => selectedPackageIds.includes(pkg._id));
  const [cartPackages, setCartPackages] = useState<any>(selectedPackages.map((pkg: any) => ({ ...pkg, quantity: 1 })));
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("Stripe");

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (selectedPayment === 'razorpay')
      loadRazorpayScript();
  }, [selectedPayment])

  useEffect(() => {
    setCartPackages(cartPackages);
    updateTotalPrice(cartPackages);
  }, [cartPackages, packageList]);

  const updateTotalPrice = (packages: any) => {
    const total = packages.reduce(
      (sum: any, pkgs: any) => sum + Number(pkgs?.price || 0) * pkgs?.quantity,
      0
    );
    setTotalPrice(total)
  }

  const handleQuantityChange = (index: number, delta: number) => {
    const updatedPackages = [...cartPackages]
    updatedPackages[index].quantity = Math.max(1, updatedPackages[index].quantity + delta);
    setCartPackages(updatedPackages);
    updateTotalPrice(updatedPackages);
  }

  const handlePaymentSelection = (method: string) => {
    setSelectedPayment(method);
  };

  const handleCheckoutProcess = async () => {
    if (selectedPayment) {
      try {
        dispatch(isLoadingPayment(true));
        const currency = cartPackages[0]?.currency
        const response = await dispatch(adsCheckoutData(selectedPackageIds, currency, totalPrice));
        if (response?.statusCode === 200) {
          if (selectedPayment === "Stripe") {
            dispatch(isLoadingPayment(true));
            localStorage.setItem("packageId", response?.data?.packageId)
            navigate.push(`/ads/packages/payments/?method=${selectedPayment}`);
          } else if (selectedPayment === "razorpay") {
            dispatch(isLoadingPayment(false));
            // Don't remove below comment
            // const options = {
            //   key: settings?.razorPayGateway?.razorpayKeyId,
            //   amount: getAdsCheckoutDetails?.data?.payment?.amount,
            //   currency: getAdsCheckoutDetails?.data?.payment?.currency.toUpperCase(),
            //   order_id: getAdsCheckoutDetails?.data?.payment?.id,
            //   handler: async function (response: any) {
            //     console.log('====================================');
            //     console.log(response);
            //     console.log('====================================');
            //     const value = {
            //       ...response,
            //       paymentMethod: selectedPayment,
            //       packageId: getAdsCheckoutDetails?.data?.packageId
            //     }
            //     const res = await dispatch(adsPaymentStatus(null, value))
            //   }
            // }
            // if (typeof window !== undefined) {
            //   var rzp1: any = new window.Razorpay(options);
            //   rzp1.open();
            // }
          }
        }
      } catch (error) {
        console.error('Error fetching subscription process', error);
      }
    } else {
      toast.info("Please select payment type")
    }
  }

  return (
    <>
      <div className={styles.stickyHeader}>
        <Header center="hide" type={userType === "user" ? "" : "host"} page="hide" />
      </div>
      <div className={styles.packageCartMainSection}>
        <h2 className={styles.packageCartHeading}>
          <span className={styles.packageCartBackArrow} onClick={() => navigate.back()}>
            <ArrowBackIcon />
          </span>
          <span>View Cart</span>
        </h2>

        <div className={styles.packageCartList}>
          <div>
            {cartPackages?.map((pkgs: any, index: any) => {
              return (
                <div key={index} className={styles.packageCartListDetails}>
                  <div>
                    <div className={styles.packageCartListType}>{pkgs?.packageName}</div>
                    <div className={styles.packageCartListLocation}>
                      <span>{pkgs?.description}</span>
                    </div>
                    <div className={styles.packageCartAddingList}>
                      <div className={styles.packageCartListPrice}>
                        <span>{pkgs?.currency} {Number(pkgs?.price) * pkgs?.quantity}</span>
                      </div>
                      {/* Don't remove below comment */}
                      {/* <div className={styles.packageCartListExtraCount}>
                        <button
                          className={styles.packageCartListDecrementBtn}
                          onClick={() => handleQuantityChange(index, -1)}
                        >
                          -
                        </button>
                        <label className={styles.packageCartListBtnLabel}>{pkgs?.quantity}</label>
                        <button
                          className={styles.packageCartListIncrementBtn}
                          onClick={() => handleQuantityChange(index, 1)}
                        >
                          +
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.packageCartPriceDetails}>
            <h3 className={styles.packageCartPriceHeading}>
              <span>PRICE DETAILS</span>
            </h3>
            <div>
              <div className={styles.packageCartPrices}>
                <span>Price</span>
                <span>{cartPackages[0]?.currency} {totalPrice.toLocaleString()}</span>
              </div>
              {/* Don't remove below comment */}
              {/* <div className={styles.packageCartDiscounts}>
                <span>Discount</span>
                <span>37,100 </span>
              </div> */}
            </div>
            <div>
              <div className={styles.packageCartTotalPrice}>
                <span>Total</span>
                <span>{cartPackages[0]?.currency} {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className={styles.packageCartPriceDetails}>
            <h3 className={styles.packageCartPriceHeading}>
              <span>Pay With</span>
            </h3>
            <div>
              <div className={styles.packageCartPrices}>
                <span>Stripe</span>
                <label className={styles.packagePriceCheckbox}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Stripe"
                    checked={selectedPayment === "Stripe"}
                    onChange={() => handlePaymentSelection("Stripe")}
                  />
                  <span></span>
                </label>
              </div>
              {/* Don't remove below comment */}
              {/* <div className={styles.packageCartDiscounts}>
                <span>RazorPay</span>
                <label className={styles.packagePriceCheckbox}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={selectedPayment === "razorpay"}
                    onChange={() => handlePaymentSelection("razorpay")}
                  />
                  <span></span>
                </label>
              </div> */}
            </div>
          </div>
        </div>

        <div className={styles.packageCartPayBtn}>
          <button
            className={styles.packageCartPayButton}
            onClick={handleCheckoutProcess}
          >
            Pay {cartPackages[0]?.currency} {totalPrice.toLocaleString()}
          </button>
        </div>
      </div>
    </>
  )
}

export default PackagesCart
