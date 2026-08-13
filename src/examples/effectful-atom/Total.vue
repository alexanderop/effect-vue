<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { totalAtom } from './atoms'

const total = useAtomValue(() => totalAtom)
</script>

<template>
  <div v-if="total._tag === 'Success'" class="value" :class="{ waiting: total.waiting }">
    Total: {{ total.value }}
  </div>
  <div v-else-if="total._tag === 'Failure'" class="value error">Error calculating total</div>
  <div v-else class="value small muted">Waiting...</div>
</template>
