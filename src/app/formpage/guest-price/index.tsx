"use client";

import React, { useMemo, useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import { useAppSelector } from "@/redux/hooks";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { MdModeEditOutline } from "react-icons/md";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormControlLabel from "@mui/material/FormControlLabel";
import { IOSSwitch } from "@/components/switch";

interface Props {
  onChange: any;
  value: any;
}

function GuestPrice({ onChange, value }: Props) {
  const { i18, settings } = usePageContext();
  const [openExtra, setOpenExtra] = useState<any>(0);
  const [isEditing, setIsEditing] = useState(false);
  // const [enable, setEnable] = useState(false);
  const { CurrencyList } = useAppSelector(currencySelector);
  const { listings, hiddenSettings } = settings;

  const {
    perDay,
    extraGuestFee,
    discountPercentage,
    extraGuest,
    availableCount,
    minimumNight,
    maximumNight,
    maxNightSelect,
    perHour,
    hourlyChecking,
    priceExists,
  } = value;
  console.log("maxNightSelect", maxNightSelect);
  const enable = useMemo(() => {
    if (maximumNight === 1 && maximumNight === 1) {
      return false;
    }
    return true;
  }, [minimumNight, maximumNight]);

  const handleInputChange = (event: any) => {
    onChange({ perDay: Math.abs(parseFloat(event.target.value) || 0) });
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Perform any additional save logic here
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const openExtraCounter = (method: any, index: any) => {
    if (method.type === "Close") {
      setOpenExtra(null);
    }
    if (method.type === "Open") {
      setOpenExtra(index);
    }
  };

  const handleAvailableCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    // if (!isNaN(inputValue) && inputValue >= 1) {
    onChange({ availableCount: inputValue });
  };

  const capacityInc = () => {
    onChange({ availableCount: parseInt(availableCount + 1) });
  };

  const capacityDec = () => {
    if (availableCount > 1) {
      onChange({ availableCount: availableCount - 1 });
    }
  };

  const miniInc = () => {
    onChange({ minimumNight: minimumNight + 1 });
  };

  const miniDec = () => {
    if (minimumNight > 1) {
      onChange({ minimumNight: minimumNight - 1 });
    }
  };
  const maxiInc = () => {
    onChange({ maximumNight: maximumNight + 1 });
  };

  const maxiDec = () => {
    if (maximumNight > 2) {
      onChange({ maximumNight: maximumNight - 1 });
    }
  };
  const extraInc = () => {
    onChange({ extraGuest: extraGuest + 1 });
  };

  const extraDec = () => {
    if (extraGuest > 1) {
      onChange({ extraGuest: extraGuest - 1 });
    }
  };

  const handleMiniCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    onChange({ minimumNight: inputValue });
  };

  const handleMaxiCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    onChange({ maximumNight: inputValue });
  };

  const handleExtraPerHourInputChange = (event: any) => {
    const inputValue = parseFloat(event.target.value);
    if ((inputValue > 0 && inputValue != 0) || !inputValue) {
      onChange({ perHour: inputValue });
    }
  };

  const handleExtraGuestCount = (event: any) => {
    const inputValue = parseInt(event.target.value, 0);
    onChange({ extraGuest: inputValue });
  };

  const handleExtraInputChange = (event: any) => {
    const inputValue = parseInt(event.target.value);
    if ((inputValue > 0 && inputValue != 0) || !inputValue) {
      onChange({ extraGuestFee: inputValue });
    }
  };
  const handleDiscountInputChange = (event: any) => {
    const inputValue = parseInt(event.target.value);
    if ((inputValue > 0 && inputValue != 0) || !inputValue) {
      onChange({ discountPercentage: inputValue });
    }
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
                  value={perDay || 0}
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
                <input type="text" value={perDay} readOnly={true} />
                <div
                  className="cursor-pointer"
                  role="button"
                  onClick={handleEditClick}
                >
                  <MdModeEditOutline className={`${styles.editicon}`} />
                </div>
              </div>
            )}
          </div>
          <p className="text-center">
            {i18?.SETPRICE?.PRETAXPRICE || "Guest price before taxes"}{" "}
            {CurrencyList.currency} {perDay}{" "}
            {/* {i18?.BOOKINGPAGE?.PERDAY || "per day"} */}
          </p>
          <div className=" mt-4">
            {(hiddenSettings.hourlyBooking !== "Day" ||
              listings?.availableCount === "1" ||
              listings.pricings.additions === "1") && (
              <div className={`${styles.body}`}>
                <div
                  className={`${styles.bodyContent} d-flex justify-content-between`}
                >
                  <div>
                    <h5>{i18?.SETPRICE?.MOREDETAILS || "More details"}</h5>
                  </div>
                  <div
                    role="button"
                    className="cursor-pointer"
                    onClick={() =>
                      openExtraCounter(
                        { type: openExtra == 0 ? "Close" : "Open" },
                        0
                      )
                    }
                  >
                    {openExtra == 0 ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </div>
                </div>
                <>
                  {openExtra == 0 && (
                    <div className={`${styles.guests}`}>
                      {listings?.availableCount === "1" && (
                        <div
                          className={`d-flex justify-content-between align-items-center py-3`}
                        >
                          <div>
                            <p className="m-0">
                              {i18?.SETPRICE?.AVAILABLECOUNT ||
                                "AvailableCount"}
                            </p>
                          </div>
                          <div
                            className={`d-flex justify-content-between align-items-center`}
                          >
                            <button
                              onClick={capacityDec}
                              className={`${styles.add_btn}`}
                            >
                              -
                            </button>

                            {/* <p className="px-5 m-0">{availableCount}</p>  */}
                            <div className={`${styles.availableCounttext} m-0`}>
                              <input
                                type="number"
                                value={availableCount}
                                onChange={handleAvailableCount}
                              />
                            </div>

                            <button
                              onClick={capacityInc}
                              className={`${styles.del_btn}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      <hr />
                      {listings.pricings.additions === "1" && (
                        <div>
                          <div className="d-flex justify-content-between align-items-center py-3">
                            <div>
                              <p className="m-0">
                                {i18?.SETPRICE?.MAXSELECTNIGHT ||
                                  "Maximum night select"}
                              </p>
                            </div>
                            <FormControlLabel
                              className="me-2"
                              control={<IOSSwitch />}
                              // label={enable ? 'Enable' : 'Disable'}
                              label={undefined}
                              checked={maxNightSelect}
                              onChange={(event: any) => {
                                // setEnable(event.target.checked)
                                if (event.target.checked) {
                                  onChange({
                                    minimumNight: 1,
                                    maximumNight: 90,
                                    maxNightSelect: true,
                                  });
                                } else {
                                  onChange({
                                    minimumNight: 1,
                                    maximumNight: 1,
                                    maxNightSelect: false,
                                  });
                                }
                              }}
                            />
                          </div>
                          <hr />
                          {maxNightSelect && (
                            <div>
                              <div
                                className={`d-flex justify-content-between align-items-center py-3`}
                              >
                                <div>
                                  <p className="m-0">
                                    {i18?.SETPRICE?.MINNIGHT || "Minimum Night"}
                                  </p>
                                </div>
                                <div
                                  className={`d-flex justify-content-between align-items-center`}
                                >
                                  {minimumNight > 1 && (
                                    <button
                                      onClick={miniDec}
                                      className={`${styles.add_btn}`}
                                    >
                                      -
                                    </button>
                                  )}

                                  {/* <p className="px-5 m-0">{mini}</p> */}
                                  <div
                                    className={`${styles.availableCounttext} m-0`}
                                  >
                                    <input
                                      type="number"
                                      value={minimumNight}
                                      onChange={handleMiniCount}
                                    />
                                  </div>

                                  <button
                                    onClick={miniInc}
                                    className={`${styles.del_btn}`}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <hr />
                              <div
                                className={`d-flex justify-content-between align-items-center py-3`}
                              >
                                <div>
                                  <p className="m-0">
                                    {i18?.SETPRICE?.MAXNIGHT || "Maximum Night"}
                                  </p>
                                </div>
                                <div
                                  className={`d-flex justify-content-between align-items-center`}
                                >
                                  {maximumNight > 2 && (
                                    <button
                                      onClick={maxiDec}
                                      className={`${styles.add_btn}`}
                                    >
                                      -
                                    </button>
                                  )}

                                  {/* <p className="px-5 m-0">{maxi}</p> */}
                                  <div
                                    className={`${styles.availableCounttext} m-0`}
                                  >
                                    <input
                                      type="number"
                                      value={maximumNight}
                                      onChange={handleMaxiCount}
                                    />
                                  </div>
                                  <button
                                    onClick={maxiInc}
                                    className={`${styles.del_btn}`}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <hr />
                            </div>
                          )}
                        </div>
                      )}
                      {/* {hourlyChecking && hourlyChecking == "1" ? ( */}
                      {hiddenSettings.hourlyBooking !== "Day" && (
                        <div
                          className={`d-flex justify-content-between align-items-center py-3`}
                        >
                          <div>
                            {" "}
                            <p>
                              {i18?.SETPRICE?.SETYOUHOURLYRATE ||
                                "Set you hourly rate"}{" "}
                              ({CurrencyList.currency})
                            </p>
                          </div>
                          <div className={`${styles.extrapricetext}`}>
                            <input
                              type="number"
                              value={perHour}
                              onChange={handleExtraPerHourInputChange}
                            />
                          </div>
                        </div>
                      )}
                      {/* ) : (
                          <></>
                        )} */}

                      {listings.pricings.additions === "1" && (
                        <div>
                          <hr />
                          <div
                            className={`d-flex justify-content-between align-items-center py-3`}
                          >
                            <div>
                              <p className="m-0">
                                {i18?.SETPRICE?.DISCOUNT || "Enter Discount(%)"}
                              </p>
                            </div>
                            <div>
                              <input
                                type="number"
                                value={discountPercentage}
                                onChange={handleDiscountInputChange}
                                style={{
                                  outline: "none",
                                  border: "1px solid #fff",
                                  borderRadius: "6px",
                                  padding: "8px 12px",
                                  fontSize: "16px",
                                  width: "100%",
                                  textAlign: "center",
                                }}
                              />
                            </div>
                          </div>
                          <hr />
                          <div
                            className={`d-flex justify-content-between align-items-center py-3`}
                          >
                            <div>
                              <p className="m-0">
                                {i18?.SETPRICE?.ADDEXTRAGUEST ||
                                  "Extra Guest after"}
                              </p>
                            </div>
                            <div
                              className={`d-flex justify-content-between align-items-center`}
                            >
                              {extraGuest > 1 && (
                                <button
                                  onClick={extraDec}
                                  className={`${styles.add_btn}`}
                                >
                                  -
                                </button>
                              )}

                              {/* <p className="px-5 m-0">{extraguest}</p> */}
                              <div
                                className={`${styles.availableCounttext} m-0`}
                              >
                                <input
                                  type="number"
                                  value={extraGuest}
                                  onChange={handleExtraGuestCount}
                                />
                              </div>
                              <button
                                onClick={extraInc}
                                className={`${styles.del_btn}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <hr />
                          <div
                            className={`d-flex justify-content-between align-items-center py-3`}
                          >
                            <div>
                              {" "}
                              <p>
                                {i18?.SETPRICE?.EXTRAGUESTPRICE ||
                                  "Extra price per guest"}
                              </p>
                            </div>

                            <div className={`${styles.extrapricetext}`}>
                              <input
                                type="number"
                                value={extraGuestFee}
                                onChange={handleExtraInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* {hourlyChecking && hourlyChecking == "1" ? (
                          <div
                            className={`d-flex justify-content-between align-items-center py-3`}
                          >
                            <div>
                              {" "}
                              <p>
                                {i18?.SETPRICE?.EXTRAHOURPRICE ||
                                  "Extra price per hour"}
                              </p>
                            </div>
                            <div className={`${styles.extrapricetext}`}>
                              <input
                                type="number"
                                value={extraPricePerHour}
                                onChange={handleExtraPerHourInputChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <></>
                        )} */}
                    </div>
                  )}
                </>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuestPrice;
