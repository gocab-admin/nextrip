'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { styled, tableCellClasses } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Header from '@/components/header';
import { getBankDetailsData } from '@/redux/slice/bankDetails';
import { dispatch } from '@/redux/store';
import { Error, Bank } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import APICONSTANT from '@/services/config';
import { addAlert } from '@/redux/slice/AlertSlice';
import { getApiMethod, postApiMethod } from '@/services/global';

import styles from './page.module.scss'

const TableRow: any = dynamic(() => import('@mui/material/TableRow'), { ssr: false })
const TableCell: any = dynamic(() => import('@mui/material/TableCell'), { ssr: false })
const TextField: any = dynamic(() => import('@mui/material/TextField'), { ssr: false })
const Link: any = dynamic(() => import('@mui/material/Link'), { ssr: false })
const Footer: any = dynamic(() => import('@/components/footer'), { ssr: false })
const TabPanel: any = dynamic(() => import('@mui/lab/TabPanel'), { ssr: false })
const TabList: any = dynamic(() => import('@mui/lab/TabList'), { ssr: false })
const Table: any = dynamic(() => import('@mui/material/Table'), { ssr: false })
const Breadcrumbs: any = dynamic(() => import('@mui/material/Breadcrumbs'), { ssr: false })
const TableBody: any = dynamic(() => import('@mui/material/TableBody'), { ssr: false })
const TableContainer: any = dynamic(() => import('@mui/material/TableContainer'), { ssr: false })
const TableHead: any = dynamic(() => import('@mui/material/TableHead'), { ssr: false })
const Typography: any = dynamic(() => import('@mui/material/Typography'), { ssr: false })
const Tab: any = dynamic(() => import('@mui/material/Tab'), { ssr: false })
const TabContext: any = dynamic(() => import('@mui/lab/TabContext'), { ssr: false })
const Paper: any = dynamic(() => import('@mui/material/Paper'), { ssr: false })

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgb(244, 246, 248)',
        color: 'rgb(99, 115, 129)',
        fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: 'rgb(221, 221, 221)',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
