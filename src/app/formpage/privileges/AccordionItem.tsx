import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import styles from "./page.module.scss";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getApiMethod } from '@/services/global';
import APICONSTANT from '@/services/apiConstant';
import ImageComponent from "@/components/ImageComponent";
import { handleImageError } from "@/services/utils/utils";
import { APIURLS } from "@/services/config";
import { Skeleton } from "@mui/material";

interface Props {
    data: any,
    onChange: (val: any)=> void,
    privilegesItems: any,
    setPrivilegesItems: any,
    value:any,
    index: number
}
function AccordionItem({data,privilegesItems, setPrivilegesItems, onChange, value, index}: Props) {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const getamenityapi = async (url: any) => {
        const resp: any = await getApiMethod(url);
        if (resp.statusCode === 200) {
          if (resp?.data?.privilegeItemList) {
            setPrivilegesItems((prev:any)=>({...prev,
              [data._id]: resp?.data?.privilegeItemList}));
          }
        }
      };

      const fetchInitial = async () => {
        const url = APICONSTANT.privilegesItems+'?privilegeId='+data._id;
          await getamenityapi(url); 
          setExpanded(true);
      }

      useEffect(()=>{
        if(index === 0) {
          fetchInitial();
        }
      },[])

    const handleChange = async (_:any, isExpanded: boolean) => {
        setExpanded(isExpanded);
        if (isExpanded && !privilegesItems[data._id]) {
            setLoading(true);
            try {
                const url = APICONSTANT.privilegesItems+'?privilegeId='+data._id;
              await getamenityapi(url); // Fetch 
            } catch (error) {
              console.error("Error fetching amenities:", error);
            } finally {
              setLoading(false);
            }
          }
    }

  return (
    <Accordion sx={{boxShadow: 'unset'}} expanded={expanded} onChange={handleChange}>
            <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          {data.name}
        </AccordionSummary>
        <AccordionDetails>
        <div className={`${styles.regional_images}`}>
      {loading? Array.from({ length: 3 }).map(()=>(<Skeleton sx={{height: '150px'}}/>)):Array.isArray(privilegesItems[data._id]) && privilegesItems[data._id].length>0 ? privilegesItems[data._id].map((item:any)=>(
                  <div className="d-flex flex-column" key={`region${item._id}`}>
                    <label htmlFor={`check${item._id}`}>
                      <input
                        hidden
                        type="checkbox"
                        name="checkoffer"
                        id={`check${item._id}`}
                        value={item._id}
                        onClick={onChange}
                        checked={value.includes(item._id)}
                      />

                      <div className={`${styles.labelcheck}`}>
                        <div className={`${styles.icon}`}>
                          <ImageComponent
                            src={item.icon}
                            width={45}
                            height={45}
                            alt=""
                            onError={handleImageError}
                          />
                        </div>

                        <p className={`${styles.para} m-0`}>{item.name}</p>
                      </div>
                    </label>
                  </div>
                )): 'No Data Found' }
          </div>
        </AccordionDetails>
          </Accordion>
  )
}

export default AccordionItem
