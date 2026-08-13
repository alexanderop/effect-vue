<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { doubledAtom } from './atoms'

// This component never touches `countAtom`, and re-renders only because the
// value it reads changed.
const doubled = useAtomValue(() => doubledAtom)
</script>

<template>
  <div class="value">{{ doubled }}</div>
</template>
