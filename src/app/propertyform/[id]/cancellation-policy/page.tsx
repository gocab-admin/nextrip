'use client';
import React, { useEffect, useState } from 'react'
import CancellaionPolicy from "@/app/formpage/cancellation-policy";
import { dispatch } from '@/redux/store';
import { setData, propertySelector } from "@/redux/slice/propertySlice";
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/hooks';
import { useFormContext } from '../../FormContext';
import { postApiMethod } from '@/services/global';
import APICONSTANT from '@/services/apiConstant';
import { postAPI } from '../../formAPI';

function PageComponent() {
    const dispatch = useDispatch();
    const { ListInfo } = useAppSelector<any>(propertySelector);
    const { setNextDisable, listId, actionRef, progressPercentage } = useFormContext();
    const [formChanged, setFormChanged] = useState(false);

    useEffect(() => {
        setNextDisable(false);
    }, []);


    const {
        cancellationPolicyId
    } = ListInfo;

    const handleSave = async () => {
        if (formChanged) {
            const option = {
                cancellationPolicyId: cancellationPolicyId
            }


            const res = await postAPI(`${APICONSTANT.cancellationPolicy}?listingId=${listId}`, option);
            return res
        } else {
            return { status: true, nochange: true }; // no form change
        }
    }

    actionRef.current = handleSave;
    useEffect(() => {
        actionRef.current = handleSave;
        return () => {
            actionRef.current = null;
        };
    }, []);

    const onChange = (data: any) => {
        debugger
        dispatch(setData(data));
        setFormChanged(true);
    }
    return (
        <div>
            <CancellaionPolicy onChange={onChange} value={ListInfo} />
        </div>
    )
}

export default PageComponent