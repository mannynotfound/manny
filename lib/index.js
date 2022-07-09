import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { useFBX, useTexture, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

function clone(source) {
  const sourceLookup = new Map();
  const cloneLookup = new Map();
  const clone = source.clone();
  parallelTraverse(source, clone, function (sourceNode, clonedNode) {
    sourceLookup.set(clonedNode, sourceNode);
    cloneLookup.set(sourceNode, clonedNode);
  });
  clone.traverse(function (node) {
    if (!node.isSkinnedMesh) return;
    const clonedMesh = node;
    const sourceMesh = sourceLookup.get(node);
    const sourceBones = sourceMesh.skeleton.bones;
    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
    clonedMesh.skeleton.bones = sourceBones.map(function (bone) {
      return cloneLookup.get(bone);
    });
    clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
  });
  return clone;
}

function parallelTraverse(a, b, callback) {
  callback(a, b);

  for (let i = 0; i < a.children.length; i++) {
    parallelTraverse(a.children[i], b.children[i], callback);
  }
}

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

const HOST = "https://d2tm2f4d5v0kas.cloudfront.net";
const MANNY_MODEL = `${HOST}/Manny_3.0.0.fbx`;
const MANNY_TEXTURE = `${HOST}/3.0/manny_body_texture.jpg`;
const CLIPS_HOST = `${HOST}/clips`;

const ANIMATION_PATHS = {
  idle: `${CLIPS_HOST}/idle_stand.fbx`
};

const Manny = props => {
  const modelPath = props?.modelPath ?? MANNY_MODEL;
  const textureUrl = props?.textureUrl ?? MANNY_TEXTURE;
  const mannyObj = useManny(modelPath, textureUrl);
  const {
    paused,
    paths,
    active,
    fadeIn,
    fadeOut
  } = props?.animationOptions ?? {};
  const {
    actions
  } = useAnimations(mannyObj, paths ?? ANIMATION_PATHS);
  useEffect(() => {
    if (actions?.[active]) {
      actions[active].reset().fadeIn(fadeIn ?? 0.2).play();
    }

    return () => {
      actions?.[active]?.fadeOut(fadeOut ?? 0.2);
    };
  }, [active, actions]);
  useEffect(() => {
    if (actions[active]) {
      actions[active].paused = paused;
    }
  }, [active, actions, paused]);
  return mannyObj;
};

export { Manny as default };
