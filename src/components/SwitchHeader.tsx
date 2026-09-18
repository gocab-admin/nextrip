import React from 'react'
import Header from "@/components/header";
import AdsHeader from "@/app/ads/components/adsHeader";
import { usePageContext } from "@/components/Providers/PageContext";

interface Props {
  center?: string,
  page?: string;
  type?: string;
}

function SwitchHeader({center, page}:Props) {
  const { settings } = usePageContext();
  return (
    settings.hiddenSettings.listing!=='0' ? <Header center={center} page={page} />:
    <AdsHeader center={center} page={page} />
  )
}

export default SwitchHeader
