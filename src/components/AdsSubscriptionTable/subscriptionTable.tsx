import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store'
import { adsSubscriptionStatus } from '@/redux/slice/user/BookingSlice'
import dynamic from "next/dynamic";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { TablePagination } from "@mui/material";
import CustomSearchField from "@/components/customSearchBar";
import {
    StyledTableCell,
    StyledTableRow,
} from "@/components/styledComponent/styledcomp";
import TableSkeleton from "@/components/tableskeleton";
import Novalue from "@/components/novalue";
import { usePageContext } from "@/components/Providers/PageContext";
import { DateObject } from "react-multi-date-picker";
import "../header.scss";
import styles from "../table.module.scss";

const TableRow = dynamic(() => import("@mui/material/TableRow"), {
    ssr: false,
});

const SubscriptionTable = ({ status }: any) => {
    const { i18, currency, settings } = usePageContext();
    const { getSubscriptionStatus } = useSelector(
        (state: any) => state.bookingEstimation
    );
    console.log("Subscription status", getSubscriptionStatus);

    const [isLoading, setIsLoading] = useState(false);
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
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    useEffect(() => {
        dispatch(adsSubscriptionStatus(status, searchValue, page, rowsPerPage))
    }, [status, searchValue, page, rowsPerPage]);

    const filteredData = getSubscriptionStatus.filter((pkg: any) =>
        pkg?.packageId?.packageName?.toLowerCase().includes(searchValue.toLowerCase())
    )

    return (
        <>
            <div className={styles.search}>
                <CustomSearchField
                    id="search"
                    type="search"
                    label={`${i18?.HEADER?.SEARCH || "Search"}`}
                    value={searchValue}
                    onChange={handleSearch}
                    sx={{ marginLeft: "20px" }}
                />
            </div>
            {isLoading ? (
                <div>
                    <TableSkeleton />
                </div>
            ) : filteredData.length > 0 ? (
                <div>
                    <div className={`${styles.table}`}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {[
                                            "Package Name",
                                            "Ads Limit",
                                            "Price",
                                            "Paid Amount",
                                            "Currency",
                                            "Start Date",
                                            "End Date",
                                            "Validity",
                                            "Status",
                                            "Type",
                                            "Created At",
                                            "Payment Status",
                                        ].map((header, index) => (
                                            <StyledTableCell key={index} sx={{ fontWeight: "bold" }}>
                                                {i18?.SUBSCRIPTION?.[header.toUpperCase().replace(" ", "_")] || header}
                                            </StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData
                                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                                        .map((pkg: any, index: any) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{pkg.packageId.packageName}</StyledTableCell>
                                                <StyledTableCell>{pkg.adsLimit}</StyledTableCell>
                                                <StyledTableCell>{pkg.packageId.price}</StyledTableCell>
                                                <StyledTableCell>{pkg.paidAmount}</StyledTableCell>
                                                <StyledTableCell>{pkg.currency}</StyledTableCell>
                                                <StyledTableCell>{new Date(pkg.startDate).toLocaleDateString()}</StyledTableCell>
                                                <StyledTableCell>{new Date(pkg.endDate).toLocaleDateString()}</StyledTableCell>
                                                <StyledTableCell>{pkg.packageId.validityDays} Days</StyledTableCell>
                                                <StyledTableCell>{pkg.status}</StyledTableCell>
                                                <StyledTableCell>{pkg.packageId.type}</StyledTableCell>
                                                <StyledTableCell>{new Date(pkg.createdAt).toLocaleDateString()}</StyledTableCell>
                                                <StyledTableCell>{pkg.paymentStatus}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className={`${styles.pagination}`}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredData.length || 0}
                            rowsPerPage={rowsPerPage}
                            page={page - 1}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            ) : (
                <Novalue />
            )}
        </>
    )
}

export default SubscriptionTable
