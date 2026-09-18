"use client";
import { useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";

import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const auth =
      typeof window !== "undefined" && localStorage?.getItem("appToken")
        ? true
        : false;

    useEffect(() => {
      if (!auth) {
        // return redirect("/login");
        dispatch(setModal("SignupModal" as any));
      }
    }, []);

    if (!auth && typeof window !== "undefined") {
      redirect(
        `/login?redirecturl=${ 
          encodeURIComponent(window.location.pathname + window.location.search)}`,
        RedirectType.replace
      );
    }
    return (
      <div>
        <Component {...props} />
      </div>
    );
  };
}
