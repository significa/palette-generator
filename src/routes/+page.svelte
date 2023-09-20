<script lang="ts">
  import Input from '$lib/input.svelte';
  import { slide } from 'svelte/transition';
  import Button from '$lib/button.svelte';
  import Palette from './palette.svelte';
  import Bear from '$lib/bear.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import SlidersHorizontal from '$lib/icons/sliders-horizontal.svelte';
  import PaletteIcon from '$lib/icons/palette.svelte';
  import chroma from 'chroma-js';

  let scales = 16;
  let saturationStep = 10;
  let color = '';

  $: colors = $page.url.searchParams.getAll('color').filter((v) => chroma.valid(v));
</script>

<main class="mx-auto flex gap-2 h-screen">
  <div class="w-80 bg-white rounded-xl border flex flex-col gap-2 overflow-auto shadow-sm m-2 mr-0">
    <header class="border-b px-4 py-2">
      <h1 class="flex items-center gap-1">
        <PaletteIcon width="20px" height="20px" />
        Protocol Colorizer
      </h1>
    </header>

    <form
      class="px-4 py-2 flex-1 flex flex-col gap-2"
      on:submit={(e) => {
        e.preventDefault();

        if (!color) return;

        const params = $page.url.searchParams;
        params.append('color', color);

        // assign variables
        colors = params.getAll('color');
        color = '';

        // save in URL
        goto($page.url.pathname + '?' + params.toString());
      }}
    >
      <div>
        <label for="color" class="block mb-1 text-sm">Base color</label>
        <Input id="color" bind:value={color} placeholder="Type your color" />
      </div>
      <Button type="submit">Create palette</Button>
    </form>

    <footer class="border-t p-4">
      <h3 class="text-sm flex items-center gap-1 text-gray-500 mb-3">
        <SlidersHorizontal width="16px" height="16px" />
        Configuration
      </h3>
      <div transition:slide>
        <div class="flex flex-col gap-3">
          <div>
            <label for="saturation-step" class="block mb-1 text-sm">
              Saturation step:
              <span class="tabular-nums font-mono opacity-50">{saturationStep}</span>
            </label>
            <Input
              id="saturation-step"
              type="number"
              bind:value={saturationStep}
              step={10}
              min={0}
              max={100}
            />
          </div>
          <div>
            <label for="scales" class="block mb-1 text-sm">
              Scales:
              <span class="tabular-nums font-mono opacity-50">{scales}</span>
            </label>
            <Input id="scales" type="number" bind:value={scales} step={1} min={8} max={20} />
          </div>
        </div>
      </div>
    </footer>
  </div>

  <div class="flex-1 overflow-auto flex flex-col gap-2 p-2 pl-0">
    {#each colors as c}
      <Palette color={c} scales={+scales} saturationStep={+saturationStep} />
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <div class="text-center flex flex-col items-center">
          <div class="text-gray-200 w-48 -ml-6">
            <Bear />
          </div>
          <p>Here's a polar bear in the snow</p>
          <p class="text-gray-500">Start by adding a base color on the sidebar</p>
        </div>
      </div>
    {/each}
  </div>
</main>
