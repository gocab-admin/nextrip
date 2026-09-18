"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ArrowBackIosSharp from "@mui/icons-material/ArrowBackIosSharp";
import dynamic from "next/dynamic";

import { Bed } from "@/app/global/svg";

import styles from "./components.module.scss";

const Box = dynamic(() => import("@mui/material/Box"));
const Button = dynamic(() => import("@mui/material/Button"));
const MobileStepper = dynamic(() => import("@mui/material/MobileStepper"));

const BedCarousel = (props: any) => {
  const { i18 } = props;
  const item = useSelector((state: any) => state?.listingData);
  const BedType = item?.ListingData?.accomodation?.bedRoomCount;
  const bedCountData: any = Object.entries(
    JSON.parse(JSON.stringify(props.bedData))
  );

  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const bedRoom: any = bedCountData[activeStep][activeStep - activeStep];
  const bedTypes: any = bedCountData[activeStep][1];

  return (
    <>
      {BedType && (
        <div
          className={`${
            BedType !== 1 ? styles.bedtype : ""
          } py-2 add-room-type`}
        >
          <Box sx={{ flexGrow: 1 }}>
            <h5 style={{ fontSize: "var(--host-index-title)" }}>
              {i18?.ROOMPAGE?.WHEREYOUWILLSLEEP || "where you'll sleep"}
            </h5>
            {BedType.length !== 1 && (
              <MobileStepper
                className="d-flex justify-content-end"
                variant="text"
                steps={BedType}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    hidden
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === BedType - 1}
                  >
                    {i18?.BUTTONS?.NEXT || "Next"}
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft sx={{ color: "black" }} />
                    ) : (
                      <KeyboardArrowRight sx={{ color: "black" }} />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    hidden
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight sx={{ color: "black" }} />
                    ) : (
                      <KeyboardArrowLeft sx={{ color: "black" }} />
                    )}
                    {i18?.BUTTONS?.BACK || "Back"}
                  </Button>
                }
              />
            )}
            {BedType !== 1 && (
              <div
                className={`${styles.bedtype_button} d-flex justify-content-end`}
              >
                <button onClick={handleBack} disabled={activeStep === 0}>
                  <ArrowBackIosSharp fontSize="small" sx={{ color: "black" }} />
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeStep === BedType - 1}
                >
                  <ArrowForwardIosSharpIcon
                    fontSize="small"
                    sx={{ color: "black" }}
                  />
                </button>
              </div>
            )}
            <div className={`d-flex mt-2 py-2`}>
              <div
                className={`${
                  BedType !== 1 ? styles.roomdetails : styles.grid
                }`}
              >
                <div className={`${styles.borderadd} p-4`}>
                  <Bed
                    className={`my-2`}
                    style={{
                      display: "block",
                      height: "24px",
                      width: "24px",
                      fill: "currentcolor"
                    }}
                  />
                  <h5 className={`py-2 mb-0`}>
                    {i18?.LISTING?.BEDOROOM || "Bedroom"}{" "}
                    {bedRoom.charAt(bedRoom.length - 1)}
                  </h5>
                  <p>
                    {bedTypes.double
                      ? `${
                          `${bedTypes.double  } ${  i18?.ADDARRANGEMENT?.DOUBLE}` ||
                          "double"
                        }`
                      : null}
                    {bedTypes.king
                      ? ` ${
                          `${bedTypes.king  } ${  i18?.ADDARRANGEMENT?.KING}` ||
                          "king"
                        }`
                      : null}
                    {bedTypes.queen
                      ? ` ${
                          `${bedTypes.queen  } ${  i18?.ADDARRANGEMENT?.QUEEN}` ||
                          "queen"
                        }`
                      : null}
                  </p>
                </div>
              </div>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default BedCarousel;
