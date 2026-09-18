"use client"
import APICONSTANT from "./apiConstant";
import getApi from '@/Utils/getApi';
import siteList from '@/siteList';
let mode:any;
if (typeof window !== 'undefined') {
  mode = window.location.host;
}
// mode = headers().get("host");
const item = getApi(mode || 'default');
const BASE_URL = item?.base_url || process.env.NEXT_PUBLIC_BASE_URL; 
const IMAGE_URL = item?.image_url || process.env.NEXT_PUBLIC_IMAGE_URL; 

// const BASE_URL =  process.env.NEXT_PUBLIC_BASE_URL; 

console.log('IMAGE_URL',item)
export const APIURLS = {
  // liveUrl: BASE_URL + "module/",
  liveUrl: `${BASE_URL  }module/`,
  baseUrl: BASE_URL,
  imageUrl : IMAGE_URL,
  socketUrl: `${BASE_URL  }module/`
};


export const GOOGLE_CLIENTID:any = process.env.NEXT_PUBLIC_GOOGLE_CLIENTID
export const GOOGLE_CLIENTSECRET:any = process.env.NEXT_PUBLIC_GOOGLE_CLIENTSECRET
export const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI



export default APICONSTANT;
