import { useEffect } from "react";
import { useManny, useAnimations } from "./hooks";
import { CLIPS_HOST, MANNY_TEXTURE, MANNY_MODEL } from "./constants";

const ANIMATION_PATHS = {
  idle: `${CLIPS_HOST}/idle.glb`,
};

const Manny = (props) => {
  const modelPath = props?.modelPath ?? MANNY_MODEL;
  const textureUrl = props?.textureUrl ?? MANNY_TEXTURE;
  const mannyObj = useManny(modelPath, textureUrl);
  const { paths, active, fadeIn, fadeOut } = props?.animationOptions ?? {};
  const { actions } = useAnimations(mannyObj, paths ?? ANIMATION_PATHS);

  useEffect(() => {
    actions?.[active]
      ?.reset()
      .fadeIn(fadeIn ?? 0.2)
      .play();

    return () => {
      actions?.[active]?.fadeOut(fadeOut ?? 0.2);
    };
  }, [active, actions]);

  return mannyObj;
};

export default Manny;
