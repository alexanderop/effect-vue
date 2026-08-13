<script setup lang="ts">
import { injectRegistry, useAtomValue } from '@effect/atom-vue'
import { priceAtom } from './atoms'

const price = useAtomValue(() => priceAtom)

const registry = injectRegistry()
</script>

<template>
  <div>
    <div class="value" :class="{ muted: price.waiting }">
      {{ price._tag === 'Success' ? `$${price.value}` : '—' }}
    </div>

    <div class="actions">
      <button :disabled="price.waiting" @click="registry.refresh(priceAtom)">
        {{ price.waiting ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>
  </div>
</template>
