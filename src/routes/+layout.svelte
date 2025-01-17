<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { ModeWatcher } from 'mode-watcher';
  import '../app.postcss';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <script
    defer
    data-domain="root.pilleye.dev"
    src="https://plausible.pillai.io/js/script.js"
  ></script>
  <title>Root Calculator</title>
</svelte:head>
<ModeWatcher />
<div class="flex flex-col min-h-screen items-stretch">
  <div class="block flex-grow">
    {@render children?.()}
  </div>
  <footer class="text-end px-4 mt-4 tracking-tight text-xs">
    made with <Button href="https://kit.svelte.dev/" variant="link" class="p-0 text-xs"
      >sveltekit</Button
    > by
    <Button href="https://pilleye.dev" variant="link" class="p-0 text-xs">aditya</Button>
  </footer>
</div>
