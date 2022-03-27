<script lang="ts">
  import * as THREE from 'three';
  import * as SC from 'svelte-cubed';
  import SPE from 'shader-particle-engine';

  let init = false;
  let clock = new THREE.Clock();
  var loader = new THREE.TextureLoader();
  var url = 'img/cloudSml.png';
  var texture = loader.load(url);

  var particleGroup = new SPE.Group({
    texture: {
      value: texture
    },
    blending: THREE.NormalBlending
  });

  var crashemitter = new SPE.Emitter({
    maxAge: { value: 8 },
    position: {
      value: new THREE.Vector3(0, 0, 0),
      spread: new THREE.Vector3(0.5, 0.5, 0.5)
    },
    size: {
      value: [2, 4],
      spread: [0, 1, 2]
    },
    acceleration: {
      value: new THREE.Vector3(0, 0, 0)
    },
    rotation: {
      axis: new THREE.Vector3(0, 1, 0),
      spread: new THREE.Vector3(0, 20, 0),
      angle: (100 * Math.PI) / 180
    },
    velocity: {
      value: new THREE.Vector3(0, 0.5, -0.5),
      spread: new THREE.Vector3(0.25, 0.1, 0.25)
    },
    opacity: {
      value: [0.2, 0.5, 0]
    },
    color: {
      value: [new THREE.Color(0x333333), new THREE.Color(0x111111)],
      spread: [new THREE.Vector3(0.2, 0.1, 0.1), new THREE.Vector3(0, 0, 0)]
    },
    particleCount: 100
  });
  particleGroup.addEmitter(crashemitter);
  init = true;
  SC.onFrame(() => {
    particleGroup.tick(clock.getDelta());
  });
</script>

{#if init}
  <SC.Primitive object={particleGroup.mesh} position={[-1.25, 3.4, 0]} />
{/if}
