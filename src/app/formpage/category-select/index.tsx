"use client";

import dynamic from "next/dynamic";
import React from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
import APICONSTANT, { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";
interface Props {
  data: any[]
  setFormChanged: any
  onChange: (arg: string)=>void
  value: string,
  title: string
}
function CategorySelect({ data, setFormChanged, onChange, value, title }: Props) {
  const { i18 } = usePageContext();

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.form}`}>
        <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
          <h1 className="me-2">
            {title ||
              "Which of these best describes your place?"}
          </h1>
          <div className={`${styles.regional_images} pb-4`}>
            {data.length !== 0 ? (
              data?.map((region: any, r: number) => (
                <div
                  className="d-flex flex-column p-2"
                  key={`region${region._id}`}
                >
                  <label htmlFor={`check${region._id}`}>
                    <input
                      type="radio"
                      name="checkplace"
                      id={`check${region._id}`}
                      value={region._id}
                      onClick={(e: any) => {
                        setFormChanged(true);
                        onChange(region._id);
                      }}
                      checked={value === region._id}
                    />

                    <div className={`${styles.labelcheck}`}>
                      <div className={`${styles.icon}`}>
                        <ImageComponent
                          src={region.icon}
                          width={45}
                          height={45}
                          alt={region.category}
                          onError={handleImageError}
                        />
                      </div>

                      <p className={`${styles.para} m-0`}>{region.category}</p>
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <div>{i18?.HEADER?.NODATAFOUND || "No Data Found"}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySelect;
