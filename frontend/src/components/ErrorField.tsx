import { FormHelperText } from "@mui/material";
export interface ErrorFieldProps {
  msg: string;
}

const ErrorField = ({ msg }: ErrorFieldProps) => {
  return (
    <FormHelperText sx={{ color: "red" }}>Be careful: {msg}</FormHelperText>
  );
};

export default ErrorField;