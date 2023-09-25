<script lang="ts">
  import { createSlider } from '@melt-ui/svelte';
  import { writable } from 'svelte/store';

  export let value: number;

  const store = writable([value]);
  store.subscribe((val) => {
    value = val[0];
  });
  $: store.set([value]);

  const {
    elements: { root, range, thumb }
  } = createSlider({
    value: store,
    min: 0,
    max: 1,
    step: 0.01,
    orientation: 'vertical'
  });
</script>

<div class="w-6 flex justify-center group">
  <span {...$root} use:root class="relative flex h-[100px] w-1 flex-col items-center">
    <span class="block h-[100px] w-full bg-white/10 rounded-sm">
      <span {...$range} use:range class="w-full bg-white rounded-sm" />
    </span>
    <span
      {...$thumb()}
      use:thumb
      class="block h-2 w-2 rounded-full bg-white focus:ring-4 focus:ring-white/30 outline-none border-white border-2 shadow-md group-hover:h-3 group-hover:w-3 transition-[height,width]"
    />
  </span>
</div>
