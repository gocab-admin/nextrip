"use client";
import { useEffect } from "react";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useFormContext } from "@/app/propertyform/FormContext";

interface Props {
  onChange: any;
  value: any;
  data: any;
  count: any;
}

function BedTypes({ onChange, value, count }: Props) {
  const { i18 } = usePageContext();
  // const [bedCountData, setBedCountData] = useState<any>(null);
  const [openIndex, setOpenIndex] = useState<any>(0);

  const openCounter = (method: any, index: any) => {
    if (method.type === "Close") {
      setOpenIndex(null);
    }
    if (method.type === "Open") {
      setOpenIndex(index);
    }
  };

  const increaseCount = (room: number, type: string, val: number) => {
    const tempObj = JSON.parse(JSON.stringify(value));
    tempObj[`bedRoom${room}`][type] = val;
    onChange(tempObj);
  };

  const decreaseCount = (room: number, type: string, val: number) => {
    const tempObj = JSON.parse(JSON.stringify(value));
    tempObj[`bedRoom${room}`][type] = val;
    onChange(tempObj);
  };

  const { setNextDisable} = useFormContext();

  useEffect(() => {
    const isValid = Array.from(Array(count)).every((item, index)=>{
      const currentBedType = value[`bedRoom${index + 1}`];
      return  Object.values(currentBedType).some((bedcount:any)=>bedcount>0);
    });
    setNextDisable(isValid?false:true)
  }, [count, value])

  return (
    <section className={`${styles.host}`}>
      <div className={`${styles.steptype}`}>
        <div className={`${styles.checkbox} h-100 mt-3 checkbox`}>
          <h1 className="my-3" style={{ marginLeft: "1rem" }}>
            {i18?.ADDARRANGEMENT?.TITLE || "Add some arrangement for stay"}
          </h1>
          <p style={{ marginLeft: "1rem" }}>
            {i18?.ADDARRANGEMENT?.SUBTITLE || "You can change it later."}
          </p>
          {value &&
            Array.from(Array(count)).map((item: any, index: number) => {
              // console.log(value,'value' );
              
              const currentBedType = value[`bedRoom${index + 1}`];
              return (
                <div className={`${styles.body}`} key={index}>
                  <div className={`${styles.bodyContent}`}>
                    <div>
                      <p>
                        {i18?.ADDARRANGEMENT?.BEDROOM || "Bedroom"} {index + 1}{" "}
                      </p>
                    </div>
                    <div>
                      {openIndex == index ? (
                        <KeyboardArrowUpIcon
                          onClick={() => openCounter({ type: "Close" }, index)}
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          onClick={() => openCounter({ type: "Open" }, index)}
                        />
                      )}
                    </div>
                  </div>
                  {openIndex == index && (
                    <>
                      <div className={`${styles.dropDown}`}>
                        <div className={`${styles.Label}`}>
                          <p className="m-0">
                            {i18?.ADDARRANGEMENT?.KING || "King"}
                          </p>
                        </div>
                        <div className={`${styles.flexContainer}`}>
                          <button
                            className={`${styles.Box}`}
                            disabled={currentBedType?.king === 0}
                            onClick={() =>
                              decreaseCount(
                                index + 1,
                                "king",
                                currentBedType?.king - 1
                              )
                            }
                          >
                            <RemoveIcon />
                          </button>
                          <p>{currentBedType?.king}</p>
                          <button
                            className={`${styles.Box}`}
                            onClick={() =>
                              increaseCount(
                                index + 1,
                                "king",
                                currentBedType?.king + 1
                              )
                            }
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>
                      <hr />
                      <div className={`${styles.dropDown}`}>
                        <div className={`${styles.Label}`}>
                          <p className="m-0">
                            {i18?.ADDARRANGEMENT?.QUEEN || "Queen"}
                          </p>
                        </div>
                        <div className={`${styles.flexContainer}`}>
                          <button
                            className={`${styles.Box}`}
                            disabled={currentBedType?.queen === 0}
                            onClick={() =>
                              decreaseCount(
                                index + 1,
                                "queen",
                                currentBedType?.queen - 1
                              )
                            }
                          >
                            <RemoveIcon />
                          </button>
                          <p>{currentBedType?.queen}</p>                          <button
                            className={`${styles.Box}`}
                            onClick={() =>
                              increaseCount(
                                index + 1,
                                "queen",
                                currentBedType?.queen + 1
                              )
                            }
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>
                      <hr />
                      <div className={`${styles.dropDown}`}>
                        <div className={`${styles.Label}`}>
                          <p className="m-0">
                            {i18?.ADDARRANGEMENT?.DOUBLE || "Double"}
                          </p>
                        </div>
                        <div className={`${styles.flexContainer}`}>
                          <button
                            className={`${styles.Box}`}
                            disabled={currentBedType?.double === 0}
                            onClick={() =>
                              decreaseCount(
                                index + 1,
                                "double",
                                currentBedType?.double - 1
                              )
                            }
                          >
                            <RemoveIcon />
                          </button>
                          <p>{currentBedType?.double}</p>
                          <button
                            className={`${styles.Box}`}
                            onClick={() =>
                              increaseCount(
                                index + 1,
                                "double",
                                currentBedType?.double + 1
                              )
                            }
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default BedTypes;
