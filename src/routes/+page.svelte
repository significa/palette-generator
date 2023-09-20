<script lang="ts">
  import chroma from 'chroma-js';
  import { slide } from 'svelte/transition';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  import { DEFAULT } from '$lib/constants';
  import { generatePalette } from '$lib/color';
  import { getColorsFromParams, getConfigFromParams, getParamsFromConfig } from '$lib/params';
  import { cn } from '$lib/utils';

  import Input from '$components/input.svelte';
  import Button from '$components/button.svelte';
  import Bear from '$components/bear.svelte';
  import SlidersHorizontal from '$components/icons/sliders-horizontal.svelte';
  import PaletteIcon from '$components/icons/palette.svelte';

  import ConfigurationField from './configuration-field.svelte';
  import Palette from './palette.svelte';

  const config = getConfigFromParams($page.url.searchParams);

  let color = '';
  let invalid = false;

  let scales = config.scales;
  let chromaStep = config.chromaStep;
  let chromaMinimum = config.chromaMinimum;

  let colors = config.colors;

  $: if (browser) {
    const params = getParamsFromConfig({ colors, scales, chromaStep, chromaMinimum });

    goto(`?${params}`, { replaceState: true, keepFocus: true });
  }
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

        if (!color) return;

        if (!chroma.valid(color)) {
          invalid = true;
          return;
        }

        // assign variables
        colors = [color, ...getColorsFromParams($page.url.searchParams)];
        color = '';
      }}
    >
      <div>
        <label for="color" class="block mb-1 text-sm">Base color</label>
        <Input
          autocomplete="off"
          on:focus={() => (invalid = false)}
          class={cn(invalid && 'border-pink-300')}
          id="color"
          bind:value={color}
          placeholder="Type your color"
        />
        {#if invalid}
          <span class="text-pink-500 text-xs">Invalid color</span>
        {/if}
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
          <ConfigurationField
            id="scales"
            label="Scales"
            description="The amount of scales to generate"
            value={scales}
            on:reset={() => {
              scales = DEFAULT.scales;
            }}
          >
            <Input id="scales" type="number" bind:value={scales} step={1} min={8} max={20} />
          </ConfigurationField>

          <ConfigurationField
            id="chroma-step"
            label="Saturation step"
            description="The amount of saturation that reduces as we go further from the base color"
            value={chromaStep}
            on:reset={() => {
              chromaStep = DEFAULT.chromaStep;
            }}
          >
            <Input
              id="chroma-step"
              type="number"
              bind:value={chromaStep}
              step={0.001}
              min={0}
              max={0.1}
            />
          </ConfigurationField>

          <ConfigurationField
            id="chroma-min"
            label="Minimum saturation"
            description="The minimum amount of saturation allowed. The base color's saturation will be used instead if
          it's below this value."
            value={chromaMinimum}
            on:reset={() => {
              chromaMinimum = DEFAULT.chromaMinimum;
            }}
          >
            <Input
              id="chroma-min"
              type="number"
              bind:value={chromaMinimum}
              step={0.001}
              min={0}
              max={0.1}
            />
          </ConfigurationField>
        </div>
      </div>
    </footer>
  </div>

  <div class="flex-1 overflow-auto flex flex-col gap-2 p-2 pl-0">
    {#each colors as c}
      <Palette
        color={c}
        palette={generatePalette(c, { scales, chromaStep, chromaMinimum })}
        on:delete={(event) => {
          colors = colors.filter((c) => c !== event.detail);
        }}
      />
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
