import useManny from "./hooks/useManny";
import useAnimations from "./hooks/useAnimations";
import { CLIPS_HOST } from "./env";

const ANIMATION_PATHS_DEFAULT = {
  tPose: `${CLIPS_HOST}/t-pose.fbx`,
  bored: `${CLIPS_HOST}/bored.fbx`,
};

const Manny = ({ textureUrl, animationOptions }) => {
  const mannyObj = useManny(textureUrl);
  const { paths, active, fadeIn, fadeOut } = animationOptions ?? {};
  const { actions } = useAnimations(mannyObj, paths ?? ANIMATION_PATHS_DEFAULT);

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
