import MenuIcon from "@mui/icons-material/Menu";
import {
  Grid,
  AppBar,
  Link,
  Toolbar,
  Button,
  IconButton,
  Box,
  Dialog,
} from "@mui/material";
import NavDrawer from "./NavDrawer";
import NavLink from "./NavLink";
import { HeaderProps } from "../props";
import Logo from "./Logo";
import { useState } from "react";
import SignIn from "../screens/SignIn";

function Header({ handleDrawerToggle, mobileOpen }: HeaderProps) {
  const [openSignIn, setOpenSignIn] = useState(false);

  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, " +
          "rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
        boxShadow: 0,
        paddingTop: "0.5em",
      }}
    >
      <Toolbar>
        <Grid
          container
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid
            container
            justifyContent="flex-start"
            sx={{ padding: "1em 0 0 1em" }}
          >
            <Grid item>
              <Link href="/home">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  edge="start"
                >
                  <Logo width={"7em"} height={"auto"} />
                </IconButton>
              </Link>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ marginTop: "-70px" }}>
            <Grid item>
              <Box component="div">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    display: { md: "none" },
                    marginLeft: "0.5em",
                  }}
                >
                  <MenuIcon />
                </IconButton>
                {mobileOpen ? (
                  <NavDrawer
                    handleDrawerToggle={handleDrawerToggle}
                    mobileOpen={mobileOpen}
                  />
                ) : (
                  ""
                )}
              </Box>
            </Grid>

            <Grid item>
              <Box
                component="div"
                sx={{
                  display: { xs: "none", sm: "none", md: "flex" },
                  marginLeft: "10px",
                  width: "auto",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{
                    transition: "none",
                    color: "transparent",
                    "& .MuiTypography-root": {
                      textTransform: "uppercase",
                      fontFamily: "Oswald Regular",
                    },
                    "& .MuiListItemButton-root:hover": {
                      backgroundColor: "transparent",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <NavLink key={0} title="Home" url="/" />
                </Button>

                <Button
                  sx={{
                    transition: "none",
                    color: "transparent",
                    "& .MuiTypography-root": {
                      textTransform: "uppercase",
                      fontFamily: "Oswald Regular",
                    },
                    "& .MuiListItemButton-root:hover": {
                      backgroundColor: "transparent",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={handleOpenSignIn}
                >
                  <NavLink key={1} title="Sign In" url={undefined} />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
      <Dialog
        open={openSignIn}
        onClose={handleCloseSignIn}
        aria-labelledby="sign-in-modal-title"
        aria-describedby="sign-in-modal-description"
      >
        <SignIn />
      </Dialog>
    </AppBar>
  );
}

export default Header;
