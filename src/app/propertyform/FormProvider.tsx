"use client";
import React, { ReactNode, useEffect, useMemo, useRef, useState, useTransition } from "react";
import FormContext from "./FormContext";
import DynamicButtonComponent from "@/components/DynamicComponent/ButtonComponent";
import styles from "./layout.module.scss";
import Link from "next/link";
import { Starlogo } from "@/app/global/svg";
import { usePageContext } from "@/components/Providers/PageContext";
import { usePathname } from "next/navigation";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import { getListingData } from "@/redux/slice/propertySlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import APICONSTANT from "@/services/config";
import getStepsUrl from "@/services/utils/getPropertySteps";
// import { saveDataInIndexDB, getDataFromIndexDB } from "@/Utils/indexDb";
// import { setData } from "@/redux/slice/listingSlice";
import { useDispatch } from "react-redux";
import useLoadingouter from "@/Utils/useLoadingouter";
import { postAPI } from "@/app/propertyform/formAPI";
import LinearLoader from "@/components/LinearLoader";
const baseUrl = "/propertyform";
const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

interface StepMap {
  completed: number;
  total: number;
}

export default function FormProvider({
  children,
  stepData
}: {
  children: ReactNode;
  stepData: any;
}) {
  const { i18 } = usePageContext();
  const paths = usePathname();
  const dispatch = useDispatch();
  const theme = useTheme();
  const actionRef = useRef<any>();

  const path = paths.replace(baseUrl, "");
  const { router, isPending } = useLoadingouter();

  const listIdX = useMemo(() => {
    const urlId = path.substring(1).split("/").shift();
    let listIdX = "";
    if (urlId && isValidObjectId(urlId)) {
      listIdX = urlId;
    }
    return listIdX;
  }, [path]);

  const pages = useMemo(() => {
    let mypages = ["/"]; // First page
    let myStepInfo = [{}];
    if (Array.isArray(stepData)) {
      for (let i = 0; i < stepData.length; ++i) {
        const stepPages = getStepsUrl(stepData[i].pages, listIdX, i);
        mypages = [...mypages, ...stepPages.steps];
        myStepInfo = [...myStepInfo, ...stepPages.stepInfo];
      }
    }
    return {
      steps: mypages,
      stepInfo: myStepInfo
    }
  }, [stepData, listIdX]);

  const mapSteps = useMemo(() => {
    const steps: StepMap[] = [];
    // loop each step untill you find the page
    if (Array.isArray(stepData)) {
      let foundPage = false;
      for (let i = 0; i < stepData.length; ++i) {
        const stepPages = getStepsUrl(stepData[i].pages, listIdX, i)
        const steppos = stepPages.steps.findIndex(
          (item: any) => item === path
        );
        if (steppos !== -1) {
          // Here 40/1 is used for first step of progress bar where completed step is 0
          steps.push({
            total: steppos === 0 ? 40 : stepData[i].pages.length + 1,
            completed: steppos === 0 ? 1 : steppos
          });
          foundPage = true;
        } else {
          // assume all steps are completed
          steps.push({
            total: stepData[i].pages.length + 1,
            completed: foundPage ? 0 : stepData[i].pages.length
          });


        }
      }
    }
    return steps;
  }, [stepData, path, listIdX]);

  const progressPercentage = pages.steps.findIndex((item) => item === path);

  const pageData = useMemo(() => {
    const pageData = pages.stepInfo[progressPercentage] || {};
    return pageData;
  }, [progressPercentage, pages])
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [nextLoading, startNext] = useTransition();
  const [exitLoading, startExit] = useTransition();
  const [nextDisable, setNextDisable] = useState(true);
  const [listId, setListId] = useState(listIdX);
  // const progressPercentage = (activeStep / (pages.length - 1)) * 100;
  useEffect(() => {
    if (listId) {
      dispatch(getListingData(listId));
    }
  }, [listId]);

  const saveCurrentStep = async () => {
    const basicDetails = {
      progressPercentage
    };
    return await postAPI(
      `${APICONSTANT.basicdetails}/${listId}`,
      basicDetails
    );
  }

  const handleSave = async (mode: string) => {
    if (mode === 'save') {
      setSaveLoading(true);
    } else {
      setLoading(true);
    }
    if (actionRef?.current) {
      try {
        const res = await actionRef.current(mode);
        if (res?.status) {
          if (res.listId && mode === 'next') {
            // first time create
            setListId(res.listId);
            let nextPage = baseUrl + pages.steps[progressPercentage + 1];
            nextPage = nextPage.replace("/create/", `/${res.listId}/`);
            setLoading(false);
            return router.push(nextPage);
          }
          if (res?.nochange && mode === 'save') {
            await saveCurrentStep();
          } else if (mode === 'last' && res?.currentStatus === 'pending') {
            return router.push("/hosting/");
          }
        } else if (mode !== "prev") {
          // some error comes
          if (res?.error) {
            console.log(res?.error);
            dispatch(
              addAlert({
                isOpen: true,
                message: res?.error,
                type: "error",
                severity: "error"
              })
            );
          } else if (mode === "save") {
            await saveCurrentStep();
            router.push("/hosting/listings/");
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        setLoading(false);
        console.log("err", err);
        return;
      }
    } else {
      if (mode === "save") {
        await saveCurrentStep();
      }
    }
    setLoading(false);
    if (mode === "next" && pages.steps[progressPercentage + 1]) {
      router.push(baseUrl + pages.steps[progressPercentage + 1]);
    } else if (mode === "prev") {
      router.back();
    } else if (mode === "save" || mode === "last") {
      return router.push("/hosting/listings/");
      // router.push("/hosting/");
    }
  };

  const handleBack = async () => {
    // handleSave("prev");
    if (pages.steps[progressPercentage - 1]) {
      router.push(baseUrl + pages.steps[progressPercentage - 1]);
    }
  };

  const handleNext = async () => {
    const mode = progressPercentage === pages.steps.length - 1 ? 'last' : 'next'
    startNext(() => {
      handleSave(mode);
    });
  };

  const handlesaveExit = async () => {
    startExit(() => {
      handleSave("save");
    })
  };

  return (
    <FormContext.Provider
      value={{
        progressPercentage,
        setNextDisable,
        actionRef,
        setLoading,
        pageData,
        stepData,
        listId, // property id
        setListId
      }}
    >
      <div className={`${styles.host}`}>
        <header className={`${styles.navigation} border-bottom`}>
          <div
            className={`${styles.header_nav} d-flex align-items-center justify-content-between h-100`}
          >
            <Link href="/">
              <Starlogo
                width={50}
                height={0} // Set height to 0 to allow aspect ratio preservation
                layout="intrinsic"
                color="red"
                responsive="d-lg-block d-none"
              />
            </Link>
            {progressPercentage > 1 && progressPercentage !== (pages.steps.length - 1) &&
              <DynamicButtonComponent
                variant="outlined"
                className={`${styles.savebtn
                  }`}
                onClick={handlesaveExit}
                disabled={saveLoading || loading || nextLoading}
                text={i18?.ROOMPAGE?.SAVE_AND_EXIT || "Save And Exit"}
                isSubmitting={saveLoading || exitLoading}
              />
            }
          </div>
          <LinearLoader loading={isPending || loading || saveLoading} />
        </header>
        {children}

        {progressPercentage === 0 ? (
          <div className={`${styles.getstarbtn2}`}>
            <div className={`${styles.btn} d-flex justify-content-end`}>
              <Link href={baseUrl + pages.steps[progressPercentage + 1] || baseUrl}>
                <DynamicButtonComponent
                  variant="contained"
                  text={i18?.BUTTONS?.GETSTARTED || "Get Started"}
                  padding="12px"
                  borderRadius="8px"
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className={`${styles.getstarbtn}`}>
            <ThemeProvider theme={theme}>
              <div className="d-flex">
                {mapSteps.map((item, index) => (
                  <MobileStepper
                    key={index}
                    className={index === 0 ? "px-0" : "pe-0"}
                    variant="progress"
                    steps={item.total}
                    position="static"
                    activeStep={item.completed}
                    sx={{ flexGrow: 1 }}
                    nextButton={
                      <Button hidden>{i18?.BUTTONS?.NEXT || "Next"}</Button>
                    }
                    backButton={
                      <Button hidden>{i18?.BUTTONS?.BACK || "Back"}</Button>
                    }
                  />
                ))}
              </div>
              <div
                className={`${styles.barbtn} `}
              >
                <Button
                  disableRipple
                  className={`${styles.backbtn}`}
                  onClick={handleBack}
                  disabled={loading || isPending}
                >
                  {i18?.BUTTONS?.BACK || "Back"}
                </Button>

                <DynamicButtonComponent
                  variant="outlined"
                  className={`${!nextDisable ? styles.nextbtn : styles.nextdisable
                    }`}
                  onClick={handleNext}
                  disabled={isPending || saveLoading || nextLoading || nextDisable || loading}
                  text={
                    progressPercentage === pages.steps.length - 1
                      ? i18?.ROOMPAGE?.SAVE || "Save"
                      : i18?.BUTTONS?.LOWERNEXT || "Next"
                  }
                  isSubmitting={(isPending && !saveLoading) || loading || nextLoading}
                />
              </div>
            </ThemeProvider>
          </div>
        )}
      </div>
    </FormContext.Provider>
  );
}
