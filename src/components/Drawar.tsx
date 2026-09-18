import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import SvgIcon from "@mui/material/SvgIcon";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Settings from "@mui/icons-material/Settings";

import { usePageContext } from "@/components/Providers/PageContext";

export default function TemporaryDrawer() {
  const {i18, direction, setDirection} = usePageContext();
  const [open, setOpen] = React.useState(false);

  const localDirection  = (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('Direction')) 

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const toggleDirection = (Data: any) => {
    setOpen(!open);
    localStorage.setItem("Direction", Data);
    setDirection(direction === "ltr" ? "rtl" : "ltr");
  };

  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation">
      <div
        style={{
          display: "flex",
          margin: "10px",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="h6">{i18?.WISHLIST?.SETTINGS || "Settings"}</Typography>

        <CloseIcon
          sx={{ fontSize: "1.5rem", color: "red" }}
          onClick={toggleDrawer(false)}
        ></CloseIcon>
      </div>

      <div style={{ padding: "10px" }}>
        <Typography variant="h6">{i18?.WISHLIST?.THEMEADIRECTION || "Theme Direction"}</Typography>
      </div>

      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item xs={4}>
          <Button
            sx={{
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              backgroundColor: "white",
              display: "flex"
            }}
            onClick={() => toggleDirection("ltr")}
          >
            <SvgIcon
              component="svg"
              viewBox="0 0 24 24"
              sx={{
                fill: "context-fill",
                stroke: `${direction == "ltr" ? "blue" : "black"}`,
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }}
            >
              <path d="M10.1 13c.46 2.28 2.48 4 4.9 4 2.76 0 5-2.24 5-5s-2.24-5-5-5c-2.42 0-4.44 1.72-4.9 4H5.83l1.59-1.59L6 8l-4 4 4 4 1.41-1.41L5.83 13h4.27zm4.9 2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
            </SvgIcon>

            <Typography
              sx={{ textAlign: "center", marginleft: "10px", color: "black" }}
            >
              LTR
            </Typography>
          </Button>
        </Grid>

        <Grid item xs={4}>
          <Button
            sx={{
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              display: "flex"
            }}
            onClick={() => toggleDirection("rtl")}
          >
            <SvgIcon
              component="svg"
              viewBox="0 0 24 24"
              sx={{
                fill: "context-fill",
                stroke: `${direction == "rtl" ? "blue" : "black"}`,
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }}
            >
              <path d="M10.1 13c.46 2.28 2.48 4 4.9 4 2.76 0 5-2.24 5-5s-2.24-5-5-5c-2.42 0-4.44 1.72-4.9 4H5.83l1.59-1.59L6 8l-4 4 4 4 1.41-1.41L5.83 13h4.27zm4.9 2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
            </SvgIcon>

            <Typography
              sx={{
                textAlign: "center",
                marginleft: "10px",
                color: "black"
              }}
            >
              RTL
            </Typography>
          </Button>
        </Grid>
      </Grid>

      <Divider />
    </Box>
  );

  return (
    <div style={{ display: 'flex', position: 'sticky', bottom: '50px', paddingLeft: '30px', paddingRight: '30px' }}>
      <Button
        variant="contained"
        onClick={toggleDrawer(true)}
        style={{ borderRadius: "50%", padding: '16px' }}
      >
        <Settings fontSize="medium" />
      </Button>

      <Drawer open={open} onClose={toggleDrawer(false)} anchor={localDirection == 'rtl' ? 'right' : 'left'}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
