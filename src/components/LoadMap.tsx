'use client'

import { useEffect, memo } from 'react';

import useMapLoader from '@/hooks/useMapLoader';

interface Props {
  googleMapsApiKey: string,
  onloadmap: ()=>void,
  libraries: any[]
}
const LoadMap = ({
    googleMapsApiKey,
    onloadmap,
    libraries
  }: Props) => {
    const { isLoaded } = useMapLoader();

    useEffect(()=>{
      if(isLoaded) {
        onloadmap();
      }
    },[isLoaded, onloadmap])

    return null;
  };
  
  export default memo(LoadMap);
