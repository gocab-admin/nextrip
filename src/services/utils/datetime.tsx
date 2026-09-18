import { DateObject } from 'react-multi-date-picker'
// export const formatDateTime = (date: Date) => {
    
//     if (date) {
//         const year = date?.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//         const day = String(date.getDate()).padStart(2, '0');
//         const hours = String(date.getHours()).padStart(2, '0');
//         // const minutes = String(date.getMinutes()).padStart(2, '0');
//         // const seconds = String(date.getSeconds()).padStart(2, '0');

//         return `${year}-${month}-${day}T${hours}:00:00.000Z`;
//     }
// };

// export const getDateObj = (dateStr: Date) => {
    
//     if (dateStr) {
//         const date:any = new Date(dateStr);
//         const year = date?.getUTCFullYear();
//         const month = date.getUTCMonth();
//         const day = date.getUTCDate();
//         const hour = date.getUTCHours();
//         // const minutes = String(date.getMinutes()).padStart(2, '0');
//         // const seconds = String(date.getSeconds()).padStart(2, '0');
//         return new DateObject({year, month, day, hour, minute: 0, second: 0});
//     }
// };

export const formatDate = (date: Date) => {
    
    if (date) {
        const year = date?.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        // const hours = String(date.getHours()).padStart(2, '0');
        // const minutes = String(date.getMinutes()).padStart(2, '0');
        // const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }
};

export const formatDateTime = (date: Date) => {
    
    if (date) {

        return date?.toISOString();
        // return date
    }
};

export const getDateObj = (dateStr: Date) => {
    
    if (dateStr) {
        const date:any = new Date(dateStr);
        const year = date?.getFullYear();
        const month = date.getMonth()+1;
        const day = date.getDate();
        const hour = date.getHours();
        // const minutes = String(date.getMinutes()).padStart(2, '0');
        // const seconds = String(date.getSeconds()).padStart(2, '0');
        return new DateObject({year, month, day, hour, minute: 0, second: 0});
    }
};

export const Time = (date: Date) => {
    const Meridiem = (hour:any) => {
        if (hour < 12) {
            return 'AM';
        } else {
            return 'PM';
        }
    };
    
    if (date) {
        let hours = date.getHours()
        const value = Meridiem(hours)
        hours = hours % 12 || 12;
        return `${hours} ${value}`;
    }
};
