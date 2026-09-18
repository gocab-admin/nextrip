"use client";
import React, { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Popover from "@mui/material/Popover";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormControl, Radio, RadioGroup } from "@mui/material";
import { useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Skeleton } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
// import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { APIURLS } from "@/services/config";
import {
  saveBookingDates,
  setDateValue,
  fetchCalendar,
} from "@/redux/slice/DateSlice";
import {
  deleteApiMethod,
  putApiMethod,
  postApiMethod,
} from "@/services/global";
import { fetchProviderListingData } from "@/redux/slice/host/providerlistingsSlice";
import {
  fetchListingCalendarData,
  updateListingCalendarData,
} from "@/redux/slice/host/hostlistingCalendar";
import { useAppDispatch } from "@/redux/hooks";
import CustomModal from "@/components/modal";
import Header from "@/components/header";
import Footer from "@/components/footer";
import isAuth from "@/components/isAuth";
import { addAlert } from "@/redux/slice/AlertSlice";
import { usePageContext } from "@/components/Providers/PageContext";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import ImageComponent from "@/components/ImageComponent";
import { handleImageError } from "@/services/utils/utils";
import TimePickerMui from "@/components/TimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import styles from "./page.module.scss";
import ScheduleForm from "./ScheduleForm";

const Calendar = () => {
  const dispatch = useAppDispatch();
  const { i18, settings, responsiveView } = usePageContext();
  const dateValue = useSelector((state: any) => state?.savedDate);
  const { calendarData } = useSelector((state: any) => state?.hostCalendarList);
  const loading = useSelector((state: any) => state?.listdata?.loading);
  const [events, setEvents] = useState([]);
  const [value, setValue] = React.useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  // const [argdate, setArgDate] = useState<any>(new Date());

  const blockedDateSelect = useMemo(() => {
    const arg = dateValue.dateValue;
    const selectedStartDate: any = arg?.selectedStartDate
      ? dayjs(arg.selectedStartDate)
          .utc()
          .format(settings.dateFormat || "YYYY/MM/DD")
      : null;

    let selectedEndDate: any = null;
    if (arg?.selectedEndDate) {
      selectedEndDate = dayjs(arg.selectedEndDate)
        .subtract(1, "day")
        .utc()
        .format(settings.dateFormat || "YYYY/MM/DD");
    }
    return {
      selectedStartDate,
      selectedEndDate,
    };
  }, [dateValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [data, setData] = useState<any>({
    total: 0,
    listingdata: [],
  });

  // const eventID=dateValue.BlockedDates?.data?.dates?._id
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      schedule: [
        {
          day: "Sunday",
          openingTime: "12:00 PM",
          closingTime: "11:00 AM",
        },
        {
          day: "Monday",
          openingTime: "12:00 PM",
          closingTime: "11:00 AM",
        },
        {
          day: "Tuesday",
          openingTime: "12:00 PM",
          closingTime: "11:00 AM",
        },
        {
          day: "Wednesday",
          openingTime: "12:00 PM",
          closingTime: "11:00 AM",
        },
        {
          day: "Thursday",
          openingTime: "12:00 PM",
          closingTime: "11:00 AM",
        },
        {
          day: "Friday",
          openingTime: "12:00 PM",
          closingTime: "11:00 AM",
        },
        {
          day: "Saturday",
          openingTime: "12:00 PM",
          closingTime: "11:00 AM",
        },
      ],
    },
    // resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const providerlisting = async () => {
    try {
      const res = await dispatch(fetchProviderListingData({}, "approve"));
      if (res.statusCode === 200) {
        setValue(res.data.providerListings[0]._id);
        setData({
          listingdata: res.data.providerListings,
          total: res.data.total,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCalendarDetails = async () => {
    try {
      const res = await dispatch(fetchListingCalendarData(value));
    } catch (err) {}
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleChangeDate = (arg: any) => {
    // setEventID("");
    debugger;
    dispatch(
      setDateValue({
        ...arg,
        selectedStartDate: arg.start,
        selectedEndDate: arg.end,
      })
    );
  };
  const handleClear = () => {
    dispatch(setDateValue(null));
    // setBlockedDate([]);
  };

  //     const formatDate = (dateString?: string) => {
  //         if (!dateString) return '';

  //         const [year, month, day] = dateString.split('-');
  //         return `${day}/${month}/${year}`;
  //     };

  //     const formatDateTo = (dateString: string | undefined | null) => {
  //     if (!dateString) {
  //         return '';
  //     }

  //     const date = new Date(dateString);
  //     date.setDate(date.getDate() - 1); // Subtract one day

  //     const day = String(date.getDate()).padStart(2, '0');
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const year = date.getFullYear();

  //     return `${day}/${month}/${year}`;
  // };

  const handleEventChange = (arg: any) => {
    const eventid: any = arg.event._def?.publicId;
    const startDate: any = arg?.event?._instance?.range?.start.toISOString();
    const endDate: any = arg?.event?._instance?.range?.end.toISOString();

    const payload = {
      dateId: eventid,
      startDate,
      endDate,
      progressPercentage: 100,
    };
  };
  const selectedItem = useMemo(
    () => data.listingdata.find((item: any) => item._id === value),
    [value]
  );

  const handleApply = async () => {
    try {
      let res;

      if (!eventId) {
        res = await dispatch(
          saveBookingDates(
            dayjs(dateValue.dateValue.selectedStartDate)
              .utc()
              .format("YYYY-MM-DDT00:00:00.00Z"),
            dayjs(dateValue.dateValue.selectedEndDate)
              .utc()
              .subtract(1, "day")
              .format("YYYY-MM-DDT23:59:59.999Z"),
            selectedItem._id
          )
        );
      } else {
        const data = {
          startDate: dayjs(dateValue.dateValue.selectedStartDate)
            .utc()
            .format("YYYY-MM-DDT00:00:00.00Z"),
          endDate: dayjs(dateValue.dateValue.selectedEndDate)
            .utc()
            .format("YYYY-MM-DDT00:00:00.00Z"),
          dateId: eventId,
        };
        res = await putApiMethod(`listing/blockDates/${value}`, data);
      }

      if (res.statusCode === 200) {
        fetchBookedDates();
        setEventID("");
        handleClose();
        dispatch(
          addAlert({
            isOpen: true,
            message: res.message,
            type: "success",
            severity: "success",
          })
        );
      } else {
        dispatch(
          addAlert({
            isOpen: true,
            message: res?.response?.data?.message,
            type: "error",
            severity: "error",
          })
        );
      }
      handleClear();
    } catch (err: any) {
      dispatch(
        addAlert({
          isOpen: true,
          message: err?.response?.data?.message || "Listing not Approved",
          type: "error",
          severity: "error",
        })
      );
      console.error(err);
    }
  };

  const fetchBookedDates = async () => {
    try {
      // value
      const response = await dispatch(fetchCalendar());
      if (response.statusCode === 200 && Array.isArray(response.data)) {
        setEvents(response.data);
        handleClose();
      }
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    }
  };

  const initialEvents: any = [];

  const mappedEvents = useMemo(() => {
    return events?.map((block: any) => {
      // const startDate = new Date(block.start).toISOString().split("T")[0];
      const start = dayjs(block.start).utc();
      const endDate = dayjs(block.end).utc();
      const eventId = block._id;
      // const { desc } = block;
      const formattedStartDate = start.format("YYYY-MM-DDTHH:mm:ss.00Z");
      const formattedEndDate = endDate.format("YYYY-MM-DDTHH:mm:ss.00Z");
      const type = block.categories[0].name;

      return {
        id: eventId,
        title:
          type === "Booking"
            ? i18?.BOOKINGPAGE?.BOOKEDDATES || "Booked dates"
            : i18?.BOOKINGPAGE?.BLOCKEDDATES || "Blocked dates",
        start: start.toDate(),
        end: endDate.toDate(),
        BookStart: formattedStartDate,
        BookEnd: formattedEndDate,
        summary: block.summary,
        type,
        // allDay: true,
        backgroundColor: type === "Booking" ? "#3788d8" : "#f87171",
        textColor: "#ffffff",
        borderColor: "transparent",
        description: block.description,
      };
    });
  }, [events]);
  // const allEvents = blockedEvents.flat();
  const [openModal, setopen] = useState(false);
  const [eventId, setEventID] = useState("");

  const handleCloseModal = () => {
    setopen(false);
  };
  const handleEventClick = (arg: any) => {
    setopen(true);
    setEventID(arg.event._def?.publicId);
    setSelectedEvent(arg.event);

    // const eventid: any = arg.event._def?.publicId

    // const confirmDelete = window.confirm('Are you sure you want to delete this event?')
    // if (confirmDelete) {
    //     const data = {
    //         dateId: eventid,
    //     }
    //     const response = deleteApiMethod(`listing/blockedDates/${value}`, data)

    // }
  };
  const handleBlockedDelete = async () => {
    const deletedates = {
      dateId: eventId /* || eventID */,
    };
    try {
      const response = await deleteApiMethod(`listing/blockDates/${value}`, {
        data: deletedates,
      });
      if (response.statusCode === 200) {
        setopen(false);
        fetchBookedDates();
        setEventID("");
        dispatch(setDateValue(null));
        dispatch(
          addAlert({
            isOpen: true,
            message: response.message,
            type: "success",
            severity: "success",
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockedEdit = (arg: any) => {
    setopen(false);
    dispatch(
      addAlert({
        isOpen: true,
        message: "Blocked dates can be edited now",
        type: "success",
        severity: "success",
      })
    );
  };
  const handleEventResize = (arg: any) => {
    const { event, start, end } = arg;
  };

  const onSubmit = async (data: any) => {
    // const datas = {
    //     propertyCategory: calendarData?.propertyCategory,
    //     propertyType:calendarData?.propertyType,
    //     adult: "1",
    //     schedule:data.schedule,
    // }
    try {
      const res = await dispatch(updateListingCalendarData(value, data));
    } catch (err) {}
  };

  useEffect(() => {
    providerlisting();
  }, []);

  useEffect(() => {
    if (value) {
      fetchBookedDates();
      getCalendarDetails();
    }
  }, [value]);

  useEffect(() => {
    reset({ schedule: calendarData?.schedule });
  }, [calendarData]);

  return (
    <>
      {" "}
      <div>
        <Header
          page="hide"
          center={
            responsiveView === "sm" || responsiveView === "xs"
              ? "center"
              : "inbox"
          }
          type="provider"
        />
      </div>
      <div className={`${styles.listing}`}>
        <div className={`${styles.calendar}`}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            timeZone="UTC"
            initialView="dayGridMonth"
            validRange={{
              start: new Date(),
              // end: '2024-06-01'
            }}
            customButtons={{
              ical: {
                text: "Ical Integration",
                click: async function () {
                  const res = await postApiMethod(`calendar/secretCode`);
                  if (res.statusCode === 200) {
                    const userid = localStorage.getItem("appUserId");
                    const icalUrl = `webcal://${APIURLS.baseUrl?.replace(
                      /^https?:\/\//,
                      ""
                    )}module/calendar/generate/${userid}/${res.data}`;
                    navigator.clipboard.writeText(icalUrl).then(() => {
                      toast.info("Ical Link is copied");
                    });
                    window.location.href = icalUrl;
                  }
                },
              },
            }}
            headerToolbar={{
              left: "title",
              end: "ical today prev,next",
            }}
            selectable
            editable
            select={handleChangeDate}
            eventChange={handleEventChange}
            events={mappedEvents}
            eventClick={handleEventClick}
            eventResizableFromStart
            eventResize={handleEventResize}
          />
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className={`${styles.host}`}>
            <div className={`${styles.pricing}`}>
              {loading ? (
                <div className={`${styles.dropdown}`}>
                  <div className={`${styles.box}`}>
                    <div
                      onClick={handleClick}
                      className={`${styles.selectBox}`}
                    >
                      <Skeleton
                        variant="circular"
                        width={35}
                        height={35}
                        className={`${styles.img}`}
                      />
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1rem", margin: "auto" }}
                        height={25}
                        width={150}
                      />
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1rem", margin: "auto" }}
                        height={25}
                        width={15}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${styles.dropdown}`}>
                  <div className={`${styles.box}`}>
                    <div
                      onClick={handleClick}
                      className={`${styles.selectBox}`}
                    >
                      <ImageComponent
                        width={35}
                        height={35}
                        src={selectedItem?.coverImage}
                        alt="pro"
                        onError={handleImageError}
                        className={`${styles.img}`}
                      />
                      <p>{selectedItem?.propertyName}</p>
                      <KeyboardArrowDownIcon sx={{ margin: "auto" }} />
                    </div>
                  </div>

                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    {data.listingdata.map((option: any) => (
                      <>
                        <div className={`${styles.ContentFlex}`}>
                          <div className={`${styles.content}`} key={option._id}>
                            {option?.coverImage?.[0] ? (
                              <ImageComponent
                                width={60}
                                height={40}
                                src={option.coverImage}
                                alt="pro"
                                className={`${styles.img}`}
                                onError={handleImageError}
                              />
                            ) : (
                              // Fallback in case coverImage is undefined or empty
                              <ImageComponent
                                width={60}
                                height={40}
                                src="/images/errorImage.webp"
                                alt="default"
                                className={`${styles.img}`}
                              />
                            )}
                            <p className=" mb-0 ">{option.propertyName}</p>
                          </div>
                          <div>
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={value}
                                onChange={handleChange}
                              >
                                <FormControlLabel
                                  value={option._id}
                                  checked={value === option._id}
                                  onChange={(e: any) => {
                                    setValue(e.target.value);
                                  }}
                                  control={
                                    <Radio
                                      sx={{
                                        mt: 2,
                                        color: "black",
                                        marginRight: "8px",
                                        "&.Mui-checked": {
                                          color: "black",
                                        },
                                      }}
                                    />
                                  }
                                  label=""
                                  className="mr-0"
                                />
                              </RadioGroup>
                            </FormControl>
                          </div>
                        </div>
                      </>
                    ))}
                    <div className={`${styles.footer}`}>
                      <button
                        onClick={handleClose}
                        className={`${styles.btn1}`}
                      >
                        {i18?.ROOMPAGE?.CLOSE || "Close"}
                      </button>
                      {/* <DynamicButtonComponent variant="outlined" onClick={handleApply} text={i18?.LISTING?.APPLY || "Apply"} /> */}
                    </div>
                  </Popover>
                </div>
              )}
            </div>
            <div className={`${styles.availability}`}>
              {dateValue?.dateValue !== null &&
                dateValue?.dateValue !== null && (
                  <>
                    <div className={`${styles.content}`}>
                      <p className={`${styles.head}`}>Event</p>
                      {/* <input className={`${styles.input}`} placeholder="Enter event name" /> */}
                    </div>
                    <div className={`${styles.content}`}>
                      <input
                        className={`${styles.input}`}
                        placeholder="From date"
                        value={blockedDateSelect?.selectedStartDate}
                      />
                    </div>
                    <div className={`${styles.content}`}>
                      <input
                        className={`${styles.input}`}
                        placeholder="To date"
                        value={blockedDateSelect?.selectedEndDate}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        className={`${styles.submit1}`}
                        onClick={() => {
                          handleClear();
                        }}
                      >
                        {i18?.ROOMPAGE?.CLOSE || "Close"}
                      </button>
                      <button
                        className={`${styles.submit1}`}
                        onClick={handleApply}
                      >
                        {i18?.LISTING?.SUBMIT || "Submit"}
                      </button>
                    </div>
                  </>
                )}
              {/* <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`${styles.content}`}>
                  <p className={`${styles.head}`}>Availability</p>
                </div>
                <div className={`${styles.timepicker}`}>
                  <p className={`${styles.day}`}>Sunday</p>
                  <div className={`${styles.timeField}`}>
                    <Controller
                      name={"schedule.0.day"}
                      control={control}
                      render={(field) => (
                        <input type="hidden" {...field} value={"sunday"} />
                      )}
                    />
                    <TimePickerMui
                      name="schedule.0.openingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:00 AM"
                    />
                    <TimePickerMui
                      name="schedule.0.closingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:30 PM"
                    />
                  </div>
                </div>
                <div className={`${styles.timepicker}`}>
                  <p className={`${styles.day}`}>Monday</p>
                  <div className={`${styles.timeField}`}>
                    <Controller
                      name={"schedule.1.day"}
                      control={control}
                      render={(field) => (
                        <input type="hidden" {...field} value={"monday"} />
                      )}
                    />
                    <TimePickerMui
                      name="schedule.1.openingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:00 AM"
                    />
                    <TimePickerMui
                      name="schedule.1.closingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:30 PM"
                    />
                  </div>
                </div>
                <div className={`${styles.timepicker}`}>
                  <p className={`${styles.day}`}>Tuesday</p>
                  <div className={`${styles.timeField}`}>
                    <Controller
                      name={"schedule.2.day"}
                      control={control}
                      render={(field) => (
                        <input type="hidden" {...field} value={"tuesday"} />
                      )}
                    />
                    <TimePickerMui
                      name="schedule.2.openingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:00 AM"
                    />
                    <TimePickerMui
                      name="schedule.2.closingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:30 PM"
                    />
                  </div>
                </div>
                <div className={`${styles.timepicker}`}>
                  <p className={`${styles.day}`}>Wednesday</p>
                  <div className={`${styles.timeField}`}>
                    <Controller
                      name={"schedule.3.day"}
                      control={control}
                      render={(field) => (
                        <input type="hidden" {...field} value={"wednesday"} />
                      )}
                    />
                    <TimePickerMui
                      name="schedule.3.openingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:00 AM"
                    />
                    <TimePickerMui
                      name="schedule.3.closingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:30 PM"
                    />
                  </div>
                </div>
                <div className={`${styles.timepicker}`}>
                  <p className={`${styles.day}`}>Thursday</p>
                  <div className={`${styles.timeField}`}>
                    <Controller
                      name={"schedule.4.day"}
                      control={control}
                      render={(field) => (
                        <input type="hidden" {...field} value={"thursday"} />
                      )}
                    />
                    <TimePickerMui
                      name="schedule.4.openingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:00 AM"
                    />
                    <TimePickerMui
                      name="schedule.4.closingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="9:30 PM"
                    />
                  </div>
                </div>
                <div className={`${styles.timepicker}`}>
                  <p className={`${styles.day}`}>Friday</p>
                  <div className={`${styles.timeField}`}>
                    <Controller
                      name={"schedule.5.day"}
                      control={control}
                      render={(field) => (
                        <input type="hidden" {...field} value={"friday"} />
                      )}
                    />
                    <TimePickerMui
                      name="schedule.5.openingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="08:00 AM"
                    />
                    <TimePickerMui
                      name="schedule.5.closingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="11:59 PM"
                    />
                  </div>
                </div>
                <div className={`${styles.timepicker}`}>
                  <p className={`${styles.day}`}>Saturday</p>
                  <div className={`${styles.timeField}`}>
                    <Controller
                      name={"schedule.6.day"}
                      control={control}
                      render={(field) => (
                        <input type="hidden" {...field} value={"saturday"} />
                      )}
                    />
                    <TimePickerMui
                      name="schedule.6.openingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="08:00 AM"
                    />
                    <TimePickerMui
                      name="schedule.6.closingTime"
                      className="w-[200px]"
                      format="hh:mm A"
                      control={control}
                      defaultValue="11:59 PM"
                    />
                  </div>
                </div>
                <button type="submit" className={`${styles.submit}`}>
                  Submit
                </button>
              </form> */}
              <ScheduleForm value={value} />
            </div>
          </div>
        </LocalizationProvider>
      </div>
      <CustomModal open={openModal} onClose={handleCloseModal}>
        <div className={`${styles.modal} p-3`}>
          <h5 className="text-center">{selectedEvent?.title}</h5>
          <div className={`${styles.body} p-3`}>
            <div className={`${styles.grid1}`}>
              <ImageComponent
                width={200}
                height={200}
                src={selectedItem?.coverImage}
                alt="pro"
                className={`${styles.img}`}
                onError={handleImageError}
              />
              <p>{selectedItem?.propertyName}</p>
            </div>
            <div className={`${styles.grid2}`}>
              <h6>{selectedEvent?.extendedProps?.summary}</h6>
              <div className={`${styles.flex}`}>
                <p>{`${i18?.BOOKINGPAGE?.STARTDATE || "Start date"}:`}</p>
                <span>
                  {dayjs(selectedEvent?.extendedProps?.BookStart)
                    .utc()
                    .format(settings.dateFormat || "YYYY/MM/DD")}
                </span>
              </div>

              <div className={`${styles.flex}`}>
                <p>{`${i18?.BOOKINGPAGE?.ENDDATE || "End date"}:`}</p>
                <span>
                  {dayjs(selectedEvent?.extendedProps?.BookEnd)
                    .utc()
                    .format(settings.dateFormat || "YYYY/MM/DD")}
                </span>
              </div>
            </div>
          </div>
          <p className={styles.desc}>
            {selectedEvent?.extendedProps?.description}
          </p>
        </div>
        <div className={`${styles.footer}`}>
          {selectedEvent?.extendedProps?.type !== "Booking" ? (
            <DynamicButtonComponent
              variant="outlined"
              onClick={handleBlockedEdit}
              text={i18?.BOOKINGPAGE?.EDIT || "Edit"}
            />
          ) : (
            <span>&#160;</span>
          )}
          <DynamicButtonComponent
            variant="outlined"
            onClick={handleBlockedDelete}
            text={i18?.GUESTINBOX?.DELETE || "Delete"}
          />
        </div>
      </CustomModal>
      {/* <AlertComponent notify={notify} setNotify={setNotify} /> */}
      <Footer />
    </>
  );
};
export default isAuth(Calendar);
