import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import * as THREE from 'three';
const DRACO_LOADER = new DRACOLoader().setDecoderPath(`three/examples/js/libs/draco/gltf/` );

const loader = new GLTFLoader().setDRACOLoader( DRACO_LOADER );

export const loadGLTF = async (path, castShadow = true) => {
  let gltf = await loader.loadAsync(
    path,
    function (xhr) {
      console.log(path + " " + (xhr.loaded / xhr.total) * 100 + '% loaded');
    },
  );

  if (castShadow){
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh
          m.receiveShadow = true
          m.castShadow = true
          if(m.material.map) m.material.map.encoding = THREE.sRGBEncoding
          if(m.material.emmisiveMap) m.material.emmisiveMap.encoding = THREE.sRGBEncoding
          m.material.needsUpdate = true;
          m.material.metalness = 0
      }
    })
  }
  const clips = gltf.animations.reduce((clips, clip) => ({...clips, [clip.name]: clip}), {});
  
  return {...gltf, clips}
} 
  export const randomPoint = () => Math.random() * 50 - 25;
  export const toCurve = (points) => new THREE.CatmullRomCurve3(points, false, 'centripetal', 0);
  export const toPoint = (p) => new THREE.Vector3(p.x, 0, p.y);
// keeps v between -min and +min
  export function minMagnitude(v, min) {
    return Math.abs(v) > min
        ? min * Math.sign(v)
        : v;
  }

   
  export function aimTowardAndGetDistance(source, targetPos, maxTurn) {
    const delta = new THREE.Vector3();
    
    delta.subVectors(targetPos, source.position);
    // compute the direction we want to be facing
    const targetY = Math.atan2(delta.x, delta.z) + Math.PI * 1.5;
    // rotate in the shortest direction
    const deltaY = (targetY - source.rotation.y + Math.PI * 1.5) % (Math.PI * 2) - Math.PI;
    // make sure we don't turn faster than maxTurn
    const deltaRotation = minMagnitude(deltaY, maxTurn);
    // keep rotation between 0 and Math.PI * 2
    source.rotation.y = THREE.Math.euclideanModulo(
      source.rotation.y + deltaRotation, 
      Math.PI * 2
    );
    // return the rotation to the target
    return source.rotation;
  };
  // function fadeToAction(name, duration) {
  //   previousAction = activeAction;
  //   activeAction = actions[name];
  //   if (previousAction !== activeAction) {
  //     previousAction.fadeOut(duration);
  //   }
  //   activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
  // }