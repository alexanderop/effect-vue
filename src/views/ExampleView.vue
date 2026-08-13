<script setup lang="ts">
import { AtomRegistry, registryKey } from '@effect/atom-vue'
import { computed, onUnmounted, provide } from 'vue'

import { getExample } from '@/examples/registry'

const props = defineProps<{ slug: string }>()

const example = computed(() => getExample(props.slug))
const registry = AtomRegistry.make()

provide(registryKey, registry)
onUnmounted(() => registry.dispose())
</script>

<template>
  <article v-if="example" class="example-page">
    <header class="example-intro">
      <span class="eyebrow">Interactive example</span>
      <p>{{ example.blurb }}</p>
    </header>

    <div class="panels">
      <section
        v-for="panel in example.components"
        :key="panel.name"
        class="panel"
        :aria-label="panel.label"
      >
        <header class="panel-head">
          <span>{{ panel.label }}</span>
          <span v-if="panel.writable" class="panel-status">WRITABLE</span>
        </header>
        <div class="panel-body">
          <component :is="panel.component" />
        </div>
      </section>
    </div>
  </article>
</template>
