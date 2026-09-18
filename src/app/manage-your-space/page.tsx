import React from "react";
import { Metadata, ResolvingMetadata } from "next";

import EditView from "./pageComponent";
import APICONSTANT from "@/services/apiConstant";
import serverfetch from "@/services/utils/serverfetch";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `Manage Listing - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title
  };
}

const EditViewPage = async () => {
  const res = await serverfetch(APICONSTANT.getSteps);
  const stepData = Array.isArray(res?.data?.steps)?res?.data?.steps:[];
  let mypages:any[] = [];
    if (Array.isArray(stepData)) {
      for (let i = 0; i < stepData.length; i+=1) {
        const pages = stepData[i].pages;
        for(let j=0; j<pages.length; j+=1) {
          mypages.push(pages[j].name)
        }
      }
    }
return (<EditView pages={mypages} />);
};

export default EditViewPage;
