import { CardMedia, Grid, Typography } from "@mui/material";
import Logo from "./Logo";

export interface LoginBackgroundProps {
  background: any;
  slogan: string;
}

const LoginBackground = ({ background, slogan }: LoginBackgroundProps) => {
  return (
    <>
      <Grid
        item
        display="flex"
        justifyContent="space-around"
        flexDirection="column"
        xs={false}
        sm={4}
        md={7}
      >
        <CardMedia
          component="video"
          className="backgroundVideo"
          src={background}
          autoPlay
          muted
          loop
          sx={{ opacity: 0.8, filter: "brightness(0.3)" }}
        />

        <Grid alignSelf="flex-end" sx={{ marginTop: 15 }}>
          <Typography
            color="#fff"
            sx={{
              display: { xs: "none", md: "block" },
              textAlign: "right",
              fontFamily: "Oswald Regular",
              textTransform: "uppercase",
              fontSize: 50,
              padding: "0 2em 6em 0",
            }}
          >
            {slogan}
          </Typography>
        </Grid>

        <Grid
          alignItems="center"
          alignSelf="flex-start"
          sx={{
            display: { xs: "none", md: "flex" },
            marginLeft: 10,
            marginBottom: 15,
          }}
        >
          <Logo />
        </Grid>
      </Grid>
    </>
  );
};

export default LoginBackground;
