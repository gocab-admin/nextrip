"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { getApiMethod, putApiMethod } from "@/services/global";
import Header from "@/components/header";
import { StyledTextField } from "@/components/styledComponent/styledcomp";
import { Loader } from "@/components/loader";
import APICONSTANT from "@/services/config";
import { addAlert } from "@/redux/slice/AlertSlice";
import { dispatch } from "@/redux/store";
import { Website } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";

const ForgetPassword = () => {
  const { i18 } = usePageContext();
  const router = useRouter();
  const params: any = useSearchParams();
  const key = params.get("key");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleError, setVisibleError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowCPassword = () => setShowCPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<{
    newPassword: any;
    confirmNewPassword: any;
  }>({
    defaultValues: {}
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await putApiMethod(
        `${APICONSTANT.resetPassword  }?key=${key}`,
        data
      );
      if (res.statusCode === 200) {
        setVisible(false);
        setSuccess(true);
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
            message: res.message,
            type: "error",
            severity: "error"
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const verifyKey = async () => {
    setLoader(true);
    try {
      const res = await getApiMethod(`${APICONSTANT.verifyKey  }?key=${key}`);
      if (res.statusCode === 200) {
        setVisible(true);
        setLoader(false);
      } else {
        setVisibleError(true);
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setVisibleError(true);
      setLoader(false);
    }
  };
  const handleRoute = () => {
    router.push("/login");
    // dispatch(setModal('SignupModal' as any))
  };

  useEffect(() => {
    verifyKey();
  }, []);
  return (
    <>
      {loader && <Loader />}
      <Header center="hide" page="hide" />
      {visible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.body}`}>
            <div className="mb-4">
              <div className={`${styles.input_border}`}>
                <Controller
                  name="newPassword"
                  control={control}
                  rules={{
                    required: "Password is required"
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
                    </div>
                  )}
                />
              </div>
              {errors.newPassword && (
                <span style={{ color: "#FF0000", fontSize: "12px" }}>
                  {errors.newPassword.message?.toString()}
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className={`${styles.input_border}`}>
                <Controller
                  name="confirmNewPassword"
                  control={control}
                  rules={{
                    required: "Password is required",
                    validate: (value) => {
                      const valid = value === getValues("newPassword");
                      return valid ? valid : "The passwords do not match";
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
                        type={showCPassword ? "text" : "password"}
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowCPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showCPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </div>
                  )}
                />
              </div>
              {errors.confirmNewPassword && (
                <span style={{ color: "#FF0000", fontSize: "12px" }}>
                  {errors.confirmNewPassword.message?.toString()}
                </span>
              )}
            </div>
            <Button
              type="submit"
              variant="contained"
              className={`${styles.loginbtn} mt-2 mb-2`}
            >
              {i18?.PAGES?.CHANGEPASSWORD || "Change Password"}
            </Button>
          </div>
        </form>
      )}
      {visibleError && (
        <div className={`${styles.body}`}>
          <div className="d-flex justify-content-center">
            <p>
              {i18?.PAGES?.THELINKHASBEENEXPIRED || "The link has been expired"}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className={`${styles.body}`}>
          <div className="d-flex justify-content-center">
            <div className="d-grid">
              <div className="text-center mb-3">
                {" "}
                <CheckCircleOutlineIcon
                  style={{ fontSize: 50, color: "green" }}
                />
              </div>
              <p className="text-center mb-2">
                {i18?.PAGES?.YOURPASSWORDHASBEEN ||
                  "Your password has been changed!"}
              </p>
              <p className="text-center">
                {i18?.PAGES?.LOGINTO || "Log in to "}
                <Website />{" "}
                {i18?.PAGES?.ACCOUNTWITHNEWPASSWORD ||
                  "account with new password"}
              </p>
              <button className={`${styles.buttn}`} onClick={handleRoute}>
                {i18?.PAGES?.SIGNIN || "Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgetPassword;
