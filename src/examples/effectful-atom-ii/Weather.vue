<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { weatherAtom } from './atoms'

const weather = useAtomValue(() => weatherAtom)
</script>

<template>
  <div v-if="weather._tag === 'Success'" :class="{ waiting: weather.waiting }">
    <div class="value">{{ weather.value.current.temperature_2m }}°C</div>
    <div class="row">
      <span>{{ weather.value.current.relative_humidity_2m }}% humidity</span>
    </div>
  </div>
  <div v-else-if="weather._tag === 'Failure'" class="value error">
    Error: {{ String(weather.cause) }}
  </div>
  <div v-else class="value small muted">Loading...</div>
</template>
