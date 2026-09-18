"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

import Header from '@/components/header';
import Footer from "@/components/footer";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from './page.module.scss'

const Company = () => {
    const {i18} = usePageContext();
    const [about, setabout] = useState<any>()
    const [Loader, setLoader] = useState(false)
    const fetchData = async () => {
        setLoader(true)
        try {
            const res = await getApiMethod(APICONSTANT.cms + '?type=aboutUs');
            if (res.statusCode === 200) {
                setLoader(false)
                setabout(res.data[0].content)
            } else {
                // 
            }
        } catch (error) {
            setLoader(false)
            console.error(error);
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <div>
                <Header center='hide' page='hide' />
            </div>
            <div className={`${styles.body}`}>
                <div className={`${styles.content}`}>
                    <h3>{i18?.LISTING?.COMPANYDETAILS || "Company Details"}</h3>
                    <p className="pt-2"><b>{i18?.LISTING?.PROVIDEROFTHEWEBSITE || "Provider of the website"}:</b></p>
                    {
                        Loader ?
                            <>
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </>
                            :
                            <div className={`${styles.para}`} dangerouslySetInnerHTML={{ __html: about }} />

                    }

                </div>
            </div>
            <Footer />
        </>
    )
}

export default Company