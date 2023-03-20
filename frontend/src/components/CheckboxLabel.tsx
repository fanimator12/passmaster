import {
    Checkbox,
    FormControlLabel,
    FormGroup,
  } from "@mui/material";
  import { ChangeEvent } from "react";
  
  export interface CheckboxLabelProps {
    labelText?: string | any;
    link?: string;
    checked: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }
  
  const CheckboxLabel = ({
    labelText,
    checked,
    handleChange,
  }: CheckboxLabelProps) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              sx={{
                color: "#fff",
                ".Mui-checked": { color: "#FF8500" },
              }}
            />
          }
          label={labelText}
          sx={{ color: "#fff" }}
        />
      </FormGroup>
    );
  };
  
  export default CheckboxLabel;  