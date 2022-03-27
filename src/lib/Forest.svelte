<script lang="ts">
  import Tree from "./Tree.svelte";

  export let count = 10;
  export let width = 50;
  export let padding = 10;

  $: points = Array.from({length: count}, (v, i) => ({x: (Math.random() * 50) - 25, z: (Math.random() * 50) - 25}));
  
  // $: points = Array.from({length: count}, (v, i) => -width + (padding * i))
</script>

{#each points as {x,z}}
    <Tree position={[x, z]}/>
{/each}