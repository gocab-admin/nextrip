"use client";

import React from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
const characterLimit = 32; // Set your desired character limit

interface Props {
  onChange: (event: any)=>void;
  value: string
}

function Title({onChange, value}:Props) {
  const { i18 } = usePageContext();

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.form} ${styles.step9}`}>
        <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
          <h1 className="me-2">
            {i18?.HOMENAME?.TITLE || "Now, let's give your house a title"}
          </h1>
          <p>
            {i18?.HOMENAME?.SUBTITLE ||
              "Short titles work best. Have fun with it – you can always change it later."}
          </p>
          <div className={`${styles}`}>
            <textarea
              rows={5}
              className={`${styles.textarea} w-100 p-2 p-md-3 p-lg-4`}
              value={value==='untitled'?'':value}
              onChange={onChange}
              placeholder={i18?.HOMENAME?.ENTERTEXT || "Enter text here..."}
            />
            <p>
              {value.length}/{characterLimit}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Title;
