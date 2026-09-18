"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useSearchParams } from "next/navigation";
import styles from "./pageComponent.module.scss";
import { useSelector } from "react-redux";

const Terms = () => {
  const { getCmsList } = useSelector((state: any) => state.cmsSlice);
  const searchParams = useSearchParams();
  const cmsTitle = searchParams.get("type");

  const [terms, setTerms] = useState<string | null>(null);
  const [Loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    if (getCmsList?.length > 0 && cmsTitle) {
      const selectedCms = getCmsList.find((cms: any) => cms?.title === cmsTitle);
      setTerms(selectedCms?.content || "<p>No content available</p>");
      setLoader(false);
    }
  }, [getCmsList, cmsTitle]);

  return (
    <>
      <Header center="hide" page="hide" />
      <div className={styles.body}>
        <div className={styles.content}>
          <div className="pt-4">
            <h4>{cmsTitle ? cmsTitle.replace("-", " ") : "CMS Page"}</h4>
          </div>
          {Loader ? (
            <>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </>
          ) : (
            <div
              className={styles.para}
              dangerouslySetInnerHTML={{ __html: terms || "<p>No content found</p>" }}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
