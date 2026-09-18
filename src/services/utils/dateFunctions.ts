// export function formatDate(date: Date) {
//   const day = date.getUTCDate().toString().padStart(2, '0');
//   const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-indexed
//   const year = date.getUTCFullYear().toString();
//   return `${day}-${month}-${year}`;
//   }
import dayjs from "dayjs";

  export const getDatesBetween = (startDate: Date, endDate: Date): string[] => {
    const dates: string[] = [];

    while (startDate <= endDate) {
      // const formattedDate = formatDate(startDate);
      const formattedDate = dayjs(startDate).format('DD-MM-YYYY');
      dates.push(formattedDate);
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  }
