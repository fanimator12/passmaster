import { Box } from "@mui/material";
import logo from '../assets/logo-icon.png';

const LogoIcon = () => {
  return (
      <Box>
        <img src={logo} alt="PassMaster Logo" className="logo" style={{width: 50, height: "auto", padding: 5}}/>
      </Box>
  );
};

export default LogoIcon;