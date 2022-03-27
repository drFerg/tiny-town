<script lang="ts">
  import * as THREE from 'three';
  import * as SC from 'svelte-cubed';
  import { treeTopMaterial, treetrunkMaterial } from './shared';

  export let position;
  $: ([x, z] = position);

  const trunkRadius = .2;
  const trunkHeight = 1;
  const trunkRadialSegments = 12;
  const topRadius = trunkRadius * 4;
  const topHeight = trunkHeight * 2;
  const topSegments = 12;

</script>

<SC.Primitive
 object={new THREE.Object3D()}
 position={[x, 0, z]}
>
  <!-- Top -->
  <SC.Mesh
    geometry={new THREE.ConeGeometry(topRadius, topHeight, topSegments)}
    material={treeTopMaterial}
    position={[0, trunkHeight + topHeight / 2, 0]}
    castShadow
  />
  <!-- Trunk -->
  <SC.Mesh
    geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments)}
    material={treetrunkMaterial}
    position={[0, trunkHeight / 2, 0]}
    castShadow
  />
</SC.Primitive>
