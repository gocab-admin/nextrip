"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

import Header from "@/components/header";
import Footer from "@/components/footer";
import APICONSTANT from "@/services/config";
import { getApiMethod } from "@/services/global";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

const Privacy = () => {
  const [privacy, setPrivacy] = useState<any>();
  const { i18 } = usePageContext();
  const [Loader, setLoader] = useState(false);
  const fetchData = async () => {
    setLoader(true);
    try {
      const res = await getApiMethod(`${APICONSTANT.cms}?type=privacyPolicy`);
      if (res.statusCode === 200) {
        setLoader(false);
        setPrivacy(res.data[0].content);
      } else {
        setLoader(false);
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
      {/* <div className=""> */}
      <div className={`${styles.body}`}>
        <div className={`${styles.content}`}>
          <div className="pt-4">
            <h4>{i18?.ROOMPAGE?.PRIVACYPOLICY || "Privacy Policy"}</h4>
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
              dangerouslySetInnerHTML={{ __html: privacy }}
            />
          )}
        </div>
      </div>
      {/* </div> */}
      <Footer />
    </>
  );
};

export default Privacy;
