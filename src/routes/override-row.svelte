<script lang="ts">
  import Trash from '$components/icons/trash.svelte';
  import Input from '$components/input.svelte';
  import MinimalButton from '$components/minimal-button.svelte';
  import type { Override } from '$lib/color';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ delete: undefined }>();

  export let number: number;
  export let override: Override;
</script>

<div class="mt-3">
  <div class="flex items-center justify-between mb-1 text-sm">
    <p>Override {number}</p>
    <MinimalButton on:click={() => dispatch('delete')}>
      <Trash class="text-pink-500" />
    </MinimalButton>
  </div>
  <div class="grid grid-cols-3 gap-2">
    <div>
      <Input type="number" placeholder="Scale" bind:value={override.scale} min={0} max={99} />
    </div>
    <div>
      <Input
        type="number"
        placeholder="C"
        bind:value={override.chroma}
        step={0.001}
        min={0}
        max={0.37}
      />
    </div>
    <div>
      <Input
        type="number"
        placeholder="L"
        bind:value={override.lightness}
        step={0.01}
        min={0}
        max={1}
      />
    </div>
  </div>
</div>
