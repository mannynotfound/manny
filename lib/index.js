import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { useFBX, useTexture, useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import { useFrame } from '@react-three/fiber';

function useManny(modelPath, textureUrl) {
  const fbx = useFBX(modelPath);
  const texture = useTexture(textureUrl);
  texture.encoding = THREE.sRGBEncoding;
  const manny = useMemo(() => {
    const fbxClone = clone(fbx);
    fbxClone.name = `manny-${textureUrl}`;
    const mannySkin = new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color(0, 0, 0)
    });
    fbxClone.traverse(child => {
      if (child.isMesh) {
        child.material = mannySkin;
      }
    });
    fbxClone.getObjectByName('Eyes').frustumCulled = false;
    return fbxClone;
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
  }, [clips]);
  useEffect(() => {
    const clipsToSet = [];
    const clipNames = clips.map(clip => clip.name);
    const newNames = [];
    Object.keys(animations).forEach(name => {
      var _animations$name, _animations$name$anim;
      if ((_animations$name = animations[name]) != null && (_animations$name$anim = _animations$name.animations) != null && _animations$name$anim.length) {
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

const HOST = "https://d2tm2f4d5v0kas.cloudfront.net";
const MANNY_MODEL = `${HOST}/Manny_3.0.0.fbx`;
const MANNY_TEXTURE = `${HOST}/3.0/manny_body_texture.jpg`;
const CLIPS_HOST = `${HOST}/clips`;

const ANIMATION_PATHS = {
  idle: `${CLIPS_HOST}/idle_stand.fbx`
};
const Manny = props => {
  const modelPath = (props == null ? void 0 : props.modelPath) ?? MANNY_MODEL;
  const textureUrl = (props == null ? void 0 : props.textureUrl) ?? MANNY_TEXTURE;
  const mannyObj = useManny(modelPath, textureUrl);
  const {
    paused,
    paths,
    active,
    fadeIn,
    fadeOut,
    clampWhenFinished
  } = (props == null ? void 0 : props.animationOptions) ?? {};
  const {
    actions
  } = useAnimations(mannyObj, paths ?? ANIMATION_PATHS);
  useEffect(() => {
    if (props.onLoad) {
      props.onLoad();
    }
  }, []);
  useEffect(() => {
    if (actions != null && actions[active]) {
      actions[active].reset().fadeIn(fadeIn ?? 0.2).play();
    }
    return () => {
      var _actions$active;
      actions == null ? void 0 : (_actions$active = actions[active]) == null ? void 0 : _actions$active.fadeOut(fadeOut ?? 0.2);
    };
  }, [active, actions]);
  useEffect(() => {
    if (actions[active]) {
      actions[active].paused = paused;
    }
  }, [active, actions, paused]);
  useEffect(() => {
    if (actions[active] && clampWhenFinished) {
      actions[active].setLoop(2200); // 2200 = THREE.LoopOnce
      actions[active].clampWhenFinished = clampWhenFinished;
    }
  }, [active, actions, clampWhenFinished]);
  return mannyObj;
};

export { Manny as default };
