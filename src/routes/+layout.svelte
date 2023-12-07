<script lang="ts">
  import { Toaster } from '@significa/svelte-toaster';

  import '../app.css';
  import { toaster } from '$lib/toaster';
  import Toast from '$components/toast.svelte';
</script>

<svelte:head>
  <title>Palette Generator | Significa</title>
</svelte:head>

<!-- Toast fixed while occupying screen is preventing X-axis scroll events from being triggered. -->
<Toaster {toaster} let:toast class='overflow-visible pointer-events-none inset-auto bottom-[10px] h-1 inset-x-1'>
  <Toast {toast} />
</Toaster>

<slot />
