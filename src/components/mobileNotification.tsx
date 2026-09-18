import React, { useEffect, useState } from "react";
import Badge, { BadgeProps } from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { styled } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import CancelIcon from "@mui/icons-material/Cancel";
import { TablePagination } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { getApiMethod, putApiMethod } from "@/services/global";
import { dispatch } from "@/redux/store";
import { addAlert } from "@/redux/slice/AlertSlice";
import APICONSTANT from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./componentNotification.module.scss";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px"
  }
}));
const MobileNotification = () => {
  const { i18 } = usePageContext();
  const isAuth =
    typeof window !== "undefined" && localStorage?.getItem("appToken")
      ? true
      : false;
  const [open, setOpen] = React.useState(false);
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const [notificationlist, setnotificationlist] = useState<any>({
    data: [],
    count: 0
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleFetch = async () => {
    try {
      const reponse = await getApiMethod(
        `${APICONSTANT.notifications  }?_page=${page}&_limit=${rowsPerPage}`
      );
      if (reponse.statusCode === 200) {
        setnotificationlist({
          count: reponse.data.totalCount ? reponse.data.totalCount : 0,
          data: reponse.data.notifications
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteOne = async (id: any) => {
    try {
      const response = await putApiMethod(
        `${APICONSTANT.notifications  }/clear/${id}`
      );
      if (response.statusCode === 200) {
        handleFetch();
        dispatch(
          addAlert({
            isOpen: true,
            message: "Notification deleted",
            type: "success",
            severity: "success"
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
            severity: "success"
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (isAuth) {
      handleFetch();
    }
  }, [page, rowsPerPage, isAuth]);
  return (
    <>
      <div onClick={toggleDrawer(true)} className={`${styles.notifyIcon}`}>
        <div className={`${styles.icon}`}>
          <StyledBadge color="error" badgeContent={notificationlist.count}>
            <NotificationsNoneIcon sx={{ fontSize: "25px" }} />
          </StyledBadge>
        </div>
        <p className={`${styles.p}`}>
          {i18?.NOTIFICATION?.NOTIFICATIONS || "Notifications"}
        </p>
      </div>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          sx: {
            maxHeight: "70%",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            "&::-webkit-scrollbar": {
              display: "none"
            }
          }
        }}
      >
        <div>
          <div className={`${styles.Menuitem}`}>
            <div className={`${styles.Header} border-bottom`}>
              <h5>{i18?.NOTIFICATION?.NOTIFICATIONS || "Notifications"}</h5>
            </div>
            {notificationlist.count !== 0 ? (
              <>
                <div className={`${styles.clear}`}>
                  <button onClick={handleClearAll} className="text-black">
                    {i18?.NOTIFICATION?.CLEARALL || "Clear all"}
                  </button>
                </div>
                {notificationlist.data.map((data: any) => (
                  <>
                    <div className={`${styles.notificationBody} `}>
                      <ListItem button>
                        <ListItemIcon onClick={() => handleDeleteOne(data._id)}>
                          <CancelIcon />
                        </ListItemIcon>
                        <ListItemText primary={data.message} />
                      </ListItem>
                      <Divider />
                    </div>
                  </>
                ))}
              </>
            ) : (
              <div className={`${styles.noContent} mt-5`}>
                <NotificationsActiveIcon
                  sx={{ color: "#717171", margin: "auto" }}
                />
                <p className="">
                  {i18?.NOTIFICATION?.NOTIFICATIONISEMPTY ||
                    "Notification is empty"}
                </p>
              </div>
            )}
          </div>
          <div className={`${styles.stickyFooter}`}>
            <div className={`${styles.pagination}`}>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={notificationlist.count || 0}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
};
export default MobileNotification;
