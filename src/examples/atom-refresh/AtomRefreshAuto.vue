<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { autoPriceAtom } from './atoms'

const price = useAtomValue(() => autoPriceAtom)
</script>

<template>
  <div>
    <div class="value" :class="{ muted: price.waiting }">
      {{ price._tag === 'Success' ? `$${price.value}` : '—' }}
    </div>

    <div class="hint">Refetches every 3s. The old price stays visible while it does.</div>
  </div>
</template>
