import { Grid, Typography } from "@mui/material";
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
        sx={{
          // background: `${background}`,
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "cover",
          // backgroundPosition: "center",
        }}
      >
        <Grid alignSelf="flex-end" sx={{ marginTop: 15 }}>
          {background}
          <Typography
            color="#fff"
            sx={{
              display: { xs: "none", md: "block" },
              textAlign: "right",
              fontSize: 60,
              padding: "0 2em 6em 0",
            }}
          >
            {slogan}
          </Typography>
        </Grid>

        <Grid
          alignItems="center"
          alignSelf="flex-start"
          sx={{ display: { xs: "none", md: "flex" }, marginLeft: 10, marginBottom: 15 }}
        >
          <Logo />
        </Grid>
      </Grid>
    </>
  );
};

export default LoginBackground;