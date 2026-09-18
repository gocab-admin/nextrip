import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Calendar } from "react-multi-date-picker";
import { useSelector } from "react-redux";

import { usePageContext } from "@/components/Providers/PageContext";
import { fetchBookingData } from "@/redux/slice/user/BookingSlice";
import { dispatch } from "@/redux/store";
import { formatDateTime } from '@/services/utils/datetime';
import { setModal } from "@/redux/slice/modalSlice";

const formatDate = (date: any) => {
    const startDate = new Date(date)
    const year = startDate.getFullYear()
    const month = String(startDate.getMonth() + 1).padStart(2, '0')
    const day = String(startDate.getDate()).padStart(2, '0')
    const formattedStartDate = `${year}-${month}-${day}`
    return formattedStartDate
  }

export default function DateModal({ data }: any) {
    const { i18 } = usePageContext();
    const { estimation } = useSelector((state: any) => state.bookingEstimation)
    const HourlyBooking = estimation?.bookingType === 'Hour' ? true : false
    const [date, setDate] = useState<any>([]);
    const [time, setTime] = useState<any>([])
    const Params: any = useParams()
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const getId = Params.property.split("_").pop()
    useEffect(() => {
        if (data?.dates[0] && data?.dates[1]) {
            setDate([data?.dates[0], data?.dates[1]])
        }
        else if (data?.dates[0]) {
            setDate([data?.dates[0], null])
        }
        else if (data?.dates[1]) {
            setDate([null, data?.dates[1]])
        }

    }, [data])

      const handleCloseDate = () => {
        dispatch(setModal('' as never))
      }

      const handleDateChange = () => {

       const searchId = currentParams.get("id")
        const data: any = {
          bookingType: HourlyBooking ? 'Hour' : 'Day',
          adults: estimation.Adult,
          children: estimation.Children,
          pets: estimation.Pets,
          startDate: HourlyBooking ? formatDateTime(time[0]?.toDate()) || formatDate(estimation.startDate) : formatDateTime(date[0]?.toDate()) || formatDate(estimation.startDate),
          endDate: HourlyBooking ? formatDateTime(time[1]?.toDate()) || formatDate(estimation.endDate) : formatDateTime(date[1]?.toDate()) || formatDate(estimation.endDate),
          id: searchId===null ? getId : searchId 
        }
        dispatch(fetchBookingData(data.id, data))
        const queryString = Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join('&');
        window.history.replaceState({ path: `?${  queryString}` }, '', `?${  queryString}`);
        dispatch(setModal('' as never))
    }

    return (
        <>
            <div className={`calendar edit-date p-3`}>

                <Calendar
                    value={date}
                    onChange={setDate}
                    minDate={data?.getMinDate}
                    maxDate={data?.getMaxDate}
                    mapDays={({ date }: any) => {
                        const formattedDate = date.format('DD-MM-YYYY');
                        const isblocked = data?.list.includes(formattedDate);
                        if (isblocked) {
                            return {
                                disabled: true,
                                style: { backgroundColor: '#ccc', color: "#fff" }
                            };
                        }
                    }}
                    numberOfMonths={1}
                    className='rmdpprime'
                    range
                    rangeHover
                    format="DD/MM/YYYY"
                />

            </div>
            <div className={`modal_button border-top`}>
                <button onClick={handleCloseDate}className={`button2`}>
                    {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                </button>
                <button className={`btn`} onClick={handleDateChange}>{i18?.ROOMPAGE?.SAVE || "Save"}</button>
            </div>
        </>
    )
}
