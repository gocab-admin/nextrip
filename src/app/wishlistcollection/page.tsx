import React from "react";
import { Metadata, ResolvingMetadata } from "next";

import WishListCollection from "./pageComponent";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  const title = `Wishlistcollection - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`

  return {
    ...parentProps, 
    title
  };
}

const WishListCollectionPage = async () => <WishListCollection />;

export default WishListCollectionPage;

