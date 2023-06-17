import { Box, Drawer } from "@mui/material";
import NavLink from "./NavLink";
import { headerLinks } from "../constants";

interface HeaderProps {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}
export interface NavDrawerProps {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}

const NavDrawer = ({ handleDrawerToggle, mobileOpen }: HeaderProps) => {
  return (
    <Drawer
      anchor="right"
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: "block", lg: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: "250px",
          backgroundColor: "#000",
          textTransform: "uppercase",
        },
      }}
    >
      <Box 
      component="div"
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          padding: "32px",
        }}
      >
        {headerLinks.map((navItem: { title: string; url: string }) => (
          <NavLink
            key={navItem.title}
            title={navItem.title}
            url={navItem.url}
          />
        ))}
      </Box>
    </Drawer>
  );
};
export default NavDrawer;
