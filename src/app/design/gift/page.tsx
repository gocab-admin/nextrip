/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import {Typography,Accordion,AccordionSummary,AccordionDetails} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Website } from '@/app/global/svg';
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

export default function gifts() {
    const {i18} = usePageContext();
    return(
        <div className={`${styles.host}`}>
        <Header center='hide' page='hide' />
        <div className={`${styles.body}`}>
            <div className={`${styles.bodyLeft}`}>
                <h1>
                   {i18?.ACCOUNTINFO?.LETSREDEEMYOUR || "Let’s redeem your gift card"}
                </h1>
                <TextField id="outlined-basic" label="PIN" variant="outlined"  fullWidth sx={{mt:4,mb:4}} />
                <span className={`${styles.span}`}>{i18?.ACCOUNTINFO?.BYREDEEMINGYOU || "By redeeming, you agree to the "} <Link className={`${styles.Link}`} href='/'><Website/> {i18?.ACCOUNTINFO?.TERMSCONDITION || "terms & condition"}</Link></span>
                <button>
                    {i18?.ACCOUNTINFO?.REDEEMGIFTCARDS || "Redeem gift cards"}
                </button>
            </div>
            <div className={`${styles.bodyRight}`}>
                <div className={`${styles.box}`}>

                </div>
            </div>
            <div className={`${styles.bodyBottom}`}>
             <h1>
             {i18?.ACCOUNTINFO?.FREQUENTLYASKED || "Frequently asked questions"}
             </h1>
             <p>{i18?.ACCOUNTINFO?.FOROTHERQUESTIONS || "For other questions, visit our "}<Link className={`${styles.Link}`} href='/'>{i18?.LISTING?.HELPCENTRE || "Help Centre"}</Link></p>
            </div>
            <div className={`${styles.bottomRight}`}>
                <Accordion className={`${styles.accordion}`}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{i18?.ACCOUNTINFO?.ISTHEREFERRAL || "Is the referral programme still open?"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        {i18?.ACCOUNTINFO?.GIFTCARDSCANBEUSED || "Gift cards can be used for any stay, Experience or Online Experience on "}<Website/>.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={`${styles.accordion}`}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{i18?.ACCOUNTINFO?.DOGIFTCARDSEXPIRE || "Do gift cards expire?"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        {i18?.ACCOUNTINFO?.GIFTCARDSCANBEUSED || "Gift cards can be used for any stay, Experience or Online Experience on "} <Website/>.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={`${styles.accordion}`}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{i18?.ACCOUNTINFO?.WHYDOINEEDTOADD || "Why do I need to add an additional payment method?"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        {i18?.ACCOUNTINFO?.GIFTCARDSCANBEUSED || "Gift cards can be used for any stay, Experience or Online Experience on "}<Website/>.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={`${styles.accordion}`}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{i18?.ACCOUNTINFO?.HOWCANICHECK || "How can I check my gift card balance?"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        {i18?.ACCOUNTINFO?.GIFTCARDSCANBEUSED || "Gift cards can be used for any stay, Experience or Online Experience on "}<Website/>.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={`${styles.accordion}`}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{i18?.ACCOUNTINFO?.WHATIFILOSE || "What if I lose my gift card?"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        {i18?.ACCOUNTINFO?.GIFTCARDSCANBEUSED || "Gift cards can be used for any stay, Experience or Online Experience on "}<Website/>.
                        </Typography>
                    </AccordionDetails> 
                </Accordion>
            </div>
        </div>
        <Footer/>
        </div>
    )
      
  };
    
