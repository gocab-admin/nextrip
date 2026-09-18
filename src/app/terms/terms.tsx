"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";

import styles from "./page.module.scss";

const Terms = () => {
  const [terms, setTerms] = useState<any>();
  const [Loader, setLoader] = useState(false);
  const fetchData = async () => {
    setLoader(true);
    try {
      const res = await getApiMethod(`${APICONSTANT.cms  }?type=termsCondition`);
      if (res.statusCode === 200) {
        setLoader(false);
        setTerms(res.data[0].content);
      } else {
        //
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div>
        <Header center="hide" page="hide" />
      </div>
      <div className={`${styles.body}`}>
        <div className={`${styles.content}`}>
          <div className="pt-4">
            <h4>Terms & Condition</h4>
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
              className={`${styles.para}`}
              dangerouslySetInnerHTML={{ __html: terms }}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
