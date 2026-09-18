import React from "react";
import { useRouter } from "next/navigation";

import { deleteApiMethod } from "@/services/global";
import { setModal } from "@/redux/slice/modalSlice";
import { dispatch } from "@/redux/store";
import { usePageContext } from "@/components/Providers/PageContext";

import  styles from './componentEditModal.module.scss'

const DeactivateModal = () => {
    const {i18} = usePageContext();
    const router = useRouter()
    const id = localStorage.getItem('appUserId')
    const handleDelete = async () => {
       try{
        const res =await deleteApiMethod(`auth/user/${id}`)
        if(res.statusCode === 200){
           localStorage.clear()
           router.push('/')
        }
       }catch(err){
        console.error(err)
       }
    }
    return (
        <>
            <div className="p-3">
                <p>{i18?.ACCOUNTINFO?.DOYOUWANTDEACTIVATE || "Do you want to deactivate your account?"} </p>
            </div>
            <div className={`${styles.footer} border-top`}>
                <button onClick={() => dispatch(setModal('' as any))} className={`${styles.btn1}`}>{i18?.TRIPS?.CANCEL|| "Cancel"}</button>
                <button onClick={handleDelete} className={`${styles.btn2}`}>{i18?.BUTTONS?.YES || "Yes"}</button>
            </div>
        </>
    )
}
export default DeactivateModal;