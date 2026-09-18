import React from "react";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

import { yellowTheme, violetTheme } from "@/components/colorVariable";

const DynamicButtonComponent = ({
  style,
  className,
  type,
  color = violetTheme.secondaryColor,
  position = "fixed",
  bottom = "80px",
  border = "0px",
  borderRadius = "10px",
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
                borderRadius: borderRadius,
                fontWeight: fontWeight,
                padding: padding,
                width: width,
                transition: "background-color 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: hover || "#000",
                  color: textColor || "#4B4B4B",
                },
                "&:disabled": {
                  color: "var(--btn-text-color)",
                },
              },
              contained: {
                borderRadius: "",
                backgroundColor: yellowTheme.primaryColor,
                color: yellowTheme.secondaryColor,
                padding: padding,
                border: border,
                fontSize: fontSize,
                outline: "none",
                transition: "background-color 0.3s ease-in-out", // Transition for contained buttons
                "&:hover": {
                  backgroundColor: yellowTheme.primaryColor,
                  color: yellowTheme.secondaryColor,
                  boxShadow: "",
                },
              },
              outlined: {
                color: violetTheme.secondaryColor,
                backgroundColor: violetTheme.primaryColor,
                borderRadius: borderRadius,
                padding: padding,
                border: "0px",
                fontSize: fontSize,
                outline: "none",
                transition: "background-color 0.3s ease-in-out", // Transition for outlined buttons
                "&:hover": {
                  backgroundColor: violetTheme.primaryColor,
                  color: violetTheme.secondaryColor,
                  outline: "none",
                  border: "0px",
                },
              },
            },
          },
        },
      });
      

  return (
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
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#ffff"
          />
        ) : (
          text || children
        )}
      </Button>
    </ThemeProvider>
  );
};

export default DynamicButtonComponent;
