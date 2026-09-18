"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu, { MenuProps } from "@mui/material/Menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import { GoGlobe } from "react-icons/go";

import { getApiMethod } from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addUser, updateStatus, userSelector } from "@/redux/slice/user/userSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import { setModal } from "@/redux/slice/modalSlice";
import { getChatCount } from "@/redux/slice/chatNotification";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import ImageComponent from "@/components/ImageComponent";
import Notification from "@/components/Notification";
import "@/components/header.scss";
import styles from "@/components/componentheaderstyles.module.scss";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 10,
    marginTop: theme.spacing(1),
    minWidth: 210,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "10px 0"
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      }
    }
  }
}));

export default function HeaderProfile(props?: any) {
  const { i18, responsiveView, baseUrl } = usePageContext();
  const pathname = usePathname();
  const { userInfo, status } = useAppSelector(userSelector);
  const dispatch = useAppDispatch();
  const { loginStatus, listCount } = status;
  const isAuth = loginStatus;
  const getId =
    typeof window !== "undefined" && localStorage?.getItem("appUserId")
      ? true
      : false;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState<any>();
  const notificationlist = useSelector(
    (state: any) => state.ChatNotificationCount.chatCount
  );
  const searchParams = useSearchParams();
  const handlesignupOpen = () => {
    handleDropDownClose();
    if (pathname === "/login/") {
      router.push("/login");
    } else {
      dispatch(setModal("SignupModal" as any));
    }
  };

  const modalContentRef = useRef<any>(null);

  const open = Boolean(anchorEl);

  const router = useRouter();

  const getUserapi = async (url: any) => {
    // SetIsLoding(true)
    const resp: any = await getApiMethod(url);
    if (resp?.statusCode === 200) {
      setUserData(resp.data.userDetail);
      dispatch(addUser(resp.data.userDetail));
      dispatch(updateStatus({ loginStatus: true, listCount: resp.totalCount }))
    } else {
      localStorage.clear();
    }
  };

  const handleDropDown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropDownClose = () => {
    setAnchorEl(null);
  };

  const handleHost = () => {
    setAnchorEl(null);
    if ("Manage Ads") {
      router.push("/ads/selling/list");
    } else {
      router.push("/host");
    }
  };

  const handleTrips = () => {
    setAnchorEl(null);
    if (!props.host) {
      router.push("/ads/selling/list/");
    } else {
      router.push("/account-settings");
    }
  };

  const handleWishlist = () => {
    setAnchorEl(null);
    router.push("/wishlistcollection");
  };

  const handleMessage = () => {
    setAnchorEl(null);
    if (props.host) {
      router.push("/profiles/user");
    } else {
      router.push("/ads/guest/inbox");
    }
  };

  const handleTravel = () => {
    router.push("/ads");
    localStorage.setItem("usersType", "user");
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.clear();
    dispatch(updateStatus({ loginStatus: false, listCount: 0 }))
    setUserData({});
    router.push("/");
    dispatch(
      addAlert({
        isOpen: true,
        message: "Logout Successfully",
        type: "success",
        severity: "success"
      })
    );
  };

  const handleAccount = () => {
    setAnchorEl(null);
    router.push("/account-settings");
  };

  useEffect(() => {
    if (getId) {
      getUserapi(APICONSTANT.signup);
    }
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
  }, [getId, responsiveView]);

  // const handleMenuClick = (event: any) => {
  //     setAnchorEl(event.currentTarget);
  // };

  useEffect(() => {
    if (getId) {
      // const Chatnotification = async () => {
      //     const url: any = APICONSTANT.burgerCount;
      //     const res = await getApiMethod(url);
      //     setnotificationlist(res?.data);
      // }
      // Chatnotification()
      dispatch(getChatCount());
    }
  }, [getId]);

  useEffect(() => {
    if (
      isAuth &&
      userInfo &&
      !userInfo?.verified &&
      typeof window !== "undefined"
    ) {
      // redirect('/verify?redirecturl='+window.location.pathname, RedirectType.replace)
      const redirectUrl: any = searchParams?.get("redirecturl");
      if (redirectUrl !== null) {
        router.push(
          `/verify?redirecturl=${window.encodeURIComponent(redirectUrl)}`
        );
      } else {
        router.push("/verify");
      }
    }
  }, [isAuth, userInfo]);

  const handleLangModel = () => {
    dispatch(setModal("LanguageModal" as any));
  };

  const handleLinkClick = (e: any) => {
    localStorage.setItem("usersType", "host");
    if (!loginStatus) {
      e.preventDefault();
      dispatch(setModal("SignupModal" as any));
    }
  };

  return (
    <div className={`${styles.home}`}>
      <div className={`${styles.stickyheader}`}>
        <div className={`${styles.navs} d-flex align-items-center`}>
          {!props.host ? (
            <div className={`${styles.links} d-flex align-items-center ps-3`}>
              {responsiveView === "sm" || responsiveView === "xs" ? (
                <></>
              ) : (
                <>
                  {/* 
        <button className="" onClick={() => dispatch(setModal('LanguageModal' as any))}>
          <FiGlobe />
        </button>    
        */}
                  {/* <Link
                    href={listCount !== 0 ? "/ads/selling" : "/ads/form/"}
                    className={`${styles.airstar_home} pl-3`}
                    onClick={handleLinkClick}
                  >
                    {listCount === 0 &&  <Website/>}
                    {listCount === 0
                      ? `${i18?.HEADER?.BECOMEAHOST || "Sell"}`
                      : `${
                          i18?.HOMEPAGE?.SWITCHTOHOSTING || "Switch to Seller"
                        }`}
                  </Link> */}
                  <div
                    style={{ paddingLeft: "15px" }}
                    onClick={handleLangModel}
                  >
                    <GoGlobe
                      className="pe-auto"
                      style={{ cursor: "pointer" }}
                    />

                    {/* {isShown ? <LanguageModal/> : ''} */}
                    {/* <LanguageModal isShown={isShown} hide={toggle}/> */}
                  </div>

                  {isAuth && (
                    <>
                      {/*
            <Link href="/guest/inbox" className={`${styles.notificationi}`}>
              <IoNotificationsCircleOutline className={`${styles.notifyicon}`} />
              <p className={`${styles.notificationc}`}>{notificationlist.length}</p>
            </Link>
            */}

                      <Notification />
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className={`${styles.links} d-flex align-items-center pe-3`}>
              {responsiveView === "sm" || responsiveView === "xs" ? (
                <></>
              ) : (
                <>
                  <div
                    style={{ paddingLeft: "15px" }}
                    onClick={handleLangModel}
                  >
                    <GoGlobe
                      className="pe-auto"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="d-flex position-relative">
            <Button
              className={`${props.host ? styles.hostprofile : styles.profile
                } d-flex align-items-center relative`}
              id="demo-customized-button"
              aria-controls={open ? "demo-customized-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="contained"
              disableElevation
              onClick={handleDropDown}
            >
              {pathname === "/guest/inbox/" || pathname === "/hosting/" ? (
                <>
                  {!props.host && <IoIosMenu className={`${styles.menu2} `} />}
                  {userData?.profileImage ? (
                    <ImageComponent
                      src={userData.profileImage}
                      className={
                        props.host ? styles.hostradius : styles.imgradius
                      }
                      width={30}
                      height={30}
                      alt=""
                      onError={handleImageError}
                    />
                  ) : (
                    <FaUserCircle
                      className={props.host ? styles.hostuser : styles.user}
                    />
                  )}
                </>
              ) : (
                <Badge
                  badgeContent={notificationlist}
                  invisible={getId ? false : true}
                  sx={{
                    "& .MuiBadge-badge": {
                      position: "absolute",
                      backgroundColor: "var(--btn-bg-color)!important",
                      color: "var(--btn-text-color)"
                    }
                  }}
                >
                  {!props.host && <IoIosMenu className={`${styles.menu} `} />}
                  {userData?.profileImage ? (
                    <ImageComponent
                      src={userInfo.profileImage}
                      className={
                        props.host ? styles.hostradius : styles.imgradius
                      }
                      width={30}
                      height={30}
                      alt=""
                      onError={handleImageError}
                    />
                  ) : (
                    <FaUserCircle
                      className={props.host ? styles.hostuser : styles.user}
                    />
                  )}
                </Badge>
              )}
            </Button>

            {!isAuth && (
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button"
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleDropDownClose}
              >
                <MenuItem onClick={handlesignupOpen}>
                  {i18?.HEADER?.LOGIN || "logIn"}
                </MenuItem>
                <MenuItem onClick={handlesignupOpen}>
                  {i18?.HEADER?.SIGNUP || "signUp"}
                </MenuItem>
                {/* <div>
                                    <div className={`${styles.divider}`}></div>
                                </div>
                                <MenuItem onClick={handleHost} className={`${styles.linkmenu}`}>
                                    <Website/> your home
                                </MenuItem>
                                <MenuItem onClick={handleDropDownClose} className={`${styles.linkmenu}`}>
                                    Help center
                                </MenuItem> */}
              </StyledMenu>
            )}
            {isAuth && (
              <StyledMenu
                sx={{ fontSize: "20px" }}
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button"
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleDropDownClose}
              >
                {props.host && (
                  <MenuItem
                    sx={{ color: "var(--text-color)" }}
                    onClick={handleMessage}
                  >
                    {i18?.HEADER?.PROFILE || "Profile"}
                  </MenuItem>
                )}
                {!props.host &&
                  getId &&
                  (notificationlist === 0 || pathname === "/guest/inbox/" ? (
                    <MenuItem
                      sx={{ color: "var(--text-color)" }}
                      onClick={handleMessage}
                    >
                      {i18?.HEADER?.MESSAGES || "Messages"}
                    </MenuItem>
                  ) : (
                    <MenuItem
                      sx={{ color: "var(--text-color)" }}
                      onClick={handleMessage}
                    >
                      <Badge
                        badgeContent=" "
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            position: "absolute",
                            backgroundColor: "var(--btn-bg-color)!important",
                            color: "var(--btn-text-color)"
                          }
                        }}
                      >
                        {i18?.HEADER?.MESSAGES || "Messages"}
                      </Badge>
                    </MenuItem>
                  ))}

                <MenuItem
                  sx={{ color: "var(--text-color)" }}
                  onClick={handleTrips}
                  className={`${styles.linkmenu}`}
                >
                  {props.host ? "Account" : i18?.LISTING?.ADS || "Ads"}
                </MenuItem>
                {!props.host && (
                  <MenuItem
                    sx={{ color: "var(--text-color)" }}
                    onClick={handleWishlist}
                    className={`${styles.linkmenu}`}
                  >
                    {i18?.HEADER?.WISHLISTS || "Wishlists"}
                  </MenuItem>
                )}
                {/* {props.host &&
                                    <MenuItem className={`${styles.linkmenu}`}>
                                        Get help with a safety issue
                                    </MenuItem>
                                } */}
                <div>
                  <div className={`${styles.divider}`}></div>
                </div>
                {/* {!props.host && (
                                    <MenuItem sx={{color: 'var(--text-color)'}}
                                        onClick={handleHost}
                                        className={`${styles.linkmenu}`}
                                    >
                                        {i18?.HEADER?.MANAGELISTING || "Manage listings"}
                                    </MenuItem>
                                )} */}
                {/* {props.host &&
                                    <MenuItem className={`${styles.linkmenu}`}>
                                        Language and translation
                                    </MenuItem>
                                } */}
                {props.host && (
                  <MenuItem
                    sx={{ color: "var(--text-color)" }}
                    onClick={handleHost}
                    className={`${styles.linkmenu}`}
                  >
                    {i18?.HEADER?.MANAGELISTINGs || "Manage Ads"}
                  </MenuItem>
                )}
                {!props.host && (
                  <MenuItem
                    sx={{ color: "var(--text-color)" }}
                    onClick={handleAccount}
                    className={`${styles.linkmenu}`}
                  >
                    {i18?.HEADER?.ACCOUNT || "Account"}
                  </MenuItem>
                )}
                <div>
                  <div className={`${styles.divider}`}></div>
                </div>
                {!props.host && (
                  <MenuItem>
                    <Link
                      href={listCount !== 0 ? "/ads/selling" : "/ads/form/"}
                      className={`${styles.airstar_home} pl-3`}
                      onClick={handleLinkClick}
                      style={{ color: "#000"}}
                    >
                      {/* {listCount === 0 &&  <Website/>} */}
                      {listCount === 0
                        ? `${i18?.HEADER?.BECOMEAHOST || "Sell"}`
                        : `${i18?.HOMEPAGE?.SWITCHTOHOSTING || "Switch to Seller"
                        }`}
                    </Link>
                  </MenuItem>
                )}
                {props.host ? (
                  <MenuItem
                    sx={{ color: "var(--text-color)" }}
                    onClick={handleTravel}
                    className={`${styles.linkmenu}`}
                  >
                    {i18?.HEADER?.SWITCHTOTRAVELLINGs || "Switch to buyer"}
                  </MenuItem>
                ) : responsiveView === "sm" || responsiveView === "xs" ? (
                  <MenuItem>
                    <Link
                      href={listCount !== 0 ? "/hosting" : "/host"}
                      className={`${styles.linkmenu}`}
                      onClick={handleLinkClick}
                    >
                      {listCount === 0
                        ? ""
                        : i18?.HOMEPAGE?.SWITCHTOHOSTING || "Switch to Hosting"}
                    </Link>
                  </MenuItem>
                ) : (
                  <div></div>
                )}

                <MenuItem
                  sx={{ color: "var(--text-color)" }}
                  onClick={handleLogout}
                  className={`${styles.linkmenu}`}
                >
                  {i18?.HEADER?.LOGOUT || "Logout"}
                </MenuItem>
              </StyledMenu>
            )}
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}
