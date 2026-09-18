'use client';
import React, {useEffect, useState } from 'react';
import styles from './page.module.scss';
import Footer from './footer.module';
import Hero from './hero.module';
import Category from './category.module';
import Carousel from './carouselfit.module';
import { usePageContext } from "@/components/Providers/PageContext";
import Header from '@/components/header';
import { getApiMethod } from '@/services/global';
const FitNest = () => {
  const [themeData, setThemeData] = useState();
  const [categoryName, setCategoryName] = useState('');
  const { i18, currency, settings, responsiveView } = usePageContext();
  const { google, listings, app } = settings;
  const APIKEY = google?.mapApiKey;

  const getTheme = async () => {
    let url = 'theme/detail?_page=1&_limit=8'
    if( settings?.hiddenSettings?.ads==='1') {
      url += '&type=ads'
    }
    const res = await getApiMethod(url);
    setThemeData(res?.data[0])
  }

  useEffect(()=>{
    getTheme();
  },[])

  return (<>
    <div className={`container ${styles.container}`}>
        {/* <Header /> */}
        {APIKEY && <Header page={true} center="hide" />}
        <Hero themeData={themeData} categoryName={categoryName} />
        <Carousel />
        <Category themeData={themeData} setCategoryName={setCategoryName} />
    </div>
    <Footer />
    </>
  );
};

export default FitNest;
