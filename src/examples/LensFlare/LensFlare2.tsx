import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";

const ThreeLensFlares: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const clock = new THREE.Clock();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      15000
    );
    camera.position.z = 250;

    // SCENE
    const scene = new THREE.Scene();
    // Note: exactly as in your original code, including THREE.SRGBColorSpace
    scene.background = new THREE.Color().setHSL(
      0.51,
      0.4,
      0.01,
      THREE.SRGBColorSpace
    );
    scene.fog = new THREE.Fog(scene.background, 3500, 15000);

    // WORLD OBJECTS
    const s = 250;
    const geometry = new THREE.BoxGeometry(s, s, s);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 50,
    });

    for (let i = 0; i < 3000; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = 8000 * (2 * Math.random() - 1);
      mesh.position.y = 8000 * (2 * Math.random() - 1);
      mesh.position.z = 8000 * (2 * Math.random() - 1);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      scene.add(mesh);
    }

    // LIGHTS
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);

    // LENS FLARES
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load(
      "/textures/lensflare/lensflare0.png"
    );
    const textureFlare3 = textureLoader.load(
      "/textures/lensflare/lensflare3.png"
    );

    function addLight(
      h: number,
      s: number,
      l: number,
      x: number,
      y: number,
      z: number
    ) {
      const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
      light.color.setHSL(h, s, l);
      light.position.set(x, y, z);
      scene.add(light);

      const lensflare = new Lensflare();
      lensflare.addElement(
        new LensflareElement(textureFlare0, 700, 0, light.color)
      );
      lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
      lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
      light.add(lensflare);
    }

    addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    addLight(0.08, 0.8, 0.5, 0, 0, -1000);
    addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Use setAnimationLoop to match your original file's behavior
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    // CONTROLS
    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 2500;
    controls.domElement = container; // exactly as in your original code
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;

    // STATS
    const stats = new Stats();
    container.appendChild(stats.dom);

    // RESIZE HANDLER
    function onWindowResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onWindowResize);

    // ANIMATION LOOP
    function animate() {
      render();
      stats.update();
    }

    function render() {
      const delta = clock.getDelta();
      controls.update(delta);
      renderer.render(scene, camera);
    }

    // CLEANUP ON UNMOUNT
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onWindowResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Optionally dispose geometries, materials, and textures if needed.
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={containerRef} />
    </div>
  );
};

export default ThreeLensFlares;
