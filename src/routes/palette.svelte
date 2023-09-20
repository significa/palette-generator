<script lang="ts">
  import chroma from 'chroma-js';

  import SmallButton from '$lib/small-button.svelte';
  import Copy from '$lib/icons/copy.svelte';
  import Trash from '$lib/icons/trash.svelte';
  import { cn } from '$lib/utils';

  export let color: string;
  export let scales: number;
  export let saturationStep: number;

  $: [l, c, h] = chroma(color).oklch();
  $: step = 1 / scales; // how much to increment l by on each step
  $: index = Math.floor(l / step); // index of the current color

  // an offset to make sure we hit the exact color at the base color step
  $: lOffset = l - step * index;

  $: arr = Array.from(Array(scales)).map((_, i) => {
    const newL = lOffset + step * i;
    return [newL, c, h];
  });

  const getL = (l: number) => +(l * 100).toFixed(2) + '%';
  const getC = (c: number) => +c.toFixed(3);
  const getH = (h: number) => +(h || 0).toFixed(2);
  const getOklch = (l: number, c: number, h: number) => {
    return `oklch(${getL(l)} ${getC(c)} ${getH(h)})`;
  };
</script>

<div class="p-2 bg-white border rounded-xl shadow-sm">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div
        class="border border-black/10 rounded-md w-6 h-6"
        style="background-color: {getOklch(l, c, h)};"
      />
      <SmallButton>
        <Copy class="opacity-50" width="16px" height="16px" />
        {color}
      </SmallButton>

      <SmallButton>
        <Copy class="opacity-50" width="16px" height="16px" />
        {getOklch(l, c, h)}
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
    {#each arr as [l, c, h], i}
      <div
        class={cn(
          'flex-1 h-20 bg-[--square-color]',
          'flex flex-col gap-0.5 items-center justify-center font-mono text-[10px]',
          i === 0 && 'rounded-l-md',
          i === scales - 1 && 'rounded-r-md',
          i === index && 'scale-110 rounded-md shadow-lg border',
          l >= 0.77 ? 'border-black/10 text-black/50' : 'border-white/10 text-white/50'
        )}
        style="--square-color: {getOklch(l, c, h)}"
      >
        <span>{getL(l)}</span>
      </div>
    {/each}
  </div>
</div>
