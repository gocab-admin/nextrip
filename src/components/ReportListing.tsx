import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";

import { getApiMethod, postApiMethod } from "@/services/global";
import APICONSTANT from "@/services/apiConstant";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { violetTheme } from "@/components/colorVariable";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import { setModal } from "@/redux/slice/modalSlice";
import { dispatch } from "@/redux/store";
import { AppName } from "@/app/global/svg";

import styles from "@/app/rooms/page.module.scss";
import Textarea from "./textArea";

interface ReportTitle {
  _id: string;
  title: string;
  subCategoryType: string;
}

interface ReportDesc {
  _id: string;
  title: string;
  description: string;
}

const ReportListing: React.FC = () => {
  const propertyData = useSelector(
    (state: any) => state.listingData.ListingData
  );
  const [reportTitle, setReportTitle] = useState<ReportTitle[] | null>(null);
  const [reportDesc, setReportDesc] = useState<ReportDesc[] | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<ReportTitle | null>(null);
  const [selectedDesc, setSelectedDesc] = useState<ReportDesc | null>(null);
  const [selectedTitleId, setSelectedTitleId] = useState("");
  const [selectedDescId, setSelectedDescId] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [loader, setLoader] = useState(true);
  const [textVal, setTextVal] = useState("");

  const getApi = async (url: string) => {
    try {
      const res = await getApiMethod(url);
      if (res.statusCode === 200) {
        setLoader(false);
        setReportTitle(res.data.reportTitle);
      } else {
        setLoader(true);
        setReportTitle([]);
      }
    } catch (error) {
      setLoader(true);
      console.error("API Error:", error);
      setReportTitle([]);
    }
  };

  const handleSelectTitle = async (
    titleId: string,
    title: ReportTitle,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelectedTitle(title);
      setSelectedTitleId(titleId);
      if (title.subCategoryType === "choice") {
        try {
          const desc = await getApiMethod(
            `${APICONSTANT.reportDesc}/${titleId}`
          );
          if (desc.statusCode === 200) {
            setReportDesc(desc.data.reportDescription.subOptions);
          } else {
            setReportDesc([]);
          }
        } catch (error) {
          console.error("API Error fetching description:", error);
          setReportDesc([]);
        }
      }
    } else {
      setSelectedTitle(null);
      setSelectedTitleId("");
      setReportDesc([]);
    }
  };

  const handleSelectDesc = (
    id: string,
    desc: ReportDesc,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setSelectedDescId(id);
      setSelectedDesc(desc);
    } else {
      setSelectedDesc(null);
      setSelectedDescId("");
    }
  };

  const raiseReport = async (data: any, type?: string) => {
    try {
      const reportList = await postApiMethod(
        `${APICONSTANT.reportListing}/${propertyData?._id}`,
        data
      );
      if (reportList.statusCode === 201 && type !== "none") {
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("API Error submitting report:", error);
    }
  };

  const handleValChange = (val: string) => {
    setTextVal(val);
  };

  const handleStep = () => {
    if (activeStep === 0) {
      if (selectedTitle?.subCategoryType === "none") {
        const data = {
          reason: selectedTitle.title
        };
        setActiveStep((prev) => prev + 2);
        raiseReport(data, "none");
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } else if (activeStep === 1) {
      const dataChoice = {
        reason: selectedTitle?.title,
        subReason: selectedDesc?.title,
        details: selectedDesc?.description
      };
      const dataText = {
        reason: selectedTitle?.title,
        details: textVal
      };
      if (selectedTitle?.subCategoryType === "text") {
        raiseReport(dataText);
      } else {
        raiseReport(dataChoice);
      }
    } else {
      dispatch(setModal(null as any));
      setSelectedDescId("");
      setSelectedTitle(null);
      setSelectedTitleId("");
      setTextVal("");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Fetch report titles on component mount
  useEffect(() => {
    getApi(APICONSTANT.reportTitle);
  }, []);

  const renderCheckboxes = (
    items: ReportTitle[] | ReportDesc[] | null,
    onSelect: (id: string, item: any, checked: boolean) => void,
    selectedId: string,
    type?: string
  ) => (
    <>
      {activeStep === 0 || type === "choice" ? (
        items?.map((item) => (
          <FormGroup key={item._id}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#717171",
                    "&.Mui-checked": {
                      color: violetTheme.primaryColor
                    }
                  }}
                  onChange={(event) =>
                    onSelect(item._id, item, event.target.checked)
                  }
                  checked={selectedId === item._id}
                />
              }
              label={item.title}
            />
            {"description" in item && item.description && (
              <p>{item.description}</p>
            )}
          </FormGroup>
        ))
      ) : (
        <Textarea
          className="w-100 p-2"
          value={textVal}
          onChange={(e: any) => handleValChange(e.target.value)}
        />
      )}
    </>
  );

  return (
    <>
      {loader ? (
        <div className="d-flex justify-content-center p-4">
          <ThreeDots
            visible={true}
            height="40"
            width="60"
            color="var(--search-button-color)"
            radius="5"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : (
        <div className="p-4">
          {activeStep === 0 && (
            <div>
              <h4>Why are you reporting this listing?</h4>
              <p>This won’t be shared with the Host.</p>
              {renderCheckboxes(
                reportTitle,
                handleSelectTitle,
                selectedTitleId
              )}
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <h4>Why do you think {selectedTitle?.title}?</h4>
              {renderCheckboxes(
                reportDesc,
                handleSelectDesc,
                selectedDescId,
                selectedTitle?.subCategoryType
              )}
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <h4>We received your report</h4>
              <p>
                Thanks for taking the time to let us know what’s going on.
                Reports like yours help keep the <AppName /> community safe and
                secure.
              </p>
            </div>
          )}
          <div
            className={`${styles.reportbtn} d-flex justify-content-between m-2`}
          >
            {activeStep === 1 ? (
              <Button
                sx={{
                  color: "var(--text-color)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  "&:hover": {
                    backgroundColor: "#dddd"
                  }
                }}
                disableRipple
                onClick={handleBack}
              >
                Back
              </Button>
            ) : (
              <div className="invisible">back</div>
            )}
            <DynamicButtonComponent
              disableRipple
              variant="outlined"
              className={`${
                (
                  activeStep === 0 || selectedTitle?.subCategoryType === "none"
                    ? !selectedTitle
                    : selectedTitle?.subCategoryType === "text"
                    ? !textVal
                    : !selectedDescId
                )
                  ? styles.nextdisable
                  : styles.nextbtn
              }`}
              disabled={
                activeStep === 0 || selectedTitle?.subCategoryType === "none"
                  ? !selectedTitle
                  : selectedTitle?.subCategoryType === "text"
                  ? !textVal
                  : !selectedDescId
              }
              text={activeStep === 2 ? "Close" : "Next"}
              onClick={handleStep}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReportListing;
