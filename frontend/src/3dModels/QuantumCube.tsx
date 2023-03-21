import React from "react";
import ModelViewer from "./ModelViewer";

const QuantumCube: React.FC = () => {
  return (
    <ModelViewer scale={40} modelPath={"./quantum_cube.gltf"} />
  );
};

export default QuantumCube;
