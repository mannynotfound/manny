import "./App.css";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import manny from "manny";

function Manny() {
  const mannyObj = manny({
    animationOptions: {
      active: "idle",
    },
  });

  return (
    <group position={[0, -85, 0]}>
      <primitive object={mannyObj} dispose={null} />
    </group>
  );
}

function App() {
  return (
    <div className="App">
      <Canvas
        camera={{
          fov: 45,
          near: 1,
          far: 2000,
          position: [25, 100, 300],
        }}
        flat
      >
        <Suspense fallback={null}>
          <Manny />
        </Suspense>
        <OrbitControls
          rotateSpeed={1}
          target={[0, 0, 0]}
          minDistance={100}
          maxDistance={1000}
        />
        <hemisphereLight
          skyColor={0xffffff}
          groundColor={0x444444}
          position={[0, 0, 0]}
        />
        <directionalLight
          color={0xffffff}
          intensity={0.25}
          castShadow
          position={[0, 200, 100]}
        />
      </Canvas>
    </div>
  );
}

export default App;
