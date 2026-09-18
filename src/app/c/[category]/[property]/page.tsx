import React from "react";
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { encryptProduct, encryptCategory } from "@/services/utils/helperURL";
import Home from "@/components/roomsPageCustomised";
import APICONSTANT from '@/services/apiConstant';
import Component403 from '@/components/notfound/403'
import Component500 from '@/components/notfound/500'
import Component504 from '@/components/notfound/504'
import getApi from '@/Utils/getApi';
import serverfetch from "@/services/utils/serverfetch";

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {

  const parentProps = await(parent) as Metadata
  const title = `Property - ${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`
  return {
    ...parentProps, 
    title,
    openGraph: {
      ...parentProps.openGraph,
      url: `${parentProps?.openGraph?.url}/about-us`
    }
  };
}

const HomePageDynamic = async (props: any) => {
  const mode1 = headers().get('host')
  const apidata = getApi(mode1 || 'default');
  try {
    const split = props.params.property.split('_').pop();
    const name = props.params ? props.params?.category.toLowerCase() : null;
    let url = `${apidata.live_url + APICONSTANT.approvedListings  }/${split}`;
    if(props.searchParams.viewBy==='admin') {
      url +='?viewBy=admin'
    }

    const dataResponse = await fetch(url,  { next: { revalidate: 0 } });
    if (!dataResponse.ok) {
      if (dataResponse.status === 403) {
        return <Component403 />; // Render 403 page
      } else if (dataResponse.status === 500) {
        return <Component500 />; // Render 500 page
      } else if (dataResponse.status === 504) {
        return <Component504 />; // Render 500 page
      } else {
        return notFound(); // Render not found for other errors
      }
    }
    const data = await dataResponse.json();
    
    const categoryResponse = await fetch(apidata.live_url + APICONSTANT.propertyCategory,  { next: { revalidate: 0 } });
    if (!categoryResponse.ok) {
      if (categoryResponse.status === 403) {
        return <Component403 />; // Render 403 page
      } else if (categoryResponse.status === 500) {
        return <Component500 />; // Render 500 page
      } else if (dataResponse.status === 504) {
        return <Component504 />; // Render 500 page
      } else {
        return notFound(); // Render not found for other errors
      }
    }
    const Category = await categoryResponse.json();
    const Cate = Category.data.categories.some((item: any) => item.category.toLowerCase() === name.replace(/-/g, ' '));
    const url_product_name = props.params.property.split('_')[0];

    const catName = encryptCategory(data?.data?.listing[0]?.propertyCategoryName);
    const { propertyName } = data.data.listing.find((item: any) => item.propertyName);
    const encrypted_url_property = encryptProduct(propertyName);

    if (catName !== name) {
      return notFound();
    }

    if (encrypted_url_property !== url_product_name) {
      return notFound();
    }
    if (!Cate) {
      return notFound();
    }

    const res = await serverfetch(APICONSTANT.getSteps);
    const stepData = Array.isArray(res?.data?.steps)?res?.data?.steps:[];
    let mypages:any[] = [];
      if (Array.isArray(stepData)) {
        for (let i = 0; i < stepData.length; i+=1) {
          const pages = stepData[i].pages;
          for(let j=0; j<pages.length; j+=1) {
            mypages.push(pages[j].name)
          }
        }
      }

    return (
      <Home props={props} pages={mypages} api={apidata} />
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <Component500 />; // Render 500 page for unexpected errors
  }
};

export default HomePageDynamic;
