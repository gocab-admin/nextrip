import { URLMAPPER } from "@/app/URLmapper";
import { APIDATA } from "@/siteInterface";

export default function getApi(mode:string): APIDATA {
  // const host = typeof window !== "undefined" ? window.location.host : 'default'
  // const apidata = demoSites[mode] || demoSites["default"]
  mode = mode || 'default'
  const apidata:APIDATA = URLMAPPER[mode] || URLMAPPER['default']
  return {
    base_url: apidata?.base_url,
    image_url: apidata?.image_url,
    live_url: `${apidata?.live_url}module/`,
    host: apidata?.host || 'default'
  }
}
