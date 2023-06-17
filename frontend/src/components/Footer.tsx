import Copyright from "./Copyright";
import "../App.css";
import Logo from "./Logo";
import { Box, Container, Typography, Grid } from "@mui/material";
import { footerLinks } from "../constants";
import NavLink from "./NavLink";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
      <Container>
        <Grid
          container
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
        >
          <Grid item xs={12} md={6} justifyContent="space-between">
            <Logo width={"266px"} height={"72.14px"} />
            <Typography>
              Unlock the Power of Passwords: Store, Secure, and Simplify Your
              Digital Life with Ease!
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            {footerLinks.map((footerlink) => (
              <Grid key={footerlink.title} item xs={6} sm={4} md={6} lg={4}>
                <Typography variant="h4">{footerlink.title}</Typography>
                {footerlink.urls.map((url) => (
                  <NavLink key={url.name} title={url.name} url={url.url} />
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg">
        <Copyright />
      </Container>
    </Box>
  );
}
