"use client";
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import Header from "@/app/ads/components/adsHeader";
import isAuth from "@/components/isAuth";
import { usePageContext } from "@/components/Providers/PageContext";
import styles from "./packageStatus.module.scss";  

const TabPanel = dynamic(() => import("@mui/lab/TabPanel"), {
    ssr: false
});

const TabList = dynamic(() => import("@mui/lab/TabList"), {
    ssr: false
});
const Tab = dynamic(() => import("@mui/material/Tab"));
const TabContext = dynamic(() => import("@mui/lab/TabContext"));
const Footer = dynamic(() => import("@/components/footer"));
const Typography = dynamic(() => import("@mui/material/Typography"), {
    ssr: false
});

const Box = dynamic(() => import("@mui/material/Box"));

const SubscriptionStatus = dynamic(() => import("@/components/AdsSubscriptionTable/subscriptionTable"));

const PackageStatus = () => {
    const { i18, responsiveView } = usePageContext();
    const [tabValue, setTabValue] = useState("active");
    const currentParams = new URLSearchParams(window.location.search);
    const params: any = currentParams.get("status");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
        currentParams.set("status", newValue);
        window.history.replaceState(
            { path: `?${currentParams.toString()}` },
            "",
            `?${currentParams.toString()}`
        )
    }

    useEffect(() => {
        setTabValue(params);
    }, [currentParams])
    
    return (
        <>
            <div className={styles.reservation}>
                <Header center="hide" page="hide" />
                <div className={`${styles.reservation_content} px-3`}>
                    <div className="trip-title">
                        <h3 className={`${styles.header} ms-4 mt-3 mb-4`}>
                            {i18?.SUBSCRIPTION?.SUBSCRIPTION || "Subscriptions"}
                        </h3>
                    </div>
                    <div>
                        <TabContext value={tabValue}>
                            <div className={`${styles.tablist}`}>
                                <TabList
                                    variant="scrollable"
                                    scrollButtons={false}
                                    onChange={handleChange}
                                    aria-label="lab API tabs example"
                                >
                                    <Tab
                                        label={`${i18?.SUBSCRIPTION?.ACTIVESUBSCRIPTIONS || "Active Subscription"}`}
                                        value="active"
                                    />
                                    <Tab
                                        label={`${i18?.SUBSCRIPTION?.EXPIREDSUBSCRIPTIONS || "Expired Subscription"}`}
                                        value="expired"
                                    />
                                </TabList>
                            </div>
                            {/* Single TabPanel for both tabs */}
                            <TabPanel className={`${styles.panels}`} value={tabValue}>
                               <SubscriptionStatus status={params} />
                            </TabPanel>
                        </TabContext>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default PackageStatus
