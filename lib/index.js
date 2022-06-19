import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { useFBX, useTexture, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

function useManny(modelPath, textureUrl) {
  const fbx = useFBX(modelPath); // load manny skin texture

  const texture = useTexture(textureUrl);
  texture.encoding = THREE.sRGBEncoding;
  const manny = useMemo(() => {
    fbx.name = `manny-${textureUrl}`; // create new manny skin material

    const mannySkin = new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color(0, 0, 0)
    }); // overwrite body mesh texture

    const ogMain = fbx.children[0];
    ogMain.material = mannySkin; // overwrite eye mesh texture

    const ogEyes = fbx.children[2];
    ogEyes.material = mannySkin;
    return fbx;
  }, [texture]);
  return manny;
}

function useAnimations(targetObj, animationPaths) {
  const ref = useRef();
  const [clips, setClips] = useState([]);
  const [actualRef, setRef] = useState(ref);
  const [mixer, setMixer] = useState(new AnimationMixer(undefined));
  const lazyActions = useRef({});
  const api = useMemo(() => {
    if (!mixer || !clips.length) {
      return {
        actions: {}
      };
    }

    const actions = {};
    clips.forEach(clip => Object.defineProperty(actions, clip.name, {
      enumerable: true,

      get() {
        if (actualRef.current) {
          lazyActions.current[clip.name] = mixer.clipAction(clip, actualRef.current);
          return lazyActions.current[clip.name];
        }

        return null;
      }

    }));
    return {
      ref: actualRef,
      clips,
      actions,
      mixer
    };
  }, [clips, targetObj.name, mixer]);
  useFrame((_, delta) => {
    mixer.update(delta);
  });
  const animations = {};
  Object.keys(animationPaths).forEach(key => {
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
      setRef({
        current: targetObj
      });
      setMixer(new AnimationMixer(undefined));
    }
  }, [targetObj.name, animationAmount]);
  useEffect(() => {
    const currentRoot = actualRef.current;
    return () => {
      // Clean up only when clips change, wipe out lazy actions and uncache clips
      lazyActions.current = {};
      Object.values(api.actions).forEach(action => {
        if (currentRoot) {
          mixer.uncacheAction(action, currentRoot);
        }
      });
    };
  }, [clips]); // set clips when ready

  useEffect(() => {
    const clipsToSet = [];
    Object.keys(animations).forEach(name => {
      if (animations[name]?.animations?.length) {
        animations[name].animations[0].name = name;
        clipsToSet.push(animations[name].animations[0]);
      }
    });

    if (clips.length < clipsToSet.length) {
      setClips(clipsToSet);
    }
  }, [animationAmount]);
  return api;
}

const HOST = "https://d2tm2f4d5v0kas.cloudfront.net/3.0";
const MANNY_MODEL = `${HOST}/manny.fbx`;
const MANNY_TEXTURE = `${HOST}/manny_body_texture.jpg`;
const CLIPS_HOST = `${HOST}/clips`;

const ANIMATION_PATHS = {
  idle: `${CLIPS_HOST}/idle.glb`
};

const Manny = props => {
  const modelPath = props?.modelPath ?? MANNY_MODEL;
  const textureUrl = props?.textureUrl ?? MANNY_TEXTURE;
  const mannyObj = useManny(modelPath, textureUrl);
  const {
    paths,
    active,
    fadeIn,
    fadeOut
  } = props?.animationOptions ?? {};
  const {
    actions
  } = useAnimations(mannyObj, paths ?? ANIMATION_PATHS);
  useEffect(() => {
    actions?.[active]?.reset().fadeIn(fadeIn ?? 0.2).play();
    return () => {
      actions?.[active]?.fadeOut(fadeOut ?? 0.2);
    };
  }, [active, actions]);
  return mannyObj;
};

export { Manny as default };
