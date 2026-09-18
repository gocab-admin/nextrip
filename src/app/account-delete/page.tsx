'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { MobileStepper } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import isAuth from '@/components/isAuth';
import { usePageContext } from "@/components/Providers/PageContext";
import { DeleteTick, SmallTick, Starlogo, Website } from '@/app/global/svg';

import styles from './page.module.scss'

const steps = ['Select reason', 'Confirm', 'Done'];

const AccountDelete = () => {
    const {i18 } = usePageContext();
    const theme = useTheme();
    const navigate = useRouter();

    const [activeStep, setActiveStep] = useState(0);
    const [selectedList, setSelectedList] = useState<string>('');
    const [continueButton, setContinueButton] = useState(true)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        navigate.push("/")
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <div className='d-flex align-items-center my-3 px-4'>
                    <Starlogo/>

                    <div className={`${styles.stepper}`}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </div>
                </div>
                <div className={`${styles.bar}`}>
                    <MobileStepper
                        variant="progress"
                        steps={3}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button className='d-none' size="small" onClick={handleNext} disabled={activeStep === 3}>
                                {i18?.BUTTONS?.NEXT || "Next"}
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button className='d-none' size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight />
                                ) : (
                                    <KeyboardArrowLeft />
                                )}
                                {i18?.LISTING?.BACK || "Back"}
                            </Button>
                        }
                    />
                </div>
            </Box>
            <section className='p-5'>
                <div className={`${styles.accountdelete} d-flex justify-content-center`}>
                    <div className={`${styles.deactivate}`}>
                        {activeStep === 0 &&
                            <section>
                                <div>
                                    <h1>{i18?.PAGES?.WHATPROMPTEDYOUTO || "What prompted you to deactivate?"}</h1>
                                </div>
                                <div>
                                    <fieldset className={`${styles.fieldset}`}>
                                        <div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex justify-content-between align-items-center py-4">
                                                        <div className="_1jdtnhle">
                                                            <div className="_fs9exd">{i18?.PAGES?.IHAVESAFETYORPRIVACY || "I have safety or privacy concerns."}
                                                            </div>
                                                        </div>
                                                        <div className="_zkrkb6">
                                                            <div className="d-flex">
                                                                <input id="feedback[category]_0" className={`${styles.radio} me-2`} aria-invalid="false" name="feedback[category]" type="radio" value="general feedback about the inbox"
                                                                    onChange={(e) => {
                                                                        setSelectedList(e.target.value)
                                                                        setContinueButton(false)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex justify-content-between align-items-center py-4">
                                                        <div className="_1jdtnhle">
                                                            <div className="_fs9exd">{i18?.PAGES?.ICANNOTHOSTANYMORE || "I can’t host anymore."}
                                                            </div>
                                                            {selectedList === 'I can’t host anymore' &&
                                                                <div>
                                                                    {i18?.PAGES?.ALTERNATIVELYYOUCAN || "Alternatively, you can"} &nbsp;
                                                                    <a className={`${styles.link}`} href='#'>{i18?.PAGES?.DEACTIVATEALISTING || "deactivate a listing"}</a>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="_zkrkb6">
                                                            <div className="d-flex">
                                                                <input id="feedback[category]_1" className={`${styles.radio} me-2`} aria-invalid="false" name="feedback[category]" type="radio" value="I can’t host anymore"
                                                                    onChange={(e) => {
                                                                        setSelectedList(e.target.value)
                                                                        setContinueButton(false)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex justify-content-between align-items-center py-4">
                                                        <div className="_1jdtnhle">
                                                            <div className="_fs9exd">{i18?.PAGES?.ICANNOTCOMPLYWITH || "I can't comply with "}<Website/>'s {i18?.ACCOUNTINFO?.TERMSOFSERVICE || "Terms of Service"} / Community Commitment.</div>
                                                        </div>
                                                        <div className="_zkrkb6">
                                                            <div className="d-flex">
                                                                <input id="feedback[category]_2" className={`${styles.radio} me-2`} aria-invalid="false" name="feedback[category]" type="radio" value="scheduledMessages"
                                                                    onChange={(e) => {
                                                                        setSelectedList(e.target.value)
                                                                        setContinueButton(false)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex justify-content-between align-items-center py-4">
                                                        <div className="_1jdtnhle">
                                                            <div className="_fs9exd">{i18?.PAGES?.OTHER || "Other"}</div>
                                                        </div>
                                                        <div className="_zkrkb6">
                                                            <div className="d-flex">
                                                                <input id="feedback[category]_2" className={`${styles.radio} me-2`} aria-invalid="false" name="feedback[category]" type="radio" value="Other"
                                                                    onChange={(e) => {
                                                                        setSelectedList(e.target.value)
                                                                        setContinueButton(false)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            {selectedList === 'Other' &&
                                                <div className={`${styles.label}`}>
                                                    <label className='w-100'>
                                                        <div className='py-4'>
                                                            <div>
                                                                <p className='m-0'>{i18?.TRIPS?.REASON || "Reason"}</p>
                                                            </div>
                                                            <div className=''>
                                                                <input className='w-100 p-2' type="text" placeholder='Why are you leaving?' />
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            }
                                        </div>
                                    </fieldset>
                                </div>
                                <div className='d-flex justify-content-end py-3'>
                                    <Button disabled={continueButton} className={`${continueButton ? styles.disable : styles.continue}`} onClick={handleNext}>
                                        {i18?.AUTH?.CONTINUE || "Continue"}
                                    </Button>
                                </div>
                            </section>
                        }
                        {activeStep === 1 &&
                            <section>
                                <div>
                                    <h1>{i18?.PAGES?.DEACTIVATEACCOUNT || "Deactivate account?"}</h1>
                                    <p>santhoshabs64@gmail.com</p>
                                </div>
                                <div>
                                    <fieldset className={`${styles.fieldset}`}>
                                        <div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex py-4">
                                                        <div className="me-3">
                                                            <div className="_fs9exd">
                                                                <SmallTick
                                                                    style={{
                                                                        display: "block",
                                                                        fill: "currentcolor",
                                                                        height: "24px",
                                                                        width: "24px",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="w-75">
                                                            <div className="">
                                                                {i18?.PAGES?.THEPROFILEANDLISTINGS || "The profile and listings associated with this account will disappear."}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex py-4">
                                                        <div className="me-3">
                                                            <div className="_fs9exd">
                                                                <SmallTick
                                                                    style={{
                                                                        display: "block",
                                                                        fill: "currentcolor",
                                                                        height: "24px",
                                                                        width: "24px",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="w-75">
                                                            <div className="">
                                                                {i18?.PAGES?.YOUWONTBEABLETO || "You won’t be able to access the account info or past reservations."}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div className='d-flex justify-content-between py-3'>
                                    <Button
                                        className={`${styles.back}`}
                                        color="inherit"
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        <ArrowBackIosIcon />
                                        {i18?.LISTING?.BACK || "Back"}
                                    </Button>
                                    <Button className={`${styles.continue}`} onClick={handleNext}>
                                        {i18?.PAGES?.DEACTIVATEACCOUNT || "Deactivate account"}
                                    </Button>
                                </div>

                            </section>
                        }
                        {activeStep === 2 &&
                            <section>
                                <div className='pb-3'>
                                    <DeleteTick
                                        style={{
                                            display: "block",
                                            fill: "rgb(96, 182, 181)",
                                            height: "48px",
                                            width: "48px",
                                        }}
                                        colors="#484848"
                                    />
                                </div>
                                <div>
                                    <h1>{i18?.PAGES?.ACCOUNTDEACTIVATE || "Account deactivate"}</h1>
                                </div>
                                <div>
                                    <fieldset className={`${styles.fieldset}`}>
                                        <div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex py-4">
                                                        <div className="me-3">
                                                            <div className="_fs9exd">
                                                                <SmallTick
                                                                    style={{
                                                                        display: "block",
                                                                        fill: "currentcolor",
                                                                        height: "24px",
                                                                        width: "24px",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="w-75">
                                                            <div className="">
                                                                {i18?.PAGES?.YOURPROFILEANDLISTINGS || "Your profile and listings are no longer visible."}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className={`${styles.label}`}>
                                                <label className="w-100 ">
                                                    <div className="d-flex py-4">
                                                        <div className="me-3">
                                                            <div className="_fs9exd">
                                                                <SmallTick
                                                                    style={{
                                                                        display: "block",
                                                                        fill: "currentcolor",
                                                                        height: "24px",
                                                                        width: "24px",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="w-75">
                                                            <div className="">
                                                                {i18?.PAGES?.YOUWONTBEACCESS || "You won’t be able to access the account info or reservations associated with it."}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div className='py-3'>
                                    <Button
                                        className={`${styles.continue}`}
                                        color="inherit"
                                        onClick={handleReset}
                                    >
                                        {i18?.ROOMPAGE?.CLOSE || "Close"} 
                                    </Button>
                                </div>

                            </section>
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
export default isAuth(AccountDelete);
