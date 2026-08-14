<script setup lang="ts">
import { injectRegistry, useAtomValue } from '@effect/atom-vue'
import { userAtom } from './atoms'

const user = useAtomValue(() => userAtom)

// There is no `useAtomRefresh` in the Vue bindings — reach for the registry.
const registry = injectRegistry()
const refetch = () => registry.refresh(userAtom)
</script>

<template>
  <div>
    <div v-if="user._tag === 'Success'" class="value small">
      {{ user.value.name }} · {{ user.value.commits }} commits
    </div>
    <div v-else class="value small muted">Loading…</div>

    <div class="actions">
      <button :disabled="user.waiting" @click="refetch">
        {{ user.waiting ? 'Fetching…' : 'Refetch' }}
      </button>
    </div>
  </div>
</template>
