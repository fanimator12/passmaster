import { Parallax } from "react-parallax";
import { ParallaxBackgroundProps } from "../props";
import { CardMedia } from "@mui/material";

const ParallaxBackground = ({ background, title }: ParallaxBackgroundProps) => (
  <Parallax
    className="parallax-background"
    blur={0}
    strength={800}
  >
    <CardMedia
      component="video"
      className="backgroundVideo"
      src={background}
      autoPlay
      muted
      loop
      sx={{ zIndex: 1 }}
    />
    {!title ? (
      <div className="content">
        <span className="img-txt">{title}</span>
      </div>
    ) : (
      <></>
    )}
  </Parallax>
);

export default ParallaxBackground;
