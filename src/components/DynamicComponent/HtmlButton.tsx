import React from "react";
import { Comment } from "react-loader-spinner";

const HTMLButton = ({
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
  styles
}: any) => (
    <button
      className={className}
      type={type}
      onClick={onClick}
      style={{
        ...styles
      }}
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
        children || text
      )}
    </button>
  );
export default HTMLButton;
