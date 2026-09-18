import React, { ReactNode } from 'react'
import FormProvider from './FormProvider';
import serverfetch from '@/services/utils/serverfetch';
import ADSAPICONSTANT from '@/services/adsApiConstant';
async function Layout({ children }: {children: ReactNode, params:any}) {
  const res = await serverfetch(ADSAPICONSTANT.getSteps);
  const stepData = Array.isArray(res?.data?.steps) ? res?.data?.steps: [];
  console.log('layout fetched');
  return (<FormProvider stepData={stepData} >
    {children}
    </FormProvider>)
}

export default Layout
