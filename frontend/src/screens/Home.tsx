import { Canvas } from "@react-three/fiber";
import "../App.css";
import { OrbitControls } from "@react-three/drei";
import Model from "../components/Model";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsModelLoaded(true);
    }, 2000);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    setIsLoading(!isModelLoaded);
  }, [isModelLoaded]);
  return (
    <>
      {isLoading ? (
        <LinearProgress
          style={{
            width: "50px",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
            color: "#fff",
          }}
        />
      ) : (
        <>
          <Header
            handleDrawerToggle={handleDrawerToggle}
            mobileOpen={mobileOpen}
          />

          <Canvas orthographic camera={{ zoom: 300, position: [20, 150, 100] }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[-10, -10, 10]} angle={0.2} penumbra={1} />
            <directionalLight
              color="hsla(217, 100%, 37%, 1)"
              position={[1, -1, -1]}
              intensity={1}
            />
            <directionalLight
              color="red "
              position={[-1, -1, 1]}
              intensity={0.7}
            />
            <directionalLight
              color="hsla(157, 100%, 50%, 1) "
              position={[-1, -1, 1]}
              intensity={0.9}
            />
            <directionalLight
              color="red "
              position={[-1, -1, -1]}
              intensity={0.8}
            />
            {isModelLoaded && <Model />}
            <OrbitControls />
          </Canvas>
        </>
      )}
    </>
  );
}

export default Home;
