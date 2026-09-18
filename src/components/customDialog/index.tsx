import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";

import styles from "../../app/rooms/page.module.scss";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomDialog = (props: any) => {
  const { fullWidth, maxWidth, open, handleClose, children } = props;

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <IconButton
        className={`${styles.cancelbtn}`}
        edge="start"
        color="inherit"
        onClick={handleClose}
        aria-label="close"
        sx={{
          justifyContent: "end"
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="pt-0">{children}</DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
