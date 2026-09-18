import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'
import { InputLabel, TablePagination } from '@mui/material'
import Paper from '@mui/material/Paper'
import { format } from 'date-fns';
import { DateObject } from "react-multi-date-picker";
import { dispatch } from '@/redux/store'
import { getPendingBooking } from '@/redux/slice/user/BookingSlice'
import Novalue from '@/components/novalue'
import Textarea from '@/components/textArea'
import APICONSTANT from '@/services/config';
import { postApiMethod } from '@/services/global'
import { addAlert } from '@/redux/slice/AlertSlice'
import TableSkeleton from '@/components/tableskeleton'
import { StyledTableCell, StyledTableRow } from '@/components/styledComponent/styledcomp'
import { usePageContext } from "@/components/Providers/PageContext";

import '../header.scss'
import styles from "../table.module.scss";
import { currencyRate } from '@/Utils/currencyRate'

const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false });
const CustomModal = dynamic(() => import('@/components/modal'), { ssr: false });
const DynamicButtonComponent = dynamic(() => import('@/components/DynamicComponent/ButtonComponent'));
const CustomSearchField = dynamic(() => import('@/components/customSearchBar'));
const TableRow = dynamic(() => import('@mui/material/TableRow'));

export default function PendingBookingTable() {
  const { i18, currency, settings } = usePageContext();
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    total: 0,
    PendingBookingdata: []
  })
  const [cancellationPolicy, setCancellationPolicy] = useState<any>([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [cancelId, setCancelId] = useState(null)
  const [openCancel, setOpenCancel] = useState(false)
  const [textareaValue, setTextareaValue] = useState('');
  const handleSearch = (event: any) => {
    const { value } = event.target
    setSearchValue(value)
    setPage(1)
  }
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const fetchData = async () => {
    try {
      const pendingdata = await dispatch(getPendingBooking(page, rowsPerPage, searchValue))
      if (pendingdata.statusCode === 200) {
        setIsLoading(false)
        setData({
          PendingBookingdata: pendingdata.data.pendingHistory,
          total: pendingdata.data.totalCount ? pendingdata.data.totalCount : 0

        })
        const obj: any = {}
        pendingdata.data.cancellationPolicy.forEach((item: any) => {
          obj[item.id] = item
        })
        obj[0] = obj[3] || {}
        setCancellationPolicy(obj)
      }
    } catch (err) {
      setIsLoading(false)
      console.log(err)
    }

  }
  useEffect(() => {
    fetchData()
  }, [searchValue, page, rowsPerPage])

  const handleCancel = (id: any) => {
    setCancelId(id)
    setOpenCancel(true)
  }
  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
  };
  const handleCloseCancel = () => {
    setOpenCancel(false);
  };
  const handleCancelAPI = async () => {
    if (cancelId) {
      try {
        const data = {
          reason: textareaValue,
          type: "user"
        }
        const response = await postApiMethod(`${APICONSTANT.cancelBooking}/${cancelId}`, data)
        if (response.statusCode === 200) {
          setOpenCancel(false)
          fetchData()
          dispatch(addAlert({
            isOpen: true,
            message: "Booking cancelled",
            type: "success",
            severity: "success"
          }))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
  return (
    <>
      {isLoading ?
        <div>
          <TableSkeleton />
        </div>
        :
        <div>
          <div className={`${styles.search}`}>
            <CustomSearchField
              id="search"
              type="search"
              label={`${i18?.HEADER?.SEARCH || "Search"}`}
              value={searchValue}
              onChange={handleSearch}
              sx={{ marginLeft: '20px', borderRadius: 4 }}
            />

          </div>
          {data.total > 0 ?
            (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.BOOKINGID || "Booking No"}</StyledTableCell>
                        <StyledTableCell
                          className="pendingbook-head"
                          sx={{
                            whiteSpace: 'nowrap',
                            fontWeight: 'bold',
                            width: '150px'
                          }}
                          align="left"
                        >
                          {i18?.TRIPS?.PROPERTYNAME || "Property name"}
                        </StyledTableCell>

                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.STATUS || "Status"}</StyledTableCell>
                        <StyledTableCell className="pendingbook-head" align="center">
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
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.CURRENCY || "Currency"}</StyledTableCell>
                        {/* <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.FAREAMOUNT || "Fare amount"}</StyledTableCell> */}
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.BOOKINGPAGE?.PAYMENTMODE || "Payment mode"}</StyledTableCell>
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.PAIDAMOUNT || "Paid amount"}</StyledTableCell>
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.PAIDDATE || "Paid date"}</StyledTableCell>
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.CANCELLATIONPOLICY || "Cancellation policy"}</StyledTableCell>
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.ACTION || "Action"}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.PendingBookingdata.map((row: any) => {
                        // const updatedAtDate = row.bookingdata?.updatedAt.split('T')[0]
                        const correctedDateFormat = settings.hiddenSettings.dateFormat || "YYYY/MM/DD";
                        const startDate = new DateObject({
                          date: new Date(row?.bookedDates?.start)
                        }).toUTC();
                        let startDateStr = startDate.format(correctedDateFormat);

                        if (row?.bookedHours?.hours > 0) {
                          startDateStr += ' ' + startDate.format(settings.hiddenSettings.timeFormat || "h A");
                        }

                        const endDate = new DateObject({
                          date: new Date(row?.bookedDates?.end)
                        }).toUTC();

                        let endDateStr = endDate.format(correctedDateFormat);

                        if (row?.bookedHours?.hours > 0) {
                          endDateStr += ' ' + endDate.format(settings.hiddenSettings.timeFormat || "h A");
                        }

                        const BookedDateCreate = new DateObject({
                          date: new Date(row?.createdAt)
                        }).toUTC().format(correctedDateFormat);

                        const formattedPaidDate = new DateObject({
                          date: new Date(row?.paidDate)
                        }).toUTC().format(settings.hiddenSettings.dateFormat || "YYYY/MM/DD");

                        const Amount = currencyRate(row?.paidAmount, currency.exchange_rate)
                        return (
                          <StyledTableRow
                            key={row._id}
                          // hover
                          >
                            <TableCell align="left">{row?.bookingNo}</TableCell>

                            <TableCell
                              sx={{
                                paddingLeft: 2,
                                // backgroundColor: '#ffffff',
                                whiteSpace: 'nowrap',
                                textTransform: 'capitalize',
                                fontSize: 'var(--font-size-table-cell)',
                                fontFamily: 'var(--font-family-base) !important',
                                color: 'var(--text-color)'
                              }}
                              align="left"
                            >
                              {' '}
                              {row?.propertyName}
                            </TableCell>
                            <TableCell
                              sx={{
                                whiteSpace: 'nowrap', textTransform: 'capitalize'
                              }}
                              align="center"
                            >
                              <div className='d-flex align-items-center gap-2'>
                                <div>
                                  {' '}
                                  <BeenhereOutlinedIcon sx={{ fontSize: '21px', color: 'green' }} />

                                </div>
                                <div>
                                  {' '}
                                  <Typography sx={{ fontSize: 'var(--font-size-trips-status-text)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }}>{row?.status}</Typography>
                                  {' '}
                                  <Typography sx={{ fontSize: 'var(--font-size-trips-status-text)', color: 'var(--trips-subtitle-color)!important', fontFamily: 'var(--font-family-inherit) !important' }}>
                                    {' '}
                                    {BookedDateCreate}
                                  </Typography>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">
                              <div className={`${styles.flexdata}`}>
                                {' '}
                                <Typography variant="subtitle2" sx={{ fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontWeight: 'normal', fontFamily: 'var(--font-family-inherit) !important' }}>
                                  {`${startDateStr} `} -- {`  ${endDateStr} `}

                                </Typography>
                                <div className={`${styles.flexdata2}`}>
                                  {row?.bookedHours?.hours !== 0 && row?.bookedHours?.nights !== 0 && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>
                                      {row?.bookedHours?.nights}{''} {i18?.TRIPS?.NIGHTS || "Nights"} {row?.bookedHours?.hours}{''} {i18?.TRIPS?.HOURS || "Hours"}
                                    </Typography>
                                  )}

                                  {row?.bookedHours?.nights === 0 && row?.bookedHours?.hours !== 0 && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>
                                      {row?.bookedHours?.hours}{''} {i18?.TRIPS?.HOURS || "Hours"}
                                    </Typography>
                                  )}

                                  {row?.bookedHours?.nights !== 0 && row?.bookedHours?.hours === 0 && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>
                                      {row?.bookedHours?.nights}{''} {i18?.TRIPS?.NIGHTS || "Nights"}
                                    </Typography>
                                  )}
                                </div>
                                {/* <Typography variant="subtitle2" sx={{fontSize: 'var(--font-size-table-cell)', fontWeight: 'normal', color: 'var(--trips-subtitle-color)',fontFamily: 'var(--font-family-inherit) !important' }}>  {`${formattedEndTime}`}</Typography> */}
                              </div>
                            </TableCell>
                            {/* <TableCell sx={{ whiteSpace: 'nowrap', width: '150px',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">
                              {parseInt(row?.adults) + parseInt(row?.children)} {i18?.TRIPS?.GUEST || "Guest"}{parseInt(row?.adults) + parseInt(row?.children) !== 1 ? 's' : ''}

                              {row?.pets > 1 ? (
                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                                  {row?.pets} {''} {i18?.BOOKINGPAGE?.PET || "PET"}{row?.pets !== 1 ? 's' : ''}
                                </Typography>
                              ) : null}
                            </TableCell> */}
                            <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">{row?.currencySymbol || '--'}</TableCell>

                            {/* <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{currencyRate(row?.fareAmount, currency.exchange_rate)}</TableCell> */}
                            <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'capitalize', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.paymentMode}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.paymentMode === 'cash' ? '--' : Amount}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.paymentMode === 'cash' ? '--' : formattedPaidDate}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">
                              {row?.paymentMode === 'cash'
                                ? `${i18?.BOOKINGPAGE?.NONREFUNDABLE || "Non-Refundable"}`
                                : cancellationPolicy[row?.cancellationPolicyId]?.title || `${i18?.BOOKINGPAGE?.NONREFUNDABLE || "Non-Refundable"}`}
                            </TableCell>
                            <TableCell align="center">
                              <DynamicButtonComponent variant="contained" onClick={() => handleCancel(row._id)} text={i18?.BOOKINGPAGE?.CANCEL || "Cancel"} />
                            </TableCell>
                          </StyledTableRow>
                        )
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
            )
          }
        </div>
      }

      <CustomModal open={openCancel} onClose={handleCloseCancel} title={i18?.BOOKINGPAGE?.CANCELBOOKING || 'Give a reason to cancel this booking'}>
        <div className={`${styles.modal} p-3`}>
          <InputLabel style={{ color: 'var(--trips-subtitle-color)' }}>{i18?.TRIPS?.REASON || "Reason"}:</InputLabel>
          <Textarea
            className={`${styles.Textarea}`}
            onChange={handleTextareaChange}
            value={textareaValue}
          />
        </div>
        <div className={`${styles.modalBtn} justify-content-end border-top p-3`}>
          <DynamicButtonComponent variant="outlined" onClick={handleCancelAPI} text={i18?.TRIPS?.OK || "Ok"} disabled={!textareaValue.trim()}
            className={!textareaValue.trim() ? 'disabledButton' : 'reason_ok_btn'} />
        </div>
      </CustomModal>
    </>
  )
}

