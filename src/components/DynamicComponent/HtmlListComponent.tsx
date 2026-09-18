import React from "react";
import { Comment } from "react-loader-spinner";

const HtmlListComponent = ({
  activeColor = "",
  color = "#000",
  backgroundColor = "transparent",
  className,
  type,
  width = "",
  text = "",
  startIcon = "",
  endIcon = "",
  isSubmitting = false,
  variant = "",
  onClick,
  children,
  styles,
}: any) => {
  return (
    <li
      className={className}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        padding: "5px",
        cursor: "pointer",
        backgroundColor: backgroundColor || "#fff",
        color: color,
        // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Card shadow
        borderRadius: "4px", // Rounded corners
        // transition: "transform 0.2s ease, box-shadow 0.2s ease", // Smooth hover effect
        ...styles,
      }}
      // onMouseEnter={(e) =>
      //   (e.currentTarget.style.transform = "scale(1.02)") // Slight zoom on hover
      // }
      // onMouseLeave={(e) =>
      //   (e.currentTarget.style.transform = "scale(1)") // Reset zoom on hover out
      // }
    >
      {isSubmitting ? (
        <Comment
          visible={true}
          width={width || 100}
          ariaLabel="comment-loading"
          wrapperStyle={{}}
          wrapperClass="comment-wrapper"
          color="#ffff"
          backgroundColor="transparent"
        />
      ) : (
        <>{children || text}</>
      )}
    </li>
  );
};

export default HtmlListComponent

