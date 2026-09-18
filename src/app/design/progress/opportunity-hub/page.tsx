"use client";

import ImageComponent from "@/components/ImageComponent";
import Header from "@/components/header";
import InsightTabs from "@/components/insightTabs";
import { handleImageError } from "@/services/utils/utils";

import styles from "./page.module.scss";

export default function OpportunityHub() {
  const HostingDetails = [
    {
      imageUrl: "/images/people.webp",
      content: "Why it’s smart to offer flexible cancellations right now"
    },
    {
      imageUrl: "/images/people.webp",
      content: "Getting started with <Website/>’s cleaning protocol"
    },
    {
      imageUrl: "/images/people.webp",
      content: "The dos and don’ts of providing self check-in"
    },
    {
      imageUrl: "/images/people.webp",
      content: "What you need to know about hosting families and pets"
    },
    {
      imageUrl: "/images/people.webp",
      content: "How to make your space comfortable for remote workers"
    },
    {
      imageUrl: "/images/people.webp",
      content: "The best amenities to offer right now"
    }
  ];

  return (
    <>
      <div>
        <Header page="hide" center="inbox" type="provider" />
      </div>
      <div className={`${styles.opportunity_hub}`}>
        <div className={`${styles.container}`}>
          <InsightTabs />
          <div className={`${styles.main_content}`}>
            <h1>Resources for hosting now</h1>
            <div className={`${styles.content_resources}`}>
              {HostingDetails.map((_hostData, h) => (
                <div className={`${styles.content_list}`} key={`_hostData${h}`}>
                  <a href="#">
                    <div
                      className={`d-flex align-items-center ${styles.list_hst}`}
                    >
                      <span className={`${styles.list_image} me-3`}>
                        <ImageComponent
                          src={_hostData.imageUrl}
                          alt="people"
                          width={72}
                          height={72}
                          onError={handleImageError}
                        />
                      </span>
                      <p className={`${styles.list_desc}`}>
                        {_hostData.content}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
