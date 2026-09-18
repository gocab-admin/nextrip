import siteList from '@/siteList';
import { APIDATA } from "@/siteInterface";

export const URLMAPPER: Record<string, APIDATA> = {

  ...siteList,
  'default': { // if no cookie is present then use this
    base_url: process.env.NEXT_PUBLIC_BASE_URL || "",
    image_url: process.env.NEXT_PUBLIC_IMAGE_URL || '',
    live_url: process.env.NEXT_PUBLIC_BASE_URL || "",
    // base_url: 'https://adstarapi.abservetechdemo.com/',
    // live_url: 'https://adstarapi.abservetechdemo.com/',
    host : "default"
  }
}
