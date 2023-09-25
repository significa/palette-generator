<script lang="ts" context="module">
  export const smallButton = cn(
    'inline-flex gap-1 items-center justify-center rounded-lg font-medium ring-offset-background transition-all outline-none ring-black/10 text-xs shadow-sm',
    'focus-visible:ring-4',
    'hover:border-gray-300',
    'active:bg-gray-50',
    'disabled:pointer-events-none disabled:opacity-50',
    'px-2 py-1',
    'bg-white border'
  );
</script>

<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLButtonAttributes;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<button
  class={cn(smallButton, className)}
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
