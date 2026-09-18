"use client";
import { useEffect } from "react";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { usePageContext } from "@/components/Providers/PageContext";
import FormControlLabel from "@mui/material/FormControlLabel";
import APICONSTANT from "@/services/apiConstant";
import { getApiMethod } from "@/services/global";
import { FormGroup, Radio } from "@mui/material";
import { propertySelector } from "@/redux/slice/propertySlice";
import { useAppSelector } from "@/redux/hooks";

interface Props {
    onChange: any;
    value: any;
}

function CancellationPolicy({ onChange, value }: Props) {
    const { i18 } = usePageContext();
    const [policy, setPolicy] = useState<any>();
    const [icon, setIcon] = useState();

    const getIcon = async (url: any) => {
        const resp = await getApiMethod(url);
        if (resp.statusCode === 200) {
            setIcon(resp.data.icons);
        }
    };
    
    const getpolicy = async (url: any) => {
        const res = await getApiMethod(url);
        if (res.statusCode === 200) {
            getIcon(`${APICONSTANT.icon}?_page=1&_limit=20`);
            setPolicy(res.data.policies);
        }
    };

    useEffect(() => {
        getpolicy(APICONSTANT.cancellationPolicy);
    }, []);

console.log('value',value)
    return (
        <section className={styles.policy}>
            <h1 className="me-2">
            {i18?.CANCELLATIONPOLICY?.TITLE || "Cancellation policy"}
          </h1>
            <div className="w-25" >
                {policy &&
                    Array.isArray(policy) && policy.map((item) => (
                        <div key={item.id} className={styles.container}>
                            <p className="m-0">{item.title}</p>
                            <FormGroup>
                                <FormControlLabel
                                    label
                                    control={
                                        <Radio
                                            sx={{
                                                color: "#717171",
                                                "&.Mui-checked": {
                                                    color: "black"
                                                }
                                            }}
                                        />
                                    }
                                    value={item.id}
                                    // checked={parseInt(Value) === item.id}
                                    checked={Number(value?.cancellationPolicyId) === item.id}
                                    onChange={(event: any) => onChange({ cancellationPolicyId: event?.target?.value })}
                                />
                            </FormGroup>
                        </div>
                    ))}
            </div>
        </section>
    );
}

export default CancellationPolicy;
