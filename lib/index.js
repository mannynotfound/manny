import * as THREE from 'three';
import { AnimationMixer } from 'three';
import { useMemo, useRef, useState, useEffect as useEffect$1 } from 'react';
import { useFBX, useTexture, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const MANNY_MODEL = process.env.NODE_ENV === "production" ? "https://d2tm2f4d5v0kas.cloudfront.net/3.0/manny.fbx" : "assets/models/manny.fbx";
const MANNY_TEXTURE_DEFAULT = process.env.NODE_ENV === "production" ? "https://d2tm2f4d5v0kas.cloudfront.net/3.0/manny_body_texture.jpg" : "assets/models/manny_body_texture.jpg";
const CLIPS_HOST = process.env.NODE_ENV === "production" ? "https://d2tm2f4d5v0kas.cloudfront.net/clips/" : "assets/clips/";

useFBX.preload(MANNY_MODEL);

function useManny(textureUrl) {
  if (textureUrl === void 0) {
    textureUrl = MANNY_TEXTURE_DEFAULT;
  }

  const fbx = useFBX(MANNY_MODEL); // load manny skin texture

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
  useEffect$1(() => {
    if (targetObj && animationAmount) {
      setRef({
        current: targetObj
      });
      setMixer(new AnimationMixer(undefined));
    }
  }, [targetObj.name, animationAmount]);
  useEffect$1(() => {
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

  useEffect$1(() => {
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

const ANIMATION_PATHS_DEFAULT = {
  tPose: `${CLIPS_HOST}/t-pose.fbx`,
  bored: `${CLIPS_HOST}/bored.fbx`
};

const Manny = _ref => {
  let {
    textureUrl,
    animationOptions
  } = _ref;
  const mannyObj = useManny(textureUrl);
  const {
    paths,
    active,
    fadeIn,
    fadeOut
  } = animationOptions ?? {};
  const {
    actions
  } = useAnimations(mannyObj, paths ?? ANIMATION_PATHS_DEFAULT);
  useEffect(() => {
    actions?.[active]?.reset().fadeIn(fadeIn ?? 0.2).play();
    return () => {
      actions?.[active]?.fadeOut(fadeOut ?? 0.2);
    };
  }, [active, actions]);
  return mannyObj;
};

export { Manny as default };
