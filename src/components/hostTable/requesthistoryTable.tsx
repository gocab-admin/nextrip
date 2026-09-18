import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { format } from "date-fns";
import { DateObject } from "react-multi-date-picker";
import { usePageContext } from "@/components/Providers/PageContext";
import { getApiMethod, postApiMethod } from "@/services/global";
import Novalue from "@/components/novalue";
import CustomSearchField from "@/components/customSearchBar";
import CustomModal from "@/components/modal";
import Textarea from "@/components/textArea";
import { addAlert } from "@/redux/slice/AlertSlice";
import { dispatch } from "@/redux/store";
import APICONSTANT from "@/services/config";
import TableSkeleton from "@/components/tableskeleton";
import {
  StyledTableCell,
  StyledTableRow,
} from "@/components/styledComponent/styledcomp";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";

import "../header.scss";
import styles from "../table.module.scss";
import { currencyRate, currencyRound } from "@/Utils/currencyRate";

export default function RequestHistoryTable() {
  const { i18, currency, settings } = usePageContext();
  const [data, setData] = useState({
    total: 0,
    ApprovevalData: [],
  });
  const [value, setValue] = useState("booked");
  const [cancellationPolicy, setCancellationPolicy] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const handleSearch = (event: any) => {
    const { value } = event.target;
    setSearchValue(value);
    setPage(1);
  };
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const fetchData = async () => {
    try {
      const response = await getApiMethod(
        `${APICONSTANT.bookingApproval}?_page=${page}&_limit=${rowsPerPage}&search=${searchValue}&bookingStatus=${value}`
      );
      if (response.statusCode === 200) {
        setIsLoading(false);
        setData({
          ApprovevalData: response.data.bookingApprovalHistory,
          total: response.data.totalCount ? response.data.totalCount : 0,
        });
        const obj: any = {};
        response.data.cancellationPolicy.forEach((item: any) => {
          obj[item.id] = item;
        });
        obj[0] = obj[3] || {};
        setCancellationPolicy(obj);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchValue, page, rowsPerPage, value]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [value]);

  const handleConfirm = (id: any) => {
    setConfirmId(id);
    setOpen(true);
  };
  const handleCancel = (id: any) => {
    setCancelId(id);
    setOpenCancel(true);
  };
  const handleCheckOut = async (id: any) => {
    try {
      const response = await postApiMethod(`${APICONSTANT.listComplete}/${id}`);
      if (response.statusCode === 200) {
        fetchData();
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
  const handleConfirmAPI = async () => {
    if (confirmId) {
      try {
        const response = await postApiMethod(
          `${APICONSTANT.confirmBooking}/${confirmId}`
        );

        if (response.statusCode === 200) {
          setOpen(false);
          fetchData();
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
    }
  };

  const handleCancelAPI = async () => {
    if (cancelId) {
      try {
        const data = {
          reason: textareaValue,
          type: "provider",
        };
        const response = await postApiMethod(
          `${APICONSTANT.cancelBooking}/${cancelId}`,
          data
        );
        if (response.statusCode === 200) {
          setOpenCancel(false);
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
  };
  return (
    <>
      {isLoading ? (
        <div>
          <TableSkeleton />
        </div>
      ) : (
        <div className={``}>
          <div className={`${styles.search}`}>
            <CustomSearchField
              id="search"
              type="search"
              label={i18?.RESERVATIONS?.SEARCH || "Search"}
              value={searchValue}
              onChange={handleSearch}
              sx={{ marginLeft: "20px", marginBottom: "40px" }}
            />
            <TabContext value={value}>
              <div className={`${styles.tablist}`}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label={i18?.TRIPS?.BOOKED || "Booked"} value="booked" />
                  <Tab
                    label={i18?.LISTING?.CONFIRMED || "Confirmed"}
                    value="confirmed"
                  />
                </TabList>
              </div>
            </TabContext>
          </div>
          {data.total > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                       <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.BOOKINGID || "Booking No"}</StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        sx={{
                          whiteSpace: "nowrap",
                          fontWeight: "bold",
                          width: "150px",
                          // position: 'sticky',
                          // backgroundColor: '#ffffff !important',
                          // left: 0,
                          // paddingLeft: 10,
                          // zIndex: 1,
                        }}
                        align="left"
                      >
                        {i18?.TRIPS?.PROPERTYNAME || "Property name"}
                      </StyledTableCell>

                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        Status
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.TRIPS?.BOOKEDDATES || "Booked dates"}

                        {/* <div className={`${styles.flexdata}`}>
                            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', fontWeight: 'normal' }}>
                              Start Date
                            </Typography>
                            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', fontWeight: 'normal' }}>
                              End Date
                            </Typography>
                            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', fontWeight: 'normal' }}>
                              End time
                            </Typography>
                          </div> */}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.TRIPS?.GUESTNAME || "Guest Name"}
                      </StyledTableCell>
                      {/* <StyledTableCell className="pendingbook-head" align="center">

                        {i18?.ROOMPAGE?.GUESTS || "Guests"} */}

                      {/* <div className={`${styles.flexdata}`}>
                            {' '}
                            <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                              Adults
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                              Children
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                              Pets
                            </Typography>
                          </div> */}
                      {/* </StyledTableCell> */}
                      {/* <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', width: '150px' }} align="center">Currency</TableCell> */}
                      {/* <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.TRIPS?.FAREAMOUNT || "Fare amount"}
                      </StyledTableCell> */}
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.BOOKINGPAGE?.PAYMENTMODE || "Payment mode"}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.TRIPS?.PAIDAMOUNT || "Paid amount"}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.TRIPS?.PAIDDATE || "Paid date"}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.RESERVATIONS?.HOSTAMOUNT || "Host amount"}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.RESERVATIONS?.CHECKING || "Checking"}
                      </StyledTableCell>

                      {/* <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', width: '150px' }} align="center">  cancellationPolicyId</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.ApprovevalData.map((row: any) => {
                      const correctedDateFormat =
                        settings.hiddenSettings.dateFormat || "YYYY/MM/DD";
                      const startDate = new DateObject({
                        date: new Date(row?.bookingdata?.bookedDates?.start),
                      }).toUTC();
                      let formattedStartDate =
                        startDate.format(correctedDateFormat);

                      if (row?.bookingdata?.bookedHours?.hours > 0) {
                        formattedStartDate +=
                          " " + startDate.format(settings.hiddenSettings.timeFormat || "h A");
                      }

                      const endDate = new DateObject({
                        date: new Date(row?.bookingdata?.bookedDates?.end),
                      }).toUTC();

                      let formattedEndDate =
                        endDate.format(correctedDateFormat);

                      if (row?.bookingdata?.bookedHours?.hours > 0) {
                        formattedEndDate +=
                          " " + endDate.format(settings.hiddenSettings.timeFormat || "h A");
                      }

                      const BookedDateCreate = new DateObject({
                        date: new Date(row?.bookingdata?.createdAt),
                      })
                        .toUTC()
                        .format(correctedDateFormat);

                      const formattedPaidDate = new DateObject({
                        date: new Date(row?.bookingdata?.paidDate),
                      })
                        .toUTC()
                        .format(settings.hiddenSettings.dateFormat || "YYYY/MM/DD");

                      return (
                        <StyledTableRow
                          key={row.bookingdata._id}
                          // hover
                        >
                           <TableCell align="left">{row?.bookingdata?.bookingNo}</TableCell>

                          <TableCell
                            sx={{
                              paddingLeft: 2,
                              // position: 'sticky',
                              // left: '0',
                              // backgroundColor: '#ffffff',
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                            align="left"
                          >
                            {" "}
                            {row?.propertyName}
                            {/* <Link className="text-blue-500" href={`/detail/${row.listingId}`}>{row?.propertyName}</Link> */}
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                            align="center"
                          >
                            <div className="d-flex align-items-center gap-2">
                              <div>
                                {" "}
                                <BeenhereOutlinedIcon
                                  sx={{ fontSize: "21px", color: "green" }}
                                />
                              </div>
                              <div className="grid">
                                {" "}
                                <Typography sx={{ fontSize: "15px" }}>
                                  {row?.bookingdata?.status}
                                </Typography>{" "}
                                <Typography
                                  sx={{ fontSize: "15px", color: "#717171" }}
                                >
                                  {" "}
                                  {BookedDateCreate}
                                </Typography>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            <div className={`${styles.flexdata}`}>
                              {" "}
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: "normal" }}
                              >
                                {`${formattedStartDate} `} --{" "}
                                {`  ${formattedEndDate} `}
                              </Typography>
                              <div className={`${styles.flexdata2}`}>
                                {row?.bookingdata?.bookedHours?.hours !== 0 &&
                                  row?.bookingdata?.bookedHours?.nights !==
                                    0 && (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: "normal",
                                        color: "#717171",
                                      }}
                                    >
                                      {row?.bookingdata?.bookedHours?.nights}
                                      {""} {i18?.TRIPS?.NIGHTS || "Nights"}{" "}
                                      {row?.bookingdata?.bookedHours?.hours}
                                      {""} {i18?.TRIPS?.HOURS || "Hours"}
                                    </Typography>
                                  )}

                                {row?.bookingdata?.bookedHours?.nights === 0 &&
                                  row?.bookingdata?.bookedHours?.hours !==
                                    0 && (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: "normal",
                                        color: "#717171",
                                      }}
                                    >
                                      {row?.bookingdata?.bookedHours?.hours}
                                      {""} {i18?.TRIPS?.HOURS || "Hours"}
                                    </Typography>
                                  )}

                                {row?.bookingdata?.bookedHours?.nights !== 0 &&
                                  row?.bookingdata?.bookedHours?.hours ===
                                    0 && (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: "normal",
                                        color: "#717171",
                                      }}
                                    >
                                      {row?.bookingdata?.bookedHours?.nights}
                                      {""} {i18?.TRIPS?.NIGHTS || "Nights"}
                                    </Typography>
                                  )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: "nowrap", width: "150px" }}
                            align="center"
                          >
                            {(row?.userFirstname &&
                              row?.userlastname &&
                              `${row?.userFirstname} ${row?.userlastname}`) ||
                              "--"}
                          </TableCell>
                          {/* <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }} align="center">
                              {parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children)} Guest{parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children) !== 1 ? 's' : ''}

                              {row?.bookingdata?.pets >= 1 ? (
                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                                  {row?.bookingdata?.pets} {''} Pet{row?.bookingdata?.pets !== 1 ? 's' : ''}
                                </Typography>
                              ) : null}
                            </TableCell> */}

                          {/* <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.currencySymbol}{" "}
                            {currencyRound(row?.bookingdata?.fareAmount)}
                            {currencyRate(row?.bookingdata?.fareAmount, currency.exchange_rate, true)}
                          </TableCell> */}
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode}
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode === "cash"
                              ? "--"
                              : `${
                                  row?.bookingdata?.currencySymbol || ""
                                } ${currencyRound(
                                  row?.bookingdata?.paidAmount
                                )}`}
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode === "cash"
                              ? "--"
                              : formattedPaidDate}
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.currencySymbol}{" "}
                            {currencyRound(row?.bookingdata?.hostAmount)}
                            {/* {currencyRate(row?.bookingdata?.hostAmount, currency?.exchange_rate, true)} */}
                          </TableCell>
                          {value === "booked" ? (
                            <TableCell align="center">
                              <div className={`${styles.btn2}`}>
                                <Button
                                  onClick={() =>
                                    handleConfirm(row.bookingdata._id)
                                  }
                                  variant="contained"
                                  color="success"
                                >
                                  {i18?.RESERVATIONS?.CONFIRM || "Confirm"}
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleCancel(row.bookingdata._id)
                                  }
                                  variant="contained"
                                  color="error"
                                >
                                  {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                                </Button>
                              </div>
                            </TableCell>
                          ) : (
                            <TableCell align="center">
                              <div className="d-flex gap-3">
                                <button
                                  onClick={() =>
                                    handleCancel(row.bookingdata._id)
                                  }
                                  className={`${styles.checkout}`}
                                >
                                  <span>
                                    {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                                  </span>
                                </button>
                                {/* disabled={!(new Date() >= startDate && new Date() <= endDate)} */}
                                <button
                                  onClick={() =>
                                    handleCheckOut(row.bookingdata._id)
                                  }
                                  className={`${styles.checkout}`}
                                >
                                  <span>
                                    {i18?.HEADER?.CHECKOUT || "Checkout"}
                                  </span>
                                </button>
                              </div>
                            </TableCell>
                          )}

                          {/* <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">
                  {row?.bookingdata?.paymentMode === 'cash'
                    ? '--'
                    : cancellationPolicy[row?.cancellationPolicyId]?.title || 'invalid cancellation'}
                </TableCell> */}
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={`${styles.pagination}`}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={data.total || 0}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </>
          ) : (
            <Novalue />
          )}
          <CustomModal
            // sx={{ width: "max-content" }}
            open={open}
            onClose={handleClose}
          >
            <div className={`${styles.modal} p-3`}>
              <h5>
                {i18?.RESERVATIONS?.DOYOUWANTTO ||
                  "Do you want to confirm this booking?"}
              </h5>
            </div>
            <div className={`${styles.modalBtn} border-top p-3`}>
              <DynamicButtonComponent
                variant="outlined"
                onClick={handleClose}
                text={i18?.BUTTONS?.NO || "No"}
              />
              <DynamicButtonComponent
                variant="outlined"
                onClick={handleConfirmAPI}
                text={i18?.BUTTONS?.YES || "Yes"}
              />
            </div>
          </CustomModal>

          <CustomModal
            open={openCancel}
            onClose={handleCloseCancel}
            title={
              i18?.BOOKINGPAGE?.CANCELBOOKING ||
              "Give a reason to cancel this booking"
            }
          >
            <div className={`${styles.modal} p-3`}>
              <InputLabel>{i18?.TRIPS?.REASON || "Reason"}:</InputLabel>
              <Textarea
                className={`${styles.Textarea}`}
                onChange={handleTextareaChange}
              />
            </div>
            <div
              className={`${styles.modalBtn} justify-content-end border-top p-3`}
            >
              <DynamicButtonComponent
                variant="outlined"
                onClick={handleCancelAPI}
                text={i18?.TRIPS?.OK || "Ok"}
                disabled={!textareaValue}
              />
            </div>
          </CustomModal>
        </div>
      )}
    </>
  );
}
