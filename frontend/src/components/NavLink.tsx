import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLinkProps } from "../props";

const NavLink = ({ title, url }: NavLinkProps) => {
  return (
    <>
      <ListItem key={title} disablePadding sx={{ width: "auto" }}>
        <ListItemButton>
          <a href={url} style={{ color: "#fff" }}>
            <ListItemText
              className="hover-underline-animation"
              primary={
                <Typography
                  style={{
                    marginTop: 0,
                    paddingBottom: "5px",
                    fontSize: "16px",
                    fontFamily: "Oswald Regular",
                  }}
                >
                  {title}
                </Typography>
              }
            />
          </a>
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default NavLink;
