import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TablePagination, Typography } from "@mui/material";
import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import { format } from "date-fns";
import { RootState } from "@/redux/store";
import Novalue from "@/components/novalue";
import CustomSearchField from "@/components/customSearchBar";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import TableSkeleton from "@/components/tableskeleton";
import {
  StyledTableCell,
  StyledTableRow,
} from "@/components/styledComponent/styledcomp";
import { usePageContext } from "@/components/Providers/PageContext";

import "../header.scss";
import styles from "../table.module.scss";
import { currencyRound } from "@/Utils/currencyRate";
import { DateObject } from "react-multi-date-picker";

export default function HostBookingHisTable() {
  const { i18, currency, settings } = usePageContext();
  const [data, setData] = useState({
    BookingHistorydata: [],
    total: 0,
  });
  const activeModel = useSelector(
    (state: RootState) => state.modal.activeModel
  );
  const [cancellationPolicy, setCancellationPolicy] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
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
      const response = await getApiMethod(
        `${APICONSTANT.bookingHistory}?_page=${page}&_limit=${rowsPerPage}&search=${searchValue}&type=provider`
      );
      if (response.statusCode === 200) {
        setIsLoading(false);
        setData({
          BookingHistorydata: response.data.bookingHistory,
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
              label={i18?.RESERVATIONS?.SEARCH || "Search"}
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
                        }}
                        align="left"
                      >
                        {i18?.RESERVATIONS?.PROPERTYNAME || "Property Name"}
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
                        {i18?.TRIPS?.BOOKEDDATES || "Booked Dates"}

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

                          {i18?.RESERVATIONS?. GUESTS || "Guests"} */}

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
                        {i18?.RESERVATIONS?.HOSTAMOUNT || "Host amount"}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.RESERVATIONS?.COMMISSIONAMOUNT ||
                          "Commission amount"}
                      </StyledTableCell>
                      <StyledTableCell
                        className="pendingbook-head"
                        align="center"
                      >
                        {i18?.RESERVATIONS?.TAX || "Tax"}
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
                        {i18?.BOOKINGPAGE?.PAYMENTMODE || "Payment mode"}
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
                        {" "}
                        {i18?.RESERVATIONS?.CANCELLATIONPOLICYID ||
                          "Cancellation policyId"}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.BookingHistorydata.map((row: any) => {
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
                      const Amount = row?.bookingdata?.paidAmount;
                      return (
                        <StyledTableRow
                          key={row.bookingdata._id}
                          // hover
                          sx={
                            {
                              // '&:nth-of-type(odd)': {
                              //   backgroundColor: '#dddddd',
                              // },
                              // backgroundColor: '#fff',
                              // '&:last-child td, &:last-child th': {
                              //   border: 0,
                              // },
                            }
                          }
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
                            {/* <Link  href="/">{row?.propertyName}</Link> */}
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
                                <Typography sx={{ fontSize: "15px" }}>
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
                              {/* <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>  {`${formattedEndTime}`}</Typography> */}
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

                          {/* <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.currencySymbol}{" "}
                            {currencyRound(row?.bookingdata?.fareAmount)}
                          </TableCell> */}
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.currencySymbol}{" "}
                            {currencyRound(row?.bookingdata?.hostAmount)}
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.commission > 0
                              ? `${
                                  row?.bookingdata?.currencySymbol
                                } ${currencyRound(
                                  row?.bookingdata?.commission
                                )}`
                              : row?.bookingdata?.commission}
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.tax > 0
                              ? `${
                                  row?.bookingdata?.currencySymbol
                                } ${currencyRound(row?.bookingdata?.tax)}`
                              : row?.bookingdata?.tax}
                          </TableCell>
                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.currencySymbol}{" "}
                            {currencyRound(row?.bookingdata?.paidAmount)}
                          </TableCell>
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
                            {formattedPaidDate}
                          </TableCell>

                          <TableCell
                            sx={{ whiteSpace: "nowrap" }}
                            align="center"
                          >
                            {row?.bookingdata?.paymentMode === "cash"
                              ? i18?.BOOKINGPAGE?.NONREFUNDABLE ||
                                "Non-Refundable"
                              : cancellationPolicy[row?.cancellationPolicyId]
                                  ?.title ||
                                i18?.BOOKINGPAGE?.NONREFUNDABLE ||
                                "Non-Refundable"}
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
