import React from "react";

interface Props {
  value: any;
  onChange: Function;
  placeholder: string;
  className: any;
  onkeyDown?: Function;
}
const Textarea = (props: any) => {
  const { value, onChange, onkeyDown, placeholder, className, ...restProps } =
    props;
  return (
    <textarea
      className={className}
      onkeyDown={onkeyDown}
      name="w3review"
      rows="4"
      cols="20"
      maxLength={50}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...restProps}
    />
  );
};

export default Textarea;
