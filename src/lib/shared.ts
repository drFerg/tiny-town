import * as THREE from 'three';

/** @type {import('three').BufferGeometry} */
export let geometry = new THREE.BufferGeometry();

export function Color(colour) {
    let _colour = new THREE.Color(colour);
    _colour.convertSRGBToLinear();
    return _colour
}
const green = new THREE.Color('green');
green.convertSRGBToLinear();

const brown = new THREE.Color('brown');
brown.convertSRGBToLinear();

/** @type {import('three').Material} */
export let treeTopMaterial = new THREE.MeshToonMaterial({ color: green });

export let treetrunkMaterial = new THREE.MeshToonMaterial({ color: brown })


