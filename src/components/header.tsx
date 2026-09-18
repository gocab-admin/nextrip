"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo, Starlogo } from "@/app/global/svg";
import { useAppDispatch } from "@/redux/hooks";
import { getChatCount } from "@/redux/slice/chatNotification";
import { usePageContext } from "@/components/Providers/PageContext";
import "./header.scss";
import styles from "./componentheaderstyles.module.scss";
import HeaderProfile from "./headerprofile";
import LoadMap from "./LoadMap";
// import SearchBar from "./MobilesearchBar";
import SearchBarComp from "./searchbar";
import Categories from "./categories";
import HeaderMenu from "./headermenus";
import HomePageFilter from "./homepageFilter";
import ResponsiveHeaderProfile from "./responsiveheaderprofile";

const libraries: any = ["places"];

export default function Header(props: any) {
  const { settings, responsiveView } = usePageContext();
  const { google } = settings;
  const APIKEY = google?.mapApiKey;

  const getId =
    typeof window !== "undefined" && localStorage?.getItem("appUserId")
      ? true
      : false;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [guest, setGuest] = useState(false);
  const [checkin, setCheckin] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (getId) {
      dispatch(getChatCount());
    }
  }, [getId]);

  const onloadmap = () => {
    setLoaded(true);
  };

  const Toggleclose = () => {
    if (checkin) {
      setCheckin(false);
      //  setChangeStyle('searchWhere')
    }

    if (checkout) {
      setCheckout(false);
      //  setChangeStyle('searchWhere')
    }

    if (guest) {
      setGuest(false);
      // setChangeStyle('searchWhere')
    }
  };

  const handleLinkClick = () => {
    if (props?.reset) {
      props?.reset();
    }
    router.push("/");
    localStorage.setItem("usersType", "user");
  };

  return (
    <div className={`${styles.home} border-bottom`} onClick={Toggleclose}>
      <div className={`${styles.header} ${styles.stickyheader}`}>
        <div className={`${styles.header_menu}`}>
          {APIKEY && (
            <LoadMap
              libraries={libraries}
              googleMapsApiKey={APIKEY}
              onloadmap={onloadmap}
            />
          )}
          <div
            className={`d-flex justify-content-between align-items-center py-4`}
          >
            {!props.center &&
            (responsiveView === "sm" || responsiveView === "xs") ? (
              <></>
            ) : (
              <div className={`${styles.logosec}`}>
                <Link href="/" onClick={handleLinkClick}>
                  <Starlogo className={` d-md-block d-lg-none`} />
                  <Logo className={"d-none d-lg-block"} />
                </Link>
              </div>
            )}
            <SearchBarComp props={props} isLoaded={isLoaded} />
            {props.center === "inbox" && props.page && <HeaderMenu />}
            {!props.center ? (
              <div>
                {responsiveView === "sm" || responsiveView === "xs" ? (
                  <HomePageFilter />
                ) : (
                  <HeaderProfile />
                )}
              </div>
            ) : (
              <div>
                <ResponsiveHeaderProfile props={props} />
              </div>
            )}
          </div>
        </div>
        {!props.page && <Categories cateData={props} />}
      </div>
    </div>
  );
}
