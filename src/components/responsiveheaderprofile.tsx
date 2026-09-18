import React, { useState } from "react";
import HeaderProfile from "./headerprofile";
import { usePageContext } from "@/components/Providers/PageContext";
import Notification from "./Notification";
import { useAppSelector } from "@/redux/hooks";
import { updateStatus, userSelector } from "@/redux/slice/user/userSlice";
import {
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import Link from "next/link";
import ImageComponent from "./ImageComponent";
import { APIURLS } from "@/services/config";
import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import styles from "./componentheaderstyles.module.scss";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import Skeleton from "@mui/material/Skeleton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InboxIcon from "@mui/icons-material/Inbox";
import EventNoteIcon from "@mui/icons-material/EventNote";
import InsightsIcon from "@mui/icons-material/Insights";
import DetailsIcon from "@mui/icons-material/Details";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SegmentIcon from "@mui/icons-material/Segment";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useRouter } from "next/navigation";
import { addAlert } from "@/redux/slice/AlertSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { GoGlobe } from "react-icons/go";

const MenuIcon = dynamic(() => import("@mui/icons-material/Menu"));

export default function ResponsiveHeaderProfile({ props }: any) {
  const router = useRouter();
  const { i18, responsiveView } = usePageContext();
  const { status, userInfo } = useAppSelector(userSelector);
  const { loginStatus } = status;
  const isAuth = loginStatus;
  const notificationlist = useSelector(
    (state: any) => state.ChatNotificationCount.chatCount
  );
  const getId =
    typeof window !== "undefined" && localStorage?.getItem("appUserId")
      ? true
      : false;

  const [anchorElBurger, setAnchorElBurger] = useState<null | HTMLElement>(
    null
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openmenu, setOpenMenu] = useState(false);
  const open = Boolean(anchorElBurger);

  const handleClick = () => {
    setOpenDrawer(true);
  };
  const handleCloseBurger = () => {
    setAnchorElBurger(null);
  };

  const pathMapping = [
    {
      text: i18?.HEADER?.ACCOUNT || "Account",
      path: "/account-settings",
    },
  ];
  const HostMenu = [
    { text: i18?.MANAGELISTING?.TODAY || "Today", path: "/hosting" },
    {
      text: i18?.MANAGELISTING?.CALENDAR || "Calendar",
      path: "/hosting/calendar",
    },
    { text: i18?.MANAGELISTING?.INSIGHTS || "Insights", path: "/reviews" },
  ];

  const HostMenuContent = [
    { text: i18?.LISTING?.LISTING || "Listings", path: "/hosting/listings" },
    {
      text: i18?.LISTING?.RESERVATIONS || "Reservations",
      path: "/hosting/reservations",
    },
    {
      text: i18?.LISTING?.CREATEANEWLISTING || "Create a new listing",
      path: "/propertyform",
    },
    {
      text: i18?.LISTING?.TRANSACTIONHISTORY || "Transaction history",
      path: "/user/transaction-history/",
    },
  ];

  const UserMenu = [
    {
      text: i18?.TRIPS?.TRIPS || "Trips",
      path: "/user/trips/?trip=pendingBooking",
    },
    { text: i18?.HEADER?.WISHLISTS || "Wishlist", path: "/wishlistcollection" },
  ];

  const icons = [AccountCircleIcon];
  const iconMenu = [DetailsIcon, EventNoteIcon, InsightsIcon];
  const iconMenuCon = [
    SegmentIcon,
    BookOnlineIcon,
    PlaylistAddIcon,
    HistoryIcon,
  ];
  const UserIcon = [ModeOfTravelIcon, FavoriteBorderIcon];
  const handleLogout = () => {
    setOpenDrawer(false);
    localStorage.clear();
    dispatch(updateStatus(false));
    // dispatch(updateCount(0));
    router.push("/");
    dispatch(
      addAlert({
        isOpen: true,
        message: "Logout Successfully",
        type: "success",
        severity: "success",
      })
    );
  };
  const handleHostClick = () => {
    router.push("/hosting");
    localStorage.setItem("usersType", "host");
  };
  const handleLinkClick = () => {
    router.push("/");
    localStorage.setItem("usersType", "user");
  };
  const handleLangModel = () => {
    dispatch(setModal("LanguageModal" as any));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        {props.type && isAuth && <Notification />}
        {responsiveView === "sm" || responsiveView === "xs" ? (
          <>
            <Badge
              badgeContent={notificationlist}
              invisible={getId ? false : true}
              sx={{
                "& .MuiBadge-badge": {
                  position: "absolute",
                  // backgroundColor: "var(--btn-text-color)!important",
                  // color: "var(--search-button-color)"
                  backgroundColor: "var(--btn-bg-color)!important",
                  color: "var(--btn-text-color)",
                },
              }}
            >
              <button
                className="d-flex align-items-center bg-transparent border border-transparent rounded-circle p-2"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{ zIndex: 1000 }}
              >
                {/* <MenuIcon sx={{ color: "var(--btn-text-color)" }} /> */}
                <MenuIcon sx={{ color: "var(--svg-color)" }} />
              </button>
            </Badge>
          </>
        ) : (
          <div>
            <HeaderProfile host={props.type} page={props.login} i18={i18} />
          </div>
        )}
      </div>

      <Drawer
        anchor="top"
        open={openDrawer}
        PaperProps={{ style: { width: "100%", height: "100%" } }}
      >
        <div className={`${styles.drawer}`}>
          <div
            className={`${styles.static}`}
            onClick={() => setOpenDrawer(false)}
          >
            <CloseIcon />
          </div>
          <Link href="/profiles/user">
            <div className={`${styles.profile}`}>
              {userInfo?.profileImage && (
                <ImageComponent
                  src={userInfo.profileImage}
                  // altSrc={'/images/profil-pic-dummy.png'}
                  alt="profile"
                  width={150}
                  height={150}
                  loading="lazy"
                />
              )}
              <div className={`${styles.text}`}>
                {userInfo?.firstname && <h4>{userInfo.firstname}</h4>}
              </div>
            </div>
          </Link>
          {isAuth &&
            pathMapping.map((items: any, index) => (
              <div key={items?.text}>
                <Link href={items?.path} passHref>
                  <ListItem component="a">
                    {icons[index] && (
                      <ListItemIcon>
                        {React.createElement(icons[index], {
                          sx: { color: "var(--listItem-icon-color)" },
                        })}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={items?.text}
                      sx={{ color: "var(--footer-text-color)" }}
                    />
                  </ListItem>
                </Link>
              </div>
            ))}
          {!isAuth && (
            <>
              <ListItem
                onClick={() => dispatch(setModal("SignupModal" as any))}
              >
                <ListItemIcon>
                  <LoginIcon sx={{ color: "var(--listItem-icon-color)" }} />
                </ListItemIcon>
                <ListItemText
                  primary={i18?.HEADER?.LOGIN || "Login"}
                  sx={{ color: "var(--footer-text-color)" }}
                />
              </ListItem>

              <ListItem
                onClick={() => dispatch(setModal("SignupModal" as any))}
              >
                <ListItemIcon>
                  <PersonAddIcon sx={{ color: "var(--listItem-icon-color)" }} />
                </ListItemIcon>
                <ListItemText
                  primary={i18?.HEADER?.SIGNUP || "signUp"}
                  sx={{ color: "var(--footer-text-color)" }}
                />
              </ListItem>

              <Link href="/">
                <ListItem>
                  <ListItemIcon>
                    <HelpOutlineIcon sx={{ color: "var(--text-color)" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Help center"
                    sx={{ color: "var(--footer-text-color)" }}
                  />
                </ListItem>
              </Link>
            </>
          )}
          {props.type && isAuth && (
            <List>
              {HostMenu.map((items: any, index) => (
                <div key={items?.text}>
                  <Link href={items?.path} passHref>
                    <ListItem component="a">
                      {iconMenu[index] && (
                        <ListItemIcon>
                          {React.createElement(iconMenu[index], {
                            sx: { color: "var(--footer-text-color)" },
                          })}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={items?.text}
                        sx={{ color: "var(--footer-text-color)" }}
                      />
                    </ListItem>
                  </Link>
                </div>
              ))}
              <Link href="/guest/inbox">
                <ListItem component="div">
                  <ListItemIcon sx={{ position: "relative" }}>
                    <Badge
                      badgeContent=""
                      variant="dot"
                      invisible={getId && notificationlist !== 0 ? false : true}
                      sx={{
                        "& .MuiBadge-badge": {
                          position: "absolute",
                          backgroundColor: "var(--btn-bg-color)!important",
                          color: "var(--btn-text-color)",
                        },
                      }}
                    >
                      <InboxIcon sx={{ color: "var(--listItem-icon-color)" }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={i18?.MOBILEFOOTER?.INBOX || "Inbox"}
                    sx={{
                      color: "var(--footer-text-color)",
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
              </Link>
              <ListItem component="div">
                <ListItemIcon>
                  <WidgetsIcon sx={{ color: "var(--listItem-icon-color)" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Menu"
                  sx={{ color: "var(--footer-text-color)", fontWeight: "bold" }}
                />
                <ListItemIcon>
                  {openmenu ? (
                    <KeyboardArrowUpIcon onClick={() => setOpenMenu(false)} />
                  ) : (
                    <KeyboardArrowDownIcon onClick={() => setOpenMenu(true)} />
                  )}
                </ListItemIcon>
              </ListItem>
              {openmenu && (
                <>
                  {HostMenuContent.map((items: any, index) => (
                    <div key={items?.text}>
                      <Link href={items?.path} passHref>
                        <ListItem component="a">
                          {iconMenuCon[index] && (
                            <ListItemIcon>
                              {React.createElement(iconMenuCon[index], {
                                sx: { color: "var(--listItem-icon-color)" },
                              })}
                            </ListItemIcon>
                          )}
                          <ListItemText
                            primary={items?.text}
                            sx={{ color: "var(--footer-text-color)" }}
                          />
                        </ListItem>
                      </Link>
                    </div>
                  ))}
                </>
              )}
              <hr />
              <ListItem component="div" onClick={handleLinkClick}>
                <ListItemIcon>
                  <ManageSearchIcon
                    sx={{ color: "var(--listItem-icon-color)" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    i18?.HEADER?.SWITCHTOTRAVELLING || "Switch to travelling"
                  }
                  sx={{ color: "var(--footer-text-color)", fontWeight: "bold" }}
                />
              </ListItem>
              <hr />
              <ListItem component="div" onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "var(--listItem-icon-color)" }} />
                </ListItemIcon>
                <ListItemText
                  primary={i18?.HEADER?.LOGOUT || "Logout"}
                  sx={{ color: "var(--footer-text-color)", fontWeight: "bold" }}
                />
              </ListItem>
            </List>
          )}
          {!props.type && isAuth && (
            <List>
              {UserMenu.map((items: any, index) => (
                <div key={items?.text}>
                  <Link href={items?.path} passHref>
                    <ListItem component="a">
                      {UserIcon[index] && (
                        <ListItemIcon>
                          {React.createElement(UserIcon[index], {
                            sx: { color: "var(--listItem-icon-color)" },
                          })}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={items?.text}
                        sx={{ color: "var(--footer-text-color)" }}
                      />
                    </ListItem>
                  </Link>
                </div>
              ))}
              <Link href="/guest/inbox">
                <ListItem component="div">
                  <ListItemIcon sx={{ position: "relative" }}>
                    <Badge
                      badgeContent=""
                      variant="dot"
                      invisible={getId && notificationlist !== 0 ? false : true}
                      sx={{
                        "& .MuiBadge-badge": {
                          position: "absolute",
                          backgroundColor: "var(--btn-bg-color)!important",
                          color: "var(--btn-text-color)",
                        },
                      }}
                    >
                      <ChatBubbleOutlineIcon
                        sx={{ color: "var(--listItem-icon-color)" }}
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={i18?.PROFILE?.MESSAGE || "Message"}
                    sx={{
                      color: "var(--footer-text-color)",
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
              </Link>
              <Link href="/account-settings/notification">
                <ListItem component="div">
                  <ListItemIcon sx={{ position: "relative" }}>
                    <Badge
                      badgeContent=""
                      variant="dot"
                      invisible={getId && notificationlist !== 0 ? false : true}
                      sx={{
                        "& .MuiBadge-badge": {
                          position: "absolute",
                          backgroundColor: "var(--btn-bg-color)!important",
                          color: "var(--btn-text-color)",
                        },
                      }}
                    >
                      <NotificationsActiveIcon
                        sx={{ color: "var(--listItem-icon-color)" }}
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      i18?.NOTIFICATION?.NOTIFICATIONS || "Notifications"
                    }
                    sx={{
                      color: "var(--footer-text-color)",
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
              </Link>

              <hr />
              <ListItem component="div" onClick={handleHostClick}>
                <ListItemIcon>
                  <ManageSearchIcon
                    sx={{ color: "var(--listItem-icon-color)" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    i18?.HOMEPAGE?.SWITCHTOHOSTING || "Switch to hosting"
                  }
                  sx={{ color: "var(--footer-text-color)", fontWeight: "bold" }}
                />
              </ListItem>
              <hr />
              <ListItem component="div" onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "var(--listItem-icon-color)" }} />
                </ListItemIcon>
                <ListItemText
                  primary={i18?.HEADER?.LOGOUT || "Logout"}
                  sx={{ color: "var(--footer-text-color)", fontWeight: "bold" }}
                />
              </ListItem>
            </List>
          )}
          <hr />
          <div className="d-flex  justify-content-center">
            <div
              style={{
                paddingLeft: "15px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onClick={handleLangModel}
            >
              <GoGlobe className="pe-auto" style={{ cursor: "pointer" }} />
              <p className="mb-0">{i18?.PROFILE?.LANGUAGE || "Language"}</p>
              {/* {isShown ? <LanguageModal/> : ''} */}
              {/* <LanguageModal isShown={isShown} hide={toggle}/> */}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
