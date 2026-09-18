"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from 'react'
import styles from "./page.module.scss";
import { usePageContext } from '@/components/Providers/PageContext';
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
import APICONSTANT, { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";
import { useFormContext } from "@/app/ads/form/FormContext";

function AboutYourPlace() {
    const { i18, settings } = usePageContext();
    const {createForm} = settings
    const image2 = APIURLS.baseUrl + createForm?.step1
    const { setNextDisable } = useFormContext();

    useEffect(()=>{
      setNextDisable(false);
    },[])

  return (
    <section className={`${styles.host}`}>
    <div className={`${styles.form}`}>
            <div className={`${styles.formright}`}>
              <div className={`${styles.formrightcon}`}>
                <div>
                  <h5 className="me-2">{i18?.HEADER?.STEP || "Step"} 1</h5>
                  <h1 className={`${styles.h1tag}`}>
                    {i18?.PLACEINTRO?.PLACEINTRO || "Tell us about your place"}
                  </h1>
                  <p>
                    {i18?.PLACEBREIF?.PLACEBREIF ||
                      "In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay."}
                  </p>
                </div>
              </div>
              <ImageComponent
                src={image2}
                width={600}
                height={526}
                className={`${styles.images}`}
                alt=""
                onError={handleImageError}
              />
            </div>
          </div>
          </section>
  )
}

export default AboutYourPlace
