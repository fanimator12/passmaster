import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { CheckboxLabelProps } from "../props";

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
