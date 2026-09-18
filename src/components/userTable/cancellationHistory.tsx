import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { TablePagination } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { DateObject } from "react-multi-date-picker";
import { dispatch } from "@/redux/store";
import { getCancelHistory } from "@/redux/slice/user/BookingSlice";
import {
  StyledTableCell,
  StyledTableRow,
} from "@/components/styledComponent/styledcomp";
import TableSkeleton from "@/components/tableskeleton";
import { usePageContext } from "@/components/Providers/PageContext";

import "../header.scss";
import styles from "../table.module.scss";

const TableRow = dynamic(() => import("@mui/material/TableRow"), {
  ssr: false,
});
const TableCell = dynamic(() => import("@mui/material/TableCell"), {
  ssr: false,
});
const Typography = dynamic(() => import("@mui/material/Typography"), {
  ssr: false,
});
const Novalue = dynamic(() => import("@/components/novalue"), { ssr: false });
const CustomSearchField = dynamic(() => import("@/components/customSearchBar"));

export default function CancellationHistoryTable() {
  const { i18, currency, settings } = usePageContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    total: 0,
    cancellationdata: [],
  });
  const [cancellationPolicy, setCancellationPolicy] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
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
  const fetchData = async () => {
    try {
      const canceldata = await dispatch(
        getCancelHistory(page, rowsPerPage, searchValue)
      );
      if (canceldata.statusCode === 200) {
        setIsLoading(false);
        setData({
          cancellationdata: canceldata.data.bookingHistory,
          total: canceldata.data.totalCount ? canceldata.data.totalCount : 0,
        });
        const obj: any = {};
        canceldata.data.cancellationPolicy.forEach((item: any) => {
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
                          //   backgroundColor: '#ffffff !important',
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
                      </StyledTableCell>
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
                        {i18?.TRIPS?.REASON || "Reason"}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.TRIPS?.CANCELLEDBY || "Cancelled by"}
                      </StyledTableCell>

                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.TRIPS?.CANCELLATIONPOLICYID ||
                          "Cancellation policy id"}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.cancellationdata.map((row: any) => {
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
                        date: new Date(
                          row?.bookingdata?.bookedDates?.end
                        ),
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

                      const Amount = Math.round(
                        row?.bookingdata?.paidAmount * currency.exchange_rate
                      );
                      return (
                        <StyledTableRow
                          key={row.bookingdata._id}
                          sx={{
                            backgroundColor: "#fff",
                          }}
                        >
                          <TableCell align="left">{row?.bookingdata?.bookingNo}</TableCell>

                          <TableCell
                            sx={{
                              color: "var(--text-color)!important",
                              fontSize: "var(--font-size-table-cell)",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              paddingLeft: 2,
                              //   backgroundColor: '#ffffff',
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                            }}
                            align="left"
                          >
                            {" "}
                            {row?.propertyName}
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
                                <HighlightOffIcon
                                  sx={{ fontSize: "21px", color: "red" }}
                                />
                              </div>
                              <div className="grid">
                                {" "}
                                <Typography
                                  sx={{
                                    fontSize: "var(--searchbox-header-size)",
                                    fontFamily:
                                      "var(--font-family-inherit) !important",
                                    color: "var(--text-color)",
                                  }}
                                >
                                  {row?.bookingdata?.status}
                                </Typography>{" "}
                                <Typography
                                  sx={{
                                    fontSize: "var(--searchbox-header-size)",
                                    color: "var(--trips-subtitle-color)",
                                    fontFamily:
                                      "var(--font-family-inherit) !important",
                                  }}
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
                                sx={{
                                  fontWeight: "normal",
                                  color: "var(--text-color) !important",
                                  fontFamily:
                                    "var(--font-family-inherit) !important",
                                  fontSize: "var(--trips-notes-size)",
                                }}
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
                              {/* <Typography variant="subtitle2" sx={{ fontWeight: 'normal',fontSize: 'var(--font-size-table-cell)', color: 'var(--trips-subtitle-color)!important',fontFamily: 'var(--font-family-inherit) !important' }}>  {`${formattedEndTime}`}</Typography> */}
                            </div>
                          </TableCell>
                          {/* <TableCell sx={{ whiteSpace: 'nowrap', width: '150px',color: 'var(--text-color) !important',fontFamily: 'var(--font-family-inherit) !important', fontSize: 'var(--trips-notes-size)' }} align="center">
                                                            {parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children)} {i18?.TRIPS?.GUEST || "Guest"}{parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children) !== 1 ? 's' : ''}

                                                            {row?.bookingdata?.pets > 1 ? (
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                                                                    {row?.bookingdata?.pets} {''} {i18?.BOOKINGPAGE?.PET || "PET"}{row?.bookingdata?.pets !== 1 ? 's' : ''}
                                                                </Typography>
                                                            ) : null}
                                                        </TableCell> */}
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {row?.bookingdata?.currencySymbol || "--"}
                          </TableCell>

                          {/* <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {Math.round(
                              row?.bookingdata?.fareAmount *
                                currency.exchange_rate
                            ).toLocaleString("en-IN")}
                          </TableCell> */}
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              textTransform: "capitalize",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode}
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode === "cash"
                              ? "--"
                              : Amount.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode === "cash"
                              ? "--"
                              : formattedPaidDate}
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {row?.bookingdata.cancellation
                              ? row?.bookingdata.cancellation.Reason
                              : "--"}
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {row?.bookingdata.cancellation
                              ? row?.bookingdata.cancellation.cancledBy
                              : "--"}
                          </TableCell>

                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",
                              color: "var(--text-color) !important",
                              fontFamily:
                                "var(--font-family-inherit) !important",
                              fontSize: "var(--trips-notes-size)",
                            }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode === "cash"
                              ? "Non-Refundable"
                              : cancellationPolicy[row?.cancellationPolicyId]
                                  ?.title || "Non-Refundable"}
                          </TableCell>
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
        </div>
      )}
    </>
  );
}
