import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { MuiOtpInput } from "mui-one-time-password-input";
import { usePathname, useRouter ,useSearchParams} from 'next/navigation'

import { Mail } from '@/app/global/svg';
import { dispatch } from '@/redux/store';
import { setModal } from '@/redux/slice/modalSlice';
import { getSendByEmail, getVerifyByEmail } from '@/redux/slice/EmailOTP';
import { useAppSelector } from "@/redux/hooks";
import { addUser, userSelector } from "@/redux/slice/user/userSlice";
import { addAlert } from '@/redux/slice/AlertSlice';
import DynamicButtonComponent from '@/components/DynamicComponent/ButtonComponent';
import { usePageContext } from "@/components/Providers/PageContext";
import APICONSTANT from '@/services/config';
import { getApiMethod } from '@/services/global';

import styles from "./editModal.module.scss";
import { ModalLoader } from './loader'

const EmailModal = () => {
    // const navigate = useRouter()
    const {i18} = usePageContext();
    const defaultOtp = useSelector((state: any) => state.userReducer);
    const pathname = usePathname()
    const searchParams: any = useSearchParams();
    const router = useRouter();
    const { userInfo } = useAppSelector(userSelector);
    const redirectURL = searchParams.get('redirecturl');
    const [viewMail, setViewMail] = useState(true)
    const [view, setView] = useState(false)
    const [otpValue, setOtpValue] = useState<string>('')
    const [Loader, seLoader] = useState(false)
    const handleEmail = async () => {
        seLoader(true)
        const res = await dispatch(getSendByEmail({ email: userInfo?.email }))
        if (res.statusCode === 200) {
            seLoader(false)
            setViewMail(false)
            setView(true);
            dispatch(addAlert({
                isOpen: true,
                message: res.message,
                type: "success",
                severity: "success"
            }))
        }
        else {
            seLoader(false)
            // router.push('/');
            // localStorage.removeItem('appToken');
            dispatch(addAlert({
                isOpen: true,
                message: res.response.data.message,
                type: "error",
                severity: "error"
            }));
        }
    }
    const handleEmailOTP = async () => {
        
        const res = await dispatch(getVerifyByEmail({ email: userInfo?.email, otp: parseInt(otpValue) }))
        if (res.statusCode === 200) {
           const resp = await getApiMethod(APICONSTANT.signup);
           if(resp.statusCode === 200){
            dispatch(addUser(resp.data.userDetail));
           }
           if(pathname === '/verify/' && redirectURL !== null){
            router.push(redirectURL);
           }
           else if(pathname === '/verify/' && redirectURL === null){
            router.push('/');
           }
            else{
                dispatch(setModal('' as any))
            }
            dispatch(addAlert({
                isOpen: true,
                message: res.message,
                type: "success",
                severity: "success"
            }))
        }
        else {
            router.push('/');
            // localStorage.removeItem('token');
            dispatch(addAlert({
                isOpen: true,
                message: res.response.data.message,
                type: "error",
                severity: "error"
            }));
        }
    }
    const handleChange = (newValue: string) => {
        setOtpValue(newValue)
    }

    const formatEmail = (email: any) => {
        const atIndex = email?.indexOf('@');
        const [username, domain] = [email?.slice(0, atIndex), email?.slice(atIndex + 1)];
        const [shortUsername, shortDomain] = [username?.slice(0, 2), domain?.slice(0, 2)];
        return `${shortUsername}*****@${shortDomain}***.com`;
    };

    return (
        <>
            <div className={pathname === '/verify/' ? 'd-flex align-items-center p-2' : 'd-flex align-items-center border-bottom p-2'} style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'white'
            }}>
                {
                    view ? (
                        <IconButton
                            onClick={() => {
                                setViewMail(true);
                                setView(false);
                            }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                    ) : (
                        pathname === '/verify/' ? (
                            <></>
                        ) : (
                            <IconButton
                                onClick={() => dispatch(setModal('' as any))}
                            >
                                <CloseIcon />
                            </IconButton>
                        )
                    )
                }
                <h4 className='flex-fill text-center m-0'>{i18?.PROFILE?.CONFIRMACCOUNT || "Confirm account"}</h4>
            </div >
            {viewMail &&
                <div className='p-4'>
                    {
                        Loader && <ModalLoader />
                    }
                    <h4>{i18?.PROFILE?.LETUSKNOWITS || "Let us know it's really you"}</h4>
                    <p className='mt-3'>{i18?.PROFILE?.TOCONTINUEYOUWILL || "To continue, you'll need to confirm your account throught email"}</p>
                    <div className='mt-5 container ' onClick={handleEmail} style={{ cursor: 'pointer' }}>
                        <div className='d-flex justify-content-between'>
                            <div className={`${styles.row}`}>
                                <Mail
                                    width="35"
                                    height="30"
                                    fill="currentColor"
                                />
                                <p className='mt-1'> {i18?.SETUPPAYOUTS?.EMAIL || "Email"}</p>
                            </div>
                            <div className=''>

                                <ArrowForwardIosIcon />
                            </div>
                        </div>




                    </div>
                </div>
            }

            {
                view &&
                <>

                    <div className='p-4'>

                        <div className='mb-4'>
                            <h4>{i18?.PROFILE?.ENTERYOURVERIFICATION || "Enter your verification code"}</h4>
                            <p className='mt-3 mb-0'>{i18?.PROFILE?.ENTERTHECODE || "Enter the code we've emailed to"} {formatEmail(userInfo?.email)}</p>
                        </div>
                        <div>
                            <MuiOtpInput
                                value={otpValue}
                                onChange={handleChange}
                                length={4}
                                autoFocus
                                validateChar={(character: string, index: number) => true}
                                sx={{
                                    gap: '5px'
                                }}
                            />
                        </div>
                        <div >
                        <p className='mt-3 mb-0'>Default OTP: {defaultOtp?.userInfo?.emailOtp}</p>
                        </div>
                        
                        <div style={{ display:"flex",marginTop: "15px",  width: "100%", maxWidth: "100%"}}>
                            <DynamicButtonComponent variant="contained" onClick={handleEmailOTP} text={i18?.AUTH?.CONTINUE || "Continue"}/>
                        </div>
                    </div>

                </>
            }

        </>
    )
}

export default EmailModal
