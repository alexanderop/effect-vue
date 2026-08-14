<script setup lang="ts">
import { injectRegistry, useAtomValue, type AsyncResult, type Atom } from '@effect/atom-vue'
import type { Snapshot } from './atoms'

// The atom arrives as a prop, which is exactly why `useAtomValue` takes a thunk:
// the subscription follows the prop instead of being pinned at setup time.
const props = defineProps<{
  /** Distinguishes this panel's stats from the other one's. */
  name: string
  atom: Atom.Atom<AsyncResult.AsyncResult<Snapshot>>
}>()

const status = useAtomValue(() => props.atom)

const registry = injectRegistry()
</script>

<template>
  <div>
    <div class="stats">
      <div role="group" :aria-label="`${props.name} loads`">
        <span>Loads</span>
        <strong>{{ status._tag === 'Success' ? status.value.load : '—' }}</strong>
      </div>
      <div role="group" :aria-label="`${props.name} unread`">
        <span>Unread</span>
        <strong>{{ status._tag === 'Success' ? status.value.unread : '—' }}</strong>
      </div>
    </div>

    <div class="actions">
      <button :disabled="status.waiting" @click="registry.refresh(props.atom)">
        {{ status.waiting ? 'Loading…' : 'Refresh' }}
      </button>
    </div>

    <p class="hint">
      <slot />
    </p>
  </div>
</template>
