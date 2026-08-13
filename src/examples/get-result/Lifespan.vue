<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { lifespanAtom } from './atoms'

// The fast one: 400ms. It settles well before the book count does.
const lifespan = useAtomValue(() => lifespanAtom)
</script>

<template>
  <div
    v-if="lifespan._tag === 'Success'"
    class="value"
    :style="{ opacity: lifespan.waiting ? 0.35 : 1 }"
  >
    {{ lifespan.value }}
  </div>
  <div v-else class="value muted small">Loading…</div>
</template>
