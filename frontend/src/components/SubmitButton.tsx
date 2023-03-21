import { Button } from "@mui/material";

export interface SubmitProps {
  title: string;
  isDisabled? : boolean;
}

const SubmitButton = ({ title, isDisabled}: SubmitProps) => {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        "&.Mui-disabled": { background: 'hsla(217, 100%, 37%, 1)', opacity: 0.7 },
        ":hover": { background: 'linear-gradient(100deg, hsla(217, 100%, 37%, 1) 0%, hsla(157, 100%, 50%, 1) 100%)' },
        color: "#fff",
        padding: "8px 16px",
        background: 'linear-gradient(100deg, hsla(217, 100%, 37%, 1) 0%, hsla(157, 100%, 50%, 1) 100%)',
      }}
      disabled={isDisabled}
    >
      {title}
    </Button>
  );
};

export default SubmitButton;