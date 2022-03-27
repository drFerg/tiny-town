<script>
  import * as THREE from 'three';
  import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
  import * as SC from 'svelte-cubed';
  import Tree from '$lib/Tree.svelte';
  import Forest from '$lib/Forest.svelte';
  import River from '$lib/River.svelte';
  import Hut from '$lib/Hut.svelte';
  import Smoke from '$lib/Smoke.svelte';
  import Sky from '$lib/Sky.svelte';
  import Grass from '$lib/Grass.svelte';
  import Animal, { Type } from '$lib/Animal.svelte';
  import { Color } from '$lib/shared';
  import { randomPoint, toCurve, toPoint } from '$lib/utils';

  let clock = new THREE.Clock();
  let elapsedTime = clock.getElapsedTime();
  let time = 0;

  let width = 1;
  let height = 3;
  let intensity = 1;
  let count = 2;
  let points = [];
  let trees = 3;

  $: points = Array.from({ length: count }, (v, i) => ({
    x: randomPoint(),
    y: randomPoint()
  }));

  let boxPosition = new THREE.Vector3(0, -0.5, 0);
  let x = -40;
  let y = 50;
  let z = 40;

  const toPath = (start, end) => {
    const path = new THREE.Path();

    path.lineTo(start.x, start.y);
    path.quadraticCurveTo(0, 1, 0.2, 1);
    path.lineTo(end.x, end.y);

    return path;
  };

  $: curve = toCurve(points.map((p) => toPoint(p)));

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

    // Extrude the triangle along the CatmullRom curve
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };
  var prevTime = Date.now();
  let frames = 0;

  SC.onFrame(() => {
    time += clock.getDelta();

    elapsedTime = clock.getElapsedTime();

    // const timer = Date.now() * 0.000025;

    // const tankTime = timer * 0.1;
    // boxPosition = curve.getPointAt(tankTime % 1);
    // frames++;

    // var time = Date.now();

    // if (time >= prevTime + 1000) {
    //   console.log((frames * 1000) / (time - prevTime), 100);
    //   prevTime = time;
    //   frames = 0;
    // }
  });
</script>

<SC.Canvas
  antialias
  shadows
  effect={OutlineEffect}
  outputEncoding={THREE.sRGBEncoding}
  physicallyCorrectLights={true}
  toneMapping={THREE.ACESFilmicToneMapping}
  background={Color('white')}
>
  <!-- Camera and controls -->
  <SC.PerspectiveCamera position={[1, 1, 3]} />
  <SC.OrbitControls enableZoom={true} maxPolarAngle={Math.PI * 0.51} />

  <!-- Floor -->
  <SC.Group position={[0, 0, 0]}>
    <SC.Mesh
      geometry={new THREE.PlaneGeometry(50, 50)}
      material={new THREE.MeshToonMaterial({ color: Color('darkgreen') })}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    />
    <SC.Primitive
      object={new THREE.GridHelper(50, 50, 0x444444, 0x555555)}
      position={[0, 0.001, 0]}
    />
  </SC.Group>

  <Sky {intensity}/>
  <Forest count={trees} width={25} />
  <River />
  <Smoke />
  <Hut position={[0, 0.01, 0]} />
  {#each Array(500) as _, i}
    <Grass center={new THREE.Vector3(randomPoint(), 0, randomPoint())}/>
  {/each}

  {#each Array(trees) as _, i}
    <Animal name={"Alpaca " + i} type={Type.horse} state={"Idle"} position={{x: randomPoint(), y: 0, z: randomPoint()}}
    {elapsedTime} {time} />
  {/each}

  <Animal name={"Fox"} type={Type.fox} state={"Idle"} position={{x: randomPoint(), y: 0, z: randomPoint()}}
  {elapsedTime} {time}/>

  <!-- Boxes -->
  {#each points as point, i}
    {#if i != 0}
      <SC.Line
        geometry={new THREE.BufferGeometry()}
        points={[toPoint(points[i - 1]), toPoint(point)]}
      />
    {/if}
    <SC.Line geometry={new THREE.BufferGeometry()} points={points.map((p) => toPoint(p))} />
  {/each}

  <Tree position={[boxPosition.x, boxPosition.z]} />
  <SC.Mesh
    position={[boxPosition.x, boxPosition.y, boxPosition.z]}
    geometry={new THREE.BoxGeometry()}
    material={new THREE.MeshToonMaterial({ color: Color(0xff3e00) })}
    castShadow
  />
</SC.Canvas>

<div class="controls">
  <label><input type="range" bind:value={width} min={0.1} max={3} step={0.1} /> width</label>
  <label><input type="range" bind:value={height} min={0.1} max={3} step={0.1} /> height</label>
  <label><input type="range" bind:value={intensity} min={0.1} max={3} step={0.1} /> intensity</label>
  <label><input type="range" bind:value={count} min={1} max={30} step={1} /> count</label>

  <label><input type="range" bind:value={x} min={1} max={100} step={1} /> x</label>
  <label><input type="range" bind:value={y} min={1} max={100} step={1} /> y</label>
  <label><input type="range" bind:value={z} min={1} max={100} step={0.1} /> z</label>

  <label><input type="range" bind:value={trees} min={1} max={100} step={1} /> trees</label>
</div>

<style>
  .controls {
    position: absolute;
  }
</style>
