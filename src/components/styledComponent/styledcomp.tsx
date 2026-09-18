import {
  InputBase,
  OutlinedInputProps,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
  TextField,
  TextFieldProps
} from "@mui/material";
import { Button } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(244, 246, 248)",
    color: "rgb(99, 115, 129)",
    fontSize: 16
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: "rgb(221, 221, 221)"
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

export const StyledSelect = styled(InputBase)(({ theme }) => ({
  "& label.Mui-focused": {
    color: "#717171"
  },
  "& .MuiInputBase-input": {
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "none",
    borderColor: theme.palette.mode === "light" ? "#717171" : "#717171",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow"
    ]),
    "&:hover": {
      backgroundColor: "transparent"
    },
    "&:focused": {
      backgroundColor: "transparent",
      boxShadow: `none`,
      border: "1px solid",
      borderColor: "black"
    }
  }
}));

export const StyledTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  "& label.Mui-focused": {
    color: "#717171"
  },
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "none",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#717171",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow"
    ]),
    "&:hover": {
      backgroundColor: "transparent"
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      boxShadow: `none`,
      border: "1px solid",
      borderColor: "black"
    }
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "var(--error-color-label) !important"
  }
}));

export const StyledTextFieldBorder = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  "& label.Mui-focused": {
    color: "#717171"
  },
  // "& .MuiFilledInput-input": {
  //   paddingTop: "7px"
  // },
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#717171" : "#E0E3E7",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow"
    ]),
    "&:hover": {
      backgroundColor: "transparent"
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      boxShadow: `none`,
      border: "1px solid",
      borderColor: "black"
    }
  }
}));

export const StyledTextFieldPrice = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  "& label.Mui-focused": {
    color: "#717171"
  },
  "& .MuiFilledInput-input": {
    paddingTop: "7px",
    paddingBottom: "7px"
  },
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#717171" : "#E0E3E7",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    alignItems: "baseline",

    "&:hover": {
      backgroundColor: "transparent"
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      boxShadow: "none",
      border: "1px solid",
      borderColor: "black"
    },
  },
  "& .MuiInputLabel-root": {
    top: "-25px",
    left: "-7px",
  }
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: "0px",
  padding: "10px 16px",  // Adjust horizontal padding if needed
  height: "40px",  // Adjust the height of the button
  borderRadius: "8px",
  border: "1px solid",
  borderColor: theme.palette.mode === "light" ? "#ff3f55" : "#ff3f55",
  backgroundColor: "#ff3f55",
  color: theme.palette.mode === "light" ? "#fff" : "#fff",
  fontWeight: 600,
  // transition: theme.transitions.create([
  //   "border-color",
  //   "background-color",
  //   "box-shadow",
  // ]),
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#ff3f55" : "#ff3f55",
    borderColor: "#ff3f55",
    color: "#fff",
  },
}));
