<script setup lang="ts">
import { AtomRegistry, registryKey } from '@effect/atom-vue'
import { computed, onUnmounted, provide } from 'vue'

import { getExample } from '@/examples/registry'

const props = defineProps<{ slug: string }>()

const example = computed(() => getExample(props.slug))

// Every routed page owns its registry, so navigating away disposes the atoms
// this example mounted. Without this, everything would fall back to the
// module-level defaultRegistry and leak state between examples.
const registry = AtomRegistry.make()

provide(registryKey, registry)
onUnmounted(() => registry.dispose())
</script>

<template>
  <article v-if="example" class="example-page">
    <header class="example-intro">
      <span class="eyebrow">Interactive example</span>
      <p>{{ example.blurb }}</p>

      <ul class="api-list">
        <li v-for="name in example.api" :key="name">{{ name }}</li>
      </ul>
    </header>

    <component :is="example.component" />

    <section class="example-notes" aria-label="Notes">
      <div class="note">
        <h2>In Effect</h2>
        <p>{{ example.effectNote }}</p>
      </div>

      <div class="note">
        <h2>In Vue</h2>
        <p>{{ example.vueNote }}</p>
      </div>
    </section>
  </article>
</template>
