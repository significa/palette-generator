<script lang="ts">
  import { Toaster } from '@significa/svelte-toaster';

  import '../app.css';
  import { toaster } from '$lib/toaster';
  import Toast from '$components/toast.svelte';
  import { page } from '$app/stores';
</script>

<svelte:head>
  <link rel="canonical" href="https://palette-generator.significa.co/" />

  <title>Palette generator by Significa</title>

  <meta
    name="description"
    content="Create stunning, balanced colour palettes for free with Significa’s Palette Generator — an intuitive tool for designers seeking the perfect hues for any project."
  />

  <meta property="og:title" content="Palette generator by Significa" />

  <meta
    property="og:description"
    content="Create stunning, balanced colour palettes for free with Significa’s Palette Generator — an intuitive tool for designers seeking the perfect hues for any project."
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="Palette generator by Significa" />

  <meta
    property="twitter:title"
    content="Create stunning, balanced colour palettes for free with Significa’s Palette Generator — an intuitive tool for designers seeking the perfect hues for any project."
  />

  <meta
    property="twitter:description"
    content="Create stunning, balanced colour palettes for free with Significa’s Palette Generator — an intuitive tool for designers seeking the perfect hues for any project."
  />

  <meta property="og:url" content={$page.url.toString()} />
  <meta property="og:type" content="website" />

  <meta property="og:image" content="{$page.url.origin}/og.png" />
  <meta property="twitter:image" content="{$page.url.origin}/og.png" />

  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
</svelte:head>

<Toaster {toaster} let:toast>
  <Toast {toast} />
</Toaster>

<slot />
