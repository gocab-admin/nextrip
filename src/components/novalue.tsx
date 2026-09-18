"use client";
import React from "react";

import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./table.module.scss";

export default function Novalue() {
  const { i18 } = usePageContext();
  return (
    <div className={`${styles.body}`}>
      <div className={`${styles.box}`}>
        <div className={`${styles.content}`}>
          <h2>{i18?.TRIPS?.NODATAFOUND || "No data found"}</h2>
          <p>
            {i18?.TRIPS?.THEREISNOBOOKING ||
              "There is no booking found,please book to view data"}
          </p>
        </div>
      </div>
    </div>
  );
}
