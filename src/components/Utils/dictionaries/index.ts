import 'server-only';
// import APICONSTANT, { APIURLS } from '@/services/config';
import getApi from "@/Utils/getApi";
import { headers } from 'next/headers';
import FalbackTranslate from './fallback_translate';
// const dictionaries: {[key: string]: () => Promise<{ [key: string]: { [key: string]: string } }> } = {
//   en: () => import("./intl/en.json").then((module) => module.default),
//   nl: () => import("./intl/nl.json").then((module) => module.default),
// };

export const getDictionary = async (locale: any) => {
  const mode1 = headers().get('host'); 
  const apidata = getApi(mode1 || 'default')
  try {
  const lang = locale || 'en'; //cookie value
  const response = await fetch(`${apidata.base_url}public/locale/${lang}.json`,  { next: { revalidate: 0 } }).then((res) => res.json());
  return response;
  // return {...FalbackTranslate, ...response};
  // return FalbackTranslate;
} catch(err) {
  console.log('langerror___', err);
  return FalbackTranslate;
}
};