const PaymentsMethods = () => {
    const { i18, settings } = usePageContext();
    const data = useSelector((state: any) => state?.BankDetails)
    const router = useRouter()
    const [value, setValue] = useState('1');
    const [amount, setAmount] = useState('')
    const [fecth, setFetch] = useState<any>([])
    const [open, setOpen] = React.useState(false)
    const UserId: any = localStorage.getItem("appUserId")
    const handleOpenModal = () => {
        setOpen(true)
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(getBankDetailsData())
    }, [])

    const handleSubmitamount = async () => {
        if (data?.BankDetails?.[0]?._id) {
            const Data = {
                userBankId: data?.BankDetails?.[0]?._id,
                amt: amount
            }
            const res = await postApiMethod(APICONSTANT.payoutAount, Data)
            if (res.statusCode === 200) {
                dispatch(addAlert({
                    isOpen: true,
                    message: res.message,
                    type: "success",
                    severity: "success",
                }));
                setOpen(false)
            } else {
                dispatch(addAlert({
                    isOpen: true,
                    message: res.response.data.message,
                    type: "error",
                    severity: "error",
                }));
            }
        }
        else {
            dispatch(addAlert({
                isOpen: true,
                message: 'Create a Payout account',
                type: "error",
                severity: "error",
            }));
        }

    }
    const fetchData = async () => {
        try {
            const res = await getApiMethod(APICONSTANT.getpayout + `/${UserId}`)
            if (res.statusCode === 200) {
                setFetch(res.data.payoutHistories)
            }
        }
        catch {

        }
    }
    useEffect(() => {
        if (value === '3') {
            fetchData()
        }
    }, [value])
    console.log('settings', settings)
    return (
        <>
            <div className={`${styles.payments}`}>
                <Header center='hide' page='hide' />
                <div className={`${styles.tabpanel} mx-auto`}>
                    <div className={`${styles.breadcrums}`}>
                        <div className='mx-3'>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                                <Link className={`${styles.link}`} href="/account-settings">
                                    {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                                </Link>
                                <Typography color="text.primary">{i18?.PROFILE?.PAYTMENTSPAYOUTS || "Payments & payouts"}</Typography>
                            </Breadcrumbs>
                        </div>
                        <div>
                            <h1 className={`m-3`}>{i18?.PROFILE?.PAYTMENTSPAYOUTS || "Payments & payouts"}</h1>
                        </div>
                    </div>
                    <div className={`${styles.tab}`}>
                        <TabContext value={value}>
                            <div className={`${styles.tablist}`}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Accounts" value="1" />
                                    <Tab label={i18?.ACCOUNTINFO?.PAYOUTS || "Payouts"} value="2" />
                                    <Tab label="Payouts History" value="3" />
                                </TabList>
                            </div>

                            <TabPanel className={`${styles.panels}`} value="1">
                                <div className='d-flex flex-wrap '>
                                    <div>
                                        <div className={`${styles.guestcontent} p-3`}>
                                            <div className={`${styles.referal}`}>
                                                <div className={`${styles.background}`}>
                                                    <h5>{i18?.ACCOUNTINFO?.HOWYOUGETPAID || "How you’ll get paid"}</h5>
                                                    {data.BankDetails.length === 0 ?
                                                        <div className={`pt-3 pb-2`}>
                                                            <p className='m-0'>{i18?.ACCOUNTINFO?.ADDATLEASTONEPAYOUT || "Add at least one payout method so we know where to send your money."}</p>
                                                        </div>
                                                        :
                                                        <div>
                                                            <p>{i18?.ACCOUNTINFO?.YOUCANSENDMONEY || "you can send money to one or more payout methods."}</p>
                                                            <div className={`${styles.box}`}>
                                                                <div className='d-flex align-items-center'>
                                                                    <Error
                                                                        width="60"
                                                                        height="60"
                                                                        fill="currentColor"
                                                                    />
                                                                    <p className='mb-0'>{i18?.ACCOUNTINFO?.ITWILLTAKEUPTO || "it'll take up to 5 bussiness days for us to verify"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className='mt-4'>
                                                    {data.BankDetails && (
                                                        <>
                                                            {/* Filter and display Razorpay bank details */}
                                                            {settings?.hiddenSettings?.razorpay === "1" && (
                                                                <>
                                                                 <div style={{margin:0,color:'#000',fontSize:'20px',fontWeight:700}}>Razorpay</div>
                                                                    {Array.isArray(data.BankDetails) && data.BankDetails 
                                                                        .filter((bankDetail: any) => bankDetail?.paymentMethod === "razorpay")
                                                                        .map((bankDetail: any, index: number) => {
                                                                            const fullAccountNumber = bankDetail.acctNumber;
                                                                            const lastFourDigits = fullAccountNumber.slice(-4);
                                                                            const remainingDigits = "•".repeat(fullAccountNumber.length - 4);

                                                                            return (
                                                                                <div className="d-flex mt-4" key={`razorpay-${index}`}>
                                                                                    <Bank width="50" height="50" fill="currentColor" />
                                                                                    <div>
                                                                                        <span>{i18?.ACCOUNTINFO?.BANKACCOUNT || "BANK ACCOUNT"}</span>
                                                                                        <p>{bankDetail.acctHolderName}, {remainingDigits}{lastFourDigits}</p>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }

                                                                    {/* Show 'Add Razorpay' button if no Razorpay exists */}
                                                                    {Array.isArray(data.BankDetails) && !data.BankDetails .some((bankDetail: any) => bankDetail.paymentMethod === "razorpay") && (
                                                                         <div className={`pt-3 pb-3`}>
                                                                         <button className={`${styles.button}`} onClick={() => router.push('/account-settings/payments/setup?mode=razorpay')}>
                                                                             {i18?.ACCOUNTINFO?.SETUPPAYOUTS || "Set up payouts"}
                                                                         </button>
                                                                     </div>
             
                                                                    )}
                                                                </>
                                                            )}

                                                            {/* Filter and display Stripe bank details */}
                                                            {(
                                                                <>
                                                                 <div style={{margin:0,color:'#000',fontSize:'20px',fontWeight:700}}>Stripe</div>
                                                                    {Array.isArray(data.BankDetails) && data.BankDetails 
                                                                        .filter((bankDetail: any) => bankDetail?.paymentMethod === "stripe")
                                                                        .map((bankDetail: any, index: number) => {
                                                                            const fullAccountNumber = bankDetail.acctNumber;
                                                                            const lastFourDigits = fullAccountNumber.slice(-4);
                                                                            const remainingDigits = "•".repeat(fullAccountNumber.length - 4);

                                                                            return (
                                                                                <div className="d-flex mt-4" key={`stripe-${index}`}>
                                                                                    <Bank width="50" height="50" fill="currentColor" />
                                                                                    <div>
                                                                                        <span>{i18?.ACCOUNTINFO?.BANKACCOUNT || "BANK ACCOUNT"}</span>
                                                                                        <p>{bankDetail.acctHolderName}, {remainingDigits}{lastFourDigits}</p>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }

                                                                    {/* Show 'Add Stripe' button if no Stripe exists */}
                                                                    {Array.isArray(data.BankDetails) && !data.BankDetails .some((bankDetail: any) => bankDetail.paymentMethod === "stripe") && (
                                                                        <div className={`pt-3 pb-2`}>
                                                                        <button className={`${styles.button}`} onClick={() => router.push('/account-settings/payments/setup?mode=stripe')}>
                                                                            {i18?.ACCOUNTINFO?.SETUPPAYOUTS || "Set up payouts"}
                                                                        </button>
                                                                    </div>
            
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className={`${styles.makeall}`}>
                                        <div className='p-4'>
                                            <div>
                                                <h5>Need help?</h5>
                                            </div>
                                            <div>
                                                <Link href='' className={`d-flex justify-content-between pt-3 pb-2`}>
                                                    <p className={`${styles.link} m-0`}>When you'll get your payout</p>
                                                    <p className='m-0'><ArrowForwardIos fontSize='small' /></p>
                                                </Link>
                                                <Link href='' className={`d-flex justify-content-between pt-3 pb-2`}>
                                                    <p className={`${styles.link} m-0`}>How payouts work</p>
                                                    <p className='m-0'><ArrowForwardIos fontSize='small' /></p>
                                                </Link>
                                                <Link href='' className={`d-flex justify-content-between pt-3 pb-2`}>
                                                    <p className={`${styles.link} m-0`}>Go to your transaction history</p>
                                                    <p className='m-0'><ArrowForwardIos fontSize='small' /></p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </TabPanel>
                            <TabPanel className={`${styles.panels}`} value="2">
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        <div className={`${styles.guestcontent} p-3`}>
                                            <div className={`${styles.referal}`}>
                                                <div className={`${styles.background}`}>
                                                    {/* <h5>Your payments</h5>
                                                    <div className={`pt-3 pb-2`}>
                                                        <p className='m-0'>Keep track of all your payments and refunds.</p>
                                                    </div>
                                                    <div className={`pt-3 pb-2`}>
                                                        <button className={`${styles.button}`}>
                                                            Manage payments
                                                        </button>
                                                    </div> */}
                                                    <div className={`pt-3 pb-2`}>
                                                        <h5>{i18?.ACCOUNTINFO?.PAYMENTMETHODS || "Payment methods"}</h5>
                                                        <p className='m-0'>{i18?.ACCOUNTINFO?.ADDAPAYMENTTOYOURVERFIED || "Add a payment to your verified payout account."}</p>
                                                    </div>
                                                    {
                                                        !open &&
                                                        <div className={`pt-3 pb-2`}>
                                                            <button onClick={handleOpenModal} className={`${styles.button}`}>
                                                                {i18?.ACCOUNTINFO?.ADDPAYMENT || "Add payment"}
                                                            </button>
                                                        </div>
                                                    }

                                                    {
                                                        open &&
                                                        <div>
                                                            <div className='my-4'>
                                                                <TextField
                                                                    className='w-100'
                                                                    id="filled-text-input"
                                                                    label='Enter payout amount'
                                                                    type="text"
                                                                    variant="standard"
                                                                    onChange={(e: any) => setAmount(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className='d-flex justify-content-between'>


                                                                <button className={`${styles.button}`} onClick={() => setOpen(false)}>
                                                                    {i18?.BOOKINGPAGE?.CANCEL || "Cancel"}
                                                                </button>
                                                                <button className={`${styles.button}`} onClick={handleSubmitamount}>
                                                                    {i18?.LISTING?.SUBMIT || "Submit"}
                                                                </button>
                                                            </div>

                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className='my-3'>
                                            <div className={`${styles.divider}`}></div>
                                        </div>
                                        <div className={`${styles.referal}`}>
                                            <div className={`${styles.background} p-3`}>
                                                <h5><Website/> gift credit</h5>
                                                <div className={`pt-3 pb-2`}>
                                                    <Link href='/account-settings/gift'>
                                                       <button className={`${styles.button}`}>
                                                           Add gift card
                                                       </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className='p-3'>
                                                <h5>Coupons</h5>
                                            </div>

                                            <div className='my-3'>
                                                <div className={`${styles.divider}`}></div>
                                            </div>
                                            <div className={`d-flex justify-content-between pt-3 pb-2`}>
                                                <p className='m-0 p-3 d-flex align-items-center'>Your coupons</p>
                                                <h6 className='m-0 p-3 d-flex align-items-center'>0</h6>
                                            </div>

                                            <div className='my-3'>
                                                <div className={`${styles.divider}`}></div>
                                            </div>
                                            {!redeemOpen &&
                                                <div>
                                                    <div className='my-4'>
                                                        <TextField
                                                            className='w-100'
                                                            id="filled-text-input"
                                                            label='Enter a coupon code'
                                                            type="text"
                                                            variant="standard"/>
                                                    </div>
                                                    <div className='d-flex justify-content-between'>
                                                        <button className={`${styles.button}`}>
                                                            Redeem coupon
                                                        </button>

                                                        <button className={`${styles.button}`} onClick={handleClose}>
                                                            Cancel
                                                        </button>
                                                    </div>

                                                </div>
                                            }
                                            {redeemOpen &&
                                                <div className={`pt-3 pb-2 p-3`}>
                                                    <button className={`${styles.button}`} onClick={handleClick}>
                                                        Add coupon
                                                    </button>
                                                </div>
                                            }
                                        </div> */}

                                    </div>
                                    {/* <div className={`${styles.makeall}`}>
                                        <div className='p-4'>
                                            <PaymentsMethod
                                                style={{
                                                    display: 'block',
                                                    height: '48px',
                                                    width: '48px',
                                                    fill: 'rgb(227, 28, 95)',
                                                    stroke: 'currentcolor'
                                                }}
                                            />
                                            <div>
                                                <h6>{i18?.ACCOUNTINFO?.MAKEALLPAYMENTS || "Make all payments through"} <Website /></h6>
                                            </div>
                                            <div>
                                                <p className={`${styles.para}`}>
                                                    {i18?.ACCOUNTINFO?.ALWAYSPLAYANDCOMMUNICATE || "Always pay and communicate through"} <Website /> {i18?.ACCOUNTINFO?.TOENSUREYOUAREPROTECTED || "to ensure you're protected under our"} &nbsp;
                                                    <a href="/terms" className="l1ovpqvx b1uxatsa c1qih7tm dir dir-ltr">{i18?.ACCOUNTINFO?.TERMSOFSERVICE || "Terms of Service"}</a>, &nbsp;
                                                    <a href="/terms/payments_terms" className="l1ovpqvx b1uxatsa c1qih7tm dir dir-ltr">{i18?.ACCOUNTINFO?.PAYMENTS || "Payments"}+" "+{i18?.ACCOUNTINFO?.TERMSOFSERVICE || "Terms of Service"}</a>
                                                    {i18?.ACCOUNTINFO?.CANCELLATIONANDOTHER|| ", cancellation, and other safeguards."} &nbsp;
                                                    <a href="/help/topic/1121/payment-methods?q=payments"
                                                        className="l1ovpqvx b1uxatsa c1qih7tm dir dir-ltr">{i18?.ACCOUNTINFO?.LEARNMORE || "Learn more"}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </TabPanel>
                            <TabPanel className={`${styles.panels}`} value="3">
                                <div className='pt-4'>
                                    <TableContainer component={Paper} sx={{ border: '#000' }}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', width: '150px', textTransform: 'Uppercase' }} align="center">{i18?.BOOKINGPAGE?.AMOUNT || "Amount"}</StyledTableCell>
                                                    <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">{i18?.ACCOUNTINFO?.DESTINATION || "Destination"}</StyledTableCell>
                                                    <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textTransform: 'Uppercase' }} align="center">{i18?.ACCOUNTINFO?.TRANSACTION || "Transaction"}</StyledTableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {
                                                    fecth.map((row: any) => {
                                                        return (
                                                            <StyledTableRow key={row._id}>
                                                                <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">{row.amount}</TableCell>
                                                                <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">{row.destination}</TableCell>
                                                                <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">{i18?.ACCOUNTINFO?.DEBIT || "Debit"}</TableCell>
                                                            </StyledTableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </TabPanel>
                        </TabContext>
                    </div>
                </div>
            </div>
            <div>
                <Footer />
            </div>
            {/* <CustomModal open={open} onClose={handleCloseModal}>
                <div className={`${styles.modal} `}>
                    <h6>Add Amount</h6>
                    <div className={`${styles.details}`}>
                        <div className={`${styles.icon}`}>
                            <Card1  
                       style={{
                       height: '34px',
                       width: '34px',
                     }}/>
                      <Card2 
                       style={{
                       height: '34px',
                       width: '34px',
                     }}/>
                      <Card3  
                       style={{
                       height: '34px',
                       width: '50px',
                     }}/>
                      <Card4  
                       style={{
                       height: '34px',
                       width: '70px',
                     }}/>
                        </div>
                    </div>
                    <div className='p-3'>

                    </div>
                    <div className={`${styles.bottom} p-3`}>
                        <button onClick={handleCloseModal} className={`${styles.button2}`}>
                            Cancel
                        </button>
                        <button >
                            Done
                        </button>
                    </div>
                </div>
            </CustomModal> */}
        </>
    )
}

export default PaymentsMethods;
