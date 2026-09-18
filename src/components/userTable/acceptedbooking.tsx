import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import { TablePagination } from "@mui/material";
import { postApiMethod } from "@/services/global";
import { addAlert } from "@/redux/slice/AlertSlice";
import APICONSTANT from "@/services/config";
import CustomModal from "@/components/modal";
import Textarea from "@/components/textArea";
import { dispatch } from "@/redux/store";
import { getAcceptedBooking } from "@/redux/slice/user/BookingSlice";
import CustomSearchField from "@/components/customSearchBar";
import {
  StyledTableCell,
  StyledTableRow,
} from "@/components/styledComponent/styledcomp";
import TableSkeleton from "@/components/tableskeleton";
import { usePageContext } from "@/components/Providers/PageContext";

import "../header.scss";
import styles from "../table.module.scss";
import { DateObject } from "react-multi-date-picker";

const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const Typography = dynamic(() => import("@mui/material/Typography"), {
  ssr: false,
});
const TableRow = dynamic(() => import("@mui/material/TableRow"), {
  ssr: false,
});
const InputLabel = dynamic(() => import("@mui/material/InputLabel"));
const Novalue = dynamic(() => import("@/components/novalue"), { ssr: false });

export default function AcceptedBookingTable() {
  const { i18, currency, settings } = usePageContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    total: 0,
    AcceptedBookingdata: [],
  });
  const [cancellationPolicy, setCancellationPolicy] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [openCancel, setOpenCancel] = useState(false);
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
  const handleCancel = (id: any) => {
    setCancelId(id);
    setOpenCancel(true);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
  };
  const fetchData = async () => {
    try {
      const acceptedData = await dispatch(
        getAcceptedBooking(page, rowsPerPage, searchValue)
      );
      if (acceptedData.statusCode === 200) {
        setIsLoading(false);
        setData({
          AcceptedBookingdata: acceptedData.data.acceptedBookingHistory,
          total: acceptedData.data.totalCount
            ? acceptedData.data.totalCount
            : 0,
        });
        const obj: any = {};
        acceptedData.data.cancellationPolicy.forEach((item: any) => {
          obj[item.id] = item;
        });
        obj[0] = obj[3] || {};
        setCancellationPolicy(obj);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };
  const handleCancelAPI = async () => {
    if (cancelId) {
      try {
        const data = {
          reason: textareaValue,
          type: "user",
        };
        const response = await postApiMethod(
          `${APICONSTANT.cancelBooking}/${cancelId}`,
          data
        );
        if (response.statusCode === 200) {
          setOpenCancel(false);
          fetchData();
          dispatch(
            addAlert({
              isOpen: true,
              message: "Booking cancelled",
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
  useEffect(() => {
    fetchData();
  }, [searchValue, page, rowsPerPage]);

  return (
    <>
      {isLoading ? (
        <div>
          <TableSkeleton />
        </div>
      ) : (
        <div>
          <div className={`${styles.search}`}>
            <CustomSearchField
              id="search"
              type="search"
              label={`${i18?.HEADER?.SEARCH || "Search"}`}
              value={searchValue}
              onChange={handleSearch}
              sx={{ marginLeft: "20px" }}
            />
          </div>
          {data.total > 0 ? (
            <>
              <div className={`${styles.table}`}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell className="pendingbook-head"align="center">{i18?.TRIPS?.BOOKINGID || "Booking No"}</StyledTableCell>
                        <StyledTableCell
                          className="pendingbook-head"
                          sx={{
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                            width: "150px",
                            // fontSize: 'var(--homepage-header-size)',
                            // color: 'var(--font-color-trips)',
                            // backgroundColor: 'var(--background-color-trips-table)'
                            // paddingLeft: 10,
                          }}
                          align="left"
                        >
                          {i18?.TRIPS?.PROPERTYNAME || "Property name"}
                        </StyledTableCell>

                        <StyledTableCell
                          className="pendingbook-head"
                          align="center"
                        >
                          {i18?.TRIPS?.STATUS || "Status"}
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
                        {/* <StyledTableCell className="pendingbook-head" align="center">

                          {i18?.ROOMPAGE?.GUESTS || "Guests"}

                            <div className={`${styles.flexdata}`}>
                              {' '} */}
                        {/* <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                            Adults
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                            Children
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                            Pets
                          </Typography> */}
                        {/* </div> */}
                        {/* </StyledTableCell> */}
                        <StyledTableCell
                          className="pendingbook-head"
                          align="center"
                        >
                          {i18?.TRIPS?.CURRENCY || "Currency"}
                        </StyledTableCell>
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
                          {i18?.TRIPS?.CANCELLATIONPOLICY ||
                            "Cancellation policy"}
                        </StyledTableCell>
                        <StyledTableCell
                          className="pendingbook-head"
                          align="center"
                        >
                          {i18?.TRIPS?.ACTION || "Action"}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.AcceptedBookingdata.map((row: any) => {
                        const correctedDateFormat =
                          settings.hiddenSettings.dateFormat || "YYYY/MM/DD";
                        const startDate = new DateObject({
                          date: new Date(row?.bookedDates?.start),
                        }).toUTC();
                        let formattedStartDate =
                          startDate.format(correctedDateFormat);

                        if (row?.bookedHours?.hours > 0) {
                          formattedStartDate +=
                            " " +
                            startDate.format(settings.hiddenSettings.timeFormat || "h A");
                        }

                        const endDate = new DateObject({
                          date: new Date(row?.bookedDates?.end),
                        }).toUTC();

                        let formattedEndDate =
                          endDate.format(correctedDateFormat);

                        if (row?.bookedHours?.hours > 0) {
                          formattedEndDate +=
                            " " + endDate.format(settings.hiddenSettings.timeFormat || "h A");
                        }

                        const BookedDateCreate = new DateObject({
                          date: new Date(row?.createdAt),
                        })
                          .toUTC()
                          .format(correctedDateFormat);

                        const formattedPaidDate = new DateObject({
                          date: new Date(row?.paidDate),
                        })
                          .toUTC()
                          .format(settings.hiddenSettings.dateFormat || "YYYY/MM/DD");

                        const Amount = Math.round(
                          row?.paidAmount * currency.exchange_rate
                        );
                        return (
                          <StyledTableRow
                            key={row._id}
                            // hover
                          >
                            <StyledTableCell align="left">{row?.bookingNo}</StyledTableCell>

                            <StyledTableCell
                              sx={{
                                paddingLeft: 2,
                                // backgroundColor: '#ffffff',
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                                fontSize: "var(--font-size-trips-status-text)",
                                fontFamily: "var(--font-family-inherit)",
                                color: "var(--text-color)",
                              }}
                              align="left"
                            >
                              {" "}
                              {row?.propertyName}
                              {/* <Link className="text-blue-500" href={`/detail/${row.listingId}`}>{row?.propertyName}</Link> */}
                            </StyledTableCell>
                            <StyledTableCell
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
                                <div>
                                  {" "}
                                  <Typography
                                    sx={{
                                      fontSize:
                                        "var(--font-size-trips-status-text)",
                                      fontFamily: "var(--font-family-inherit)",
                                      color: "var(--text-color) !important",
                                    }}
                                  >
                                    {row?.status}
                                  </Typography>{" "}
                                  <Typography
                                    sx={{
                                      fontSize: "var(--searchbox-header-size)",
                                      color: "var(--trips-subtitle-color)",
                                    }}
                                  >
                                    {" "}
                                    {BookedDateCreate}
                                  </Typography>
                                </div>
                              </div>
                            </StyledTableCell>

                            <StyledTableCell
                              sx={{ whiteSpace: "nowrap" }}
                              align="center"
                            >
                              <div className={`${styles.flexdata}`}>
                                {" "}
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: "normal",
                                    fontSize:
                                      "var(--font-size-trips-status-text)",
                                    fontFamily: "var(--font-family-inherit)",
                                    color: "var(--text-color)",
                                  }}
                                >
                                  {`${formattedStartDate} `} --{" "}
                                  {`  ${formattedEndDate} `}
                                </Typography>
                                <div className={`${styles.flexdata2}`}>
                                  {row?.bookedHours?.hours !== 0 &&
                                    row?.bookedHours?.nights !== 0 && (
                                      <Typography
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight: "normal",
                                          color: "#717171",
                                        }}
                                      >
                                        {row?.bookedHours?.nights}
                                        {""} {i18?.TRIPS?.NIGHTS || "Nights"}{" "}
                                        {row?.bookedHours?.hours}
                                        {""} {i18?.TRIPS?.HOURS || "Hours"}
                                      </Typography>
                                    )}

                                  {row?.bookedHours?.nights === 0 &&
                                    row?.bookedHours?.hours !== 0 && (
                                      <Typography
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight: "normal",
                                          color: "#717171",
                                        }}
                                      >
                                        {row?.bookedHours?.hours}
                                        {""} {i18?.TRIPS?.HOURS || "Hours"}
                                      </Typography>
                                    )}

                                  {row?.bookedHours?.nights !== 0 &&
                                    row?.bookedHours?.hours === 0 && (
                                      <Typography
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight: "normal",
                                          color: "#717171",
                                        }}
                                      >
                                        {row?.bookedHours?.nights}
                                        {""} {i18?.TRIPS?.NIGHTS || "Nights"}
                                      </Typography>
                                    )}
                                </div>
                                {/* <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: 'var(--trips-subtitle-color)',fontSize: 'var(--font-size-trips-status-text)',fontFamily: 'var(--font-family-inherit)' }}>  {`${formattedEndTime}`}</Typography> */}
                              </div>
                            </StyledTableCell>
                            {/* <StyledTableCell sx={{ whiteSpace: 'nowrap', width: '150px',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">
                                {parseInt(row?.adults) + parseInt(row?.children)} {i18?.TRIPS?.GUEST || "Guest"}{parseInt(row?.adults) + parseInt(row?.children) !== 1 ? 's' : ''}

                                {row?.pets > 1 ? (
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                                    {row?.pets} {''} {i18?.BOOKINGPAGE?.PET || "PET"}{row?.pets !== 1 ? 's' : ''}
                                  </Typography>
                                ) : null}
                              </StyledTableCell> */}
                            <StyledTableCell
                              sx={{
                                whiteSpace: "nowrap",
                                fontSize: "var(--font-size-table-cell)",
                                color: "var(--text-color)!important",
                                fontFamily:
                                  "var(--font-family-inherit) !important",
                              }}
                              align="center"
                            >
                              {row?.currencySymbol || row?.bookingdata?.currencySymbol || "--"}
                            </StyledTableCell>

                            {/* <StyledTableCell
                              sx={{
                                whiteSpace: "nowrap",
                                fontSize: "var(--font-size-table-cell)",
                                color: "var(--text-color)!important",
                                fontFamily:
                                  "var(--font-family-inherit) !important",
                              }}
                              align="center"
                            >
                              {Math.round(
                                row?.fareAmount * currency.exchange_rate
                              ).toLocaleString("en-IN")}
                            </StyledTableCell> */}
                            <StyledTableCell
                              sx={{
                                whiteSpace: "nowrap",
                                textTransform: "capitalize",
                                fontSize: "var(--font-size-table-cell)",
                                color: "var(--text-color)!important",
                                fontFamily:
                                  "var(--font-family-inherit) !important",
                              }}
                              align="center"
                            >
                              {row?.paymentMode}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                whiteSpace: "nowrap",
                                fontSize: "var(--font-size-table-cell)",
                                color: "var(--text-color)!important",
                                fontFamily:
                                  "var(--font-family-inherit) !important",
                              }}
                              align="center"
                            >
                              {row?.paymentMode === "cash"
                                ? "--"
                                : Amount.toLocaleString("en-IN")}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{
                                whiteSpace: "nowrap",
                                fontSize: "var(--font-size-table-cell)",
                                color: "var(--text-color)!important",
                                fontFamily:
                                  "var(--font-family-inherit) !important",
                              }}
                              align="center"
                            >
                              {row?.paymentMode === "cash"
                                ? "--"
                                : formattedPaidDate}
                            </StyledTableCell>

                            <StyledTableCell
                              sx={{
                                whiteSpace: "nowrap",
                                fontSize: "var(--font-size-table-cell)",
                                color: "var(--text-color)!important",
                                fontFamily:
                                  "var(--font-family-inherit) !important",
                              }}
                              align="center"
                            >
                              {row?.paymentMode === "cash"
                                ? "Non-Refundable"
                                : cancellationPolicy[row?.cancellationPolicyId]
                                    ?.title || "Non-Refundable"}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <button
                                onClick={() => handleCancel(row._id)}
                                className={`${styles.checkout}`}
                              >
                                <span>
                                  {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                                </span>
                              </button>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
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
        </div>
      )}
      <CustomModal
        open={openCancel}
        onClose={handleCloseCancel}
        title={
          i18?.BOOKIMGPAGE?.CANCELBOOKING ||
          "Give a reason to cancel this booking"
        }
      >
        <div className={`${styles.modal} p-3`}>
          <InputLabel style={{ color: "var(--trips-subtitle-color)" }}>
            {i18?.TRIPS?.REASON || "Reason"}:
          </InputLabel>
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
    </>
  );
}
