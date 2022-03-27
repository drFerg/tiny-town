<script lang="ts">
  import * as THREE from 'three';

  import * as SC from 'svelte-cubed';
  import { Color } from './shared';

  export let width = 25;
  export let padding = 10;
  var loader = new THREE.TextureLoader();
  let strokeTexture;
  loader.load('static/img/stroke.png', function (texture) {
    strokeTexture = texture;
  });

  let grid = [];
  for (let i = -width; i < width; i += padding) {
    let z = -width + Math.random() * width * 1.9;
    grid.push(new THREE.Vector3(i, 0.01, z));
    grid.push(new THREE.Vector3(i + padding, 0.01, z));
  }

  const toCurve = (points) => new THREE.CatmullRomCurve3(points, false, 'centripetal', 0);

  const length = 0,
    w = 1;

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, w);
  shape.lineTo(length, w);
  shape.lineTo(length, 0);
  shape.lineTo(0, 0);

  const road = (line) => {
    // Set up settings for later extrusion
    var extrudeSettings = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: line,
      curveSegments: 24
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };
  // SC.onFrame(() => {
  //   var t = clock.getElapsedTime();
  //   material.uniforms.lineWidth.value = lineWidth * ( 1 + .5 * Math.sin( 5 * t ) );
  // });
</script>

<SC.Mesh geometry={road(toCurve(grid))} material={new THREE.MeshToonMaterial({ color: Color("turquoise")})} />
