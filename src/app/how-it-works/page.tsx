"use client";

import { useEffect, useState } from "react";
import Header from "../../components/header";
import styles from "./page.module.scss";
import { getApiMethod } from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";

export default function HowDoesWorks() {
  const { baseUrl } = usePageContext();
  const [howdoesworks, sethowDoesWorks] = useState<any>([]);

  const handleFetch = async () => {
    try {
      const reponse = await getApiMethod(APICONSTANT.howdoesworks);
      if (reponse.statusCode === 200) {
        if (Array.isArray(reponse.data.works))
          sethowDoesWorks(reponse.data.works);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    {
      handleFetch();
    }
  }, []);

  return (
    <>
      <Header center="hide" page="hide" />
      <div className={styles.main}>
        <div className={styles.section}>
          {howdoesworks.map((items: any) => {
            return (
              <div className={styles.section2}>
                <img src={ items.icon} alt="img" />
                <div className={styles.container}>
                  {items.title && <h3>{items.title} </h3>}
                  <p dangerouslySetInnerHTML={{__html: items.description}}></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
