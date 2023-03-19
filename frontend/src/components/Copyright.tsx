import { Typography, Link } from "@mui/material";

export default function Copyright() {
  return (
    <Typography variant="body2" color="hsla(157, 100%, 50%, 1)" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        PassMaster
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}
