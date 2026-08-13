<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { diceAtom } from './atoms'

const dice = useAtomValue(() => diceAtom)
</script>

<template>
  <div>
    <!-- `waiting` is true while the next run is in flight, whatever the tag is.
         Dimming instead of unmounting is what keeps the stale value useful. -->
    <div v-if="dice._tag === 'Success'" class="value" :style="{ opacity: dice.waiting ? 0.35 : 1 }">
      {{ dice.value.join(' · ') }}
    </div>
    <div v-else-if="dice._tag === 'Failure'" class="value error">The dice got stuck.</div>
    <div v-else class="value muted small">Rolling…</div>
  </div>
</template>
