import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { FlyControls, PerspectiveCamera, Stats } from "@react-three/drei";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";

type LensflareLightProps = {
  h: number;
  s: number;
  l: number;
  position: [number, number, number];
};

const LensflareLight: React.FC<LensflareLightProps> = ({
  h,
  s,
  l,
  position,
}) => {
  const lightRef = useRef<THREE.PointLight>(null!);
  // Load the lens flare textures from your public directory
  const textureFlare0 = useLoader(THREE.TextureLoader, "/textures/lensflare/lensflare0.png");
  const textureFlare3 = useLoader(THREE.TextureLoader, "/textures/lensflare/lensflare3.png");

  useEffect(() => {
    if (lightRef.current) {
      const lensflare = new Lensflare();
      lensflare.addElement(
        new LensflareElement(textureFlare0, 700, 0, lightRef.current.color)
      );
      lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
      lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
      lightRef.current.add(lensflare);
    }
  }, [textureFlare0, textureFlare3]);

  return (
    <pointLight
      ref={lightRef}
      color={new THREE.Color().setHSL(h, s, l)}
      intensity={1.5}
      distance={2000}
      decay={0}
      position={position}
    />
  );
};

const Boxes: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  
  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (!meshRef.current) return;
    for (let i = 0; i < 3000; i++) {
      dummy.position.set(
        8000 * (2 * Math.random() - 1),
        8000 * (2 * Math.random() - 1),
        8000 * (2 * Math.random() - 1)
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 3000]}>
      <boxGeometry args={[250, 250, 250]} />
      {/* <sphereGeometry args={[250, 250, 250]} /> */}
      <meshPhongMaterial color={0xffffff} specular={0xffffff} shininess={50} />
    </instancedMesh>
  );
};

const Scene: React.FC = () => {
  // Use a ref to the scene so we can set background and fog once mounted
  const sceneRef = useRef<THREE.Scene>(null!);

  useEffect(() => {
    if (sceneRef.current) {
      // Set background color exactly as in your original code,
      // including the use of HSL.
      const color = new THREE.Color().setHSL(0.51, 0.4, 0.01);
      sceneRef.current.background = color;
      sceneRef.current.fog = new THREE.Fog(color, 3500, 15000);
    }
  }, []);

  return (
    <scene ref={sceneRef}>
      {/* Directional Light */}
      <directionalLight
        position={[0, -1, 0]}
        intensity={0.15}
        color={new THREE.Color().setHSL(0.1, 0.7, 0.5)}
      />
      {/* World Objects */}
      <Boxes />
      {/* Lens Flare Lights */}
      <LensflareLight h={0.55} s={0.9} l={0.5} position={[5000, 0, -1000]} />
      <LensflareLight h={0.08} s={0.8} l={0.5} position={[0, 0, -1000]} />
      <LensflareLight
        h={0.995}
        s={0.5}
        l={0.9}
        position={[5000, 5000, -1000]}
      />
    </scene>
  );
};

const LensFlare: React.FC = () => {
  return (
    <div
      className="bg-black"
      style={{ position: "relative", width: "100%", height: "100vh" }}
    >
      <Canvas>
        {/* Set up the camera exactly as in your original code */}
        <PerspectiveCamera
          makeDefault
          fov={40}
          position={[0, 0, 250]}
          near={1}
          far={15000}
        />
        <ambientLight intensity={0.2} />

        <Scene />
        <FlyControls
          movementSpeed={2500}
          rollSpeed={Math.PI / 6}
          dragToLook={false}
        />
      </Canvas>

      {/* uncomment this (import this from drei ) */}
      <Stats />
    </div>
  );
};

export default LensFlare;
