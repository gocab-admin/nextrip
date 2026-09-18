"use client";

import React, { useInsertionEffect, useLayoutEffect } from "react";
import ADSAPICONSTANT from "@/services/adsApiConstant";
import { useFormContext } from "@/app/ads/form/FormContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { postApiMethod, getApiMethod } from "@/services/global";
import StepsIntro from "@/app/formpage/steps-intro";

function PageComponent() {
  const { step }: { step: string } = useParams();
  const { setNextDisable, stepData, actionRef, setLoading, listId, setListId } =
    useFormContext();
  const path = usePathname();
  const router = useRouter();

  const currentStep = parseInt(step.replace("step", ""));
  const data = stepData[currentStep - 1];

  const listInfo = async (url: any, data: any) => {
    if (!listId) {
      setLoading(true);
      const res: any = await postApiMethod(url, data);
      console.log(res.data, "res");
      if (res.statusCode === 200) {
        if (res.data?.ads?._id) {
          setLoading(false);
          return {
            status: true,
            listId: res.data?.ads?._id,
            nochange: true,
          };
        }
      }
      setLoading(false);
      return { status: false, nochange: true };
    } else {
      return { status: true, nochange: true };
    }
  };

  const handleSave = async (mode: string) => {
    if (mode === "next") {
      const infoData = {
        name: "untitled",
        desc: "Take a break and unwind at this peaceful oasis.",
        userId:
          typeof window !== "undefined"
            ? localStorage.getItem("appUserId")
            : "",
      };
      return await listInfo(ADSAPICONSTANT.listinfo, infoData);
    } else {
      return { status: true, nochange: true };
    }
  };

  useInsertionEffect(() => {
    if (currentStep === 1) {
      //for step1 only
      actionRef.current = handleSave;
    } else {
      actionRef.current = null;
    }
    return () => {
      actionRef.current = null;
    };
  }, [currentStep]);

  const fetchPending = async () => {
    const res = await getApiMethod(ADSAPICONSTANT.pendingList);
    const pendingListId = res?.data?._id;
    if (pendingListId && path.includes("/create/intro/step1/")) {
      setListId(pendingListId);
      router.push("/ads/form/" + pendingListId + "/intro/step1/");
    }
  };

  useLayoutEffect(() => {
    // fetch pending step for first step
    if (currentStep === 1) {
      fetchPending();
    }

    setNextDisable(false); // optional step
  }, []);

  if (!data && currentStep !== 1) {
    const baseUrl = path.replace(/step\d+/, "step1");
    return router.push(baseUrl);
  }

  return <StepsIntro data={data} currentStep={currentStep} />;
}

export default PageComponent;
