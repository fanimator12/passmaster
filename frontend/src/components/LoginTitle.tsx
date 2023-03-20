import { Typography } from "@mui/material";

export interface LoginTitleProps {
  title: string;
}

const LoginTitle = ({ title }: LoginTitleProps) => {
  return (
    <Typography color="#fff" sx={{textTransform: "uppercase", fontSize: 45 }}>
      {title}
    </Typography>
  );
};

export default LoginTitle;