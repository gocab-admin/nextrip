"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import {
  /*  FormControlLabel, */ Button,
  FormControlLabel,
  Link,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BsShieldLockFill } from "react-icons/bs";
import { IoIosLock } from "react-icons/io";
import { AiFillEye } from "react-icons/ai";

import Header from "@/components/header";
import { fetchUserAboutData } from "@/redux/slice/user/userAboutDataSlice";
import { updateUser } from "@/redux/slice/user/userSlice";
import { dispatch } from "@/redux/store";
import isAuth from "@/components/isAuth";
import { addAlert } from "@/redux/slice/AlertSlice";
import { Website } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./page.module.scss";
import PhoneInputComponent from "@/components/phoneInput";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { Android12Switch } from "@/components/switch";
// import { Android12Switch } from "../components/switch";
const InputValue: any = [
  { Input: "First Name", name: "firstname", inputType: "input" },
  { Input: "Last Name", name: "lastname", inputType: "input" },
  { Input: "Email ID", name: "email", inputType: "input" },
  { Input: "Phone Number", name: "phone", inputType: "phone" },
  {
    Input: "Address",
    name: "address",
    inputType: "textarea",
    sub: [
      { Input: "City", name: "city", inputType: "input" },
      { Input: "Country", name: "country", inputType: "input" },
      { Input: "State/province", name: "state", inputType: "input" },
      { Input: "Postcode", name: "postcode", inputType: "input" },
    ],
  },
];

const Switch = dynamic(() => import("@mui/material/Switch"), { ssr: false });
const Breadcrumbs = dynamic(() => import("@mui/material/Breadcrumbs"), {
  ssr: false,
});
const Typography = dynamic(() => import("@mui/material/Typography"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });

