"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import Header from "@/components/header";
import isAuth from "@/components/isAuth";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

const TabPanel = dynamic(() => import("@mui/lab/TabPanel"), {
  ssr: false
});

const TabList = dynamic(() => import("@mui/lab/TabList"), {
  ssr: false
});
const MobileFooternav = dynamic(
  () => import("@/components/MobileFooterNav")
);
const AcceptedBookingTable = dynamic(
  () => import("@/components/userTable/acceptedbooking")
);
const RequestHistoryTable = dynamic(
  () => import("@/components/userTable/bookinghistory")
);
const CancellationHistoryTable = dynamic(
  () => import("@/components/userTable/cancellationHistory")
);
const CurrentTripsTable = dynamic(
  () => import("@/components/userTable/currentTrips")
);
const UpcommingTripsTable = dynamic(
  () => import("@/components/userTable/upcommingTrips")
);
const PendingBookingTable = dynamic(
  () => import("@/components/userTable/pendingBookingTable")
);
const Tab = dynamic(() => import("@mui/material/Tab"));
const TabContext = dynamic(() => import("@mui/lab/TabContext"));
const Footer = dynamic(() => import("@/components/footer"));
const Typography = dynamic(() => import("@mui/material/Typography"), {
  ssr: false
});
const Box = dynamic(() => import("@mui/material/Box"));

const Reservation = () => {
  const { i18, responsiveView} = usePageContext();
  const [value, setValue] = useState("pendingBooking");
  const currentParams = new URLSearchParams(window.location.search);
  const val:any =  currentParams.get("trip");
  // const { loading } = useSelector((state: any) => state.bookingEstimation)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    currentParams.set("trip", newValue);
    window.history.replaceState(
      { path: `?${  currentParams.toString()}` },
      "",
      `?${  currentParams.toString()}`
    );
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

useEffect(()=>{
  setValue(val)
},[currentParams])

  return (
    <>
      <div className={`${styles.reservation}`}>
        <Header center="hide" page="hide" />
        <div className={`${styles.reservation_content} px-3`}>
          <div className="trip-title">
            <h1 className={`${styles.header} ms-4 mt-3 mb-4`}>
              {i18?.TRIPS?.TRIPS || "Trips"}
            </h1>
          </div>
          <div>
            <TabContext value={value}>
              <div className={`${styles.tablist}`}>
                <TabList
                  variant="scrollable"
                  scrollButtons={false}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label={`${i18?.TRIPS?.PENDINGBOOKING || "Pending booking"}`}
                    value="pendingBooking"
                  />
                  <Tab
                    label={`${
                      i18?.TRIPS?.ACCEPTEDBOOKING || "Accepted booking"
                    }`}
                    value="acceptedBooking"
                  />
                  <Tab
                    label={`${
                      i18?.TRIPS?.CANCELLATIONHISTORY || "Cancellation history"
                    }`}
                    value="cancellationHistory"
                  />
                  <Tab
                    label={`${i18?.TRIPS?.BOOKINGHISTORY || "Booking history"}`}
                    value="bookingHistory"
                  />
                  <Tab
                    label={`${i18?.TRIPS?.CURRENTTRIPS || "Current trips"}`}
                    value="currentTrips"
                  />
                  <Tab
                    label={`${i18?.TRIPS?.UPCOMMINGTRIPS || "Upcoming trips"}`}
                    value="upcomingTrips"
                  />
                </TabList>
              </div>
              <TabPanel className={`${styles.panels}`} value="pendingBooking">
                <PendingBookingTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="acceptedBooking">
                <AcceptedBookingTable />
              </TabPanel>
              <TabPanel
                className={`${styles.panels}`}
                value="cancellationHistory"
              >
                <CancellationHistoryTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="bookingHistory">
                <RequestHistoryTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="currentTrips">
                <CurrentTripsTable />
              </TabPanel>
              <TabPanel className={`${styles.panels}`} value="upcomingTrips">
                <UpcommingTripsTable />
              </TabPanel>
            </TabContext>
          </div>

          <div className="my-3">
            <div className={`${styles.divider}`}></div>
          </div>
          <div className={`${styles.text_align} mt-3`}>
            {/* <p>
              How can we make it easier to manage your trips?{" "}
              <button>Share your feedback</button>
            </p> */}
            {Array.isArray(policy) && policy.length > 0 && <><Typography
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
              {i18?.TRIPS?.NOTES || "Notes"} *
            </Typography>
              {policy.map((item: any) => (
                  <Box key={item.id}>
                    <div
                      style={{
                        paddingLeft: 24,
                        paddingRight: 24,
                        fontSize: "var(--homepage-header-size)",
                        fontFamily: "var(--font-family-base)",
                        color: "var(--text-color)"
                      }}
                    >
                      {item.id} - {item.title} : {item.desc}
                    </div>
                  </Box>
                ))}
            </>
            }
          </div>
        </div>
        <Footer />
      </div>
      {(responsiveView === "sm" || responsiveView === "xs") && (
        <MobileFooternav />
      )}
    </>
  );
};
export default isAuth(Reservation);
