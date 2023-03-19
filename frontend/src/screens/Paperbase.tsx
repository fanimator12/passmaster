import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Navigator from "../components/SideBar";
import ItemContent from "../components/ItemContent";
import Header from "../components/Header";
import Copyright from "../components/Copyright";
import theme from "../theme/theme";

const drawerWidth = 256;

export default function Paperbase() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#000C1E",
          }}
        >
          <Header onDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            sx={{ flex: 1, py: 6, px: 4, background: "transparent" }}
          >
            <ItemContent />
          </Box>
          <Box component="footer" sx={{ p: 2, background: "transparent" }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
