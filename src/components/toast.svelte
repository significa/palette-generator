<script lang="ts">
  import { scale } from 'svelte/transition';
  import { circOut } from 'svelte/easing';
  import type { Toast } from '@significa/svelte-toaster';

  import { cn } from '$lib/utils';
  import type { ToastType } from '$lib/toaster';
  import Check from './icons/check.svelte';
  import Cross from './icons/cross.svelte';

  export let toast: Toast<ToastType>;
</script>

<div class="text-sm bg-black text-white p-2 rounded-lg shadow-xl flex items-center gap-2">
  <div
    class={cn(
      'w-4 h-4 rounded-full flex items-center justify-center text-black',
      toast.data.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    )}
    transition:scale={{ delay: 100, easing: circOut, duration: 200 }}
  >
    {#if toast.data.type === 'success'}
      <Check width="14px" height="14px" />
    {:else}
      <Cross width="14px" height="14px" />
    {/if}
  </div>
  {toast.data.message}
</div>
