<script lang="ts">
  import chroma from 'chroma-js';
  import { createEventDispatcher } from 'svelte';

  import { cn } from '$lib/utils';
  import { getC, getH, getL, getOklch, type OKLCH } from '$lib/color';
  import { copyToClipboard } from '$lib/clipboard';
  import { paletteToSvg } from '$lib/svg';

  import SmallButton from '$components/small-button.svelte';
  import Copy from '$components/icons/copy.svelte';
  import Trash from '$components/icons/trash.svelte';

  const dispatch = createEventDispatcher<{ delete: string }>();

  export let color: string;
  export let palette: OKLCH[];

  $: oklch = chroma(color).oklch();
</script>

<div class="p-2 bg-white border rounded-xl shadow-sm">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div
        class="border border-black/10 rounded-md w-6 h-6"
        style="background-color: {getOklch(...oklch)};"
      />
      <SmallButton
        on:click={() => {
          copyToClipboard(color);
        }}
      >
        <Copy class="opacity-50" width="16px" height="16px" />
        {color}
      </SmallButton>

      <SmallButton
        on:click={() => {
          copyToClipboard(getOklch(...oklch));
        }}
      >
        <Copy class="opacity-50" width="16px" height="16px" />
        {getOklch(...oklch)}
      </SmallButton>
    </div>
    <div class="flex items-center gap-2">
      <SmallButton
        on:click={() => {
          copyToClipboard(paletteToSvg(palette));
        }}
      >
        <Copy class="opacity-50" width="16px" height="16px" />
        Copy SVG
      </SmallButton>
      <SmallButton
        on:click={() => {
          dispatch('delete', color);
        }}
      >
        <Trash class="opacity-50" width="16px" height="16px" />
        Delete
      </SmallButton>
    </div>
  </div>
  <div class="flex rounded-md mt-2 border border-black/10">
    {#each palette as [l, c, h], i}
      <button
        on:click={() => {
          copyToClipboard(getOklch(l, c, h));
        }}
        class={cn(
          'group flex-1 h-32 bg-[--square-color] text-[10px] leading-tight flex flex-col justify-between gap-0.5 items-start p-3 text-left transition-all outline-none',
          i === 0 && 'rounded-l-md',
          i === palette.length - 1 && 'rounded-r-md',
          oklch[0] === l && 'scale-110 rounded-md shadow-lg border',
          l >= 0.6
            ? 'border-black/10 text-black/60 hover:text-black focus-visible:text-black'
            : 'border-white/10 text-white/60 hover:text-white focus-visible:text-white'
        )}
        style="--square-color: {getOklch(l, c, h)}"
      >
        <div class="flex items-center justify-between w-full">
          <span class="tabular-nums">{i + 1}</span>
          <Copy class="opacity-0 group-hover:opacity-100 transition-all" />
        </div>
        <div class="flex flex-col gap-0.5 font-mono">
          <span>L{getL(l)}</span>
          <span>C{getC(c)}</span>
          <span>H{getH(h)}</span>
        </div>
      </button>
    {/each}
  </div>
</div>
