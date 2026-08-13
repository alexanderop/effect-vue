<script setup lang="ts">
import { useAtom, useAtomValue } from '@effect/atom-vue'
import { rateAtom, suspendOnWaitingAtom } from './atoms'

const rate = useAtomValue(() => rateAtom)
const [suspendOnWaiting, setSuspendOnWaiting] = useAtom(() => suspendOnWaitingAtom)
</script>

<template>
  <div>
    <div v-if="rate._tag === 'Success'" class="value" :style="{ opacity: rate.waiting ? 0.35 : 1 }">
      {{ rate.value }}
    </div>
    <div v-else class="value muted small">Loading…</div>

    <div class="row">
      <span class="label">books per year</span>
      <span>{{ suspendOnWaiting ? 'suspends on waiting' : 'uses stale values' }}</span>
    </div>

    <div class="actions">
      <button @click="setSuspendOnWaiting((s) => !s)">Toggle suspendOnWaiting</button>
    </div>

    <div class="hint">
      Switch author and watch this panel. Suspending, it waits for both lookups. Not suspending, it
      recomputes as soon as the fast one lands — with the slow one's previous value.
    </div>
  </div>
</template>
