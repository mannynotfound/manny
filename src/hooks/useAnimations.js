import { useEffect, useState, useRef, useMemo } from "react";
import { AnimationMixer } from "three";
import { useFrame } from "@react-three/fiber";
import { useFBX, useGLTF } from "@react-three/drei";

function useAnimations(targetObj, animationPaths) {
  const ref = useRef();
  const [clips, setClips] = useState([]);
  const [actualRef, setRef] = useState(ref);
  const [mixer, setMixer] = useState(new AnimationMixer(undefined));
  const lazyActions = useRef({});

  const api = useMemo(() => {
    if (!mixer || !clips.length) {
      return {
        actions: {},
      };
    }
    const actions = {};
    clips.forEach((clip) =>
      Object.defineProperty(actions, clip.name, {
        enumerable: true,
        get() {
          if (actualRef.current) {
            lazyActions.current[clip.name] = mixer.clipAction(
              clip,
              actualRef.current
            );

            return lazyActions.current[clip.name];
          }

          return null;
        },
      })
    );
    return {
      ref: actualRef,
      clips,
      actions,
      mixer,
    };
  }, [clips, targetObj.name, mixer]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  const animations = {};
  Object.keys(animationPaths).forEach((key) => {
    const fileExt = animationPaths[key].split(".").pop();
    if (fileExt === "fbx") {
      animations[key] = useFBX(animationPaths[key]);
    } else {
      animations[key] = useGLTF(animationPaths[key]);
    }
  });
  const animationAmount = Object.keys(animations).length;

  useEffect(() => {
    if (targetObj && animationAmount) {
      setRef({ current: targetObj });
      setMixer(new AnimationMixer(undefined));
    }
  }, [targetObj.name, animationAmount]);

  useEffect(() => {
    const currentRoot = actualRef.current;
    return () => {
      // Clean up only when clips change, wipe out lazy actions and uncache clips
      lazyActions.current = {};
      Object.values(api.actions).forEach((action) => {
        if (currentRoot) {
          mixer.uncacheAction(action, currentRoot);
        }
      });
    };
  }, [clips]);

  useEffect(() => {
    const clipsToSet = [];

    const clipNames = clips.map((clip) => clip.name);
    const newNames = [];
    Object.keys(animations).forEach((name) => {
      if (animations[name]?.animations?.length) {
        animations[name].animations[0].name = name;
        clipsToSet.push(animations[name].animations[0]);
        newNames.push(name);
      }
    });

    const isDirty = newNames.some((name, idx) => clipNames[idx] !== name);
    if (isDirty) {
      setClips(clipsToSet);
    }
  }, [Object.keys(animations)]);

  return api;
}

export default useAnimations;
