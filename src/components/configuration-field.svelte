<script lang="ts">
  import Reset from '$components/icons/reset.svelte';
  import MinimalButton from '$components/minimal-button.svelte';
  import { createEventDispatcher } from 'svelte';

  export let id: string;
  export let label: string;
  export let value: number | undefined = undefined;
  export let description: string | undefined = undefined;

  const dispatch = createEventDispatcher<{ reset: undefined }>();
</script>

<div>
  <div class="flex items-center justify-between mb-1 text-sm">
    <label for={id}>
      {label}{#if value !== undefined}: <span class="tabular-nums font-mono opacity-50"
          >{value}</span
        >{/if}
    </label>
    <MinimalButton on:click={() => dispatch('reset')}>
      <Reset />
    </MinimalButton>
  </div>
  <slot />
  {#if description}
    <span class="block mt-2 text-xs text-gray-400">{description}</span>
  {/if}
</div>
