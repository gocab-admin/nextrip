import React, { useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateObject } from "react-multi-date-picker";

function WeeklyFullCalendar({dates, setDates}: any) {
    const [events, setEvents] = useState<any>([]);
    const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

    const handleEventAdd = () => {
        // const newEvent = {
        //     title: eventDetails.title,
        //     start: selectedRange.start,
        //     end: selectedRange.end,
        //     extendedProps: {
        //       description: eventDetails.description,
        //     },
        //   };
        setEvents((prev:any)=>([
          ...prev
        ]));
      };

      
      const handleClick = (selectionInfo:any) => {
        selectionInfo.jsEvent.preventDefault();
        selectionInfo.jsEvent.stopPropagation();
        // debugger;
      };
      const handleClear = (selectionInfo:any) => {
        debugger;
      };
      const handleSelect = (selectionInfo:any) => {
        debugger;
        setSelectedRange(selectionInfo);
      };
  return (<FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="timeGridWeek"
    slotDuration="01:00:00"
    editable={false}
    // slotLabelInterval="01:00:00" 
    validRange={{
      start: new Date(),
      // end: '2024-06-01'
    }}
    // headerToolbar={{
    //   left: "title",
    //   end: "ical today prev,next",
    // }}
    selectOverlap={false}
    selectable
    timeZone='UTC'
    dateClick={handleClick}
    // select={handleSelect}
    unselect={handleClear}
    // eventChange={handleEventChange}
    events={[]}
    // eventClick={handleEventClick}
    eventResizableFromStart
    // eventResize={handleEventResize}
  />)
}

export default WeeklyFullCalendar
