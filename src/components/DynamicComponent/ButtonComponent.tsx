import React from "react";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

import { yellowTheme, violetTheme } from "@/components/colorVariable";

const DynamicButtonComponent = ({
  className,
  type,
  color = violetTheme.secondaryColor,
  position = "fixed",
  bottom = "80px",
  border = "0px",
  borderRadius = "",
  textAlign = "center",
  padding = "",
  fontWeight = "800",
  width = "",
  textColor = "",
  fontSize = "16px",
  hover = "",
  text = "",
  backgroundColor = violetTheme.primaryColor,
  startIcon = "",
  endIcon = "",
  isSubmitting = false,
  variant = "",
  onClick,
  children,
  disabled
}: any) => {
  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: backgroundColor,
            color: color,
            fontSize: "14px",
            textTransform: "capitalize",
            // border: "1px solid #EAEAEA",
            borderRadius: borderRadius,
            fontWeight: fontWeight,
            padding: padding,
            width: width,
            // '&:hover': {
            //   backgroundColor: hover || '#000',
            //   color: textColor || '#4B4B4B'
            // },
            "&:disabled": {
              color: "var(--btn-text-color)"
            }
          },

          contained: {
            borderRadius: "",
            backgroundColor: yellowTheme.primaryColor,
            color: yellowTheme.secondaryColor,
            // backgroundImage: 'linear-gradient(180deg, rgba(255, 0, 0, .16), hsla(0, 100%, 85%, 0)) !important',
            padding: padding,
            border: border,
            fontSize: fontSize,
            text: "",
            outline: "none",
            "&:hover": {
              backgroundColor: yellowTheme.primaryColor,
              color: yellowTheme.secondaryColor,
              boxShadow: ""
            }
          },
          outlined: {
            color: violetTheme.secondaryColor,
            backgroundColor: violetTheme.primaryColor,
            borderRadius: borderRadius,
            // backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.16),hsla(0,0%,100%,0))',
            padding: padding,
            border: "0px",
            fontSize: fontSize,
            outline: "none",
            "&:hover": {
              backgroundColor: violetTheme.primaryColor,
              color: violetTheme.secondaryColor,
              outline: "none",
              border: "0px"
            }
          }
        },
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true
        }
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            backgroundColor: violetTheme.primaryColor
          },
          thumb: {
            color: violetTheme.primaryColor
          }
        }
      }
    }
  });
  

  return (
    <>
      <ThemeProvider theme={theme}>
        <Button
          className={className}
          type={type}
          variant={variant}
          onClick={onClick}
          startIcon={startIcon}
          endIcon={endIcon}
          disabled={disabled}
        >
          {isSubmitting ? (
            <ThreeDots
              visible={true}
              height="30"
              width="35"
              // width={width || 100}
              ariaLabel="comment-loading"
              wrapperStyle={{}}
              wrapperClass="comment-wrapper"
              color="#ffff"
              // backgroundColor="transparent"
            />
          ) : (
            // text || "CONTINUE" || children
            text ? text : children
          )}
        </Button>
      </ThemeProvider>
    </>
  );
};

export default DynamicButtonComponent;
