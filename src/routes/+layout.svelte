<script lang="ts">
  import { Toaster } from '@significa/svelte-toaster';

  import '../app.css';
  import { toaster } from '$lib/toaster';
  import Toast from '$components/toast.svelte';
</script>

<svelte:head>
  <title>Palette Generator | Significa</title>
</svelte:head>

<Toaster {toaster} let:toast>
  <Toast {toast} />
</Toaster>

<slot />
