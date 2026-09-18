"use client";
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';


const loadScript = (src: string) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        resolve(true);
    };
    script.onerror = () => {
        resolve(false);
    };
    document.body.appendChild(script);
});

export default function Payment({
    keyId,
    currency,
    amount,
    orderId
}: any) {
    const userdata = useSelector((state: any) => state.profile.user)

    async function script() {
        const res = await loadScript(
            'https://checkout.razorpay.com/v1/checkout.js'
        );
        var options = {
            key: keyId,
            amount: amount,
            currency: currency,
            name: userdata.firstname,
            description: "Test Transaction",
            image: "",
            order_id: orderId,
            handler: function (responce: any) {
                let body = responce;
                // verify(body)
            },
            prefill: {
                name: userdata.firstname + userdata.lastname,
                email: userdata.email,
                contact: userdata.phone
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
            }
        };
        if (typeof window !== undefined) {
            // @ts-ignore
            var rzp1: any = new window.Razorpay(options);
            rzp1.open();
        }
    }

    useEffect(() => {
        script()
    }, [])

    return (
        <>
        </>
    )
}
