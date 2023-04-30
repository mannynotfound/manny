import { useEffect } from 'react';
import type { Object3D } from 'three';
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

// calling manny with no args
function Manny(): Object3D;
// calling manny with no animation args
function Manny(args: BaseProps): Object3D;
// calling manny with a default animationn
function Manny(args: DefaultAnimationProps): Object3D;
// calling manny with a custom animation
function Manny<T extends AnimationLibrary>(props: Props<T>): Object3D;
function Manny<T extends AnimationLibrary>(
  props: Partial<Props<T>> = {}
): Object3D {
  const {
    modelPath = MANNY_MODEL,
    textureUrl = MANNY_TEXTURE,
    animation,
    clamp = false,
    paused = false,
    library,
  } = props ?? {};
  const mannyObj = useManny(modelPath, textureUrl);
  const { actions } = useAnimations(mannyObj, animation, library);
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

  return mannyObj;
}

export default Manny;

export const animations = Object.keys(DEFAULT_LIBRARY);
