<script setup lang="ts">
import { computed } from 'vue'
import { Option } from 'effect'
import { AsyncResult, injectRegistry, useAtomValue } from '@effect/atom-vue'
import { quoteAtom } from './atoms'

const quote = useAtomValue(() => quoteAtom)

// An AsyncResult is Initial, Success or Failure — plus a `waiting` flag, so a
// stale success can stay on screen while the next run is still in flight.
const text = computed(() =>
  AsyncResult.match(quote.value, {
    onInitial: () => 'Loading…',
    onSuccess: (success) => success.value,
    onFailure: (failure) =>
      AsyncResult.error(failure).pipe(
        Option.map((error) => error.message),
        Option.getOrElse(() => 'Unknown failure'),
      ),
  }),
)

const registry = injectRegistry()
</script>

<template>
  <div>
    <div class="value small" :class="{ error: quote._tag === 'Failure' }">{{ text }}</div>

    <div class="row">
      <span class="label">state</span>
      <span>{{ quote._tag }}{{ quote.waiting ? ' · waiting' : '' }}</span>
    </div>

    <div class="actions">
      <button :disabled="quote.waiting" @click="registry.refresh(quoteAtom)">Try again</button>
    </div>
  </div>
</template>
