import { Metadata, ResolvingMetadata } from "next";

import "../globals.scss";
import "bootstrap/scss/bootstrap.scss";
import "react-toastify/dist/ReactToastify.css";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `Host Dashboard - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title
    // openGraph: {
    //   ...parentProps.openGraph,
    //   url: `${parentProps?.openGraph?.url}/about-us`
    // }
  };
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
