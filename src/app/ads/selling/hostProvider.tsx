"use client";
import { useEffect, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { Skeleton } from "@mui/material";
import dynamic from "next/dynamic";

import APICONSTANT from "@/services/config";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import { postApiMethod, getApiMethod } from "@/services/global";
import { addUser, updateStatus } from "@/redux/slice/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import Header from "@/app/ads/components/adsHeader";
import isAuth from "@/components/isAuth";
import { addAlert } from "@/redux/slice/AlertSlice";
import { usePageContext } from "@/components/Providers/PageContext";

import "@/components/header.scss";
import styles from "./page.module.scss";

const Footer = dynamic(() => import("@/components/footer"));

const HostProvider = () => {
  const { i18,responsiveView } = usePageContext();
  const dispatch = useAppDispatch();
  const getId =
    typeof window !== "undefined" ? localStorage?.getItem("appUserId") : null;

  const [adsData, setAdsData] = useState({
    total: 0,
    listingdata: []
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const getUserapi = async (url: any) => {
    const resp: any = await getApiMethod(url);
    if (resp.statusCode === 200) {
      setUserData(resp.data.userDetail);
      dispatch(addUser(resp.data.userDetail));
      dispatch(updateStatus({loginStatus: true, listCount: resp.totalCount}))
    } else {
      localStorage.clear();
    }
  };

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await getApiMethod(
        `${ADSAPICONSTANT.hostListings 
          }?_page=${page}&_limit=${rowsPerPage}&list=incomplete`
      );
      if (res.statusCode === 200) {
        setLoading(false);
        setAdsData({
          listingdata: res.data.providerAds,
          total: res.data.total ? res.data.total : 0
        });
      } else {
        setLoading(false);
        console.error(`API request failed with status: ${res.status}`);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handlePublishAds = async (id: any) => {
    try {
      const response = await postApiMethod(`${ADSAPICONSTANT.publish  }/${id}`);
      if (response.statusCode === 200) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "List Published",
            type: "success",
            severity: "success"
          })
        );
        fetchAds();
      } else {
        dispatch(
          addAlert({
            isOpen: true,
            message: response.response.data.message,
            type: "error",
            severity: "error"
          })
        );
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error!");
    }
  };

  useEffect(() => {
    getUserapi(APICONSTANT.signup);
    fetchAds();
  }, []);


  return (
    <>
      <div>
        <Header
          page="hide"
          center={
            responsiveView === "sm" || responsiveView === "xs"
              ? "center"
              : "inbox"
          }
          type="provider"
        />
      </div>
      {loading ? (
        <div className={`${styles.hosting_pg} pt-4`}>
          <div className={`${styles.hosting_header} pb-5`}>
            <div className={`${styles.container}`}>
              <h2 className="">
                <Skeleton className="col-6" />
              </h2>
              <div className={`${styles.grid_rows}`}>
                {Array.from(Array(4)).map((row: any, index: any) => (
                  <div key={index} className={`${styles.grid_row_sec} `}>
                    <div className={`w-75`}>
                      <div>
                        <div className="">
                          <Skeleton className="col-8" />
                        </div>
                        <div className="">
                          <Skeleton className="col-4" />
                        </div>
                        <div className="mt-4">
                          <Skeleton className="col-6" />
                        </div>
                      </div>
                      <div
                        className={`${styles.text_dark} ${styles.underline} mt-3`}
                      >
                        <Skeleton className="col-4" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end me-4">
                      <Skeleton variant="circular" width={50} height={50} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={`${styles.host_head_content} mt-4 `}>
                <h2 className="mt-4">
                  <Skeleton width={250} height={50} />
                </h2>
                <p className="">
                  <Skeleton width={250} height={50} />
                </p>
              </div>
              <div className={`${styles.button} mt-4`}>
                <p className="me-2">
                  <Skeleton />
                </p>
                <p className="">
                  <Skeleton />
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${styles.hosting_pg} pt-4`}>
          <div className={`${styles.hosting_header} pb-5`}>
            <div className={`${styles.container}`}>
              <div className={`${styles.host_head_content}`}>
                <h2>
                  {i18?.MANAGELISTING?.WELCOME || "Welcome"},{" "}
                  {userData?.firstname}!
                </h2>
                {/* <p>Guests can reserve your place 24 hours after you publish – here’s how to prepare.</p> */}
              </div>

              <h3 className="my-3">{i18?.LISTING?.ADS || "ADS"}</h3>

              <div className={`${styles.grid_rows}`}>
                {adsData.total === 0 ? (
                  <div>
                    <h4>
                      {i18?.MANAGELISTING?.NOTINGTOPUBLISH ||
                        "Nothing to publish"}
                    </h4>
                  </div>
                ) : (
                  adsData.listingdata.map((row: any, index: any) => (
                    <div key={index} className={`${styles.grid_row_sec} `}>
                      <div className={`w-75`}>
                        <div>
                          <h4>
                            {i18?.MANAGELISTING?.CONFIRMINFORMATIONDETAILS ||
                              "Confirm information details"}
                          </h4>
                          <span>
                            {i18?.MANAGELISTING?.REQUIREDTOPUBLISH ||
                              "Required to publish"}
                          </span>
                          <h6>{row.name}</h6>
                        </div>
                        <div
                          onClick={() => handlePublishAds(row._id)}
                          className={`${styles.text_dark} ${styles.underline} mt-3`}
                        >
                          {i18?.MANAGELISTING?.PUBLISH || "Publish"}
                        </div>
                      </div>
                      <span className={`d-block w-25 text-center m-auto`}>
                        <RiErrorWarningLine className="text-danger h2" />
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};
export default isAuth(HostProvider);
