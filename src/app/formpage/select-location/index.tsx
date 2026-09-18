"use client";

import dynamic from "next/dynamic";
import React from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
const Map = dynamic(() => import("@/components/locationmap"));
interface Props {
  setFormChanged: any;
  onChange: (arg: any) => void;
  value: any;
}

function SelectLocation({ setFormChanged, onChange, value }: Props) {
  const { i18, settings } = usePageContext();
  console.log("settings", settings);
  const shouldFetchLocation = Boolean(value._id && !value.lat && !value.lng);

  const changeGeo = (data: any) => {
    setFormChanged(true);
    onChange((prev: any) => ({ ...prev, ...data }));
  };

  const changeAddress = (address: any) => {
    if (typeof address === "string") {
      onChange((prev: any) => ({ ...prev, location: address }));
    } else {
      onChange((prev: any) => ({ ...prev, location: address.selectedPlace }));
    }
  };

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.step3} mb-4`}>
        <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
          <h1 className="me-2">
            {i18?.SELECTLOCATION?.TITLE || "Where's your place located?"}
          </h1>
          <p>
            {i18?.SELECTLOCATION?.TEXT ||
              "Your address is only shared with guests after they’ve made a reservation."}
          </p>
          <div className={`${styles.regional_images3}`}>
            <Map
              onChangeAddress={changeAddress}
              onChange={changeGeo}
              value={{
                latitude: value.lat || 9.933491,
                longitude: value.lng || 78.127579
              }}
              location={value.location}
              shouldFetchLocation={shouldFetchLocation}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectLocation;
