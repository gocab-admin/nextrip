"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";

interface Props {
  onChange: (event: any)=>void;
  value: string
  limit?: number
}

function Description({onChange, value, limit=1000}:Props) {
  const { i18 } = usePageContext();
  const [textNextValue, setTextNextValue] = useState(value);


  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.form} ${styles.step10}`}>
        <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
          <h1 className="me-2">
            {i18?.CREATEDESCRIPTION?.TITLE || "Create your description"}
          </h1>
          <p>
            {i18?.CREATEDESCRIPTION?.SUBTITLE ||
              "Share what makes your place special."}
          </p>
          <div className={`${styles}`}>
            <textarea
              rows={5}
              className={`${styles.textarea} w-100 p-2 p-md-3 p-lg-4`}
              value={value}
              onChange={(e)=>{
                const textnextValue = e.target.value;
                if (textnextValue.length <= limit) {
                  setTextNextValue(textnextValue);
                onChange(e)
                }
              }}
              placeholder="Enter text here..."
            />
            <p>
              {textNextValue.length}/{limit}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Description;
