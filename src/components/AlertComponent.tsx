'use client';
import React, { useEffect } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { useAppDispatch } from "@/redux/hooks";
import { reset } from "@/redux/slice/AlertSlice";

const AlertComponent = (props: any) => {
  const { notify, setNotify  } = props;
  const dispatch = useAppDispatch()

  const handleClose = () => {
    setNotify({ ...notify, isOpen: false });
    dispatch(reset())
    // window.location.reload();
  };

  useEffect(() => {
    if (notify.isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);

      return () => clearTimeout(timer);
      
    }

  }, [notify.isOpen]);

  return (
    <Snackbar
        open={notify.isOpen}
        autoHideDuration={5000}
        sx={{
          zIndex: 999999
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={notify.severity} variant="filled" sx={{
          zIndex: 99999
        }}>
          {notify.message}
        </Alert>
      </Snackbar>
  );
};

export default AlertComponent;
