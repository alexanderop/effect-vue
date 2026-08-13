<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { weatherAtom } from './atoms'

const weather = useAtomValue(() => weatherAtom)
</script>

<template>
  <div>
    <template v-if="weather._tag === 'Success'">
      <div class="value" :style="{ opacity: weather.waiting ? 0.35 : 1 }">
        {{ weather.value.current.temperature_2m }}°C
      </div>
      <div class="row">
        <span class="label">humidity</span>
        <span>{{ weather.value.current.relative_humidity_2m }}%</span>
      </div>
    </template>

    <div v-else-if="weather._tag === 'Failure'" class="value error">
      The forecast did not arrive.
    </div>
    <div v-else class="value muted small">Loading…</div>

    <div class="hint">Live data from open-meteo.com, decoded with a Schema.</div>
  </div>
</template>
