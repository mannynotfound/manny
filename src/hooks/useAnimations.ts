import { useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimationMixer, Group } from 'three';
import type { AnimationAction, AnimationClip, Object3D } from 'three';
import type { GLTF } from 'three-stdlib';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationLibrary, DEFAULT_LIBRARY } from '../fixtures/animations';

interface Animations {
  actions: Record<string, AnimationAction> | undefined;
  mixer: AnimationMixer;
}

interface AnimationCache {
  [animationName: string]: AnimationClip;
}

function useAnimations(
  targetObj: Object3D,
  animation: string | undefined,
  animationLibrary: AnimationLibrary | undefined
): Animations {
  const library: AnimationLibrary = {
    ...DEFAULT_LIBRARY,
    ...animationLibrary,
  };
  const [animCache, setAnimCache] = useState<AnimationCache>();
  const mixer = useMemo(() => new AnimationMixer(targetObj), [targetObj]);
  const actions = useMemo(() => {
    if (animCache === undefined) {
      return undefined;
    }
    return Object.fromEntries(
      Object.entries(animCache).map(([name, clip]) => [
        name,
        mixer.clipAction(clip),
      ])
    );
  }, [animCache]);

  useEffect(() => {
    Object.entries(library).forEach(([animName, { url, async }]) => {
      const alreadyLoaded = animCache?.[animName] !== undefined;
      const notReady = async === true && animation !== animName;
      if (alreadyLoaded || notReady) {
        return;
      }

      const loader = url.endsWith('.fbx') ? new FBXLoader() : new GLTFLoader();
      loader.load(url, (animModel: GLTF | Group) => {
        const clips = animModel.animations;
        setAnimCache((prev) => ({
          ...prev,
          [animName]: clips[0],
        }));
      });
    });
  }, [animation, library]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return {
    actions,
    mixer,
  };
}

export default useAnimations;
