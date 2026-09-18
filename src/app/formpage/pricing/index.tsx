"use client";

import React, { useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import { useAppSelector } from "@/redux/hooks";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { MdModeEditOutline } from "react-icons/md";
import { currencySelector } from "@/redux/slice/CurrencySlice";

interface Props {
  onChange: any
  value: any
}

function Pricing({ onChange, value }: Props) {
  const { i18 } = usePageContext();
  const [isEditing, setIsEditing] = useState(false);
  const { CurrencyList } = useAppSelector(currencySelector);

  const {
    price
  } = value;



  const handleInputChange = (event: any) => {
    onChange({ price: event.target.value });
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Perform any additional save logic here
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.form} ${styles.step13}`}>
        <div className={`${styles.checkbox} col-md-7 h-100 mt-3 checkbox`}>
          <h1 className="me-2">
            {i18?.SETPRICE?.TITLE || "Now, set your price"}
          </h1>
          <p>{i18?.SETPRICE?.SUBTITLE || "You can change it anytime."}</p>
          <div>
            {isEditing ? (
              <div className={`${styles.amounttext}`}>
                <input
                  type="number"
                  value={price}
                  onChange={handleInputChange}
                />
                <DynamicButtonComponent
                  variant="outlined"
                  onClick={handleSaveClick}
                  text={i18?.SETPRICE?.SAVE || "Save"}
                />
              </div>
            ) : (
              <div className={`${styles.amounttext}`}>
                <input type="text" value={price} readOnly={true} />
                <MdModeEditOutline
                  onClick={handleEditClick}
                  className={`${styles.editicon}`}
                />
              </div>
            )}
          </div>
          <p className="text-center">
            {i18?.SETPRICE?.PRETAXPRICE || "Guest price before taxes"}{" "}
            {CurrencyList.currency} {price}{" "}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
