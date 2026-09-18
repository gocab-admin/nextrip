"use client";
import React, { useEffect, useState } from "react";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import { Box, Popover, Tab, TextField } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import Link from "next/link";
import dynamic from "next/dynamic";

import { MessageClose } from "@/app/global/svg";
import Header from "@/components/header";
import isAuth from "@/components/isAuth";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

const TabPanel = dynamic(() => import("@mui/lab/TabPanel"), { ssr: false });
const TabList = dynamic(() => import("@mui/lab/TabList"), { ssr: false });
const UpcommingTripsTable = dynamic(
  () => import("../../../components/hostTable/upcommingTrips"),
  { ssr: false }
);
const CurrentTripsTable = dynamic(
  () => import("../../../components/hostTable/currentTrips"),
  { ssr: false }
);
const HostCancellationHistoryTable = dynamic(
  () => import("../../../components/hostTable/hostCancelHistory"),
  { ssr: false }
);
const HostBookingHisTable = dynamic(
  () => import("../../../components/hostTable/hostBookingHistory"),
  { ssr: false }
);
const RequestHistoryTable = dynamic(
  () => import("../../../components/hostTable/requesthistoryTable"),
  { ssr: false }
);
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });
const Typography = dynamic(() => import("@mui/material/Typography"), {
  ssr: false
});

const style = {
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid none",
  boxShadow: 24,
  borderRadius: 3,
  py: 1.5
};

