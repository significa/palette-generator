<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLInputAttributes;

  let className: $$Props['class'] = undefined;
  export let value: $$Props['value'] = undefined;
  export { className as class };
</script>

<input
  class={cn(
    'text-sm flex h-10 w-full rounded-lg border px-3 py-2 shadow-sm transition-all outline-none ring-black/5',
    'focus:ring-4',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
  bind:value
  on:blur
  on:change
  on:click
  on:focus
  on:keydown
  on:keypress
  on:keyup
  on:mouseover
  on:mouseenter
  on:mouseleave
  on:paste
  on:input
  {...$$restProps}
/>
