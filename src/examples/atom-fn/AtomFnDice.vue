<script setup lang="ts">
import { computed } from 'vue'
import { useAtomValue } from '@effect/atom-vue'
import { rollDiceAtom } from './atoms'

const result = useAtomValue(() => rollDiceAtom)
const glyphs = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const
const rolls = computed(() => (result.value._tag === 'Success' ? result.value.value : []))
</script>

<template>
  <div v-if="result._tag === 'Success'" class="value dice-row">
    <span v-for="(roll, index) in rolls" :key="index" class="die">{{ glyphs[roll - 1] }}</span>
  </div>
  <div v-else-if="result._tag === 'Failure'" class="value error">
    Error: {{ String(result.cause) }}
  </div>
  <div v-else class="value small muted">Press reroll</div>
</template>
