<script setup lang="ts">
import { useAtom, useAtomValue } from '@effect/atom-vue'
import { booksPerYearAtom, suspendOnWaitingAtom } from './atoms'

const result = useAtomValue(() => booksPerYearAtom)
const [suspendOnWaiting, setSuspendOnWaiting] = useAtom(() => suspendOnWaitingAtom)
</script>

<template>
  <div>
    <div v-if="result._tag === 'Success'" class="value small" :class="{ waiting: result.waiting }">
      📈 {{ result.value }} books/year
    </div>
    <div v-else-if="result._tag === 'Failure'" class="value error">
      Error: {{ String(result.cause) }}
    </div>
    <div v-else class="value small muted">Loading...</div>
    <div class="actions standalone">
      <button @click="setSuspendOnWaiting(!suspendOnWaiting)">
        {{ suspendOnWaiting ? 'Suspending' : 'Suspend' }} on Waiting
      </button>
    </div>
  </div>
</template>
