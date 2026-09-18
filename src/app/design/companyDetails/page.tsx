import React from "react";
import { Metadata, ResolvingMetadata } from 'next';

import Company from "./abouts";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `About Us - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title,
    openGraph: {
      ...parentProps.openGraph,
      url: `${parentProps?.openGraph?.url}/about-us`
    }
  };
}

const CompanyPage = () => (
        <>
            <Company />
        </>
    )

export default CompanyPage;
