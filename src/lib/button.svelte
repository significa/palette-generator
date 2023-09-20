<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLButtonAttributes;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<button
  class={cn(
    'text-sm inline-flex items-center justify-center rounded-lg font-medium ring-offset-background transition-all outline-none ring-black/10',
    'focus-visible:ring-4',
    'active:ring-4',
    'disabled:pointer-events-none disabled:opacity-50',
    'h-10 px-4 py-2',
    'bg-black text-white hover:bg-black/90',
    className
  )}
  on:blur
  on:click
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  {...$$restProps}
>
  <slot />
</button>
