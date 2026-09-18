import { Badge, Button, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import styles from "@/components/componentheaderstyles.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePageContext } from "@/components/Providers/PageContext";
import { useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import { MenuProps } from "@mui/material/Menu";
import { getApiMethod } from "@/services/global";
import APICONSTANT from "@/services/apiConstant";

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

export default function HeaderMenu() {
  const { i18 } = usePageContext();
  const pathname = usePathname();
  const router = useRouter()
  // console.log('pathname', pathname)
  const getId =
    typeof window !== "undefined" && localStorage?.getItem("appUserId")
      ? true
      : false;
  const notificationlist = useSelector(
    (state: any) => state.ChatNotificationCount.chatCount
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [packageStatus, setPackageStatus] = useState(true)
  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    fetchPackageStatus()
  }, [])

  const fetchPackageStatus = async () => {
    const url = APICONSTANT.packageStatus
    try {
      const response = await getApiMethod(url);
      // if(response?.statusCode === 200){
      //   setPackageStatus(response?.data?.createAd)
      // }
    } catch (error) {
      console.error("Error in package status:", error);
    }
  }

  const handleCreateAds = () => {
    packageStatus ? router.push('/ads/form/') : router.push('/ads/packages')
  }

  return (
    <div
      className={`${styles.message} d-flex justify-content-between`}
    >
      <Button className={`${styles.button} rounded-pill`}>
        <Link
          href="/ads/selling/"
          className={`text-secondary px-2 ${pathname === "/ads/selling/"
            ? "headerTxt fw-bold "
            : "headerTxt"
            }`}
        >
          {i18?.MANAGELISTING?.TODAY || "Today"}
        </Link>
      </Button>
      <Button className={`${styles.button} rounded-pill`}>
        <Badge
          badgeContent=""
          variant="dot"
          invisible={
            getId && notificationlist !== 0 ? false : true
          }
          sx={{
            "& .MuiBadge-badge": {
              position: "absolute",
              backgroundColor: "var(--btn-bg-color)!important",
              color: "var(--btn-text-color)"
            }
          }}
        >
          <Link
            href="/ads/guest/inbox"
            className={`text-secondary px-2 ${pathname === "/ads/guest/inbox/"
              ? "headerTxt fw-bold"
              : "headerTxt"
              }`}
          >
            {i18?.MOBILEFOOTER?.INBOX || "Inbox"}
          </Link>
        </Badge>
      </Button>

      {/* <Button className={`${styles.button} rounded-pill`}>
          <
            href="/hosting/calendar"
            className={`text-secondary px-2 ${
              pathname === "/hosting/calendar/"
                ? "headerTxt fw-bold"
                : "headerTxt"
            }`}
          >
            {i18?.MANAGELISTING?.CALENDAR || "Calendar"}
          </Link>
        </Button>
        <Button className={`${styles.button} rounded-pill`}>
          <Link
            href="/reviews"
            className={`text-secondary px-2 ${
              pathname === "/reviews/"
                ? "headerTxt fw-bold"
                : "headerTxt"
            }`}
          >
            {i18?.MANAGELISTING?.INSIGHTS || "Insights"}
          </Link>
        </Button> */}
      <Button
        className={`${styles.button} headerTxt rounded-pill text-secondary px-2`}
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        endIcon={
          <ArrowForwardIosIcon className={`${styles.iosicon}`} />
        }
      >
        {i18?.MOBILEFOOTER?.MENU || "Menu"}
      </Button>
      <StyledMenu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <MenuItem
          onClick={() => {
            router.push("/ads/selling/list");
          }}
          className="headerTxt"
        >
          {i18?.ADS?.ADS || "Ads"}
        </MenuItem>
        {/* <MenuItem
            onClick={() => {
              router.push("/hosting/reservations");
            }}
            className="headerTxt"
          >
            {i18?.LISTING?.RESERVATIONS || "Reservations"}
          </MenuItem> */}
        <MenuItem
          // onClick={() => {
          //   router.push("/ads/form/");
          // }}
          onClick={handleCreateAds}
          className="headerTxt"
        >
          {i18?.ADS?.CREATEADS || "Create a new Ads"}
        </MenuItem>
        {/* <MenuItem
            onClick={() => {
              router.push("/user/transaction-history");
            }}
            className="headerTxt"
          >
            {i18?.LISTING?.TRANSACTIONHISTORY ||
              "Transaction history"}
          </MenuItem> */}
        {/* <MenuItem >Guidebooks</MenuItem>
            <MenuItem >Explore hosting resources</MenuItem>
            <MenuItem>Connect with Hosts near you</MenuItem> */}
      </StyledMenu>
    </div>
  )
}