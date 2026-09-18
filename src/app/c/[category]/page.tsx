import React from "react";
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import Home from "@/components/homePage";
import APICONSTANT from '@/services/apiConstant';
import getApi from "@/Utils/getApi";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
    const parentProps = await(parent) as Metadata
    return {...parentProps, title: `${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`};
}

const HomePageDynamic = async (props:any) => {
    const mode1 = headers().get('host'); 
    const apidata = getApi(mode1 || 'default')
    const name = props.params ? props.params?.category.toLowerCase() : null
    const Category = await fetch(apidata.live_url + APICONSTANT.propertyCategory, { next: { revalidate: 0 } }).then((res) => res.json())
    const Cate = Category?.data?.categories?.some((item:any) => item.category.toLowerCase() === name.replace(/-/g, ' '))

    if(!Cate){
        return notFound()
    }
 
    return( <Home categories={Category.data.categories} name={name} />)

};

export default HomePageDynamic;
