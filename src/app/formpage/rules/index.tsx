'use client';
import React, { useState } from 'react'
import styles from "./page.module.scss";
import FontIconPicker from '@/components/font-icon-picker/js/FontIconPicker';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StyledTextFieldBorder } from '@/components/styledComponent/styledcomp';
import { usePageContext } from '@/components/Providers/PageContext';

interface Props {
    onChange: any;
    value: any;
}

function Rules({ onChange, value }: Props) {
    const { i18 } = usePageContext();

    return (
        <div className={`${styles.modal}`}>
            <h1 className="me-2">
                {i18?.RULES?.TITLE || "Add rules to your place"}
            </h1>
            <div className="p-2 w-25">
                <div className="d-flex align-items-center mb-3">
                    {/* <IconPicker
                        value={fieldValue}
                        onChange={(value: any) => handleIconChange(value)}
                        icons={icon}
                        defaultValue={selectedRule.image}
                    /> */}

                    <input
                        className="p-3"
                        placeholder="Rule title"
                        type="text"
                        onChange={(e)=>onChange({ruletitle:e.target.value})}
                        defaultValue={value?.ruletitle}
                    />
                </div>

                <textarea
                    className='p-3'
                    placeholder="Rule description"
                    rows={5}
                    onChange={(e)=>onChange({ruledesc:e.target.value})}
                    defaultValue={value?.ruledesc}
                />
            </div>
        </div>
    )
}

export default Rules