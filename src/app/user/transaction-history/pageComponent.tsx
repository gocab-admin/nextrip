"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { Popover, Skeleton } from "@mui/material";
import { Danger } from "@/app/global/svg";
import Paper from "@mui/material/Paper";
import dynamic from "next/dynamic";
import { format } from "date-fns";

import Header from "@/components/header";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import isAuth from "@/components/isAuth";
import { getBankDetailsData } from "@/redux/slice/bankDetails";
import { dispatch } from "@/redux/store";
import { fetchProviderListingData } from "@/redux/slice/host/providerlistingsSlice";
import { currencySelector } from "@/redux/slice/CurrencySlice";
import { useAppSelector } from "@/redux/hooks";
import {
  StyledTableCell,
  StyledTableRow
} from "@/components/styledComponent/styledcomp";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

const TableRow = dynamic(() => import("@mui/material/TableRow"));
const TableCell = dynamic(() => import("@mui/material/TableCell"));
const Box = dynamic(() => import("@mui/material/Box"));

const style = {
  width: 200,
  bgcolor: "background.paper",
  border: "1px solid none",
  boxShadow: 24,
  // borderRadius: 3,
  py: 1.5
};

const Transaction = () => {
  const { i18, currency, settings,responsiveView } = usePageContext();
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const monthNames = months.map((monthNumber) => new Date(2022, monthNumber - 1, 1).toLocaleString("en-US", {
      month: "long"
    }));
  const data = useSelector((state: any) => state?.BankDetails);
  const { CurrencyList } = useAppSelector(currencySelector);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [value, setValue] = useState("1");
  const [exportModal, setExportModal] =
    React.useState<HTMLButtonElement | null>(null);
  const [history, setHistory] = useState<any>([]);
  const [historyDate, setHistoryDate] = useState("");
  // const [total, setTotal] = useState(0)
  const [valueSelect, setValueSelect] = React.useState("");
  const [selectedFromMonth, setSelectedFromMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" })
  );
  const [selectedToMonth, setSelectedToMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" })
  );
  const [selectedFromYear, setSelectedFromYear] = useState(
    new Date().getFullYear()
  );
  const [selectedToYear, setSelectedToYear] = useState(
    new Date().getFullYear()
  );
  const [list, setList] = useState<any>({
    total: 0,
    listingdata: []
  });
  const openSelect = Boolean(anchorEl);
  const id = openSelect ? "simple-popover" : undefined;
  const open = Boolean(exportModal);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sliceValue, setsliceValue] = useState(3);
  const [count, setCount] = useState(false);
  const [toMonthOptions, setToMonthOptions] = useState<string[]>(monthNames);

  const handleFromYear = (event: any) => {
    setSelectedFromYear(parseInt(event.target.value, 10));
  };
  const handleToYear = (event: any) => {
    setSelectedToYear(parseInt(event.target.value, 10));
  };
  const date = new Date();
  const currentYear = date.getFullYear();
  const startYear = currentYear - 7; // Display past 8 years
  const years = Array.from({ length: 8 }, (_, index) => startYear + index);
  const currentMonth = new Date().getMonth() + 1;

  const handleFromMonth = (event: any) => {
    setSelectedFromMonth(event.target.value);
    setToMonthOptions(monthNames.slice(monthNames.indexOf(event.target.value)));
  };
  const handleToMonth = (event: any) => {
    setSelectedToMonth(event.target.value);
  };
  const selectedItem = useMemo(() => list.listingdata.find((item: any) => item._id === valueSelect), [valueSelect]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getApiMethod(
        `${APICONSTANT.transaction 
          }?&year1=${selectedFromYear}&month1=${selectedFromMonth}&year2=${selectedToYear}&month2=${selectedToMonth}`
      );
      if (res.statusCode === 200) {
        setIsLoading(false);
        setAnchorEl(null);
        setHistory(res.data.transaction);
        setHistoryDate(res.data.transaction.createdAt);
      } else {
        setIsLoading(false);
        console.error(`API request failed with status: ${res.status}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formattedDate = formatDate(historyDate);

  const dateFormatFromAPI = settings?.hiddenSettings?.dateFormat;
  const correctedDateFormat = dateFormatFromAPI
    .replace("DD", "dd")
    .replace("YYYY", "yyyy");

  useEffect(() => {
    fetchData();
  }, [
    selectedFromYear,
    selectedFromMonth,
    selectedToYear,
    selectedToMonth,
    valueSelect
  ]);

  useEffect(() => {
    dispatch(getBankDetailsData());
  }, []);

  const providerlisting = async () => {
    try {
      const res = await dispatch(fetchProviderListingData());
      setValueSelect(res.data.providerListings[0]._id);
      setList({
        listingdata: res.data.providerListings,
        total: res.data.total
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    providerlisting();
  }, []);
  
  const handleSlice = (value: any) => {
    if (value === "showmore") {
      setCount(true);
      setsliceValue(history.trx.length);
    }
    if (value === "showless") {
      setCount(false);
      setsliceValue(3);
    }
  };
  return (
    <>
      <div className={`${styles.transaction}`}>
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
        <div className={`${styles.tabpanel} mx-auto`}>
          {data.BankDetails.length < 0 && (
            <div className={`${styles.addmethod} d-flex`}>
              <div className={`${styles.danger} me-3`}>
                <Danger
                  className={`${styles.iconsvg}`}
                  style={{
                    display: "block",
                    height: "16px",
                    width: "16px",
                    fill: "white"
                  }}
                />
              </div>
              <div>
                <h6 className="m-0">
                  {i18?.SETUPPAYOUTS?.ADDAPAYOUTMETHOD || "Add a payout method"}
                </h6>
                <p className="m-0">
                  {i18?.SETUPPAYOUTS?.YOUWILLNEEDTOSETUP ||
                    "You'll need to set up your payouts in order to get paid."}
                </p>
                <div className="d-flex mt-3">
                  {/* <a className={`${styles.learnmore} me-3`} href=''>Learn more</a> */}
                  <a
                    className={`${styles.getstart}`}
                    href="/account-settings/payments/setup"
                  >
                    {i18?.BUTTONS?.GETSTARTED || "Get started"}
                  </a>
                </div>
              </div>
            </div>
          )}
          <div className={`${styles.breadcrums}`}>
            <div>
              <h1 className={`mt-3`}>
                {isLoading ? (
                  <Skeleton width={400} />
                ) : (
                  `${i18?.LISTING?.TRANSACTIONHISTOR || "Transaction History"}`
                )}
              </h1>
            </div>
          </div>
          <div className={`${styles.tab}`}>
            <div className={`${styles.tabwidth}`}>
              {/* <TabContext value={value}> */}
              <div className={`${styles.tablist}`}>
                {/* <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="Completed Payouts" value="1" />
                                        <Tab label="Upcoming Payouts" value="2" />
                                        <Tab label="Gross Earnings" value="3" />
                                    </TabList> */}
              </div>
              {isLoading ? (
                <div>
                  <Skeleton height={50} />
                  <Skeleton width={700} />
                  <div className="mt-4">
                    {Array.from(Array(3)).map((item: any, index: any) => (
                      <div key={index} className="border mb-4 p-3">
                        <Skeleton width={700} />
                        <Skeleton />
                        <Skeleton width={400} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`${styles.panels}`}>
                  <div className="">
                    <div className={`${styles.guestcontent} pb-3`}>
                      <div className={`${styles.referal}`}>
                        <div className={`${styles.background}`}>
                          {/* <div className={`${styles.dropdown}`}>
                                                    <div className={`${styles.box}`}>

                                                        <div onClick={handleClickSelect} className={`${styles.selectBox}`}>
                                                            <img width={35} height={35} src={selectedItem?.coverImage[0]} alt="pro" className={`${styles.img}`} />
                                                            <p>{selectedItem?.propertyName}</p>
                                                            <KeyboardArrowDownIcon sx={{ margin: 'auto' }} />
                                                        </div>
                                                    </div>

                                                    <Popover
                                                        id={id}
                                                        open={openSelect}
                                                        anchorEl={anchorEl}
                                                        onClose={handleClose}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        }}
                                                    >
                                                        {list.listingdata.map((option: any) => (
                                                            <>
                                                                <div className={`${styles.ContentFlex}`}>
                                                                    <div className={`${styles.content}`} key={option._id}>
                                                                        <img width={60} height={40} src={option.coverImage[0]} alt="pro" className={`${styles.img}`} />
                                                                        <Typography sx={{ pl: 2, mt: 1 }}>{option.propertyName}</Typography>
                                                                    </div>
                                                                    <div>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                                                name="controlled-radio-buttons-group"
                                                                                value={valueSelect}
                                                                                onChange={handleChangeSelect}
                                                                            >
                                                                                <FormControlLabel
                                                                                    value={option._id}
                                                                                    checked={valueSelect === option._id}
                                                                                    onChange={(e: any) => {
                                                                                        setValueSelect(e.target.value);
                                                                                    }}
                                                                                    control={<Radio sx={{
                                                                                        mt: 2,
                                                                                        color: "black",
                                                                                        marginRight: "8px",
                                                                                        '&.Mui-checked': {
                                                                                            color: "black",
                                                                                        },
                                                                                    }} />} label="" className="mr-0" />
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    </div>
                                                                </div>

                                                            </>

                                                        ))}
                                                    </Popover>
                                                </div> */}
                          {/* <div className={`${styles.gridMonth}`}>
                                                   <div className={`${styles.flex}`}>
                                                   <div className={`${styles.month} `}>
                                                        <h5>From:</h5>
                                                        <select className={`${styles.select} `} value={selectedFromMonth} onChange={handleFromMonth}  >
                                                            {monthNames.map((month) => (
                                                                <option key={month} value={month}>
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className={`${styles.year}`}>
                                                        <select className={`${styles.select}`} value={selectedFromYear} onChange={handleFromYear} defaultValue={currentYear}>
                                                            {years.map((yearOption) => (
                                                                <option key={yearOption} value={yearOption}>
                                                                    {yearOption}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                   </div>
                                                   <div className={`${styles.flex}`}>
                                                   <div className={`${styles.month}`}>
                                                        <h5>To:</h5>
                                                        <select className={`${styles.select} `} value={selectedToMonth} onChange={handleToMonth} >
                                                            {monthNames.map((month) => (
                                                                <option key={month} value={month}>
                                                                    {month}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className={`${styles.year} `}>
                                                        <select className={`${styles.select} `} value={selectedToYear} onChange={handleToYear} defaultValue={currentYear}>
                                                            {years.map((yearOption) => (
                                                                <option key={yearOption} value={yearOption}>
                                                                    {yearOption}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                   </div>
                                                </div> */}
                          <div className={`${styles.flexContainer}`}>
                            <div className={`${styles.flex}`}>
                              <div className={`${styles.month} border `}>
                                <h5>{i18?.LISTING?.FROM || "From"}:</h5>
                                <select
                                  className={`${styles.select} `}
                                  value={selectedFromMonth}
                                  onChange={handleFromMonth}
                                >
                                  {monthNames.map((month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className={`${styles.year} border`}>
                                <select
                                  className={`${styles.select}`}
                                  value={selectedFromYear}
                                  onChange={handleFromYear}
                                  defaultValue={currentYear}
                                >
                                  {years.map((yearOption) => (
                                    <option key={yearOption} value={yearOption}>
                                      {yearOption}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className={`${styles.flex}`}>
                              <div className={`${styles.month} border`}>
                                <h5>{i18?.LISTING?.TO || "To"}:</h5>
                                <select
                                  className={`${styles.select} `}
                                  value={selectedToMonth}
                                  onChange={handleToMonth}
                                >
                                  {toMonthOptions.map((month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className={`${styles.year} border`}>
                                <select
                                  className={`${styles.select} `}
                                  value={selectedToYear}
                                  onChange={handleToYear}
                                  defaultValue={currentYear}
                                >
                                  {years.map((yearOption) => (
                                    <option key={yearOption} value={yearOption}>
                                      {yearOption}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`d-flex justify-content-between pt-3 pb-2`}
                          >
                            <h5 className="m-0">
                              {i18?.SETUPPAYOUTS?.BALANCE || "Balance"} :{" "}
                              <span>{history.balance}</span>
                            </h5>
                            {/* <button className={`${styles.button} d-flex align-items-center me-3`} onClick={handleExportOpen}>
                                                            Export CSV <ArrowForwardIosIcon className={`${styles.iosicon}`} />
                                                        </button> */}
                          </div>
                          {history.trx && history.trx.length === 0 ? (
                            <div className={`${styles.history}`}>
                              <h6 className="m-0">
                                {i18?.SETUPPAYOUTS?.WEAREUNABLETOPROCESS ||
                                  "We're unable to process your payouts"}
                              </h6>
                              <p className="m-0">
                                <a href="/account-settings/payments/payment-method">
                                  {i18?.SETUPPAYOUT?.ADDAPAYOUTMETHOD ||
                                    "Add a payout method"}
                                </a>{" "}
                                {i18?.SETUPPAYOUTS?.TOYOURACCOUNT ||
                                  "to your account to start receiving your payouts"}
                              </p>
                            </div>
                          ) : (
                            // <div>
                            //     {history && history.trx && history.trx.slice(0, sliceValue).map((item: any, index: any) => (
                            //         <div key={item._id} className='border mb-4'>
                            //             <Accordion
                            //                 expanded={expandedItems.includes(index)}
                            //                 onChange={handleExpansion(index)}
                            //                 sx={{
                            //                     '& .MuiAccordion-region': { height: expandedItems.includes(index) ? 'auto' : 0 },
                            //                     '& .MuiAccordionDetails-root': { display: expandedItems.includes(index) ? 'block' : 'none' },
                            //                     boxShadow: 'none'
                            //                 }}
                            //             >
                            //                 <AccordionSummary
                            //                     expandIcon={<ExpandMoreIcon />}
                            //                     aria-controls={`panel${index + 1}-content`}
                            //                     id={`panel${index + 1}-header`}
                            //                 >
                            //                     <div>
                            //                         <p className='mb-2 text-black'><b>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</b></p>
                            //                         <p className='' style={{ marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.email}</p>
                            //                         <p className=''>{CurrencyList.currency} {item.amount}</p>
                            //                     </div>
                            //                 </AccordionSummary>
                            //                 <AccordionDetails>
                            //                     <div key={item._id}>
                            //                         <div className='d-flex justify-content-between border-bottom pb-3'>
                            //                             <div className=''>
                            //                                 <p className='text-black'>Amount</p>
                            //                             </div>
                            //                             <p>{CurrencyList.currency} {item.amount}</p>
                            //                         </div>
                            //                         <div className='d-flex justify-content-between mt-3'>
                            //                             <div className=''>
                            //                                 <p className='text-black'>Type</p>
                            //                             </div>
                            //                             <p>{item.type}</p>
                            //                         </div>
                            //                     </div>
                            //                 </AccordionDetails>
                            //             </Accordion>
                            //         </div>
                            //     ))}
                            //     <div className='d-flex justify-content-end'>
                            //         <button className=' bg-transparent border border-white text-decoration-underline' onClick={()=>handleSlice(count ? 'showless' : 'showmore')}>{count ? 'View Less' : 'View More'  }</button>
                            //     </div>
                            // </div>
                            <div>
                              <TableContainer component={Paper}>
                                <Table
                                  sx={{ minWidth: 650 }}
                                  aria-label="simple table"
                                >
                                  <TableHead>
                                    <TableRow>
                                      {/* <StyledTableCell
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            fontWeight: 'bold',
                                                            width: '60px',
                                                            position: 'sticky',
                                                            backgroundColor: '#ffffff !important',
                                                            left: 0,
                                                            zIndex: 1,
                                                        }}
                                                        align="left"
                                                    >
                                                        <Checkbox size="small"
                                                        sx={{
                                                            color: 'black',
                                                            '&.Mui-checked': {
                                                                color: 'black',
                                                            },
                                                        }}
                                                    />
                                                    </StyledTableCell> */}
                                      {/* <StyledTableCell
                                                                                sx={{
                                                                                    whiteSpace: 'nowrap',
                                                                                    fontWeight: 'bold',
                                                                                    width: '150px',
                                                                                    // position: 'sticky',
                                                                                    // backgroundColor: '#ffffff !important',
                                                                                    textTransform: 'Uppercase',
                                                                                    left: 0,
                                                                                    zIndex: 1,
                                                                                }}
                                                                                align="left"
                                                                            >
                                                                                {i18?.LISTING?.LISTING || "Listing"}
                                                                            </StyledTableCell> */}

                                      {/* <TableCell sx={{ width: '150px', whiteSpace: 'nowrap', fontWeight: 'bold' }} align="center">Id</TableCell> */}
                                      <StyledTableCell
                                        sx={{
                                          whiteSpace: "nowrap",
                                          fontWeight: "bold",
                                          width: "150px",
                                          textTransform: "Uppercase"
                                        }}
                                        align="center"
                                      >
                                        {i18?.SETUPPAYOUTS?.DATE || "Date"}
                                      </StyledTableCell>
                                      {/* <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">To Do</TableCell> */}
                                      <StyledTableCell
                                        sx={{
                                          whiteSpace: "nowrap",
                                          fontWeight: "bold",
                                          width: "150px",
                                          textTransform: "Uppercase"
                                        }}
                                        align="center"
                                      >
                                        {i18?.SETUPPAYOUTS?.TYPE || "Type"}
                                      </StyledTableCell>
                                      {/* <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', width: '150px', textTransform: 'Uppercase' }} align="center">{i18?.GUESTINBOX?.DETAILS || "Details"}</StyledTableCell> */}
                                      <StyledTableCell
                                        sx={{
                                          whiteSpace: "nowrap",
                                          fontWeight: "bold",
                                          width: "150px",
                                          textTransform: "Uppercase"
                                        }}
                                        align="center"
                                      >
                                        {i18?.BOOKINGPAGE?.AMOUNT || "Amount"}
                                      </StyledTableCell>
                                      {/* <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">{i18?.ACCOUNTINFO?.PAYOUTS || "Payouts"}</StyledTableCell>
                                                                            <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">{i18?.SETUPPAYOUTS?.CLEANINGFEE || "Cleaning Fee"}</StyledTableCell>
                                                                            <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">{i18?.SETUPPAYOUTS?.SERVICEFEE || "Service Fee"}</StyledTableCell> */}
                                      {/* <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">last modification</StyledTableCell>
                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">Action</StyledTableCell>
                                                        <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center"></StyledTableCell> */}
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {Array.isArray(history.trx) && history.trx.map((row: any) => (
                                        <>
                                          <StyledTableRow
                                            key={row._id}
                                            // hover
                                            sx={{
                                              // '&:nth-of-type(odd)': {
                                              //     backgroundColor: '#dddddd',
                                              // },
                                              "&:last-child td, &:last-child th":
                                                {
                                                  border: 0
                                                }
                                            }}
                                          >
                                            {/* <TableCell></TableCell> */}
                                            <TableCell
                                              sx={{ whiteSpace: "nowrap" }}
                                              align="center"
                                            >
                                              {" "}
                                              {format(
                                                historyDate,
                                                correctedDateFormat
                                              )}
                                            </TableCell>
                                            <TableCell
                                              sx={{ whiteSpace: "nowrap" }}
                                              align="center"
                                            >
                                              {row.type}
                                            </TableCell>
                                            {/* <TableCell></TableCell> */}
                                            <TableCell
                                              sx={{ whiteSpace: "nowrap" }}
                                              align="center"
                                            >
                                              {Math.round(
                                                row.amount *
                                                  currency.exchange_rate
                                              )}
                                            </TableCell>
                                            {/* <TableCell></TableCell> */}
                                            {/* <TableCell></TableCell> */}
                                            {/* <TableCell></TableCell> */}
                                          </StyledTableRow>
                                        </>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <TabPanel className={`${styles.panels}`} value="2">
                                    <div className=''>
                                        <div className={`${styles.guestcontent} pb-3`}>
                                            <div className={`${styles.referal}`}>
                                                <div className={`${styles.background}`}>
                                                    <div className={`pt-3 pb-2`}>
                                                        <select className='w-100 p-3'>
                                                            <option value='All Listings'>All Listings</option>
                                                        </select>
                                                    </div>
                                                    <div className={`d-flex justify-content-between pt-3 pb-2`}>
                                                        <h5 className='m-0'>Pending Payouts: <span>0.00</span></h5>
                                                        <button className={`${styles.button} d-flex align-items-center me-3`} onClick={handleExportOpen}>
                                                            Export CSV <ArrowForwardIosIcon className={`${styles.iosicon}`} />
                                                        </button>
                                                    </div>

                                                    <div className={`${styles.history}`}>
                                                        <p className='m-0'>You do not have any upcoming payouts</p>
                                                        <p className='m-0'>For the listings, and payout method currently selected</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel className={`${styles.panels}`} value="3">
                                    <div className=''>
                                        <div className={`${styles.guestcontent} pb-3`}>
                                            <div className={`${styles.referal}`}>
                                                <div className={`${styles.background}`}>
                                                    <div className={`d-flex pt-3 pb-2`}>
                                                        <div className={`${styles.month} w-25 me-2`}>
                                                            <h5>From:</h5>
                                                            <select className={`${styles.select} w-75`}>
                                                                <option>October</option>
                                                            </select>
                                                        </div>
                                                        <div className={`${styles.month} w-25 me-2`}>
                                                            <select className={`${styles.select} w-100`}>
                                                                <option>2023</option>
                                                            </select>
                                                        </div>
                                                        <div className={`${styles.month} w-25 me-2`}>
                                                            <h5>To:</h5>
                                                            <select className={`${styles.select} w-75`}>
                                                                <option>October</option>
                                                            </select>
                                                        </div>
                                                        <div className={`${styles.month} w-25 me-2`}>
                                                            <select className={`${styles.select} w-100`}>
                                                                <option>2023</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className={`d-flex justify-content-end pt-3 pb-2`}>
                                                        <div>
                                                            <button className={`${styles.button} d-flex align-items-center me-3`} onClick={handleExportOpen}>
                                                                Export CSV <ArrowForwardIosIcon className={`${styles.iosicon}`} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className={`${styles.history}`}>
                                                        <p className='m-0'>You do not have any transactions</p>
                                                        <p className='m-0'>For the dates, listings and payout method currently selected</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel> */}
              {/* </TabContext> */}
            </div>
          </div>
        </div>
      </div>

      <Popover
        className="mt-3"
        open={open}
        onClose={() => {
          setExportModal(null);
        }}
        anchorEl={exportModal}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <div className={`${styles.exportpopover}`}>
          <Box sx={style}>
            <div className="">
              <button className="w-100">
                {i18?.SETUPPAYOUTS?.EMAILCSVFILE || "Email CSV file"}
              </button>
            </div>
            <div className="">
              <button className="w-100">
                {i18?.SETUPPAYOUTS?.DOWNLOADCSVFILE || "Download CSV file"}
              </button>
            </div>
          </Box>
        </div>
      </Popover>
      {/* <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalCount || 0}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
    </>
  );
};
export default isAuth(Transaction);
