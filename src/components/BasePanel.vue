<script setup lang="ts">
/**
 * One framed panel inside an example.
 *
 * The `label` becomes the accessible name of a `region`, which is how both the
 * browser tests and a screen reader find it. Keep it in natural sentence case —
 * `.panel-head` handles the uppercase styling.
 */
defineProps<{
  label: string
  writable?: boolean
}>()
</script>

<template>
  <section class="panel" :aria-label="label">
    <header class="panel-head">
      <span>{{ label }}</span>
      <span v-if="writable" class="panel-status">WRITABLE</span>
    </header>
    <div class="panel-body">
      <slot />
    </div>
  </section>
</template>
