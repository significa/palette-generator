<script lang="ts">
  import Reset from '$components/icons/reset.svelte';
  import { createEventDispatcher } from 'svelte';

  export let id: string;
  export let value: number;
  export let label: string;
  export let description: string | undefined = undefined;

  const dispatch = createEventDispatcher<{ reset: undefined }>();
</script>

<div>
  <div class="flex items-center justify-between mb-1 text-sm">
    <label for={id}>
      {label}:
      <span class="tabular-nums font-mono opacity-50">{value}</span>
    </label>
    <button
      on:click={() => dispatch('reset')}
      class="text-gray-500 transition-all hover:text-gray-800 focus-visible:text-gray-800 outline-none ring-black/5 focus-visible:ring-4 rounded-md"
    >
      <Reset />
    </button>
  </div>
  <slot />
  {#if description}
    <span class="block mt-2 text-xs text-gray-400">{description}</span>
  {/if}
</div>
