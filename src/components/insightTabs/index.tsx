"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import styles from "./style.module.scss";

const tabData = [
  {
    title: "Opportunities",
    link: "/progress/opportunity-hub"
  },
  {
    title: "Reviews",
    link: "/reviews"
  },
  {
    title: "Earnings",
    link: "/progress/earnings"
  },
  {
    title: "Views",
    link: "/progress/views"
  },
  {
    title: "Superhost",
    link: "/progress/opportunities/superhost"
  },
  {
    title: "Listing issues",
    link: "/insights/listing-issues"
  }
];

const InsightTabs = () => {
  const router = useRouter();
  const pathname: any = usePathname();
  const [currentTab, setCurrentTab] = useState(
    tabData.find((ele) => pathname.endsWith(ele.link))?.title
  );

  return (
    <>
      <div className={`${styles.insight_tabs}`}>
        {tabData.map((_tData, t) => (
          <button
            key={`tabData_${t}`}
            className={`${styles.insight_button} ${
              currentTab === _tData.title && styles.insight_active
            }`}
            onClick={() => {
              if (currentTab !== _tData.title) {
                router.push(_tData.link);
              }
            }}
          >
            {_tData.title}
          </button>
        ))}
      </div>
    </>
  );
};

export default InsightTabs;
