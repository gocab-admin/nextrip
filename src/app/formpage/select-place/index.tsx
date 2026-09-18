"use client";

import dynamic from "next/dynamic";
import React from 'react'
import styles from "./page.module.scss";
import { usePageContext } from '@/components/Providers/PageContext';
const ImageComponent = dynamic(() => import("@/components/ImageComponent"));
import { APIURLS } from "@/services/config";
import { handleImageError } from "@/services/utils/utils";
import { House } from "@/app/global/svg";

interface Props {
  data: any[]
  setFormChanged: any
  onChange: (arg: string)=>void
  value: string
  icon?: boolean;
}

function SelectPlace({ data, setFormChanged, onChange, value, icon }: Props) {
    const { i18 } = usePageContext();

    return (
        <section className={`${styles.host}`}>
            <div className={`${styles.step2} mb-4`}>
            <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
              <h1 className="me-2">
                {i18?.SELECTPLACE?.SELECTPLACE ||
                  "Which of these best describes your place?"}
              </h1>
              <div className={`${styles.regional_images2} pb-4`}>
                {Array.isArray(data) && data.length > 0 ? (
                  data?.map((type: any, rp: number) => (
                    <div
                      className="d-flex flex-column p-2 w-100"
                      key={`region${  type._id}`}
                    >
                      <label htmlFor={`check${  type._id}`}>
                        <input
                          type="radio"
                          name="checkroom"
                          id={`check${  type._id}`}
                          value={value}
                          onClick={(e: any) => {
                            onChange(type._id); 
                            setFormChanged(true);
                          }}
                          checked={value === type._id}
                        />

                        <div className={`${styles.labelcheck}`}>
                          <div className="">
                            <h5>{type.property || type.subCategory
                            }</h5>
                            <p className="m-0">{type.desc}</p>
                          </div>
                          {icon && (type.icon ? (
                            <ImageComponent
                              src={type.icon}
                              width={45}
                              height={45}
                              alt={type.property}
                              onError={handleImageError}
                            />
                          ) : (
                            <House
                              style={{
                                display: "block",
                                height: "45px",
                                width: "45px",
                                fill: "none",
                                stroke: "currentcolor",
                                strokeWidth: 2
                              }}
                            />
                          ))}
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div>
                    <p>
                      {i18?.SELECTPLACE?.NOTSELECT ||
                        "Currently there are no option is availabe for selected type"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
  </section>)
}

export default SelectPlace
