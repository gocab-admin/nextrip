"use client";

import React from 'react'
import { useFormContext } from './FormContext';
import Steps from '@/app/formpage/steps';

function Index() {
  const { stepData } = useFormContext();
  return (<Steps stepData={stepData} />)
}

export default Index
