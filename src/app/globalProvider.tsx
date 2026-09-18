"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
// import Head from "next/head";

import { dispatch, store } from "@/redux/store";
import { changeCurrency } from "@/redux/slice/CurrencySlice";
import PageContext from "@/components/Providers/PageContext";
// import Geolocation from "@/components/CurrentLoation/getLocation";

import GlobalModals from "../components/GlobalModal";
import useResponsiveView from "@/Utils/responsivehook";
import TawkMessenger from "@/components/tawkchat";
// import Drawar from "./components/Drawar";

export function GlobalProvider({
  children,
  settings,
  i18,
  currency,
  languages,
  baseUrl
}: any) {
  const [direction, setDirection] = useState("ltr");
  const [theme, setTheme] = useState("Light");
  const responsiveView = useResponsiveView()
  useEffect(() => {
    dispatch(changeCurrency(currency?.symbol));
    // if (settings?.theme?.themeColor) {
    //   setTheme(settings?.theme?.themeColor);
    // }
  }, [settings]);

  useEffect(() => {
    document.body.classList.remove("ltr", "rtl");
    document.body.classList.add(localStorage.getItem("Direction") as string);
  }, [direction]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const link: HTMLLinkElement | null = document.getElementById(
  //       "theme-link"
  //     ) as HTMLLinkElement | null;
  //     if (link) {
  //       link.href = `/theme-${theme}.css`;
  //     }
  //   }
  // }, [theme]);

  return (
    <PageContext.Provider
      value={{
        i18: i18,
        currency: currency,
        settings: settings,
        languages: languages,
        responsiveView:responsiveView,
        direction,
        setDirection,
        theme,
        setTheme,
        baseUrl
      }}
    >
      <Provider store={store}>
        {children}
        {/* <Drawar/> */}
        <GlobalModals />
        <TawkMessenger/>
        {/* <Geolocation /> */}
      </Provider>
    </PageContext.Provider>
  );
}
