import { Box } from "@mui/material";
import logo from "../assets/logo-no-background.png";

interface LogoProps {
  width: string;
  height: string;
}

const Logo = ({width, height}: LogoProps) => {
  return (
    <Box component="div">
      <img
        src={logo}
        alt="PassMaster Logo"
        className="logo"
        style={{ width: `${width}`, height: `${height}`, padding: 12 }}
      />
    </Box>
  );
};

export default Logo;
