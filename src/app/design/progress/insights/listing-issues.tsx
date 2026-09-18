"use client";
import InsightTabs from "@/components/insightTabs";

import styles from "../earnings/page.module.scss";

export default function ListingIssues() {
    return(
        <>
        <div>
            {/* <Inboxhead /> */}
        </div>
        <div className={`${styles.opportunity_hub}`}>
        <div className={`${styles.container}`}>
            <InsightTabs />
        </div>
        </div>
        </>
    )
}
