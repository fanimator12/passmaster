import { Button } from "@mui/material";

export interface SubmitProps {
  title: string;
  isDisabled? : boolean;
}

const SubmitButton = ({ title, isDisabled}: SubmitProps) => {
  return (
    <Button
      type="submit"
      sx={{
        "&.Mui-disabled": { color: "#FFFFFF36", backgroundColor: "#FF850036" },
        ":hover": { backgroundColor: "#FF8500" },
        color: "#fff",
        padding: "8px 16px",
        backgroundColor: "#FF8500",
      }}
      disabled={isDisabled}
    >
      {title}
    </Button>
  );
};

export default SubmitButton;