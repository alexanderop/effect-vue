<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { ticksAtom } from './atoms'

const ticks = useAtomValue(() => ticksAtom)
</script>

<template>
  <div>
    <div class="value">{{ ticks._tag === 'Success' ? ticks.value : '—' }}</div>

    <div class="hint">Emissions from the Stream, one every 300ms.</div>
  </div>
</template>
