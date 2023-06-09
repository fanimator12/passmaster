import { useFrame} from "@react-three/fiber";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Group, Mesh, TextureLoader } from "three";
import { useRef, useEffect } from "react";

const Model = () => {
  const gltfLoader = useRef(new GLTFLoader()).current;
  const gltfRef = useRef<Group | null>(null);
  useEffect(() => {
    gltfLoader.load("/models/scene.gltf", (gltf: GLTF) => {
      const textureLoader = new TextureLoader();
      textureLoader.setPath("/models/textures/");

      gltf.scene.traverse((node: any) => {
        if (node instanceof Mesh) {
          const textureName = node.name;
          const textureExtensions = [".jpeg", ".png"];

          let texture: THREE.Texture | null = null;
          for (const extension of textureExtensions) {
            const texturePath = textureName + extension;
            if (textureLoader.manager.getHandler(texturePath) !== null) {
              texture = textureLoader.load(texturePath);
              break;
            }
          }

          if (texture) {
            node.material.map = texture;
          }
        }
      });

      if (gltfRef.current) {
        gltfRef.current.add(gltf.scene);
      }
    });
  }, []);

  useFrame(() => {
    if (gltfRef.current) {
      gltfRef.current.rotation.y += 0.001;
    }
  });

  return (
     <group ref={gltfRef} />
  );
};

export default Model;
