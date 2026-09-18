import React from "react";
import { Metadata, ResolvingMetadata } from 'next';
import SubscriptionSuccess from './adsSubscriptionSuccess'

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `Subscription Success - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title
    // openGraph: {
    //   ...parentProps.openGraph,
    //   url: `${parentProps?.openGraph?.url}/about-us`
    // }
  };
}

const BookingSuccessPage = () =>(
        <SubscriptionSuccess />
    )

export default BookingSuccessPage;
