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
    <group position={[0, -0.75, 0]}>
      <Suspense fallback={() => null}>
        <primitive object={mannyObj} dispose={null} />
      </Suspense>
    </group>
  );
}

function App() {
  return (
    <div className="App">
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 1, 2.5],
        }}
        gl={{ preserveDrawingBuffer: true }}
        flat
      >
        <Manny />
        <OrbitControls
          rotateSpeed={1}
          target={[0, 0, 0]}
          minDistance={2.5}
          maxDistance={10}
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
