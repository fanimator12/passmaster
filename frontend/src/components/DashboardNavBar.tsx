import { Toolbar, IconButton, Tooltip} from "@material-ui/core";
import { useNavigate } from "react-router";
import {
  AppBar,
  Box,
  Button,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpIcon from "@mui/icons-material/Help";
import { useAuth } from "../contexts/AuthContext";
import { DashboardNavBarProps } from "../props";

const DashboardNavbar = ({ ...props }: DashboardNavBarProps) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const { onDrawerToggle } = props;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    logOut;
    navigate("/home");
  };

  const background = "";

  return (
    <Box sx={{ background: background }} component="div">
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ background: "transparent" }}
      >
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
              <IconButton color="inherit" onClick={onDrawerToggle} aria-label="open drawer" edge="start">
                <LogoIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Link
                to="https://github.com/fanimator12/passmaster"
                style={{
                  textDecoration: "underline",
                  color: "#fff",
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </Link>
            </Grid>
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Button onClick={handleSignOut}>
                <Typography>Sign Out</Typography>
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, background: "transparent" }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography variant="h5" component="h1" sx={{ color: "#fff" }}>
                My Vaults
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, background: "transparent" }}
      >
        <Tabs value={0}>
          <Tab label="Personal" />
        </Tabs>
      </AppBar>
    </Box>
  );
};

export default DashboardNavbar;
