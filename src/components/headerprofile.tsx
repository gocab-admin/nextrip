"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu, { MenuProps } from "@mui/material/Menu";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import { GoGlobe } from "react-icons/go";

import { getApiMethod } from "@/services/global";
import APICONSTANT, { APIURLS } from "@/services/config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addUser,
  updateStatus,
  userSelector,
} from "@/redux/slice/user/userSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import { setModal } from "@/redux/slice/modalSlice";
import { getChatCount } from "@/redux/slice/chatNotification";
import { usePageContext } from "@/components/Providers/PageContext";
import { handleImageError } from "@/services/utils/utils";

import ImageComponent from "./ImageComponent";
import Notification from "./Notification";
import "./header.scss";
import styles from "./componentheaderstyles.module.scss";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
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
      padding: "10px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

const schema = yup.object().shape({
  // country: yup.string().required("country is required"),
  // phonenumber: yup.string().required("phonenumber is required"),
  email: yup.string(),
  country: yup.string(),
  phonenumber: yup.string(),
  password: yup.string(),
});

export default function HeaderProfile(props?: any) {
  const { i18, responsiveView } = usePageContext();
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
  const [loginopen, setloginOpen] = useState(false);
  const [signupopen, setsignupOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  // const [notificationlist, setnotificationlist] = useState<any>(0)
  const notificationlist = useSelector(
    (state: any) => state.ChatNotificationCount.chatCount
  );
  const searchParams = useSearchParams();

  // const handlevisible = () => {
  //     setVisible(true);
  // };
  // const handlePhonevisible = () => {
  //     setVisible(false);
  // };

  const handlesignupOpen = () => {
    handleDropDownClose();
    if (pathname === "/login/") {
      router.push("/login");
    } else {
      dispatch(setModal("SignupModal" as any));
    }
  };
  console.log("props", props);
  const modalContentRef = useRef<any>(null);

  const open = Boolean(anchorEl);

  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  // const [notify, setNotify] = useState({
  //     isOpen: false,
  //     message: "",
  //     type: "",
  //     severity: "",
  // });

  const getUserapi = async (url: any) => {
    // SetIsLoding(true)
    const resp: any = await getApiMethod(url);
    if (resp?.statusCode === 200) {
      setUserData(resp.data.userDetail);
      dispatch(addUser(resp.data.userDetail));
      dispatch(updateStatus({ loginStatus: true, listCount: resp.totalCount }));
    } else {
      localStorage.clear();
    }
  };

  // const postapi = async (url: any, data: any) => {
  //     const res: any = await postApiMethod(url, data);
  //     setToken(res.token, res.data?._id);
  //     if (res.statusCode === 200) {
  //         dispatch(addAlert({
  //             isOpen: true,
  //             message: "Signup Successfully",
  //             type: "success",
  //             severity: "success",
  //         }));
  //         setsignupOpen(false);
  //         setloginOpen(true);
  //         setVisible(false);
  //     } else {
  //         // setsignupOpen(false);
  //         dispatch(addAlert({
  //             isOpen: true,
  //             message: res.response.data.message,
  //             type: "error",
  //             severity: "error",
  //         }));
  //     }
  // };

  // const transformFormData = (formData: any) => {
  //     const { country, phonenumber, email, password } = formData;

  //     if (visible) {
  //         return {
  //             email: email,
  //             password: password,
  //         };
  //     } else {
  //         return {
  //             phoneCode: country,
  //             phone: phonenumber,
  //             password: password,
  //         };
  //     }
  // };

  // const onSubmit = (data: any) => {
  //     const transformedData = transformFormData(data);
  //     postapi(APICONSTANT.signup, transformedData);
  // };

  // const countryData = [
  //     { label: "Afghanistan (+93)", value: "+93" },
  //     { label: "Åland Islands (+358)", value: "+358" },
  //     { label: "Albania (+355)", value: "+355" },
  //     { label: "India (+91)", value: "+91" },
  // ];

  const handleDropDown = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropDownClose = () => {
    setAnchorEl(null);
  };

  const handleHost = () => {
    setAnchorEl(null);
    if ("Manage listings") {
      router.push("/hosting");
    } else {
      router.push("/host");
    }
  };

  const handleTrips = () => {
    setAnchorEl(null);
    if (!props.host) {
      router.push("/user/trips/?trip=pendingBooking");
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
      router.push("/guest/inbox");
    }
  };

  const handleTravel = () => {
    router.push("/");
    localStorage.setItem("usersType", "user");
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.clear();
    dispatch(updateStatus({ loginStatus: false, listCount: 0 }));
    setUserData({});
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
            <div className={`${styles.links} d-flex align-items-center pe-3`}>
              {responsiveView === "sm" || responsiveView === "xs" ? (
                <></>
              ) : (
                <>
                  {/* 
        <button className="" onClick={() => dispatch(setModal('LanguageModal' as any))}>
          <FiGlobe />
        </button>    
        */}
                  <Link
                    href={listCount !== 0 ? "/hosting" : "/propertyform"}
                    className={`${styles.airstar_home} pl-3`}
                    onClick={handleLinkClick}
                  >
                    {listCount === 0
                      ? `${i18?.HEADER?.BECOMEAHOST || "Become a Host"}`
                      : `${
                          i18?.HOMEPAGE?.SWITCHTOHOSTING || "Switch to Hosting"
                        }`}
                  </Link>
                  <div
                    style={{ paddingLeft: "15px" }}
                    onClick={handleLangModel}
                  >
                    <GoGlobe
                      className="pe-auto"
                      style={{ cursor: "pointer" }}
                      // stroke="var(--new-text-color-purplerooms)"
                      // fill="var(--new-text-color-purplerooms)"
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
                      size="25px"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="d-flex position-relative">
            <Button
              className={`${
                props.host ? styles.hostprofile : styles.profile
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
                      width={20}
                      height={20}
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
                      color: "var(--btn-text-color)",
                    },
                  }}
                >
                  {!props.host && <IoIosMenu className={`${styles.menu} `} />}
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
                </Badge>
              )}
            </Button>

            {!isAuth && (
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
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
                <MenuItem onClick={() => router.push("/how-it-works")}>
                  {"How it works"}
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
                  "aria-labelledby": "demo-customized-button",
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
                            color: "var(--btn-text-color)",
                          },
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
                  {props.host ? "Account" : i18?.TRIPS?.TRIPS || "Trips"}
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
                    {i18?.HEADER?.MANAGELISTING || "Manage listings"}
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
                {props.host ? (
                  <MenuItem
                    sx={{ color: "var(--text-color)" }}
                    onClick={handleTravel}
                    className={`${styles.linkmenu}`}
                  >
                    {i18?.HEADER?.SWITCHTOTRAVELLING || "Switch to travelling"}
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
                <MenuItem>
                  <Link
                    href={"/how-it-works"}
                    className={`${styles.linkmenu}`}
                    onClick={handleLinkClick}
                  >
                    {"How it works"}
                  </Link>
                </MenuItem>
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
      <div></div>
    </div>
  );
}
