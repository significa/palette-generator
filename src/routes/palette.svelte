<script lang="ts">
  import chroma from 'chroma-js';

  import SmallButton from '$components/small-button.svelte';
  import Copy from '$components/icons/copy.svelte';
  import Trash from '$components/icons/trash.svelte';
  import { cn } from '$lib/utils';
  import { getC, getL, getOklch, type OKLCH } from '$lib/color';

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
      <SmallButton>
        <Copy class="opacity-50" width="16px" height="16px" />
        {color}
      </SmallButton>

      <SmallButton>
        <Copy class="opacity-50" width="16px" height="16px" />
        {getOklch(...oklch)}
      </SmallButton>
    </div>
    <div class="flex items-center gap-2">
      <SmallButton>
        <Copy class="opacity-50" width="16px" height="16px" />
        Copy SVG
      </SmallButton>
      <SmallButton>
        <Trash class="opacity-50" width="16px" height="16px" />
        Delete
      </SmallButton>
    </div>
  </div>
  <div class="flex rounded-md mt-2 border border-black/10">
    {#each palette as [l, c, h], i}
      <div
        class={cn(
          'flex-1 h-20 bg-[--square-color]',
          'flex flex-col gap-0.5 items-center justify-center font-mono text-[10px]',
          i === 0 && 'rounded-l-md',
          i === palette.length - 1 && 'rounded-r-md',
          oklch[0] === l && 'scale-110 rounded-md shadow-lg border',
          l >= 0.77 ? 'border-black/10 text-black/50' : 'border-white/10 text-white/50'
        )}
        style="--square-color: {getOklch(l, c, h)}"
      >
        <span>{i + 1}</span>
        <span>L{getL(l)}</span>
        <span>C{getC(c)}</span>
      </div>
    {/each}
  </div>
</div>
