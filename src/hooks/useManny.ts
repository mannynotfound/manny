import { useMemo } from 'react';
import { useFBX, useTexture } from '@react-three/drei';
import { Color, Mesh, MeshPhongMaterial, sRGBEncoding } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

function useManny(modelPath: string, textureUrl: string) {
  const fbx = useFBX(modelPath);

  const texture = useTexture(textureUrl);
  texture.encoding = sRGBEncoding;

  const manny = useMemo(() => {
    const fbxClone = clone(fbx);
    fbxClone.name = `manny-${textureUrl}`;

    const mannySkin = new MeshPhongMaterial({
      map: texture,
      specular: new Color(0, 0, 0),
    });

    fbxClone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        (child as Mesh).material = mannySkin;
      }
    });

    const eyes = fbxClone.getObjectByName('Eyes');
    if (eyes !== undefined) eyes.frustumCulled = false;

    return fbxClone;
  }, [texture]);

  return manny;
}

export default useManny;
