import React from "react";
import { Metadata, ResolvingMetadata } from 'next';
import CmsComponent from "./pageComponent";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title,
  };
}

const CompanyPage = () => (
        <>
            <CmsComponent />
        </>
    )

export default CompanyPage;
