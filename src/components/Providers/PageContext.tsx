"use client";
import { createContext, useContext } from "react";

const defaultValue: any = {
    i18: {}, currency: {}, settings: {}
};

const PageContext = createContext(defaultValue);

export const usePageContext = () => useContext(PageContext);

export default PageContext;
