<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { doubledAtom } from './atoms'

const doubled = useAtomValue(() => doubledAtom)
</script>

<template>
  <div class="value">{{ doubled }}</div>
</template>
