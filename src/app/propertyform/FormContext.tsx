"use client";
import { createContext, useContext } from "react";

const defaultValue: any = { i18: {}, currency: {}, settings: {} };

const FormContext = createContext(defaultValue);

export const useFormContext = () => useContext(FormContext);

export default FormContext;