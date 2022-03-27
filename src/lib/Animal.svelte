<script lang="ts" context="module">
  export enum Type {
    alpaca = "Alpaca",
    fox = "Fox",
    horse = "Horse",
  };

  // const _states = ['Idle', 'Walk', 'Gallop', 'Death', 'Eat'];
</script>

<script lang="ts">
  import * as THREE from 'three';

  import * as SC from 'svelte-cubed';
  import { loadGLTF } from './utils';
  import { createFSM, foxStates, states, type FSM } from './fsm';
  import { world } from './world';

  export let name = 'Fox';
  export let type = Type.alpaca;
  export let position = { x: 0, y: 0, z: 0 };
  export let elapsedTime = 0;
  export let time = 0;
  
  const animalStates = {
    Fox: foxStates,
    Alpaca: states,
    Horse: states
  };
  let model = undefined;
  let clip = '';


  loadGLTF(`model/${type}.gltf`).then((gltf) => (model = gltf));
  // $: if (model) console.log(state, model.clips)

  const fsm = createFSM(name, animalStates[type], 'idle', 0, position);

  world.add(name, fsm);
  $: fsm.tick(elapsedTime);


  $: if (model && $fsm.state.clipName && clip != $fsm.state.clipName) {
    clip = $fsm.state.clipName;
  }
  $: ({ x, y, z } = $fsm.position);

</script>

{#if model}
  <SC.Primitive
    object={model.scene}
    rotation={[$fsm.rotation.x, $fsm.rotation.y, $fsm.rotation.z]}
    position={[x, y, z]}
    scale={[0.3, 0.3, 0.3]}
  >
    {#if clip}
      <SC.Animation clip={model.clips[clip]} fadeDuration={2} {time} />
    {/if}
  </SC.Primitive>
{/if}
