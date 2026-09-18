import React, { useState } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

interface CustomSearchFieldProps extends Omit<TextFieldProps, 'variant' | 'focused' | 'onFocus' | 'onBlur'> {
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  onBlur?: () => void;
  className?: string;
  sx?: any;
}
const CustomSearchField: React.FC<CustomSearchFieldProps> = (props) => {
  const [focused, setFocused] = useState<any>(false)

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    if (props.onFocus) {
      props.onFocus(event) // Pass the event argument here
    }
  }

  const handleBlur = () => {
    setFocused(false)
    if (props.onBlur) {
      props.onBlur()
    }
  }

  return (
    <TextField
      {...props}
      variant="outlined"
      focused={focused}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={props.className}
      sx={props.sx}
      InputProps={{
        // ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
        style: {
          ...props.InputProps?.style,
          borderColor: focused ? 'black' : '#e0e0e0'
        }
      }}
    />
  )
}

export default CustomSearchField
