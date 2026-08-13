<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { elapsedAtom } from './atoms'

// Deriving from an async atom is the same as deriving from any other atom.
const elapsed = useAtomValue(() => elapsedAtom)
</script>

<template>
  <div class="value">{{ elapsed }}s</div>
</template>
