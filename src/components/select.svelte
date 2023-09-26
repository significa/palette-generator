<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils';

  type $$Props = HTMLSelectAttributes;

  let className: $$Props['class'] = undefined;
  export let value: $$Props['value'] = undefined;
  export { className as class };
</script>

<select
  class={cn(
    'chevron',
    'bg-white text-sm flex h-10 w-full rounded-lg border px-3 py-2 shadow-sm transition-all outline-none ring-black/5',
    'focus:ring-4 appearance-none relative',
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
>
  <slot />
</select>

<style>
  .chevron {
    background-image: url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z' fill='currentColor' fill-rule='evenodd' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
  }
</style>
