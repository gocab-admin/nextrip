"use client";
import React from "react";

import EmailModal from "@/components/emailModal";
import Header from "@/components/header";

import styles from "./page.module.scss";

const Verify = () => (
    <>
      <Header page={true} center="hide" />
      <div className={`${styles.body}`}>
        <div className={`${styles.content}`}>
          <EmailModal />
        </div>
      </div>
    </>
  );

export default Verify;
