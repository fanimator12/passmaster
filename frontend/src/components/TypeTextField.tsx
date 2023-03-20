import { FormHelperTextProps, SxProps, TextField, Theme } from "@mui/material";
import { ChangeEvent, MutableRefObject } from "react";

export interface TypeTextFieldProps {
  ref?: MutableRefObject<undefined>;
  value?: string;
  style?: SxProps<Theme> | undefined;
  required?: boolean;
  label: string;
  variant?: "standard" | "filled" | "outlined";
  type?: string;
  autoComplete?: string;
  error?: boolean;
  errorMsg?: Partial<FormHelperTextProps<"p", {}>>;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TypeTextField = ({
  required,
  style,
  value,
  label,
  variant,
  type,
  autoComplete,
  error,
  errorMsg,
  handleChange,
}: TypeTextFieldProps) => {
  return (
    <TextField
      sx={style}
      value={value}
      required={required}
      label={label}
      variant={variant}
      type={type}
      autoComplete={autoComplete}
      error={error}
      FormHelperTextProps={errorMsg}
      onChange={handleChange}
    />
  );
};

export default TypeTextField;