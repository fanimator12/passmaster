import { Box } from "@mui/material";
import logo from '../assets/logo-no-background.png';

const Logo = () => {
  return (
      <Box component="div">
        <img src={logo} alt="PassMaster Logo" className="logo" style={{width: '100%', height: "auto", padding: 12}}/>
      </Box>
  );
};

export default Logo;