'use client'
import React, { useState } from 'react'
import {Breadcrumbs,Link,MenuItem,Select,Typography} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { PreferencesTog, Website } from '@/app/global/svg';
import { usePageContext } from "@/components/Providers/PageContext";

import styles from './page.module.scss'

const PaymentsMethods = () => {
    const {i18} = usePageContext();
    const [selectOpen, setSelectOpen] = useState(false)
    const [selectValue, setSelectValue] = useState('')
    const [selectOption, setSelectOption] = useState('')

    const handleOpen = (event: any) => {
        setSelectValue(event.target.value)
        setSelectOpen(true)
    }

    const handleChange = (event: any) => {
        setSelectOption(event.target.value)
    }

    const handleSave = () => {
        setSelectOpen(false)
    }


    return (
        <>
            <div className={`${styles.preference}`}>
                <Header center='hide' page='hide'/>
                <div className={`${styles.tabpanel} mx-auto`}>
                    <div className={`${styles.breadcrums}`}>
                        <div className='mx-3'>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                                <Link color="inherit" href="/account-settings">
                                    {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                                </Link>
                                <Typography color="text.primary">{i18?.HOSTHOMEPAGE?.GLOBALPREFERENCE || "Global preferences"}</Typography>
                            </Breadcrumbs>
                        </div>
                        <div>
                            <h1 className={`m-3`}>{i18?.HOSTHOMEPAGE?.GLOBALPREFERENCE || "Global preferences"}</h1>
                        </div>
                    </div>
                    <div className={`${styles.tab}`}>
                        <div className={`${styles.tabwidth}`}>
                            <div className='p-3'>
                                <div className={`d-flex justify-content-between pt-3 pb-2`}>
                                    <p className='m-0'>{i18?.HOSTHOMEPAGE?.PREFERREDLANGUAGE || "Preferred language"}</p>
                                    <button className={`${styles.button} m-0`} value='language' onClick={(e) => { handleOpen(e) }}>
                                        {selectOpen && selectValue === 'language' ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                <div className='mb-3'>
                                    {!selectOpen &&
                                        <span>
                                           { 'English' || {selectOption}}
                                        </span>
                                    }
                                    {selectOpen && selectValue === 'language' &&
                                        <span>
                                            {i18?.HOSTHOMEPAGE?.THISUPDATESWHATYOUREAD || "This updates what you read on "}<Website/>, {i18?.HOSTHOMEPAGE?.ANDHOWWECOMMUNICATE || "and how we communicate with you."}
                                        </span>
                                    }
                                </div>
                                {selectValue === 'language' && selectOpen &&
                                    <div>
                                        <div>
                                            <Select className='w-100' onChange={(e) => { handleChange(e) }}>
                                                <MenuItem value='English'>English</MenuItem>
                                                <MenuItem value='English(UK)'>English(UK)</MenuItem>
                                                <MenuItem value='English(Canada)'>English(Canada)</MenuItem>
                                            </Select>
                                        </div>
                                        <div className='my-3'>
                                            <button className={`${styles.save}`} onClick={handleSave}>{i18?.BUTTONS?.SAVE || "Save"}</button>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='my-3'>
                                <div className={`${styles.divider}`}></div>
                            </div>
                            <div className='p-3'>
                                <div className={`d-flex justify-content-between pt-3 pb-2`}>
                                    <p className='m-0'>{i18?.HOSTHOMEPAGE?.PREFERREDCURRENCY || "Preferred currency"}</p>
                                    <button className={`${styles.button} m-0`} value='currency' onClick={(e) => { handleOpen(e) }}>
                                        {selectOpen && selectValue === 'currency' ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                <div className='mb-3'>
                                    <span>
                                        {`Indian Rupee` || `${selectOption}`}
                                    </span>
                                </div>
                                {selectOpen && selectValue === 'currency' &&
                                    <div>
                                        <div>
                                            <Select className='w-100' onChange={(e) => { handleChange(e) }}>
                                                <MenuItem value='Indian Rupee'>Indian Rupee</MenuItem>
                                                <MenuItem value='Australian dollar'>Australian dollar</MenuItem>
                                                <MenuItem value='Canadian dollar'>Canadian dollar</MenuItem>
                                            </Select>
                                        </div>
                                        <div className='my-3'>
                                            <button className={`${styles.save}`} onClick={handleSave}>{i18?.BUTTONS?.SAVE || "Save"}</button>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='my-3'>
                                <div className={`${styles.divider}`}></div>
                            </div>
                            <div className='p-3'>
                                <div className={`d-flex justify-content-between pt-3 pb-2`}>
                                    <p className='m-0'>{i18?.HOSTHOMEPAGE?.TIMEZONE || "Time zone"}</p>
                                    <button className={`${styles.button} m-0`} value='time' onClick={(e) => { handleOpen(e) }}>
                                        {selectOpen && selectValue === 'time' ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                <div className='mb-3'>
                                    <span>
                                        {'' || `${selectOption}`}
                                    </span>
                                </div>
                                {selectOpen && selectValue === 'time' &&
                                    <div>
                                        <div>
                                            <Select className='w-100' onChange={(e) => { handleChange(e) }}>
                                                <MenuItem value='(GMT+05:30) New Delhi'>(GMT+05:30) New Delhi</MenuItem>
                                                <MenuItem value='(GMT+05:30) Mumbai'>(GMT+05:30) Mumbai</MenuItem>
                                                <MenuItem value='(GMT+05:30) Chennai'>(GMT+05:30) Chennai</MenuItem>
                                            </Select>
                                        </div>
                                        <div className='my-3'>
                                            <button className={`${styles.save}`} onClick={handleSave}>{i18?.BUTTONS?.SAVE || "Save"}</button>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='my-3'>
                                <div className={`${styles.divider}`}></div>
                            </div>
                        </div>
                        <div className={`${styles.makeall}`}>
                            <div className='p-4'>
                                <div>
                                    <PreferencesTog
                                        style={{
                                            display: 'block',
                                            height: '40px',
                                            width: '40px',
                                            fill: '#FFB400',
                                        }}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <h5>{i18?.HOSTHOMEPAGE?.GLOBALPREFERENCE || "Your global preferences"}</h5>
                                </div>
                                <div>
                                    <div>
                                        <p>{i18?.HOSTHOMEPAGE?.CHANGINGYOURCURRENCY || "Changing your currency updates how you see prices. You can change how you get payments in your payments & payouts preferences."}</p>
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
