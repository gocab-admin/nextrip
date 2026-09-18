import { usePageContext } from "@/components/Providers/PageContext";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "@/components/header.scss";
import styles from "@/components/componentheaderstyles.module.scss";
import LoadMap from "@/components/LoadMap";
import { getChatCount } from "@/redux/slice/chatNotification";
import Link from "next/link";
import { Logo, Starlogo } from "@/app/global/svg";
import AdsSearchBar from "@/app/ads/components/adssearchbar";
import HeaderMenu from "@/app/ads/components/adsheadermenu";
import HomePageFilter from "@/app/ads/components/adshomepageFilter";
import HeaderProfile from "@/app/ads/components/adsheaderprofile";
import ResponsiveHeaderProfile from "@/app/ads/components/adsresponsiveheaderprofile";
import Categories from "@/app/ads/components/adscategories";

const libraries: any = ["places"];

const AdsHeader = (props: any) => {
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
    router.push("/");
    localStorage.setItem("usersType", "user");
  };
  console.log("responsiveView", responsiveView, props.center);

  return (
    <div className={`${styles.home} border-bottom`} onClick={Toggleclose}>
      <div className={`${styles.header} ${styles.stickyheader}`}>
        <div className={`${styles.header_menu} border-bottom`}>
          {APIKEY && (
            <LoadMap
              libraries={libraries}
              googleMapsApiKey={APIKEY}
              onloadmap={onloadmap}
            />
          )}
          <div style={{maxWidth: '1200px', margin: 'auto'}}
            className={`d-flex justify-content-between align-items-center py-3`}
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

            <AdsSearchBar props={props} isLoaded={isLoaded} />
            {props.center === "inbox" && props.page && <HeaderMenu />}
            {!props.center ? (
              <div>
                {/* {responsiveView === "sm" || responsiveView === "xs" ? (
                  <HomePageFilter />
                ) : (
                  <HeaderProfile />
                )} */}
                {responsiveView == "sm" || responsiveView !== "xs" && <HeaderProfile />}
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
};

export default AdsHeader;
