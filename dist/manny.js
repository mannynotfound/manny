import { useMemo, useState, useEffect } from 'react';
import { useFBX, useTexture } from '@react-three/drei';
import { sRGBEncoding, MeshPhongMaterial, Color, AnimationMixer } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const HOST = "https://d2tm2f4d5v0kas.cloudfront.net";
const MANNY_MODEL = `${HOST}/Manny_3.0.0.fbx`;
const MANNY_TEXTURE = `${HOST}/3.0/manny_body_texture.jpg`;
const CLIPS_HOST = `${HOST}/clips`;

const makeAnim = (fileName, async = true) => ({
  url: `${CLIPS_HOST}/${fileName}.fbx`,
  async
});
const DEFAULT_LIBRARY = {
  idle: makeAnim("idle_stand", false),
  waving: makeAnim("waving"),
  thankful: makeAnim("thankful"),
  bashful: makeAnim("bashful"),
  victory: makeAnim("victory"),
  acknowledge: makeAnim("acknowledge"),
  agony: makeAnim("agony"),
  backflip: makeAnim("backflip"),
  "bboy brooklyn step": makeAnim("bboy brooklyn step"),
  "bboy flair": makeAnim("bboy flair"),
  "bboy freeze": makeAnim("bboy finish"),
  "bboy hand freeze": makeAnim("bboy handstand freeze"),
  "bboy hand spin": makeAnim("bboy handstand spin"),
  "blowing kiss": makeAnim("blow a kiss"),
  boogaloo: makeAnim("boogaloo"),
  bored: makeAnim("bored"),
  burpee: makeAnim("burpee"),
  capoeira: makeAnim("capoeira"),
  "check phone": makeAnim("check phone"),
  cheer: makeAnim("cheer"),
  clap: makeAnim("clap"),
  cocky: makeAnim("cocky"),
  convulse: makeAnim("convulse"),
  count: makeAnim("count"),
  cry: makeAnim("cry"),
  "cut throat": makeAnim("cut throat"),
  "dance bellydance": makeAnim("bellydance"),
  "dance gangam style": makeAnim("k-pop dance"),
  "dance chicken": makeAnim("chicken dance"),
  "dance cabbage patch": makeAnim("cabbage patch dance"),
  "dance maraschino": makeAnim("maraschino"),
  "dance rumba": makeAnim("rumba dance"),
  "dance salsa": makeAnim("salsa dance"),
  "dance twerk": makeAnim("twerk"),
  "dance twist": makeAnim("twist dance"),
  "dance ymca": makeAnim("ymca dance"),
  die: makeAnim("die"),
  drunk: makeAnim("drunk"),
  ecstatic: makeAnim("ecstatic"),
  electrocuted: makeAnim("electrocuted"),
  float: makeAnim("float"),
  fly: makeAnim("fly"),
  "hurricane kick": makeAnim("hurricane kick"),
  jump: makeAnim("jump"),
  kneel: makeAnim("kneel"),
  "look off": makeAnim("look off"),
  loser: makeAnim("loser"),
  no: makeAnim("no"),
  pain: makeAnim("pain"),
  plank: makeAnim("plank"),
  point: makeAnim("point"),
  pray: makeAnim("pray"),
  "push up": makeAnim("push up"),
  "raise hand": makeAnim("raise hand"),
  rap: makeAnim("rap"),
  run: makeAnim("run"),
  salute: makeAnim("salute"),
  seizure: makeAnim("seizure"),
  "shake fist": makeAnim("shake fist"),
  shrug: makeAnim("shrug"),
  sing: makeAnim("sing"),
  "sit up": makeAnim("situp"),
  sleep: makeAnim("sleep"),
  smh: makeAnim("smh"),
  "stretch neck": makeAnim("stretch neck"),
  "t-pose": makeAnim("t-pose"),
  teeter: makeAnim("teeter"),
  think: makeAnim("think"),
  typing: makeAnim("typing"),
  "walk sad": makeAnim("walk sad"),
  "walk swag": makeAnim("walk swag"),
  yell: makeAnim("yell")
};

function useManny(modelPath, textureUrl) {
  const fbx = useFBX(modelPath);
  const texture = useTexture(textureUrl);
  texture.encoding = sRGBEncoding;
  const manny = useMemo(() => {
    const fbxClone = clone(fbx);
    fbxClone.name = `manny-${textureUrl}`;
    const mannySkin = new MeshPhongMaterial({
      map: texture,
      specular: new Color(0, 0, 0)
    });
    fbxClone.traverse((child) => {
      if (child.isMesh) {
        child.material = mannySkin;
      }
    });
    const eyes = fbxClone.getObjectByName("Eyes");
    if (eyes !== void 0)
      eyes.frustumCulled = false;
    return fbxClone;
  }, [texture]);
  return manny;
}

function useAnimations(targetObj, animation, animationLibrary) {
  const library = {
    ...DEFAULT_LIBRARY,
    ...animationLibrary
  };
  const [animCache, setAnimCache] = useState();
  const mixer = useMemo(() => new AnimationMixer(targetObj), [targetObj]);
  const actions = useMemo(() => {
    if (animCache === void 0) {
      return void 0;
    }
    return Object.fromEntries(
      Object.entries(animCache).map(([name, clip]) => [
        name,
        mixer.clipAction(clip)
      ])
    );
  }, [animCache]);
  useEffect(() => {
    Object.entries(library).forEach(([animName, { url, async }]) => {
      const alreadyLoaded = animCache?.[animName] !== void 0;
      const notReady = async === true && animation !== animName;
      if (alreadyLoaded || notReady) {
        return;
      }
      const loader = url.endsWith(".fbx") ? new FBXLoader() : new GLTFLoader();
      loader.load(url, (animModel) => {
        const clips = animModel.animations;
        setAnimCache((prev) => ({
          ...prev,
          [animName]: clips[0]
        }));
      });
    });
  }, [animation, library]);
  useFrame((_, delta) => {
    mixer.update(delta);
  });
  return {
    actions,
    mixer
  };
}

function Manny(props = {}) {
  const {
    modelPath = MANNY_MODEL,
    textureUrl = MANNY_TEXTURE,
    animation,
    clamp = false,
    paused = false,
    library
  } = props ?? {};
  const mannyObj = useManny(modelPath, textureUrl);
  const { actions } = useAnimations(mannyObj, animation, library);
  const aKey = animation ?? "";
  const activeAnim = actions?.[aKey];
  useEffect(() => {
    if (activeAnim !== void 0) {
      activeAnim.reset().fadeIn(0.2).play();
    }
    return () => {
      if (activeAnim !== void 0) {
        activeAnim.fadeOut(0.2);
      }
    };
  }, [activeAnim]);
  useEffect(() => {
    if (activeAnim !== void 0) {
      activeAnim.paused = paused;
    }
  }, [activeAnim, paused]);
  useEffect(() => {
    if (activeAnim !== void 0 && clamp) {
      activeAnim.setLoop(2200, 0);
      activeAnim.clampWhenFinished = true;
    }
  }, [activeAnim, clamp]);
  return mannyObj;
}
const animations = Object.keys(DEFAULT_LIBRARY);

export { animations, Manny as default };
