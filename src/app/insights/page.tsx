"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { AiOutlineStar } from "react-icons/ai";
import dynamic from "next/dynamic";

import { Starlogo } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

const TabPanel = dynamic(() => import("@mui/lab/TabPanel"), {
  ssr: false
});

const TabList = dynamic(() => import("@mui/lab/TabList"), {
  ssr: false
});

export default function Insights() {
  
  const { i18 , responsiveView} = usePageContext();
  const [value, setValue] = React.useState("1");
  const [age, setAge] = React.useState("");

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };
  return (
    <>
      <div className={`${styles.host}`}>
        <header className={`${styles.navigation}`}>
          <div
            className={`${styles.header_nav} d-flex align-items-center h-100`}
          >
            <Link href="/">
              <Starlogo
                height="50"
                color="red"
                responsive="d-lg-block d-none"
              />
            </Link>
            <div className="ms-auto">
              <div className="d-flex align-items-center">
                <Link href="#" className={`${styles.btn_setup} btn`}>
                  <Link
                    href="/propertyform"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <span
                      className={`${styles.flexit} d-flex align-items-center`}
                    >
                      {i18?.WISHLIST?.SAVEEXIT || "Save & exit"}
                    </span>
                  </Link>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <section className={`${styles.insights} my-4 px-3 py-4 container`}>
          <Box
            sx={{ width: "100%", typography: "body1" }}
            className={`${styles.Opportunitiessec}`}
          >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  {/* <Tab label="Opportunities" value="1" /> */}
                  <Tab label="Reviews" value="2" />
                  {/* <Tab label="Earnings" value="3" />
                  <Tab label="Views" value="4" />
                  <Tab label="Superhost" value="5" />
                  <Tab label="Listing issues" value="6" /> */}
                </TabList>
              </Box>
              {/* <TabPanel value="1">
                <h4 className="mb-4">Resources for hosting now</h4>
                <div className="d-flex flex-wrap tabcontent">
                  <div className="col-md-4 d-flex align-items-center mb-3">
                    <Image src={image2} alt={"Opportunities"}></Image>
                    <p className="ms-2 m-0">
                      Why it’s smart to offer flexible cancellations right now
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center mb-3">
                    <Image src={image2} alt={"Opportunities"}></Image>
                    <p className="ms-2 m-0">
                      Getting started with <Website/>’s cleaning protocol
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center mb-3">
                    <Image src={image2} alt={"Opportunities"}></Image>
                    <p className="ms-2 m-0">
                      {" "}
                      The dos and don’ts of providing self check-in
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center mb-3">
                    <Image src={image2} alt={"Opportunities"}></Image>
                    <p className="ms-2 m-0">
                      What you need to know about hosting families and pets
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center mb-3">
                    <Image src={image2} alt={"Opportunities"}></Image>
                    <p className="ms-2 m-0">
                      How to make your space comfortable for remote workers
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center mb-3">
                    <Image src={image2} alt={"Opportunities"}></Image>
                    <p className="ms-2 m-0">
                      The best amenities to offer right now
                    </p>
                  </div>
                </div>
              </TabPanel> */}
              <TabPanel value="2" className={`${styles.reviews}`}>
                <div className="col-md-6 m-auto">
                  <h2>{i18?.REVIEWS?.REVIEWS || "Reviews"}</h2>
                  <h5>{i18?.WISHLIST?.TEST || "test"}</h5>
                  <div
                    className={`${styles.reviewcon} p-5 d-flex flex-wrap align-items-center  justify-content-center`}
                  >
                    <AiOutlineStar />
                    <h5>
                      {i18?.REVIEWS?.YOURFIRSTREVIEWWILLSHOWUPHERE ||
                        "Your first review will show up here"}
                    </h5>
                    <span>
                      {i18?.REVIEWS?.WEWILLLETYOUKNOW ||
                        "We’ll let you know when guests leave feedback."}
                    </span>
                  </div>
                </div>
              </TabPanel>
              {/* <TabPanel value="3" className={`${styles.earning}`}>
                <div className={`${styles.earnings} col-md-6`}>
                  Select a month
                  <FormControl sx={{ m: 1, minWidth: 120 }} className="w-100">
                    <Select
                      value={age}
                      onChange={handleChangeSelect}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      className="form-control"
                    >
                      <MenuItem value="">
                        <em>Select a month</em>
                      </MenuItem>
                      <MenuItem value="October 2022">October 2022</MenuItem>
                      <MenuItem value="November 2022">November 2022</MenuItem>
                      <MenuItem value="December 2022">December 2022</MenuItem>
                      <MenuItem value="January 2023">January 2023</MenuItem>
                      <MenuItem value="February 2023">February 2023</MenuItem>
                      <MenuItem value="March 2023">March 2023</MenuItem>
                      <MenuItem value="April 2023">April 2023</MenuItem>
                      <MenuItem value="May 2023">May 2023</MenuItem>
                      <MenuItem value="June 2023">June 2023</MenuItem>
                      <MenuItem value="July 2023">July 2023</MenuItem>
                    </Select>
                  </FormControl>
                  <h1>$0.00</h1>
                  <p>
                    Booked earnings for<span className="ms-1">{age}</span>
                  </p>
                  <div className="d-flex">
                    <div className="">
                      <h5>$0.00</h5>
                      <p>Paid out</p>
                    </div>
                    <div className="ms-4">
                      <h5>$0.00</h5>
                      <p>Paid out</p>
                    </div>
                  </div>
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                    series={[
                      {
                        data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
                        showMark: ({ index }) => index % 2 === 0,
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                  <p className={`${styles.borderbot}`}>You have no listings currently listed</p>
                  <p className="d-flex justify-content-between py-4 m-0"><span>Cleaning fees</span><span>$0 AUD</span></p>
                  <a>Show transaction history</a>
                  <a>Show tax information</a>
                  <a>Give us feedback</a>
                </div>
              </TabPanel> */}
              {/* <TabPanel value="4">Item Four</TabPanel> */}
              {/* <TabPanel value="5">Item Five</TabPanel> */}
              {/* <TabPanel value="6">Item Sex</TabPanel> */}
            </TabContext>
          </Box>
        </section>
      </div>
    </>
  );
}
