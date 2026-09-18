"use client";

import React from 'react'
import styles from "./page.module.scss";
import { Website } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import ImageComponent, { getImageUrl } from "@/components/ImageComponent";
import { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";

interface Props {
  stepData: any[]
}
function Steps({ stepData }: Props) {
  const { i18, settings } = usePageContext();
  const { hostForm } = settings
  const image1 = hostForm?.step1; //not exists image

  return (
    <section className={`${styles.hostform_section}`}>
      <div className={`${styles.form} `}>
        <div className={`${styles.formleft}`}>
          <h1 className="">
            {i18?.HOSTHOMEPAGE?.HOSTHOMEPAGE ||
              "It’s easy to get started on"}{" "}
            <span>
              <Website />
            </span>
          </h1>
        </div>
        <div className="p-md-2">
          {Array.isArray(stepData) && stepData.map((item: any, i: number) => (<div key={i} className={`${styles.formright} mb-5${i === stepData.length - 1 ? ' border-0' : ''}`}>
            <div className={`${styles.formrightcon}`}>
              <div className="d-flex">
                <h5 className="me-2 text-sm">{i + 1}</h5>
                <div>
                  <h5 className="text-sm">
                    {item.title}
                  </h5>
                  <p>
                    {" "}
                    {item.subTitle}
                  </p>
                </div>
              </div>
            </div>

            <ImageComponent
              src={getImageUrl((item.icon ? item.icon : image1))}
              width={100}
              height={100}
              className={`${styles.images}`}
              onError={handleImageError}
              alt=""
            />
          </div>))}
        </div>
      </div>
    </section>
  )
}

export default Steps
