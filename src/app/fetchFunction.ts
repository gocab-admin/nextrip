import { headers } from "next/headers";

import APICONSTANT from "@/services/apiConstant";
import getApi from "@/Utils/getApi";

export async function fetchSettingData(): Promise<any> {
  // const mode = cookies().get("app") || { value: "default" };
  const mode1 = (await headers()).get("host"); //get ip address with port, works only in server side functional component
  const apidata = getApi(mode1 || "default"); // get base url domain from ip address port
  // fetch data
  const response = await fetch(apidata.live_url + APICONSTANT.settings, {
    next: { revalidate: 0 }
  }).then((res) => res.json());
  response.liveurl = apidata?.live_url;
  response.baseurl = apidata?.base_url;
  response.hostName = apidata?.host;
  return response;
}
