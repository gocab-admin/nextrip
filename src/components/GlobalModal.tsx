'use client';
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useAppSelector } from '@/redux/hooks';
import { alertSelector } from "@/redux/slice/AlertSlice";
import { usePageContext } from "@/components/Providers/PageContext";

import EditModal from './editModal'
import AuthModal from './authenticationModal'
import AlertComponent from "./AlertComponent";

const DynamicOtpModal:any = dynamic(() => import('./OtpModal'))
const DynamicSignupModal:any = dynamic(() => import('./signupModal'))
const DynamicDeactivate:any = dynamic(() => import('./deactivateModal'))
const DynamicLanguageModal:any = dynamic(() => import('./languageModal'))
const DynamicEmailModal:any = dynamic(() => import('./emailModal'))
const DynamicForgotModal:any = dynamic(() => import('./forgotModal'))
const DynamicDateModal : any = dynamic(()=>import('./DateEdit'))
const DynamicReportModal : any = dynamic(()=>import('./ReportListing'))
const DynamicAppModal : any = dynamic(()=>import('./appModal'))


const GlobalModals = () => {
  const { i18 } = usePageContext();
  const activeModel = useSelector((state: any) => state.modal.activeModel)
  const modalData = useSelector((state: any) => state.modal.modalData)
  const { AlertList } = useAppSelector(alertSelector);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
    severity: ""
  });
  const { alert } = AlertList;
  useEffect(() => {
    
    if (alert) {
      setNotify(alert)
    }
  }, [alert])
  return (
    <>
      <AlertComponent notify={notify} setNotify={setNotify} />
      <DynamicOtpModal />
      <AuthModal show={activeModel === 'SignupModal'} buttonText="" message="" login='showsignup' title={i18?.PAGES?.SIGNUP ||"SignUp"} >
        <DynamicSignupModal />
      </AuthModal>
      <EditModal show={activeModel === 'DeactivateModal'} buttonText="" message="" title={i18?.PAGES?.DEACTIVATE || "Deactivate"} >
        <DynamicDeactivate />
      </EditModal>
      <EditModal show={(activeModel === 'LanguageModal' || activeModel === 'CurrencyModal')} buttonText="" title="" message="">
        <DynamicLanguageModal val={activeModel === 'LanguageModal' ? 'language' : 'currency'} />
      </EditModal>
      <AuthModal show={activeModel === 'EmailModal'} buttonText="" title="" message="">
        <DynamicEmailModal />
      </AuthModal>
      <AuthModal show={activeModel === 'ForgotModal'} buttonText="" title="" message="">
        <DynamicForgotModal />
      </AuthModal>
      <AuthModal show={activeModel === 'EditDateModal'} buttonText="" title="Fiish signing up" message="">
        <DynamicDateModal data = {modalData} />
      </AuthModal>
      <EditModal show={activeModel === 'ReportListing'} buttonText="" title="" message="">
        <DynamicReportModal />
      </EditModal>
      <EditModal show={activeModel === 'AppLink'} buttonText="" title="App Links" message="">
        <DynamicAppModal />
      </EditModal>
     
    </>
  )
}

export default GlobalModals;
