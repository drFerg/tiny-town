<script lang="ts">
    import * as SC from 'svelte-cubed';
    import { MeshLine, MeshLineMaterial } from 'three.meshline';
    import * as THREE from 'three';


    export let center: THREE.Vector3 = new THREE.Vector3(5, 0, 5);

    let p = (center) => center - 0.5 + (Math.random() * 1);
    
    let points = Array.from({length: 3}, (v, i) => ([p(center.x),  0.3, p(center.z)]));

    const lines = points.map(() => new MeshLine());
    lines.map((line, i) => {line.setPoints([center.x, center.y, center.z,  ...points[i]], (p) =>  1/(0.1 + p))});
    const material = new MeshLineMaterial({color: "green", lineWidth: 0.02});

</script>

{#each lines as line}
    <SC.Mesh geometry={line} {material}/>
{/each}
