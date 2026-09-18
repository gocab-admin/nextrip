'use client';
import React from "react";
import { usePageContext } from "@/components/Providers/PageContext";
import ListingHomepage from "./pageComponent";
import Adslisting from "./ads/pageComponent";
import Homepage from './homepage/page'
import AdsHomepage from './ads/homepage/page'
export default function HomePage() {
  const { settings } = usePageContext();

  return (
    (settings?.theme?.homepage === '1' && settings?.hiddenSettings?.listing === '1') ?
      <Homepage /> :
      (settings?.theme?.homepage === '1' && settings?.hiddenSettings?.ads === '1') ?
        <AdsHomepage /> :
        settings?.hiddenSettings?.listing === '1' ?
          <ListingHomepage /> :
          settings?.hiddenSettings?.ads === '1' ?
            <Adslisting /> :
            <ListingHomepage />
  );
}
