# Manny

Import the @mannynotfound model into your `@react-three/fiber` app.

Live Demo: [https://mannynotfound.github.io/](https://mannynotfound.github.io/)

## Dependencies

- `react` v16.14.0 or higher
- `@react-three/fiber` v7.0.26 or higher
- `@react-three/drei` v8.7.3 or higher

## Installation

```bash
npm install manny
```

## Usage

```js
import React from "react";
import ReactDOM from "react-dom/client";
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
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas
        camera={{
          fov: 45,
          near: 1,
          far: 2000,
          position: [25, 100, 300],
        }}
        flat
      >
        {/* manny has to be called inside @react-three/fiber canvas context */}
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Configuration

#### props

| Prop             | Type   | Default                                                          | Description                                         |
| ---------------- | ------ | ---------------------------------------------------------------- | --------------------------------------------------- |
| modelPath        | string | https://d2tm2f4d5v0kas.cloudfront.net/3.0/manny.fbx              | url for loading manny model                         |
| textureUrl       | string | https://d2tm2f4d5v0kas.cloudfront.net/3.0/manny_body_texture.jpg | url for loading manny skin texture                  |
| animationOptions | object | { paths: {} }                                                    | configuration object for loading/playing animations |

#### animationOptions

manny is using the [mixamo](https://www.mixamo.com) rig and supports loading animations in .fbx or .glb format. To use your own animations, define them in `paths` with the animation name and url as key/value pairs.

If no `animationOptions` are provided, the returned manny object will not have an animation mixer and will be in a static default pose with arms resting at the side, useful if using custom animation state logic.

| Prop    | Type   | Default         | Description                                                                         |
| ------- | ------ | --------------- | ----------------------------------------------------------------------------------- |
| paths   | object | { idle: '...' } | object where keys represent animation name, and values represent animations to load |
| active  | string | undefined       | key of active animation to play                                                     |
| fadeIn  | float  | 0.2             | duration in seconds to transition in new animations                                 |
| fadeOut | float  | 0.2             | duration in seconds to transition out new animations                                |
| paused | boolean  | false             | toggle animation pause state                                |


## Loading All Animations Initially

```js
const PATH = "https://yourhost.com/animations";

const paths = {
  idle: `${PATH}/idle.fbx`,
  walk: `${PATH}/walk.fbx`,
  run: `${PATH}/run.fbx`,
  jump: `${PATH}/jump.fbx`,
  landing: `${PATH}/landing.fbx`,
  inAir: `${PATH}/falling_idle.fbx`,
  backpedal: `${PATH}/backpedal.fbx`,
  turnLeft: `${PATH}/turn_left.fbx`,
  turnRight: `${PATH}/turn_right.fbx`,
  strafeLeft: `${PATH}/strafe_left.fbx`,
  strafeRight: `${PATH}/strafe_right.fbx`,
};

function Manny({ animation }) {
  const mannyObj = manny({
    animationOptions: {
      active: aninmation,
      paths,
    },
  });

  return (
    <group position={[0, -0.75, 0]}>
      <primitive object={mannyObj} dispose={null} />
    </group>
  );
}
```

## Loading Animations Lazily

```js
const PATH = "https://yourhost.com/animations";

const paths = {
  idle: `${PATH}/idle.fbx`,
  dance: `${PATH}/dance.fbx`,
  cry: `${PATH}/cry.fbx`,
  victory: `${PATH}/victory.fbx`,
  death: `${PATH}/death.fbx`,
};

function Manny({ animation }) {
  const mannyObj = manny({
    animationOptions: {
      active: "idle",
      paths: {
        [animation]: paths[animation],
      },
    },
  });

  return (
    <group position={[0, -0.75, 0]}>
      <primitive object={mannyObj} dispose={null} />
    </group>
  );
}
```

## Running Locally

```bash
npm run dev
```

Go to `localhost:3000` to see the local test application.
