<script lang="ts">
  import chroma from 'chroma-js';
  import { createEventDispatcher } from 'svelte';

  import { cn, downloadFile, paletteToJSON } from '$lib/utils';
  import { getC, getH, getL, getOklch } from '$lib/color';
  import { copyToClipboard } from '$lib/clipboard';
  import { paletteToSvg } from '$lib/svg';

  import SmallButton from '$components/small-button.svelte';
  import Copy from '$components/icons/copy.svelte';
  import Trash from '$components/icons/trash.svelte';
  import Download from '$components/icons/download.svelte';
  import type { OKLCH } from '$lib/types';

  const dispatch = createEventDispatcher<{ delete: string }>();

  export let color: string;
  export let palette: OKLCH[];
  export let colorIndex: number;

  $: oklch = chroma(color).oklch();
</script>

<div class="bg-white lg:border lg:rounded-xl lg:shadow-sm border-b">
  <div class="flex items-center justify-between p-2 lg:p-3 pb-0 lg:pb-0">
    <div class="flex items-center gap-2">
      <div
        class="border border-black/10 rounded-md w-6 h-6"
        style="background-color: {getOklch(...oklch)};"
      />
      <SmallButton
        class="hidden sm:inline-flex"
        on:click={() => {
          copyToClipboard(color, { id: color });
        }}
      >
        <Copy class="opacity-50" width="16px" height="16px" />
        {color}
      </SmallButton>

      <SmallButton
        class="hidden lg:inline-flex"
        on:click={() => {
          copyToClipboard(getOklch(...oklch), { id: `${color}-oklch` });
        }}
      >
        <Copy class="opacity-50" width="16px" height="16px" />
        {getOklch(...oklch)}
      </SmallButton>
    </div>
    <div class="flex items-center gap-2">
      <SmallButton
        class="hidden lg:inline-flex"
        on:click={() => {
          if (palette) {
            downloadFile(
              JSON.stringify(paletteToJSON(`${color} Palette`, palette), null, 2),
              `${color}.json`
            );
          }
        }}
      >
        <Download class="opacity-50" width="16px" height="16px" />
        Download JSON
      </SmallButton>
      <SmallButton
        class="hidden lg:inline-flex"
        on:click={() => {
          if (palette) {
            copyToClipboard(paletteToSvg(palette), { id: `${color}-svg` });
          }
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
  <div class={cn('flex mt-2 overflow-auto p-2 pt-1', 'lg:p-3 lg:pt-2')}>
    {#each palette as [l, c, h], i}
      <button
        on:click={() => {
          copyToClipboard(chroma.oklch(l, c, h).hex(), { id: `${color}-hex-${i}` });
        }}
        class={cn(
          'group flex-1 bg-[--square-color] transition-all outline-none border border-r-0 last:border-r lg:border-0',
          i === 0 && 'rounded-l-md',
          i === palette.length - 1 && 'rounded-r-md',
          colorIndex === i && 'scale-105 rounded-md shadow-lg border lg:border',
          l >= 0.6
            ? 'border-black/10 text-black/50 hover:text-black focus-visible:text-black'
            : 'border-white/10 text-white/50 hover:text-white focus-visible:text-white',
          'h-24 lg:h-32'
        )}
        style="--square-color: {getOklch(l, c, h)}"
      >
        <div
          class="h-full flex flex-col justify-between gap-0.5 items-start p-3 text-left text-[10px] leading-tight"
        >
          <div class="flex items-center justify-between w-full">
            <span class="tabular-nums">{i + 1}</span>
            <Copy class="opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <div
            class="flex flex-col gap-0.5 font-mono pr-2 opacity-0 group-hover:opacity-100 transition-all"
          >
            <span>L{getL(l)}</span>
            <span>C{getC(c)}</span>
            <span>H{getH(h)}</span>
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>
