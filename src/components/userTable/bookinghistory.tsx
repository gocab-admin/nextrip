import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import { TablePagination, Typography } from '@mui/material'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'

import { dispatch, RootState } from '@/redux/store'
import { BookingID, getBookingHistory, selectRow } from '@/redux/slice/user/BookingSlice'
import CustomSearchField from "@/components/customSearchBar"
import { setModal } from '@/redux/slice/modalSlice'
import { StyledTableCell, StyledTableRow } from '@/components/styledComponent/styledcomp'
import TableSkeleton from '@/components/tableskeleton'
import { usePageContext } from "@/components/Providers/PageContext";
import { viewReview } from '@/redux/slice/user/userAboutDataSlice'

import '../header.scss'
import styles from "../table.module.scss";
import { DateObject } from 'react-multi-date-picker'

const DynamicButtonComponent = dynamic(() => import('@/components/DynamicComponent/ButtonComponent'));
const TableRow = dynamic(() => import('@mui/material/TableRow'), { ssr: false });
const TableCell = dynamic(() => import('@mui/material/TableCell'), { ssr: false });
const EditModal = dynamic(() => import('@/components/editModal'), { ssr: false });
const ReviewsAndRatings = dynamic(() => import('@/app/Modal/ReviewAndRating'));
const Novalue = dynamic(() => import('@/components/novalue'), { ssr: false });

