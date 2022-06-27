import * as THREE from "three";
import { useMemo } from "react";
import { useFBX, useTexture } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

function useManny(modelPath, textureUrl) {
  const fbx = useFBX(modelPath);

  const texture = useTexture(textureUrl);
  texture.encoding = THREE.sRGBEncoding;

  const manny = useMemo(() => {
    const fbxClone = clone(fbx);
    fbxClone.name = `manny-${textureUrl}`;

    const mannySkin = new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color(0, 0, 0),
    });

    fbxClone.traverse((child) => {
      if (child.isMesh) {
        child.material = mannySkin;
      }
    });

    return fbxClone;
  }, [texture]);

  return manny;
}

export default useManny;
