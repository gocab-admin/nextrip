import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button, IconButton } from '@mui/material';
import { Comment } from 'react-loader-spinner';
import { usePathname } from 'next/navigation'

import { StyledTextField } from '@/components/styledComponent/styledcomp';
import { postApiMethod, putApiMethod } from '@/services/global';
import { dispatch } from '@/redux/store';
import { addAlert } from '@/redux/slice/AlertSlice';
import APICONSTANT from '@/services/config';
import { setModal } from '@/redux/slice/modalSlice';
import { setforgot } from '@/redux/slice/isLoading';
import { Website } from '@/app/global/svg';
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./editModal.module.scss";
import { ModalLoader } from './loader'


const ForgotModal = () => {
    const {i18} = usePageContext();
    const pathName = usePathname()
    const [visible, setVisible] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [otpValue, setOtpValue] = useState<string>('')
    const [email ,setEmail] = useState('')
    const [Loader, seLoader] = useState(false)
    const {
        handleSubmit,
        control,
        watch,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm<{
        email: string;
        newPassword: any;
        confirmNewPassword: any;
        otp: any
    }>({
        defaultValues: {}
    });

    const pass = watch('newPassword', "")

    const requestOtp = async (url: string, data: object) => {
        seLoader(true)
        const res: any = await postApiMethod(url, data);
        if (res.statusCode === 200) {
            seLoader(false)
            setVisible(true)
            dispatch(addAlert({
                isOpen: true,
                message: res.message || "Password reset link sent",
                type: "success",
                severity: "success"
            }));
        } else {
            seLoader(false)
            // setVisible(true)
            dispatch(addAlert({
                isOpen: true,
                message: res.response.data.message,
                type: "error",
                severity: "error"
            }));
        }
    }

    const ChangePassword = async (url: string, data: object) => {
        const res: any = await putApiMethod(url, data);
        if (res.statusCode === 200) {
            dispatch(setModal("SignupModal" as any))
            dispatch(addAlert({
                isOpen: true,
                message: "OTP sent Successfully",
                type: "success",
                severity: "success"
            }));
        } else {
            // setVisible(false)
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


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowCPassword = () => setShowCPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    const onSubmit = async (data: any) => {
        if (!visible) {
            const newData = {
                email: data.email,
                userType: 'USER',
                verifyBy: 'email',
                verifyFrom: 'FORGETPASSWORD'
            }
            setEmail(data.email)
            requestOtp(APICONSTANT.forgetPassword, newData);
        } else {
            const forgetData = { ...data, otp: otpValue }
            ChangePassword(APICONSTANT.setPassword, forgetData);

        }
    }

    const handleBack = () => {
        if (!visible) {
           if(pathName === '/login/'){
            dispatch(setforgot(false))
           }
            else{
                dispatch(setModal('SignupModal' as any))
            }
        } else {
            setVisible(false)
        }
    }
    const handleResend = () => {
        setVisible(false)
    }
    const formatEmail = (email: any) => {
        const atIndex = email?.indexOf('@');
        const [username, domain] = [email?.slice(0, atIndex), email?.slice(atIndex + 1)];
        const [shortUsername, shortDomain] = [username?.slice(0, 2), domain?.slice(0, 2)];
        return `${shortUsername}*****@${shortDomain}***.com`;
    };

    return (
        <div className={``}>
            <div className='d-flex align-items-center border-bottom p-2' style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'white'
            }}>
                <>
                    <IconButton
                        onClick={handleBack}
                        style={{cursor:'pointer'}}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <h3 className='flex-fill text-center m-0'>{!visible ? (i18?.AUTH?.ENTERMAILID || 'Enter Mail Id') : (i18?.PAGES?.CHANGEPASSWORD || 'Change Password')}</h3>
                </>
            </div>
            <div className='p-3'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {!visible &&
                        <div className="mb-3">
                            {Loader && <ModalLoader />}
                            <div className={`${styles.input_border}`}>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <div>
                                            <StyledTextField
                                                {...field}
                                                className="w-full m-0"
                                                label="Email"
                                                type="email"
                                                variant="filled"
                                                error={!!errors.email}

                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            {errors.email && (
                                <span style={{ color: 'var(--search-button-color)', fontSize: '12px' }} role="alert">
                                    {errors.email.message?.toString()}
                                </span>
                            )}
                        </div>
                    }
                    {
                        visible &&
                        <div>
                            <p className=''>{i18?.ROOMPAGE?.CHECK || "Check"} {formatEmail(email)} {i18?.ROOMPAGE?.RESET_PASS || "for an email to reset your password. You’ll only receive an email if there is an associated"} <Website/>  {i18?.ROOMPAGE?.ACCOUNT || "account"}.</p>
                            <p className='fw-bold text-decoration-underline mb-0' role="button" onClick={handleResend}>{i18?.AUTH?.RESENDMAIL || "Resend mail"}</p>
                        </div>
                    }
                    {/* {visible &&
                        <>
                            <div className="mb-3">
                                <p>Enter the code </p>
                                <Controller
                                    name="otp"
                                    control={control}
                                    render={({ field }) => (
                                        <MuiOtpInput
                                            {...field}
                                            value={otpValue}
                                            onChange={handleChange}
                                            TextFieldsProps={{ placeholder: '-' }}
                                            length={4}
                                            autoFocus
                                            validateChar={(character: string, index: number) => true}
                                        />
                                    )} />
                            </div>

                            <div className="mb-4">
                                <div className={`${styles.input_border}`}>
                                    <Controller
                                        name="newPassword"
                                        control={control}
                                        rules={{
                                            required: 'Password is required',
                                        }}
                                        render={({ field }) => (
                                            <div>
                                                <StyledTextField
                                                    {...field}
                                                    className="w-100 m-0"
                                                    label="New Password"
                                                    // type="password"
                                                    variant="filled"
                                                    error={!!errors.newPassword}
                                                    type={showPassword ? 'text' : 'password'}
                                                    InputProps={{
                                                        disableUnderline: true,
                                                        endAdornment:
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                    }}

                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors.newPassword && (
                                    <span style={{ color: '#FF0000', fontSize: '12px' }} >{errors.newPassword.message?.toString()}</span>
                                )}
                            </div>

                            <div className="mb-4">
                                <div className={`${styles.input_border}`}>
                                    <Controller
                                        name="confirmNewPassword"
                                        control={control}
                                        rules={{
                                            required: 'Password is required',
                                            validate: (value) => {
                                                const valid = (value === getValues("newPassword"))
                                                return valid ? valid : "The passwords do not match"
                                            }
                                        }}

                                        render={({ field }) => (
                                            <div>
                                                <StyledTextField
                                                    {...field}
                                                    className="w-100 m-0"
                                                    label="Confirm Password"
                                                    // type="password"
                                                    variant="filled"
                                                    error={!!errors.confirmNewPassword}
                                                    type={showCPassword ? 'text' : 'password'}
                                                    InputProps={{
                                                        disableUnderline: true,
                                                        endAdornment:
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowCPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                >
                                                                    {showCPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                    }}

                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors.confirmNewPassword && (
                                    <span style={{ color: '#FF0000', fontSize: '12px' }} >{errors.confirmNewPassword.message?.toString()}</span>
                                )}
                            </div>
                        </>
                    } */}
                    {!visible &&
                        <Button
                            type="submit"
                            variant="contained"
                            className={`${isSubmitting ? styles.login : styles.loginbtn} mt-2 mb-2`}
                            style={{backgroundColor: 'var(--search-button-color)'}}
                        >
                            {isSubmitting ?
                                <Comment
                                    visible={true}
                                    height="40"
                                    width="80"
                                    ariaLabel="comment-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="comment-wrapper"
                                    color="#ffff"
                                    backgroundColor="transparent"
                                />
                                :
                                (!visible ? (i18?.AUTH?.REQUESTCODE ||'Request code') : (i18?.PAGES?.CHANGEPASSWORD || 'Change Password'))}
                        </Button>
                    }

                </form>
            </div>
        </div>
    );
}

export default ForgotModal;