const Reservation = () => {
  const { i18, responsiveView } = usePageContext();
  const [value, setValue] = useState("1");
  const [exportModal, setExportModal] =
    React.useState<HTMLButtonElement | null>(null);
  const [filterModal, setFilterModal] =
    React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(exportModal);
  const opens = Boolean(filterModal);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  const [policy, setPolicy] = useState([]);

  const getpolicy = async (url: any) => {
    const res = await getApiMethod(url);
    if (res.statusCode === 200) {
      setPolicy(res.data.policies);
    }
  };

  useEffect(() => {
    getpolicy(APICONSTANT.cancellationPolicy);
  }, []);



  return (
    <>
      <div className={`${styles.reservation}`}>
        <Header
          page="hide"
          center={
            responsiveView === "sm" || responsiveView === "xs" ? "" : "inbox"
          }
          type="provider"
        />
        <div className={`${styles.reservation_content} px-3`}>
          <div
            className={`${styles.button_group} d-flex justify-content-between align-items-center px-4`}
          >
            <div className={`${styles.button_group__leftbutton}`}>
              <Link className={`${styles.link}`} href="/hosting">
                <ArrowBackIos className="m-0" fontSize="small" />
              </Link>
            </div>
            {/* <div className={`${styles.button_group__rightbutton}`}>
                            <button className={`${styles.button_group__button} d-flex align-items-center me-3`} onClick={handleFilterOpen}>
                                <FilterToggle
                                    className='me-2'
                                    style={{
                                        display: 'block',
                                        height: '16px',
                                        width: '16px',
                                        fill: 'none',
                                        stroke: 'currentcolor'
                                    }} />Filter
                            </button>
                            <button className={`${styles.button_group__button} d-flex align-items-center me-3`} onClick={handleExportOpen}>
                                Export <ArrowForwardIosIcon className={`${styles.iosicon}`} />
                            </button>
                            <button className={`${styles.button_group__button}`} onClick={() => { window.print() }}>Print</button>
                        </div> */ }
          </div>
          <div className="reservation-title">
            <h1 className={`${styles.header} ms-4 mt-3 mb-4`}>
              {i18?.RESERVATIONS?.RESERVATIONS || "Reservations"}
            </h1>
          </div>
          <div>
            <TabContext value={value}>
              <div className={`${styles.tablist}`}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="scrollable"
                  scrollButtons={false}
                >
                  <Tab
                    label={
                      i18?.RESERVATIONS?.REQUESTHISTORY || "Request History"
                    }
                    value="1"
                  />
                  <Tab
                    label={
                      i18?.RESERVATIONS?.BOOKINGHISTORY || "Booking History"
                    }
                    value="2"
                  />
                  <Tab
                    label={
                      i18?.RESERVATIONS?.CANCELLATIONHISTORY || "Cancellation History"
                    }
                    value="3"
                  />
                  <Tab
                    label={i18?.RESERVATIONS?.CURRENTTRIPS || "Current Trips"}
                    value="4"
                  />
                  <Tab
                    label={i18?.RESERVATIONS?.UPCOMINGTRIPS || "Upcoming Trips"}
                    value="5"
                  />
                </TabList>
              </div>
              <TabPanel className={`${styles.panels}`} value="1">
                <RequestHistoryTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="2">
                <HostBookingHisTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="3">
                <HostCancellationHistoryTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="4">
                <CurrentTripsTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="5">
                <UpcommingTripsTable />
              </TabPanel>
              {/* <TabPanel className={`${styles.panels}`} value="6">
                                <div className=''>
                                    <div className={`${styles.guestcontent}`}>
                                        <div className={`${styles.referal}`}>
                                            <div className={`${styles.background}`}>
                                                <div className={``}>
                                                    <h5>You have no reservations</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel> */}
            </TabContext>
          </div>

          <div className="my-3">
            <div className={`${styles.divider}`}></div>
          </div>
          <div className={`${styles.text_align} mt-3`}>
            {/* <p>How can we make it easier to manage your reservations? <button>Share your feedback</button></p> */}
            <Typography
              variant="h6"
              paragraph
              sx={{
                my: 3,
                px: 3,
                fontSize: "var(--notes-text) !important",
                fontFamily: "var(--font-family-inherit) !important",
                color: "var(--text-color) !important"
              }}
            >
              {i18?.RESERVATIONS?.NOTES || "Notes *"}
            </Typography>
            <>
              {policy &&
                policy.map((item: any) => (
                  <>
                    <h4
                      style={{
                        fontSize: "var(--homepage-header-size)",
                        fontFamily: "var(--font-family-base)"
                      }}
                    >
                      {item.id} - {item.title} : {item.desc}
                    </h4>
                  </>
                ))}
            </>
          </div>
        </div>
        <Footer />
      </div>

      <Popover
        className="mt-3"
        open={open}
        onClose={() => {
          setExportModal(null);
        }}
        anchorEl={exportModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <div className={`${styles.exportpopover}`}>
          <Box sx={style}>
            <div className="p-4">
              <button>
                {i18?.SETUPPAYOUTS?.DOWNLOADCSVFILE || "Download CSV file"}…
              </button>
            </div>
            <div className="p-4">
              <button>
                {i18?.SETUPPAYOUTS?.SYNCYOURRESERVATIONS ||
                  "Sync your reservations"}
                …
              </button>
            </div>
          </Box>
        </div>
      </Popover>

      <Popover
        className="mt-3"
        open={opens}
        onClose={() => {
          setFilterModal(null);
        }}
        anchorEl={filterModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <div className={`${styles.popover}`}>
          <Box sx={style}>
            <div
              className={`${styles.popoverheader} d-flex align-items-center px-3 pt-1 pb-3`}
            >
              <button
                onClick={() => {
                  setFilterModal(null);
                }}
              >
                <MessageClose
                  style={{
                    display: "block",
                    fill: "none",
                    height: "20px",
                    width: "20px",
                    stroke: "currentcolor",
                    overflow: "visible"
                  }}
                />
              </button>

              <Typography variant="h6" className="flex-grow-1 text-center">
                {i18?.HEADER?.FILTER || "Filter"}
              </Typography>
            </div>
            <div>
              <Typography className="p-3">
                {i18?.SETUPPAYOUTS?.RESERVATIONSTHATSTARTOREND ||
                  "Reservations that start or end within the following dates."}
              </Typography>
              <div className={`d-flex p-3`}>
                <div className={`${styles.textfield}`}>
                  <TextField
                    className={`${styles.input} ms-2 mt-2`}
                    id="filled-text-input"
                    label="From"
                    type="text"
                    variant="standard"
                  />
                </div>
                <div className={`${styles.textfieldtwo}`}>
                  <TextField
                    className={`${styles.input} ms-2 mt-2`}
                    id="filled-text-input"
                    label="Until"
                    type="text"
                    variant="standard"
                  />
                </div>
              </div>
            </div>
            <div
              className={`${styles.popoverfooter} d-flex justify-content-end px-3 pt-3 pb-1`}
            >
              <button
                onClick={() => {
                  setFilterModal(null);
                }}
              >
                {i18?.LISTING?.APPLY || "Apply"}
              </button>
            </div>
          </Box>
        </div>
      </Popover>
    </>
  );
};
export default isAuth(Reservation);
