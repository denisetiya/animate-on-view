<!--
  @copyright 2025 denisetiya
  @license MIT
-->

<script lang="ts">
    import AnimateOnView from './AnimateOnView.svelte';
    import type { AnimateOnViewProps } from '../types';
  
    let props: AnimateOnViewProps & { children?: any } = $props();
  </script>
  
  <AnimateOnView {...props}>
    <p>
      {@render props.children?.()}
    </p>
  </AnimateOnView>