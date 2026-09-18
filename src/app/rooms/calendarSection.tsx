"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getDatesBetween } from "@/services/utils/dateFunctions";
import { usePageContext } from "@/components/Providers/PageContext";
// import { dispatch } from "@/redux/store";
// import { addAlert } from "@/redux/slice/AlertSlice";

import "../../components/header.scss";

const CalendarSection = ({ list }: any) => {
  const { i18 } = usePageContext();
  const item = useSelector((state: any) => state?.listingData);
  const blockedDate = item.ListingData.priceData[0]?.blockedDates;
  const lists: any =
    Array.isArray(blockedDate) && blockedDate.length > 0
      ? blockedDate.flatMap((date: any) =>
          getDatesBetween(new Date(date.start), new Date(date.end))
        )
      : [];

  const searchParams: any = useSearchParams();
  const [dates, setDates] = useState<any>([]);
  const [maxNight, setMaxNight] = useState<any>(
    item ? item.ListingData.priceData[0]?.bookingType.maximumNight : null
  );
  const [minNight, setMinNight] = useState<any>(
    item ? item.ListingData.priceData[0]?.bookingType.minimumNight : null
  );
  // // calculate min date from selected date
  // const getMinDate = useMemo(() => {
  //     const minSelectableDate = new DateObject().add(1, "days");
  //     // if from date is selected & to date is unselected
  //     if (dates && dates.length === 1) {
  //         // if maximum night from both sides are within the today date
  //         const maxBeforeSelectable = new DateObject(dates[0]).subtract(maxNight, "days");

  //         if (maxBeforeSelectable.valueOf() > minSelectableDate.valueOf()) {
  //             let currentDatePointer = new DateObject(dates[0]);
  //             // adjust min date based on blocked dates
  //             for (let i = 0; i < maxNight; ++i) {
  //                 currentDatePointer.subtract(1, "days");

  //                 if (lists.includes(currentDatePointer.format('DD-MM-YYYY'))) {
  //                     return currentDatePointer.add(1, "days");;
  //                 }
  //             }

  //             return currentDatePointer.add(1, "days");
  //         }
  //     }
  //     return minSelectableDate;
  // }, [dates])

  // // calculate max date from selected date
  // const getMaxDate = useMemo(() => {

  //     const maxSelectableDate = new DateObject().add(180, "days");
  //     // if from date is selected & to date is unselected
  //     if (dates && dates.length === 1 && maxNight > 1) {
  //         const maxAfterSelectable = new DateObject(dates[0]).add(maxNight, "days");
  //         if (maxSelectableDate.valueOf() > maxAfterSelectable.valueOf()) {

  //             let currentDatePointer = new DateObject(dates[0]);
  //             // adjust min date based on blocked dates
  //             for (let i = 0; i < maxNight; ++i) {
  //                 currentDatePointer.add(1, "days");
  //                 if (lists.includes(currentDatePointer.format('DD-MM-YYYY'))) {
  //                     return currentDatePointer.subtract(1, "days");
  //                 }
  //             }
  //             currentDatePointer.subtract(1, "days");
  //         }
  //     }

  //     // maximum 6 months from current Date
  //     return maxSelectableDate;
  // }, [dates])

  const getMinDate = useMemo(() => {
    const afterSelect = new DateObject(dates[0]).add(minNight, "days");
    const minSelectableDate = new DateObject().add(2, "days");
    const condition = dates && dates.length > 0 && dates.length < 2;
    if (condition) {
      return afterSelect;
    } else {
      return minSelectableDate;
    }
  }, [dates]);

  const getMaxDate = useMemo(() => {
    const maxDate = new DateObject(dates[0]).add(maxNight, "days");
    const afterSelect = "";
    const condition = dates && dates.length > 0 && dates.length < 2;
    if (condition) {
      return maxDate;
    } else {
      return afterSelect;
    }
  }, [dates]);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const fromDate = from
      ? new DateObject({
          date: new Date(from),
          format: "DD/MM/YYYY"
        })
      : null;
    const toDate = to
      ? new DateObject({
          date: new Date(to),
          format: "DD/MM/YYYY"
        })
      : null;
    if (from && to) {
      setDates([fromDate, toDate]);
    } else if (from) {
      setDates([fromDate]);
    } else {
      setDates([]);
    }
  }, []);
  return (
    <>
      <div>
        {/* <Calendar
                    range
                    minDate={getMinDate}
                    maxDate={getMaxDate}
                    highlightToday={false}
                    className="rmdpprime"
                    numberOfMonths={2}
                    onChange={(date: any) => {
                        const fromDate = date[0]
                            ? date[0].format("YYYY-MM-DD")
                            : null;
                        const toDate = date[1]
                            ? date[1].format("YYYY-MM-DD")
                            : null;

                        const currentParams = new URLSearchParams(searchParams);
                        if (date[0])
                            currentParams.set("from", fromDate);
                        else
                            currentParams.delete("from");

                        if (date[1]) currentParams.set("to", toDate);
                        else
                            currentParams.delete("to");
                        // router.replace(`?${currentParams}`, { scroll: false });
                        window.history.replaceState({ path: '?' + currentParams.toString() }, '', '?' + currentParams.toString());

                        setDates(date);
                    }}
                    mapDays={({ date }) => {
                        const formattedDate = date.format('DD-MM-YYYY');
                        const isblocked = lists.includes(formattedDate);
                        if (isblocked) {
                            return {
                                disabled: true,
                                style: { backgroundColor: '#ccc', color: "#fff" },
                                // onClick: () => list.info("This date is unavailable"),
                                onClick: () => dispatch(addAlert({
                                    isOpen: true,
                                    message: "This date is unavailable",
                                    type: "error",
                                    severity: "error", 
                                }))
                            };
                        }
                    }}
                    value={dates}
                    rangeHover
                    format="DD/MM/YYYY"
                /> */}
        <Calendar
          range
          minDate={getMinDate}
          maxDate={getMaxDate}
          highlightToday={false}
          className="rmdpprime"
          numberOfMonths={2}
          onChange={(date: any) => {
            const fromDate = date[0] ? date[0].format("YYYY-MM-DD ") : null;
            const toDate = date[1] ? date[1].format("YYYY-MM-DD") : null;

            const currentParams = new URLSearchParams(window.location.search);
            const apiFromDate = currentParams.get("from");
            const apiToDate = currentParams.get("to");

            if (fromDate && !toDate && apiToDate) {
              currentParams.delete("to");
            }
            if (date[0]) currentParams.set("from", fromDate);
            else currentParams.delete("from");

            if (date[1]) currentParams.set("to", toDate);
            else currentParams.delete("to");
            // router.replace(`?${currentParams}`, { scroll: false });
            window.history.replaceState(
              { path: `?${  currentParams.toString()}` },
              "",
              `?${  currentParams.toString()}`
            );

            setDates(date);
          }}
          mapDays={({ date }) => {
            
            const formattedDate = date.format("DD-MM-YYYY");
            const isblocked = list?.includes(formattedDate);
            if (isblocked) {
              return {
                disabled: true,
                style: {
                  backgroundColor: "#ccc",
                  color: "#fff"
                },
                onClick: () => toast.info("This date is unavailable")
              };
            }
          }}
          value={dates}
          rangeHover
          format="DD/MM/YYYY"
        />
        <div className="text-end">
          <button
            style={{
              backgroundColor: "transparent",
              border: "1px solid transparent",
              textDecoration: "underline",
              textTransform: "capitalize"
            }}
            onClick={() => {
              const currentParams = new URLSearchParams(searchParams);
              currentParams.delete("from");
              currentParams.delete("to");
              window.history.replaceState(
                { path: `?${  currentParams.toString()}` },
                "",
                `?${  currentParams.toString()}`
              );
              setDates([]);
            }}
          >
            {" "}
            {i18?.BOOKINGPAGE?.CLEARDATES || "Clear Dates"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CalendarSection;
