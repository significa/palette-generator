<script lang="ts">
  import chroma from 'chroma-js';
  import { slide } from 'svelte/transition';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  import { DEFAULT } from '$lib/constants';
  import { generatePalette, type Override } from '$lib/color';
  import { getColorsFromParams, getConfigFromParams, getParamsFromConfig } from '$lib/params';
  import { cn } from '$lib/utils';

  import Input from '$components/input.svelte';
  import Button from '$components/button.svelte';
  import Bear from '$components/bear.svelte';
  import SlidersHorizontal from '$components/icons/sliders-horizontal.svelte';
  import Crosshair from '$components/icons/crosshair.svelte';
  import PaletteIcon from '$components/icons/palette.svelte';
  import ConfigurationField from '$components/configuration-field.svelte';
  import Palette from '$components/palette.svelte';
  import Plus from '$components/icons/plus.svelte';
  import SmallButton from '$components/small-button.svelte';
  import RepeatableRow from '$components/repeatable-row.svelte';
  import Pencil from '$components/icons/pencil.svelte';
  import Curve from '$components/curve.svelte';
  import EditCurvePanel from '$components/edit-curve-panel.svelte';
  import MinimalButton from '$components/minimal-button.svelte';
  import Reset from '$components/icons/reset.svelte';

  const config = getConfigFromParams($page.url.searchParams);

  let color = '';
  let invalid = false;

  let colors = config.colors;

  let scales = config.scales;
  let chromaStep = config.chromaStep;
  let chromaMinimum = config.chromaMinimum;
  let overrides: Override[] = config.overrides;
  let curve = config.curve;

  $: if (browser) {
    const params = getParamsFromConfig({
      colors,
      scales,
      chromaStep,
      chromaMinimum,
      overrides,
      curve
    });

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
        invalid = false;
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

    <div class="border-t p-4">
      <h3 class="text-sm flex items-center gap-1 text-gray-500 mb-3">
        <SlidersHorizontal width="15px" height="15px" />
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
    </div>

    <!-- Curve -->
    <div class="border-t p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm flex items-center gap-1 text-gray-500">
          <Pencil width="15px" height="15px" />
          Curve
        </h3>
        <MinimalButton
          aria-label="Reset curve"
          on:click={() => {
            curve = [...DEFAULT.curve];
          }}
        >
          <Reset />
        </MinimalButton>
      </div>

      <div class="mt-3">
        <Curve {curve}>
          <EditCurvePanel
            bind:curve
            on:create={() => {
              curve = [...curve, curve[curve.length - 1] ?? 1];
            }}
            on:delete={(event) => {
              curve = curve.filter((_, index) => index !== event.detail);
            }}
          />
        </Curve>
      </div>

      <span class="block mt-4 text-xs text-gray-400"
        >You can create your own lightness curve. The numbers between steps will be interpolated
        linearly. A shift will be applied to make sure your base color remains unchanged.</span
      >
    </div>

    <!-- Overrides -->
    <div class="border-t p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm flex items-center gap-1 text-gray-500">
          <Crosshair width="15px" height="15px" />
          Overrides
        </h3>
        <SmallButton
          aria-label="Add override"
          on:click={() => {
            overrides = [...overrides, {}];
          }}
        >
          <Plus />
        </SmallButton>
      </div>

      {#each overrides as override, i}
        <RepeatableRow
          label="Override {i + 1}"
          on:delete={() => {
            overrides = overrides.filter((_, index) => index !== i);
          }}
        >
          <Input type="number" placeholder="Scale" bind:value={override.scale} min={0} max={99} />
          <Input
            type="number"
            placeholder="C"
            bind:value={override.chroma}
            step={0.001}
            min={0}
            max={0.37}
          />
          <Input
            type="number"
            placeholder="L"
            bind:value={override.lightness}
            step={0.01}
            min={0}
            max={1}
          />
        </RepeatableRow>
      {/each}

      <span class="block mt-4 text-xs text-gray-400"
        >You can add chroma and lightness overrides to specific scales. It will never affect the
        base color. If the chroma override is greater than the original, it will not be applied.</span
      >
    </div>
  </div>

  <div class="flex-1 overflow-auto flex flex-col gap-2 p-2 pl-0">
    {#each colors as c}
      {@const result = generatePalette(c, { scales, chromaStep, chromaMinimum, overrides, curve })}
      {#if result.palette && typeof result.index === 'number'}
        <Palette
          color={c}
          palette={result.palette}
          colorIndex={result.index}
          on:delete={(event) => {
            colors = colors.filter((c) => c !== event.detail);
          }}
        />
      {/if}
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <div class="text-center flex flex-col items-center">
          <div class="text-gray-200 w-48 -ml-4">
            <Bear />
          </div>
          <p>It's so white</p>
          <p class="text-gray-500">Here's a polar bear</p>
        </div>
      </div>
    {/each}
  </div>
</main>
