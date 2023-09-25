<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import EditCurveInput from './edit-curve-input.svelte';
  import Pencil from './icons/pencil.svelte';
  import Plus from './icons/plus.svelte';
  import Trash from './icons/trash.svelte';
  import MinimalButton from './minimal-button.svelte';

  const dispatch = createEventDispatcher<{ create: undefined; delete: number }>();

  export let curve: number[];
</script>

<div class="bg-black text-white rounded-xl shadow-lg border border-white/10">
  <div class="flex items-center justify-between border-b border-white/10 p-3">
    <h3 class="text-sm flex items-center gap-1">
      <Pencil class="opacity-50" width="15px" height="15px" />
      Edit Curve
    </h3>

    <MinimalButton
      on:click={() => {
        dispatch('create');
      }}
    >
      <Plus />
    </MinimalButton>
  </div>

  <div class="flex items-center gap-2 overflow-auto p-3 w-full">
    {#each curve as _, i}
      <div class="flex flex-col items-center gap-2 w-6">
        <input
          class="tabular-nums text-[10px] bg-transparent p-0 appearance-none w-[22px] outline-none focus:ring-2 ring-white/20 rounded-sm transition-all text-center"
          bind:value={curve[i]}
        />
        <EditCurveInput bind:value={curve[i]} />
        <MinimalButton
          disabled={curve.length <= 4}
          on:click={() => {
            dispatch('delete', i);
          }}
        >
          <Trash />
        </MinimalButton>
      </div>
    {/each}
  </div>
</div>
