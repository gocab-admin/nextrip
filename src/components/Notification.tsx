import React, { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CancelIcon from "@mui/icons-material/Cancel";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { Popover, TablePagination } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import APICONSTANT from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";
import { dispatch } from "@/redux/store";
import { addAlert } from "@/redux/slice/AlertSlice";
import { getApiMethod, putApiMethod } from "@/services/global";

import "./header.scss";
import styles from "./componentNotification.module.scss";
import ImageComponent from "./ImageComponent";
import Image from "next/image";

const Notification = () => {
  const { i18 } = usePageContext();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const isAuth =
    typeof window !== "undefined" && localStorage?.getItem("appToken")
      ? true
      : false;
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the click event from reaching the parent div and closing the menu
    event.stopPropagation();
  };

  const [notificationlist, setnotificationlist] = useState<any>({
    data: [],
    count: 0,
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const open = Boolean(anchorEl);
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleFetch = async () => {
    try {
      const reponse = await getApiMethod(
        `${APICONSTANT.notifications}?_page=${page}&_limit=${rowsPerPage}`
      );
      if (reponse.statusCode === 200) {
        setnotificationlist({
          count: reponse.data.totalCount ? reponse.data.totalCount : 0,
          data: reponse.data.notifications,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteOne = async (id: any) => {
    try {
      const response = await putApiMethod(
        `${APICONSTANT.notifications}/clear/${id}`
      );
      if (response.statusCode === 200) {
        handleFetch();
        dispatch(
          addAlert({
            isOpen: true,
            message: "Notification deleted",
            type: "success",
            severity: "success",
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleClearAll = async () => {
    try {
      const response = await putApiMethod("notifications/clearAll");
      if (response.statusCode === 200) {
        handleFetch();
        dispatch(
          addAlert({
            isOpen: true,
            message: "Notifications deleted",
            type: "success",
            severity: "success",
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  // useEffect(()=>{
  //     const Chatnotification = async () => {
  //         const url: any = "chat/burgerCount";
  //     const res = await getApiMethod(url);
  //       setnotificationlist(res?.data);
  //     }
  //     Chatnotification()
  //   },[])
  useEffect(() => {
    {
      isAuth && handleFetch();
    }
  }, [page, rowsPerPage]);
  return (
    <div className={`${styles.notify} mx-3`} onClick={handleClick}>
      <Badge
        badgeContent={notificationlist.count}
        sx={{
          "& .MuiBadge-badge": {
            position: "absolute",
            backgroundColor: "var(--search-button-color)!important",
            color: "#fff",
          },
        }}
      >
        <NotificationsNoneIcon enableBackground="false" />
        {/* <Image src={'/svg/bell-purplerooms.svg'} alt="img" width={25} height={25}/> */}
      </Badge>
      <Popover
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleMenuClick}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "scroll",
            // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            boxShadow: "0px 2px 8px rgba(0,0,0,0.32)",
            marginTop: "10px",
            "& .MuiList-root": {
              minHeight: "320px",
              overflowY: "auto",
            },
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::-webkit-scrollbar-thumb": {
              display: "none",
            },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 1,
            },
            maxHeight: "500px",
            borderRadius: "15px",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className={`${styles.Menuitem} notification-header`}>
          <div
            className={`${styles.Header} d-flex justify-content-between align-items-center border-bottom`}
          >
            <h5 style={{ color: "var(--text-color)" }} className="m-0">
              {i18?.NOTIFICATION?.NOTIFICATIONS || "Notifications"}
            </h5>
            {notificationlist.count !== 0 && (
              <div className={`${styles.clear} clearall`}>
                <button
                  style={{ color: "var(--text-color)" }}
                  onClick={handleClearAll}
                >
                  {i18?.NOTIFICATION?.CLEARALL || "Clear all"}
                </button>
              </div>
            )}
          </div>
          {notificationlist.count !== 0 ? (
            <>
              {notificationlist.data.map((data: any) => (
                // <>
                <div className={`${styles.notificationBody} `} key={data._id}>
                  <ListItem>
                    <ListItemIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeleteOne(data._id)}
                    >
                      <CancelIcon />
                    </ListItemIcon>
                    <ListItemText
                      style={{
                        fontSize: "var(--trips-notes-size) !important",
                        color: "var(--text-color)",
                      }}
                      primary={data.message}
                    />
                  </ListItem>
                  <Divider />
                </div>
                // </>
              ))}
            </>
          ) : (
            <div className={`${styles.noContent} mt-5`}>
              <NotificationsActiveIcon
                sx={{ color: "var(--text-color)", margin: "auto" }}
              />
              <p style={{ color: "var(--text-color)" }}>
                {i18?.NOTIFICATION?.NOTIFICATIONISEMPTY ||
                  "Notification is empty"}
              </p>
            </div>
          )}
        </div>
        <div className={`${styles.stickyFooter}`}>
          {notificationlist.count > 0 && (
            <div>
              <div className={`${styles.pagination}`}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={notificationlist.count || 0}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
};

export default Notification;
