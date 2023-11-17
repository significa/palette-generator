<script lang="ts">
  import { createPopover } from '@melt-ui/svelte';
  import { smallButton } from './small-button.svelte';
  import { fly } from 'svelte/transition';
  import { cn, resizeNumberArray } from '$lib/utils';
  import { circOut } from 'svelte/easing';

  export let curve: number[];

  let height = 100;
  let width = 20;

  const {
    elements: { trigger, content },
    states: { open }
  } = createPopover({
    forceVisible: true,
    positioning: {
      placement: 'right-start',
      overlap: true,
      fitViewport: true,
      strategy: 'fixed'
    }
  });

  $: labels = resizeNumberArray(curve, 3);
</script>

<button
  {...$trigger}
  use:trigger
  class="relative group rounded-md border shadow-sm outline-none focus-visible:ring-4 ring-black/5 transition-all w-full"
>
  <div
    class="flex items-center justify-between gap-1 text-[10px] tabular-nums opacity-50 p-1 mb-2 border-b"
  >
    {#each labels as point}
      <span>{point.toFixed(2)}</span>
    {/each}
  </div>
  <div class="p-2">
    <svg viewBox="0 0 {height} {width}" class="w-full overflow-visible">
      <!-- Add circles at each point along the curve -->
      {#each curve as point, index}
        <line
          x1={index * (height / (curve.length - 1))}
          y1={width - point * width}
          x2={index * (height / (curve.length - 1)) + 0.001}
          y2={width - point * width + 0.001}
          stroke-width="6"
          stroke="black"
          vector-effect="non-scaling-stroke"
          style="stroke-linecap: round;"
        />
      {/each}

      <!-- Connect the circles with lines to form the curve -->
      <path
        vector-effect="non-scaling-stroke"
        d={`
          M 0 ${width - curve[0] * width}
          ${curve
            .map((point, index) => {
              if (index === 0) return '';
              return `L ${index * (height / (curve.length - 1))} ${width - point * width}`;
            })
            .join(' ')}
        `}
        fill="none"
        stroke="black"
        stroke-width="2"
      />
    </svg>
  </div>
  <div
    class={cn(
      'absolute z-40 inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex items-center justify-center bg-black/5',
      $open && 'opacity-100'
    )}
  >
    <div class={cn(smallButton, 'group-hover:border-gray-300 group-active:bg-gray-50')}>Edit</div>
  </div>
</button>

<!-- Popover -->
{#if $open}
  <div
    {...$content}
    use:content
    in:fly={{ x: -10, duration: 200, opacity: 0, easing: circOut }}
    out:fly={{ x: 10, duration: 100, opacity: 0, easing: circOut }}
    class="absolute z-50"
  >
    <slot />
  </div>
{/if}
