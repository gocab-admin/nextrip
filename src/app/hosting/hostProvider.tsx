"use client";
import { useEffect, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { Skeleton } from "@mui/material";
import dynamic from "next/dynamic";

import APICONSTANT from "@/services/config";
import { postApiMethod, getApiMethod } from "@/services/global";
import { addUser, updateStatus } from "@/redux/slice/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import Header from "@/components/header";
import isAuth from "@/components/isAuth";
import { addAlert } from "@/redux/slice/AlertSlice";
import { usePageContext } from "@/components/Providers/PageContext";

import "../../components/header.scss";
import styles from "./page.module.scss";

const Footer = dynamic(() => import("@/components/footer"));

const HostProvider = () => {
  const { i18,responsiveView } = usePageContext();
  const dispatch = useAppDispatch();
  const getId =
    typeof window !== "undefined" ? localStorage?.getItem("appUserId") : null;
  const [data, setData] = useState({
    total: 0,
    listingdata: []
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [counts, setCounts] = useState<any>(0);
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getApiMethod(
        `${APICONSTANT.hostListings 
          }?_page=${page}&_limit=${rowsPerPage}&list=incomplete`
      );
      if (res.statusCode === 200) {
        setLoading(false);
        setData({
          listingdata: res.data.providerListings,
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

  const handlePublish = async (id: any) => {
    try {
      const response = await postApiMethod(`${APICONSTANT.publish  }/${id}`);
      if (response.statusCode === 200) {
        dispatch(
          addAlert({
            isOpen: true,
            message: "List Published",
            type: "success",
            severity: "success"
          })
        );
        fetchData();
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

  const getCounts = async (url: any) => {
    const res = await getApiMethod(url);
    if (res.statusCode === 200) {
      setCounts(res.data.reservation);
    }
  };

  useEffect(() => {
    if (getId) {
      getUserapi(APICONSTANT.signup);
      getCounts(APICONSTANT.counts);
      fetchData();
    }
  }, []);

  const all = counts
    ? Number(counts.checkingOut) +
      // Number(counts.currentlyHosting) +
      Number(counts.arrivingSoon)
    : // + Number(counts.upcomming)
      0;


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
              <h3 className="my-3">{i18?.LISTING?.LISTING || "Listing"}</h3>

              <div className={`${styles.grid_rows}`}>
                {data.total === 0 ? (
                  <div>
                    <h4>
                      {i18?.MANAGELISTING?.NOTINGTOPUBLISH ||
                        "Nothing to publish"}
                    </h4>
                  </div>
                ) : (
                  data.listingdata.map((row: any, index: any) => (
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
                          <h6>{row.propertyName}</h6>
                        </div>
                        <div
                          onClick={() => handlePublish(row._id)}
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

              <div className={`${styles.host_head_content} mt-4 host-head`}>
                <h2>
                  {i18?.MANAGELISTING?.YOURRESERVATIONS || "Your reservations"}
                </h2>
                <div className={`visible-md`}>
                  <a
                    target="_blank"
                    href="/hosting/reservations"
                    className={`${styles.dark} ${styles.underline}`}
                  >
                    {i18?.MANAGELISTING?.ALLRESERVATIONS || "All reservations"}{" "}
                    ({all})
                  </a>
                </div>
              </div>
              <div className={`${styles.button} mt-4`}>
                <div className="me-3 bg-white border py-1 px-2 rounded-pill text-black">
                  {i18?.MANAGELISTING?.CHECKINGOUT || "Checking out"} (
                  {counts ? counts.checkingOut : 0})
                </div>
                {/* <button className="me-3 bg-white border py-1 px-2 rounded-pill text-black">Currently hosting ({counts ? counts.currentlyHosting : 0})</button> */}
                <div className="me-3 bg-white border py-1 px-2 rounded-pill text-black">
                  {i18?.MANAGELISTING?.ARRIVINGSOON || "Arriving soon"} (
                  {counts ? counts.arrivingSoon : 0})
                </div>
                {/* <button className="me-3 bg-white border py-1 px-2 rounded-pill text-black">Upcoming ({counts ? counts.upcomming : 0})</button> */}
                {/* <button className="me-3 bg-white border py-1 px-2 rounded-pill text-black">Pending review ({counts ? counts.pendingReview : 0})</button> */}
              </div>
              {/* <div className={`${styles.host_svg_content} d-flex align-items-center justify-content-center mt-4`}>
                                <div className={`${styles.host_guest_content} d-flex flex-column justify-content-center `}>
                                    <span className={`text-center`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                        // style="display: block; height: 32px; width: 32px; fill: rgb(34, 34, 34);"
                                        >
                                            <path d="M24 1a5 5 0 0 1 5 4.78v5.31h-2V6a3 3 0 0 0-2.82-3H8a3 3 0 0 0-3 2.82V26a3 3 0 0 0 2.82 3h5v2H8a5 5 0 0 1-5-4.78V6a5 5 0 0 1 4.78-5H8zm-2
                                     12a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.02 3.17 1.36 1.46-6.01 5.64-3.35-3.14 1.36-1.46 1.99 1.86z">
                                            </path>
                                        </svg>
                                    </span>
                                    <div className="text-center pt-3">You don’t have any guests checking out today or tomorrow.</div>
                                </div>
                            </div> */}
            </div>
          </div>

          {/* <div className={`${styles.hosting_body} my-5 py-5`}>
                    <div className={`${styles.container}`}>
                       
                        <div className={`${styles.host_body_content}`}>
                            <h2>
                                Your next steps
                            </h2>
                            <p>It's time to review a couple of current settings.</p>
                        </div>
                        <div className={`${styles.grid_rows} mt-5 pt-5`}>
                            <div className={`row m-0 mt-5`}>
                                {
                                    HostingData.map((host: any, h: any) => (
                                        <div className={`col-md-2 p-0`}>
                                            <button className={``}>
                                                <div className={`${styles.grid_body_sec}`}>
                                                    <span className={`mb-4`}>
                                                        {host.img}
                                                    </span>
                                                    <div className={`${styles.heading} text-start text_dark mb-2`}>{host.title}</div>
                                                    <div className={`${styles.paragrap} text-start`}>{host.content}</div>
                                                </div>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div> */}

          {/* <div className={`${styles.hosting_main} my-5 py-2`}>
                    <div className={`${styles.container}`}>
                        <div className={`${styles.host_main_content}`}>
                            <h2> We’re here to help </h2>
                        </div>
                        <div className={`${styles.grid_rows} mt-4`}>
                            <div className={`row m-0`}>
                                <div className={`col-12 col-lg-6 col-xl-5 mt-3 p-0`}>
                                    <button className={``}>
                                        <div className={`${styles.grid_body_sec} d-flex`}>
                                            <span className={`mb-4`}>
                                                <BiUserCircle />
                                            </span>
                                            <div>
                                                <div className={`${styles.heading} text-start text_dark mb-2`}>Guidance from a Superhost</div>
                                                <div className={`${styles.paragrap} text-start`}>We’ll match you with an experienced Host who can help you get started.</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className={`col-12 col-lg-6 col-xl-5 mt-3 p-0`}>
                                    <button className={``}>
                                        <div className={`${styles.grid_body_sec} d-flex`}>
                                            <span className={`mb-4`}>
                                                <TbHeadset />
                                            </span>
                                            <div>
                                                <div className={`${styles.heading} text-start text_dark mb-2`}>Contact specialised support</div>
                                                <div className={`${styles.paragrap} text-start`}>As a new Host, you get one-tap access to a specially trained support team.</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
          {/* 
                <div className={`${styles.hosting_resources} my-5 py-2`}>
                    <div className={`${styles.container}`}>
                        <div className={`${styles.host_main_content}`}>
                            <h2> Resources and tips </h2>
                        </div>
                        <div className={`${styles.grid_rows} mt-4`}>
                            <div className={`row m-0`}>
                                <div className={`col-md-3 mt-3 pe-2`}>
                                    <button className={``}>
                                        <div className={`${styles.grid_body_sec} row row-cols-md-1`}>
                                            <div className={`col-4 p-0`}>
                                                <Image
                                                    src="/images/setprice.webp"
                                                    alt="getpaid"
                                                    className="w-100 h-100 rounded-top-4"
                                                    width="302"
                                                    height="230"
                                                />
                                            </div>
                                            <div className={`col-6 d-flex align-items-center p-0`}>
                                                <div className={`${styles.heading} text-start text_dark mb-2 p-3`}>How to make your listing stand out</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className={`col-md-3 mt-3`}>
                                    <button className={``}>
                                        <div className={`${styles.grid_body_sec} row row-cols-md-1`}>
                                            <div className={`col-4 p-0`}>
                                                <Image
                                                    src="/images/6.webp"
                                                    alt="getpaid"
                                                    className="w-100 h-100 rounded-top-4"
                                                    width="302"
                                                    height="230"
                                                />
                                            </div>
                                            <div className={`col-6 d-flex align-items-center p-0`}>
                                                <div className={`${styles.heading} text-start text_dark mb-2 p-3`}>How to take great photos with your phone</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className={`col-md-3 mt-3`}>
                                    <button className={``}>
                                        <div className={`${styles.grid_body_sec} row row-cols-md-1`}>
                                            <div className={`col-4 p-0`}>
                                                <Image
                                                    src="/images/guest.webp"
                                                    alt="getpaid"
                                                    className="w-100 h-100 rounded-top-4"
                                                    width="302"
                                                    height="230"
                                                />
                                            </div>
                                            <div className={`col-6 d-flex align-items-center p-0`}>
                                                <div className={`${styles.heading} text-start text_dark mb-2 p-3`}>Making your home ready for guests</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className={`col-md-3 mt-3`}>
                                    <button className={``}>
                                        <div className={`${styles.grid_body_sec} row row-cols-md-1`}>
                                            <div className={`col-4 p-0`}>
                                                <Image
                                                    src="/images/list-description.webp"
                                                    alt="getpaid"
                                                    className="w-100 h-100 rounded-top-4"
                                                    width="302"
                                                    height="230"
                                                />
                                            </div>
                                            <div className={`col-6 d-flex align-items-center p-0`}>
                                                <div className={`${styles.heading} text-start text_dark mb-2 p-3`}>How to write a listing description that works</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
        </div>
      )}
      <Footer />
      {/* <AlertComponent notify={notify} setNotify={setNotify} /> */}
    </>
  );
};
export default isAuth(HostProvider);
