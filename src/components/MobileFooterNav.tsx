import React, { useEffect } from "react";
import Link from "next/link";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { getChatCount } from "@/redux/slice/chatNotification";
import { usePageContext } from "@/components/Providers/PageContext";
import {
  ProfileList,
  Starlogo,
  WishIcon,
  SearchIcon,
  Chat
} from "@/app/global/svg";
import { dispatch } from "@/redux/store";

import styles from "./searchbar.module.scss";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px"
  }
}));
const MobileFooternav = () => {
  const { i18 } = usePageContext();
  const userInfo = useSelector((state: any) => state.userReducer);
  const isAuth =
    typeof window !== "undefined" && localStorage?.getItem("appToken")
      ? true
      : false;
  const pathname = usePathname();
  const UserId = localStorage.getItem("appUserId");
  // const [notificationlist, setnotificationlist] = useState<any>([])
  const notificationlist = useSelector(
    (state: any) => state.ChatNotificationCount.chatCount
  );
  useEffect(() => {
    if (isAuth) {
      // const Chatnotification = async () => {
      //   const url: any = APICONSTANT.burgerCount
      //   const res = await getApiMethod(url);
      //   setnotificationlist(res?.data);
      // }
      // Chatnotification()
      dispatch(getChatCount());
    }
  }, []);

  return (
    <div className={`${styles.responsive_nav} border-top`}>
      <div className="d-flex justify-content-around align-items-center">
        <Link href="/">
          <button className="">
            <div className="d-flex flex-column align-items-center gap-1">
              <SearchIcon
                width="24"
                height="24"
                style={{
                  fill: "#fff",
                  stroke:
                    pathname === "/"
                      ? "var(--search-button-color)"
                      : "var(--trips-subtitle-color)"
                }}
              />
              <span
                style={{
                  color:
                    pathname === "/"
                      ? "var(--search-button-color)"
                      : "var(--trips-subtitle-color)"
                }}
              >
                {i18?.MOBILEFOOTER?.EXPLORE || "Explore"}
              </span>
            </div>
          </button>
        </Link>

        <Link href="/wishlistcollection">
          <button>
            <div className="d-flex flex-column align-items-center gap-1">
              <WishIcon
                width="24"
                height="24"
                style={{
                  fill: "#fff",
                  stroke:
                    pathname === "/wishlistcollection/"
                      ? "var(--search-button-color)"
                      : "var(--trips-subtitle-color)"
                }}
              />
              <span
                style={{
                  color:
                    pathname === "/wishlistcollection/"
                      ? "var(--search-button-color)"
                      : "var(--trips-subtitle-color)"
                }}
              >
                {i18?.MOBILEFOOTER?.WISHLIST || "Wishlist"}
              </span>
            </div>
          </button>
        </Link>
        {isAuth && (
          <Link href="/user/trips/?trip=pendingBooking">
            <button>
              <div className={`d-flex flex-column align-items-center ${styles.trip_icon}`}>
                <Starlogo
                  width="24"
                  height="24"
                  style={{
                    fill: "#717171",
                    marginleft: "8px",
                    position: "relative",
                    bottom: "6px",
                    right: "-4px",
                    stroke:
                      pathname === "/user/trips/"
                        ? "var(--search-button-color)"
                        : "var(--trips-subtitle-color)"
                  }}
                />
                <span
                  style={{
                    color:
                      pathname === "/user/trips/"
                        ? "var(--search-button-color)"
                        : "var(--trips-subtitle-color)",
                    position: "relative",
                    bottom: "6px",
                    right: "-4px",
                    marginTop: "5px"
                  }}
                >
                  {i18?.TRIPS?.TRIPS || "Trips"}
                </span>
              </div>
            </button>
          </Link>
        )}
        {isAuth && (
          <Link href="/guest/inbox">
            <button>
              <div className="d-flex flex-column align-items-center gap-1">
                <StyledBadge
                  badgeContent={notificationlist}
                  invisible={pathname === "/guest/inbox/" ? true : false}
                  sx={{
                    "& .MuiBadge-badge": {
                      position: "absolute",
                      backgroundColor: "var(--search-button-color)!important",
                      color: "#fff"
                    }
                  }}
                >
                  <Chat
                    width="24"
                    height="24"
                    style={{
                      fill:
                        pathname === "/guest/inbox/"
                          ? "var(--search-button-color)"
                          : "var(--trips-subtitle-color)",
                      position: "relative",
                      bottom: "12px",
                      right: "10px",
                      stroke:
                        pathname === "/guest/inbox/"
                          ? "var(--search-button-color)"
                          : "var(--trips-subtitle-color)"
                    }}
                  />
                </StyledBadge>
                <span
                  style={{
                    color:
                      pathname === "/guest/inbox/"
                        ? "var(--search-button-color)"
                        : "#var(--trips-subtitle-color)"
                  }}
                >
                  {i18?.MOBILEFOOTER?.INBOX || "Inbox"}
                </span>
              </div>
            </button>
          </Link>
        )}
        {isAuth ? (
          <Link href="/account-settings">
            <button>
              <div className="d-flex flex-column align-items-center gap-1">
                <ProfileList
                  width="24"
                  height="24"
                  style={{
                    fill: "#717171",
                    stroke:
                      pathname === "/account-settings/"
                        ? "var(--search-button-color)"
                        : "var(--trips-subtitle-color)"
                  }}
                />
                <span
                  style={{
                    color:
                      pathname === "/account-settings/"
                        ? "var(--search-button-color)"
                        : "var(--trips-subtitle-color)"
                  }}
                >
                  {i18?.HEADER?.PROFILE || "Profile"}
                </span>
              </div>
            </button>
          </Link>
        ) : (
          <Link href="/login">
            <button>
              <div className="d-flex flex-column align-items-center gap-1">
                <ProfileList
                  width="24"
                  height="24"
                  style={{
                    fill: "#717171",
                    stroke:
                      pathname === "/login/"
                        ? "var(--search-button-color)"
                        : "var(--trips-subtitle-color)"
                  }}
                />
                <span
                  style={{
                    color:
                      pathname === "/login/"
                        ? "var(--search-button-color)"
                        : "var(--trips-subtitle-color)"
                  }}
                >
                  {i18?.HEADER?.LOGIN || "Login"}
                </span>
              </div>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileFooternav;
