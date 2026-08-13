<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { totalAtom } from './atoms'

// This component never sees the Effect, only the AsyncResult the mapping produced.
const total = useAtomValue(() => totalAtom)
</script>

<template>
  <div v-if="total._tag === 'Success'" class="value" :style="{ opacity: total.waiting ? 0.35 : 1 }">
    {{ total.value }}
  </div>
  <div v-else class="value muted small">Waiting…</div>
</template>
