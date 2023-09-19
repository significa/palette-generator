<script lang="ts">
  import SmallButton from '$lib/small-button.svelte';
  import Copy from '$lib/icons/copy.svelte';
  import Trash from '$lib/icons/trash.svelte';

  export let color: string;
</script>

<div class="p-1">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2 font-mono text-sm opacity-50">
      <p>Color: {color}</p>
      /
      <p>Lightness: 70</p>
      /
      <p>Chroma: 0.1</p>
      /
      <p>Hue: 301</p>
    </div>
    <div class="flex items-center gap-2">
      <SmallButton>
        <Copy class="opacity-40" width="16px" height="16px" />
        Copy SVG
      </SmallButton>
      <SmallButton>
        <Trash class="opacity-40" width="16px" height="16px" />
        Delete
      </SmallButton>
    </div>
  </div>
  <div class="flex overflow-hidden rounded-md mt-2">
    {#each Array(12) as i}
      <div class="flex-1 aspect-square" style="background-color: {color}" />
    {/each}
  </div>
</div>
