'use client'
import React from 'react';
import {
    Breadcrumbs,
    Link,
    TextField,
    Typography
} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { Keep, Simple, Trip, Website } from '@/app/global/svg';
import Header from '@/components/header';
import { usePageContext } from "@/components/Providers/PageContext";
import Footer from '@/components/footer';

import styles from './page.module.scss'

const PaymentsMethods = () => {
    const {i18} = usePageContext();

    return (
        <>
            <div className={`${styles.forwork}`}>
                <Header center='hide' page='hide' />
                <div className={`${styles.tabpanel}`}>
                    <div className={`${styles.breadcrums}`}>
                        <div className='mx-3'>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                                <Link color="inherit" href="/account-settings">
                                    {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                                </Link>
                                <Typography color="text.primary">{i18?.ACCOUNTINFO?.TRAVELFORWORK || "Travel for work"}</Typography>
                            </Breadcrumbs>
                        </div>
                        <div>
                            <h1 className={`m-3`}>{i18?.ACCOUNTINFO?.TRAVEL || "Travel"} {i18?.ACCOUNTINFO?.FORWORK || "for Work"}</h1>
                        </div>
                    </div>
                    <div className={`${styles.tab}`}>
                        <div className={`${styles.tabwidth}`}>
                            <div className='px-3'>
                                <div className={` pt-3 pb-2`}>
                                    <h5 className='m-0'>{i18?.ACCOUNTINFO?.JOIN || "Join"} <Website/> {i18?.ACCOUNTINFO?.FORWORK || "for Work"}</h5>
                                </div>
                                <div>
                                    <p>{i18?.ACCOUNTINFO?.ADDYOURWORKEMAILTOGET || "Add your work email to get seamless expensing and exclusive offers on work trips."}</p>
                                </div>
                                <div className='mb-3'>
                                    <h6>{i18?.ACCOUNTINFO?.WORKEMAILADDRESS || "Work email address"}</h6>
                                </div>
                                <div>
                                    <TextField className='w-100' />
                                </div>
                                <div>
                                    <div className='my-3'>
                                        <button className={`${styles.save}`}>{i18?.ACCOUNTINFO?.ADDWORKEMAIL || "Add work email"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.makeall}`}>
                            <div className='p-4'>
                                <div>
                                    <div>
                                        <Simple
                                            style={{
                                                display: 'block',
                                                height: '32px',
                                                width: '32px',
                                                fill: '#FF5A5F'
                                            }}
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <h5>{i18?.ACCOUNTINFO?.SIMPLIFIEDEXPENSING|| "Simplified expensing"}</h5>
                                    </div>
                                    <div>
                                        <p>{i18?.ACCOUNTINFO?.WEWILLSENDWORKTRIP || "We’ll send work trip receipts to your work inbox for easy expensing."}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Trip
                                            style={{
                                                display: 'block',
                                                height: '32px',
                                                width: '32px',
                                                fill: '#FF5A5F'
                                            }}
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <h5>{i18?.ACCOUNTINFO?.TRIPDESCRIPTION || "Trip description"}</h5>
                                    </div>
                                    <div>
                                        <p>{i18?.ACCOUNTINFO?.ADDANEXPENSECODE || "Add an expense code and business purpose to work trips."}</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Keep
                                            style={{
                                                display: 'block',
                                                height: '32px',
                                                width: '32px',
                                                fill: '#FF5A5F'
                                            }}
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <h5>{i18?.ACCOUNTINFO?.KEEPPERSONALTRIPS || "Keep personal trips private"}</h5>
                                    </div>
                                    <div>
                                        <p>{i18?.ACCOUNTINFO?.YOURCOMPANYONLYGET || "Your company can only get info about trips you mark for work at checkout."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}

export default PaymentsMethods;
