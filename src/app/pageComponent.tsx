"use client";
import React, { useEffect } from "react";
import axios from "axios";

import APICONSTANT from "@/services/config";
import { putApiMethod } from "@/services/global";
import { useAppDispatch } from "@/redux/hooks";
import api from "@/services/utils/axios";
import { addUser, updateStatus } from "@/redux/slice/user/userSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import { usePageContext } from "@/components/Providers/PageContext";

import Home from "../components/homePage";

const HomePage = () => {

  const dispatch = useAppDispatch();
  const { settings } = usePageContext();
  const { google } = settings;

  let code: any;
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    code = params.get("code");
  }

  const getAccessTokenFromCode = async (authorizationCode: any) => {
    try {
      const { data } = await axios.post(APICONSTANT.googleLogin, {
        client_id: google.googleClientId /* GOOGLE_CLIENTID */,
        client_secret: google.googleClientSecret /* GOOGLE_CLIENTSECRET */,
        redirect_uri: google.googleRedirectUrl /* GOOGLE_REDIRECT_URI */,
        grant_type: "authorization_code",
        code: authorizationCode
      });
      return data.access_token;
    } catch (error) {
      console.error("Failed to get access token:", error);
      return false;
    }
  };

  const socialLogin = async (url: string, data: any) => {
    const res = await putApiMethod(url, data);
    if (res.statusCode === 200) {
      localStorage.setItem("appToken", res.data.socialLogin.token);
      api.defaults.headers.Authorization = res.data.socialLogin.token;
      localStorage.setItem("appUserId", res.data.socialLogin.userId);
      localStorage.setItem("usersType", "user");
      // if (pathname === '/login/' && !res.data.socialLogin.verified_email) {
      // 	if(redirectURL !== null) {
      // 	  router.replace(`/verify/?redirecturl=${redirectURL}`);
      // 	}
      // 	else{
      // 	  router.replace('/verify/');
      // 	}
      //   } else if (pathname === '/login/' && res.data.socialLogin.verified_email) {
      // 	if (redirectURL === null) {
      // 	  router.push('/');
      // 	} else if (redirectURL !== null) {
      // 	  router.push(redirectURL);
      // 	}
      //   } else {
      // 	dispatch(setModal('' as any))
      //   }    
      dispatch(updateStatus({loginStatus: true, listCount: res.userListings}))
      dispatch(addUser(res.data.socialLogin));
      // if (pathname === '/' && res.data.socialLogin.verified_email) {
      // 	dispatch(setModal('EmailModal' as any))
      //   }
      dispatch(
        addAlert({
          isOpen: true,
          message: "Login Successfully",
          type: "success",
          severity: "success"
        })
      );
    } else {
      dispatch(
        addAlert({
          isOpen: true,
          message: "User not found",
          type: "error",
          severity: "error"
        })
      );
    }
  };

  useEffect(() => {
    if (code) {
      const fetchData = async () => {
        const accessToken = await getAccessTokenFromCode(code);
        if (accessToken) {
          socialLogin(APICONSTANT.login, {
            accessToken: accessToken,
            fcmId: "",
            type: "google"
          });
        }
      };
      fetchData();
    }
  }, [google]);

  return (
    <>
      <Home />
    </>
  );
};

export default HomePage;
