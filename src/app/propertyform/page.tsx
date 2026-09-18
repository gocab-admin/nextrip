"use client";

import React from 'react'
import { useFormContext } from './FormContext';
import Steps from '@/app/formpage/steps';

function Index() {
  const { stepData } = useFormContext();
  console.log('stepData',stepData)
  return (<Steps stepData={stepData} />)
}

export default Index
