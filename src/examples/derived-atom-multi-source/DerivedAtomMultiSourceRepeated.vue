<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { repeatedAtom } from './atoms'

// One subscription, two upstream atoms. Neither of them is named here.
const repeated = useAtomValue(() => repeatedAtom)
</script>

<template>
  <div class="value small">{{ repeated }}</div>
</template>
