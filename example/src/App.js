import "./App.css";
import React, { Suspense, useState } from "react";
import Select from 'react-select';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import manny, { animations } from "manny";

function Manny({ animation }) {
  const mannyObj = manny({
    animation,
  });

  return (
    <group position={[0, -85, 0]}>
      <primitive object={mannyObj} dispose={null} />
    </group>
  );
}

const animOptions = animations.map((anim) => ({
  value: anim,
  label: anim,
}));

function App() {
  const [anim, setAnim] = useState({
    label: 'idle',
    value: 'idle'
  })
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
          <Manny animation={anim.value} />
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
      <footer>
        <Select menuPlacement="top" onChange={setAnim} options={animOptions} />
      </footer>
    </div>
  );
}

export default App;
