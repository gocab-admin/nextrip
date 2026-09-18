import React from "react";
import { Metadata, ResolvingMetadata } from "next";

import Reservation from "./packageStatus";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `Packages - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title
    // openGraph: {
    //   ...parentProps.openGraph,
    //   url: `${parentProps?.openGraph?.url}/about-us`
    // }
  };
}

const ReservationPage = async () => <Reservation />;

export default ReservationPage;