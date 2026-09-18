import React, { ReactNode } from 'react'
import FormProvider from './FormProvider';
import serverfetch from '@/services/utils/serverfetch';
import APICONSTANT from '@/services/apiConstant';
async function Layout({ children }: {children: ReactNode, params:any}) {
  const res = await serverfetch(APICONSTANT.getSteps);
  const stepData = Array.isArray(res?.data?.steps)? res?.data?.steps : [];
  console.log('stepData',stepData)
  return (<FormProvider stepData={stepData} >
    {children}
    </FormProvider>)
}

export default Layout
