<script lang="ts">
  import * as THREE from 'three';

  import * as SC from 'svelte-cubed';
  import { Color } from './shared';

  export let intensity = 0.5;
  let light = [];

  SC.onFrame(() => {
    const timer = Date.now() * 0.000025;
    light = [0, timer * 0.01, timer];
  });
</script>

<!-- Lighting -->
<!-- <SC.AmbientLight intensity={1.5} /> -->
<SC.HemisphereLight intensity={3} color={Color(0xB1E1FF)} groundColor={Color(0xB97A20)} />
<SC.Group rotation={light}>
  <SC.Mesh
    geometry={new THREE.SphereGeometry( 2, 4, 4 )}
    material={new THREE.MeshBasicMaterial({ color: 0xffffff })}
    position={[0, 30, 0]}
  >
  <SC.DirectionalLight shadow={{ mapSize: [2048, 2048], camera: { left : -150, bottom : -150, right : 150, top : 150, near : 0.5, far : 500 } }} intensity={intensity * Math.PI} decay={1} target={[0,0,0]}/>
 </SC.Mesh>

 <SC.Mesh
    geometry={new THREE.SphereGeometry( 2, 4, 4 )}
    material={new THREE.MeshBasicMaterial({ color: Color("yellow") })}
    position={[0, -30, 0]}
  >
  <SC.DirectionalLight shadow={{ mapSize: [2048, 2048], camera: { left : -150, bottom : -150, right : 150, top : 150, near : 0.5, far : 500 } }} intensity={intensity * 2 * Math.PI} decay={0.5} target={[0,0,0]}/>
 </SC.Mesh>
</SC.Group>