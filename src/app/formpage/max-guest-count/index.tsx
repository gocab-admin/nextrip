"use client";

import React from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import { useDispatch } from "react-redux";
import { useFormContext } from "@/app/propertyform/FormContext";

interface Props {
  setData: any;
  setFormChanged: any;
  adult: number;
  children: number;
  pets: number;
  bedRoomCount: number;
  bathRoomCount: number;
}

function MaxGuestCount({
  setData,
  setFormChanged,
  adult,
  bedRoomCount,
  bathRoomCount,
}: Props) {
  const { i18 } = usePageContext();
  const dispatch = useDispatch();
  const { pageData } =
  useFormContext();
  console.log('pageData', pageData)
  const inc = () => {
    dispatch(setData({ adult: adult + 1 }));
    setFormChanged(true);
  };

  const dec = () => {
    if (adult > 1) {
      dispatch(setData({ adult: adult - 1 }));
      setFormChanged(true);
    }
  };

  const roomsInc = () => {
    dispatch(setData({ bedRoomCount: bedRoomCount + 1 }));
    setFormChanged(true);
  };

  const roomsDec = () => {
    if (bedRoomCount > 0) {
      dispatch(setData({ bedRoomCount: bedRoomCount - 1 }));
      setFormChanged(true);
    }
  };

  const bathInc = () => {
    dispatch(setData({ bathRoomCount: bathRoomCount + 1 }));
    setFormChanged(true);
  };

  const bathDec = () => {
    if (bathRoomCount > 0) {
      dispatch(setData({ bathRoomCount: bathRoomCount - 1 }));
      setFormChanged(true);
    }
  };

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.step5}`}>
        <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
          <h1 className="me-2">
            {i18?.SELECTBASICS?.MAX_GUEST || "Select Max Guest"}
          </h1>
          <p>
            {i18?.SELECTBASICS?.MAX_GUEST_SUBTITLE ||
              "Here add Maximum Allowable Guest Limit"}
          </p>
          <div className={`${styles.regional_images5} mt-5 pb-4`}>
            <div className={`${styles.guests}`}>
              <div
                className={`d-flex justify-content-between align-items-center py-3`}
              >
                <div>
                  <h5 className="m-0 share-basics">
                    {i18?.SELECTBASICS?.MAXGUESTS || "Maximum Guests"}
                  </h5>
                </div>
                <div
                  className={`d-flex justify-content-between align-items-center`}
                >
                  <button onClick={dec} className={`${styles.add_btn}`}>
                    -
                  </button>
                  <p className="px-5">{adult}</p>
                  <button onClick={inc} className={`${styles.del_btn}`}>
                    +
                  </button>
                </div>
              </div>
              {pageData?.settings?.bedEnable && <><hr /><div
                className={`d-flex justify-content-between align-items-center py-3`}
              >
                <div>
                  <h5 className="m-0 share-basics">
                    {i18?.SELECTBASICS?.BEDROOMS || "Bedrooms"}
                  </h5>
                </div>
                <div
                  className={`d-flex justify-content-between align-items-center`}
                >
                  <button onClick={roomsDec} className={`${styles.add_btn}`}>
                    -
                  </button>
                  <p className="px-5">{bedRoomCount}</p>
                  <button onClick={roomsInc} className={`${styles.del_btn}`}>
                    +
                  </button>
                </div>
              </div></>}

              {pageData?.settings?.bathEnable && <><hr /><div
                className={`d-flex justify-content-between align-items-center py-3`}
              >
                <div>
                  <h5 className="m-0 share-basics">
                    {i18?.SELECTBASICS?.BATHROOMS || "Bathrooms"}
                  </h5>
                </div>
                <div
                  className={`d-flex justify-content-between align-items-center`}
                >
                  <button onClick={bathDec} className={`${styles.add_btn}`}>
                    -
                  </button>
                  <p className="px-5">{bathRoomCount}</p>
                  <button onClick={bathInc} className={`${styles.del_btn}`}>
                    +
                  </button>
                </div>
              </div></>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MaxGuestCount;