const Personalinfo = () => {
  const { i18, settings } = usePageContext();
  const [edit, setEdit] = useState("");
  const [checked, setChecked] = useState(true);
  const { hiddenSettings, site } = settings;
  const data = useSelector(
    (state: any) => state?.about?.aboutData.data?.userDetail
  );
  const phonenumber =
    data?.phoneCode && data?.phone
      ? `+${data?.phoneCode} ${data?.phone}`
      : null;

  const InputValue: any = [
    {
      Input: i18?.PROFILE?.FIRSTNAME || "First Name",
      name: "firstname",
      inputType: "input",
    },
    {
      Input: i18?.PROFILE?.LASTNAME || "Last Name",
      name: "lastname",
      inputType: "input",
    },
    {
      Input: i18?.PROFILE?.EMAIL || "Email ID",
      name: "email",
      inputType: "input",
    },
    {
      Input: i18?.PROFILE?.PHONENUMBERS || "Phone Number",
      name: "phone",
      inputType: "phone",
    },
    {
      Input: i18?.PROFILE?.ADDRESS || "Address",
      name: "address",
      inputType: "textarea",
      sub: [
        {
          Input: i18?.PROFILE?.CITY || "City",
          name: "city",
          inputType: "input",
        },
        {
          Input: i18?.PROFILE?.COUNTRY || "Country",
          name: "country",
          inputType: "input",
        },
        {
          Input: i18?.PROFILE?.STATEPRO || "State/province",
          name: "state",
          inputType: "input",
        },
        {
          Input: i18?.PROFILE?.POSTCODE || "Postcode",
          name: "postcode",
          inputType: "input",
        },
      ],
    },
  ];

  // const [checked, setChecked] = useState(false);
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    getValues,
    reset,
    setValue,
    setError,
  } = useForm<any>({
    defaultValues: {
      firstname: data?.firstname || "",
      lastname: data?.lastname || "",
      email: data?.email || "",
      phone: data?.phone || "",
      city: data?.city || "",
      country: data?.country || "",
      state: data?.state || "",
      postcode: data?.postcode || "",
    },
  });
  console.log("user", Object.entries(errors).length);

  useEffect(() => {
    if (data) {
      reset({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        phone: data.phone || "",
        city: data.city || "",
        country: data.country || "",
        state: data.state || "",
        postcode: data.postcode || "",
      });
    }
  }, [data, reset]);

  const handleSaveClick = async (items: any) => {
    debugger;
    const allValues: any = getValues();
    const modifiedFields = { ...allValues, ...allValues.address };
    delete modifiedFields.address;

    try {
      const userId: any = localStorage.getItem("appUserId");
      const res = await dispatch(updateUser(userId, modifiedFields));
      if (res.statusCode === 200) {
        dispatch(
          addAlert({
            isOpen: true,
            message: res.message,
            type: "success",
            severity: "success",
          })
        );
        setEdit("");
        dispatch(fetchUserAboutData());
      }
    } catch (err: any) {
      dispatch(
        addAlert({
          isOpen: true,
          message: err?.response?.data?.message,
          type: "error",
          severity: "error",
        })
      );
    }
  };
  useEffect(() => {
    dispatch(fetchUserAboutData());
  }, []);
  console.log("hiddenSettings", hiddenSettings);
  const handleToggleChange = async () => {
    if (hiddenSettings.mode === "1") {
      dispatch(
        addAlert({
          isOpen: true,
          message: "Sorry, you are not allowed to change in demo mode.",
          type: "warning",
          severity: "warning",
        })
      );
      setChecked(false);
    } else {
      setChecked(!checked);
      try {
        const userId: any = localStorage.getItem("appUserId");
        const Userdata = {
          instantBooking: checked,
        };
        const res = await dispatch(updateUser(userId, Userdata));
        if (res.statusCode === 200) {
          dispatch(fetchUserAboutData());
          dispatch(
            addAlert({
              isOpen: true,
              message: res.message,
              type: "success",
              severity: "success",
            })
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className={`${styles.host}`}>
        <Header center="hide" page="hide" />
        <section className={`${styles.form} my-4 px-3 py-4 container`}>
          <div className={`${styles.size} m-auto`}>
            <div className={`${styles.breadcrums}`}>
              <div>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                  <Link color="inherit" href="/account-settings">
                    {i18?.ACCOUNTINFO?.ACCOUNTS || "Accounts"}
                  </Link>
                  <Typography color="text.primary">
                    {i18?.PROFILE?.PERSONALINFO || "Personal info"}
                  </Typography>
                </Breadcrumbs>
              </div>
              <div>
                <h1 className={`mt-3`}>
                  {i18?.PROFILE?.PERSONALINFO || "Personal info"}
                </h1>
              </div>
            </div>
            <div className={`${styles.personal}  mt-4`}>
              <form
                onSubmit={handleSubmit(handleSaveClick)}
                className={`${styles.info} pb-4`}
              >
                <div>
                  {InputValue.map((items: any, index: any) => (
                    <div key={index}>
                      {items.name !== "address" ? (
                        <Controller
                          name={items.name}
                          control={control}
                          rules={{
                            required: `${items.name} is required`,
                            ...(items.name === "email" && {
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Improved email regex
                                message: "Enter a valid email address",
                              },
                            }),
                          }}
                          render={({ field }) => (
                            <div className="">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <p className="">{items.Input}</p>
                                  {edit !== items.name ? (
                                    <div>
                                      {items.name === "email" ? (
                                        <div className="">
                                          <p className="">
                                            {data?.[items.name] || ""}
                                          </p>
                                          {data?.emailVerified && (
                                            <div className="">
                                              <img
                                                width={20}
                                                height={20}
                                                src="/svg/icon/verified.svg"
                                                alt="img"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="">
                                          {items.name !== "phone"
                                            ? data?.[items.name] || "--"
                                            : phonenumber
                                            ? phonenumber
                                            : "--"}
                                        </p>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                                {edit === items.name ? (
                                  <p
                                    onClick={() => setEdit("")}
                                    className={`${styles.cancelbtn}`}
                                  >
                                    {i18?.NEW?.CANCEL || "Cancel"}
                                  </p>
                                ) : (
                                  <p
                                    onClick={() => {
                                      hiddenSettings.mode === "0"
                                        ? setEdit(items.name)
                                        : dispatch(
                                            addAlert({
                                              isOpen: true,
                                              message:
                                                "Sorry, you are not allowed to change in demo mode.",
                                              type: "warning",
                                              severity: "warning",
                                            })
                                          );
                                    }}
                                    className={`${styles.editbtn}`}
                                  >
                                    {i18?.NEW?.EDIT || "Edit"}
                                  </p>
                                )}
                              </div>
                              {edit === items.name && (
                                <div className="">
                                  {items.inputType === "input" && (
                                    <>
                                      <input
                                        className={`${styles.input}`}
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(e.target.value)
                                        }
                                      />
                                      {/* {errors[items.name] && (
                                        <span style={{ color: 'red' }}>{errors[items?.name]?.message}</span>
                                      )} */}
                                    </>
                                  )}
                                  {items.inputType === "phone" && (
                                    <>
                                      <PhoneInputComponent
                                        errors={!!errors[items.name]}
                                        value={phonenumber}
                                        onPhoneChange={(
                                          number: any,
                                          code: any
                                        ) => {
                                          setValue("phone", number);
                                          setValue("phoneCode", code);
                                        }}
                                      />
                                      {/* {errors[items.name] && (
                                        <span style={{ color: 'red' }}>{errors[items?.name]?.message}</span>
                                      )} */}
                                    </>
                                  )}
                                  <div>
                                    <button
                                      // onClick={() => handleSaveClick(items?.name)}
                                      className={`${styles.savebtn} mt-4`}
                                    >
                                      {i18?.NEW?.SAVE || "Save"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        />
                      ) : (
                        items.inputType === "textarea" &&
                        items?.name === "address" &&
                        items?.sub?.length > 0 && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p className="">{items.Input}</p>
                              {edit === items.name ? (
                                <p
                                  onClick={() => setEdit("")}
                                  className={`${styles.cancelbtn}`}
                                >
                                  {i18?.NEW?.CANCEL || "Cancel"}
                                </p>
                              ) : (
                                <p
                                  onClick={() => {
                                    hiddenSettings.mode === "0"
                                      ? setEdit(items.name)
                                      : dispatch(
                                          addAlert({
                                            isOpen: true,
                                            message:
                                              "Sorry, you are not allowed to change in demo mode.",
                                            type: "warning",
                                            severity: "warning",
                                          })
                                        );
                                  }}
                                  className={`${styles.editbtn}`}
                                >
                                  {i18?.NEW?.EDIT || "Edit"}
                                </p>
                              )}
                            </div>
                            {edit !== items.name &&
                              items?.sub.map((items: any, index: any) => (
                                <p className="">
                                  {data?.address?.[items.name] || "--"}
                                </p>
                              ))}
                            {edit === items.name && (
                              <>
                                {items?.sub.map((item: any, index: any) => (
                                  <Controller
                                    key={index}
                                    name={`address.${item.name}`}
                                    control={control}
                                    defaultValue={
                                      data?.address?.[item.name] || ""
                                    }
                                    rules={{
                                      required: "This field is required",
                                    }}
                                    render={({ field }) => (
                                      <div>
                                        <p className="m-0 py-3">{item.Input}</p>
                                        <input
                                          className={`${styles.input}`}
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(e.target.value)
                                          }
                                        />
                                        {/* {errors[`address.${item.name}`] && (
                                          <span style={{ color: 'red' }}>{errors[`address.${item?.name}`]?.message}</span>
                                        )} */}
                                      </div>
                                    )}
                                  />
                                ))}
                                <button
                                  // onClick={() => handleSaveClick(items?.name)}
                                  className={`${styles.savebtn} mt-4`}
                                >
                                  {i18?.NEW?.SAVE || "Save"}
                                </button>
                              </>
                            )}
                          </>
                        )
                      )}
                      <hr />
                    </div>
                  ))}
                </div>
                {hiddenSettings?.documentVerification === "1" && (
                  <>
                    <div className="d-flex justify-content-between">
                      <div className="col-md-6">
                        <h4>
                          {i18?.PROFILE?.PHONENUMBERSs || "Identity Verify"}
                        </h4>
                        {/* <p>{data?.phone}</p> */}
                      </div>
                      <Link
                        href="/personalinfo/identityverify"
                        className={`${styles.editbtn}`}
                      >
                        {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                      </Link>
                    </div>
                    <hr />
                  </>
                )}
                <div className="d-flex justify-content-between flex-wrap mb-6">
                  <div className="col-md-6">
                    <h4>{i18?.PROFILE?.INSTANTBOOKING || "Instant Booking"}</h4>
                  </div>
                  <FormControlLabel
                    control={
                      <Android12Switch
                        checked={data?.instantBooking}
                        onChange={handleToggleChange}
                      />
                    }
                    label={
                      data?.instantBooking
                        ? i18?.PROFILE?.ON || "On"
                        : i18?.PROFILE?.OFF || "Off"
                    }
                  />
                </div>
              </form>

              <div className={`${styles.rightbox}`}>
                <div className={`${styles.rightcon} p-4`}>
                  <BsShieldLockFill
                    style={{
                      display: "block",
                      height: "48px",
                      width: "48px",
                      fill: "var(--search-button-color)",
                      stroke: "currentcolor",
                    }}
                  />
                  <h3>
                    {i18?.PERSONALINFO?.WHYISNOTMYINFOSHOWNHERE ||
                      "Why isn’t my info shown here?"}
                  </h3>
                  <p>
                    {i18?.PERSONALINFO?.HIDINGACCOUNTDETAILS ||
                      "We’re hiding some account details to protect your identity."}
                  </p>
                  <hr></hr>
                  <IoIosLock
                    style={{
                      display: "block",
                      height: "48px",
                      width: "48px",
                      fill: "var(--search-button-color)",
                      stroke: "currentcolor",
                    }}
                  />
                  <h3>
                    {i18?.PERSONALINFO?.WHICHDETAILSCANBEEDITED ||
                      "Which details can be edited?"}
                  </h3>
                  <p>
                    {i18?.PERSONALINFO?.PERSONALDETAILSCANBEEDITED ||
                      "Contact info and personal details can be edited. If this info was used to verify your identity, you’ll need to get verified again the next time you book – or to continue hosting."}
                  </p>
                  <hr></hr>
                  <AiFillEye
                    style={{
                      display: "block",
                      height: "48px",
                      width: "48px",
                      fill: "var(--search-button-color)",
                      stroke: "currentcolor",
                    }}
                  />
                  <h3>
                    {i18?.PERSONALINFO?.WHICHINFOISSHARED ||
                      "What info is shared with others?"}
                  </h3>
                  <p>
                    <Website />{" "}
                    {i18?.PERSONALINFO?.ONLYRELEASES ||
                      "only releases contact information for Hosts and guests after a reservation is confirmed."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};
export default isAuth(Personalinfo);
