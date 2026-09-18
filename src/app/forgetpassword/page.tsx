import React from "react";
import { Metadata, ResolvingMetadata } from "next";

import ForgetPassword from "./pageComponent";

export async function generateMetadata(_:{
  params: { params: {} }
  searchParams: { [key: string]: string | string[] | undefined }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `Forget Password - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title
    // openGraph: {
    //   ...parentProps.openGraph,
    //   url: `${parentProps?.openGraph?.url}/about-us`
    // }
  };
}

const ForgetPasswordPage = () => <ForgetPassword />;

export default ForgetPasswordPage;
