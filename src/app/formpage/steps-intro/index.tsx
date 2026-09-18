"use client";

import dynamic from "next/dynamic";
import React from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
import APICONSTANT, { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";
import { getImageUrl } from "@/components/ImageComponent";
interface Props {
  data: any;
  currentStep: number;
}

function StepsIntro({ data, currentStep }: Props) {
  const { i18, settings } = usePageContext();
  const { createForm } = settings;
  const image3 =
    getImageUrl(data?.image ? data.image : createForm?.step2);

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.form}`}>
        <div className={`${styles.formright}`}>
          <div className={`${styles.formrightcon}`}>
            <div>
              <h5 className="me-2">
                {i18?.HEADER?.STEP || "Step"} {currentStep}
              </h5>
              <h1 className={`${styles.h1tag}`}>{data.title}</h1>
              <p>{data.description}</p>
            </div>
          </div>
          <ImageComponent
            src={image3}
            width={600}
            height={526}
            className={`${styles.images}`}
            alt=""
            onError={handleImageError}
          />
        </div>
      </div>
    </section>
  );
}

export default StepsIntro;
