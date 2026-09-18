"use client";
import React, { useMemo, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import { AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
dayjs.extend(toObject);
import { getApiMethod } from "@/services/global";
import BookingBox from "./BookingBox";
import APICONSTANT from "@/services/config";
import { addAlert } from "@/redux/slice/AlertSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchBookingData,
  isLoadingPayment
} from "@/redux/slice/user/BookingSlice";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { usePageContext } from "@/components/Providers/PageContext";
import { Time, formatDateTime } from "@/services/utils/datetime";
import { formatNumber } from "@/Utils/formatNumberWithCommas";

import "./header.scss";
import styles from "./searchbar.module.scss";
import { Loader } from "./loader";
import { currencyRate } from "@/Utils/currencyRate";

const Accordion = dynamic(() => import("@mui/material/Accordion"));
const AccordionDetails = dynamic(
  () => import("@mui/material/AccordionDetails")
);
const DateHourBox = dynamic(() => import("./HourPicker_Mob_design3/index"));

const MobilereserveBox = ({
  open,
  onClose,
  hourprice,
  activeButton,
    setActiveButton, 
    price, 
    dates, 
    setDates, 
    maxNight,
    minNight,
    list,
    pplCount,
    setPplCount,
    handleReserve,
    schedule,
    bookedhours
}: {
  open: boolean;
  activeButton: any;
  setActiveButton: any;
  dates: any;
  setDates: any;
  onClose: () => void;
  price: any;
  hourprice: any;
  maxNight: any;
  minNight: any;
  list: any;
  pplCount: any;
  setPplCount: any;
  handleReserve: any
  schedule:any
  bookedhours:any
}) => {  
  const loader = useSelector(
    (state: any) => state.bookingEstimation.loadingPayment
  );
  const handleDrawerClose = () => {
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleDrawerClose}
      PaperProps={{ style: { height: "100%" } }}
      transitionDuration={500}
      sx={{ overflowY: "hidden" }}
    >
      {loader && <Loader />}
      <div onClick={handleDrawerClose}>
        <CloseIcon
          sx={{ margin: "auto", marginleft: "2px", marginTop: "2px" }}
        />
      </div>
      <div className={`${styles.drawer} p-4`}>
        <div className={`${styles.stickysidebar}`}>

        <BookingBox
                  activeButton={activeButton}
                  setActiveButton={setActiveButton}
                  hourprice={hourprice}
                  price={price}
                  dates={dates}
                  setDates={setDates}
                  maxNight={maxNight}
                  minNight={minNight}
                  list={list}
                  pplCount={pplCount}
                  setPplCount={setPplCount}
                  handleReserve={handleReserve}
                  schedule={schedule}
                  bookedhours={bookedhours}
                   />    
        </div>
      </div>
    </Drawer>
  );
};

export default MobilereserveBox;
