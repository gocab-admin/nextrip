import React, { useEffect, useMemo, useState } from 'react'
import styles from "src/components/BookingBox/booking.module.scss";
import dayjs from 'dayjs';
import { getApiMethod } from '@/services/global';
import APICONSTANT from '@/services/apiConstant';

const generateDates = () => {
  const dates = [];
  const today = dayjs();
  for (let i = 0; i <= 13; i++) {
    dates.push(today.add(i, 'day').format('YYYY-MM-DD'));
  }
  return dates;
};
const formatDate = (dateString: any) => {
  return dayjs(dateString).format('MMM D');
};

function Bookitcalndar({ props }: any) {
  const [data, setData] = useState<any>()
  const dateArray = generateDates();

  const getapi = async () => {
    try {
      const resp: any = await getApiMethod(`${APICONSTANT.bookingCount}${props}`);
      if (resp.statusCode === 200) {
        setData(resp?.data)
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    getapi()
  }, [])

  const matchingObjects = useMemo(()=>{
   return data && data.filter((entry:any) => dateArray.includes(entry.date))
  },[data])

console.log('matchingObjects',matchingObjects);
  console.log('dateArray',dateArray)
  return (
    <div className={`${styles.stickysidebar}`}>
      {
        Array.isArray(matchingObjects) && (
          <div className={`${styles.bookitContainer}`}>
            <div className={`${styles.column}`}>
              {matchingObjects.slice(0, 7).map((item: any, index: any) => (
                <div key={index} className={`${item?.blocked ? styles.bookit2 : styles.bookit}`}>
                 <p>{formatDate(item?.date)}</p>
                  <p>{item?.count} {item?.count > 1 ? 'appts' : 'appt'} </p>
                </div>
              ))}
            </div>
            <div className={`${styles.column}`}>
              {matchingObjects.slice(7).map((item: any, index: any) => (
                <div key={index} className={`${item?.blocked ? styles.bookit2 : styles.bookit}`}>
                  <p>{formatDate(item?.date)}</p>
                  <p>{item?.count} {item?.count > 1 ? 'appts' : 'appt'} </p>
                </div>
              ))}
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Bookitcalndar