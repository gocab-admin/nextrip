import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import ReactDOM from 'react-dom';
import { useSelector } from "react-redux";

import { usePageContext } from "@/components/Providers/PageContext";
import { fetchCurrency, fetchLanguage } from "@/redux/slice/settingSlice";
import { useAppDispatch } from "@/redux/hooks";

import styles from './editModal.module.scss'
// import { useModal } from "./useModal";

function getCookie(cname:any) {
  
  let name = `${cname  }=`;
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const LanguageModal = ({ val }: any) => {
  // const { isShown, toggle } = useModal();
  const dispatch = useAppDispatch();
  const {i18, currency, languages} = usePageContext();
  const lan = getCookie("NEXT_LOCALE");
  const langs = getCookie("NEXT_LANG");
  const curr = getCookie("NEXT_CURRENCY");
  const [value, setValue] = useState("language");
  const [hover, setHover] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(lan || languages?.indexName);
  const [lang, setLang] = useState(langs || languages?.name);
  const [selectedCurrency, setSelectedCurrency] = useState(curr || currency?.code);
  
  const handleLanguageClick = (data:any, e:any ,lang:any) => {
    setHover(true);  // You can adjust this based on your requirements
    setSelectedLanguage(data || lan);
    setLang(lang);
    const newLocale = data;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;
    document.cookie = `NEXT_LANG=${lang}; path=/`;
    window.location.reload();
  };

  const handleCurrencyClick = async (data: any) => {
    setHover(true); // You can adjust this based on your requirements
    await setSelectedCurrency(data?.name);
    const newCurrency = data?.code;
    document.cookie = await `NEXT_CURRENCY=${newCurrency || currency.code}; path=/`;
    window.location.reload();
  };
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const language = useSelector((state: any) => state.settingReducer.languages);
  const currencies = useSelector((state: any) => state.settingReducer.currency);
 
  useEffect(() => {
    dispatch(fetchLanguage())
    dispatch(fetchCurrency())
    setValue(val);
    document.cookie = `NEXT_CURRENCY=${selectedCurrency}; path=/`;
    document.cookie = `NEXT_LOCALE=${selectedLanguage}; path=/`;
    document.cookie = `NEXT_LANG=${lang}; path=/`;
  }, []);

  // const language = [{lang:'English',value:'en'},{lang:'Duch',value:'nl'},{lang:"French" , value:'fr'},{lang:"Arabic" , value:'ar'}]
  // const currency = ["Indian rupee", "Australian dollar", "Brazilian real", "Bulgarian lev"]
  return (
    <div className={`p-3 ${styles.tablist}`}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{}}>
            <TabList onChange={handleChange} aria-label="lab API tabs example"
             sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--search-button-color) !important"
              }
            }}>
              <Tab
                label="Language and region"
                value="language"
                sx={{
                  "&.Mui-selected": {
                    color: "black",
                    fontWeight: "600"
                  } 
                }}
              />
              <Tab
                label="Currency"
                value="currency"
                sx={{
                  "&.Mui-selected": {
                    color: "black",
                    fontWeight: "600"
                  }
                }}
              />
            </TabList>
          </Box>
          <TabPanel value="language" sx={{padding:'0px',marginTop:'30px'}}>
            <h5 style={{marginBottom:'20px', color:'var(--text-color)'}}><b>{i18?.LANGUAGE?.CHOOSELANGUAGE || "Choose a language and region"}</b></h5>
            <div className={`${styles.modal}`}>
              {Array.isArray(language) &&
                language?.map((data: any) => (
                    <div key={data.indexName}>
                      <div
                        className={`${
                          selectedLanguage === data.indexName
                            ? styles.languageModalHover
                            : styles.languageModal
                        }`}
                        onClick={(e) =>
                          handleLanguageClick(data.indexName, e, data.name)
                        }
                      >
                        {data.name}
                      </div>
                    </div>
                  ))}
            </div>
          </TabPanel>
          <TabPanel value="currency" sx={{ padding: "0px", marginTop: "30px" }}>
            <h5 style={{color:'var(--text-color)'}}>
              <b>{i18?.MOBILEFOOTER?.CHOOSEACURRENCY || "Choose a currency"}</b>
            </h5>
            <div className={`${styles.modal}`}>
              {currencies && currency.length !== 0
                ? currencies.map((data: any) => (
                      <div key={data._id} className='text-violet-900'>
                        <div
                          className={`${
                            selectedCurrency === data?.code
                              ? styles.languageModalHover
                              : styles.languageModal
                          }` }
                          onClick={() => handleCurrencyClick(data)}
                        >
                          <p style={{fontSize: 'var(--homepage-footer-size)', margin: 0}}>{data?.name}</p>
                          <span style={{fontSize: 'var(--homepage-footer-size)'}}>{data?.code} - {data?.symbol}</span>
                        </div>
                      </div>
                    ))
                : i18?.HEADER?.NODATAFOUND || "No Data Found"}
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
  // return isShown ? ReactDOM.createPortal(translateModal, document.body) : null;
};
export default LanguageModal;
