"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "react-multi-date-picker";
import { Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Header from "@/components/header";
import { usePageContext } from "@/components/Providers/PageContext";
import { getApiMethod, postApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";

import styles from "./page.module.scss";

const IdentityVerify = () => {
  const { i18, settings } = usePageContext();
  const id =
    typeof window !== "undefined" ? localStorage.getItem("appUserId") : "";
  const [documentData, setDocumentData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [imgfiles, setImgfiles] = useState(null);
  const [today, setToday] = useState("");
  const [isCalendar, setIsCalendar] = useState(true);
  const [checkin, setCheckin] = useState(false);

  const getTranslation = (key: any) => {
    const keyValue = key && key.replace(/\s+/g, "").toUpperCase();
    const sectionlabel = i18["ACCOUNTINFO"] && i18["ACCOUNTINFO"][keyValue];
    return sectionlabel ? sectionlabel : key;
  };

  //   const isEmpty = useMemo(()=>{
  //     return documentData.map((field: any)=>{
  //       let empty = false;
  // if(Array.isArray(field.fields)) {
  // empty = field.fields.every((item: any)=>{
  //   return item.value===""
  // })
  // }
  // return empty;
  //     })
  //   },[documentData])

  useEffect(() => {
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    const formattedDate = nextDay.toISOString().split("T")[0];
    setToday(formattedDate);
  }, []);

  const getDocument = async () => {
    const res = await getApiMethod(`${APICONSTANT.getdocument}/${id}`);
    if (res.statusCode === 200) {
      setDocumentData(res.data.documents);
    }
  };

  const handleFieldOpen = (index: any) => {
    const newFields: any = [...documentData];
    newFields[index].fields.forEach((input: any) => {
      if (input.type == "image") {
        input.value = "";
      }
    });
    setDocumentData(newFields);
    setOpenIndex(index);
  };

  const handleFieldClose = () => {
    setOpenIndex(null);
  };

  const handleInputChange = (
    fieldIndex: number,
    inputIndex: number,
    value: any
  ) => {
    const newFields: any = [...documentData];
    newFields[fieldIndex].fields[inputIndex].value = value;
    setDocumentData(newFields);
    setIsCalendar(!isCalendar);
  };

  const toggleCalendar = () => {
    setCheckin(!checkin);
  };

  const handleSaveClick = async (fieldIndex: number) => {
    const fieldData: any = documentData[fieldIndex];
    const formData = new FormData();
    formData.append("fieldName", fieldData.indexName);

    fieldData.fields.forEach((input: any) => {
      formData.append(input.indexName, input.value);
    });
    try {
      // Send data to the API
      const response = await postApiMethod(
        `${APICONSTANT.getdocument}/${id}`,
        formData
      );
      // Close the edit mode
      handleFieldClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleFileChange = (
    fieldIndex: number,
    inputIndex: number,
    file: any
  ) => {
    const newFields: any = [...documentData];
    const previewUrl = URL.createObjectURL(file);
    setImgfiles(file);

    newFields[fieldIndex].fields[inputIndex].value = file;
    setDocumentData(newFields);
  };

  useEffect(() => {
    getDocument();
  }, [openIndex]);

  function formatDate(dateTimeString: Date) {
    const dateFormatFromAPI = settings?.hiddenSettings?.dateFormat;
    if (!dateTimeString) return dateFormatFromAPI;
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    if (dateFormatFromAPI === "DD-MM-YYYY") {
      return `${day}-${month}-${year}`;
    } else if (dateFormatFromAPI === "MM-DD-YYYY") {
      return `${month}-${day}-${year}`;
    } else if (dateFormatFromAPI === "YYYY-MM-DD") {
      return `${year}-${month}-${day}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  }

  let hasValidInput = false;
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
                  <Link color="text.primary" href='/personalinfo'>
                    {i18?.PROFILE?.PERSONALINFO || "Personal info"}
                  </Link>
                  <Typography color="text.primary">
                    {i18?.PROFILE?.PERSONALINFOs || "Identity Verify"}
                  </Typography>
                </Breadcrumbs>
              </div>
              <div>
                <h1 className={`mt-3`}>
                  {i18?.PROFILE?.PERSONALINFOs || "Identity Verify"}
                </h1>
              </div>
              <div
                className={`${styles.personal} row justify-content-between mt-4`}
              >
                <div className={`${styles.info} pb-4`}>
                  <div>
                    {documentData &&
                      documentData.map((field: any, fieldIndex: any) => (
                        <div key={fieldIndex}>
                          {openIndex === fieldIndex ? (
                            <>
                              <div className="d-flex justify-content-between">
                                <div className={`${styles.inputbox}col-md-4`}>
                                  <h4>
                                    {getTranslation(field.name) || field.name}
                                  </h4>
                                  <div>
                                    {field?.fields?.map(
                                      (input: any, inputIndex: any) => (
                                        <div
                                          key={inputIndex}
                                          style={{ marginBottom: "10px" }}
                                        >
                                          <p>
                                            {getTranslation(input?.name) ||
                                              input?.name}
                                            :
                                          </p>
                                          {input.type === "image" ? (
                                            <div
                                              className={`${styles.fileChoose}`}
                                            >
                                              <div>
                                                <label>
                                                  <input
                                                    type="file"
                                                    onChange={(e: any) =>
                                                      handleFileChange(
                                                        fieldIndex,
                                                        inputIndex,
                                                        e.target.files[0]
                                                      )
                                                    }
                                                  />
                                                  {/* Upload file */}
                                                </label>
                                              </div>
                                              {input.type === "image" &&
                                                input.value != "" && (
                                                  <img
                                                    src={
                                                      typeof input.value ===
                                                      "string"
                                                        ? process.env
                                                            .NEXT_PUBLIC_BASE_URL +
                                                          input.value
                                                        : URL.createObjectURL(
                                                            input.value
                                                          )
                                                    }
                                                    alt="Preview"
                                                    style={{
                                                      width: "70px",
                                                      height: "70px"
                                                    }}
                                                  />
                                                )}
                                              {/* <span>{typeof input.value !== 'string' && input?.value?.name ? input?.value?.name: 'No file Choosen'}</span> */}
                                            </div>
                                          ) : input.type === "date" ? (
                                            <>
                                              <input
                                                type="text"
                                                value={formatDate(input.value)}
                                                min={today}
                                                onChange={(e: any) =>
                                                  handleInputChange(
                                                    fieldIndex,
                                                    inputIndex,
                                                    e.target.value
                                                  )
                                                }
                                                onClick={toggleCalendar}
                                                readOnly
                                              />
                                              {/* //   <DatePicker
                    //   value={input.value}
                    //   minDate={today}
                      // className={`rmdpprime ${styles.calendarDiv}`}
                    //   className="rmdpprime" 
                      // className={classNames('rmdpprime', styles.calendarDiv)}
                    //   onChange={(date: any) => handleInputChange(fieldIndex, inputIndex, date)}
                      //  format="DD/MM/YYYY"
                    // /> */}

                                              {checkin && (
                                                <div
                                                  className={`${styles.calendarDiv}`}
                                                >
                                                  <Calendar
                                                    value={input.value}
                                                    minDate={today}
                                                    className={`rmdpprime ${styles.calendarDiv}`}
                                                    onChange={(date: any) => {
                                                      handleInputChange(
                                                        fieldIndex,
                                                        inputIndex,
                                                        date
                                                      );
                                                      setCheckin(!checkin);
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            </>
                                          ) : (
                                            <input
                                              value={input.value}
                                              type={input.type}
                                              onChange={(e: any) =>
                                                handleInputChange(
                                                  fieldIndex,
                                                  inputIndex,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                                <a
                                  onClick={handleFieldClose}
                                  className={`${styles.cancelbtn}`}
                                >
                                  {i18?.BOOKINGPAGE?.CANCEL || "cancel"}
                                </a>
                              </div>
                              <button
                                onClick={() => handleSaveClick(fieldIndex)}
                                className={`${styles.savebtn} mt-3 mb-5`}
                              >
                                {i18?.ROOMPAGE?.SAVE || "Save"}
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="d-flex justify-content-between">
                                <div className="inputBox">
                                  <h4>
                                    {getTranslation(field.name) || field.name}
                                  </h4>
                                  <div>
                                    {field.fields.map(
                                      (input: any, inputIndex: any) => {
                                        if (input.value !== "") {
                                          hasValidInput = true;
                                          return (
                                            <div
                                              key={inputIndex}
                                              style={{
                                                display: "flex",
                                                gap: "30px"
                                              }}
                                            >
                                              <p>
                                                {getTranslation(input.name)}
                                              </p>
                                              {input.type === "image" ? (
                                                <a
                                                  className={`${styles.navText}`}
                                                  href={
                                                    process.env
                                                      .NEXT_PUBLIC_BASE_URL +
                                                    input.value
                                                  }
                                                >
                                                  <p
                                                    className={`${styles.navText}`}
                                                  >
                                                    {i18?.ACCOUNTINFO.VIEW ||
                                                      "View"}
                                                  </p>
                                                </a>
                                              ) : input.type === "date" ? (
                                                <p>{formatDate(input.value)}</p>
                                              ) : (
                                                <p>{input.value}</p>
                                              )}
                                            </div>
                                          );
                                        }
                                        if (input.value === "") {
                                          return (
                                            <p
                                              style={{
                                                display: "flex",
                                                alignItems: "center"
                                              }}
                                              key={inputIndex}
                                            >
                                              {getTranslation(input.name)}
                                              <span
                                                style={{ marginLeft: "30px" }}
                                              >
                                                {/* {i18?.HEADER?.NODATAFOUND ||
                                                  "No Data Found"} */}
                                                  --
                                              </span>
                                            </p>
                                          );
                                        }
                                        return null;
                                      }
                                    )}

                                    {/* Render "No data found" if no valid input was found */}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleFieldOpen(fieldIndex)}
                                  className={`${styles.editbtn}`}
                                >
                                  {i18?.BOOKINGPAGE?.EDIT || "Edit"}
                                </button>
                              </div>
                              <hr />
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default IdentityVerify;
