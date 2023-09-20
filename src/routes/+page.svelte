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

  let scales = 12;
  let chromaStep = 0.03;
  let minChroma = 0.05;
  let color = '';

  $: colors = $page.url.searchParams.getAll('color').filter((v) => chroma.valid(v));
</script>

<main class="mx-auto flex gap-2 h-screen">
  <div class="w-80 bg-white rounded-xl border flex flex-col gap-2 overflow-auto shadow-sm m-2 mr-0">
    <header class="border-b px-4 py-2">
      <h1 class="flex items-center gap-1">
        <PaletteIcon width="20px" height="20px" />
        Palette generator
      </h1>
    </header>

    <form
      class="px-4 py-2 flex-1"
      on:submit={(e) => {
        e.preventDefault();

        if (!color || !chroma.valid(color)) return;

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
      <Button class="mt-2 w-full" type="submit">Create palette</Button>
      <span class="block mt-2 text-xs text-gray-400"
        >Type a valid color in any format to generate a monochromatic palette. It will range from
        dark to light with the saturation decreasing as it moves away from the base color.</span
      >
    </form>

    <footer class="border-t p-4">
      <h3 class="text-sm flex items-center gap-1 text-gray-500 mb-3">
        <SlidersHorizontal width="16px" height="16px" />
        Configuration
      </h3>
      <div transition:slide>
        <div class="flex flex-col gap-3">
          <div>
            <label for="scales" class="block mb-1 text-sm">
              Scales:
              <span class="tabular-nums font-mono opacity-50">{scales}</span>
            </label>
            <Input id="scales" type="number" bind:value={scales} step={1} min={8} max={20} />
            <span class="block mt-2 text-xs text-gray-400">The amount of scales to generate</span>
          </div>
          <div>
            <label for="chroma-step" class="block mb-1 text-sm">
              Chroma step:
              <span class="tabular-nums font-mono opacity-50">{chromaStep}</span>
            </label>
            <Input
              id="chroma-step"
              type="number"
              bind:value={chromaStep}
              step={0.001}
              min={0}
              max={0.1}
            />
            <span class="block mt-2 text-xs text-gray-400"
              >The amount of chroma that reduces as we go further from the base color</span
            >
          </div>
          <div>
            <label for="min-chroma" class="block mb-1 text-sm">
              Minimum chroma:
              <span class="tabular-nums font-mono opacity-50">{minChroma}</span>
            </label>
            <Input
              id="min-chroma"
              type="number"
              bind:value={minChroma}
              step={0.001}
              min={0}
              max={0.1}
            />
            <span class="block mt-2 text-xs text-gray-400"
              >The minimum amount of chroma allowed. The base color's chroma will be used instead if
              it's below this value.</span
            >
          </div>
        </div>
      </div>
    </footer>
  </div>

  <div class="flex-1 overflow-auto flex flex-col gap-2 p-2 pl-0">
    {#each colors as c}
      <Palette color={c} scales={+scales} chromaStep={+chromaStep} minChroma={+minChroma} />
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <div class="text-center flex flex-col items-center">
          <div class="text-gray-200 w-48 -ml-4">
            <Bear />
          </div>
          <p>It's so white</p>
          <p class="text-gray-500">Here's a polar bear in the snow</p>
        </div>
      </div>
    {/each}
  </div>
</main>