export default function RequestHistoryTable(row: any) {
  const { i18, currency, settings } = usePageContext();
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    requestBookingdata: [],
    total: 0
  })
  const activeModel = useSelector((state: RootState) => state.modal.activeModel)
  const Reviewdata = useSelector((state: any) => state?.about?.GetReview?.listingReview);
  // const Reviewdata = useSelector((state: any) => {
  //   const reviews = state?.about?.GetReview?.listingReview?.reviewRating;
  //   return reviews && reviews.length > 0 ? reviews[reviews.length - 1] : null;
  // });

  const [totalCount, settotalCount] = useState()
  const [cancellationPolicy, setCancellationPolicy] = useState<any>([])
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
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
      const requesthistorydata = await dispatch(getBookingHistory(page, rowsPerPage, searchValue))
      if (requesthistorydata.statusCode === 200) {
        setIsLoading(false)
        setData({
          requestBookingdata: requesthistorydata.data.bookingHistory,
          total: requesthistorydata.data.totalCount ? requesthistorydata.data.totalCount : 0
        })
        const obj: any = {}
        requesthistorydata.data.cancellationPolicy.forEach((item: any) => {
          obj[item.id] = item
        })
        obj[0] = obj[3] || {}
        setCancellationPolicy(obj)
      }
    } catch (err) {
      setIsLoading(false)
      console.error(err)
    }

  }
  useEffect(() => {
    fetchData()
  }, [searchValue, page, rowsPerPage, Reviewdata])


  const handleReview = (id: any, b_id: any) => {
    dispatch(selectRow(id))
    dispatch(BookingID(b_id))
    dispatch(setModal('ReviewsAndRatings' as any))
    dispatch(viewReview(id, b_id))
  }

  const [buttonText, setButtonText] = useState('');

  useEffect(() => {
    // Update button text based on `row?.isReviewed`
    if (row?.isReviewed === true) {
      setButtonText('Show Reviews');
    } else {
      setButtonText(i18?.REVIEWS?.REVIEWSRATINGS || 'Reviews & Ratings');
    }
  }, [row?.isReviewed]);

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
              sx={{ marginLeft: '20px' }}
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
                            // backgroundColor: '#ffffff !important',
                            // paddingLeft: 10,
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
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.CANCELLATIONPOLICYID || "Cancellation policy id"}</StyledTableCell>
                        <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.REFERENCE || "Reference"}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.requestBookingdata.map((row: any) => {
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
                        const Amount = Math.round((row?.bookingdata?.paidAmount) * currency.exchange_rate)
                        return (
                          <StyledTableRow
                            key={row.bookingdata._id}
                          // hover
                          >
                            <StyledTableCell align="left">{row?.bookingdata?.bookingNo}</StyledTableCell>
                            <TableCell
                              sx={{
                                paddingLeft: 2,
                                // backgroundColor: '#ffffff',
                                whiteSpace: 'nowrap',
                                textTransform: 'capitalize',
                                fontSize: 'var(--font-size-trips-status-text)',
                                fontFamily: 'var(--font-family-inherit)',
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
                                <div className="grid">
                                  {' '}
                                  <Typography sx={{
                                    fontSize: 'var(--font-size-trips-status-text)',
                                    fontFamily: 'var(--font-family-inherit)',
                                    color: 'var(--text-color) !important'
                                  }}>{row?.bookingdata?.status}</Typography>
                                  {' '}
                                  <Typography sx={{ fontSize: 'var(--searchbox-header-size)', color: 'var(--trips-subtitle-color)' }}>{BookedDateCreate}</Typography>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">
                              <div className={`${styles.flexdata}`}>
                                {' '}
                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal', fontSize: 'var(--font-size-trips-status-text)', fontFamily: 'var(--font-family-inherit)', color: 'var(--text-color)' }}>
                                  {`${formattedStartDate} `} -- {`  ${formattedEndDate} `}

                                </Typography>
                                <div className={`${styles.flexdata2}`}>
                                  {row?.bookingdata?.bookedHours?.hours !== 0 && row?.bookingdata?.bookedHours?.nights !== 0 && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>
                                      {row?.bookingdata?.bookedHours?.nights}{''} {i18?.TRIPS?.NIGHTS || "Nights"} {row?.bookingdata?.bookedHours?.hours}{''} {i18?.TRIPS?.HOURS || "Hours"}
                                    </Typography>
                                  )}

                                  {row?.bookingdata?.bookedHours?.nights === 0 && row?.bookingdata?.bookedHours?.hours !== 0 && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>
                                      {row?.bookingdata?.bookedHours?.hours}{''} {i18?.TRIPS?.HOURS || "Hours"}
                                    </Typography>
                                  )}

                                  {row?.bookingdata?.bookedHours?.nights !== 0 && row?.bookingdata?.bookedHours?.hours === 0 && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>
                                      {row?.bookingdata?.bookedHours?.nights}{''} {i18?.TRIPS?.NIGHTS || "Nights"}
                                    </Typography>
                                  )}
                                </div>
                                {/* <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: 'var(--trips-subtitle-color)',fontSize: 'var(--font-size-trips-status-text)',fontFamily: 'var(--font-family-inherit)' }}>  {`${formattedEndTime}`}</Typography> */}
                              </div>
                            </TableCell>
                            {/* <TableCell sx={{ whiteSpace: 'nowrap', width: '150px',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important'  }} align="center">
                              {parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children)} {i18?.TRIPS?.GUEST || "Guest"}{parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children) !== 1 ? 's' : ''}

                              {row?.bookingdata?.pets > 1 ? (
                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                                  {row?.bookingdata?.pets} {''} {i18?.BOOKINGPAGE?.PET || "PET"}{row?.bookingdata?.pets !== 1 ? 's' : ''}
                                </Typography>
                              ) : null}
                            </TableCell> */}
                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.bookingdata?.currencySymbol || '--'}</TableCell>

                            {/* <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{Math.round((row?.bookingdata?.fareAmount) * currency.exchange_rate).toLocaleString('en-IN')}</TableCell> */}
                            <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'capitalize', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.bookingdata?.paymentMode}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{Amount.toLocaleString('en-IN')}</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{formattedPaidDate}</TableCell>

                            <TableCell sx={{ whiteSpace: 'nowrap', fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">
                              {row?.bookingdata?.paymentMode === 'cash'
                                ? 'Non-Refundable'
                                : cancellationPolicy[row?.cancellationPolicyId]?.title || 'Non-Refundable'}
                            </TableCell>
                            {/* <TableCell
                              sx={{
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {row?.isReviewed === true ? (
                              <DynamicButtonComponent variant="outlined" onClick={() => { handleReview(row._id, row?.bookingdata?._id) }}padding="10px" text={"Show Reviews" } /> 
                                ):( 
                              <DynamicButtonComponent variant="outlined" onClick={() => { handleReview(row._id, row?.bookingdata?._id) }}padding="10px" text={i18?.REVIEWS?.REVIEWSRATINGS || "Reviews & Ratings" } />
                               )} 
                            </TableCell> */}

                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              <DynamicButtonComponent
                                variant="outlined"
                                onClick={() => handleReview(row._id, row?.bookingdata?._id)}
                                padding="10px"
                                text={row?.isReviewed ? 'SHOW REVIEW' : `${i18?.REVIEWS?.REVIEWSRATINGS || 'Reviews & Ratings'}`}
                              />
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
                    onRowsPerPageChange={handleChangeRowsPerPage} />
                </div>
              </>
            ) : (
              <Novalue />
            )
          }
        </div>
      }
      <EditModal width="max-w-[36rem]" show={activeModel === 'ReviewsAndRatings'} buttonText="" title="" message="" type='review&raings'>
        <ReviewsAndRatings i18={i18} />
      </EditModal>
    </>

  )
}
