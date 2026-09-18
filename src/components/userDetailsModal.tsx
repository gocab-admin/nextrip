import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { IconButton, InputAdornment } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Comment } from "react-loader-spinner";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber
} from "react-phone-number-input";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";

import { postApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import api from "@/services/utils/axios";
import { addUser, updateStatus } from "@/redux/slice/user/userSlice";
import { onlyLetters } from "@/components/helper";
import { StyledTextField } from "@/components/styledComponent/styledcomp";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { usePageContext } from "@/components/Providers/PageContext";

import RecaptchaComponent from "./googleCaptcha";
import styles from "./editModal.module.scss";
import "react-phone-number-input/style.css";

const UserdetailsModal = ({ visible, value, status, otpData }: any) => {
  const { i18, settings } = usePageContext();
  const { hiddenSettings, site, google } = settings;
  const searchParams: any = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const redirectURL = searchParams.get("redirecturl");
  const [showPassword, setShowPassword] = useState(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [timer, setTimer] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(true);
  const [resendData, setResendData] = useState<any>();
  const [callingCode, setCallingCode] = useState<any>(site?.countryCode);
  const recaptchaRef = useRef<any>();
  const [loading, setLoading] = useState(false)

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<{
    firstname: string;
    lastname: string;
    dob: Date | null;
    phoneCode: any;
    phone: any;
    email: string;
    password: any;
    code: any;
    recaptchaId: string
  }>({
    defaultValues: {
      dob: null 
    }
  });

  const handleRecaptchaVerify = (token: string) => {
    setValue('recaptchaId',token);
    clearErrors('recaptchaId')
  };

  const requestOtp = async (url: string, data: object) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      setTimer(30);
      setResendData(res.data.otp);
      dispatch(
        addAlert({
          isOpen: true,
          message: "OTP sent Successfully",
          type: "success",
          severity: "success"
        })
      );
    } else {
      debugger;
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  useEffect(() => {
    let intervalId: any;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleResend = () => {
    const newData = {
      phoneCode: otpData.phoneCode,
      phone: otpData.phoneNumber,
      userType: "USER",
      verifyBy: "phone",
      verifyFrom: "LOGIN"
    };
    requestOtp(APICONSTANT.sentOTP, newData);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const postapi = async (url: any, data: any) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      if (pathname === "/login/" && !res.data.user.verified) {
        if (redirectURL !== null) {
          router.replace(`/verify/?redirecturl=${redirectURL}`);
        } else {
          router.replace("/verify/");
        }
      } else if (pathname === "/login/" && res.data.user.verified) {
        if (redirectURL === null) {
          router.push("/");
        } else if (redirectURL !== null) {
          router.push(redirectURL);
        }
      } else {
        dispatch(setModal("" as any));
      }

      localStorage.setItem("appToken", res.data.user.token);
      api.defaults.headers.Authorization = res.data.user.token;
      localStorage.setItem("appUserId", res.data.user._id);
      localStorage.setItem("usersType", "user");
      if (pathname === "/" && !res.data.user.verified) {
        dispatch(setModal("EmailModal" as any));
      }
      dispatch(updateStatus({loginStatus: true, listCount: res.userListings}))
      dispatch(addUser(res.data.userDetail));
      dispatch(
        addAlert({
          isOpen: true,
          message: "Login Successfully",
          type: "success",
          severity: "success"
        })
      );
    } else {
      recaptchaRef?.current?.reset();
      // dispatch(setModal("SignupModal" as any))
      debugger;
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const handleChange = (newValue: string) => {
    setOtpValue(newValue);
  };

  const handleForgot = () => {
    if (hiddenSettings.mode === "1") {
      dispatch(
        addAlert({
          isOpen: true,
          message:
            "Sorry, you are not allowed to change password in demo mode.",
          type: "warning",
          severity: "warning"
        })
      );
    } else {
      dispatch(setModal("ForgotModal" as any))
      // pathname === "/"
      //   ? dispatch(setModal("ForgotModal" as any))
      //   : dispatch(setforgot(true));
    }
  };

  const onSubmit = async (data: any) => {
    const number = data.phone && parsePhoneNumber(data.phone);
    // const phNumber = value.phone && parsePhoneNumber(value.phone);
    const updatedData = {
      ...data,
      ...value
    };
    const updatedphData = {
      ...data,
      ...value,
      phone: value.phone || number?.nationalNumber,
      phoneCode: value.phoneCode || `+${number?.countryCallingCode}`
    }
    if (status === '200') {
        await postapi(`${APICONSTANT.login}?platform=web`, {
          fcmId: "",
          email: updatedData.email,
          password: updatedData.password,
          userType: "USER",
          recaptchaId: updatedData.recaptchaId
        });
    } else {
      const res = await postApiMethod(APICONSTANT.signup, updatedphData);
      if (res.statusCode === 200) {
        if (pathname === "/login/" && !res.data.user.verified) {    


      if (redirectURL !== null) {
        router.replace(`/verify?redirecturl=${window.encodeURIComponent(redirectURL)}`);
      } else {
        router.replace("/verify/");
      }
    } else if (pathname === "/login/" && res.data.user.verified) {
      if (redirectURL === null) {
        router.push("/");
      } else if (redirectURL !== null) {
        router.push(redirectURL);
      }
    } else {
      dispatch(setModal("" as any));
    }

        localStorage.setItem("appToken", res.data.user.token);
        api.defaults.headers.Authorization = res.data.user.token;
        localStorage.setItem("appUserId", res.data.user._id);
        localStorage.setItem("usersType", "user");
        // if (pathname === '/' && !res.data.user.verified) {
        //   dispatch(setModal('EmailModal' as any))
        // }
        dispatch(
          addAlert({
            isOpen: true,
            message: res.message,
            type: "success",
            severity: "success"
          })
        );
      } else {
        dispatch(
          addAlert({
            isOpen: true,
            message: res?.response?.data?.message || res.message,
            type: "error",
            severity: "error"
          })
        );
      }
     

    }
  };

  const verifyOtp = async (url: string, data: object) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      dispatch(setModal("" as any));
      dispatch(
        addAlert({
          isOpen: true,
          message: "OTP verified Successfully",
          type: "success",
          severity: "success"
        })
      );
      postapi(APICONSTANT.login, {
        phoneCode: otpData.phoneCode,
        phone: otpData.phoneNumber,
        code: otpValue,
        userType: "USER"
      });
    } else {
      // dispatch(setModal("SignupModal" as any))
      dispatch(
        addAlert({
          isOpen: true,
          message: res.response.data.message,
          type: "error",
          severity: "error"
        })
      );
    }
  };

  const handleOtpLogin = async () => {
    setLoading(true);
    try {
    await verifyOtp(`${APICONSTANT.signup  }/verifyOtp`, {
      phoneCode: otpData.phoneCode,
      phone: otpData.phoneNumber,
      code: otpValue,
      userType: "USER",
      verifyFrom: "LOGIN",
      verifyBy: "phone"
    });
  } catch(err) {
    console.log('err', err);
  } finally {
    setLoading(false);

  }
  };

  const validateDOB = (selectedDate: any) => {
    const currentDate = dayjs();
    const selectedDateObject = dayjs(selectedDate);

    if (selectedDateObject.add(18, "years").isBefore(currentDate)) {
      return true; // Validation passed
    }

    return "Date of birth should be above 18 years";
  };

  return (
    <div className={`${styles.form} p-4`}>
      {status === "200" ? (
        <>
          {visible === "phone" ? (
            <>
              <div className="p-3">
                {otpData && (
                  <p>
                    {i18?.ACCOUNTINFO?.ENTERTHECODE ||
                      "Enter the code we've sent via SMS to"}{" "}
                    {otpData.phoneCode} {otpData.phoneNumber}:
                  </p>
                )}
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <MuiOtpInput
                      {...field}
                      value={otpValue}
                      onChange={handleChange}
                      TextFieldsProps={{ placeholder: "-" }}
                      length={4}
                      autoFocus
                      validateChar={(character: string, index: number) => true}
                    />
                  )}
                />
              </div>
              <div className="p-3">
                {isResendEnabled && (
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="m-0">
                      {i18?.ACCOUNTINFO?.RESENDOTP || "Resend OTP in "}
                      {timer} {i18?.ACCOUNTINFO?.SECONDS || " seconds"}
                    </p>
                    <button
                      disabled={timer === 0 ? false : true}
                      className={`${
                        timer === 0 ? styles.sendbtn : styles.disablebtn
                      }`}
                      onClick={handleResend}
                    >
                      {i18?.ACCOUNTINFO?.RESEND || "Resend"}
                    </button>
                  </div>
                )}
              </div>
              <div className={`${styles.modal_button} border-top`}>
                <DynamicButtonComponent className={`${styles.loginbtn}`} 
                isSubmitting={loading}
                onClick={handleOtpLogin} text={i18?.AUTH?.CONTINUE || "CONTINUE"} />
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <div className={`${styles.input_border}`}>
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: "Password is required"
                      }}
                      render={({ field }) => (
                        <>
                          <StyledTextField
                            {...field}
                            className="w-full m-0"
                            label="Password"
                            variant="filled"
                            error={!!errors.password}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="off" 
                            InputProps={{
                              disableUnderline: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                  {errors.password && (
                    <span
                      className="mb-3"
                      style={{ color: "#FF0000", fontSize: "12px" }}
                    >
                      {errors.password.message?.toString()}
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <RecaptchaComponent onVerify={handleRecaptchaVerify} google={google} ref={recaptchaRef} />
                  <div>
                    <Controller
                      name="recaptchaId"
                      control={control}
                      rules={{
                        required: "reCAPTCHA verification is required"
                      }}
                      render={({ field }) => (
                        <>
                          <StyledTextField
                            {...field}
                            className="w-full m-0"
                            label="recaptchaId"
                            type="text"
                            hidden
                            variant="filled"
                            error={!!errors.recaptchaId}
                            InputProps={{
                              readOnly: true,
                              disableUnderline: true
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                  {errors.recaptchaId && (
                    <span
                      className="mb-3"
                      style={{ color: "#FF0000", fontSize: "12px" }}
                    >
                      {errors.recaptchaId.message?.toString()}
                    </span>
                  )}
                </div>
                <DynamicButtonComponent
                  type="submit"
                  variant="contained"
                  className={`${
                    styles.loginbtn
                  } mt-2 mb-2`}
                  text={i18?.AUTH?.CONTINUE || "CONTINUE"}
                  isSubmitting={isSubmitting}
                >
                  {isSubmitting ? (
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
                  ) : (
                    "Continue"
                  )}
                </DynamicButtonComponent>
              </form>
              <div className="mt-2">
                <button className={`${styles.sendbtn}`} onClick={handleForgot}>
                  {`${i18?.AUTH?.FORGOT || "Forgot"  } Password?`}
                </button>
              </div>
            </>
          )}
        </> )
        :
        (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {value.email && (
            <div className={`${styles.input_border} mb-3`}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <>
                    <StyledTextField
                      {...field}
                      className="w-full m-0"
                      label="Email"
                      type="text"
                      defaultValue={value.email}
                      variant="filled"
                      InputProps={{
                        readOnly: true,
                        disableUnderline: true
                      }}
                    />
                  </>
                )}
              />
            </div>
          )}
          {value.phone && value.phoneCode && (
            <div className={`${styles.input_border} mb-3`}>
              <div className={`${styles.form_selects}`}>
                <Controller
                  name="phoneCode"
                  control={control}
                  render={({ field }) => (
                    <>
                      <StyledTextField
                        {...field}
                        className="w-full m-0"
                        label="Country/Region"
                        type="text"
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true
                        }}
                        defaultValue={value.phoneCode}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <>
                      <StyledTextField
                        {...field}
                        className="w-full m-0"
                        label="Phone number"
                        type="text"
                        variant="filled"
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true
                        }}
                        defaultValue={value.phone}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          )}
          <div className="mb-3">
            <div className={`${styles.input_border}`}>
              <div className={`${styles.form_selects}`}>
                <Controller
                  name="firstname"
                  control={control}
                  rules={{
                    required: "firstname is required"
                  }}
                  render={({ field }) => (
                    <>
                      <StyledTextField
                        {...field}
                        onKeyDown={(e) => {
                          const { key } = e;
                          const regex = /^\d+$/.test(key);
                          const sp = /[!@#$%^&*()_+={}\[\]:;<>,.?~\\/-]/.test(
                            key
                          );
                          if (regex || sp) {
                            e.preventDefault();
                          }
                        }}
                        className={`w-full m-0`}
                        label={i18?.PROFILE?.FIRSTNAME || "Firstname"}
                        variant="filled"
                        type="text"
                        error={!!errors.firstname}
                        onPaste={(e) => onlyLetters(e)}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="lastname"
                  control={control}
                  rules={{
                    required: "lastname is required"
                  }}
                  render={({ field }) => (
                    <>
                      <StyledTextField
                        {...field}
                        onKeyDown={(e) => {
                          const { key } = e;
                          const regex = /^\d+$/.test(key);
                          const sp = /[!@#$%^&*()_+={}\[\]:;<>,.?~\\/-]/.test(
                            key
                          );
                          if (regex || sp) {
                            e.preventDefault();
                          }
                        }}
                        className="w-full m-0"
                        label={i18?.PROFILE?.LASTNAME || "Lastname"}
                        variant="filled"
                        type="text"
                        error={!!errors.lastname}
                        onPaste={(e) => onlyLetters(e)}
                      />
                    </>
                  )}
                />
              </div>
            </div>
            {errors.firstname && (
              <span
                className="me-2"
                style={{
                  color: "var(--error-color-validation)",
                  fontSize: "12px"
                }}
                role="alert"
              >
                {errors.firstname.message?.toString()}
              </span>
            )}
            {errors.lastname && (
              <span
                style={{
                  color: "var(--error-color-validation)",
                  fontSize: "12px"
                }}
                role="alert"
              >
                {errors.lastname.message?.toString()}
              </span>
            )}
          </div>
          <div className="mb-3">
            <div className={`${styles.input_border}`}>
              <Controller
                name="dob"
                control={control}
                rules={{
                  required: "Date of birth is required",
                  validate: {
                    validDOB: (value) =>
                      validateDOB(value) || "Must be above 18 years old"
                  }
                }}
                render={({ field }) => (
                  <>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale={"en-gb"}
                    >
                      <DatePicker
                        className="m-0"
                        label="DOB"
                        {...field}
                        disableFuture
                        slotProps={{ textField: { variant: "filled" } }}
                        sx={{
                          "& label.Mui-focused": {
                            color: "#717171"
                          },
                          "& .MuiInputBase-root": {
                            backgroundColor: "transparent",
                            "&:before": {
                              borderBottom: "none !important" // Disable focused underline
                            },
                            "&:after": {
                              borderBottom: "none !important" // Disable focused underline
                            },
                            "&:hover": {
                              borderBottom: "none !important", // Disable focused underline on hover
                              backgroundColor: "transparent"
                            }
                          }
                        }}
                        onChange={(date) => {
                          setValue("dob", date);
                          // Clear error when date is selected
                          if (errors.dob) {
                            // Reset the specific field error
                            setError("dob", { type: "manual", message: "" });
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </>
                )}
              />
            </div>
            {errors.dob && (
              <span
                style={{
                  color: "var(--error-color-validation)",
                  fontSize: "12px"
                }}
                role="alert"
              >
                {errors.dob.message?.toString()}
              </span>
            )}
          </div>

          {visible === "email" && (
            <div className="mb-3">
              <div className={`${styles.input_border}`}>
                {/* <div>
                  <Controller
                    name="phoneCode"
                    control={control}
                    rules={{
                      required: 'Country code is required',
                    }}
                    defaultValue="+91"
                    render={({ field }) => (
                      <FormControl className={`${styles.form_select} w-[100%] m-0`}>
                        <InputLabel id="phoneCode-label">
                          Country/Region
                        </InputLabel>
                        <Select
                          className="p-0"
                          labelId="phoneCode-label"
                          id="phoneCode-select"
                          label="Country/Region"
                          {...field}
                          error={!!errors.phoneCode}
                          input={<StyledSelect />}
                        >
                          {CountryCode.map((country) => (
                            <MenuItem
                              key={country.dial_code}
                              value={country.dial_code}
                            >
                              {country.name} &nbsp;({country.dial_code})
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.phoneCode && (
                          <span style={{ color: '#FF0000', fontSize: '12px' }} role="alert">
                            {errors.phoneCode.message?.toString()}
                          </span>
                        )}
                      </FormControl>
                    )} />
                </div> */}
                <div>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      validate: {
                        isValid: (value: any) => {
                          const valid = isValidPhoneNumber(value);
                          return valid ? valid : "Invalid phone number";
                        }
                      }
                    }}
                    render={({ field }) => (
                      <>
                        <PhoneInput
                          {...field}
                          onCountryChange={(v) => setCallingCode(v)}
                          defaultCountry={callingCode}
                          international
                          countryCallingCodeEditable={false}
                          className="w-full m-0"
                          label="Phone number"
                          type="phonenumber"
                          error={!!errors.phone}
                          variant="filled"
                        />
                      </>
                    )}
                  />
                </div>
              </div>
              {errors.phone && (
                <span
                  style={{
                    color: "var(--error-color-validation)",
                    fontSize: "12px"
                  }}
                >
                  {errors.phone.message?.toString()}
                </span>
              )}
            </div>
          )}
          {visible === "phone" && (
            <div className="mb-3">
              <div className={`${styles.input_border}`}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address"
                    }
                  }}
                  render={({ field }) => (
                    <>
                      <StyledTextField
                        {...field}
                        className="w-full m-0"
                        label="Email"
                        type="email"
                        variant="filled"
                        error={!!errors.email}
                        autoComplete="off"

                      />
                    </>
                  )}
                />
              </div>
              {errors.email && (
                <span
                  style={{
                    color: "var(--error-color-validation)",
                    fontSize: "12px"
                  }}
                  role="alert"
                >
                  {errors.email.message?.toString()}
                </span>
              )}
            </div>
          )}
          <div className="mb-4">
            <div className={`${styles.input_border}`}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                }}
                render={({ field }) => (
                  <>
                    <StyledTextField
                      {...field}
                      className="w-full m-0"
                      label="Password"
                      autoComplete="off"
                      // type="password"
                      variant="filled" 
                      error={!!errors.password}
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                 <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </>
                )}
              />
            </div>
            {errors.password && (
              <span
                style={{
                  color: "var(--error-color-validation)",
                  fontSize: "12px"
                }}
              >
                {errors.password.message?.toString()}
              </span>
            )}
          </div>

          <DynamicButtonComponent
            type="submit"
            variant="contained"
            className={`${
              styles.loginbtn
            } mt-2 mb-2`}
            isSubmitting={isSubmitting}
          >
            {isSubmitting ? (
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
            ) : (
              "Continue"
            )}
          </DynamicButtonComponent>
        </form>
      )}
    </div>
  );
};

export default UserdetailsModal;
