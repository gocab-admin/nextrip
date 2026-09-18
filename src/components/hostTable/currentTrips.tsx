import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { format } from 'date-fns';

import Novalue from '@/components/novalue'
import CustomSearchField from "@/components/customSearchBar"
import { getApiMethod } from '@/services/global'
import APICONSTANT from '@/services/config';
import TableSkeleton from '@/components/tableskeleton';
import { StyledTableCell, StyledTableRow } from '@/components/styledComponent/styledcomp';
import { usePageContext } from "@/components/Providers/PageContext";

import '../header.scss'
import styles from "../table.module.scss";
import { currencyRound } from '@/Utils/currencyRate';

export default function CurrentTripsTable() {
    const {i18, currency, settings } = usePageContext();
    const [data, setData] = useState({
        total: 0,
        currentTripsData: []
    })
    const [cancellationPolicy, setCancellationPolicy] = useState<any>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isLoading, setIsLoading] = useState(true)
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
            const CurrentData = await getApiMethod(`${APICONSTANT.currentBooking  }?_page=${page}&_limit=${rowsPerPage}&search=${searchValue}&type=provider`)
            if (CurrentData.statusCode === 200) {
                setIsLoading(false)
                setData({
                    currentTripsData: CurrentData.data.bookingHistory,
                    total: CurrentData.data.totalCount ? CurrentData.data.totalCount : 0
                })

                const obj: any = {}
                CurrentData.data.cancellationPolicy.forEach((item: any) => {
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
                            label={i18?.RESERVATIONS?.SEARCH || "Search"}
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
                                                        //   position: 'sticky',
                                                        // backgroundColor: '#ffffff !important',
                                                        //   left: 0,
                                                        // paddingLeft: 10,
                                                        // zIndex: 1,
                                                    }}
                                                    align="left"
                                                >
                                                    {i18?.TRIPS?.PROPERTYNAME || "Property Name"}
                                                </StyledTableCell>

                                                <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.STATUS || "Status"}</StyledTableCell>
                                                <StyledTableCell className="pendingbook-head" align="center">

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
                                                <StyledTableCell className="pendingbook-head" align="center">
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
                                                {/* <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.FAREAMOUNT || "Fare amount"}</StyledTableCell> */}
                                                <StyledTableCell className="pendingbook-head" align="center">{i18?.BOOKINGPAGE?.PAYMENTMODE || "Payment mode"}</StyledTableCell>
                                                <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.PAIDAMOUNT || "Paid amount"}</StyledTableCell>
                                                <StyledTableCell className="pendingbook-head" align="center">{i18?.TRIPS?.PAIDDATE || "Paid date"}</StyledTableCell>

                                                <StyledTableCell className="pendingbook-head" align="center">  {i18?.TRIPS?.CANCELLATIONPOLICYID || "cancellation policyId"}</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.currentTripsData.map((row: any) => {
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
                                                        key={row._id}
                                                        sx={{
                                                            backgroundColor: '#fff'
                                                        }}
                                                    >
                                                         <TableCell align="left">{row?.bookingdata?.bookingNo}</TableCell>

                                                        <TableCell
                                                            sx={{
                                                                paddingLeft: 2,
                                                                //   position: 'sticky',
                                                                //   left: '0',
                                                                //   backgroundColor: '#ffffff',
                                                                whiteSpace: 'nowrap',
                                                                textTransform: 'capitalize'
                                                            }}
                                                            align="left"
                                                        >
                                                            {' '}
                                                            {row?.propertyName}
                                                            {/* <Link className="text-blue-500" href={`/detail/${row.listingId}`}>{row?.propertyName}</Link> */}
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
                                                                    <HighlightOffIcon sx={{ fontSize: '21px', color: 'red' }} />

                                                                </div>
                                                                <div className="grid">
                                                                    {' '}
                                                                    <Typography sx={{ fontSize: '15px' }}>{row?.bookingdata?.status}</Typography>
                                                                    {' '}
                                                                    <Typography sx={{ fontSize: '15px', color: '#717171' }}>
                                                                        {' '}
                                                                        {BookedDateCreate}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">
                                                            <div className={`${styles.flexdata}`}>
                                                                {' '}
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
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
                                                                {/* <Typography variant="subtitle2" sx={{ fontWeight: 'normal', color: '#717171' }}>  {`${formattedEndTime}`}</Typography> */}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }} align="center">
                                                            {row?.userFirstname && row?.userlastname && (`${row?.userFirstname  } ${  row?.userlastname}`) || '--'}
                                                        </TableCell>
                                                        {/* <TableCell sx={{ whiteSpace: 'nowrap', width: '150px' }} align="center">
                                                            {parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children)} {i18?.TRIPS?.GUEST || "Guest"}{parseInt(row?.bookingdata?.adults) + parseInt(row?.bookingdata?.children) !== 1 ? 's' : ''}

                                                            {row?.bookingdata?.pets > 1 ? (
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'normal' }}>
                                                                    {row?.bookingdata?.pets} {''} {i18?.BOOKINGPAGE?.PET || "Pet"}{row?.bookingdata?.pets !== 1 ? 's' : ''}
                                                                </Typography>
                                                            ) : null}
                                                        </TableCell> */}

                                                        {/* <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">{row?.bookingdata?.currencySymbol} {currencyRound(row?.bookingdata?.fareAmount)}</TableCell> */}
                                                        <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }} align="center">{row?.bookingdata?.paymentMode}</TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">{row?.bookingdata?.paymentMode == 'cash' ? '--' : `${row?.bookingdata?.currencySymbol} ${currencyRound(row?.bookingdata?.paidAmount)}`}</TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">{row?.bookingdata?.paymentMode === 'cash' ? '--' : formattedPaidDate}</TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">
                                                            {row?.bookingdata?.paymentMode === 'cash'
                                                                ? '--'
                                                                : cancellationPolicy[row?.cancellationPolicyId]?.title || i18?.RESERVATIONS?.INVALIDCANCELLATION || 'invalid cancellation'}
                                                        </TableCell>
                                                    </StyledTableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer><div className={`${styles.pagination}`}>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={data.total || 0}
                                        rowsPerPage={rowsPerPage}
                                        page={page - 1}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage} />
                                </div></>
                        ) : (

                            <Novalue />
                        )
                    }
                </div>
            }
        </>
    )
}
