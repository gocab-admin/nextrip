"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import AccordionItem from "./AccordionItem";

interface Props {
  value: any;
  onChange: (val: any)=> void
  data: any[],
}

function Amenity({value, onChange, data}: Props) {
  const { i18 } = usePageContext();
  const [privilegesItems, setPrivilegesItems] = useState<any>({});
  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.form} ${styles.step7}`}>
        <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
          <h1 className="me-2">
            {i18?.MAKEPLACE?.SELECTAMENITIES ||
              "Tell guests what your place has to offer"}
          </h1>
          
          {Array.isArray(data) && data.map((item, index)=>(<AccordionItem key={index} index={index} data={item} onChange={onChange} privilegesItems={privilegesItems} setPrivilegesItems={setPrivilegesItems} value={value} />
           ))}
          
          {/* <div className={`${styles.regional_images}`}>
            {data?.map((region: any, r: number) => (
              <>
                {region?.amenities?.map((item: any, ra: any) => (
                  <div className="d-flex flex-column" key={`region${item._id}`}>
                    <label htmlFor={`check${item._id}`}>
                      <input
                        hidden
                        type="checkbox"
                        name="checkoffer"
                        id={`check${item._id}`}
                        value={item._id}
                        onClick={onChange}
                        checked={value.includes(item._id)}
                      />

                      <div className={`${styles.labelcheck}`}>
                        <div className={`${styles.icon}`}>
                          <ImageComponent
                            src={item.icon}
                            width={45}
                            height={45}
                            alt=""
                            onError={handleImageError}
                          />
                        </div>

                        <p className={`${styles.para} m-0`}>{item.name}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default Amenity;
