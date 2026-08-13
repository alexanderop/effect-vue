<script setup lang="ts">
import { computed } from 'vue'
import { useAtomValue } from '@effect/atom-vue'
import { diceAtom } from './atoms'

const dice = useAtomValue(() => diceAtom)
const glyphs = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const
const rolls = computed(() => (dice.value._tag === 'Success' ? dice.value.value : []))
</script>

<template>
  <div>
    <div v-if="dice._tag === 'Success'" class="value dice-row" :class="{ waiting: dice.waiting }">
      <span v-for="(roll, index) in rolls" :key="index" class="die">{{ glyphs[roll - 1] }}</span>
    </div>
    <div v-else-if="dice._tag === 'Failure'" class="value error">Error rolling dice</div>
    <div v-else class="value small muted">Ready to roll...</div>
  </div>
</template>
