import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import { Phone } from "@mui/icons-material";
import queryString from "query-string";
import { useSelector } from "react-redux";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import PhoneInput, {
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber
} from "react-phone-number-input";

import APICONSTANT from "@/services/config";
import { getApiMethod, postApiMethod } from "@/services/global";
import { addAlert } from "@/redux/slice/AlertSlice";
import { dispatch } from "@/redux/store";
import { StyledTextField } from "@/components/styledComponent/styledcomp";
import { Website } from "@/app/global/svg";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { usePageContext } from "@/components/Providers/PageContext";

import "react-phone-number-input/style.css";
import styles from "./componentheaderstyles.module.scss";
import ForgotModal from "./forgotModal";
import UserdetailsModal from "./userDetailsModal";
import { C } from "@fullcalendar/core/internal-common";

const Login = () => {
  const { i18, settings, responsiveView } = usePageContext();
  const { google, site } = settings;

  const router = useRouter();
  const ForgetBool = useSelector((state: any) => state.isLoader.forgot);
  const [response, setReponse] = useState(true);
  const [details, setDetails] = useState(false);
  const [statusCode, setStatusCode] = useState("400");
  const [callingCode, setCallingCode] = useState<any>(site?.countryCode);
  const [otpData, setOtpData] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [SignupName, setName] = useState("phone");
  const [formData, setFormData] = useState({});
  const {
    handleSubmit,
    control,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({});
    }
  }, [formState, reset]);

  const handlevisible = () => {
    setName("email");
    setVisible(true);
  };
  const handlePhonevisible = () => {
    setName("phone");
    setVisible(false);
  };
  const transformFormData = (formData: any) => {
    const { country, phonenumber, email, password } = formData;
    const number = phonenumber && parsePhoneNumber(phonenumber);

    if (visible) {
      return {
        email: email
      };
    } else {
      return {
        phoneCode: `+${getCountryCallingCode(callingCode)}`,
        phone: number?.nationalNumber
      };
    }
  };

  const requestOtp = async (url: string, data: object) => {
    const res: any = await postApiMethod(url, data);
    if (res.statusCode === 200) {
      setOtpData(res.data.otp);
      dispatch(
        addAlert({
          isOpen: true,
          message: "OTP sent Successfully",
          type: "success",
          severity: "success"
        })
      );
    } else {
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

  const onSubmit = async (data: any) => {
    const number = data.phonenumber && parsePhoneNumber(data.phonenumber);
    try {
      const transformedData = transformFormData(data);
      setFormData(transformedData);

      const res = await getApiMethod(APICONSTANT.userExist, transformedData);
      if (res.statusCode === 200) {
        localStorage.setItem("usersType", "user");
        setVisible(false);
        setReponse(false);
        setDetails(true);
        setStatusCode("200");
        if (SignupName === "phone") {
          const newData = {
            phoneCode: `+${number?.countryCallingCode}`,
            phone: number?.nationalNumber,
            userType: "USER",
            verifyBy: "phone",
            verifyFrom: "LOGIN"
          };
          requestOtp(APICONSTANT.sentOTP, newData);
        } /* else {
          setDetails(false);  
        } */
      }
      if (res?.response?.status === 400) {
        setVisible(false);
        setReponse(false);
        setDetails(true);
        setStatusCode("400");
      } else {
        // dispatch(addAlert({
        //   isOpen: true,
        //   message: res.message,
        //   type: "error",
        //   severity: "error",
        // }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stringifiedParams = queryString.stringify({
    client_id: google?.googleClientId /* GOOGLE_CLIENTID */,
    redirect_uri: google?.googleRedirectUrl /* GOOGLE_REDIRECT_URI */,
    scope: "profile email",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    state: "googleHost"
  });

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  return (
    <div className={`${styles.login}`}>
      <div className={`${styles.loginBox}`}>
        <>
          {details && !ForgetBool && (
            <div
              className={
                responsiveView === "sm" || responsiveView === "xs"
                  ? ""
                  : "d-flex align-items-center py-3 border-bottom"
              }
            >
              <>
                {statusCode === "200" ? (
                  <>
                    <IconButton
                      onClick={() => {
                        setReponse(true);
                        setDetails(false);
                        setName(SignupName === "phone" ? "phone" : "email");
                        setVisible(SignupName === "phone" ? false : true);
                        setCallingCode("IN");
                      }}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>

                    <h3 className="flex-fill text-center m-0">
                      {SignupName === "phone"
                        ? i18?.ACCOUNTINFO?.VERIFYOTP || "Verify OTP"
                        : i18?.HEADER?.LOGIN || "Login"}
                    </h3>
                  </>
                ) : (
                  <>
                    <IconButton
                      onClick={() => {
                        setReponse(true);
                        setDetails(false);
                        setName(SignupName === "phone" ? "phone" : "email");
                        setVisible(SignupName === "phone" ? false : true);
                        setCallingCode("IN");
                      }}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>

                    <h5 className="flex-fill text-center m-0">
                      {i18?.PROFILE?.ADDYOURINFO || "Add your info"}
                    </h5>
                  </>
                )}
              </>
            </div>
          )}
          {response && (
            <div>
              {response &&
                (responsiveView === "sm" || responsiveView === "xs") ? null : (
                <h5 className="flex-fill text-center m-0 border-bottom py-3">
                  {i18?.HEADER?.LOGIN || "Login"} {i18?.FILTER?.OR || "Or"}{" "}
                  {i18?.HEADER?.SIGNUP || "Signup"}
                </h5>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="px-4">
                <h4 className="py-3">
                  {i18?.AUTH?.WELCOMETO || "Welcome to"} <Website />
                </h4>
                {!visible && (
                  <div className="mb-3">
                    <div className={`${styles.input_border}`}>
                      {/* <Controller
                        name="country"
                        control={control}
                        rules={{
                          required: 'Country code is required',
                        }}
                        defaultValue="+91" // Set default value if needed
                        render={({ field }) => (
                          <FormControl className={`${styles.form_select} w-[100%] m-0`}>
                            <InputLabel id="country-label">
                              Country/Region
                            </InputLabel>
                            <Select
                              className="p-0"
                              labelId="country-label"
                              id="country-select"
                              label="Country/Region"
                              {...field}
                              error={!!errors.country}
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
                          </FormControl>
                        )}
                      />
                      {errors.country && (
                        <span style={{ color: '#FF0000', fontSize: '12px' }} role="alert">
                          {errors.country.message?.toString()}
                        </span>
                      )} */}
                      <Controller
                        name="phonenumber"
                        control={control}
                        rules={{
                          required: 'Phone number is required',
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
                              error={!!errors.phonenumber}
                              variant="filled"
                            />
                          </>
                        )}
                      />
                    </div>
                    {errors.phonenumber && (
                      <span
                        style={{
                          color: "var(--error-color-validation)",
                          fontSize: "12px"
                        }}
                      >
                        {errors.phonenumber.message?.toString()}
                      </span>
                    )}
                  </div>
                )}
                {visible && (
                  <div className="mb-3">
                    <div className={`${styles.input_border}`}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "Email required",
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
                              error={!!errors.email}
                              variant="filled"
                            />
                          </>
                        )}
                      />
                    </div>
                    {errors.email && (
                      <span
                        style={{ color: "#ff3232", fontSize: "12px" }}
                        role="alert"
                      >
                        {errors.email.message?.toString()}
                      </span>
                    )}
                  </div>
                )}
                {/* <Controller
                          name="password"
                          control={control}
                          rules={{
                              required: 'Password is required',
                          }}
                          render={({ field }) => (
                              <>
                                  <TextField
                                      {...field}
                                      className="w-full"
                                      label="Password"
                                      type="password"
                                      error={!!errors.password}

                                  />
                                  {errors.password && (
                                      <span style={{ color: '#FF0000', fontSize: '12px' }} >{errors.password.message?.toString()}</span>
                                  )}
                              </>

                          )}
                      /> */}
                {/* <span className={`${styles.privacy}`}>
               We’ll call or text you to confirm your number.
               Standard message and data rates apply.{" "}
               <a href="" className="privacy">
                   Privacy Policy
               </a>
           </span> */}
                {/* <DynamicButtonComponent type="submit" text="demo" isSubmitting={isSubmitting}/> */}
                <DynamicButtonComponent
                  variant="contained"
                  type="submit"
                  text={i18?.AUTH?.CONTINUE || "CONTINUE"}
                  isSubmitting={isSubmitting}
                  className={`${styles.loginbtn
                    } mt-2 mb-2`}
                />


                {/* <Button
                  type="submit"
                  variant="contained"
                  className={`${isSubmitting ? styles.login : styles.loginbtn} mt-2 mb-2`}
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
                    'Continue'
                  }
                </Button> */}
              </form>
              <div className="px-4">
                <p className={`${styles.orbtn}`}>{i18?.FILTER?.OR || "or"}</p>
                {/* <button className={`${styles.socialbtn} mb-3`}>
                  <FacebookIcon />
                  <span>Continue with Facebook</span>
                </button> */}
                <button
                  onClick={() => router.push(`${googleLoginUrl}`)}
                  className={`${styles.socialbtn} mb-3`}
                >
                  <GoogleIcon sx={{ color: "#000" }} />
                  {i18?.AUTH?.CONTINUEWITH || "Continue with"}{" "}
                  {i18?.SETUPPAYOUTS?.GOOGLE || "Google"}
                </button>
                {/* <button className={`${styles.socialbtn} mb-3`}>
                  <AppleIcon />
                  Continue with Apple
                </button> */}
                {visible && (
                  <button
                    className={`${styles.socialbtn} mb-3`}
                    onClick={handlePhonevisible}
                  >
                    <Phone sx={{ color: "#000" }} />
                    {i18?.AUTH?.CONTINUEWITH || "Continue with"}{" "}
                    {i18?.SETUPPAYOUTS?.PHONE || "Phone"}
                  </button>
                )}
                {!visible && (
                  <button
                    className={`${styles.socialbtn} mb-3`}
                    onClick={handlevisible}
                  >
                    <EmailIcon sx={{ color: "#000" }} />
                    {i18?.AUTH?.CONTINUEWITH || "Continue with"}{" "}
                    {i18?.SETUPPAYOUTS?.EMAIL || "Email"}
                  </button>
                )}


                {/* <button className={`${styles.socialbtn} mb-3`} onClick={() => dispatch(setModal('LoginModal' as any))}>
                          <GoogleIcon />
                          Login
                      </button> */}


                {/* Demo Credentials */}


                {/* {console.log(settings)}
                {console.log("Demo Credentials:", settings.demoCredentials)} */}
              </div>
            </div>
          )}
          {details && !ForgetBool && (
            <UserdetailsModal
              visible={SignupName}
              value={formData}
              status={statusCode}
              otpData={otpData}
            />
          )}
          {ForgetBool && <ForgotModal />}
        </>
      </div>
    </div>
  );
};
export default Login;
