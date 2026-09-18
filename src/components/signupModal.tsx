import React, { useEffect, useState } from "react";
import './signupModel.css'
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import { useForm, Controller } from "react-hook-form";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { Phone } from "@mui/icons-material";
import queryString from "query-string";
import PhoneInput, {
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber
} from "react-phone-number-input";

import { getApiMethod, postApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { addAlert } from "@/redux/slice/AlertSlice";
import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { StyledTextField } from "@/components/styledComponent/styledcomp";
import { Website } from "@/app/global/svg";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./editModal.module.scss";
import "react-phone-number-input/style.css";
import UserdetailsModal from "./userDetailsModal";

const SignupModal = () => {
  const { i18, settings } = usePageContext();
  const { google, site } = settings;
  console.log("settingsData", settings);

  const router = useRouter();
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
  } = useForm({
    // mode: "onChange", 
  });

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
        phoneCode: `+${number?.countryCallingCode}`,
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
        }
      }
      if (res?.response?.status === 400) {
        setVisible(false);
        setReponse(false);
        setDetails(true);
        setStatusCode("400");
      } else {
        // dispatch(addAlert({
        //     isOpen: true,
        //     message: res.message,
        //     type: "error",
        //     severity: "error",
        // }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stringifiedParams = queryString.stringify({
    client_id: google.googleClientId /* GOOGLE_CLIENTID */,
    redirect_uri: google.googleRedirectUrl /* GOOGLE_REDIRECT_URI */,
    scope: "profile email",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    state: "googleHost"
  });

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  return (
    <div>
      <div
        className="d-flex align-items-center border-bottom p-2"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "white"
        }}
      >
        {response && (
          <>
            <IconButton onClick={() => dispatch(setModal("" as any))}>
              <CloseIcon />
            </IconButton>

            <h3 className="flex-fill text-center m-0">
              {i18?.ROOMPAGE?.LOGINORSIGNUP || "Log in or sign up"}
            </h3>
          </>
        )}
        {details && (
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
                    ? `${i18?.AUTH?.VERIFY || "Verify"} OTP`
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

                <h3 className="flex-fill text-center m-0">
                  {i18?.PROFILE?.ADDYOURINFO || "Add your info"}
                </h3>
              </>
            )}
          </>
        )}
      </div>
      {response && (
        <div className={`${styles.form} p-4`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="pb-3">
              {i18?.AUTH?.WELCOMETO || "Welcome to"} <Website />
            </h2>
            {!visible && (
              <div className="mb-3">
                <div className={`${styles.input_border}`}>
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
                      color: "var(--error-color-validation",
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
                          error={!!errors.email}
                          variant="filled"
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
            <DynamicButtonComponent
              isSubmitting={isSubmitting}
              variant="contained"
              type="submit"
              text={i18?.AUTH?.CONTINUE || "CONTINUE"}
              className={`${styles.loginbtn
                } mt-2 mb-2`}
            />
          </form>
          <div>
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

            <div className="credential">

              {settings?.demoCredentials ? (
                <div className="credentials">
                  <h5 className="">{i18?.DEMO?.TITLE || "Demo Credentials!"}</h5>

                  <div className="cred-cont">
                    <div className="cred">
                      <div className="">
                        <span>{i18?.DEMO?.HOSTEMAIL || "Host Email "}</span>:{" "}
                        <b>{settings.demoCredentials.hostEmail || "host@airstar.com"}</b>
                      </div>
                      <div>
                        <span>{i18?.DEMO?.PASSWORD || "Host Password "}</span>:{" "}
                        <b>{settings.demoCredentials.hostPass || "12345"}</b>
                      </div>
                    </div>
                    <div className="cred">
                      <div>
                        <span>{i18?.DEMO?.USEREMAIL || "User Email "}</span>:{" "}
                        <b>{settings.demoCredentials.userEmail || "user@airstar.com"}</b>
                      </div>
                      <div>
                        <span>{i18?.DEMO?.PASSWORD || "User Password "}</span>:{" "}
                        <b>{settings.demoCredentials.userPass || "12345"}</b>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <>
                  <h5>Demo Credentials not found...!</h5>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {details && (
        <UserdetailsModal
          visible={SignupName}
          value={formData}
          status={statusCode}
          otpData={otpData}
        />
      )}
    </div>
  );
};
export default SignupModal;
