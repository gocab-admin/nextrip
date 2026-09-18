import React from 'react'
import MaterialButton from '@mui/material/Button'
import { SxProps, Theme } from '@mui/material/styles'

interface Props {
  label: string;
  type?: string;
  value: any;
  onClick: any;
  placeholder: string;
  endIcon: any;

  sx?: SxProps<Theme>;
  variant: any;
  disabled: any;
  href?: any;
}
const MuiButton = (props: any) => {
  const {
    value, onClick, placeholder, endIcon, label, sx, type, variant, disabled, ...restProps
  } = props
  return (
    <MaterialButton
      disabled={disabled}

      variant={variant}
      endIcon={endIcon}
      onClick={onClick}
      type={type}
      href={props?.href}
      sx={sx}
      {...restProps}
    >
      {label}
    </MaterialButton>
  )
}
export default MuiButton
