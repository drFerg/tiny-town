<script lang="ts">
  import * as THREE from 'three';
  import * as SC from 'svelte-cubed';
  import { treetrunkMaterial } from './shared';

  export let position;
  $: ([x, z] = position);

  const trunkRadius = .2;
  const trunkHeight = 4;
  const trunkRadialSegments = 12;


</script>

<SC.Primitive
 object={new THREE.Object3D()}
 position={[x, 0, z]}
>
  <SC.Mesh
    receiveShadow
    rotation={[ -90 * (Math.PI / 180),  0, 0]}
    position={[0,0.01,0]}
    geometry={new THREE.CircleBufferGeometry(3, 72)}
    material={new THREE.MeshToonMaterial({ side: THREE.DoubleSide, color: new THREE.Color("burlywood") })}
  />
  <!-- Top -->
  <!-- left -->
  {#each Array(5) as _, i}
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[-2, trunkRadius / 2 + trunkRadius * i * 1.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    />
  {/each}

  <!-- Right -->
  {#each Array(5) as _, i}
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[2, trunkRadius / 2 + trunkRadius * i * 1.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    />
    {/each}

  {#each Array(5) as _, i}
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[0, trunkRadius / 2 + trunkRadius * i * 1.5, 2]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      castShadow
    />
  {/each}

  {#each Array(5) as _, i}
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[0, trunkRadius / 2 + trunkRadius * i * 1.5, -2]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      castShadow
    />
  {/each}

  <!-- ROOF -->
  {#each Array(10) as _, i}
    <!-- LEFT/RIGHT -->
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[-2 + i*trunkRadius, trunkRadius * 6 + trunkRadius * i, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    />
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[2 - i*trunkRadius, trunkRadius * 6 + trunkRadius * i, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    />

    <!-- FRONT/BACK -->
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight - i/2.5, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[0, trunkRadius * 6 + trunkRadius * i, -2]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      castShadow
    />
        <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight - i/2.5, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[0, trunkRadius * 6 + trunkRadius * i, 2]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      castShadow
    />
  {/each}

  {#each Array(10) as _, i}
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius/2, trunkRadius/2, trunkHeight/8, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[-1 + trunkRadius, trunkRadius * 8 + trunkRadius * i, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    />
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius/2, trunkRadius/2, trunkHeight/8, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[-1.5 + trunkRadius, trunkRadius * 8 + trunkRadius * i, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
    />
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius/2, trunkRadius/2, trunkHeight/8, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[-1.25 + trunkRadius, trunkRadius * 8 + trunkRadius * i, .25]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      castShadow
    />
    <SC.Mesh
      geometry={new THREE.CylinderGeometry(trunkRadius/2, trunkRadius/2, trunkHeight/8, trunkRadialSegments)}
      material={treetrunkMaterial}
      position={[-1.25 + trunkRadius, trunkRadius * 8 + trunkRadius * i, -.25]}
      rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      castShadow
    />
  {/each}
</SC.Primitive>
