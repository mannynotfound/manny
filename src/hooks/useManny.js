import * as THREE from "three";
import { useMemo } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { MANNY_TEXTURE_DEFAULT, MANNY_MODEL } from "../env";

useFBX.preload(MANNY_MODEL);

function useManny(textureUrl = MANNY_TEXTURE_DEFAULT) {
  const fbx = useFBX(MANNY_MODEL);

  // load manny skin texture
  const texture = useTexture(textureUrl);
  texture.encoding = THREE.sRGBEncoding;

  const manny = useMemo(() => {
    fbx.name = `manny-${textureUrl}`;

    // create new manny skin material
    const mannySkin = new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color(0, 0, 0),
    });

    // overwrite body mesh texture
    const ogMain = fbx.children[0];
    ogMain.material = mannySkin;

    // overwrite eye mesh texture
    const ogEyes = fbx.children[2];
    ogEyes.material = mannySkin;

    return fbx;
  }, [texture]);

  return manny;
}

export default useManny;
