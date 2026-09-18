import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import { TablePagination } from '@mui/material'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'
import { format } from 'date-fns';

import { getApiMethod } from '@/services/global'
import APICONSTANT from '@/services/config'
import { StyledTableCell, StyledTableRow } from '@/components/styledComponent/styledcomp'
import TableSkeleton from '@/components/tableskeleton'
import { usePageContext } from '@/components/Providers/PageContext'

import '../header.scss'
import styles from "../table.module.scss";

const Novalue = dynamic(() => import('@/components/novalue'), { ssr: false });
const TableRow = dynamic(() => import('@mui/material/TableRow'), { ssr: false });
const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false });
const CustomSearchField = dynamic(() => import('@/components/customSearchBar'));

export default function UpcommingTripsTable() {
    const {i18, currency, settings } = usePageContext();
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        total: 0,
        upcommingTripsData: []
    })
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
            const upcommingData = await getApiMethod(`${APICONSTANT.upcommingBooking  }?_page=${page}&_limit=${rowsPerPage}&_search=${searchValue}&type=user`)
            if (upcommingData.statusCode === 200) {
                setIsLoading(false)
                setData({
                    upcommingTripsData: upcommingData.data.bookingHistory,
                    total: upcommingData.data.totalCount ? upcommingData.data.totalCount : 0

                })
                const obj: any = {}
                upcommingData.data.cancellationPolicy.forEach((item: any) => {
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
    }, [searchValue, page, rowsPerPage])


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
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.upcommingTripsData.map((row: any) => {
                                                //  const updatedAtDate = row.bookingdata?.updatedAt.split('T')[0]
                                                const dateFormatFromAPI = settings?.hiddenSettings?.dateFormat;
                                                const correctedDateFormat = dateFormatFromAPI.replace('DD', 'dd').replace('YYYY', 'yyyy');
                                                const startDate = new Date(row?.bookingdata?.bookedDates?.start)
                                                const endDate = new Date(row?.bookingdata?.bookedDates?.end)

                                                // const formattedStartDate = `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`
                                                // const formattedEndDate = `${endDate.getDate()}-${endDate.getMonth() + 1}-${endDate.getFullYear()}`
                                                const BookedDateAt = new Date(row?.bookingdata?.createdAt)
                                                // const BookedDateCreate = `${BookedDateAt.getDate()}-${BookedDateAt.getMonth() + 1}-${BookedDateAt.getFullYear()}`
                                                const formattedStartDate = format(startDate, correctedDateFormat);
                                                const formattedEndDate = format(endDate, correctedDateFormat);
                                                const BookedDateCreate = format(BookedDateAt, correctedDateFormat);
                                                // const formattedEndTime = `${endDate.toLocaleTimeString([], {
                                                //     hour: 'numeric',
                                                //     minute: '2-digit',
                                                // }).replace(' ', '')}`
                                                const paidDate = new Date(row?.bookingdata?.paidDate)
                                                // const formattedPaidDate = `${paidDate.getDate()}-${paidDate.getMonth() + 1}-${paidDate.getFullYear()} ${paidDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                const formattedPaidDate = format(paidDate, correctedDateFormat);
                                                const Amount = Math.round((row?.bookingdata?.paidAmount)* currency.exchange_rate)
                                                return (
                                                    <StyledTableRow
                                                        key={row.bookingdata._id}
                                                        sx={{
                                                            backgroundColor: '#fff'
                                                        }}
                                                    >
                                                        <StyledTableCell align="left">{row?.bookingNo}</StyledTableCell>

                                                        <StyledTableCell
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
                                                        </StyledTableCell>
                                                        <StyledTableCell
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
                                                                    <Typography sx={{ fontSize: 'var(--font-size-trips-status-text)',
                                                                                    fontFamily: 'var(--font-family-inherit)',
                                                                                    color: 'var(--text-color) !important'}}>{row?.bookingdata?.status}</Typography>
                                                                    {' '}
                                                                    <Typography sx={{ fontSize: 'var(--searchbox-header-size)', color: 'var(--trips-subtitle-color)'}}>
                                                                        {' '}
                                                                        {BookedDateCreate}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </StyledTableCell>

                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap' }} align="center">
                                                            <div className={`${styles.flexdata}`}>
                                                                {' '}
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal',fontSize: 'var(--font-size-trips-status-text)',fontFamily: 'var(--font-family-inherit)',color: 'var(--text-color)' }}>
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
                                                                {/* <Typography variant="subtitle2" sx={{fontWeight: 'normal', color: 'var(--trips-subtitle-color)',fontSize: 'var(--font-size-trips-status-text)',fontFamily: 'var(--font-family-inherit)'}}>  {`${formattedEndTime}`}</Typography> */}
                                                            </div>
                                                        </StyledTableCell>
                                                        {/* <StyledTableCell sx={{ whiteSpace: 'nowrap', width: '150px',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">
                                                            {parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children)} {i18?.TRIPS?.GUEST || "Guest"}{parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children) !== 1 ? 's' : ''}

                                                            {row?.bookingdata?.pets > 1 ? (
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                                                                    {row?.bookingdata?.pets} {''} {i18?.BOOKINGPAGE?.PET || "PET"}{row?.bookingdata?.pets !== 1 ? 's' : ''}
                                                                </Typography>
                                                            ) : null}
                                                        </StyledTableCell> */}
                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.bookingdata?.currencySymbol || '--'}</StyledTableCell>

                                                        {/* <StyledTableCell sx={{ whiteSpace: 'nowrap',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{Math.round((row?.bookingdata?.fareAmount)* currency.exchange_rate).toLocaleString('en-IN')}</StyledTableCell> */}
                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap', textTransform: 'capitalize',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.bookingdata?.paymentMode}</StyledTableCell>
                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.bookingdata?.paymentMode === 'cash' ? '--' : Amount.toLocaleString('en-IN')}</StyledTableCell>
                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">{row?.bookingdata?.paymentMode === 'cash' ? '--' : formattedPaidDate}</StyledTableCell>

                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap',fontSize: 'var(--font-size-table-cell)', color: 'var(--text-color)!important', fontFamily: 'var(--font-family-inherit) !important' }} align="center">
                                                            {row?.bookingdata?.paymentMode === 'cash'
                                                                ? 'Non-Refundable'
                                                                : cancellationPolicy[row?.cancellationPolicyId]?.title || 'Non-Refundable'}
                                                        </StyledTableCell>
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
        </>
    )
}
