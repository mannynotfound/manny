import { useEffect } from 'react';
import type { AnimationAction, AnimationMixer, Object3D } from 'three';
import { AnimationLibrary, DefaultLibrary } from './fixtures/animations';
import { DEFAULT_LIBRARY } from './fixtures/animations';
import { useAnimations, useManny } from './hooks';
import { MANNY_MODEL, MANNY_TEXTURE } from './constants';

interface BaseProps {
  modelPath?: string;
  textureUrl?: string;
}

interface AnimationProps extends BaseProps {
  paused?: boolean;
  clamp?: boolean;
}

interface DefaultAnimationProps extends AnimationProps {
  animation: keyof DefaultLibrary;
}

interface Props<T extends AnimationLibrary> extends AnimationProps {
  animation: Extract<keyof T, string>;
  library: T;
}

type MannyReturn = {
  manny: Object3D;
  actions: Record<string, AnimationAction> | undefined;
  mixer: AnimationMixer;
};

// calling manny with no args
function Manny(): MannyReturn;
// calling manny with no animation args
function Manny(args: BaseProps): MannyReturn;
// calling manny with a default animationn
function Manny(args: DefaultAnimationProps): MannyReturn;
// calling manny with a custom animation
function Manny<T extends AnimationLibrary>(props: Props<T>): MannyReturn;
function Manny<T extends AnimationLibrary>(
  props: Partial<Props<T>> = {}
): MannyReturn {
  const {
    modelPath = MANNY_MODEL,
    textureUrl = MANNY_TEXTURE,
    animation,
    clamp = false,
    paused = false,
    library,
  } = props ?? {};
  const mannyObj = useManny(modelPath, textureUrl);
  const { actions, mixer } = useAnimations(mannyObj, animation, library);
  const aKey = animation ?? '';
  const activeAnim = actions?.[aKey];

  useEffect(() => {
    if (activeAnim !== undefined) {
      activeAnim.reset().fadeIn(0.2).play();
    }

    return () => {
      if (activeAnim !== undefined) {
        activeAnim.fadeOut(0.2);
      }
    };
  }, [activeAnim]);

  useEffect(() => {
    if (activeAnim !== undefined) {
      activeAnim.paused = paused;
    }
  }, [activeAnim, paused]);

  useEffect(() => {
    if (activeAnim !== undefined) {
      const loop = clamp ? 2200 : 2201; // LoopOnce : LoopRepeat
      const repetitions = clamp ? 0 : Infinity;
      activeAnim.setLoop(loop, repetitions);
      activeAnim.clampWhenFinished = clamp;
    }
  }, [activeAnim, clamp]);

  return {
    manny: mannyObj,
    actions,
    mixer,
  };
}

export default Manny;

export const animations = Object.keys(DEFAULT_LIBRARY);
