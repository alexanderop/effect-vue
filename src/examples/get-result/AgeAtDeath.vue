<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { ageAtDeathAtom } from './atoms'

const age = useAtomValue(() => ageAtDeathAtom)
</script>

<template>
  <div v-if="age._tag === 'Success'" class="value" :class="{ waiting: age.waiting }">
    👤 {{ age.value }}
  </div>
  <div v-else-if="age._tag === 'Failure'" class="value error">Error: {{ String(age.cause) }}</div>
  <div v-else class="value small muted">Loading...</div>
</template>
